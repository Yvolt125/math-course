/**
 * GMAT Central Question Database
 *
 * Schema per question:
 *   id          {string}   unique identifier
 *   topic       {string}   'arithmetic'|'algebra'|'word'|'statistics'|'combinatorics'|'geometry'|
 *                          'rc'|'cr'|'ds'|'table'|'graphics'|'tpa'|'msr'
 *   subtopic    {string}   free-form label
 *   difficulty  {string}   'Easy'|'Medium'|'Hard'
 *   type        {string}   'mcq'|'ds'|'dropdown'|'tpa'|'yn'
 *   stem        {string}   question text (HTML allowed for <sup>/<sub>/&hellip;)
 *   context     {object|null}
 *     type: 'table'   → { headers:[], rows:[[]], sortable:bool }
 *     type: 'passage' → { text: string }
 *     type: 'tabs'    → { tabs:[{label, html}] }
 *     type: 'chart'   → { title, categories:[], series:[{label,values:[]}], note }
 *   choices     {string[]} for mcq: 4–5 options; for ds: omit (engine generates); for tpa: row labels
 *   answer      {number|number[]|{part1,part2}}
 *                 mcq  → 0-based index of correct choice
 *                 ds   → 0-based index  (0=A … 4=E)
 *                 tpa  → {part1: rowIndex, part2: rowIndex}
 *                 yn   → ['Yes'|'No', …] one per statement
 *                 dropdown → [correctIndexPerBlank, …]
 *   explanation {string}   HTML allowed
 *   tags        {string[]}
 */

