/**
 * GMAT Exercise Engine
 * Renders any question from gmat_db.js into a host page.
 *
 * Usage (host page must define --accent CSS variable and contain):
 *   <div id="engine-root"></div>
 *   <script src="gmat_db.js"></script>
 *   <script src="gmat_engine.js"></script>
 *   <script>
 *     GmatEngine.init({
 *       topic: 'arithmetic',   // matches GMAT_DB topic field
 *       rootId: 'engine-root'
 *     });
 *   </script>
 */

const GmatEngine = (() => {

  /* ── DS answer labels (always the same 5) ── */
  const DS_LABELS = [
    'Statement (1) alone is sufficient, but statement (2) alone is not sufficient.',
    'Statement (2) alone is sufficient, but statement (1) alone is not sufficient.',
    'Both statements together are sufficient, but neither statement alone is sufficient.',
    'Each statement alone is sufficient.',
    'Statements (1) and (2) together are not sufficient to answer the question.'
  ];

  /* ── State ── */
  let cfg = {};
  let pool = [];       // questions for current difficulty
  let qIndex = 0;
  let score = 0;
  let total = 0;
  let submitted = false;

  /* TPA state */
  let tpaSel = [null, null];
  /* YN state */
  let ynSel = [];
  /* Dropdown state */
  let ddSel = [];
  /* MCQ / DS state */
  let mcqSel = null;

  /* ── Init ── */
  function init(options) {
    cfg = Object.assign({ rootId: 'engine-root', topic: null }, options);
    const root = document.getElementById(cfg.rootId);
    if (!root) { console.error('GmatEngine: root element not found'); return; }
    root.innerHTML = buildShell();
    bindDiffButtons();
  }

  /* ── Shell HTML (difficulty bar + stats bar + question area) ── */
  function buildShell() {
    return `
      <div class="ge-difficulty-row">
        <button class="ge-diff-btn" data-diff="Easy">Easy</button>
        <button class="ge-diff-btn" data-diff="Medium">Medium</button>
        <button class="ge-diff-btn" data-diff="Hard">Hard</button>
      </div>
      <div class="ge-stats-bar">
        <div>Score: <span id="ge-score">0 / 0</span></div>
        <div>Question <span id="ge-qi">1</span> of <span id="ge-qt">—</span></div>
      </div>
      <div id="ge-question-area">
        <div class="ge-question-card">
          <p id="ge-stem" style="font-size:0.95em;color:#444;line-height:1.7;font-style:italic">
            Select a difficulty above to begin.
          </p>
        </div>
      </div>
      <button class="ge-submit-btn" id="ge-submit" disabled>Submit Answer</button>
      <div class="ge-explanation" id="ge-explanation">
        <div class="ge-exp-label">Explanation</div>
        <p id="ge-exp-text">—</p>
      </div>
      <button class="ge-next-btn" id="ge-next">Next Question →</button>
    `;
  }

  /* ── Bind difficulty buttons ── */
  function bindDiffButtons() {
    document.querySelectorAll('.ge-diff-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.ge-diff-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        startDifficulty(btn.dataset.diff);
      });
    });
    document.getElementById('ge-submit').addEventListener('click', submitAnswer);
    document.getElementById('ge-next').addEventListener('click', nextQuestion);
  }

  /* ── Start difficulty ── */
  function startDifficulty(diff) {
    pool = dbQuery({ topic: cfg.topic, difficulty: diff });
    if (!pool.length) { alert('No questions yet for this difficulty.'); return; }
    qIndex = 0; score = 0; total = 0;
    updateStats();
    loadQuestion();
  }

  /* ── Load question ── */
  function loadQuestion() {
    const q = pool[qIndex];
    submitted = false;
    tpaSel = [null, null]; ynSel = []; ddSel = []; mcqSel = null;

    document.getElementById('ge-explanation').classList.remove('visible');
    document.getElementById('ge-next').classList.remove('visible');
    document.getElementById('ge-submit').disabled = true;
    updateStats();

    const area = document.getElementById('ge-question-area');
    area.innerHTML = buildQuestionHTML(q);
    bindQuestionEvents(q);
    typeset(area);
  }

  /* ── Build question HTML ── */
  function buildQuestionHTML(q) {
    let html = '';

    // Context
    if (q.context) html += buildContext(q.context);

    // Stem
    html += `<div class="ge-question-card"><p id="ge-stem">${q.stem.replace(/\n/g, '<br>')}</p></div>`;

    // Answer area by type
    switch (q.type) {
      case 'mcq':   html += buildMCQ(q); break;
      case 'ds':    html += buildDS(q);  break;
      case 'tpa':   html += buildTPA(q); break;
      case 'yn':    html += buildYN(q);  break;
      case 'dropdown': html += buildDropdown(q); break;
    }

    return html;
  }

  /* ── Context renderers ── */
  function buildContext(ctx) {
    if (ctx.type === 'passage') {
      return `<div class="ge-passage">${ctx.text}</div>`;
    }
    if (ctx.type === 'table') {
      let t = `<div class="ge-table-wrap"><table class="ge-table"><thead><tr>`;
      ctx.headers.forEach(h => { t += `<th>${h}</th>`; });
      t += `</tr></thead><tbody>`;
      ctx.rows.forEach(row => {
        t += `<tr>`;
        row.forEach(cell => { t += `<td>${cell}</td>`; });
        t += `</tr>`;
      });
      t += `</tbody></table></div>`;
      return t;
    }
    if (ctx.type === 'tabs') {
      let out = `<div class="ge-tabs">`;
      out += `<div class="ge-tab-bar">`;
      ctx.tabs.forEach((tab, i) => {
        out += `<button class="ge-ctx-tab${i===0?' active':''}" data-tab="${i}" onclick="GmatEngine._tabClick(this,${i})">${tab.label}</button>`;
      });
      out += `</div>`;
      ctx.tabs.forEach((tab, i) => {
        out += `<div class="ge-tab-panel${i===0?' active':''}" data-panel="${i}">${tab.html}</div>`;
      });
      out += `</div>`;
      return out;
    }
    return '';
  }

  /* Tab click (exposed for inline onclick) */
  function _tabClick(btn, idx) {
    btn.closest('.ge-tabs').querySelectorAll('.ge-ctx-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    btn.closest('.ge-tabs').querySelectorAll('.ge-tab-panel').forEach(p => p.classList.remove('active'));
    btn.closest('.ge-tabs').querySelector(`[data-panel="${idx}"]`).classList.add('active');
  }

  /* ── MCQ builder ── */
  function buildMCQ(q) {
    const letters = ['A','B','C','D','E'];
    let html = `<div class="ge-choices" id="ge-choices">`;
    q.choices.forEach((c, i) => {
      html += `<div class="ge-choice" data-idx="${i}">
        <div class="ge-badge">${letters[i]}</div>
        <div class="ge-choice-text">${c}</div>
      </div>`;
    });
    html += `</div>`;
    return html;
  }

  /* ── DS builder (same as MCQ but uses standard labels) ── */
  function buildDS(q) {
    const letters = ['A','B','C','D','E'];
    let html = `<div class="ge-choices" id="ge-choices">`;
    DS_LABELS.forEach((label, i) => {
      html += `<div class="ge-choice" data-idx="${i}">
        <div class="ge-badge">${letters[i]}</div>
        <div class="ge-choice-text">${label}</div>
      </div>`;
    });
    html += `</div>`;
    return html;
  }

  /* ── TPA builder ── */
  function buildTPA(q) {
    const p1 = q.part1_label || 'Part 1';
    const p2 = q.part2_label || 'Part 2';
    let html = `<div class="ge-tpa-wrap"><table class="ge-tpa-table" id="ge-tpa">
      <thead><tr>
        <th>${p1}</th>
        <th>${p2}</th>
        <th style="text-align:left">Option</th>
      </tr></thead><tbody>`;
    q.choices.forEach((opt, r) => {
      html += `<tr>
        <td class="ge-tpa-cell" data-row="${r}" data-col="0"></td>
        <td class="ge-tpa-cell" data-row="${r}" data-col="1"></td>
        <td class="ge-tpa-label">${opt}</td>
      </tr>`;
    });
    html += `</tbody></table></div>`;
    return html;
  }

  /* ── YN builder ── */
  function buildYN(q) {
    ynSel = new Array(q.choices.length).fill(null);
    let html = `<div class="ge-yn-list" id="ge-yn">`;
    q.choices.forEach((stmt, i) => {
      html += `<div class="ge-yn-row" data-idx="${i}">
        <div class="ge-yn-stmt">${stmt}</div>
        <div class="ge-yn-btns">
          <button class="ge-yn-btn" data-val="Yes" data-idx="${i}">Yes</button>
          <button class="ge-yn-btn" data-val="No"  data-idx="${i}">No</button>
        </div>
      </div>`;
    });
    html += `</div>`;
    return html;
  }

  /* ── Dropdown builder ── */
  function buildDropdown(q) {
    ddSel = new Array(q.dropdowns.length).fill(null);
    let html = `<div class="ge-dropdown-area" id="ge-dd"><p style="font-size:0.95em;color:#444;line-height:1.9">`;
    let ddCount = 0;
    q.parts.forEach((part, pi) => {
      html += part.replace(/\n/g,'<br>');
      if (pi < q.dropdowns.length) {
        const dd = q.dropdowns[ddCount];
        html += `<select class="ge-dd-select" data-dd="${ddCount}">
          <option value="">— select —</option>`;
        dd.options.forEach((opt, oi) => {
          html += `<option value="${oi}">${opt}</option>`;
        });
        html += `</select>`;
        ddCount++;
      }
    });
    html += `</p></div>`;
    return html;
  }

  /* ── Bind events after render ── */
  function bindQuestionEvents(q) {
    if (q.type === 'mcq' || q.type === 'ds') {
      document.querySelectorAll('.ge-choice').forEach(el => {
        el.addEventListener('click', () => {
          if (submitted) return;
          document.querySelectorAll('.ge-choice').forEach(c => c.classList.remove('selected'));
          el.classList.add('selected');
          mcqSel = parseInt(el.dataset.idx);
          document.getElementById('ge-submit').disabled = false;
        });
      });
    }
    if (q.type === 'tpa') {
      document.querySelectorAll('.ge-tpa-cell').forEach(cell => {
        cell.addEventListener('click', () => {
          if (submitted) return;
          const col = parseInt(cell.dataset.col);
          const row = parseInt(cell.dataset.row);
          // clear column
          document.querySelectorAll(`.ge-tpa-cell[data-col="${col}"]`).forEach(c => {
            c.classList.remove('sel-c0','sel-c1');
          });
          cell.classList.add(col === 0 ? 'sel-c0' : 'sel-c1');
          tpaSel[col] = row;
          document.getElementById('ge-submit').disabled = (tpaSel[0]===null||tpaSel[1]===null);
        });
      });
    }
    if (q.type === 'yn') {
      document.querySelectorAll('.ge-yn-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          if (submitted) return;
          const idx = parseInt(btn.dataset.idx);
          const val = btn.dataset.val;
          // deselect sibling
          btn.closest('.ge-yn-btns').querySelectorAll('.ge-yn-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          ynSel[idx] = val;
          document.getElementById('ge-submit').disabled = ynSel.some(v => v === null);
        });
      });
    }
    if (q.type === 'dropdown') {
      document.querySelectorAll('.ge-dd-select').forEach(sel => {
        sel.addEventListener('change', () => {
          if (submitted) return;
          const idx = parseInt(sel.dataset.dd);
          ddSel[idx] = sel.value === '' ? null : parseInt(sel.value);
          document.getElementById('ge-submit').disabled = ddSel.some(v => v === null);
        });
      });
    }
  }

  /* ── Submit ── */
  function submitAnswer() {
    if (submitted) return;
    const q = pool[qIndex];
    submitted = true;
    total++;

    let correct = false;

    if (q.type === 'mcq' || q.type === 'ds') {
      correct = (mcqSel === q.answer);
      document.querySelectorAll('.ge-choice').forEach((el, i) => {
        el.classList.add('locked');
        if (i === q.answer) el.classList.add('correct');
        else if (i === mcqSel && !correct) el.classList.add('wrong');
      });
    }

    if (q.type === 'tpa') {
      correct = (tpaSel[0] === q.answer.part1 && tpaSel[1] === q.answer.part2);
      document.querySelectorAll('.ge-tpa-cell').forEach(cell => {
        cell.style.pointerEvents = 'none';
        const r = parseInt(cell.dataset.row);
        const c = parseInt(cell.dataset.col);
        const correctRow = c === 0 ? q.answer.part1 : q.answer.part2;
        const selRow    = tpaSel[c];
        if (r === correctRow) cell.classList.add('tpa-correct');
        else if (r === selRow) cell.classList.add('tpa-wrong');
      });
    }

    if (q.type === 'yn') {
      correct = q.answer.every((v, i) => v === ynSel[i]);
      document.querySelectorAll('.ge-yn-btn').forEach(btn => {
        btn.disabled = true;
        const idx = parseInt(btn.dataset.idx);
        const val = btn.dataset.val;
        if (val === q.answer[idx]) btn.classList.add('yn-correct');
        else if (val === ynSel[idx] && val !== q.answer[idx]) btn.classList.add('yn-wrong');
      });
    }

    if (q.type === 'dropdown') {
      correct = q.dropdowns.every((dd, i) => dd.answer === ddSel[i]);
      document.querySelectorAll('.ge-dd-select').forEach(sel => {
        const idx = parseInt(sel.dataset.dd);
        sel.disabled = true;
        if (ddSel[idx] === q.dropdowns[idx].answer) sel.classList.add('dd-correct');
        else sel.classList.add('dd-wrong');
      });
    }

    if (correct) score++;
    updateStats();

    const expEl = document.getElementById('ge-explanation');
    document.getElementById('ge-exp-text').innerHTML = q.explanation;
    expEl.classList.add('visible');
    document.getElementById('ge-next').classList.add('visible');
    document.getElementById('ge-submit').disabled = true;
    typeset(expEl);
  }

  /* ── Next ── */
  function nextQuestion() {
    qIndex = (qIndex + 1) % pool.length;
    loadQuestion();
  }

  /* ── Stats ── */
  function updateStats() {
    document.getElementById('ge-score').textContent = score + ' / ' + total;
    if (pool.length) {
      document.getElementById('ge-qi').textContent = qIndex + 1;
      document.getElementById('ge-qt').textContent = pool.length;
    }
  }

  /* ── Inject shared CSS ── */
  function injectStyles() {
    if (document.getElementById('ge-styles')) return;
    const style = document.createElement('style');
    style.id = 'ge-styles';
    style.textContent = `
      /* ── Engine shell ── */
      .ge-difficulty-row{display:flex;gap:10px;margin-bottom:20px;flex-wrap:wrap}
      .ge-diff-btn{flex:1;min-width:90px;padding:10px 6px;border:2px solid #cbd5e0;border-radius:8px;background:white;font-size:.85em;font-weight:600;color:#555;cursor:pointer;transition:border-color .2s,color .2s,background .2s}
      .ge-diff-btn:hover{border-color:var(--accent);color:var(--accent)}
      .ge-diff-btn.selected{border-color:var(--accent);background:var(--accent);color:white}
      .ge-stats-bar{display:flex;justify-content:space-between;align-items:center;background:white;border-radius:8px;padding:10px 16px;margin-bottom:16px;font-size:.82em;font-weight:600;color:#555;border:1px solid #e1e8ed}
      .ge-stats-bar span{color:var(--accent)}

      /* ── Context ── */
      .ge-passage{background:#f8f9fa;border-left:4px solid var(--accent);border-radius:0 8px 8px 0;padding:16px 18px;margin-bottom:18px;font-size:.88em;color:#444;line-height:1.7}
      .ge-table-wrap{overflow-x:auto;margin-bottom:18px}
      .ge-table{width:100%;border-collapse:collapse;font-size:.85em}
      .ge-table th{background:#f0f2f5;padding:9px 12px;font-weight:700;color:#5d6d7e;border:1px solid #e1e8ed;text-align:left}
      .ge-table td{padding:8px 12px;border:1px solid #e1e8ed;color:#34495e}
      .ge-table tbody tr:hover{background:#f9fafb}

      /* ── Tabs ── */
      .ge-tabs{margin-bottom:18px;border:1px solid #e1e8ed;border-radius:10px;overflow:hidden}
      .ge-tab-bar{display:flex;background:#f0f2f5;border-bottom:1px solid #e1e8ed}
      .ge-ctx-tab{flex:1;padding:10px;border:none;background:transparent;font-size:.82em;font-weight:600;color:#7f8c8d;cursor:pointer;border-bottom:2px solid transparent;transition:color .2s}
      .ge-ctx-tab.active{color:var(--accent);border-bottom-color:var(--accent);background:white}
      .ge-tab-panel{display:none;padding:16px}
      .ge-tab-panel.active{display:block}

      /* ── Question card ── */
      .ge-question-card{background:white;border-radius:10px;padding:22px;margin-bottom:18px;box-shadow:0 1px 4px rgba(0,0,0,.07)}

      /* ── MCQ / DS choices ── */
      .ge-choices{display:flex;flex-direction:column;gap:10px;margin-bottom:18px}
      .ge-choice{display:flex;align-items:center;gap:14px;background:white;border:2px solid #e1e8ed;border-radius:8px;padding:13px 16px;cursor:pointer;transition:border-color .2s,background .2s}
      .ge-choice:hover:not(.locked){border-color:var(--accent);background:var(--accent-bg,#f0fff8)}
      .ge-choice.selected{border-color:var(--accent);background:var(--accent-bg,#f0fff8)}
      .ge-choice.correct{border-color:#27ae60;background:#eafaf0}
      .ge-choice.wrong{border-color:#e74c3c;background:#fdf0ee}
      .ge-choice.locked{cursor:default}
      .ge-badge{width:30px;height:30px;border-radius:50%;background:#ecf0f1;display:flex;align-items:center;justify-content:center;font-size:.78em;font-weight:700;color:#555;flex-shrink:0;transition:background .2s,color .2s}
      .ge-choice.selected .ge-badge{background:var(--accent);color:white}
      .ge-choice.correct  .ge-badge{background:#27ae60;color:white}
      .ge-choice.wrong    .ge-badge{background:#e74c3c;color:white}
      .ge-choice-text{font-size:.88em;color:#444;line-height:1.4}

      /* ── TPA ── */
      .ge-tpa-wrap{overflow-x:auto;margin-bottom:18px}
      .ge-tpa-table{width:100%;border-collapse:collapse;font-size:.88em}
      .ge-tpa-table th{background:#f0f2f5;padding:10px 14px;font-weight:700;color:#5d6d7e;text-align:center;border:1px solid #e1e8ed;font-size:.8em;text-transform:uppercase;letter-spacing:.5px}
      .ge-tpa-cell{padding:11px 14px;border:1px solid #e1e8ed;color:#34495e;text-align:center;cursor:pointer;transition:background .15s;min-width:44px}
      .ge-tpa-cell:hover{background:var(--accent-bg,#f0fff8)}
      .ge-tpa-cell.sel-c0,.ge-tpa-cell.sel-c1{background:var(--accent-bg,#f0fff8);color:var(--accent);font-weight:600}
      .ge-tpa-cell.tpa-correct{background:#eafaf0;color:#27ae60;font-weight:600}
      .ge-tpa-cell.tpa-wrong{background:#fdf0ee;color:#e74c3c;font-weight:600}
      .ge-tpa-label{padding:11px 14px;border:1px solid #e1e8ed;color:#2c3e50;font-weight:500;text-align:left}

      /* ── YN ── */
      .ge-yn-list{display:flex;flex-direction:column;gap:10px;margin-bottom:18px}
      .ge-yn-row{background:white;border:1px solid #e1e8ed;border-radius:8px;padding:14px 16px;display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}
      .ge-yn-stmt{font-size:.88em;color:#444;flex:1}
      .ge-yn-btns{display:flex;gap:8px;flex-shrink:0}
      .ge-yn-btn{padding:7px 18px;border:2px solid #d5dbdb;border-radius:6px;background:white;font-size:.83em;font-weight:700;cursor:pointer;transition:all .2s}
      .ge-yn-btn:hover{border-color:var(--accent);color:var(--accent)}
      .ge-yn-btn.selected{border-color:var(--accent);background:var(--accent);color:white}
      .ge-yn-btn.yn-correct{border-color:#27ae60;background:#27ae60;color:white}
      .ge-yn-btn.yn-wrong{border-color:#e74c3c;background:#e74c3c;color:white}

      /* ── Dropdown ── */
      .ge-dropdown-area{background:white;border-radius:10px;padding:22px;margin-bottom:18px;box-shadow:0 1px 4px rgba(0,0,0,.07)}
      .ge-dd-select{padding:5px 8px;border:2px solid #e1e8ed;border-radius:6px;font-size:.88em;cursor:pointer;background:white;transition:border-color .2s;margin:0 4px;max-width:180px}
      .ge-dd-select:focus{outline:none;border-color:var(--accent)}
      .ge-dd-select.dd-correct{border-color:#27ae60;background:#eafaf0}
      .ge-dd-select.dd-wrong{border-color:#e74c3c;background:#fdf0ee}

      /* ── Submit / Next / Explanation ── */
      .ge-submit-btn{width:100%;padding:14px;background:var(--accent);color:white;border:none;border-radius:8px;font-size:.95em;font-weight:700;cursor:pointer;transition:opacity .2s}
      .ge-submit-btn:hover:not(:disabled){opacity:.9}
      .ge-submit-btn:disabled{opacity:.45;cursor:default}
      .ge-explanation{display:none;border-left:4px solid var(--accent);background:var(--exp-bg,#f0fff8);border-radius:0 8px 8px 0;padding:16px 18px;margin-top:16px}
      .ge-explanation.visible{display:block}
      .ge-exp-label{font-size:.72em;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--accent);margin-bottom:8px}
      #ge-exp-text{font-size:.88em;color:#333;line-height:1.65}
      .ge-next-btn{display:none;width:100%;margin-top:12px;padding:13px;background:#1a252f;color:white;border:none;border-radius:8px;font-size:.92em;font-weight:700;cursor:pointer;transition:opacity .2s}
      .ge-next-btn.visible{display:block}
      .ge-next-btn:hover{opacity:.85}
    `;
    document.head.appendChild(style);
  }

  /* Load MathJax 3 once */
  function loadMathJax() {
    if (document.getElementById('mathjax-script')) return;
    window.MathJax = {
      tex: { inlineMath: [['\\(','\\)']], displayMath: [['\\[','\\]']] },
      options: { skipHtmlTags: ['script','noscript','style','textarea','pre'] }
    };
    const s = document.createElement('script');
    s.id = 'mathjax-script'; s.async = true;
    s.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js';
    document.head.appendChild(s);
  }

  /* Typeset an element after rendering */
  function typeset(el) {
    if (window.MathJax && MathJax.typesetPromise) MathJax.typesetPromise([el]);
  }

  /* Auto-inject styles on load */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { injectStyles(); loadMathJax(); });
  } else {
    injectStyles(); loadMathJax();
  }

  return { init, _tabClick };
})();
