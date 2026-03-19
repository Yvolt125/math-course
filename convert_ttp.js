/**
 * TTP JSON → gmat_db_ttp.js
 * Uses a recursive MathML→LaTeX converter for proper math formatting.
 */
'use strict';
const fs   = require('fs');
const path = require('path');
const DIR  = path.join(__dirname, 'additional folder');

// ═══════════════════════════════════════════════════════
//  MathML → LaTeX  (recursive descent)
// ═══════════════════════════════════════════════════════

/** Tokenise an XML string into {type, tag, attrs, selfClose, isClose, text} */
function tokenise(xml) {
  const tokens = [];
  let i = 0;
  while (i < xml.length) {
    if (xml[i] === '<') {
      // Comment / PI
      if (xml.slice(i,i+4) === '<!--') {
        const end = xml.indexOf('-->', i); i = end < 0 ? xml.length : end + 3; continue;
      }
      if (xml.slice(i,i+2) === '<?') {
        const end = xml.indexOf('?>', i); i = end < 0 ? xml.length : end + 2; continue;
      }
      const isClose = xml[i+1] === '/';
      const start = isClose ? i+2 : i+1;
      let j = start;
      while (j < xml.length && xml[j] !== '>' && !/\s/.test(xml[j])) j++;
      const tag = xml.slice(start, j).toLowerCase();
      // Parse attributes
      const attrs = {};
      while (j < xml.length && xml[j] !== '>' && !(xml[j]==='/' && xml[j+1]==='>')) {
        while (j < xml.length && /\s/.test(xml[j])) j++;
        if (xml[j] === '>' || (xml[j]==='/' && xml[j+1]==='>')) break;
        const aStart = j;
        while (j < xml.length && !/[\s=>\/]/.test(xml[j])) j++;
        const aName = xml.slice(aStart, j).toLowerCase();
        while (j < xml.length && /\s/.test(xml[j])) j++;
        if (xml[j] === '=') {
          j++;
          while (j < xml.length && /\s/.test(xml[j])) j++;
          const q = xml[j]; const aValStart = ++j;
          while (j < xml.length && xml[j] !== q) j++;
          attrs[aName] = xml.slice(aValStart, j++);
        }
      }
      const selfClose = xml[j] === '/' && xml[j+1] === '>';
      i = selfClose ? j+2 : j+1;
      tokens.push({ type: isClose ? 'close' : 'open', tag, attrs, selfClose });
    } else {
      let j = i;
      while (j < xml.length && xml[j] !== '<') j++;
      const text = xml.slice(i, j);
      if (text) tokens.push({ type: 'text', text });
      i = j;
    }
  }
  return tokens;
}

/** Build a simple AST from tokens */
function buildAST(tokens) {
  let i = 0;
  function parseChildren(parentTag) {
    const children = [];
    while (i < tokens.length) {
      const tok = tokens[i];
      if (tok.type === 'close') { i++; break; }
      if (tok.type === 'text') {
        const t = tok.text.replace(/\s+/g,' ');
        if (t.trim()) children.push({ type:'text', value: t });
        i++; continue;
      }
      if (tok.type === 'open') {
        if (tok.selfClose) {
          children.push({ type:'element', tag: tok.tag, attrs: tok.attrs, children: [] });
          i++; continue;
        }
        i++;
        const node = { type:'element', tag: tok.tag, attrs: tok.attrs, children: parseChildren(tok.tag) };
        children.push(node);
      } else { i++; }
    }
    return children;
  }
  const roots = [];
  while (i < tokens.length) {
    const tok = tokens[i];
    if (tok.type === 'text') { i++; continue; }
    if (tok.type === 'close') { i++; continue; }
    if (tok.type === 'open') {
      if (tok.selfClose) { roots.push({ type:'element', tag: tok.tag, attrs: tok.attrs, children: [] }); i++; continue; }
      i++;
      roots.push({ type:'element', tag: tok.tag, attrs: tok.attrs, children: parseChildren(tok.tag) });
    } else { i++; }
  }
  return roots;
}