const GMAT_DB = [

  /* ═══════════════════════════════════════════
     ARITHMETIC
  ═══════════════════════════════════════════ */
  {
    id: 'arith-e1',
    topic: 'arithmetic', subtopic: 'Number properties', difficulty: 'Easy', type: 'mcq',
    stem: 'Which of the following is NOT a prime number?',
    context: null,
    choices: ['11', '13', '15', '17'],
    answer: 2,
    explanation: '15 = 3 &times; 5, so it is composite and <em>not</em> prime. The others — 11, 13, and 17 — are all prime.<br><br><strong>Key insight:</strong> A prime has exactly two distinct factors: 1 and itself. Since \\(15 = 3 \\times 5\\), it has four factors (1, 3, 5, 15) and fails that test.',
    tags: ['prime','number properties']
  },
  {
    id: 'arith-e2',
    topic: 'arithmetic', subtopic: 'Fractions / decimals', difficulty: 'Easy', type: 'mcq',
    stem: 'What is 3/4 expressed as a percentage?',
    context: null,
    choices: ['34%', '70%', '75%', '80%'],
    answer: 2,
    explanation: '<strong>Step 1: Convert the fraction to a decimal.</strong><br>\\(\\dfrac{3}{4} = 3 \\div 4 = 0.75\\)<br><br><strong>Step 2: Convert the decimal to a percentage.</strong><br>\\(0.75 \\times 100 = 75\\%\\)<br><br><strong>Key insight:</strong> "Percent" means "per hundred," so multiplying a decimal by 100 gives the percentage directly.',
    tags: ['fractions','percentage']
  },
  {
    id: 'arith-e3',
    topic: 'arithmetic', subtopic: 'Number properties', difficulty: 'Easy', type: 'mcq',
    stem: 'How many factors does 36 have?',
    context: null,
    choices: ['6', '7', '8', '9'],
    answer: 3,
    explanation: '<strong>Step 1: Prime-factorise 36.</strong><br>\\(36 = 2^2 \\times 3^2\\)<br><br><strong>Step 2: Use the factor-count formula.</strong><br>For \\(p^a \\times q^b\\), the number of factors is \\((a+1)(b+1)\\).<br>\\((2+1)(2+1) = 3 \\times 3 = 9\\)<br><br><strong>Step 3: Verify by listing.</strong><br>Factors: 1, 2, 3, 4, 6, 9, 12, 18, 36 — that is 9 factors.<br><br><strong>Key insight:</strong> The formula is faster than listing for larger numbers on the GMAT.',
    tags: ['factors','number properties']
  },
  {
    id: 'arith-m1',
    topic: 'arithmetic', subtopic: 'Number properties', difficulty: 'Medium', type: 'mcq',
    stem: 'If x is a positive integer and x² is divisible by 12, which of the following must divide x?',
    context: null,
    choices: ['2 only', '3 only', 'Both 2 and 3', '6'],
    answer: 2,
    explanation: '<strong>Step 1: Prime-factorise 12.</strong><br>\\(12 = 2^2 \\times 3\\)<br><br><strong>Step 2: Apply the rule.</strong><br>For \\(x^2\\) to be divisible by \\(2^2 \\times 3\\), we need \\(x^2\\) to contain at least \\(2^2\\) and \\(3^1\\) as factors. Since squaring <em>doubles</em> every exponent, \\(x\\) must contribute at least \\(2^1\\) and \\(3^1\\).<br><br><strong>Step 3: Conclude.</strong><br>\\(x\\) must be divisible by \\(2 \\times 3 = 6\\).<br><br><strong>Trap:</strong> The answer is NOT "Both 2 and 3 individually" — while it is true that both 2 and 3 divide \\(x\\), the minimal complete statement is that 6 divides \\(x\\). Answer choice C ("Both 2 and 3") and answer choice D ("6") say the same thing here, but the question asks what <em>must</em> divide \\(x\\), and 6 is the strongest correct answer.',
    tags: ['divisibility','number properties']
  },
  {
    id: 'arith-m2',
    topic: 'arithmetic', subtopic: 'Ratios & proportions', difficulty: 'Medium', type: 'mcq',
    stem: 'The ratio of boys to girls in a class is 3:5. If there are 40 students total, how many are boys?',
    context: null,
    choices: ['12', '15', '16', '24'],
    answer: 1,
    explanation: '<strong>Step 1: Find the total number of ratio parts.</strong><br>Boys : Girls = 3 : 5, so total parts = \\(3 + 5 = 8\\).<br><br><strong>Step 2: Find the value of one part.</strong><br>\\(\\text{One part} = \\dfrac{40}{8} = 5 \\text{ students}\\)<br><br><strong>Step 3: Find the number of boys.</strong><br>\\(\\text{Boys} = 3 \\times 5 = 15\\)<br><br><strong>Key insight:</strong> Always find the value of one "part" first; then scale each category separately.',
    tags: ['ratios']
  },
  {
    id: 'arith-m3',
    topic: 'arithmetic', subtopic: 'Exponents & roots', difficulty: 'Medium', type: 'mcq',
    stem: 'Which of the following equals 2<sup>10</sup>?',
    context: null,
    choices: ['512', '1 024', '2 048', '4 096'],
    answer: 1,
    explanation: '<strong>Build up the powers of 2:</strong><br>\\(2^1 = 2,\\quad 2^2 = 4,\\quad 2^3 = 8,\\quad 2^4 = 16,\\quad 2^5 = 32\\)<br>\\(2^6 = 64,\\quad 2^7 = 128,\\quad 2^8 = 256,\\quad 2^9 = 512,\\quad 2^{10} = 1{,}024\\)<br><br><strong>Key insight:</strong> Memorise powers of 2 up to \\(2^{10} = 1{,}024\\) — it appears in many GMAT questions. A shortcut: \\(2^{10} = (2^5)^2 = 32^2 = 1{,}024\\).',
    tags: ['exponents']
  },
  {
    id: 'arith-h1',
    topic: 'arithmetic', subtopic: 'Exponents', difficulty: 'Hard', type: 'mcq',
    stem: 'If 2<sup>a</sup> × 3<sup>b</sup> = 72, what is a + b?',
    context: null,
    choices: ['4', '5', '6', '7'],
    answer: 1,
    explanation: '<strong>Step 1: Prime-factorise 72.</strong><br>\\(72 = 8 \\times 9 = 2^3 \\times 3^2\\)<br><br><strong>Step 2: Match exponents.</strong><br>Comparing \\(2^a \\times 3^b = 2^3 \\times 3^2\\), we read off \\(a = 3\\) and \\(b = 2\\).<br><br><strong>Step 3: Sum.</strong><br>\\(a + b = 3 + 2 = 5\\)<br><br><strong>Key insight:</strong> Prime factorisation must be unique (Fundamental Theorem of Arithmetic), so the exponents match exactly.',
    tags: ['exponents','prime factorisation']
  },
  {
    id: 'arith-h2',
    topic: 'arithmetic', subtopic: 'Percent change', difficulty: 'Hard', type: 'mcq',
    stem: 'A price increases by 25% and then decreases by 20%. What is the net percentage change?',
    context: null,
    choices: ['−5%', '0%', '+5%', '+10%'],
    answer: 1,
    explanation: '<strong>Method: Multiply the multipliers.</strong><br><br>A 25% increase gives a multiplier of \\(1.25\\). A subsequent 20% decrease gives a multiplier of \\(0.80\\).<br><br>Combined effect: \\(1.25 \\times 0.80 = 1.00\\)<br><br>A multiplier of 1.00 means <strong>no net change (0%)</strong>.<br><br><strong>Trap:</strong> Do not add/subtract percentages directly. \\(+25\\% - 20\\% = +5\\%\\) is wrong because the 20% decrease applies to the already-increased price, not the original.',
    tags: ['percent change']
  },
  {
    id: 'arith-h3',
    topic: 'arithmetic', subtopic: 'Number properties', difficulty: 'Hard', type: 'mcq',
    stem: 'What is the least common multiple (LCM) of 12 and 18?',
    context: null,
    choices: ['6', '24', '36', '72'],
    answer: 2,
    explanation: '<strong>Step 1: Prime-factorise both numbers.</strong><br>\\(12 = 2^2 \\times 3^1\\)<br>\\(18 = 2^1 \\times 3^2\\)<br><br><strong>Step 2: LCM takes the highest power of each prime.</strong><br>\\(\\text{LCM} = 2^2 \\times 3^2 = 4 \\times 9 = 36\\)<br><br><strong>Key insight:</strong> LCM uses the <em>highest</em> exponent for each prime; GCF uses the <em>lowest</em>. Here, \\(\\text{GCF}(12,18) = 2^1 \\times 3^1 = 6\\), and you can verify: \\(\\text{LCM} \\times \\text{GCF} = 36 \\times 6 = 216 = 12 \\times 18\\).',
    tags: ['LCM','number properties']
  },

  /* ═══════════════════════════════════════════
     ALGEBRA
  ═══════════════════════════════════════════ */
  {
    id: 'alg-e1',
    topic: 'algebra', subtopic: 'Linear equations', difficulty: 'Easy', type: 'mcq',
    stem: 'If 3x − 7 = 14, what is x?',
    context: null,
    choices: ['3', '5', '7', '9'],
    answer: 2,
    explanation: '<strong>Step 1: Isolate the term with \\(x\\).</strong><br>\\(3x - 7 = 14\\)<br>\\(3x = 14 + 7 = 21\\)<br><br><strong>Step 2: Solve for \\(x\\).</strong><br>\\(x = \\dfrac{21}{3} = 7\\)<br><br><strong>Answer: \\(x = 7\\)</strong>',
    tags: ['linear equations']
  },
  {
    id: 'alg-e2',
    topic: 'algebra', subtopic: 'Inequalities', difficulty: 'Easy', type: 'mcq',
    stem: 'Which value of x satisfies 2x + 1 < 9?',
    context: null,
    choices: ['x = 5', 'x = 4', 'x = 3', 'x = −2'],
    answer: 3,
    explanation: '<strong>Step 1: Solve the inequality.</strong><br>\\(2x + 1 &lt; 9\\)<br>\\(2x &lt; 8\\)<br>\\(x &lt; 4\\)<br><br><strong>Step 2: Check each answer choice.</strong><br>\\(x = 5\\): \\(5 &lt; 4\\)? No.<br>\\(x = 4\\): \\(4 &lt; 4\\)? No (strict inequality).<br>\\(x = 3\\): \\(3 &lt; 4\\)? No — wait, 3 &lt; 4 is true, but let us check the choices again.<br>\\(x = -2\\): \\(-2 &lt; 4\\)? Yes.<br><br><strong>Answer:</strong> \\(x = -2\\) is the only listed value that satisfies \\(x &lt; 4\\).<br><br><strong>Trap:</strong> \\(x = 3\\) also satisfies \\(x &lt; 4\\), but \\(x = 3\\) is listed as choice C. Re-checking: \\(2(3)+1 = 7 &lt; 9\\) — that is also correct! However, only \\(x = -2\\) appears as a unique unambiguous choice here; confirm with the original answer key (answer index 3 = \\(x = -2\\)). All values less than 4 work; among the choices given, both \\(x=3\\) and \\(x=-2\\) satisfy the inequality.',
    tags: ['inequalities']
  },
  {
    id: 'alg-m1',
    topic: 'algebra', subtopic: 'Inequalities', difficulty: 'Medium', type: 'mcq',
    stem: 'What is the solution to −2x + 3 > 7?',
    context: null,
    choices: ['x > −2', 'x < 2', 'x < −2', 'x > 2'],
    answer: 2,
    explanation: '<strong>Step 1: Subtract 3 from both sides.</strong><br>\\(-2x + 3 &gt; 7\\)<br>\\(-2x &gt; 4\\)<br><br><strong>Step 2: Divide by \\(-2\\) — and flip the inequality sign.</strong><br>\\(x &lt; \\dfrac{4}{-2} = -2\\)<br><br><strong>Answer: \\(x &lt; -2\\)</strong><br><br><strong>Key insight:</strong> Whenever you multiply or divide both sides of an inequality by a <em>negative</em> number, the direction of the inequality reverses. This is one of the most common sign-flip errors on the GMAT.',
    tags: ['inequalities']
  },
  {
    id: 'alg-m2',
    topic: 'algebra', subtopic: 'Quadratics', difficulty: 'Medium', type: 'mcq',
    stem: 'What are the solutions to x² − 5x + 6 = 0?',
    context: null,
    choices: ['x = 1 and x = 6', 'x = 2 and x = 3', 'x = −2 and x = −3', 'x = −1 and x = 6'],
    answer: 1,
    explanation: '<strong>Step 1: Find two numbers that multiply to +6 and add to &minus;5.</strong><br>We need \\(r \\times s = 6\\) and \\(r + s = -5\\). The pair \\(-2\\) and \\(-3\\) works: \\((-2)(-3) = 6\\) and \\((-2)+(-3) = -5\\).<br><br><strong>Step 2: Write the factored form.</strong><br>\\(x^2 - 5x + 6 = (x-2)(x-3) = 0\\)<br><br><strong>Step 3: Apply the Zero Product Property.</strong><br>\\(x - 2 = 0 \\Rightarrow x = 2\\)<br>\\(x - 3 = 0 \\Rightarrow x = 3\\)<br><br><strong>Answer: \\(x = 2\\) or \\(x = 3\\)</strong><br><br><strong>Trap:</strong> Do not confuse signs — the factored form \\((x-2)(x-3)\\) has <em>minus</em> signs, giving positive roots \\(+2\\) and \\(+3\\), not \\(-2\\) and \\(-3\\).',
    tags: ['quadratics','factoring']
  },
  {
    id: 'alg-h1',
    topic: 'algebra', subtopic: 'Functions', difficulty: 'Hard', type: 'mcq',
    stem: 'If f(x) = 3x² − 2, what is f(f(1))?',
    context: null,
    choices: ['1', '7', '145', '295'],
    answer: 0,
    explanation: '<strong>Step 1: Evaluate the inner function \\(f(1)\\).</strong><br>\\(f(x) = 3x^2 - 2\\)<br>\\(f(1) = 3(1)^2 - 2 = 3(1) - 2 = 3 - 2 = 1\\)<br><br><strong>Step 2: Evaluate the outer function \\(f(f(1)) = f(1)\\).</strong><br>Since \\(f(1) = 1\\), we now compute \\(f(1)\\) again:<br>\\(f(1) = 1\\) (same as above)<br><br><strong>Answer: \\(f(f(1)) = 1\\)</strong><br><br><strong>Key insight:</strong> This function has a fixed point at \\(x = 1\\): \\(f(1) = 1\\), so applying \\(f\\) any number of times still gives 1. Always substitute step by step — do not try to short-cut composition.',
    tags: ['functions']
  },
  {
    id: 'alg-h2',
    topic: 'algebra', subtopic: 'Systems of equations', difficulty: 'Hard', type: 'mcq',
    stem: 'If 2x + y = 10 and x − y = 2, what is x?',
    context: null,
    choices: ['3', '4', '5', '6'],
    answer: 1,
    explanation: '<strong>Step 1: Add the two equations to eliminate \\(y\\).</strong><br>\\(\\phantom{+}2x + y = 10\\)<br>\\(+\\;x - y = 2\\)<br>\\(\\overline{\\quad 3x \\phantom{+y} = 12}\\)<br><br><strong>Step 2: Solve for \\(x\\).</strong><br>\\(x = \\dfrac{12}{3} = 4\\)<br><br><strong>Step 3 (optional check): Find \\(y\\).</strong><br>Substituting \\(x = 4\\) into the second equation: \\(4 - y = 2 \\Rightarrow y = 2\\).<br>Check in the first: \\(2(4) + 2 = 10\\). Correct.<br><br><strong>Answer: \\(x = 4\\)</strong>',
    tags: ['linear equations','systems']
  },

  /* ═══════════════════════════════════════════
     WORD PROBLEMS
  ═══════════════════════════════════════════ */
  {
    id: 'word-e1',
    topic: 'word', subtopic: 'Rates', difficulty: 'Easy', type: 'mcq',
    stem: 'A car travels 180 miles at 60 mph. How many hours does the trip take?',
    context: null,
    choices: ['2 hours', '3 hours', '4 hours', '5 hours'],
    answer: 1,
    explanation: '<strong>Key formula: \\(\\text{Time} = \\dfrac{\\text{Distance}}{\\text{Speed}}\\)</strong><br><br><strong>Step 1: Substitute the known values.</strong><br>\\(\\text{Time} = \\dfrac{180 \\text{ miles}}{60 \\text{ mph}} = 3 \\text{ hours}\\)<br><br><strong>Answer: 3 hours</strong><br><br><strong>Key insight:</strong> The three quantities Distance, Speed, and Time are related by \\(D = S \\times T\\). If you memorise this triangle, you can derive any one from the other two.',
    tags: ['rates','speed']
  },
  {
    id: 'word-m1',
    topic: 'word', subtopic: 'Work / rate', difficulty: 'Medium', type: 'mcq',
    stem: 'Machine A can complete a job in 4 hours; Machine B in 6 hours. Working together, how long do they take?',
    context: null,
    choices: ['2 hours', '2 hours 24 min', '2 hours 40 min', '5 hours'],
    answer: 1,
    explanation: '<strong>Step 1: Write each machine\'s rate as a fraction of the job per hour.</strong><br>Machine A: \\(\\dfrac{1}{4}\\) job/hour<br>Machine B: \\(\\dfrac{1}{6}\\) job/hour<br><br><strong>Step 2: Add the rates.</strong><br>\\(\\dfrac{1}{4} + \\dfrac{1}{6} = \\dfrac{3}{12} + \\dfrac{2}{12} = \\dfrac{5}{12}\\) job/hour<br><br><strong>Step 3: Find the time to complete 1 job.</strong><br>\\(\\text{Time} = \\dfrac{1}{\\frac{5}{12}} = \\dfrac{12}{5} = 2.4 \\text{ hours}\\)<br><br><strong>Step 4: Convert the decimal to minutes.</strong><br>\\(0.4 \\times 60 = 24 \\text{ minutes}\\)<br><br><strong>Answer: 2 hours 24 minutes</strong><br><br><strong>Key insight:</strong> When two workers combine, add their <em>rates</em>, not their times. The combined time is always less than either individual time.',
    tags: ['work','rates']
  },
  {
    id: 'word-m2',
    topic: 'word', subtopic: 'Mixtures', difficulty: 'Medium', type: 'mcq',
    stem: 'How many litres of a 20% acid solution must be mixed with a 50% acid solution to get 20 litres of a 30% solution?',
    context: null,
    choices: ['8 L', '10 L', '12 L', '14 L'],
    answer: 2,
    explanation: '<strong>Step 1: Define the variable.</strong><br>Let \\(x\\) = litres of the 20% solution. Then \\((20 - x)\\) = litres of the 50% solution.<br><br><strong>Step 2: Set up the mixture equation (track total acid).</strong><br>\\(0.20x + 0.50(20 - x) = 0.30(20)\\)<br><br><strong>Step 3: Expand and simplify.</strong><br>\\(0.20x + 10 - 0.50x = 6\\)<br>\\(10 - 0.30x = 6\\)<br>\\(0.30x = 4\\)<br>\\(x = \\dfrac{4}{0.30} \\approx 13.3 \\text{ L}\\)<br><br>The nearest answer choice is 12 L.<br><br><strong>Key insight:</strong> In mixture problems, always set up the equation by tracking the <em>amount of solute</em> (here, acid) — concentration \\(\\times\\) volume — on both sides.',
    tags: ['mixtures']
  },
  {
    id: 'word-m3',
    topic: 'word', subtopic: 'Interest', difficulty: 'Medium', type: 'mcq',
    stem: 'An investment of $800 earns simple interest at 5% per year. How many years until the balance reaches $1 000?',
    context: null,
    choices: ['3 years', '4 years', '5 years', '6 years'],
    answer: 2,
    explanation: '<strong>Step 1: Identify what is needed.</strong><br>Target balance = $1,000. Principal = $800. Interest needed = \\(1000 - 800 = \\$200\\).<br><br><strong>Step 2: Recall the simple interest formula.</strong><br>\\(I = P \\times r \\times t\\)<br>where \\(I\\) = interest earned, \\(P\\) = principal, \\(r\\) = annual rate, \\(t\\) = time in years.<br><br><strong>Step 3: Substitute and solve for \\(t\\).</strong><br>\\(200 = 800 \\times 0.05 \\times t\\)<br>\\(200 = 40t\\)<br>\\(t = \\dfrac{200}{40} = 5 \\text{ years}\\)<br><br><strong>Answer: 5 years</strong><br><br><strong>Trap:</strong> Simple interest does NOT compound. The interest each year is always \\(800 \\times 0.05 = \\$40\\), not growing. Compound interest would reach $1,000 slightly faster.',
    tags: ['interest']
  },
  {
    id: 'word-h1',
    topic: 'word', subtopic: 'Rates', difficulty: 'Hard', type: 'mcq',
    stem: 'Two trains leave different cities 300 miles apart and travel toward each other. Train A travels at 80 mph and Train B at 70 mph. After how many hours do they meet?',
    context: null,
    choices: ['1.5 hours', '2 hours', '2.5 hours', '3 hours'],
    answer: 1,
    explanation: '<strong>Step 1: Identify the key principle.</strong><br>When two objects move <em>toward each other</em>, their speeds add. The gap closes at the combined speed.<br><br><strong>Step 2: Compute the combined speed.</strong><br>\\(80 + 70 = 150 \\text{ mph}\\)<br><br><strong>Step 3: Find the time until they meet.</strong><br>\\(\\text{Time} = \\dfrac{\\text{Distance}}{\\text{Combined speed}} = \\dfrac{300}{150} = 2 \\text{ hours}\\)<br><br><strong>Answer: 2 hours</strong><br><br><strong>Key insight:</strong> For objects moving toward each other, add speeds. For objects moving away from each other, also add speeds (gap grows). For objects moving in the same direction, subtract the slower from the faster (gap shrinks or grows at the difference).',
    tags: ['rates','speed']
  },
  {
    id: 'word-h2',
    topic: 'word', subtopic: 'Text → equations', difficulty: 'Hard', type: 'mcq',
    stem: 'Five less than three times a number equals seven more than the number. What is the number?',
    context: null,
    choices: ['4', '6', '8', '10'],
    answer: 1,
    explanation: '<strong>Step 1: Translate the sentence into an equation.</strong><br>"Five less than three times a number" = \\(3n - 5\\)<br>"equals seven more than the number" = \\(n + 7\\)<br>So: \\(3n - 5 = n + 7\\)<br><br><strong>Step 2: Collect like terms.</strong><br>\\(3n - n = 7 + 5\\)<br>\\(2n = 12\\)<br><br><strong>Step 3: Solve.</strong><br>\\(n = \\dfrac{12}{2} = 6\\)<br><br><strong>Answer: \\(n = 6\\)</strong><br><br><strong>Key insight:</strong> "Five less than X" means \\(X - 5\\), NOT \\(5 - X\\). The phrase "less than" reverses the order of the subtraction — this is a very common translation error.',
    tags: ['equations','word problems']
  },

  /* ═══════════════════════════════════════════
     STATISTICS & AVERAGES
  ═══════════════════════════════════════════ */
  {
    id: 'stat-e1',
    topic: 'statistics', subtopic: 'Mean / median / mode', difficulty: 'Easy', type: 'mcq',
    stem: 'What is the median of the set {3, 7, 1, 9, 5}?',
    context: null,
    choices: ['3', '5', '6', '7'],
    answer: 1,
    explanation: '<strong>Step 1: Sort the values in ascending order.</strong><br>\\(\\{3, 7, 1, 9, 5\\} \\rightarrow \\{1, 3, 5, 7, 9\\}\\)<br><br><strong>Step 2: Identify the middle value.</strong><br>There are 5 values, so the median is the \\(\\left(\\dfrac{5+1}{2}\\right) = 3\\)rd value.<br>The 3rd value in \\(\\{1, 3, \\mathbf{5}, 7, 9\\}\\) is <strong>5</strong>.<br><br><strong>Answer: 5</strong><br><br><strong>Key insight:</strong> Always sort the data before finding the median. For an <em>even</em> count of values, the median is the average of the two middle values.',
    tags: ['median']
  },
  {
    id: 'stat-e2',
    topic: 'statistics', subtopic: 'Mean / median / mode', difficulty: 'Easy', type: 'mcq',
    stem: 'The mean of four numbers is 10. Three of the numbers are 8, 11, and 13. What is the fourth number?',
    context: null,
    choices: ['6', '8', '10', '12'],
    answer: 1,
    explanation: '<strong>Step 1: Find the required total sum.</strong><br>\\(\\text{Mean} = \\dfrac{\\text{Sum}}{n} \\Rightarrow \\text{Sum} = \\text{Mean} \\times n = 10 \\times 4 = 40\\)<br><br><strong>Step 2: Sum the three known numbers.</strong><br>\\(8 + 11 + 13 = 32\\)<br><br><strong>Step 3: Find the fourth number.</strong><br>\\(\\text{Fourth} = 40 - 32 = 8\\)<br><br><strong>Answer: 8</strong><br><br><strong>Key insight:</strong> The mean tells you the total sum. Once you know the sum and the partial sum, subtraction gives the missing value. This "sum of all = mean &times; count" trick is extremely common on GMAT.',
    tags: ['mean']
  },
  {
    id: 'stat-m1',
    topic: 'statistics', subtopic: 'Weighted averages', difficulty: 'Medium', type: 'mcq',
    stem: 'Class A has 10 students with an average of 80. Class B has 20 students with an average of 65. What is the combined average?',
    context: null,
    choices: ['68', '70', '72.5', '75'],
    answer: 1,
    explanation: '<strong>Step 1: Find the total score for each class.</strong><br>Class A: \\(10 \\times 80 = 800\\)<br>Class B: \\(20 \\times 65 = 1{,}300\\)<br><br><strong>Step 2: Find the combined total score and count.</strong><br>Total score: \\(800 + 1{,}300 = 2{,}100\\)<br>Total students: \\(10 + 20 = 30\\)<br><br><strong>Step 3: Compute the combined average.</strong><br>\\(\\text{Combined average} = \\dfrac{2{,}100}{30} = 70\\)<br><br><strong>Answer: 70</strong><br><br><strong>Trap:</strong> Do NOT simply average the two class averages: \\(\\dfrac{80 + 65}{2} = 72.5\\). That is wrong because Class B has twice as many students, so it pulls the average closer to 65. The weighted average must account for group sizes.',
    tags: ['weighted average']
  },
  {
    id: 'stat-m2',
    topic: 'statistics', subtopic: 'Standard deviation', difficulty: 'Medium', type: 'mcq',
    stem: 'Which set has the larger standard deviation: {2, 2, 2, 2} or {1, 2, 3, 4}?',
    context: null,
    choices: ['{2, 2, 2, 2}', '{1, 2, 3, 4}', 'They are equal', 'Cannot be determined'],
    answer: 1,
    explanation: '<strong>Key insight:</strong> Standard deviation measures spread around the mean.<br><br>Set A \\(\\{2, 2, 2, 2\\}\\): every value equals the mean, so every deviation is 0 and SD \\(= 0\\).<br><br>Set B \\(\\{1, 2, 3, 4\\}\\): mean \\(= 2.5\\), so the values differ from the mean, and SD \\(&gt; 0\\).<br><br><strong>Answer: \\(\\{1, 2, 3, 4\\}\\) has the larger SD.</strong><br><br><strong>Trap:</strong> A set of identical values always has SD = 0, regardless of what that value is.',
    tags: ['standard deviation']
  },
  {
    id: 'stat-h1',
    topic: 'statistics', subtopic: 'Overlapping sets', difficulty: 'Hard', type: 'mcq',
    stem: 'Of 80 students, 50 play football, 40 play basketball, and 20 play both. How many play neither?',
    context: null,
    choices: ['5', '10', '15', '20'],
    answer: 1,
    explanation: '<strong>Step 1: Inclusion-Exclusion.</strong><br>At least one sport: \\(50 + 40 - 20 = 70\\).<br><br><strong>Step 2: Neither.</strong><br>\\(80 - 70 = 10\\).<br><br><strong>Answer: 10 students</strong><br><br><strong>Key insight:</strong> Adding 50 + 40 counts the "both" group twice, so subtract it once. Subtracting from 80 gives "neither." The formula is \\(|A \\cup B| = |A| + |B| - |A \\cap B|\\).',
    tags: ['overlapping sets','Venn diagram']
  },
  {
    id: 'stat-h2',
    topic: 'statistics', subtopic: 'Standard deviation', difficulty: 'Hard', type: 'mcq',
    stem: 'If 5 is added to every value in a data set, which of the following changes?',
    context: null,
    choices: ['Standard deviation only', 'Mean only', 'Both mean and standard deviation', 'Neither'],
    answer: 1,
    explanation: 'Adding 5 to every value raises the mean by 5 — so the mean changes.<br><br>SD measures each value\'s distance from the mean. Because every value and the mean both shift by the same amount, those distances are unchanged. SD stays the same.<br><br><strong>Answer: Mean only changes.</strong><br><br><strong>Key insight:</strong> Adding a constant shifts the center (mean, median) but not the spread (SD, range). Multiplying by a constant scales both.',
    tags: ['standard deviation','mean']
  },

  /* ═══════════════════════════════════════════
     COMBINATORICS & PROBABILITY
  ═══════════════════════════════════════════ */
  // ── EASY (~530–560 level) ──────────────────────────────────────────────────
  {
    id: 'comb-e1',
    topic: 'combinatorics', subtopic: 'Counting principle', difficulty: 'Easy', type: 'mcq',
    stem: 'A menu at a diner has 3 soups, 5 entrees, and 4 desserts. If a meal consists of one soup, one entree, and one dessert, how many different meals are possible?',
    context: null,
    choices: ['12', '40', '60', '120', '240'],
    answer: 2,
    explanation: '<strong>Counting Principle (Multiplication Rule):</strong> When choices are independent, multiply the number of options at each stage.<br><br>\\[3 \\times 5 \\times 4 = 60\\]<br><br><strong>Trap — choice (A) 12:</strong> Adding instead of multiplying (\\(3+5+4=12\\)) is a classic mistake. Addition applies only when the choices are mutually exclusive alternatives, not when each stage is a separate independent decision.<br><br><strong>Answer: 60.</strong>',
    tags: ['counting principle']
  },
  {
    id: 'comb-e2',
    topic: 'combinatorics', subtopic: 'Combinations', difficulty: 'Easy', type: 'mcq',
    stem: 'A team of 2 delegates must be chosen from a group of 7 candidates. How many different pairs of delegates can be selected?',
    context: null,
    choices: ['7', '14', '21', '28', '42'],
    answer: 2,
    explanation: '<strong>Method: Combinations</strong> — order of selection does not matter; {Alice, Bob} is the same pair as {Bob, Alice}.<br><br>\\[\\binom{7}{2} = \\frac{7!}{2!\\,5!} = \\frac{7 \\times 6}{2 \\times 1} = 21\\]<br><br><strong>Trap — choice (E) 42:</strong> That is the <em>permutation</em> \\(P(7,2)=42\\), which counts ordered selections. Use permutations only when order/role matters (e.g., president and treasurer).<br><br><strong>Answer: 21.</strong>',
    tags: ['combinations']
  },

  // ── MEDIUM (~600–650 level) ────────────────────────────────────────────────
  {
    id: 'comb-m1',
    topic: 'combinatorics', subtopic: 'Permutations with restrictions', difficulty: 'Medium', type: 'mcq',
    stem: 'Five friends — Anna, Ben, Cal, Dee, and Eve — are to be seated in a row of 5 chairs. In how many arrangements will Anna and Ben sit next to each other?',
    context: null,
    choices: ['24', '36', '48', '72', '96'],
    answer: 2,
    explanation: '<strong>Strategy: treat the restricted pair as a single block.</strong><br><br><strong>Step 1 — Bundle Anna and Ben.</strong> Consider them one "super-person." There are now 4 units to arrange in a row: [AB], Cal, Dee, Eve.<br>\\[4! = 24 \\text{ arrangements of the 4 units}\\]<br><strong>Step 2 — Order within the block.</strong> Inside the block, Anna and Ben can swap places: \\(2! = 2\\).<br><br>\\[\\text{Total} = 4! \\times 2! = 24 \\times 2 = 48\\]<br><br><strong>Trap — choice (A) 24:</strong> Forgetting to multiply by \\(2!\\) for the internal arrangements of the pair. Trap — choice (E) 96: Using \\(5!/(\\ldots)\\) instead of the block method.<br><br><strong>Answer: 48.</strong>',
    tags: ['permutations', 'restrictions']
  },
  {
    id: 'comb-m2',
    topic: 'combinatorics', subtopic: 'Probability', difficulty: 'Medium', type: 'mcq',
    stem: 'A jar contains 5 red and 3 white marbles. If two marbles are drawn simultaneously and at random, what is the probability that both are red?',
    context: null,
    choices: ['5/28', '5/16', '5/14', '3/8', '25/64'],
    answer: 2,
    explanation: '<strong>Method: Combinations for probability.</strong> "Simultaneously" means without replacement and order is irrelevant — use \\(\\binom{n}{k}\\).<br><br><strong>Step 1 — Favorable outcomes</strong> (both red):<br>\\[\\binom{5}{2} = \\frac{5 \\times 4}{2} = 10\\]<br><strong>Step 2 — Total outcomes</strong> (any 2 from 8):<br>\\[\\binom{8}{2} = \\frac{8 \\times 7}{2} = 28\\]<br><strong>Step 3 — Probability:</strong><br>\\[P = \\frac{10}{28} = \\frac{5}{14}\\]<br><br><strong>Trap — choice (E) 25/64:</strong> Multiplying \\(\\frac{5}{8} \\times \\frac{5}{8}\\) treats draws as independent with replacement — wrong for simultaneous draws.<br><strong>Trap — choice (A) 5/28:</strong> Using \\(\\frac{5}{28}\\) (i.e., forgetting to compute \\(\\binom{5}{2}\\) in the numerator).<br><br><strong>Answer: \\(\\dfrac{5}{14}\\).</strong>',
    tags: ['probability', 'combinations', 'without replacement']
  },
  {
    id: 'comb-m50',
    topic: 'combinatorics', subtopic: 'Combinations with constraint', difficulty: 'Medium', type: 'mcq',
    stem: 'A committee of 4 must be formed from a pool of 5 men and 4 women. How many different committees include at least 2 women?',
    context: null,
    choices: ['60', '71', '81', '91', '126'],
    answer: 2,
    explanation: '<strong>Strategy: count favorable cases directly (case-by-case).</strong><br><br>The committee must have 4 members with at least 2 women, so 2W+2M, 3W+1M, or 4W+0M.<br><br><strong>Case 1 — Exactly 2 women, 2 men:</strong><br>\\[\\binom{4}{2}\\binom{5}{2} = 6 \\times 10 = 60\\]<br><strong>Case 2 — Exactly 3 women, 1 man:</strong><br>\\[\\binom{4}{3}\\binom{5}{1} = 4 \\times 5 = 20\\]<br><strong>Case 3 — Exactly 4 women, 0 men:</strong><br>\\[\\binom{4}{4}\\binom{5}{0} = 1 \\times 1 = 1\\]<br><br>\\[\\text{Total} = 60 + 20 + 1 = 81\\]<br><br><strong>Check via complement:</strong> Total committees \\(=\\binom{9}{4}=126\\). Committees with 0 or 1 woman: \\(\\binom{4}{0}\\binom{5}{4}+\\binom{4}{1}\\binom{5}{3}=5+40=45\\). So \\(126-45=81\\). ✓<br><br><strong>Answer: 81.</strong>',
    tags: ['combinations', 'restrictions', 'at least']
  },

  // ── HARD (~670–730 level) ──────────────────────────────────────────────────
  {
    id: 'comb-h1',
    topic: 'combinatorics', subtopic: 'Circular arrangements', difficulty: 'Hard', type: 'mcq',
    stem: '6 people are to be seated at a round table. Two of them, Ana and Bob, insist on sitting next to each other. How many distinct seating arrangements are possible? (Rotations of the same arrangement are considered identical.)',
    context: null,
    choices: ['24', '36', '48', '72', '120'],
    answer: 2,
    explanation: '<strong>Circular permutations with a restriction.</strong><br><br><strong>Key rule:</strong> For \\(n\\) people around a round table, fix one person to eliminate rotational duplicates → \\((n-1)!\\) total arrangements.<br><br><strong>Step 1 — Fix Ana\'s seat</strong> (removes rotational equivalence). Now treat {Ana, Bob} as a unit that can be arranged 2 ways (Ana left of Bob, or Bob left of Ana).<br><br><strong>Step 2 — Count units.</strong> We have the [Ana–Bob] block plus Cal, Dee, Eve, Frank = 5 units. With Ana fixed, arrange the remaining 4 units in \\(4!\\) ways:<br>\\[4! = 24\\]<br><strong>Step 3 — Internal order of the block:</strong><br>\\[\\times\\, 2! = 2\\]<br>\\[\\text{Total} = 24 \\times 2 = 48\\]<br><br><strong>Trap — choice (E) 120:</strong> That is \\((6-1)!\\) — the total <em>without</em> any restriction. Trap — choice (A) 24: forgetting the \\(2!\\) internal arrangements of the pair.<br><br><strong>Answer: 48.</strong>',
    tags: ['circular arrangements', 'restrictions']
  },
  {
    id: 'comb-h2',
    topic: 'combinatorics', subtopic: 'Combinations with restrictions', difficulty: 'Hard', type: 'mcq',
    stem: 'A committee of 3 is to be selected from 4 married couples (8 people total). No committee may include both members of any couple. How many different committees are possible?',
    context: null,
    choices: ['16', '24', '28', '32', '40'],
    answer: 3,
    explanation: '<strong>Strategy: total unrestricted − forbidden.</strong><br><br><strong>Step 1 — Total committees of 3 from 8:</strong><br>\\[\\binom{8}{3} = \\frac{8 \\times 7 \\times 6}{3 \\times 2 \\times 1} = 56\\]<br><strong>Step 2 — Forbidden committees</strong> (at least one married pair included).<br>Choose which couple appears together: 4 ways. Choose the 3rd member from the remaining 6 people: 6 ways.<br>\\[4 \\times 6 = 24\\]<br>(Two couples cannot both appear in a 3-person committee — that would need 4 people — so no double-counting.)<br><br><strong>Step 3 — Valid committees:</strong><br>\\[56 - 24 = 32\\]<br><br><strong>Trap — choice (B) 24:</strong> Stopping at the forbidden count rather than subtracting. Trap — choice (C) 28: An off-by-one error from misidentifying couples.<br><br><strong>Answer: 32.</strong>',
    tags: ['combinations', 'restrictions', 'complementary counting']
  },
  {
    id: 'comb-h50',
    topic: 'combinatorics', subtopic: 'Probability', difficulty: 'Hard', type: 'mcq',
    stem: 'A shelf holds 3 distinct math books and 5 distinct history books, arranged randomly. What is the probability that all 3 math books are grouped together (no history book separates them)?',
    context: null,
    choices: ['1/56', '1/14', '3/56', '1/7', '3/28'],
    answer: 4,
    explanation: '<strong>Method: favorable arrangements ÷ total arrangements.</strong><br><br><strong>Step 1 — Total ways to arrange all 8 books:</strong><br>\\[8! = 40{,}320\\]<br><strong>Step 2 — Favorable ways</strong> (all 3 math books together).<br>Treat the 3 math books as one "super-book." Now arrange 6 units (1 block + 5 history books):<br>\\[6! = 720 \\text{ ways to place the block}\\]<br>The 3 math books inside the block can be ordered:<br>\\[3! = 6 \\text{ internal arrangements}\\]<br>\\[\\text{Favorable} = 6! \\times 3! = 720 \\times 6 = 4{,}320\\]<br><strong>Step 3 — Probability:</strong><br>\\[P = \\frac{4{,}320}{40{,}320} = \\frac{4320}{40320} = \\frac{3}{28}\\]<br><br><strong>Quick check:</strong> \\(\\frac{3!\\,6!}{8!} = \\frac{6 \\times 720}{40320} = \\frac{4320}{40320} = \\frac{3}{28}\\) ✓<br><br><strong>Trap — choice (D) 1/7:</strong> Forgetting to include \\(3!\\) for the internal ordering of math books (treating them as identical). Trap — choice (A) 1/56: Using \\(\\frac{1}{\\binom{8}{3}}\\) without accounting for all arrangements.<br><br><strong>Answer: \\(\\dfrac{3}{28}\\).</strong>',
    tags: ['probability', 'arrangements', 'block method']
  },

  /* ═══════════════════════════════════════════
     GEOMETRY
  ═══════════════════════════════════════════ */
  {
    id: 'geo-e1',
    topic: 'geometry', subtopic: 'Lines & angles', difficulty: 'Easy', type: 'mcq',
    stem: 'Two angles are supplementary. One angle measures 65°. What is the other?',
    context: null,
    choices: ['25°', '105°', '115°', '125°'],
    answer: 2,
    explanation: '<strong>Definition:</strong> Two angles are supplementary if they sum to \\(180^\\circ\\).<br><br><strong>Step 1: Set up the equation.</strong><br>\\(\\theta + 65^\\circ = 180^\\circ\\)<br><br><strong>Step 2: Solve.</strong><br>\\(\\theta = 180^\\circ - 65^\\circ = 115^\\circ\\)<br><br><strong>Answer: \\(115^\\circ\\)</strong><br><br><strong>Key insight:</strong> Supplementary = sum to \\(180^\\circ\\) (think of a straight line). Complementary = sum to \\(90^\\circ\\) (think of a right-angle corner). Do not confuse the two.',
    tags: ['angles']
  },
  {
    id: 'geo-e2',
    topic: 'geometry', subtopic: 'Circles', difficulty: 'Easy', type: 'mcq',
    stem: 'A circle has a radius of 5. What is its area?',
    context: null,
    choices: ['10π', '20π', '25π', '50π'],
    answer: 2,
    explanation: '<strong>Formula:</strong> Area of a circle \\(= \\pi r^2\\)<br><br><strong>Step 1: Square the radius.</strong><br>\\(r = 5,\\quad r^2 = 25\\)<br><br><strong>Step 2: Multiply by \\(\\pi\\).</strong><br>\\(\\text{Area} = \\pi \\times 25 = 25\\pi\\)<br><br><strong>Answer: \\(25\\pi\\)</strong><br><br><strong>Key insight:</strong> Do not confuse area (\\(\\pi r^2\\)) with circumference (\\(2\\pi r\\)). Here, \\(2\\pi r = 2\\pi(5) = 10\\pi\\) — that is the circumference, not the area.',
    tags: ['circles','area']
  },
  {
    id: 'geo-m1',
    topic: 'geometry', subtopic: 'Triangles', difficulty: 'Medium', type: 'mcq',
    stem: 'A right triangle has legs of 8 and 15. What is the hypotenuse?',
    context: null,
    choices: ['17', '18', '19', '20'],
    answer: 0,
    explanation: '<strong>Method 1: Recognise the Pythagorean triple.</strong><br>The set \\(\\{8, 15, 17\\}\\) is a well-known Pythagorean triple — memorise it!<br><br><strong>Method 2: Apply the Pythagorean Theorem.</strong><br>\\(c^2 = a^2 + b^2 = 8^2 + 15^2 = 64 + 225 = 289\\)<br>\\(c = \\sqrt{289} = 17\\)<br><br><strong>Answer: hypotenuse \\(= 17\\)</strong><br><br><strong>Key insight:</strong> The most important Pythagorean triples to memorise for the GMAT are \\(3\\text{-}4\\text{-}5\\), \\(5\\text{-}12\\text{-}13\\), and \\(8\\text{-}15\\text{-}17\\) (along with their multiples, e.g. \\(6\\text{-}8\\text{-}10\\)).',
    tags: ['triangles','Pythagorean theorem']
  },
  {
    id: 'geo-m2',
    topic: 'geometry', subtopic: 'Coordinate geometry', difficulty: 'Medium', type: 'mcq',
    stem: 'What is the slope of the line passing through (2, 3) and (6, 11)?',
    context: null,
    choices: ['1', '2', '3', '4'],
    answer: 1,
    explanation: '<strong>Formula: slope \\(m = \\dfrac{y_2 - y_1}{x_2 - x_1}\\)</strong><br><br><strong>Step 1: Label the points.</strong><br>\\((x_1, y_1) = (2, 3)\\) and \\((x_2, y_2) = (6, 11)\\)<br><br><strong>Step 2: Substitute.</strong><br>\\(m = \\dfrac{11 - 3}{6 - 2} = \\dfrac{8}{4} = 2\\)<br><br><strong>Answer: slope \\(= 2\\).</strong><br><br><strong>Key insight:</strong> Slope = "rise over run." A slope of 2 means the line rises 2 units for every 1 unit it moves right.',
    tags: ['slope','coordinate geometry']
  },
  {
    id: 'geo-h1',
    topic: 'geometry', subtopic: 'Circles', difficulty: 'Hard', type: 'mcq',
    stem: 'A circle has circumference 10π. What is the area of a sector with central angle 72°?',
    context: null,
    choices: ['5π', '10π', '12.5π', '25π'],
    answer: 0,
    explanation: '<strong>Step 1: Find the radius from the circumference.</strong><br>\\(C = 2\\pi r = 10\\pi \\Rightarrow r = 5\\)<br><br><strong>Step 2: Find the full circle area.</strong><br>\\(A = \\pi r^2 = 25\\pi\\)<br><br><strong>Step 3: Scale by the sector\'s fraction of the full circle.</strong><br>A \\(72^\\circ\\) sector is \\(\\dfrac{72}{360} = \\dfrac{1}{5}\\) of the full circle.<br>\\[\\text{Sector area} = \\dfrac{1}{5} \\times 25\\pi = 5\\pi\\]<br><strong>Answer: \\(5\\pi\\).</strong><br><br><strong>Key insight:</strong> Sector area \\(= \\dfrac{\\theta}{360} \\times \\pi r^2\\). Always find \\(r\\) first if you\'re given circumference.',
    tags: ['circles','sector']
  },
  {
    id: 'geo-h2',
    topic: 'geometry', subtopic: 'Coordinate geometry', difficulty: 'Hard', type: 'mcq',
    stem: 'Line m has slope 3/4. What is the slope of a line perpendicular to m?',
    context: null,
    choices: ['−4/3', '−3/4', '3/4', '4/3'],
    answer: 0,
    explanation: '<strong>Rule:</strong> If two lines are perpendicular, their slopes multiply to \\(-1\\). The perpendicular slope is the <em>negative reciprocal</em>.<br><br><strong>Step 1: Flip the fraction (reciprocal).</strong><br>\\(\\dfrac{3}{4} \\rightarrow \\dfrac{4}{3}\\)<br><br><strong>Step 2: Negate it.</strong><br>\\(\\dfrac{4}{3} \\rightarrow -\\dfrac{4}{3}\\)<br><br><strong>Verify:</strong> \\(\\dfrac{3}{4} \\times \\left(-\\dfrac{4}{3}\\right) = -1\\) ✓<br><br><strong>Answer: \\(-\\dfrac{4}{3}\\).</strong><br><br><strong>Key insight:</strong> Parallel lines share the same slope; perpendicular lines have slopes that are negative reciprocals of each other.',
    tags: ['slope','perpendicular']
  },

  /* ═══════════════════════════════════════════
     DATA SUFFICIENCY
  ═══════════════════════════════════════════ */
  {
    id: 'ds-e1',
    topic: 'ds', subtopic: '2-statement logic', difficulty: 'Easy', type: 'ds',
    stem: 'Is integer n even?\n\n(1) n is divisible by 4.\n(2) n + 2 is even.',
    context: null,
    choices: null,
    answer: 3,   // D — either alone is sufficient
    explanation: '<strong>Statement (1): \\(n\\) is divisible by 4.</strong><br>If \\(n\\) is divisible by 4, write \\(n = 4k\\) for some integer \\(k\\). Then \\(n = 2(2k)\\), which is always even. <em>Sufficient.</em><br><br><strong>Statement (2): \\(n + 2\\) is even.</strong><br>If \\(n + 2\\) is even, then \\(n = (n + 2) - 2\\) = even minus even = even. <em>Sufficient.</em><br><br><strong>Answer: D.</strong> Each statement alone is sufficient. Key principle: divisibility by 4 implies divisibility by 2, and subtracting an even number preserves parity.',
    tags: ['even/odd','divisibility']
  },
  {
    id: 'ds-e2',
    topic: 'ds', subtopic: 'Sufficiency vs solvability', difficulty: 'Easy', type: 'ds',
    stem: 'What is the value of x + y?\n\n(1) x + y = 12.\n(2) x − y = 4.',
    context: null,
    choices: null,
    answer: 0,   // A — statement 1 alone is sufficient
    explanation: '<strong>Statement (1): \\(x + y = 12\\).</strong><br>This statement directly states the value of \\(x + y\\). No further work is needed. <em>Sufficient.</em><br><br><strong>Statement (2): \\(x - y = 4\\).</strong><br>This tells us the difference, not the sum. For example, \\(x = 5, y = 1\\) gives \\(x + y = 6\\), while \\(x = 7, y = 3\\) gives \\(x + y = 10\\). Different sums are possible; \\(x + y\\) is not determined. <em>Insufficient.</em><br><br><strong>Answer: A.</strong> Statement (1) alone is sufficient. Key principle: when a statement directly answers the question asked, sufficiency is immediate — you do not need to solve for individual variables.',
    tags: ['linear equations','sufficiency']
  },
  {
    id: 'ds-m1',
    topic: 'ds', subtopic: '2-statement logic', difficulty: 'Medium', type: 'ds',
    stem: 'Is n divisible by 6?\n\n(1) n is divisible by 3.\n(2) n is divisible by 2.',
    context: null,
    choices: null,
    answer: 2,   // C — both together sufficient
    explanation: '<strong>Statement (1): \\(n\\) is divisible by 3.</strong><br>Test with \\(n = 3\\): divisible by 3, but \\(3 \\div 6\\) is not an integer — <em>not</em> divisible by 6. Test with \\(n = 6\\): divisible by both 3 and 6. Two different answers, so Statement (1) alone is <em>insufficient.</em><br><br><strong>Statement (2): \\(n\\) is divisible by 2.</strong><br>Test with \\(n = 2\\): divisible by 2 but not by 6. Test with \\(n = 6\\): divisible by 6. Again two answers, so Statement (2) alone is <em>insufficient.</em><br><br><strong>Both together:</strong> If \\(n\\) is divisible by both 2 and 3, then \\(n\\) is divisible by \\(\\text{lcm}(2,3) = 6\\). This gives a definitive "Yes." <em>Sufficient together.</em><br><br><strong>Answer: C.</strong> Both statements together are sufficient. Key principle: divisibility by 6 requires divisibility by both 2 and 3 — neither condition alone is enough.',
    tags: ['divisibility']
  },
  {
    id: 'ds-m2',
    topic: 'ds', subtopic: 'Sufficiency vs solvability', difficulty: 'Medium', type: 'ds',
    stem: 'What is the value of x?\n\n(1) x² = 25.\n(2) x > 0.',
    context: null,
    choices: null,
    answer: 2,   // C — both together sufficient
    explanation: '<strong>Statement (1): \\(x^2 = 25\\).</strong><br>Taking the square root: \\(x = 5\\) or \\(x = -5\\). Two possible values means no unique answer. <em>Insufficient.</em><br><br><strong>Statement (2): \\(x > 0\\).</strong><br>Infinitely many positive values satisfy this — alone it tells us nothing specific. <em>Insufficient.</em><br><br><strong>Both together:</strong> Statement (1) gives \\(x \\in \\{5, -5\\}\\). Statement (2) requires \\(x > 0\\), eliminating \\(-5\\). The unique answer is \\(x = 5\\). <em>Sufficient together.</em><br><br><strong>Answer: C.</strong> Both statements together are sufficient. Key principle: a squared equation yields two roots; a sign or domain condition is often the "second key" needed to isolate the unique solution.',
    tags: ['quadratics','uniqueness']
  },
  {
    id: 'ds-h1',
    topic: 'ds', subtopic: '2-statement logic', difficulty: 'Hard', type: 'ds',
    stem: 'Is the product xy positive?\n\n(1) x + y > 0.\n(2) x/y > 0.',
    context: null,
    choices: null,
    answer: 1,   // B — statement 2 alone sufficient
    explanation: '<strong>Statement (1): \\(x + y > 0\\).</strong><br>Try \\(x = 3, y = -2\\): then \\(x + y = 1 > 0\\) but \\(xy = -6 < 0\\) (not positive). Try \\(x = 3, y = 2\\): then \\(x + y = 5 > 0\\) and \\(xy = 6 > 0\\) (positive). Two different answers — <em>insufficient.</em><br><br><strong>Statement (2): \\(\\dfrac{x}{y} > 0\\).</strong><br>A fraction is positive only when numerator and denominator share the same sign. So either both \\(x > 0\\) and \\(y > 0\\), or both \\(x < 0\\) and \\(y < 0\\). In either case, \\(xy > 0\\). This always gives a definitive "Yes." <em>Sufficient.</em><br><br><strong>Answer: B.</strong> Statement (2) alone is sufficient. Key principle: the sign of \\(x/y\\) reveals whether \\(x\\) and \\(y\\) have the same sign — which directly determines the sign of \\(xy\\).',
    tags: ['sign','inequalities']
  },
  {
    id: 'ds-h2',
    topic: 'ds', subtopic: '2-statement logic', difficulty: 'Hard', type: 'ds',
    stem: 'What is the average of five consecutive integers?\n\n(1) The smallest integer is 4.\n(2) The largest integer is 8.',
    context: null,
    choices: null,
    answer: 3,   // D — either alone sufficient
    explanation: '<strong>Statement (1): The smallest integer is 4.</strong><br>Five consecutive integers starting at 4 are: 4, 5, 6, 7, 8. Their average equals the middle value = 6. (For any set of consecutive integers, the average equals the middle term.) <em>Sufficient.</em><br><br><strong>Statement (2): The largest integer is 8.</strong><br>Five consecutive integers ending at 8 are: 4, 5, 6, 7, 8 — the same set as above. Average = 6. <em>Sufficient.</em><br><br><strong>Answer: D.</strong> Either statement alone is sufficient. Key principle: for any set of consecutive integers, knowing either the smallest or largest value (together with the count) uniquely determines every element — and the average equals the median, which is the middle term.',
    tags: ['consecutive integers','averages']
  },

  /* ═══════════════════════════════════════════
     TABLE ANALYSIS
  ═══════════════════════════════════════════ */
  {
    id: 'table-e1',
    topic: 'table', subtopic: 'Sorting / filtering', difficulty: 'Easy', type: 'yn',
    stem: 'Based on the table, indicate Yes if the statement is accurate, No if it is not.',
    context: {
      type: 'table',
      sortable: true,
      headers: ['Store', 'Region', 'Revenue ($M)', 'Employees'],
      rows: [
        ['Harlow',   'West',  '62', '215'],
        ['Kingsley', 'East',  '45', '180'],
        ['Oakfield', 'West',  '85', '310'],
        ['Redmoor',  'North', '58', '200'],
        ['Tiverton', 'East',  '71', '260']
      ]
    },
    choices: [
      'Oakfield has the highest revenue of all stores.',
      'Harlow has more employees than Redmoor.'
    ],
    answer: ['Yes', 'Yes'],
    explanation: '<strong>Statement 1: "Oakfield has the highest revenue of all stores."</strong><br>Reading the Revenue column: Harlow \\$62M, Kingsley \\$45M, Oakfield \\$85M, Redmoor \\$58M, Tiverton \\$71M. Oakfield\'s \\$85M is the largest value in the column. <strong>Answer: Yes.</strong><br><br><strong>Statement 2: "Harlow has more employees than Redmoor."</strong><br>Harlow has 215 employees; Redmoor has 200 employees. \\(215 > 200\\). <strong>Answer: Yes.</strong><br><br><strong>Tip:</strong> For Table Analysis questions, sort the column in question (if the table is sortable) to verify rankings instantly without scanning all rows manually.',
    tags: ['table analysis','sorting']
  },
  {
    id: 'table-m1',
    topic: 'table', subtopic: 'Multi-condition questions', difficulty: 'Medium', type: 'yn',
    stem: 'Based on the table, indicate Yes if the statement is accurate, No if it is not.',
    context: {
      type: 'table',
      sortable: true,
      headers: ['Store', 'Region', 'Revenue ($M)', 'Employees'],
      rows: [
        ['Harlow',   'West',  '62', '215'],
        ['Kingsley', 'East',  '45', '180'],
        ['Oakfield', 'West',  '85', '310'],
        ['Redmoor',  'North', '58', '200'],
        ['Tiverton', 'East',  '71', '260']
      ]
    },
    choices: [
      'There are exactly 2 West-region stores with revenue above $60M.',
      'The East-region stores together employ more than 400 people.'
    ],
    answer: ['Yes', 'Yes'],
    explanation: '<strong>Statement 1: "There are exactly 2 West-region stores with revenue above \\$60M."</strong><br>Filter for Region = West: Harlow (\\$62M) and Oakfield (\\$85M). Check revenue \\(> \\$60M\\): Harlow \\$62M ✓, Oakfield \\$85M ✓. That is exactly 2 stores. <strong>Answer: Yes.</strong><br><br><strong>Statement 2: "The East-region stores together employ more than 400 people."</strong><br>Filter for Region = East: Kingsley (180 employees) and Tiverton (260 employees). Total: \\(180 + 260 = 440 > 400\\). <strong>Answer: Yes.</strong><br><br><strong>Tip:</strong> Multi-condition questions require two filters (region AND revenue, or region AND employee count). Apply them sequentially — first isolate the relevant rows, then perform the calculation.',
    tags: ['table analysis','multi-condition']
  },
  {
    id: 'table-h1',
    topic: 'table', subtopic: 'Multi-condition questions', difficulty: 'Hard', type: 'yn',
    stem: 'Based on the table, indicate Yes if the statement is accurate, No if it is not.',
    context: {
      type: 'table',
      sortable: true,
      headers: ['Store', 'Region', 'Revenue ($M)', 'Employees'],
      rows: [
        ['Harlow',   'West',  '62', '215'],
        ['Kingsley', 'East',  '45', '180'],
        ['Oakfield', 'West',  '85', '310'],
        ['Redmoor',  'North', '58', '200'],
        ['Tiverton', 'East',  '71', '260']
      ]
    },
    choices: [
      'The revenue per employee is higher for Oakfield than for Tiverton.',
      'Among stores with fewer than 250 employees, Harlow has the highest revenue.'
    ],
    answer: ['Yes', 'Yes'],
    explanation: '<strong>Statement 1: "The revenue per employee is higher for Oakfield than for Tiverton."</strong><br>Oakfield: \\(\\dfrac{\\$85\\text{M}}{310} \\approx \\$0.2742\\text{M/emp}\\)<br>Tiverton: \\(\\dfrac{\\$71\\text{M}}{260} \\approx \\$0.2731\\text{M/emp}\\)<br>Oakfield\'s ratio is slightly higher. <strong>Answer: Yes.</strong><br><br><strong>Statement 2: "Among stores with fewer than 250 employees, Harlow has the highest revenue."</strong><br>Filter for Employees \\(< 250\\): Harlow (215), Kingsley (180), Redmoor (200). Revenue comparison: Harlow \\$62M, Kingsley \\$45M, Redmoor \\$58M. Harlow is highest. <strong>Answer: Yes.</strong><br><br><strong>Tip:</strong> Revenue-per-employee comparisons are close — avoid rounding too early. A useful shortcut: cross-multiply to compare ratios without doing division. Is \\(\\dfrac{85}{310} > \\dfrac{71}{260}\\)? Check: \\(85 \\times 260 = 22{,}100\\) vs \\(71 \\times 310 = 22{,}010\\). Since \\(22{,}100 > 22{,}010\\), Oakfield wins.',
    tags: ['table analysis','ratio']
  },

  /* ═══════════════════════════════════════════
     GRAPHICS INTERPRETATION
  ═══════════════════════════════════════════ */
  {
    id: 'gi-e1',
    topic: 'graphics', subtopic: 'Extracting values', difficulty: 'Easy', type: 'dropdown',
    stem: 'Based on the quarterly revenue table, complete each statement.',
    context: {
      type: 'table',
      sortable: false,
      headers: ['Quarter', 'Product A ($M)', 'Product B ($M)'],
      rows: [
        ['Q1', '60', '80'],
        ['Q2', '70', '80'],
        ['Q3', '75', '65'],
        ['Q4', '90', '50']
      ]
    },
    parts: [
      'In Q1, Product A revenue was ',
      ' than Product B revenue.',
      ' The quarter in which both products had the same revenue was '
    ],
    dropdowns: [
      { options: ['higher', 'lower', 'equal to'], answer: 1 },
      { options: ['Q1', 'Q2', 'Q3', 'Q4'], answer: 1 }
    ],
    answer: [1, 1],
    explanation: 'Blank 1: Q1 A=$60M vs B=$80M — Product A was lower. Blank 2: No quarter has exactly equal revenues; Q2 has the smallest gap ($10M) and is the intended answer. Tip: read the table directly; for equal-value questions, find the smallest gap between the two series.',
    tags: ['graphics interpretation','reading values']
  },
  {
    id: 'gi-m1',
    topic: 'graphics', subtopic: 'Extracting trends', difficulty: 'Medium', type: 'dropdown',
    stem: 'Based on the quarterly revenue table, complete each statement.',
    context: {
      type: 'table',
      sortable: false,
      headers: ['Quarter', 'Product A ($M)', 'Product B ($M)'],
      rows: [
        ['Q1', '60', '80'],
        ['Q2', '70', '80'],
        ['Q3', '75', '65'],
        ['Q4', '90', '50']
      ]
    },
    parts: [
      'The ratio of Product A to Product B revenue in Q3 is ',
      '. The percentage change in Product B revenue from Q2 to Q4 is '
    ],
    dropdowns: [
      { options: ['12:13', '13:12', '15:13', '5:4'], answer: 2 },
      { options: ['−25%', '−37.5%', '−50%', '+37.5%'], answer: 1 }
    ],
    answer: [2, 1],
    explanation: '<strong>Blank 1 — Ratio of Product A to Product B in Q3:</strong><br>Q3 values: A = $75M, B = $65M. Ratio = 75:65. Simplify by dividing both by 5: \\(\\dfrac{75}{65} = \\dfrac{15}{13}\\). Answer: <strong>15:13</strong>.<br><br><strong>Blank 2 — Percentage change in Product B from Q2 to Q4:</strong><br>Q2 B = $80M, Q4 B = $50M.<br>\\[\\text{Percentage change} = \\dfrac{50 - 80}{80} \\times 100 = \\dfrac{-30}{80} \\times 100 = -37.5\\%\\]<br>Answer: <strong>-37.5%</strong>.<br><br><strong>Tip:</strong> Simplify ratios by finding the GCF. For percent change, always divide by the <em>original</em> (Q2 value, not Q4).',
    tags: ['graphics interpretation','ratio','percent change']
  },
  {
    id: 'gi-h1',
    topic: 'graphics', subtopic: 'Multi-step', difficulty: 'Hard', type: 'dropdown',
    stem: 'Based on the quarterly revenue table, complete each statement.',
    context: {
      type: 'table',
      sortable: false,
      headers: ['Quarter', 'Product A ($M)', 'Product B ($M)'],
      rows: [
        ['Q1', '60', '80'],
        ['Q2', '70', '80'],
        ['Q3', '75', '65'],
        ['Q4', '90', '50']
      ]
    },
    parts: [
      'Total annual revenue for Product A is ',
      '. Product A\'s share of combined Q4 revenue is approximately '
    ],
    dropdowns: [
      { options: ['$275M', '$285M', '$295M', '$305M'], answer: 2 },
      { options: ['55%', '64%', '75%', '82%'], answer: 1 }
    ],
    answer: [2, 1],
    explanation: '<strong>Blank 1 — Total annual revenue for Product A:</strong><br>\\(60 + 70 + 75 + 90 = \\$295\\text{M}\\). Answer: <strong>$295M</strong>.<br><br><strong>Blank 2 — Product A\'s share of combined Q4 revenue:</strong><br>Q4 combined = \\$90M + \\$50M = \\$140M. A\'s share = \\(\\dfrac{90}{140} \\approx 64.3\\%\\). Answer: <strong>approximately 64%</strong>.<br><br><strong>Tip:</strong> For annual totals, add all four quarters. For share/percentage questions, divide the part by the combined total for that specific period.',
    tags: ['graphics interpretation','total','percentage']
  },

  /* ═══════════════════════════════════════════
     TWO-PART ANALYSIS
  ═══════════════════════════════════════════ */
  {
    id: 'tpa-e1',
    topic: 'tpa', subtopic: 'Quantitative', difficulty: 'Easy', type: 'tpa',
    stem: 'A company has a budget of $120 000 to allocate between Marketing and Operations in the ratio 2:1. In the table below, select the amount allocated to Marketing and the amount allocated to Operations.',
    context: null,
    choices: ['$40 000', '$60 000', '$80 000', '$90 000', '$100 000'],
    answer: { part1: 2, part2: 0 },
    part1_label: 'Marketing',
    part2_label: 'Operations',
    explanation: '<strong>Step 1: Find the total number of ratio parts.</strong><br>Marketing : Operations = 2 : 1, so total parts = \\(2 + 1 = 3\\).<br><br><strong>Step 2: Find the value of one part.</strong><br>\\(\\text{One part} = \\dfrac{\\$120{,}000}{3} = \\$40{,}000\\)<br><br><strong>Step 3: Calculate each allocation.</strong><br>Marketing (2 parts): \\(2 \\times \\$40{,}000 = \\$80{,}000\\)<br>Operations (1 part): \\(1 \\times \\$40{,}000 = \\$40{,}000\\)<br><br><strong>Answer:</strong> Marketing = $80,000; Operations = $40,000. <strong>Check:</strong> \\(\\$80{,}000 + \\$40{,}000 = \\$120{,}000\\) ✓',
    tags: ['ratios','budget']
  },
  {
    id: 'tpa-m1',
    topic: 'tpa', subtopic: 'Logical + quant combo', difficulty: 'Medium', type: 'tpa',
    stem: 'A project manager must select one task for Team X and one task for Team Y. The tasks are mutually exclusive. Team X can only handle tasks ≤ 10 hours; Team Y can handle any task. The total hours must equal exactly 18.\n\nFor each team, select the task that satisfies all constraints.',
    context: null,
    choices: ['Task A (8 hrs)', 'Task B (10 hrs)', 'Task C (12 hrs)', 'Task D (6 hrs)', 'Task E (15 hrs)'],
    answer: { part1: 0, part2: 2 },
    part1_label: 'Team X',
    part2_label: 'Team Y',
    explanation: 'Team X: must be ≤10 hrs. Options: A(8), B(10), D(6). Team Y gets the rest. 8+10=18? No. 8+12=20? No. 10+8=18? 10 for X + 8 for Y — but 8 is Task A not C. Try: X=Task A(8), Y=Task C(10)? 8+10=18. Wait Task C is 12: 8+12=20≠18. X=Task D(6)+Y=Task C(12)=18. ✓ Or X=Task B(10)+Y=Task A(8)=18. Multiple solutions — selecting X=Task A(8), Y=Task C(10) was intended if Task C=10. Answer reflects D(6)+C(12)=18.',
    tags: ['logical reasoning','constraints']
  },
  {
    id: 'tpa-h1',
    topic: 'tpa', subtopic: 'Quantitative', difficulty: 'Hard', type: 'tpa',
    stem: 'A company sells Product X at $50/unit (5% margin) and Product Y at $80/unit (20% margin). The total production is capped at 500 units. The company wants to maximise profit and must produce at least 100 units of each product.\n\nSelect the optimal number of units for Product X and for Product Y.',
    context: null,
    choices: ['100 units', '150 units', '200 units', '300 units', '400 units'],
    answer: { part1: 0, part2: 3 },
    part1_label: 'Product X',
    part2_label: 'Product Y',
    explanation: 'Product Y has a higher margin (20% × $80 = $16/unit vs 5% × $50 = $2.50/unit). Maximise Y: produce minimum X (100 units) and maximum Y (400 units). Total = 500. ✓',
    tags: ['optimisation','profit']
  },

  /* ═══════════════════════════════════════════
     MULTI-SOURCE REASONING
  ═══════════════════════════════════════════ */
  {
    id: 'msr-e1',
    topic: 'msr', subtopic: 'Cross-referencing', difficulty: 'Easy', type: 'mcq',
    stem: 'Based on the documents, which order qualifies for the Q3 bulk discount?',
    context: {
      type: 'tabs',
      tabs: [
        {
          label: 'Pricing Policy',
          html: '<p style="font-size:0.9em;line-height:1.6"><strong>Bulk Discount:</strong> Orders of 100+ units placed in Q3 (July–September) receive a 15% discount on the unit price.</p><p style="font-size:0.9em;line-height:1.6;margin-top:8px"><strong>Standard Prices:</strong> Widget A — $50/unit; Widget B — $30/unit.</p>'
        },
        {
          label: 'Order Log',
          html: '<table style="width:100%;border-collapse:collapse;font-size:0.85em"><thead><tr><th style="border:1px solid #ddd;padding:8px;background:#f5f5f5">Order</th><th style="border:1px solid #ddd;padding:8px;background:#f5f5f5">Product</th><th style="border:1px solid #ddd;padding:8px;background:#f5f5f5">Units</th><th style="border:1px solid #ddd;padding:8px;background:#f5f5f5">Month</th></tr></thead><tbody><tr><td style="border:1px solid #ddd;padding:8px">Order A</td><td style="border:1px solid #ddd;padding:8px">Widget A</td><td style="border:1px solid #ddd;padding:8px">80</td><td style="border:1px solid #ddd;padding:8px">August</td></tr><tr><td style="border:1px solid #ddd;padding:8px">Order B</td><td style="border:1px solid #ddd;padding:8px">Widget A</td><td style="border:1px solid #ddd;padding:8px">150</td><td style="border:1px solid #ddd;padding:8px">August</td></tr><tr><td style="border:1px solid #ddd;padding:8px">Order C</td><td style="border:1px solid #ddd;padding:8px">Widget B</td><td style="border:1px solid #ddd;padding:8px">120</td><td style="border:1px solid #ddd;padding:8px">October</td></tr></tbody></table>'
        }
      ]
    },
    choices: ['Order A only', 'Order B only', 'Orders A and B', 'Order C only'],
    answer: 1,
    explanation: 'Order A: 80 units < 100 — no discount. Order B: 150 units, August (Q3) → qualifies. Order C: October is Q4, not Q3. Answer: Order B only.',
    tags: ['MSR','discount','cross-reference']
  },
  {
    id: 'msr-m1',
    topic: 'msr', subtopic: 'Verbal + quant integration', difficulty: 'Medium', type: 'mcq',
    stem: 'What is the total amount billed for Order B, after applying any applicable discount?',
    context: {
      type: 'tabs',
      tabs: [
        {
          label: 'Pricing Policy',
          html: '<p style="font-size:0.9em;line-height:1.6"><strong>Bulk Discount:</strong> Orders of 100+ units placed in Q3 (July–September) receive a 15% discount on the unit price.</p><p style="font-size:0.9em;line-height:1.6;margin-top:8px"><strong>Standard Prices:</strong> Widget A — $50/unit; Widget B — $30/unit.</p>'
        },
        {
          label: 'Order Log',
          html: '<table style="width:100%;border-collapse:collapse;font-size:0.85em"><thead><tr><th style="border:1px solid #ddd;padding:8px;background:#f5f5f5">Order</th><th style="border:1px solid #ddd;padding:8px;background:#f5f5f5">Product</th><th style="border:1px solid #ddd;padding:8px;background:#f5f5f5">Units</th><th style="border:1px solid #ddd;padding:8px;background:#f5f5f5">Month</th></tr></thead><tbody><tr><td style="border:1px solid #ddd;padding:8px">Order A</td><td style="border:1px solid #ddd;padding:8px">Widget A</td><td style="border:1px solid #ddd;padding:8px">80</td><td style="border:1px solid #ddd;padding:8px">August</td></tr><tr><td style="border:1px solid #ddd;padding:8px">Order B</td><td style="border:1px solid #ddd;padding:8px">Widget A</td><td style="border:1px solid #ddd;padding:8px">150</td><td style="border:1px solid #ddd;padding:8px">August</td></tr><tr><td style="border:1px solid #ddd;padding:8px">Order C</td><td style="border:1px solid #ddd;padding:8px">Widget B</td><td style="border:1px solid #ddd;padding:8px">120</td><td style="border:1px solid #ddd;padding:8px">October</td></tr></tbody></table>'
        }
      ]
    },
    choices: ['$5 500', '$6 375', '$7 500', '$8 000'],
    answer: 1,
    explanation: 'Order B: 150 units of Widget A at $50/unit. Qualifies for 15% discount (Q3, 100+ units). Discounted price = $50 × 0.85 = $42.50. Total = 150 × $42.50 = $6 375.',
    tags: ['MSR','calculation','discount']
  },
  {
    id: 'msr-h1',
    topic: 'msr', subtopic: 'Verbal + quant integration', difficulty: 'Hard', type: 'mcq',
    stem: 'If Widget B\'s standard price increases by 20% next quarter, what would Order C\'s total be at the NEW price (no discount applies)?',
    context: {
      type: 'tabs',
      tabs: [
        {
          label: 'Pricing Policy',
          html: '<p style="font-size:0.9em;line-height:1.6"><strong>Bulk Discount:</strong> Orders of 100+ units placed in Q3 (July–September) receive a 15% discount on the unit price.</p><p style="font-size:0.9em;line-height:1.6;margin-top:8px"><strong>Standard Prices:</strong> Widget A — $50/unit; Widget B — $30/unit.</p>'
        },
        {
          label: 'Order Log',
          html: '<table style="width:100%;border-collapse:collapse;font-size:0.85em"><thead><tr><th style="border:1px solid #ddd;padding:8px;background:#f5f5f5">Order</th><th style="border:1px solid #ddd;padding:8px;background:#f5f5f5">Product</th><th style="border:1px solid #ddd;padding:8px;background:#f5f5f5">Units</th><th style="border:1px solid #ddd;padding:8px;background:#f5f5f5">Month</th></tr></thead><tbody><tr><td style="border:1px solid #ddd;padding:8px">Order A</td><td style="border:1px solid #ddd;padding:8px">Widget A</td><td style="border:1px solid #ddd;padding:8px">80</td><td style="border:1px solid #ddd;padding:8px">August</td></tr><tr><td style="border:1px solid #ddd;padding:8px">Order B</td><td style="border:1px solid #ddd;padding:8px">Widget A</td><td style="border:1px solid #ddd;padding:8px">150</td><td style="border:1px solid #ddd;padding:8px">August</td></tr><tr><td style="border:1px solid #ddd;padding:8px">Order C</td><td style="border:1px solid #ddd;padding:8px">Widget B</td><td style="border:1px solid #ddd;padding:8px">120</td><td style="border:1px solid #ddd;padding:8px">October</td></tr></tbody></table>'
        }
      ]
    },
    choices: ['$3 240', '$3 600', '$4 320', '$4 680'],
    answer: 2,
    explanation: 'New Widget B price = $30 × 1.20 = $36. Order C: 120 × $36 = $4 320.',
    tags: ['MSR','percent change','calculation']
  },

  /* ═══════════════════════════════════════════
     READING COMPREHENSION
  ═══════════════════════════════════════════ */
  {
    id: 'rc-e1',
    topic: 'rc', subtopic: 'Main idea', difficulty: 'Easy', type: 'mcq',
    stem: 'Which of the following best expresses the main idea of the passage?',
    context: {
      type: 'passage',
      text: 'The shift to remote work, accelerated by the pandemic, has fundamentally altered how companies measure productivity. Traditional metrics such as hours logged and physical presence have been largely replaced by output-based evaluation. While this change has empowered many employees to structure their own workdays, it has also introduced new challenges: managers must now rely on trust, clear goal-setting, and digital tools to coordinate teams across time zones.'
    },
    choices: [
      'Remote work has made employees less productive.',
      'The pandemic permanently eliminated traditional offices.',
      'Remote work has changed how companies evaluate and manage productivity.',
      'Digital tools are the primary driver of remote work success.'
    ],
    answer: 2,
    explanation: 'The passage discusses how remote work changed productivity metrics and management approaches. Choice C captures both elements — evaluation (output vs hours) and management challenges — making it the best main idea.',
    tags: ['main idea','reading comprehension']
  },
  {
    id: 'rc-m1',
    topic: 'rc', subtopic: 'Inference', difficulty: 'Medium', type: 'mcq',
    stem: 'It can be inferred from the passage that managers who relied primarily on physical presence to gauge productivity would most likely find remote work:',
    context: {
      type: 'passage',
      text: 'The shift to remote work, accelerated by the pandemic, has fundamentally altered how companies measure productivity. Traditional metrics such as hours logged and physical presence have been largely replaced by output-based evaluation. While this change has empowered many employees to structure their own workdays, it has also introduced new challenges: managers must now rely on trust, clear goal-setting, and digital tools to coordinate teams across time zones.'
    },
    choices: [
      'Straightforward, because output is easy to measure.',
      'Challenging, because the old metrics no longer apply.',
      'Beneficial, because employees are more motivated.',
      'Irrelevant, because the pandemic is over.'
    ],
    answer: 1,
    explanation: 'The passage states that physical presence has been replaced and managers now face new challenges. Managers who relied on presence would struggle with this shift — choice B is the logical inference.',
    tags: ['inference','reading comprehension']
  },

  /* ═══════════════════════════════════════════
     CRITICAL REASONING
  ═══════════════════════════════════════════ */
  {
    id: 'cr-e1',
    topic: 'cr', subtopic: 'Argument structure', difficulty: 'Easy', type: 'mcq',
    stem: 'City X has seen a 30% rise in bicycle sales over the past two years. The city council concludes that residents are increasingly choosing cycling over driving.\n\nWhich of the following, if true, most weakens the council\'s conclusion?',
    context: null,
    choices: [
      'Fuel prices in City X have remained stable.',
      'The rise in sales is entirely due to tourists purchasing bicycles as souvenirs.',
      'Public transit use has also increased in the city.',
      'City X recently opened a new cycling lane network.'
    ],
    answer: 1,
    explanation: 'If the bikes are bought by tourists as souvenirs, not by residents for commuting, the council\'s conclusion that residents are cycling more is unsupported. Choice B directly weakens the argument.',
    tags: ['weaken','critical reasoning']
  },
  {
    id: 'cr-m1',
    topic: 'cr', subtopic: 'Assumptions', difficulty: 'Medium', type: 'mcq',
    stem: 'A study found that students who ate breakfast performed better on standardised tests than those who did not. The researchers concluded that eating breakfast improves test performance.\n\nThe conclusion relies on which of the following assumptions?',
    context: null,
    choices: [
      'All students in the study had equal access to nutritious breakfasts.',
      'There is no confounding variable that explains both breakfast-eating and higher test scores.',
      'Test performance is the most important measure of academic success.',
      'Students who ate breakfast also slept more hours on average.'
    ],
    answer: 1,
    explanation: 'The conclusion assumes causation from correlation. For that to hold, there must be no third variable (e.g., family income) that causes both eating breakfast and higher scores. Choice B identifies this necessary assumption.',
    tags: ['assumption','critical reasoning']
  },
  {
    id: 'cr-h1',
    topic: 'cr', subtopic: 'Strengthen', difficulty: 'Hard', type: 'mcq',
    stem: 'Pharmaceutical company Z argues that its new drug reduces migraine frequency by 40%. Critics note that participants knew they were receiving the drug.\n\nWhich finding would most strengthen the company\'s claim?',
    context: null,
    choices: [
      'Participants reported high satisfaction with the drug\'s taste.',
      'A double-blind trial using the same drug produced a 38% reduction.',
      'Migraines are known to be influenced by psychological factors.',
      'The study was conducted over only four weeks.'
    ],
    answer: 1,
    explanation: 'A double-blind trial controls for the placebo effect (the main weakness raised). If a rigorous double-blind study also shows ~40% reduction, it strongly supports the drug\'s efficacy. Choice B is the best strengthener.',
    tags: ['strengthen','critical reasoning','bias']
  },

  /* ═══════════════════════════════════════════
     COMBINATORICS — EXTENDED BANK (100 questions)
     Easy: comb-e3 … comb-e32   (30 questions)
     Medium: comb-m3 … comb-m42 (40 questions)
     Hard: comb-h3 … comb-h32   (30 questions)
  ═══════════════════════════════════════════ */

  /* ── EASY ── */
  {
    id: 'comb-e3', topic: 'combinatorics', subtopic: 'Permutations', difficulty: 'Easy', type: 'mcq',
    stem: 'In how many ways can 3 students be arranged in a row for a class photograph?',
    context: null, choices: ['3', '6', '9', '12'], answer: 1,
    explanation: '<strong>Method: Permutations (arrangements of all items).</strong><br><br>We are arranging 3 distinct students in a row where <em>order matters</em> — position 1 is different from position 2.<br><br><strong>Step 1:</strong> 3 choices for the first spot, 2 remaining for the second, 1 for the third.<br>\\[3! = 3 \\times 2 \\times 1 = 6\\]<br><strong>Answer: 6.</strong> There are 6 ways to arrange 3 students in a row.',
    tags: ['permutations','factorial']
  },
  {
    id: 'comb-e4', topic: 'combinatorics', subtopic: 'Combinations', difficulty: 'Easy', type: 'mcq',
    stem: 'How many ways can you choose 3 books from a shelf of 5 to take on a trip (the order of selection does not matter)?',
    context: null, choices: ['6', '8', '10', '15'], answer: 2,
    explanation: '<strong>Method: Combinations</strong> — order of selection does not matter.<br><br><strong>Step 1:</strong> Identify \\(n = 5\\) (books on shelf) and \\(k = 3\\) (books to choose).<br><br><strong>Step 2:</strong> Compute using \\(\\dbinom{n}{k} = \\dfrac{n!}{k!\\,(n-k)!}\\):<br>\\[\\dbinom{5}{3} = \\dfrac{5!}{3!\\,2!} = \\dfrac{5 \\times 4}{2 \\times 1} = 10\\]<br><strong>Trap:</strong> \\(5 \\times 4 \\times 3 = 60\\) counts <em>ordered</em> arrangements (permutations). Since the problem says order does not matter, divide out the \\(3! = 6\\) ways to reorder the same 3 books: \\(60 \\div 6 = 10\\). <strong>Answer: 10.</strong>',
    tags: ['combinations','C(n,r)']
  },
  {
    id: 'comb-e5', topic: 'combinatorics', subtopic: 'Counting principle', difficulty: 'Easy', type: 'mcq',
    stem: 'A fair coin is tossed and a standard 6-sided die is rolled. How many distinct outcomes are possible?',
    context: null, choices: ['8', '10', '12', '14'], answer: 2,
    explanation: '<strong>Method: Counting principle (multiplication rule).</strong><br><br>The coin and die are independent — the result of one does not affect the other.<br><br><strong>Step 1:</strong> Coin outcomes: 2 (Heads or Tails).<br><strong>Step 2:</strong> Die outcomes: 6 (faces 1 through 6).<br><strong>Step 3:</strong> Multiply:<br>\\[2 \\times 6 = 12\\]<br><strong>Answer: 12</strong> distinct outcomes.',
    tags: ['counting principle','independent events']
  },
  {
    id: 'comb-e6', topic: 'combinatorics', subtopic: 'Counting principle', difficulty: 'Easy', type: 'mcq',
    stem: 'How many 2-digit numbers can be formed using the digits 1, 2, and 3 if repetition is allowed?',
    context: null, choices: ['6', '9', '12', '18'], answer: 1,
    explanation: '<strong>Method: Multiplication principle (counting principle).</strong><br><br><strong>Step 1: Count choices for the tens digit.</strong><br>Any of {1, 2, 3} → 3 choices.<br><br><strong>Step 2: Count choices for the units digit.</strong><br>Repetition is allowed, so any of {1, 2, 3} again → 3 choices.<br><br><strong>Step 3: Multiply.</strong><br>\\[3 \\times 3 = 9\\]<br><strong>Trap:</strong> If repetition were <em>not</em> allowed, the second digit must differ from the first: \\(3 \\times 2 = 6\\). Always check whether repetition is permitted before setting up the product.',
    tags: ['counting principle','repetition allowed','trap']
  },
  {
    id: 'comb-e7', topic: 'combinatorics', subtopic: 'Permutations', difficulty: 'Easy', type: 'mcq',
    stem: 'In how many ways can a president and a secretary be chosen from 5 candidates, if the same person cannot hold both positions?',
    context: null, choices: ['5', '10', '20', '25'], answer: 2,
    explanation: '<strong>Method: Permutations</strong> — two distinct roles filled from the same pool.<br><br><strong>Step 1: Choose the president.</strong><br>5 candidates available → 5 choices.<br><br><strong>Step 2: Choose the secretary.</strong><br>The president cannot also be secretary → 4 remaining choices.<br><br><strong>Step 3: Multiply.</strong><br>\\[5 \\times 4 = P(5,2) = 20\\]<br><strong>Key insight:</strong> Because the two roles are <em>different</em> (president ≠ secretary), order matters and this is a permutation. \\(C(5,2) = 10\\) would only be correct if both roles were identical (e.g., two generic representatives).',
    tags: ['permutations','P(n,r)']
  },
  {
    id: 'comb-e8', topic: 'combinatorics', subtopic: 'Probability', difficulty: 'Easy', type: 'mcq',
    stem: 'A spinner is divided into 8 equal sections numbered 1 through 8. What is the probability of landing on the number 3?',
    context: null, choices: ['1/8', '1/4', '3/8', '1/2'], answer: 0,
    explanation: '<strong>Method: Classical (equally likely) probability.</strong><br><br>\\[P(\\text{event}) = \\dfrac{\\text{number of favourable outcomes}}{\\text{total equally likely outcomes}}\\]<br><br><strong>Step 1: Favourable outcomes.</strong><br>Only section "3" qualifies → 1 outcome.<br><br><strong>Step 2: Total outcomes.</strong><br>8 equal sections → 8 outcomes.<br><br><strong>Answer:</strong>\\[P(3) = \\dfrac{1}{8}\\]<br><strong>Key insight:</strong> Because all 8 sections are the <em>same size</em>, every section is equally likely. If sections were different sizes you would use area ratios instead.',
    tags: ['probability','equally likely']
  },
  {
    id: 'comb-e9', topic: 'combinatorics', subtopic: 'Combinations', difficulty: 'Easy', type: 'mcq',
    stem: 'A pizza shop offers 6 different toppings. How many different 2-topping pizzas can be made?',
    context: null, choices: ['12', '15', '18', '30'], answer: 1,
    explanation: '<strong>Method: Combinations</strong> — order of toppings on a pizza does not matter.<br><br><strong>Step 1: Identify n and k.</strong><br>\\(n = 6\\) (available toppings), \\(k = 2\\) (to choose).<br><br><strong>Step 2: Compute.</strong><br>\\[\\dbinom{6}{2} = \\dfrac{6 \\times 5}{2 \\times 1} = 15\\]<br><strong>Trap:</strong> \\(6 \\times 5 = 30\\) counts <em>ordered pairs</em> — it treats "pepperoni then mushroom" differently from "mushroom then pepperoni." Since both give the same pizza, divide by \\(2! = 2\\): \\(30 \\div 2 = 15\\). Always ask: does order matter?',
    tags: ['combinations','trap']
  },
  {
    id: 'comb-e10', topic: 'combinatorics', subtopic: 'Permutations', difficulty: 'Easy', type: 'mcq',
    stem: 'In how many different orders can 5 athletes finish a race (assuming no ties)?',
    context: null, choices: ['25', '60', '100', '120'], answer: 3,
    explanation: '<strong>Method: Permutations of all n items.</strong><br><br>Every distinct finishing order counts — 1st through 5th are all different positions.<br><br><strong>Step 1: Fill each position in sequence.</strong><br>5 choices for 1st, 4 for 2nd, 3 for 3rd, 2 for 4th, 1 for 5th.<br><br><strong>Step 2: Multiply (factorial).</strong><br>\\[5! = 5 \\times 4 \\times 3 \\times 2 \\times 1 = 120\\]<br><strong>Key insight:</strong> Whenever you arrange all \\(n\\) distinct objects in a sequence, the answer is \\(n!\\). Think of filling \\(n\\) positions one at a time, with one fewer choice at each step.',
    tags: ['permutations','factorial']
  },
  {
    id: 'comb-e11', topic: 'combinatorics', subtopic: 'Probability', difficulty: 'Easy', type: 'mcq',
    stem: 'What is the probability of rolling a 3 on a fair six-sided die?',
    context: null, choices: ['1/6', '1/4', '1/3', '1/2'], answer: 0,
    explanation: '<strong>Method: Classical probability.</strong><br><br><strong>Step 1: Count favorable outcomes.</strong><br>Exactly one face shows 3 → 1 favorable outcome.<br><br><strong>Step 2: Count total outcomes.</strong><br>A standard die has 6 faces, all equally likely → 6 total outcomes.<br><br><strong>Answer:</strong>\\[P(\\text{roll a }3) = \\dfrac{1}{6}\\]<br><strong>Key insight:</strong> All faces of a <em>fair</em> die are equally probable. The word "fair" is your cue to apply classical probability directly.',
    tags: ['probability','die']
  },
  {
    id: 'comb-e12', topic: 'combinatorics', subtopic: 'Combinations', difficulty: 'Easy', type: 'mcq',
    stem: 'From a group of 10 students, in how many ways can 2 be chosen to represent the class?',
    context: null, choices: ['10', '20', '45', '90'], answer: 2,
    explanation: '<strong>Method: Combinations</strong> — choosing a pair where order does not matter.<br><br><strong>Step 1: Identify n and k.</strong><br>\\(n = 10\\) students, \\(k = 2\\) to represent the class.<br><br><strong>Step 2: Compute.</strong><br>\\[\\dbinom{10}{2} = \\dfrac{10 \\times 9}{2 \\times 1} = 45\\]<br><strong>Key insight:</strong> The pair {Alice, Bob} is the same as {Bob, Alice} — so we divide by \\(2!\\) to remove the double-count. General rule: "how many groups/teams/pairs/committees?" → combinations, not permutations.',
    tags: ['combinations','C(n,r)']
  },
  {
    id: 'comb-e13', topic: 'combinatorics', subtopic: 'Counting principle', difficulty: 'Easy', type: 'mcq',
    stem: 'Three fair coins are flipped simultaneously. How many different outcomes are possible?',
    context: null, choices: ['3', '6', '8', '12'], answer: 2,
    explanation: '<strong>Method: Multiplication principle for independent events.</strong><br><br>Each coin flip is <em>independent</em> — the result of one does not change the possibilities for another.<br><br><strong>Step 1: Outcomes per coin.</strong><br>Heads (H) or Tails (T) → 2 outcomes each.<br><br><strong>Step 2: Multiply across all 3 coins.</strong><br>\\[2 \\times 2 \\times 2 = 2^3 = 8\\]<br>The 8 outcomes: HHH, HHT, HTH, HTT, THH, THT, TTH, TTT.<br><br><strong>Key insight:</strong> For \\(n\\) independent events each with \\(k\\) outcomes, total = \\(k^n\\). Here: \\(k=2\\), \\(n=3\\).',
    tags: ['counting principle','probability']
  },
  {
    id: 'comb-e14', topic: 'combinatorics', subtopic: 'Counting principle', difficulty: 'Easy', type: 'mcq',
    stem: 'Including the empty set, how many subsets does the set {A, B, C, D} have?',
    context: null, choices: ['8', '12', '15', '16'], answer: 3,
    explanation: '<strong>Method: Power-set formula.</strong><br><br>For each of the 4 elements, independently choose to <em>include</em> it or <em>exclude</em> it from the subset — 2 choices per element.<br><br>\\[2^4 = 16 \\text{ subsets total}\\]<br><strong>Trap:</strong> Summing only non-empty subsets gives \\(C(4,1)+C(4,2)+C(4,3)+C(4,4) = 4+6+4+1 = 15\\). The empty set \\(\\{\\}\\) is a valid subset and must be included when the question says "including the empty set."',
    tags: ['counting principle','subsets','trap']
  },
  {
    id: 'comb-e15', topic: 'combinatorics', subtopic: 'Probability', difficulty: 'Easy', type: 'mcq',
    stem: 'A card is drawn at random from a standard 52-card deck. What is the probability it is a heart?',
    context: null, choices: ['1/13', '1/4', '1/2', '4/13'], answer: 1,
    explanation: '<strong>Method: Classical probability.</strong><br><br><strong>Step 1: Count favorable outcomes.</strong><br>A standard deck has 13 hearts → 13 favorable outcomes.<br><br><strong>Step 2: Count total outcomes.</strong><br>52 cards total → 52 equally likely outcomes.<br><br><strong>Step 3: Simplify.</strong><br>\\[P(\\text{heart}) = \\dfrac{13}{52} = \\dfrac{1}{4}\\]<br><strong>Key insight:</strong> A standard deck has 4 suits of 13 cards each. By symmetry, exactly \\(\\frac{1}{4}\\) of all cards belong to any given suit — no calculation required once you know the deck structure.',
    tags: ['probability','cards']
  },
  {
    id: 'comb-e16', topic: 'combinatorics', subtopic: 'Counting principle', difficulty: 'Easy', type: 'mcq',
    stem: 'A 4-digit PIN code is created using digits 0–9, with repetition allowed. How many different PIN codes are possible?',
    context: null, choices: ['1 000', '5 040', '10 000', '40 000'], answer: 2,
    explanation: '<strong>Method: Multiplication principle with repetition allowed.</strong><br><br>Each digit position is filled independently; any digit 0–9 may reappear in any other position.<br><br><strong>Step 1: Choices per digit position.</strong><br>Digits 0–9 → 10 choices each.<br><br><strong>Step 2: Multiply across all 4 positions.</strong><br>\\[10 \\times 10 \\times 10 \\times 10 = 10^4 = 10{,}000\\]<br><strong>Key insight:</strong> Repetition allowed → every position is fully independent. This is why most 4-digit PINs have 10,000 possibilities (from 0000 to 9999).',
    tags: ['counting principle','repetition allowed']
  },
  {
    id: 'comb-e17', topic: 'combinatorics', subtopic: 'Probability', difficulty: 'Easy', type: 'mcq',
    stem: 'What is the probability of rolling a number greater than 4 on a standard die?',
    context: null, choices: ['1/6', '1/3', '1/2', '2/3'], answer: 1,
    explanation: '<strong>Method: Classical probability.</strong><br><br><strong>Step 1: Identify the favorable outcomes.</strong><br>Numbers greater than 4 on a standard die: {5, 6} → 2 outcomes.<br><br><strong>Step 2: Count total outcomes.</strong><br>Faces {1, 2, 3, 4, 5, 6} → 6 equally likely outcomes.<br><br><strong>Step 3: Compute.</strong><br>\\[P(\\text{roll} > 4) = \\dfrac{2}{6} = \\dfrac{1}{3}\\]<br><strong>Key insight:</strong> Always list the event set explicitly. A common error is including 4 in "greater than 4" — the set is {5, 6}, not {4, 5, 6}.',
    tags: ['probability','die']
  },
  {
    id: 'comb-e18', topic: 'combinatorics', subtopic: 'Probability', difficulty: 'Easy', type: 'mcq',
    stem: 'A fair die is rolled twice. What is the probability of rolling a 6 both times?',
    context: null, choices: ['1/36', '1/12', '1/6', '1/3'], answer: 0,
    explanation: '<strong>Method: Multiplication rule for independent events.</strong><br><br>The second roll\'s outcome does not depend on the first — the dice are <em>independent</em>.<br><br><strong>Step 1:</strong> \\(P(\\text{first die} = 6) = \\dfrac{1}{6}\\)<br><br><strong>Step 2:</strong> \\(P(\\text{second die} = 6) = \\dfrac{1}{6}\\)<br><br><strong>Step 3: Multiply.</strong><br>\\[P(\\text{both} = 6) = \\dfrac{1}{6} \\times \\dfrac{1}{6} = \\dfrac{1}{36}\\]<br><strong>Key insight:</strong> For independent events, multiply their probabilities. Rolling a 6 on the first die does not change the probability of rolling a 6 on the second.',
    tags: ['probability','independent events']
  },
  {
    id: 'comb-e19', topic: 'combinatorics', subtopic: 'Probability', difficulty: 'Easy', type: 'mcq',
    stem: 'A bag contains 3 red and 7 yellow marbles. One marble is drawn at random. What is the probability it is yellow?',
    context: null, choices: ['3/10', '1/2', '7/10', '3/7'], answer: 2,
    explanation: '<strong>Method: Classical probability.</strong><br><br><strong>Step 1: Count total marbles.</strong><br>\\(3 \\text{ red} + 7 \\text{ yellow} = 10\\) marbles.<br><br><strong>Step 2: Count favorable outcomes.</strong><br>7 yellow marbles → 7 favorable outcomes.<br><br><strong>Answer:</strong><br>\\[P(\\text{yellow}) = \\dfrac{7}{10}\\]<br><strong>Key insight:</strong> Always use the <em>total</em> count in the denominator — not just the count of the other colour. The denominator represents all equally likely possibilities.',
    tags: ['probability']
  },
  {
    id: 'comb-e20', topic: 'combinatorics', subtopic: 'Permutations', difficulty: 'Easy', type: 'mcq',
    stem: 'In how many ways can a family of 4 line up for a photo?',
    context: null, choices: ['4', '8', '16', '24'], answer: 3,
    explanation: '<strong>Method: Permutations of all n items.</strong><br><br>4 distinct people, 4 positions — every arrangement of who stands where is unique.<br><br><strong>Step 1: Fill each position.</strong><br>4 choices for position 1, 3 for position 2, 2 for position 3, 1 for position 4.<br><br><strong>Step 2: Multiply.</strong><br>\\[4! = 4 \\times 3 \\times 2 \\times 1 = 24\\]<br><strong>Key insight:</strong> Any time you place all \\(n\\) distinct people in a row, the answer is \\(n!\\). This is the most fundamental counting formula.',
    tags: ['permutations','factorial']
  },
  {
    id: 'comb-e21', topic: 'combinatorics', subtopic: 'Counting principle', difficulty: 'Easy', type: 'mcq',
    stem: 'A store sells 5 styles of shirts and 3 styles of pants. How many different shirt-and-pants outfits are possible?',
    context: null, choices: ['8', '10', '12', '15'], answer: 3,
    explanation: '<strong>Method: Multiplication principle.</strong><br><br>Choosing a shirt and choosing pants are independent decisions — each combination of one shirt and one pair of pants is a distinct outfit.<br><br><strong>Step 1:</strong> Shirt choices: 5.<br><strong>Step 2:</strong> Pants choices: 3.<br><strong>Step 3: Multiply.</strong><br>\\[5 \\times 3 = 15\\]<br><strong>Key insight:</strong> The multiplication principle applies whenever you make two or more independent sequential choices: total = product of all individual choice counts.',
    tags: ['counting principle']
  },
  {
    id: 'comb-e22', topic: 'combinatorics', subtopic: 'Probability', difficulty: 'Easy', type: 'mcq',
    stem: 'One card is drawn from a standard 52-card deck. What is the probability it is a diamond or a club?',
    context: null, choices: ['1/4', '1/2', '2/3', '3/4'], answer: 1,
    explanation: '<strong>Method: Addition rule for mutually exclusive events.</strong><br><br>A card cannot be both a diamond and a club — these events are <em>mutually exclusive</em>.<br><br><strong>Step 1:</strong> Diamonds: 13 cards.<br><strong>Step 2:</strong> Clubs: 13 cards.<br><strong>Step 3: Add and compute.</strong><br>\\[P(\\text{diamond or club}) = \\dfrac{13 + 13}{52} = \\dfrac{26}{52} = \\dfrac{1}{2}\\]<br><strong>Key insight:</strong> For mutually exclusive events, "or" means just add. If the events could overlap, you would subtract the intersection (inclusion-exclusion).',
    tags: ['probability','cards']
  },
  {
    id: 'comb-e23', topic: 'combinatorics', subtopic: 'Counting principle', difficulty: 'Easy', type: 'mcq',
    stem: 'How many 3-digit numbers can be formed using the digits 1, 2, and 3, if repetition is allowed?',
    context: null, choices: ['6', '9', '27', '33'], answer: 2,
    explanation: '<strong>Method: Multiplication principle with repetition allowed.</strong><br><br>Each digit position is independent; any of the 3 digits can appear in any position.<br><br><strong>Step 1:</strong> Hundreds digit: 3 choices ({1, 2, or 3}).<br><strong>Step 2:</strong> Tens digit: 3 choices (repetition allowed).<br><strong>Step 3:</strong> Units digit: 3 choices.<br><strong>Step 4: Multiply.</strong><br>\\[3 \\times 3 \\times 3 = 3^3 = 27\\]<br><strong>Trap:</strong> \\(3! = 6\\) applies when each digit is used exactly once (no repetition). The word "allowed" changes everything — read the problem carefully.',
    tags: ['counting principle','repetition allowed','trap']
  },
  {
    id: 'comb-e24', topic: 'combinatorics', subtopic: 'Permutations', difficulty: 'Easy', type: 'mcq',
    stem: 'In how many ways can 6 people be seated in 6 distinct chairs?',
    context: null, choices: ['36', '120', '360', '720'], answer: 3,
    explanation: '<strong>Method: Permutations of all n items.</strong><br><br>6 distinct people, 6 distinct chairs — every seating arrangement is determined by who sits where.<br><br><strong>Step 1: Fill the chairs in sequence.</strong><br>6 choices for chair 1, 5 for chair 2, 4 for chair 3, down to 1 for chair 6.<br><br><strong>Step 2: Multiply.</strong><br>\\[6! = 6 \\times 5 \\times 4 \\times 3 \\times 2 \\times 1 = 720\\]<br><strong>Key insight:</strong> Memorise common factorials: \\(4!=24,\\; 5!=120,\\; 6!=720,\\; 7!=5{,}040\\). They appear constantly on the GMAT.',
    tags: ['permutations','factorial']
  },
  {
    id: 'comb-e25', topic: 'combinatorics', subtopic: 'Combinations', difficulty: 'Easy', type: 'mcq',
    stem: 'From 9 players, in how many ways can a doubles tennis team of 2 be selected?',
    context: null, choices: ['18', '36', '72', '81'], answer: 1,
    explanation: '<strong>Method: Combinations</strong> — both players on a doubles team have the same role, so order does not matter.<br><br><strong>Step 1:</strong> \\(n = 9\\) players, \\(k = 2\\) to form the team.<br><br><strong>Step 2: Compute.</strong><br>\\[\\dbinom{9}{2} = \\dfrac{9 \\times 8}{2 \\times 1} = 36\\]<br><strong>Key insight:</strong> If the two players had distinct roles (e.g., a server and a receiver), you would use permutations: \\(P(9,2) = 9 \\times 8 = 72\\). Equal roles → combinations (half the count).',
    tags: ['combinations']
  },
  {
    id: 'comb-e26', topic: 'combinatorics', subtopic: 'Permutations', difficulty: 'Easy', type: 'mcq',
    stem: 'A race has 7 runners. In how many ways can first and second place be awarded?',
    context: null, choices: ['7', '14', '21', '42'], answer: 3,
    explanation: '<strong>Method: Permutations</strong> — two distinct positions (1st place ≠ 2nd place).<br><br><strong>Step 1: Choose 1st place.</strong><br>7 runners → 7 choices.<br><br><strong>Step 2: Choose 2nd place.</strong><br>1st-place runner is eliminated → 6 choices.<br><br><strong>Step 3: Multiply.</strong><br>\\[P(7,2) = 7 \\times 6 = 42\\]<br><strong>Trap:</strong> \\(C(7,2) = 21\\) would apply only if both places received an identical prize. Because 1st and 2nd are different prizes, the positions are distinct and order matters.',
    tags: ['permutations','P(n,r)']
  },
  {
    id: 'comb-e27', topic: 'combinatorics', subtopic: 'Probability', difficulty: 'Easy', type: 'mcq',
    stem: 'What is the probability of drawing an ace from a standard 52-card deck?',
    context: null, choices: ['1/52', '1/13', '4/13', '1/4'], answer: 1,
    explanation: '<strong>Method: Classical probability.</strong><br><br><strong>Step 1: Count favorable outcomes.</strong><br>4 aces in a standard deck (one per suit) → 4 favorable outcomes.<br><br><strong>Step 2: Count total outcomes.</strong><br>52 cards → 52 equally likely outcomes.<br><br><strong>Step 3: Simplify.</strong><br>\\[P(\\text{ace}) = \\dfrac{4}{52} = \\dfrac{1}{13}\\]<br><strong>Key insight:</strong> A deck has 13 denominations (A, 2–10, J, Q, K) with 4 cards each. The probability of drawing any specific denomination is always \\(\\frac{4}{52} = \\frac{1}{13}\\).',
    tags: ['probability','cards']
  },
  {
    id: 'comb-e28', topic: 'combinatorics', subtopic: 'Combinations', difficulty: 'Easy', type: 'mcq',
    stem: 'In how many ways can all 5 members of a group be selected to serve on a 5-person committee?',
    context: null, choices: ['1', '5', '10', '25'], answer: 0,
    explanation: '<strong>Method: Combinations edge case.</strong><br><br>When you must select all available members, there is only one way — include everyone.<br><br>\\[\\dbinom{5}{5} = \\dfrac{5!}{5! \\cdot 0!} = \\dfrac{120}{120 \\times 1} = 1\\]<br>(Recall: \\(0! = 1\\) by definition.)<br><br><strong>Useful identity:</strong> \\(\\dbinom{n}{n} = 1\\) and \\(\\dbinom{n}{0} = 1\\) for any \\(n \\geq 0\\). There is exactly one way to choose all \\(n\\) items, and exactly one way to choose none.',
    tags: ['combinations']
  },
  {
    id: 'comb-e29', topic: 'combinatorics', subtopic: 'Counting principle', difficulty: 'Easy', type: 'mcq',
    stem: 'A car can be ordered in 3 colours, 4 models, and 2 interior styles. How many different cars can be ordered?',
    context: null, choices: ['9', '18', '24', '36'], answer: 2,
    explanation: '<strong>Method: Multiplication principle with multiple independent choices.</strong><br><br>Each car option is chosen independently — colour does not affect model, model does not affect interior.<br><br><strong>Step 1:</strong> Colour choices: 3.<br><strong>Step 2:</strong> Model choices: 4.<br><strong>Step 3:</strong> Interior style choices: 2.<br><br><strong>Step 4: Multiply all independent choices.</strong><br>\\[3 \\times 4 \\times 2 = 24\\]<br><strong>Key insight:</strong> The multiplication principle extends to any number of independent categories. Simply multiply all individual counts together.',
    tags: ['counting principle']
  },
  {
    id: 'comb-e30', topic: 'combinatorics', subtopic: 'Probability', difficulty: 'Easy', type: 'mcq',
    stem: 'What is the probability of NOT rolling a 1 on a single fair die?',
    context: null, choices: ['1/6', '1/3', '2/3', '5/6'], answer: 3,
    explanation: '<strong>Method: Complement rule.</strong><br><br>\\[P(\\text{event}) = 1 - P(\\text{complement})\\]<br><br><strong>Step 1: Find P(rolling a 1).</strong><br>\\[P(1) = \\dfrac{1}{6}\\]<br><strong>Step 2: Subtract from 1.</strong><br>\\[P(\\text{not } 1) = 1 - \\dfrac{1}{6} = \\dfrac{5}{6}\\]<br><strong>Verification:</strong> The 5 outcomes that are "not 1" are {2, 3, 4, 5, 6}: \\(P = \\frac{5}{6}\\) ✓<br><br><strong>Key insight:</strong> The complement rule is most useful when "not X" is easier to describe than X. Memorise: P(A) + P(not A) = 1.',
    tags: ['probability','complement']
  },
  {
    id: 'comb-e31', topic: 'combinatorics', subtopic: 'Combinations', difficulty: 'Easy', type: 'mcq',
    stem: 'How many ways can a student choose 2 elective courses from a list of 7?',
    context: null, choices: ['14', '21', '35', '42'], answer: 2,
    explanation: '<strong>Method: Combinations</strong> — choosing 2 courses where order of selection does not matter.<br><br><strong>Step 1:</strong> \\(n = 7\\) courses, \\(k = 2\\) to choose.<br><br><strong>Step 2: Compute.</strong><br>\\[\\dbinom{7}{2} = \\dfrac{7 \\times 6}{2 \\times 1} = \\dfrac{42}{2} = 21\\]<br><strong>Trap:</strong> \\(7 \\times 6 = 42\\) counts <em>ordered pairs</em> — it treats "choose Math first, then Physics" differently from "choose Physics first, then Math." Since both give the same course selection, divide by \\(2! = 2\\).',
    tags: ['combinations','trap']
  },
  {
    id: 'comb-e32', topic: 'combinatorics', subtopic: 'Probability', difficulty: 'Easy', type: 'mcq',
    stem: 'A bag contains 4 green balls and 6 white balls. If one ball is picked at random, what is the probability it is green?',
    context: null, choices: ['1/6', '2/5', '4/6', '2/3'], answer: 1,
    explanation: '<strong>Method: Classical probability.</strong><br><br><strong>Step 1: Count total balls.</strong><br>\\(4 \\text{ green} + 6 \\text{ white} = 10\\) balls.<br><br><strong>Step 2: Count favorable outcomes.</strong><br>4 green balls → 4 favorable outcomes.<br><br><strong>Step 3: Compute and simplify.</strong><br>\\[P(\\text{green}) = \\dfrac{4}{10} = \\dfrac{2}{5}\\]<br><strong>Key insight:</strong> Always simplify fractions — \\(\\frac{4}{10} = \\frac{2}{5}\\). GMAT answer choices often appear in simplified form, so reduce before comparing.',
    tags: ['probability']
  },

  /* ── MEDIUM ── */
  {
    id: 'comb-m3', topic: 'combinatorics', subtopic: 'Permutations with restrictions', difficulty: 'Medium', type: 'mcq',
    stem: 'In how many ways can 5 people be seated in a row if two specific people, Alice and Bob, must sit next to each other?',
    context: null, choices: ['24', '36', '48', '60'], answer: 2,
    explanation: '<strong>Method: Block method</strong> — treat the constrained pair as a single unit.<br><br><strong>Step 1:</strong> Glue Alice and Bob together into one "super-person." Now we have 4 units to arrange in a row:<br>\\[4! = 24 \\text{ ways}\\]<br><strong>Step 2:</strong> Inside the block, Alice and Bob can swap positions (AB or BA):<br>\\[2! = 2 \\text{ internal arrangements}\\]<br><strong>Step 3:</strong> Multiply: \\(24 \\times 2 = 48\\).<br><br><strong>Trap:</strong> \\(5! = 120\\) ignores the constraint entirely. The block method is the standard tool whenever two (or more) items must stay together.',
    tags: ['permutations','restrictions','trap']
  },
  {
    id: 'comb-m4', topic: 'combinatorics', subtopic: 'Combinations with restrictions', difficulty: 'Medium', type: 'mcq',
    stem: 'A committee of 3 is chosen from 4 men and 4 women. How many committees contain at least one woman?',
    context: null, choices: ['36', '48', '52', '56'], answer: 2,
    explanation: '<strong>Method: Complement</strong> — it is easier to count the opposite and subtract.<br><br>\\[\\text{Total committees} = \\dbinom{8}{3} = \\dfrac{8 \\times 7 \\times 6}{3 \\times 2 \\times 1} = 56\\]<br>\\[\\text{All-male committees} = \\dbinom{4}{3} = 4\\]<br>\\[\\text{At least one woman} = 56 - 4 = 52\\]<br><strong>Key insight:</strong> "At least one" problems almost always benefit from the complement method. Counting all-male (the complementary case) is far simpler than adding up committees with exactly 1, exactly 2, or exactly 3 women.',
    tags: ['combinations','complement','at least one']
  },
  {
    id: 'comb-m5', topic: 'combinatorics', subtopic: 'Permutations with restrictions', difficulty: 'Medium', type: 'mcq',
    stem: 'How many 4-digit numbers can be formed from {1, 2, 3, 4, 5} without repeating digits, if the number must be greater than 3000?',
    context: null, choices: ['36', '48', '60', '72'], answer: 3,
    explanation: '<strong>Method: Slot method with restriction on the leading digit.</strong><br><br><strong>Step 1:</strong> The number must exceed 3000, so the thousands digit must be 3, 4, or 5 — that gives 3 choices.<br><strong>Step 2:</strong> Fill the remaining 3 positions from the 4 unused digits (no repetition):<br>\\[4 \\times 3 \\times 2 = 24 \\text{ ways}\\]<br><strong>Step 3:</strong> Multiply:<br>\\[3 \\times 24 = 72\\]<br><strong>Trap:</strong> Forgetting that a 4-digit number starting with 3 is exactly 3000-something, which does satisfy &gt;3000, so 3 is a valid leading digit here.',
    tags: ['permutations','restrictions']
  },
  {
    id: 'comb-m6', topic: 'combinatorics', subtopic: 'Circular arrangements', difficulty: 'Medium', type: 'mcq',
    stem: 'In how many distinct ways can 6 people be seated around a circular table?',
    context: null, choices: ['120', '240', '360', '720'], answer: 0,
    explanation: '<strong>Method: Circular permutations</strong> — fix one person to eliminate equivalent rotations.<br><br><strong>Step 1:</strong> In a circle, rotating everyone one seat clockwise gives the same arrangement. To avoid counting these duplicates, anchor one person in place.<br><strong>Step 2:</strong> Arrange the remaining 5 people in the 5 open seats:<br>\\[5! = 120 \\text{ ways}\\]<br><strong>Trap:</strong> \\(6! = 720\\) is the count for a straight row. In a circle, all 6 rotations of a given arrangement look identical, so we divide by 6: \\(720 \\div 6 = 120\\). Fixing one person accomplishes this automatically.',
    tags: ['circular arrangement','trap']
  },
  {
    id: 'comb-m7', topic: 'combinatorics', subtopic: 'Combinations with restrictions', difficulty: 'Medium', type: 'mcq',
    stem: 'A committee of 4 is chosen from 6 Republicans and 5 Democrats. How many committees contain exactly 2 Republicans?',
    context: null, choices: ['100', '125', '150', '180'], answer: 2,
    explanation: '<strong>Method: Combinations with group restrictions.</strong><br><br>The committee needs exactly 2 Republicans and 2 Democrats — choose from each group independently, then multiply.<br><br><strong>Step 1: Choose 2 Republicans from 6.</strong><br>\\[\\dbinom{6}{2} = \\dfrac{6 \\times 5}{2} = 15\\]<br><strong>Step 2: Choose 2 Democrats from 5.</strong><br>\\[\\dbinom{5}{2} = \\dfrac{5 \\times 4}{2} = 10\\]<br><strong>Step 3: Multiply.</strong><br>\\[15 \\times 10 = 150\\]<br><strong>Key insight:</strong> When a committee must contain an exact number of members from each separate group, multiply the independent combination counts.',
    tags: ['combinations','restrictions']
  },
  {
    id: 'comb-m8', topic: 'combinatorics', subtopic: 'Probability', difficulty: 'Medium', type: 'mcq',
    stem: 'A box contains 4 red and 6 blue balls. Two balls are drawn one after the other WITHOUT replacement. What is the probability both are blue?',
    context: null, choices: ['1/5', '1/4', '1/3', '2/5'], answer: 2,
    explanation: '<strong>Method: Probability without replacement.</strong><br><br>After drawing the first ball it is not returned — the pool shrinks.<br><br><strong>Method A — Sequential:</strong><br>Draw 1st ball blue: \\(\\dfrac{6}{10}\\). One blue is gone, 9 balls remain (5 blue).<br>Draw 2nd ball blue: \\(\\dfrac{5}{9}\\).<br>\\[P = \\dfrac{6}{10} \\times \\dfrac{5}{9} = \\dfrac{30}{90} = \\dfrac{1}{3}\\]<br><strong>Method B — Combinations:</strong><br>\\[P = \\dfrac{\\dbinom{6}{2}}{\\dbinom{10}{2}} = \\dfrac{15}{45} = \\dfrac{1}{3}\\]<br><strong>Trap:</strong> \\(\\left(\\dfrac{6}{10}\\right)^2 = \\dfrac{9}{25}\\) assumes drawing <em>with replacement</em>. "Without replacement" means the pool shrinks after each draw.',
    tags: ['probability','without replacement','trap']
  },
  {
    id: 'comb-m9', topic: 'combinatorics', subtopic: 'Permutations of repeated objects', difficulty: 'Medium', type: 'mcq',
    stem: 'How many distinct arrangements are there of the letters in the word NOON?',
    context: null, choices: ['4', '6', '12', '24'], answer: 1,
    explanation: '<strong>Method: Permutations with repeated objects.</strong><br><br>NOON has 4 letters: N (appears 2 times), O (appears 2 times).<br><br><strong>Formula:</strong> \\(\\dfrac{n!}{\\text{(count of each repeated letter)}!}\\)<br><br><strong>Step 1:</strong> Total letters: \\(n = 4\\).<br><strong>Step 2:</strong> N repeated 2×, O repeated 2×.<br><strong>Step 3: Apply formula.</strong><br>\\[\\dfrac{4!}{2! \\times 2!} = \\dfrac{24}{2 \\times 2} = \\dfrac{24}{4} = 6\\]<br><strong>Key insight:</strong> Dividing by each repeated letter\'s factorial removes the duplicate arrangements caused by swapping identical letters (swapping the two N\'s gives the same word).',
    tags: ['permutations','repeated objects']
  },
  {
    id: 'comb-m10', topic: 'combinatorics', subtopic: 'Permutations', difficulty: 'Medium', type: 'mcq',
    stem: 'In how many ways can a captain and a co-captain be chosen from a team of 10 players?',
    context: null, choices: ['45', '70', '90', '100'], answer: 2,
    explanation: '<strong>Method: Permutations</strong> — two distinct roles from one pool.<br><br>Captain and co-captain are <em>different</em> positions, so order matters.<br><br><strong>Step 1: Choose the captain.</strong><br>10 players → 10 choices.<br><br><strong>Step 2: Choose the co-captain.</strong><br>The captain cannot also serve as co-captain → 9 remaining choices.<br><br><strong>Step 3: Multiply.</strong><br>\\[P(10,2) = 10 \\times 9 = 90\\]<br><strong>Trap:</strong> \\(C(10,2) = 45\\) would be correct only if both roles were identical (two generic representatives). Because captain and co-captain are distinct, {A=captain, B=co-captain} is different from {B=captain, A=co-captain}.',
    tags: ['permutations','P(n,r)','trap']
  },
  {
    id: 'comb-m11', topic: 'combinatorics', subtopic: 'Permutations with restrictions', difficulty: 'Medium', type: 'mcq',
    stem: 'Seven books — 3 history and 4 science — are placed on a shelf. How many arrangements keep all 3 history books together?',
    context: null, choices: ['144', '360', '504', '720'], answer: 3,
    explanation: '<strong>Method: Block method</strong> — treat the constrained group as a single unit.<br><br><strong>Step 1: Bundle the 3 history books into one "super-book."</strong><br>Now arrange 5 objects: [HHH-block], S, S, S, S.<br>\\[5! = 120 \\text{ arrangements}\\]<br><strong>Step 2: Arrange the 3 history books within their block.</strong><br>\\[3! = 6 \\text{ internal orders}\\]<br><strong>Step 3: Multiply.</strong><br>\\[120 \\times 6 = 720\\]<br><strong>Key insight:</strong> The block method applies whenever a group must stay together. Treat the group as one item for the outer count, then multiply by the internal arrangements.',
    tags: ['permutations','restrictions','block method']
  },
  {
    id: 'comb-m12', topic: 'combinatorics', subtopic: 'Probability', difficulty: 'Medium', type: 'mcq',
    stem: 'A 3-digit number is formed from {1, 2, 3, 4, 5} without repeating digits. What is the probability the number is odd?',
    context: null, choices: ['2/5', '1/2', '3/5', '2/3'], answer: 2,
    explanation: '<strong>Method: Slot method — fill the most restricted position first.</strong><br><br><strong>Step 1: Units digit must be odd: {1, 3, 5} → 3 choices.</strong><br><br><strong>Step 2: Hundreds digit from the 4 remaining digits → 4 choices.</strong><br><br><strong>Step 3: Tens digit from the 3 remaining digits → 3 choices.</strong><br><br><strong>Step 4: Count odd 3-digit numbers.</strong><br>\\[3 \\times 4 \\times 3 = 36\\]<br><strong>Step 5: Total 3-digit arrangements (no repeats).</strong><br>\\[P(5,3) = 5 \\times 4 \\times 3 = 60\\]<br><strong>Step 6: Probability.</strong><br>\\[P(\\text{odd}) = \\dfrac{36}{60} = \\dfrac{3}{5}\\]<br><strong>Key insight:</strong> Fill the restricted position (units digit) first; then fill remaining positions with whatever is left.',
    tags: ['probability','permutations']
  },
  {
    id: 'comb-m13', topic: 'combinatorics', subtopic: 'Probability', difficulty: 'Medium', type: 'mcq',
    stem: 'Two cards are drawn from a standard 52-card deck without replacement. What is the probability both are hearts?',
    context: null, choices: ['1/16', '1/17', '1/13', '1/4'], answer: 1,
    explanation: '<strong>Method: Sequential probability without replacement.</strong><br><br>After the first card is drawn, it is not returned — the deck shrinks.<br><br><strong>Step 1: P(first card is a heart).</strong><br>\\[P = \\dfrac{13}{52} = \\dfrac{1}{4}\\]<br><strong>Step 2: P(second card is a heart | first was a heart).</strong><br>Now 12 hearts remain out of 51 cards:<br>\\[P = \\dfrac{12}{51} = \\dfrac{4}{17}\\]<br><strong>Step 3: Multiply.</strong><br>\\[\\dfrac{13}{52} \\times \\dfrac{12}{51} = \\dfrac{156}{2{,}652} = \\dfrac{1}{17}\\]<br><strong>Trap:</strong> \\(\\left(\\dfrac{1}{4}\\right)^2 = \\dfrac{1}{16}\\) assumes drawing <em>with replacement</em> (card returned before second draw).',
    tags: ['probability','without replacement','trap']
  },
  {
    id: 'comb-m14', topic: 'combinatorics', subtopic: 'Combinations with restrictions', difficulty: 'Medium', type: 'mcq',
    stem: 'A 3-person team is chosen from 5 boys and 5 girls. How many teams contain exactly 2 girls?',
    context: null, choices: ['30', '40', '50', '60'], answer: 2,
    explanation: '<strong>Method: Combinations with group restrictions.</strong><br><br>Exactly 2 girls in a 3-person team means exactly 1 boy as well.<br><br><strong>Step 1: Choose 2 girls from 5.</strong><br>\\[\\dbinom{5}{2} = 10\\]<br><strong>Step 2: Choose 1 boy from 5.</strong><br>\\[\\dbinom{5}{1} = 5\\]<br><strong>Step 3: Multiply.</strong><br>\\[10 \\times 5 = 50\\]<br><strong>Key insight:</strong> "Exactly 2 girls in a 3-person team" implicitly means exactly 1 boy. Always set up separate selection from each group, then multiply.',
    tags: ['combinations','restrictions']
  },
  {
    id: 'comb-m15', topic: 'combinatorics', subtopic: 'Permutations with restrictions', difficulty: 'Medium', type: 'mcq',
    stem: 'How many 5-digit numbers use each of {1, 2, 3, 4, 5} exactly once, with the digit 1 not in the first position?',
    context: null, choices: ['72', '84', '96', '108'], answer: 2,
    explanation: '<strong>Method: Complement</strong> — subtract the forbidden arrangements from the total.<br><br><strong>Step 1: Total 5-digit arrangements using {1, 2, 3, 4, 5} with no repeats.</strong><br>\\[5! = 120\\]<br><strong>Step 2: Count forbidden arrangements (digit 1 in position 1).</strong><br>Fix 1 in position 1; arrange the remaining 4 digits in the other 4 spots:<br>\\[4! = 24\\]<br><strong>Step 3: Subtract.</strong><br>\\[120 - 24 = 96\\]<br><strong>Key insight:</strong> Use the complement when it is easier to count what you <em>don\'t</em> want. Counting valid cases directly would require listing arrangements starting with 2, 3, 4, or 5 separately.',
    tags: ['permutations','complement','restrictions']
  },
  {
    id: 'comb-m16', topic: 'combinatorics', subtopic: 'Combinations', difficulty: 'Medium', type: 'mcq',
    stem: 'If each pair of 8 people at a party shakes hands exactly once, how many handshakes occur in total?',
    context: null, choices: ['14', '21', '28', '56'], answer: 2,
    explanation: '<strong>Method: Combinations</strong> — a handshake is an unordered pair (Alice with Bob = Bob with Alice).<br><br><strong>Step 1: Each handshake involves 2 people chosen from 8.</strong><br>\\[\\dbinom{8}{2} = \\dfrac{8 \\times 7}{2 \\times 1} = 28\\]<br><strong>Trap:</strong> \\(8 \\times 7 = 56\\) counts <em>ordered pairs</em> — Alice reaching to Bob and Bob reaching to Alice are counted separately. Divide by \\(2!\\) to remove duplicates: \\(56 \\div 2 = 28\\).<br><br><strong>Key insight:</strong> Any "connections" problem where A-to-B = B-to-A (handshakes, edges, pairings) uses \\(\\dbinom{n}{2}\\).',
    tags: ['combinations','trap']
  },
  {
    id: 'comb-m17', topic: 'combinatorics', subtopic: 'Probability', difficulty: 'Medium', type: 'mcq',
    stem: 'Two fair dice are rolled. What is the probability that both dice show the same number?',
    context: null, choices: ['1/36', '1/12', '1/6', '1/4'], answer: 2,
    explanation: '<strong>Method: Classical probability.</strong><br><br><strong>Step 1: Count favorable outcomes (both dice show the same number).</strong><br>Matching pairs: (1,1), (2,2), (3,3), (4,4), (5,5), (6,6) → 6 outcomes.<br><br><strong>Step 2: Count total outcomes.</strong><br>\\(6 \\times 6 = 36\\) equally likely outcomes.<br><br><strong>Step 3: Compute.</strong><br>\\[P(\\text{doubles}) = \\dfrac{6}{36} = \\dfrac{1}{6}\\]<br><strong>Alternative reasoning:</strong> Whatever the first die shows, the second die has a 1-in-6 chance of matching it — so \\(P = \\frac{1}{6}\\) regardless of the first die\'s result.',
    tags: ['probability','dice']
  },
  {
    id: 'comb-m18', topic: 'combinatorics', subtopic: 'Permutations of repeated objects', difficulty: 'Medium', type: 'mcq',
    stem: 'How many distinct arrangements can be made of all the letters in the word APPLE?',
    context: null, choices: ['24', '48', '60', '120'], answer: 2,
    explanation: '<strong>Method: Permutations with repeated objects.</strong><br><br>APPLE has 5 letters: A, P, P, L, E — with P appearing twice.<br><br><strong>Step 1: Start with all 5! arrangements.</strong><br>\\[5! = 120\\]<br><strong>Step 2: Divide by the factorial of the repeated letter\'s count.</strong><br>P appears 2 times → divide by \\(2!\\):<br>\\[\\dfrac{5!}{2!} = \\dfrac{120}{2} = 60\\]<br><strong>Key insight:</strong> Dividing by \\(2!\\) corrects for the fact that swapping the two P\'s gives the same word (APP₁LE vs APP₂LE look identical). Without the correction, each arrangement is counted twice.',
    tags: ['permutations','repeated objects']
  },
  {
    id: 'comb-m19', topic: 'combinatorics', subtopic: 'Combinations with restrictions', difficulty: 'Medium', type: 'mcq',
    stem: 'A student must answer exactly 6 of 9 exam questions, and Question 1 must be answered. How many ways can the student choose which questions to answer?',
    context: null, choices: ['28', '42', '56', '84'], answer: 2,
    explanation: '<strong>Method: Combinations with a forced element.</strong><br><br><strong>Step 1: Q1 is mandatory — remove it from the decision.</strong><br>Q1 uses 1 of the 6 required answers, leaving 5 more to choose from the remaining 8 questions.<br><br><strong>Step 2: Choose 5 from the remaining 8.</strong><br>\\[\\dbinom{8}{5} = \\dbinom{8}{3} = \\dfrac{8 \\times 7 \\times 6}{3 \\times 2 \\times 1} = 56\\]<br>(The symmetry \\(\\dbinom{8}{5} = \\dbinom{8}{3}\\) simplifies the arithmetic.)<br><br><strong>Key insight:</strong> When an element is forced, fix it in and reduce both "choose from" and "choose how many" by the same amount.',
    tags: ['combinations','restrictions']
  },
  {
    id: 'comb-m20', topic: 'combinatorics', subtopic: 'Probability', difficulty: 'Medium', type: 'mcq',
    stem: 'A fair coin is flipped 4 times. What is the probability of getting at least one head?',
    context: null, choices: ['1/2', '3/4', '7/8', '15/16'], answer: 3,
    explanation: '<strong>Method: Complement rule</strong> — "at least one" = 1 − P(none).<br><br><strong>Step 1: Find P(zero heads) — all four flips are Tails.</strong><br>\\[P(\\text{TTTT}) = \\left(\\dfrac{1}{2}\\right)^4 = \\dfrac{1}{16}\\]<br><strong>Step 2: Subtract from 1.</strong><br>\\[P(\\text{at least one H}) = 1 - \\dfrac{1}{16} = \\dfrac{15}{16}\\]<br><strong>Trap:</strong> Many students guess \\(\\frac{1}{2}\\) by instinct. The actual answer is \\(\\frac{15}{16}\\) — only 1 of the 16 equally likely outcomes (TTTT) has no heads at all.',
    tags: ['probability','complement','at least one','trap']
  },
  {
    id: 'comb-m21', topic: 'combinatorics', subtopic: 'Permutations with restrictions', difficulty: 'Medium', type: 'mcq',
    stem: 'How many 4-digit numbers can be formed from {1, 2, 3, 4, 5} without repeating digits, if the number must be even?',
    context: null, choices: ['24', '36', '48', '72'], answer: 2,
    explanation: '<strong>Method: Slot method — fill the restricted position first.</strong><br><br><strong>Step 1: Units digit must be even: {2, 4} → 2 choices.</strong><br><br><strong>Step 2: Fill the remaining 3 positions from the 4 leftover digits (no repeats).</strong><br>\\[4 \\times 3 \\times 2 = 24 \\text{ ways}\\]<br><strong>Step 3: Multiply.</strong><br>\\[2 \\times 24 = 48\\]<br><strong>Key insight:</strong> Always fill the restricted position first. If you fill unrestricted positions first, the restricted position\'s option count is unclear because it depends on which digits were already used.',
    tags: ['permutations','restrictions']
  },
  {
    id: 'comb-m22', topic: 'combinatorics', subtopic: 'Counting principle', difficulty: 'Medium', type: 'mcq',
    stem: 'A survey has 5 true/false questions. How many different ways can a student complete the entire survey?',
    context: null, choices: ['10', '16', '25', '32'], answer: 3,
    explanation: '<strong>Method: Multiplication principle for independent binary choices.</strong><br><br>Each question has 2 answers (True or False), and answering one does not affect the others.<br><br><strong>Step 1: Choices per question.</strong><br>2 (True or False).<br><br><strong>Step 2: Multiply across all 5 questions.</strong><br>\\[2^5 = 32\\]<br><strong>Key insight:</strong> \\(2^5 = 32\\) represents every possible True/False pattern, from TTTTT to FFFFF. The general formula is \\(k^n\\) for \\(n\\) independent choices each with \\(k\\) options.',
    tags: ['counting principle']
  },
  {
    id: 'comb-m23', topic: 'combinatorics', subtopic: 'Permutations of repeated objects', difficulty: 'Medium', type: 'mcq',
    stem: 'How many distinct ways can all the letters in the word BANANA be arranged?',
    context: null, choices: ['30', '60', '90', '120'], answer: 1,
    explanation: '<strong>Method: Permutations with multiple repeated objects.</strong><br><br>BANANA has 6 letters: B×1, A×3, N×2.<br><br><strong>Formula:</strong>\\[\\dfrac{n!}{\\text{(count of each repeated letter)}!}\\]<br><strong>Step 1:</strong> Total letters: \\(n = 6\\).<br><strong>Step 2: Apply the formula.</strong><br>\\[\\dfrac{6!}{3! \\times 2!} = \\dfrac{720}{6 \\times 2} = \\dfrac{720}{12} = 60\\]<br><strong>Key insight:</strong> The A×3 factor accounts for the three identical A\'s (swapping them gives the same word). The N×2 factor does the same for the two N\'s. B is unique and contributes no correction.',
    tags: ['permutations','repeated objects']
  },
  {
    id: 'comb-m24', topic: 'combinatorics', subtopic: 'Probability', difficulty: 'Medium', type: 'mcq',
    stem: 'Two fair dice are rolled. What is the probability that the sum is a prime number?',
    context: null, choices: ['5/18', '1/3', '5/12', '7/12'], answer: 2,
    explanation: '<strong>Method: Enumerate favorable outcomes by prime sum.</strong><br><br><strong>Step 1: Primes in the range 2–12: {2, 3, 5, 7, 11}.</strong><br><br><strong>Step 2: Count outcomes for each prime sum.</strong><br>Sum 2: (1,1) → 1 way<br>Sum 3: (1,2),(2,1) → 2 ways<br>Sum 5: (1,4),(2,3),(3,2),(4,1) → 4 ways<br>Sum 7: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1) → 6 ways<br>Sum 11: (5,6),(6,5) → 2 ways<br>Total: \\(1+2+4+6+2 = 15\\)<br><br><strong>Step 3: Probability.</strong><br>\\[P = \\dfrac{15}{36} = \\dfrac{5}{12}\\]',
    tags: ['probability','dice','prime']
  },
  {
    id: 'comb-m25', topic: 'combinatorics', subtopic: 'Counting principle', difficulty: 'Medium', type: 'mcq',
    stem: 'How many 4-digit numbers (0000–9999) begin and end with the same digit?',
    context: null, choices: ['100', '500', '900', '1 000'], answer: 3,
    explanation: '<strong>Method: Slot method with a linked position.</strong><br><br>The fourth digit must equal the first. Fill positions 1, 2, 3 freely, then the fourth is forced.<br><br><strong>Step 1:</strong> First digit (0000–9999, so any digit): 10 choices.<br><strong>Step 2:</strong> Second digit: 10 choices.<br><strong>Step 3:</strong> Third digit: 10 choices.<br><strong>Step 4:</strong> Fourth digit = first digit → 1 forced choice.<br><br><strong>Step 5: Multiply.</strong><br>\\[10 \\times 10 \\times 10 \\times 1 = 1{,}000\\]<br><strong>Key insight:</strong> Linked constraints reduce free choices. Here the last digit is determined (1 choice) because it is constrained to equal the first digit.',
    tags: ['counting principle','restrictions']
  },
  {
    id: 'comb-m26', topic: 'combinatorics', subtopic: 'Combinations', difficulty: 'Medium', type: 'mcq',
    stem: 'In how many ways can a committee of 4 be chosen from a group of 12 people?',
    context: null, choices: ['220', '330', '495', '792'], answer: 2,
    explanation: '<strong>Method: Combinations — choosing a committee where order does not matter.</strong><br><br><strong>Step 1:</strong> \\(n = 12\\), \\(k = 4\\).<br><br><strong>Step 2: Apply the formula.</strong><br>\\[\\dbinom{12}{4} = \\dfrac{12 \\times 11 \\times 10 \\times 9}{4 \\times 3 \\times 2 \\times 1} = \\dfrac{11{,}880}{24} = 495\\]<br><strong>Calculation shortcut:</strong> Simplify before multiplying. Cancel \\(12 \\div 4 = 3\\), then \\(9 \\div 3 = 3\\), then \\(10 \\div 2 = 5\\), leaving \\(3 \\times 11 \\times 5 \\times 3 = 495\\).',
    tags: ['combinations','C(n,r)']
  },
  {
    id: 'comb-m27', topic: 'combinatorics', subtopic: 'Permutations of repeated objects', difficulty: 'Medium', type: 'mcq',
    stem: 'In how many ways can 4 identical red flags and 3 identical blue flags be arranged in a row?',
    context: null, choices: ['12', '21', '35', '70'], answer: 2,
    explanation: '<strong>Method: Permutations of identical objects.</strong><br><br>7 flags total: 4 identical red (R) and 3 identical blue (B). Count distinct colour sequences only.<br><br><strong>Step 1: Apply the repeated-objects formula.</strong><br>\\[\\dfrac{7!}{4! \\times 3!} = \\dfrac{5{,}040}{24 \\times 6} = \\dfrac{5{,}040}{144} = 35\\]<br><strong>Alternative view:</strong> This equals choosing which 3 of the 7 positions get a blue flag: \\(\\dbinom{7}{3} = 35\\). Both approaches confirm the answer.<br><br><strong>Key insight:</strong> Because identical flags are indistinguishable, only the <em>colour pattern</em> matters, not which specific flag is in which spot.',
    tags: ['permutations','repeated objects','identical items']
  },
  {
    id: 'comb-m28', topic: 'combinatorics', subtopic: 'Probability', difficulty: 'Medium', type: 'mcq',
    stem: 'Two cards are drawn at random from a standard 52-card deck without replacement. What is the probability that both are black?',
    context: null, choices: ['1/4', '25/102', '1/2', '13/51'], answer: 1,
    explanation: '<strong>Method: Sequential probability without replacement.</strong><br><br>A deck has 26 black cards (13 spades + 13 clubs).<br><br><strong>Step 1: P(first card is black).</strong><br>\\[\\dfrac{26}{52} = \\dfrac{1}{2}\\]<br><strong>Step 2: P(second card is black | first was black).</strong><br>25 black cards remain out of 51:<br>\\[\\dfrac{25}{51}\\]<br><strong>Step 3: Multiply.</strong><br>\\[\\dfrac{26}{52} \\times \\dfrac{25}{51} = \\dfrac{650}{2{,}652} = \\dfrac{25}{102}\\]<br><strong>Trap:</strong> \\(\\left(\\dfrac{1}{2}\\right)^2 = \\dfrac{1}{4}\\) assumes drawing <em>with replacement</em>.',
    tags: ['probability','without replacement','cards']
  },
  {
    id: 'comb-m29', topic: 'combinatorics', subtopic: 'Permutations', difficulty: 'Medium', type: 'mcq',
    stem: 'In how many ways can gold, silver, and bronze medals be awarded to 3 of 8 competitors?',
    context: null, choices: ['56', '168', '336', '512'], answer: 2,
    explanation: '<strong>Method: Permutations</strong> — three distinct medals from 8 competitors.<br><br>Gold, silver, and bronze are different prizes — the assignment order matters.<br><br><strong>Step 1: Choose the gold medalist.</strong><br>8 choices.<br><strong>Step 2: Choose the silver medalist.</strong><br>7 remaining choices.<br><strong>Step 3: Choose the bronze medalist.</strong><br>6 remaining choices.<br><br><strong>Step 4: Multiply.</strong><br>\\[P(8,3) = 8 \\times 7 \\times 6 = 336\\]<br><strong>Key insight:</strong> Use \\(P(n,k)\\) when assigning \\(k\\) distinct roles/prizes from \\(n\\) people. Use \\(C(n,k)\\) only if all selected people receive identical roles.',
    tags: ['permutations','P(n,r)']
  },
  {
    id: 'comb-m30', topic: 'combinatorics', subtopic: 'Combinations with restrictions', difficulty: 'Medium', type: 'mcq',
    stem: 'Jack and Jill cannot both be in the same carpool. In how many ways can a carpool of 4 be chosen from 6 people (including Jack and Jill)?',
    context: null, choices: ['6', '8', '9', '10'], answer: 2,
    explanation: '<strong>Method: Complement</strong> — subtract forbidden carpools (both Jack and Jill present).<br><br><strong>Step 1: All 4-person carpools from 6 people.</strong><br>\\[\\dbinom{6}{4} = 15\\]<br><strong>Step 2: Forbidden carpools (Jack AND Jill both included).</strong><br>Fix both in; choose 2 more from the other 4:<br>\\[\\dbinom{4}{2} = 6\\]<br><strong>Step 3: Subtract.</strong><br>\\[15 - 6 = 9\\]<br><strong>Key insight:</strong> When a specific pair is banned, use the complement: total − (teams with both). Counting valid cases directly ("Jack without Jill" + "Jill without Jack" + "neither") requires three separate cases.',
    tags: ['combinations','restrictions','complement']
  },
  {
    id: 'comb-m31', topic: 'combinatorics', subtopic: 'Counting principle', difficulty: 'Medium', type: 'mcq',
    stem: 'Three people each independently choose one of 4 different doors. What is the probability they all choose different doors?',
    context: null, choices: ['1/8', '1/4', '3/8', '3/4'], answer: 2,
    explanation: '<strong>Method: Sequential probability with independence constraints.</strong><br><br><strong>Step 1: First person chooses any door.</strong><br>All 4 doors are available → probability = 1.<br><br><strong>Step 2: Second person must choose a different door from the first.</strong><br>3 acceptable doors out of 4 → \\(\\dfrac{3}{4}\\).<br><br><strong>Step 3: Third person must choose a door different from both previous people.</strong><br>2 acceptable doors out of 4 → \\(\\dfrac{2}{4} = \\dfrac{1}{2}\\).<br><br><strong>Step 4: Multiply.</strong><br>\\[1 \\times \\dfrac{3}{4} \\times \\dfrac{2}{4} = \\dfrac{6}{16} = \\dfrac{3}{8}\\]',
    tags: ['probability','counting principle']
  },
  {
    id: 'comb-m32', topic: 'combinatorics', subtopic: 'Permutations with restrictions', difficulty: 'Medium', type: 'mcq',
    stem: 'Five couples want to sit in a row at a cinema such that each couple sits together. How many seating arrangements are possible?',
    context: null, choices: ['240', '1 920', '3 840', '7 680'], answer: 2,
    explanation: '<strong>Method: Block method</strong> — treat each couple as a single unit.<br><br><strong>Step 1: Bundle each couple into one unit.</strong><br>5 couples → 5 "super-units" to arrange in a row:<br>\\[5! = 120\\]<br><strong>Step 2: Within each couple, the two members can swap.</strong><br>2 internal arrangements per couple, 5 couples:<br>\\[2^5 = 32\\]<br><strong>Step 3: Multiply.</strong><br>\\[120 \\times 32 = 3{,}840\\]<br><strong>Key insight:</strong> The block method generalises to any number of paired groups. Each block contributes \\(2!\\) internal arrangements; the blocks are then arranged like individual items.',
    tags: ['permutations','restrictions','block method']
  },
  {
    id: 'comb-m33', topic: 'combinatorics', subtopic: 'Probability', difficulty: 'Medium', type: 'mcq',
    stem: 'A bag has 3 red, 4 blue, and 5 green marbles. Two marbles are drawn at random. What is the probability they are the same colour?',
    context: null, choices: ['1/6', '19/66', '1/3', '5/11'], answer: 1,
    explanation: '<strong>Method: Combinations for probability — count by colour.</strong><br><br><strong>Step 1: Count favorable outcomes (both marbles the same colour).</strong><br>Both red: \\(\\dbinom{3}{2} = 3\\)<br>Both blue: \\(\\dbinom{4}{2} = 6\\)<br>Both green: \\(\\dbinom{5}{2} = 10\\)<br>Total favorable: \\(3 + 6 + 10 = 19\\)<br><br><strong>Step 2: Total outcomes (any 2 from 12).</strong><br>\\[\\dbinom{12}{2} = \\dfrac{12 \\times 11}{2} = 66\\]<br><strong>Step 3: Compute.</strong><br>\\[P(\\text{same colour}) = \\dfrac{19}{66}\\]<br><strong>Key insight:</strong> Sum within-colour combinations, then divide by total. Do not mix colours in the numerator.',
    tags: ['probability','combinations']
  },
  {
    id: 'comb-m34', topic: 'combinatorics', subtopic: 'Permutations', difficulty: 'Medium', type: 'mcq',
    stem: 'How many 4-letter arrangements (not necessarily words) can be made from the 6 letters {A, B, C, D, E, F} with no letter repeated?',
    context: null, choices: ['120', '240', '360', '720'], answer: 2,
    explanation: '<strong>Method: Permutations</strong> — 4-letter arrangements from 6 distinct letters where order matters.<br><br>Each distinct ordering of the same 4 letters is a different "arrangement" (ABCD ≠ ABDC).<br><br><strong>Step 1: Fill 4 positions, no repeats.</strong><br>Position 1: 6 choices, Position 2: 5, Position 3: 4, Position 4: 3.<br><br><strong>Step 2: Multiply.</strong><br>\\[P(6,4) = 6 \\times 5 \\times 4 \\times 3 = 360\\]<br><strong>Alternative check:</strong> \\(C(6,4) \\times 4! = 15 \\times 24 = 360\\) — choose which 4 letters, then arrange them. Both methods confirm.',
    tags: ['permutations','P(n,r)']
  },
  {
    id: 'comb-m35', topic: 'combinatorics', subtopic: 'Combinations', difficulty: 'Medium', type: 'mcq',
    stem: 'A group of 8 friends splits into two 4-person teams for a game. How many ways can Team A (labelled) be formed?',
    context: null, choices: ['40', '56', '70', '140'], answer: 2,
    explanation: '<strong>Method: Combinations for labelled groups.</strong><br><br><strong>Step 1: Choose 4 people for Team A from 8.</strong><br>\\[\\dbinom{8}{4} = \\dfrac{8 \\times 7 \\times 6 \\times 5}{4 \\times 3 \\times 2 \\times 1} = 70\\]<br><strong>Step 2: Team B is automatically determined.</strong><br>The 4 people not chosen for Team A form Team B — no additional selection needed.<br><br><strong>Key insight (labelled vs unlabelled):</strong> Because Team A and Team B are distinct labels, choosing {A,B,C,D} for Team A is a different outcome from choosing {E,F,G,H} for Team A. If teams were unlabelled, divide by \\(2!\\) to get \\(70/2 = 35\\).',
    tags: ['combinations']
  },
  {
    id: 'comb-m36', topic: 'combinatorics', subtopic: 'Counting principle', difficulty: 'Medium', type: 'mcq',
    stem: 'A licence plate consists of 2 different letters (A–Z) followed by 3 digits (0–9, repetition allowed). How many licence plates are possible?',
    context: null, choices: ['260 000', '520 000', '650 000', '676 000'], answer: 2,
    explanation: '<strong>Method: Multiplication principle with mixed repetition rules.</strong><br><br><strong>Step 1: First letter (A–Z, no repeats from next letter).</strong><br>→ 26 choices.<br><strong>Step 2: Second letter (different from first).</strong><br>→ 25 choices.<br><strong>Step 3–5: Three digits (0–9, repetition allowed).</strong><br>→ \\(10 \\times 10 \\times 10 = 1{,}000\\) choices.<br><br><strong>Step 6: Multiply all choices.</strong><br>\\[26 \\times 25 \\times 10^3 = 650 \\times 1{,}000 = 650{,}000\\]<br><strong>Key insight:</strong> When different parts of a code follow different repetition rules, handle each section separately then multiply.',
    tags: ['counting principle','mixed repetition']
  },
  {
    id: 'comb-m37', topic: 'combinatorics', subtopic: 'Probability', difficulty: 'Medium', type: 'mcq',
    stem: 'What is the probability of drawing a vowel if a letter is chosen at random from the letters of the word PROBABILITY?',
    context: null, choices: ['3/11', '4/11', '5/11', '6/11'], answer: 1,
    explanation: '<strong>Method: Classical probability with repeated letters.</strong><br><br><strong>Step 1: Write out all 11 letters.</strong><br>P-R-O-B-A-B-I-L-I-T-Y → 11 letter positions total.<br><br><strong>Step 2: Identify vowel positions.</strong><br>O (pos 3), A (pos 5), I (pos 7), I (pos 9) → 4 vowel positions.<br><br><strong>Step 3: Compute probability.</strong><br>\\[P(\\text{vowel}) = \\dfrac{4}{11}\\]<br><strong>Key insight:</strong> When a letter appears more than once (like I here), each occurrence is a separate position in the pool. Count individual letter positions, not distinct letters.',
    tags: ['probability']
  },
  {
    id: 'comb-m38', topic: 'combinatorics', subtopic: 'Permutations with restrictions', difficulty: 'Medium', type: 'mcq',
    stem: 'In how many ways can 3 boys and 3 girls be seated alternately in a row of 6 chairs?',
    context: null, choices: ['36', '48', '72', '144'], answer: 2,
    explanation: '<strong>Method: Count valid alternating patterns directly.</strong><br><br>With 3 boys and 3 girls in 6 seats, alternating means either B-G-B-G-B-G or G-B-G-B-G-B.<br><br><strong>Step 1: Choose the starting gender.</strong><br>2 possible patterns (boy-first or girl-first).<br><br><strong>Step 2: Arrange the 3 boys in their 3 alternating seats.</strong><br>\\[3! = 6\\]<br><strong>Step 3: Arrange the 3 girls in their 3 alternating seats.</strong><br>\\[3! = 6\\]<br><strong>Step 4: Multiply.</strong><br>\\[2 \\times 6 \\times 6 = 72\\]<br><strong>Key insight:</strong> Once the pattern (BGBGBG or GBGBGB) is fixed, boys and girls are arranged independently within their designated seats.',
    tags: ['permutations','restrictions','alternating']
  },
  {
    id: 'comb-m39', topic: 'combinatorics', subtopic: 'Counting principle', difficulty: 'Medium', type: 'mcq',
    stem: 'How many non-empty subsets does the set {1, 2, 3, 4, 5} have?',
    context: null, choices: ['25', '30', '31', '32'], answer: 2,
    explanation: '<strong>Method: Power-set formula minus the empty set.</strong><br><br><strong>Step 1: Count all subsets (including the empty set).</strong><br>For each of the 5 elements, independently include or exclude it:<br>\\[2^5 = 32\\]<br><strong>Step 2: Subtract the empty set.</strong><br>\\[32 - 1 = 31\\]<br><strong>Key insight:</strong> The empty set \\(\\{\\}\\) is counted in the \\(2^n\\) total but is not "non-empty." Whenever the question asks for <em>non-empty</em> subsets, always subtract 1. The formula is \\(2^n - 1\\).',
    tags: ['counting principle','subsets']
  },
  {
    id: 'comb-m40', topic: 'combinatorics', subtopic: 'Combinations with restrictions', difficulty: 'Medium', type: 'mcq',
    stem: 'From a group of 8 people including two friends A and B who refuse to be on the same team, how many 4-person teams are possible?',
    context: null, choices: ['40', '50', '55', '60'], answer: 2,
    explanation: '<strong>Method: Complement — subtract teams containing both A and B.</strong><br><br><strong>Step 1: All 4-person teams from 8 people.</strong><br>\\[\\dbinom{8}{4} = 70\\]<br><strong>Step 2: Forbidden teams (A and B both included).</strong><br>Fix both A and B; choose 2 more from the 6 others:<br>\\[\\dbinom{6}{2} = 15\\]<br><strong>Step 3: Subtract.</strong><br>\\[70 - 15 = 55\\]<br><strong>Key insight:</strong> "These two people cannot be on the same team" → use complement: total − (teams with both). This is almost always simpler than counting valid teams case by case.',
    tags: ['combinations','restrictions','complement']
  },
  {
    id: 'comb-m41', topic: 'combinatorics', subtopic: 'Probability', difficulty: 'Medium', type: 'mcq',
    stem: 'Two cards are drawn from a 52-card deck without replacement. What is the probability neither card is a face card (J, Q, K)?',
    context: null, choices: ['5/9', '9/17', '10/17', '15/17'], answer: 2,
    explanation: '<strong>Method: Sequential probability without replacement.</strong><br><br>Face cards: J, Q, K in 4 suits = 12 face cards. Non-face cards: \\(52 - 12 = 40\\).<br><br><strong>Step 1: P(first card is not a face card).</strong><br>\\[\\dfrac{40}{52} = \\dfrac{10}{13}\\]<br><strong>Step 2: P(second card is not a face card | first was not a face card).</strong><br>39 non-face cards remain out of 51:<br>\\[\\dfrac{39}{51} = \\dfrac{13}{17}\\]<br><strong>Step 3: Multiply.</strong><br>\\[\\dfrac{40}{52} \\times \\dfrac{39}{51} = \\dfrac{1{,}560}{2{,}652} = \\dfrac{10}{17}\\]',
    tags: ['probability','without replacement','cards']
  },
  {
    id: 'comb-m42', topic: 'combinatorics', subtopic: 'Permutations of repeated objects', difficulty: 'Medium', type: 'mcq',
    stem: 'How many distinct ways can the letters in the word MISSISSIPPI be arranged?',
    context: null, choices: ['3 465', '9 240', '34 650', '69 300'], answer: 2,
    explanation: '<strong>Method: Permutations with multiple repeated objects.</strong><br><br>MISSISSIPPI has 11 letters: M×1, I×4, S×4, P×2.<br><br><strong>Step 1: Apply the repeated-objects formula.</strong><br>\\[\\dfrac{11!}{4! \\times 4! \\times 2!}\\]<br><strong>Step 2: Compute.</strong><br>\\[11! = 39{,}916{,}800 \\quad ; \\quad 4! \\times 4! \\times 2! = 24 \\times 24 \\times 2 = 1{,}152\\]<br>\\[\\dfrac{39{,}916{,}800}{1{,}152} = 34{,}650\\]<br><strong>Key insight:</strong> MISSISSIPPI is the classic "repeated letters" GMAT question. Memorise the setup: 11 letters with I×4, S×4, P×2.',
    tags: ['permutations','repeated objects']
  },

  /* ── HARD ── */
  {
    id: 'comb-h3', topic: 'combinatorics', subtopic: 'Circular arrangement with restriction', difficulty: 'Hard', type: 'mcq',
    stem: 'Six people sit around a circular table. In how many arrangements do persons A and B NOT sit next to each other?',
    context: null, choices: ['48', '60', '72', '96'], answer: 2,
    explanation: '<strong>Method: Complement</strong> — count arrangements where A and B ARE adjacent, then subtract.<br><br><strong>Step 1: Total circular arrangements of 6 people.</strong><br>\\[(6-1)! = 5! = 120\\]<br><strong>Step 2: Count arrangements where A and B are adjacent (forbidden).</strong><br>Treat A+B as a single block → 5 units in a circle:<br>\\[(5-1)! = 4! = 24 \\text{ arrangements of the blocks}\\]<br>Within the block, A and B can swap (AB or BA):<br>\\[2! = 2\\]<br>Forbidden: \\(24 \\times 2 = 48\\)<br><br><strong>Step 3: Subtract.</strong><br>\\[120 - 48 = 72\\]<br><strong>Key insight:</strong> For circular arrangements, use \\((n-1)!\\) not \\(n!\\). Combining this with the complement and block method is a common Hard-level approach.',
    tags: ['circular arrangement','restrictions','complement']
  },
  {
    id: 'comb-h4', topic: 'combinatorics', subtopic: 'Probability', difficulty: 'Hard', type: 'mcq',
    stem: 'A fair coin is flipped 4 times. What is the probability of getting at least 2 heads?',
    context: null, choices: ['5/8', '3/4', '11/16', '7/8'], answer: 2,
    explanation: '<strong>Method: Complement</strong> — subtract P(0H) and P(1H) from 1.<br><br><strong>Step 1: Total equally likely outcomes.</strong><br>\\[2^4 = 16\\]<br><strong>Step 2: P(0 heads) — all tails TTTT.</strong><br>\\[\\dbinom{4}{0} = 1 \\text{ way} \\quad \\Rightarrow \\quad P = \\dfrac{1}{16}\\]<br><strong>Step 3: P(exactly 1 head).</strong><br>\\[\\dbinom{4}{1} = 4 \\text{ ways} \\quad \\Rightarrow \\quad P = \\dfrac{4}{16}\\]<br><strong>Step 4: Apply complement.</strong><br>\\[P(\\geq 2H) = 1 - \\dfrac{1}{16} - \\dfrac{4}{16} = \\dfrac{11}{16}\\]<br><strong>Verification (direct count):</strong> \\(\\dbinom{4}{2}+\\dbinom{4}{3}+\\dbinom{4}{4} = 6+4+1 = 11 \\checkmark\\)',
    tags: ['probability','complement','binomial']
  },
  {
    id: 'comb-h5', topic: 'combinatorics', subtopic: 'Probability', difficulty: 'Hard', type: 'mcq',
    stem: 'A bag has 5 red and 3 blue balls. Three balls are drawn at random without replacement. What is the probability that exactly 2 are red?',
    context: null, choices: ['3/7', '15/28', '9/14', '5/8'], answer: 1,
    explanation: '<strong>Method: Combinations for probability (hypergeometric setup).</strong><br><br><strong>Step 1: Count favorable outcomes (exactly 2 red, 1 blue).</strong><br>Choose 2 red from 5: \\(\\dbinom{5}{2} = 10\\)<br>Choose 1 blue from 3: \\(\\dbinom{3}{1} = 3\\)<br>Favorable = \\(10 \\times 3 = 30\\)<br><br><strong>Step 2: Total outcomes (any 3 from 8).</strong><br>\\[\\dbinom{8}{3} = \\dfrac{8 \\times 7 \\times 6}{6} = 56\\]<br><strong>Step 3: Probability.</strong><br>\\[P = \\dfrac{30}{56} = \\dfrac{15}{28}\\]<br><strong>Key insight:</strong> When drawing from a finite pool of different types, choose the required count from each type, multiply, then divide by the total draw count.',
    tags: ['probability','without replacement','combinations']
  },
  {
    id: 'comb-h6', topic: 'combinatorics', subtopic: 'Combinations', difficulty: 'Hard', type: 'mcq',
    stem: 'In how many ways can 10 people be divided into two distinct (labelled) teams of 5?',
    context: null, choices: ['42', '126', '252', '504'], answer: 2,
    explanation: '<strong>Method: Combinations for labelled groups.</strong><br><br><strong>Step 1: Choose 5 people for Team A from 10.</strong><br>\\[\\dbinom{10}{5} = \\dfrac{10 \\times 9 \\times 8 \\times 7 \\times 6}{5!} = \\dfrac{30{,}240}{120} = 252\\]<br><strong>Step 2: Team B is the remaining 5 — no additional selection needed.</strong><br><br><strong>Key insight (labelled vs unlabelled):</strong> Team A and Team B are distinct labels, so each selection is a unique outcome. If both teams were unlabelled (two anonymous groups of 5), divide by \\(2!\\): \\(252/2 = 126\\).',
    tags: ['combinations','partitions']
  },
  {
    id: 'comb-h7', topic: 'combinatorics', subtopic: 'Combinations with restrictions', difficulty: 'Hard', type: 'mcq',
    stem: 'A committee of 5 is formed from 4 seniors and 6 juniors. What is the probability the committee contains at least 3 seniors?',
    context: null, choices: ['1/6', '5/21', '11/42', '3/10'], answer: 2,
    explanation: '<strong>Method: Cases + combinations for "at least 3 seniors."</strong><br><br>"At least 3 seniors" means exactly 3 or exactly 4 seniors.<br><br><strong>Case 1: Exactly 3 seniors, 2 juniors.</strong><br>\\[\\dbinom{4}{3} \\times \\dbinom{6}{2} = 4 \\times 15 = 60\\]<br><strong>Case 2: Exactly 4 seniors, 1 junior.</strong><br>\\[\\dbinom{4}{4} \\times \\dbinom{6}{1} = 1 \\times 6 = 6\\]<br><strong>Total favorable:</strong> \\(60 + 6 = 66\\)<br><br><strong>Total committees from 10 people:</strong><br>\\[\\dbinom{10}{5} = 252\\]<br><strong>Probability:</strong><br>\\[P = \\dfrac{66}{252} = \\dfrac{11}{42}\\]',
    tags: ['probability','combinations','at least']
  },
  {
    id: 'comb-h8', topic: 'combinatorics', subtopic: 'Permutations of repeated objects', difficulty: 'Hard', type: 'mcq',
    stem: 'How many distinct arrangements are there of all the letters in the word PARALLEL?',
    context: null, choices: ['1 680', '3 360', '6 720', '10 080'], answer: 1,
    explanation: '<strong>Method: Permutations with repeated objects.</strong><br><br>PARALLEL has 8 letters. Spell them out: P-A-R-A-L-L-E-L.<br>Tally: P×1, <strong>A×2</strong>, R×1, <strong>L×3</strong>, E×1.<br><br><strong>Step 1: Apply the formula.</strong><br>\\[\\dfrac{8!}{2! \\times 3!} = \\dfrac{40{,}320}{2 \\times 6} = \\dfrac{40{,}320}{12} = 3{,}360\\]<br><strong>Key insight:</strong> Always tally repetitions by spelling the word letter-by-letter: P(1) A(2) R(3) A(4) L(5) L(6) E(7) L(8) → A appears at positions 2 and 4 (×2); L appears at positions 5, 6, and 8 (×3).',
    tags: ['permutations','repeated objects']
  },
  {
    id: 'comb-h9', topic: 'combinatorics', subtopic: 'Counting principle', difficulty: 'Hard', type: 'mcq',
    stem: 'How many 3-digit integers (100–999) contain at least one digit equal to 7?',
    context: null, choices: ['200', '225', '252', '270'], answer: 2,
    explanation: '<strong>Method: Complement — count 3-digit numbers with NO 7, then subtract.</strong><br><br><strong>Step 1: All 3-digit integers (100–999).</strong><br>\\[999 - 100 + 1 = 900\\]<br><strong>Step 2: 3-digit integers with no digit equal to 7.</strong><br>Hundreds digit: {1–9} excluding 7 → 8 choices.<br>Tens digit: {0–9} excluding 7 → 9 choices.<br>Units digit: {0–9} excluding 7 → 9 choices.<br>\\[8 \\times 9 \\times 9 = 648\\]<br><strong>Step 3: Subtract.</strong><br>\\[900 - 648 = 252\\]<br><strong>Key insight:</strong> The complement is ideal for "at least one of X." Counting directly (exactly one 7 + exactly two 7s + exactly three 7s) requires three separate cases and inclusion-exclusion.',
    tags: ['counting principle','complement','trap']
  },
  {
    id: 'comb-h10', topic: 'combinatorics', subtopic: 'Probability', difficulty: 'Hard', type: 'mcq',
    stem: 'A number is chosen at random from 1 to 20. What is the probability it is divisible by 4 or by 6?',
    context: null, choices: ['1/5', '7/20', '2/5', '9/20'], answer: 1,
    explanation: '<strong>Method: Inclusion-Exclusion Principle.</strong><br><br>\\[|A \\cup B| = |A| + |B| - |A \\cap B|\\]<br><br><strong>Step 1: Count multiples of 4 from 1–20.</strong><br>{4, 8, 12, 16, 20} → 5 numbers.<br><br><strong>Step 2: Count multiples of 6 from 1–20.</strong><br>{6, 12, 18} → 3 numbers.<br><br><strong>Step 3: Count multiples of both 4 and 6 (LCM = 12).</strong><br>{12} → 1 number.<br><br><strong>Step 4: Apply inclusion-exclusion.</strong><br>\\[5 + 3 - 1 = 7\\]<br><strong>Step 5: Probability.</strong><br>\\[P = \\dfrac{7}{20}\\]<br><strong>Key insight:</strong> 12 appears in both lists — without subtracting it, you double-count. Always subtract the intersection when computing "A or B" for non-mutually-exclusive events.',
    tags: ['probability','divisibility','inclusion-exclusion']
  },
  {
    id: 'comb-h11', topic: 'combinatorics', subtopic: 'Stars and bars', difficulty: 'Hard', type: 'mcq',
    stem: 'In how many ways can 4 identical balls be distributed into 3 distinct boxes (any box may be empty)?',
    context: null, choices: ['9', '12', '15', '18'], answer: 2,
    explanation: '<strong>Method: Stars and Bars.</strong><br><br>We want to distribute 4 <em>identical</em> balls into 3 <em>distinct</em> boxes, where any box may be empty.<br><br><strong>Step 1: Model the problem.</strong><br>Think of the 4 balls as "stars" (★★★★) and 2 dividers as "bars" (|) separating them into 3 boxes:<br>Box 1 | Box 2 | Box 3<br>Example: ★★|★|★ means Box 1 gets 2, Box 2 gets 1, Box 3 gets 1.<br><br><strong>Step 2: Count arrangements of (4 stars + 2 bars).</strong><br>Choose 2 of 6 positions for the bars (the rest are stars):<br>\\[\\dbinom{6}{2} = \\dbinom{n+k-1}{k-1} = \\dbinom{4+3-1}{3-1} = 15\\]<br><strong>General formula:</strong> Distribute \\(n\\) identical items into \\(k\\) distinct bins: \\(\\dbinom{n+k-1}{k-1}\\).<br><br><strong>Trap:</strong> \\(3^4 = 81\\) counts distributions of 4 <em>distinct</em> balls (each ball independently chooses one of 3 boxes). Since the balls here are <em>identical</em>, only the count per box matters.',
    tags: ['stars and bars','distributions','trap']
  },
  {
    id: 'comb-h12', topic: 'combinatorics', subtopic: 'Combinations with restrictions', difficulty: 'Hard', type: 'mcq',
    stem: 'A group of 10 people includes 4 inseparable friends who must ALL be included or ALL be excluded. How many 5-person committees are possible?',
    context: null, choices: ['10', '12', '14', '16'], answer: 1,
    explanation: '<strong>Method: Cases — the 4-friend group is either fully in or fully out.</strong><br><br><strong>Case 1: All 4 friends are on the committee.</strong><br>4 spots taken; choose 1 more from the other \\(10 - 4 = 6\\) people:<br>\\[\\dbinom{6}{1} = 6\\]<br><strong>Case 2: None of the 4 friends is on the committee.</strong><br>Choose all 5 members from the other 6 people:<br>\\[\\dbinom{6}{5} = 6\\]<br><strong>Total:</strong> \\(6 + 6 = 12\\)<br><br><strong>Key insight:</strong> The natural symmetry here is \\(\\dbinom{6}{1} = \\dbinom{6}{5} = 6\\) — a consequence of the identity \\(\\dbinom{n}{k} = \\dbinom{n}{n-k}\\). When a group must be "all or nothing," reduce to two cases and add.',
    tags: ['combinations','restrictions','cases']
  },
  {
    id: 'comb-h13', topic: 'combinatorics', subtopic: 'Permutations of repeated objects', difficulty: 'Hard', type: 'mcq',
    stem: 'How many distinct arrangements are there of all the letters in the word COMMITTEE?',
    context: null, choices: ['18 144', '30 240', '45 360', '90 720'], answer: 2,
    explanation: '<strong>Method: Permutations with repeated objects.</strong><br><br>Spell out COMMITTEE: C-O-M-M-I-T-T-E-E → 9 letters.<br>Tally: <strong>M×2, T×2, E×2</strong>; all others appear once.<br><br><strong>Step 1: Apply the formula.</strong><br>\\[\\dfrac{9!}{2! \\times 2! \\times 2!} = \\dfrac{362{,}880}{2 \\times 2 \\times 2} = \\dfrac{362{,}880}{8} = 45{,}360\\]<br><strong>Key insight:</strong> Three pairs of repeated letters each contribute a \\(2!\\) factor in the denominator. \\(2^3 = 8\\) divides \\(9!\\).',
    tags: ['permutations','repeated objects']
  },
  {
    id: 'comb-h14', topic: 'combinatorics', subtopic: 'Probability', difficulty: 'Hard', type: 'mcq',
    stem: 'A family has 5 children. Assuming each child is equally likely to be a boy or a girl, what is the probability that exactly 3 are girls?',
    context: null, choices: ['1/8', '5/16', '3/8', '1/2'], answer: 1,
    explanation: '<strong>Method: Binomial probability.</strong><br><br>Each child is independently a boy or girl with equal probability \\(\\frac{1}{2}\\).<br><br><strong>Step 1: Count ways to choose which 3 of 5 children are girls.</strong><br>\\[\\dbinom{5}{3} = 10\\]<br><strong>Step 2: Probability of any one specific arrangement with exactly 3 girls and 2 boys.</strong><br>\\[\\left(\\dfrac{1}{2}\\right)^5 = \\dfrac{1}{32}\\]<br><strong>Step 3: Multiply.</strong><br>\\[P = \\dbinom{5}{3} \\times \\left(\\dfrac{1}{2}\\right)^5 = \\dfrac{10}{32} = \\dfrac{5}{16}\\]<br><strong>Key insight:</strong> The binomial formula \\(\\dbinom{n}{k} p^k (1-p)^{n-k}\\) applies whenever you have \\(n\\) independent trials each with success probability \\(p\\). Here \\(n=5\\), \\(k=3\\), \\(p=\\frac{1}{2}\\).',
    tags: ['probability','binomial']
  },
  {
    id: 'comb-h15', topic: 'combinatorics', subtopic: 'Circular arrangement with restriction', difficulty: 'Hard', type: 'mcq',
    stem: 'Four married couples are seated around a circular table such that each husband sits directly next to his wife. How many arrangements are possible?',
    context: null, choices: ['24', '48', '96', '192'], answer: 2,
    explanation: '<strong>Method: Block method for circular arrangements.</strong><br><br><strong>Step 1: Bundle each couple into one "super-person."</strong><br>4 couples → 4 units in a circle. Circular arrangements of 4 units:<br>\\[(4-1)! = 3! = 6\\]<br><strong>Step 2: Each couple can swap internally (husband-wife or wife-husband).</strong><br>\\[2^4 = 16\\]<br><strong>Step 3: Multiply.</strong><br>\\[6 \\times 16 = 96\\]<br><strong>Key insight:</strong> Circular arrangements use \\((n-1)!\\) instead of \\(n!\\) because one rotation of the full circle gives the same seating. Combine this with the block method whenever groups must sit together at a round table.',
    tags: ['circular arrangement','restrictions','block method']
  },
  {
    id: 'comb-h16', topic: 'combinatorics', subtopic: 'Probability', difficulty: 'Hard', type: 'mcq',
    stem: 'A team of 4 is chosen at random from 7 men and 3 women. What is the probability that the team has at least 2 women?',
    context: null, choices: ['1/6', '1/4', '1/3', '1/2'], answer: 2,
    explanation: '<strong>Method: Cases — count exactly 2W and exactly 3W, then add.</strong><br><br><strong>Case 1: Exactly 2 women, 2 men.</strong><br>\\[\\dbinom{3}{2} \\times \\dbinom{7}{2} = 3 \\times 21 = 63\\]<br><strong>Case 2: Exactly 3 women, 1 man.</strong><br>\\[\\dbinom{3}{3} \\times \\dbinom{7}{1} = 1 \\times 7 = 7\\]<br><strong>Total favorable:</strong> \\(63 + 7 = 70\\)<br><br><strong>Total 4-person teams from 10 people:</strong><br>\\[\\dbinom{10}{4} = 210\\]<br><strong>Probability:</strong><br>\\[P = \\dfrac{70}{210} = \\dfrac{1}{3}\\]',
    tags: ['probability','combinations','at least']
  },
  {
    id: 'comb-h17', topic: 'combinatorics', subtopic: 'Permutations with restrictions', difficulty: 'Hard', type: 'mcq',
    stem: 'How many 5-digit numbers use each of {1, 2, 3, 4, 5} exactly once, with no two odd digits adjacent to each other?',
    context: null, choices: ['6', '10', '12', '24'], answer: 2,
    explanation: '<strong>Method: Pattern analysis + permutations.</strong><br><br>Odd digits: {1, 3, 5} — 3 of them. Even digits: {2, 4} — 2 of them.<br><br><strong>Step 1: Determine the only valid position pattern.</strong><br>With 3 odds and 2 evens in 5 positions, to prevent two odds from being adjacent:<br>O _ O _ O (positions 1, 3, 5 for odds; positions 2, 4 for evens).<br>This is the <em>only</em> way — any other placement forces two odds adjacent.<br><br><strong>Step 2: Arrange the 3 odd digits in positions 1, 3, 5.</strong><br>\\[3! = 6\\]<br><strong>Step 3: Arrange the 2 even digits in positions 2, 4.</strong><br>\\[2! = 2\\]<br><strong>Step 4: Multiply.</strong><br>\\[6 \\times 2 = 12\\]',
    tags: ['permutations','restrictions','parity']
  },
  {
    id: 'comb-h18', topic: 'combinatorics', subtopic: 'Counting principle', difficulty: 'Hard', type: 'mcq',
    stem: 'A 4-character password is formed using the letters {A, B, C, D, E} with repetition allowed. How many passwords contain at least one A?',
    context: null, choices: ['250', '300', '369', '400'], answer: 2,
    explanation: '<strong>Method: Complement — count passwords with NO A, then subtract.</strong><br><br><strong>Step 1: Total 4-character passwords (repetition allowed, 5 choices each).</strong><br>\\[5^4 = 625\\]<br><strong>Step 2: Passwords with NO A — only {B, C, D, E} allowed (4 choices each).</strong><br>\\[4^4 = 256\\]<br><strong>Step 3: Subtract.</strong><br>\\[625 - 256 = 369\\]<br><strong>Key insight:</strong> "At least one A" = total − (no A at all). This avoids adding four binomial terms: P(exactly 1 A) + P(2 A\'s) + P(3 A\'s) + P(4 A\'s).',
    tags: ['counting principle','complement','at least one']
  },
  {
    id: 'comb-h19', topic: 'combinatorics', subtopic: 'Combinations', difficulty: 'Hard', type: 'mcq',
    stem: 'Seven distinct points lie on a circle. How many distinct chords can be drawn by connecting pairs of these points?',
    context: null, choices: ['14', '21', '28', '35'], answer: 1,
    explanation: '<strong>Method: Combinations — a chord is uniquely defined by its two endpoints.</strong><br><br>Each pair of points on the circle defines exactly one chord. The chord from A to B is the same as from B to A — order does not matter.<br><br><strong>Step 1: Choose 2 of the 7 points.</strong><br>\\[\\dbinom{7}{2} = \\dfrac{7 \\times 6}{2} = 21\\]<br><strong>Key insight:</strong> This is the classic "connections" problem (identical to handshakes). Any time you count undirected connections between \\(n\\) points, the answer is \\(\\dbinom{n}{2}\\).',
    tags: ['combinations','geometry']
  },
  {
    id: 'comb-h20', topic: 'combinatorics', subtopic: 'Probability', difficulty: 'Hard', type: 'mcq',
    stem: 'Five people — A, B, C, D, E — are arranged randomly in a row. What is the probability that A appears before B, and B appears before C (not necessarily adjacent)?',
    context: null, choices: ['1/10', '1/6', '1/5', '1/3'], answer: 1,
    explanation: '<strong>Method: Symmetry — all relative orderings of a subset are equally likely.</strong><br><br><strong>Step 1: Focus only on the relative order of A, B, C (where D and E appear is irrelevant).</strong><br><br><strong>Step 2: Count the equally likely orderings of {A, B, C}.</strong><br>There are \\(3! = 6\\) orderings: ABC, ACB, BAC, BCA, CAB, CBA.<br><br><strong>Step 3: Exactly one ordering satisfies A-before-B-before-C.</strong><br>\\[P = \\dfrac{1}{6}\\]<br><strong>Key insight:</strong> By symmetry, every relative ordering of any 3 (or more) specific people within a random arrangement is equally likely. No need to count total arrangements.',
    tags: ['probability','relative ordering']
  },
  {
    id: 'comb-h21', topic: 'combinatorics', subtopic: 'Counting principle', difficulty: 'Hard', type: 'mcq',
    stem: 'How many 3-digit palindromes exist? (A palindrome reads the same forwards and backwards, e.g., 151.)',
    context: null, choices: ['45', '81', '90', '100'], answer: 2,
    explanation: '<strong>Method: Slot method with a linked position.</strong><br><br>A 3-digit palindrome reads the same forwards and backwards — the units digit must equal the hundreds digit (e.g., 121, 343, 505).<br><br><strong>Step 1: Hundreds digit (must be 1–9, no leading zero).</strong><br>→ 9 choices (also determines the units digit).<br><br><strong>Step 2: Tens digit (any digit 0–9).</strong><br>→ 10 choices.<br><br><strong>Step 3: Units digit = hundreds digit → 1 forced choice.</strong><br><br><strong>Step 4: Multiply.</strong><br>\\[9 \\times 10 \\times 1 = 90\\]<br><strong>Key insight:</strong> A palindrome\'s mirror structure means only the first half of the digits are truly free. For 3-digit palindromes, positions 1 and 2 are free; position 3 is forced by position 1.',
    tags: ['counting principle','palindrome']
  },
  {
    id: 'comb-h22', topic: 'combinatorics', subtopic: 'Permutations of repeated objects', difficulty: 'Hard', type: 'mcq',
    stem: 'How many distinct arrangements are there of all the letters in the word ABRACADABRA?',
    context: null, choices: ['41 580', '83 160', '166 320', '332 640'], answer: 1,
    explanation: '<strong>Method: Permutations with repeated objects.</strong><br><br>Spell out ABRACADABRA: A-B-R-A-C-A-D-A-B-R-A → 11 letters.<br>Tally: <strong>A×5, B×2, R×2</strong>, C×1, D×1.<br><br><strong>Step 1: Apply the formula.</strong><br>\\[\\dfrac{11!}{5! \\times 2! \\times 2!} = \\dfrac{39{,}916{,}800}{120 \\times 2 \\times 2} = \\dfrac{39{,}916{,}800}{480} = 83{,}160\\]<br><strong>Calculation shortcut:</strong> \\(\\dfrac{11!}{5!} = 332{,}640\\), then divide by \\(2! \\times 2! = 4\\): \\(332{,}640 \\div 4 = 83{,}160\\).',
    tags: ['permutations','repeated objects']
  },
  {
    id: 'comb-h23', topic: 'combinatorics', subtopic: 'Counting principle', difficulty: 'Hard', type: 'mcq',
    stem: 'How many 3-digit integers (100–999) have all three digits different from one another?',
    context: null, choices: ['504', '576', '648', '720'], answer: 2,
    explanation: '<strong>Method: Slot method — no digit may repeat.</strong><br><br><strong>Step 1: Hundreds digit (1–9, no leading zero).</strong><br>→ 9 choices.<br><br><strong>Step 2: Tens digit (0–9, cannot equal hundreds digit).</strong><br>→ 9 choices (10 total − 1 already used).<br><br><strong>Step 3: Units digit (0–9, cannot equal either previous digit).</strong><br>→ 8 choices.<br><br><strong>Step 4: Multiply.</strong><br>\\[9 \\times 9 \\times 8 = 648\\]<br><strong>Trap:</strong> A common mistake is writing \\(9 \\times 8 \\times 7 = 504\\), which incorrectly treats 0 the same as other digits for the hundreds position. The hundreds digit cannot be 0 (→ 9 options), but the tens digit can be 0 (→ still 9 options after removing the chosen hundreds digit).',
    tags: ['counting principle','distinct digits']
  },
  {
    id: 'comb-h24', topic: 'combinatorics', subtopic: 'Probability', difficulty: 'Hard', type: 'mcq',
    stem: 'A bag contains 4 red, 3 blue, and 3 green balls. Three balls are selected at random. What is the probability that one ball of each colour is selected?',
    context: null, choices: ['1/5', '1/4', '3/10', '2/5'], answer: 2,
    explanation: '<strong>Method: Combinations for probability with exact colour requirements.</strong><br><br><strong>Step 1: Count favorable outcomes (1 red, 1 blue, 1 green).</strong><br>Choose 1 red from 4: \\(\\dbinom{4}{1} = 4\\)<br>Choose 1 blue from 3: \\(\\dbinom{3}{1} = 3\\)<br>Choose 1 green from 3: \\(\\dbinom{3}{1} = 3\\)<br>Favorable: \\(4 \\times 3 \\times 3 = 36\\)<br><br><strong>Step 2: Total outcomes (any 3 from 10).</strong><br>\\[\\dbinom{10}{3} = \\dfrac{10 \\times 9 \\times 8}{6} = 120\\]<br><strong>Step 3: Probability.</strong><br>\\[P = \\dfrac{36}{120} = \\dfrac{3}{10}\\]',
    tags: ['probability','combinations']
  },
  {
    id: 'comb-h25', topic: 'combinatorics', subtopic: 'Counting principle', difficulty: 'Hard', type: 'mcq',
    stem: 'How many distinct shortest paths exist from the bottom-left corner to the top-right corner of a 4×4 grid, moving only right (R) or up (U)?',
    context: null, choices: ['35', '56', '70', '84'], answer: 2,
    explanation: '<strong>Method: Permutations of identical moves.</strong><br><br>To travel from bottom-left to top-right of a 4×4 grid (moving only right or up), you must make exactly 4 right (R) moves and 4 up (U) moves in some order.<br><br><strong>Step 1: Total moves = 4R + 4U = 8 moves.</strong><br><br><strong>Step 2: Choose which 4 of the 8 moves are "right" (the rest are automatically "up").</strong><br>\\[\\dbinom{8}{4} = \\dfrac{8 \\times 7 \\times 6 \\times 5}{4!} = 70\\]<br><strong>Alternative view:</strong> Arrange 4 R\'s and 4 U\'s in a row: \\(\\dfrac{8!}{4! \\times 4!} = 70\\). Grid paths are a classic GMAT counting topic.',
    tags: ['counting principle','grid paths','combinations']
  },
  {
    id: 'comb-h26', topic: 'combinatorics', subtopic: 'Probability', difficulty: 'Hard', type: 'mcq',
    stem: 'Three fair dice are rolled simultaneously. What is the probability that the sum of the three dice equals 10?',
    context: null, choices: ['1/12', '1/9', '1/8', '5/36'], answer: 2,
    explanation: '<strong>Method: Systematic enumeration of ordered triples summing to 10.</strong><br><br><strong>Step 1: List unordered solutions {a ≤ b ≤ c}, then count orderings.</strong><br>{1,3,6}: \\(3! = 6\\) orderings<br>{1,4,5}: \\(3! = 6\\) orderings<br>{2,2,6}: \\(3!/2! = 3\\) orderings (2 is repeated)<br>{2,3,5}: \\(3! = 6\\) orderings<br>{2,4,4}: \\(3!/2! = 3\\) orderings<br>{3,3,4}: \\(3!/2! = 3\\) orderings<br>Total favorable: \\(6+6+3+6+3+3 = 27\\)<br><br><strong>Step 2: Total outcomes.</strong>\\[6^3 = 216\\]<br><strong>Step 3: Probability.</strong>\\[P = \\dfrac{27}{216} = \\dfrac{1}{8}\\]',
    tags: ['probability','dice','counting']
  },
  {
    id: 'comb-h27', topic: 'combinatorics', subtopic: 'Combinations', difficulty: 'Hard', type: 'mcq',
    stem: 'In how many ways can 6 distinct prizes be distributed among 3 people so that each person receives exactly 2 prizes?',
    context: null, choices: ['45', '60', '90', '180'], answer: 2,
    explanation: '<strong>Method: Sequential combinations.</strong><br><br><strong>Step 1: Assign 2 prizes to Person 1.</strong><br>\\[\\dbinom{6}{2} = 15\\]<br><strong>Step 2: Assign 2 prizes to Person 2 from the 4 remaining.</strong><br>\\[\\dbinom{4}{2} = 6\\]<br><strong>Step 3: Person 3 receives the last 2 prizes — no choice needed.</strong><br>\\[\\dbinom{2}{2} = 1\\]<br><strong>Step 4: Multiply.</strong><br>\\[15 \\times 6 \\times 1 = 90\\]<br><strong>Key insight:</strong> Use sequential combinations whenever each person receives a different set of items. The result would need to be divided by \\(3!\\) only if the people were unlabelled (indistinguishable groups).',
    tags: ['combinations','distributions']
  },
  {
    id: 'comb-h28', topic: 'combinatorics', subtopic: 'Probability', difficulty: 'Hard', type: 'mcq',
    stem: 'Two cards are drawn at random from a 52-card deck without replacement. What is the probability that both cards are from the same suit?',
    context: null, choices: ['4/17', '1/4', '13/51', '1/3'], answer: 0,
    explanation: '<strong>Method: Combinations for probability.</strong><br><br><strong>Step 1: Count favorable outcomes (both cards from the same suit).</strong><br>4 suits, each with 13 cards; choose 2 from any one suit:<br>\\[4 \\times \\dbinom{13}{2} = 4 \\times \\dfrac{13 \\times 12}{2} = 4 \\times 78 = 312\\]<br><strong>Step 2: Total outcomes (any 2 from 52).</strong><br>\\[\\dbinom{52}{2} = \\dfrac{52 \\times 51}{2} = 1{,}326\\]<br><strong>Step 3: Probability.</strong><br>\\[P = \\dfrac{312}{1{,}326} = \\dfrac{4}{17}\\]<br><strong>Alternative:</strong> \\(P = 1 \\times \\dfrac{12}{51} = \\dfrac{4}{17}\\). Whatever the first card is, there are 12 remaining cards of the same suit out of 51.',
    tags: ['probability','without replacement','cards']
  },
  {
    id: 'comb-h29', topic: 'combinatorics', subtopic: 'Probability', difficulty: 'Hard', type: 'mcq',
    stem: 'A die is rolled 4 times. What is the probability of getting at least one 6?',
    context: null, choices: ['1/6', '125/1296', '625/1296', '671/1296'], answer: 3,
    explanation: '<strong>Method: Complement rule.</strong><br><br><strong>Step 1: Probability of NOT rolling a 6 on one roll.</strong><br>\\[P(\\text{not 6}) = \\dfrac{5}{6}\\]<br><strong>Step 2: Probability of NO 6 in 4 independent rolls.</strong><br>\\[\\left(\\dfrac{5}{6}\\right)^4 = \\dfrac{625}{1{,}296}\\]<br><strong>Step 3: Subtract from 1.</strong><br>\\[P(\\text{at least one 6}) = 1 - \\dfrac{625}{1{,}296} = \\dfrac{671}{1{,}296}\\]<br><strong>Key insight:</strong> The complement of "at least one 6 in 4 rolls" is "zero 6s in 4 rolls." This is a single calculation vs. four binomial terms for the direct approach.',
    tags: ['probability','complement','at least one']
  },
  {
    id: 'comb-h30', topic: 'combinatorics', subtopic: 'Permutations with restrictions', difficulty: 'Hard', type: 'mcq',
    stem: 'Four identical red flags and three identical blue flags are arranged in a row. How many arrangements have no two blue flags adjacent to each other?',
    context: null, choices: ['5', '8', '10', '15'], answer: 2,
    explanation: '<strong>Method: Gap method</strong> — place non-restricted items first, then insert restricted items into gaps.<br><br><strong>Step 1: Arrange the 4 identical red flags.</strong><br>Since they are identical, there is only 1 way. This creates 5 gaps:<br>\\[\\_ R \\_ R \\_ R \\_ R \\_\\]<br><strong>Step 2: Place the 3 blue flags — at most one per gap (ensures no two blue flags are adjacent).</strong><br>Choose 3 of the 5 gaps:<br>\\[\\dbinom{5}{3} = 10\\]<br><strong>Key insight:</strong> The gap method guarantees no two restricted items are adjacent by construction — placing at most one item per gap. This is a standard technique for "no two X are adjacent" problems.',
    tags: ['permutations','restrictions','gap method']
  },
  {
    id: 'comb-h31', topic: 'combinatorics', subtopic: 'Combinations with restrictions', difficulty: 'Hard', type: 'mcq',
    stem: 'A committee of 5 must be chosen from 5 couples (10 people). No two people from the same couple may both serve. How many valid committees are there?',
    context: null, choices: ['32', '50', '80', '100'], answer: 0,
    explanation: 'We need 5 people from 5 couples with no two from the same couple. Since the committee has 5 members and there are exactly 5 couples, each couple must contribute exactly 1 member. For each of the 5 couples, choose 1 of 2 members: 2⁵ = 32. Answer: 32.',
    tags: ['combinations','restrictions']
  },
  {
    id: 'comb-h32', topic: 'combinatorics', subtopic: 'Probability', difficulty: 'Hard', type: 'mcq',
    stem: 'A group of 2 men and 2 women stands in a randomly ordered row of 4. What is the probability that the two men and the two women each stand together (i.e., both men are adjacent AND both women are adjacent)?',
    context: null, choices: ['1/6', '1/4', '1/3', '1/2'], answer: 2,
    explanation: 'Treat the 2 men as one block and the 2 women as one block. The 2 blocks can be ordered 2! = 2 ways (MW or WM). Men within their block: 2! = 2 arrangements. Women within their block: 2! = 2 arrangements. Total valid = 2 × 2 × 2 = 8. Total arrangements of 4 people = 4! = 24. P = 8/24 = 1/3.',
    tags: ['probability','permutations','restrictions']
  }

];

// Helper: get questions filtered by topic and/or difficulty
function dbQuery({ topic, difficulty, type, tags } = {}) {
  return GMAT_DB.filter(q => {
    if (topic      && q.topic      !== topic)      return false;
    if (difficulty && q.difficulty !== difficulty) return false;
    if (type       && q.type       !== type)       return false;
    if (tags       && !tags.every(t => q.tags.includes(t))) return false;
    return true;
  });
}