function parseMathML(xml) {
  if (!xml) return [];
  return buildAST(tokenise(xml));
}

/** Operator mapping */
const OP_MAP = {
  '−':'−', '–':'-', '\u2212':'-',
  '×':'\\times', '÷':'\\div',
  '≤':'\\leq', '≥':'\\geq', '≠':'\\neq', '≈':'\\approx',
  '∞':'\\infty', '∑':'\\sum', '∏':'\\prod', '∫':'\\int',
  '⇒':'\\Rightarrow', '→':'\\rightarrow', '⟹':'\\Longrightarrow',
  '|':'|', '∣':'|',
  '±':'\\pm', '∓':'\\mp', '·':'\\cdot',
  '≡':'\\equiv', '%':'\\%',
  '√':'\\sqrt{}',
};

function braceIfNeeded(s) {
  // Wrap in braces if more than one character (for sup/sub safety)
  return (s.length > 1 && !/^\{.*\}$/.test(s)) ? `{${s}}` : s;
}

function nodesToLatex(nodes) {
  return nodes.map(nodeToLatex).join('');
}

function nodeToLatex(node) {
  if (!node) return '';
  if (node.type === 'text') return node.value.replace(/\s+/g,' ');

  const kids = node.children || [];
  const all  = () => nodesToLatex(kids);
  const k    = (i) => nodeToLatex(kids[i]);

  switch (node.tag) {
    // Pass-through containers
    case 'math': case 'semantics': case 'mrow': case 'mstyle':
    case 'mpadded': case 'merror': case 'maction':
      return all();

    // Skip these
    case 'annotation': case 'annotation-xml':
      return '';

    case 'mi': {
      const t = all().trim();
      if (t.length > 1) return `\\mathrm{${t}}`;
      return t;
    }
    case 'mn':
      return all().trim();

    case 'mo': {
      const op = all().trim();
      return OP_MAP[op] || op;
    }

    case 'mtext': {
      const t = all().trim();
      // If it's a pure math operator/number, don't wrap in \text{}
      if (/^[0-9!.,\-\+\=\<\>\(\)\[\]\/\*\^\|%]+$/.test(t)) return t;
      return `\\text{${t}}`;
    }

    case 'mspace':
      return ' ';

    case 'mfrac': {
      const num = k(0), den = k(1);
      return `\\frac{${num}}{${den}}`;
    }

    case 'msqrt':
      return `\\sqrt{${all()}}`;

    case 'mroot': {
      const rad = k(0), idx = k(1);
      return `\\sqrt[${idx}]{${rad}}`;
    }

    case 'msup': {
      const base = k(0), exp = k(1);
      return `${braceIfNeeded(base)}^${braceIfNeeded(exp)}`;
    }

    case 'msub': {
      const base = k(0), sub = k(1);
      return `${braceIfNeeded(base)}_${braceIfNeeded(sub)}`;
    }

    case 'msubsup': {
      const base = k(0), sub = k(1), sup = k(2);
      return `${braceIfNeeded(base)}_{${sub}}^{${sup}}`;
    }

    case 'mover': {
      const base = k(0), over = k(1).trim();
      if (over === '→' || over === '\\rightarrow') return `\\vec{${base}}`;
      if (over === '¯' || over === '‾' || over === '\u203e') return `\\overline{${base}}`;
      if (over === '˙' || over === '⋅' || over === '.') return `\\dot{${base}}`;
      if (over === '˜' || over === '~') return `\\tilde{${base}}`;
      if (over === '∧' || over === '^') return `\\hat{${base}}`;
      return `\\overset{${over}}{${base}}`;
    }

    case 'munder': {
      const base = k(0), under = k(1);
      return `\\underset{${under}}{${base}}`;
    }

    case 'munderover': {
      const base = k(0), under = k(1), over = k(2);
      return `${base}_{${under}}^{${over}}`;
    }

    case 'mfenced': {
      const open   = node.attrs.open  !== undefined ? node.attrs.open  : '(';
      const close  = node.attrs.close !== undefined ? node.attrs.close : ')';
      const sep    = node.attrs.separators || ',';
      const openL  = {'(':' \\left(','[':' \\left[','{':' \\left\\{','|':' \\left|'}[open]  || ` \\left${open}`;
      const closeL = {')':'\\right) ',']':'\\right] ','}':'\\right\\} ','|':'\\right| '}[close] || `\\right${close} `;
      const inner  = kids.map(nodeToLatex).join(sep === ',' ? ',' : sep);
      return `${openL}${inner}${closeL}`;
    }

    case 'mtable': {
      const rows = kids.filter(c => c.tag === 'mtr').map(row => {
        const cells = (row.children || []).filter(c => c.tag === 'mtd').map(nodeToLatex);
        return cells.join(' & ');
      });
      if (!rows.length) return all();
      return rows.join(' \\\\ ');
    }
    case 'mtr': case 'mtd':
      return all();

    case 'menclose': return all();
    case 'mphantom': return '';

    default:
      return all();
  }
}

function mathmlToLatex(xml) {
  if (!xml) return null;
  const ast = parseMathML(xml);
  const latex = nodesToLatex(ast).trim().replace(/\s{2,}/g,' ');
  return latex || null;
}

// ═══════════════════════════════════════════════════════
//  Stem builder  (English text + optional LaTeX)
// ═══════════════════════════════════════════════════════

/** Patterns that indicate a "clean" English start to the question */
const ENGLISH_START = /^(If |Given |For |What |Let |Which |How |When |The |A |An |Is |Are |In |Suppose|Assume|Find |Note )/i;

/**
 * Try to split "EngPreamble[garbaged math]EngSuffix" from text,
 * replacing the garbled math with LaTeX.
 * Returns the reconstructed string.
 */
function reconstructStem(text, latex) {
  // Heuristic patterns for common TTP sentence structures
  const patterns = [
    // "If [math], then [suffix]?"
    { re: /^(If\s+)(.*?)(,?\s*then\s+.+)$/si, prefix: 1, suffix: 3 },
    // "Given [math], what is [suffix]?"
    { re: /^(Given\s+(?:that\s+)?)(.*?)(,?\s*(?:what|find|which|how).+)$/si, prefix: 1, suffix: 3 },
    // "Given that f(x) = [math], find..."
    { re: /^(Given that\s+.*?=\s*)(.*?)(,?\s*.+)$/si, prefix: 1, suffix: 3 },
    // "For [expr], which..."
    { re: /^(For\s+(?:all\s+)?[a-z\s]+,\s*)(.*?)((?:which|what|find).+)$/si, prefix: 1, suffix: 3 },
  ];

  for (const { re, prefix, suffix } of patterns) {
    const m = text.match(re);
    if (m && m[prefix] && m[suffix]) {
      const pre = m[prefix].trim();
      const suf = m[suffix].trim();
      return `${pre} \\(${latex}\\), ${suf}`;
    }
  }

  // Fallback: show cleaned text then the math on a new line as display
  const cleaned = text.replace(/[^\w\s,?.()\-–—'"!]/g, ' ').replace(/\s{2,}/g, ' ').trim();
  return `${cleaned} \\[${latex}\\]`;
}

function buildStem(text, mathml) {
  text = (text || '').trim();

  if (!mathml) {
    // No math — fix common superscript garbling (e.g. "p2" → "p²")
    return text.replace(/([a-zA-Z])(\d)(?=[^a-zA-Z\d]|$)/g, (_, l, d) => {
      const sup = '⁰¹²³⁴⁵⁶⁷⁸⁹'[+d];
      return sup ? l + sup : l + d;
    });
  }

  const latex = mathmlToLatex(mathml);
  if (!latex) return text;

  // Pure math stem (no English context)
  if (!ENGLISH_START.test(text)) {
    return `\\(${latex}\\)`;
  }

  // English + math
  return reconstructStem(text, latex);
}

function buildChoiceText(ans) {
  const latex = mathmlToLatex(ans.mathml);
  if (latex) return `\\(${latex}\\)`;
  const text = (ans.text || '').trim();
  // Fix garbled superscripts in text
  return text.replace(/([a-zA-Z])(\d)(?=[^a-zA-Z\d]|$)/g, (_, l, d) => {
    const sup = '⁰¹²³⁴⁵⁶⁷⁸⁹'[+d];
    return sup ? l + sup : l + d;
  });
}

function buildExplanation(parts) {
  if (!parts || !parts.length) return '';
  return parts
    .map(p => {
      const text = (p.text || '').trim();
      if (p.mathml) {
        const latex = mathmlToLatex(p.mathml);
        if (!latex) return text;
        if (!ENGLISH_START.test(text)) {
          // Pure math step — use display math block
          return `\\[${latex}\\]`;
        }
        // English prose with embedded math
        return reconstructStem(text, latex);
      }
      return text;
    })
    .filter(Boolean)
    .join('<br>')
    .replace(/\n/g,' ')
    .replace(/(<br>){3,}/g,'<br><br>');
}

// ═══════════════════════════════════════════════════════
//  Topic / difficulty helpers
// ═══════════════════════════════════════════════════════

const LETTER_IDX = { A:0,B:1,C:2,D:3,E:4 };

function classifyQuant(stem) {
  const t = stem.toLowerCase();
  if (/\b(probabilit|factorial|permut|combinat|arrangements?|committee|how many (ways|different|arrangements)|in how many|distinct (ways|arrangements)|choose \d|select \d|dice|marbles?|coin flip|deck of card|ways (can|to arrange)|seated|ordered)\b/.test(t))
    return { topic:'combinatorics', subtopic:'Combinatorics & Probability' };
  if (/\b(triangle|circle|rectangle|square|angle|area|perimeter|circumference|radius|diameter|hypotenuse|polygon|cylinder|volume|parallelogram|trapezoid|coordinate|slope|inscribed|equilateral|isosceles|diagonal|sector|arc)\b/.test(t))
    return { topic:'geometry', subtopic:'Geometry' };
  if (/\b(mean|median|mode|range|average|standard deviation|variance|weighted average|arithmetic mean|data set|set of numbers)\b/.test(t))
    return { topic:'statistics', subtopic:'Statistics' };
  if (/\b(rate|speed|distance|miles? per|per hour|work(ing)? (together|alone|at a rate)|mixture|percent (change|increase|decrease)|profit|loss|cost price|selling price|wage|salary|interest (rate|compounded)|discount|markup|investment|revenue)\b/.test(t))
    return { topic:'word', subtopic:'Word Problems' };
  if (/\b(equation|solve for|polynomial|quadratic|linear|factor(ing)?|roots?|function|expression|simplif|value of [a-z]\b|inequalit|absolute value|system of|exponent)\b/.test(t) ||
      /[a-z]\^\d/.test(t) || /\\frac/.test(t))
    return { topic:'algebra', subtopic:'Algebra' };
  return { topic:'arithmetic', subtopic:'Arithmetic' };
}

function classifyCR(stem) {
  const t = stem.toLowerCase();
  if (/assumption|assumes?|underlying assumption/.test(t))      return 'Assumption';
  if (/strengthen|support|most supports/.test(t))              return 'Strengthen';
  if (/weaken|undermine|cast doubt|challenge/.test(t))         return 'Weaken';
  if (/inference|infer|conclude from|follows from/.test(t))    return 'Inference';
  if (/bold(faced| face|\-face)/.test(t))                      return 'Bold Face';
  if (/flaw|vulnerable to|error in/.test(t))                   return 'Flaw';
  if (/explain|paradox|reconcil|discrepan/.test(t))            return 'Paradox/Explain';
  if (/evaluat|assess|judg/.test(t))                           return 'Evaluate';
  if (/conclusion|most logically complete|best conclusion/.test(t)) return 'Conclusion';
  if (/method|strategy|technique|approach/.test(t))            return 'Method of Reasoning';
  return 'Critical Reasoning';
}

function difficulty(testIdx, maxTest) {
  const p = testIdx / maxTest;
  return p <= 0.33 ? 'Easy' : p <= 0.66 ? 'Medium' : 'Hard';
}

// ═══════════════════════════════════════════════════════
//  Converters
// ═══════════════════════════════════════════════════════

function convertQuant(data) {
  const maxTest = Math.max(...data.map(q => q.test_index));
  return data.map((item, i) => {
    const ed      = item.extracted_data;
    const stem    = buildStem(ed.question.text, ed.question.mathml);
    const choices = (ed.answers || []).map(buildChoiceText);
    const { topic, subtopic } = classifyQuant(stem);
    return {
      id:         `ttp-q-${i+1}`,
      topic, subtopic,
      difficulty: difficulty(item.test_index, maxTest),
      type:       'mcq',
      stem,
      context:    null,
      choices,
      answer:     LETTER_IDX[ed.correct_answer] ?? 0,
      explanation: buildExplanation(ed.explanation_parts),
      tags:       []
    };
  });
}

function convertCR(data) {
  const maxTest = Math.max(...data.map(q => q.test_index));
  return data.map((item, i) => {
    const ed      = item.extracted_data;
    const stem    = buildStem(ed.question.text, ed.question.mathml); // CR has no mathml
    const choices = (ed.answers || []).map(buildChoiceText);
    return {
      id:         `ttp-cr-${i+1}`,
      topic:      'cr',
      subtopic:   classifyCR(stem),
      difficulty: difficulty(item.test_index, maxTest),
      type:       'mcq',
      stem,
      context:    null,
      choices,
      answer:     LETTER_IDX[ed.correct_answer] ?? 0,
      explanation: buildExplanation(ed.explanation_parts),
      tags:       []
    };
  });
}

// ═══════════════════════════════════════════════════════
//  Main
// ═══════════════════════════════════════════════════════

console.log('Reading JSON files...');
const quant  = JSON.parse(fs.readFileSync(path.join(DIR,'chapter_pages_metadata.json'),'utf8'));
const verbal = JSON.parse(fs.readFileSync(path.join(DIR,'verbal_chapter_pages_metadata.json'),'utf8'));

console.log(`Converting ${quant.length} quant + ${verbal.length} CR...`);
const quantQ = convertQuant(quant);
const crQ    = convertCR(verbal);
const all    = [...quantQ, ...crQ];

// Sanity check
const bad = all.filter(q => q.answer >= q.choices.length || q.choices.length === 0);
console.log('Invalid answer index:', bad.length);
const topics = {}, diffs = {};
all.forEach(q => { topics[q.topic] = (topics[q.topic]||0)+1; diffs[q.difficulty] = (diffs[q.difficulty]||0)+1; });
console.log('Topics:', topics);
console.log('Difficulties:', diffs);

// Spot-check the fraction-of-fractions question
const fracQ = quantQ.find(q => q.stem.includes('frac'));
if (fracQ) { console.log('\nSample fraction question:'); console.log('  STEM:', fracQ.stem); console.log('  A0:', fracQ.choices[0]); }

const out = `// Auto-generated ${new Date().toISOString().slice(0,10)} — ${all.length} questions\nconst GMAT_DB_TTP = ${JSON.stringify(all, null, 1)};\n`;
fs.writeFileSync(path.join(__dirname,'gmat_db_ttp.js'), out, 'utf8');
const mb = (fs.statSync(path.join(__dirname,'gmat_db_ttp.js')).size / 1024 / 1024).toFixed(1);
console.log(`\nWritten gmat_db_ttp.js — ${mb} MB`);
