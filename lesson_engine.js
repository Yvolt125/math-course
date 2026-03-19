/**
 * lesson_engine.js
 *
 * Requires window.LESSON_DATA = {
 *   id, title, subtitle, color,
 *   isReview: bool,      // true for daily review / error sessions
 *   questions: [...]
 * }
 *
 * Question types:
 *   { type:'mc',   prompt, options:[], answer:N,         explanation }
 *   { type:'type', prompt,            answer:'word',     explanation }
 *   { type:'fill', before, after,     answer:'word',     explanation }
 *   { type:'tf',   prompt,            answer:true/false, explanation }
 *
 * SRS fields (present when question came from SRS pool):
 *   { id:'w1s1_q0', lessonTitle:'...', ... }
 */
(function () {
'use strict';

const D     = window.LESSON_DATA;
const color = D.color || '#2980b9';

// ── Inject CSS ─────────────────────────────────────────────────────────────────
const style = document.createElement('style');
style.textContent = `
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Segoe UI',Tahoma,sans-serif;background:#f0f2f5;min-height:100vh;display:flex;flex-direction:column;}
#lr{display:flex;flex-direction:column;min-height:100vh;}

.le-header{background:#2c3e50;color:white;padding:14px 18px;display:flex;align-items:center;justify-content:space-between;}
.le-back{color:rgba(255,255,255,0.7);text-decoration:none;font-size:0.88em;}
.le-back:hover{color:white;}
.le-title{font-size:0.92em;font-weight:700;letter-spacing:0.5px;text-align:center;flex:1;}
.le-hearts{display:flex;gap:4px;font-size:1.3em;}
.le-heart{transition:transform 0.2s;}
.le-heart.lost{opacity:0.2;transform:scale(0.85);}

.le-progress-wrap{height:6px;background:#dce8f5;}
.le-progress-fill{height:100%;background:${color};transition:width 0.35s;}
.le-progress-label{text-align:center;font-size:0.75em;color:#7f8c8d;padding:8px 0 2px;font-weight:600;}

.le-lesson-tag{text-align:center;font-size:0.68em;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;padding:4px 0 0;color:${color};}

.le-card{flex:1;display:flex;flex-direction:column;align-items:center;padding:20px 18px 16px;max-width:600px;width:100%;margin:0 auto;}
.le-q-type{font-size:0.68em;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:${color};margin-bottom:14px;}
.le-q-prompt{font-size:1.12em;font-weight:700;color:#2c3e50;line-height:1.6;text-align:center;margin-bottom:22px;}

.le-options{width:100%;display:flex;flex-direction:column;gap:10px;margin-bottom:8px;}
.le-opt{width:100%;padding:13px 18px;border:2px solid #dce8f5;border-radius:12px;background:white;font-size:0.97em;font-weight:600;color:#2c3e50;cursor:pointer;text-align:left;transition:border-color 0.15s,background 0.15s;}
.le-opt:hover{border-color:#aac8e8;background:#f5faff;}
.le-opt.selected{border-color:${color};background:#eaf4fb;}
.le-opt.correct{border-color:#27ae60;background:#eafaf1;color:#1a6b3c;}
.le-opt.wrong{border-color:#e74c3c;background:#fdecea;color:#7d1a1a;}

.le-type-wrap{width:100%;margin-bottom:8px;}
.le-type-input{width:100%;padding:14px 16px;border:2px solid #dce8f5;border-radius:12px;font-size:1.05em;font-family:inherit;outline:none;color:#2c3e50;background:white;transition:border-color 0.2s;}
.le-type-input:focus{border-color:${color};}
.le-type-input.correct{border-color:#27ae60;background:#eafaf1;}
.le-type-input.wrong{border-color:#e74c3c;background:#fdecea;}

.le-fill-wrap{display:flex;align-items:center;flex-wrap:wrap;justify-content:center;gap:6px;margin-bottom:16px;font-size:1.05em;font-weight:600;color:#2c3e50;}
.le-fill-before,.le-fill-after{white-space:pre;}
.le-blank{border:none;border-bottom:2.5px solid ${color};outline:none;font-size:1em;font-weight:700;font-family:inherit;width:110px;text-align:center;padding:2px 4px;background:transparent;color:#2c3e50;}
.le-blank.correct{border-color:#27ae60;color:#1a6b3c;}
.le-blank.wrong{border-color:#e74c3c;color:#7d1a1a;}

.le-tf-wrap{display:flex;gap:14px;width:100%;margin-bottom:8px;}
.le-tf-btn{flex:1;padding:18px;border:2px solid #dce8f5;border-radius:14px;background:white;font-size:1.05em;font-weight:700;cursor:pointer;transition:all 0.15s;}
.le-tf-btn:hover{border-color:#aac8e8;background:#f5faff;}
.le-tf-btn.selected{border-color:${color};background:#eaf4fb;}
.le-tf-btn.correct{border-color:#27ae60;background:#eafaf1;color:#1a6b3c;}
.le-tf-btn.wrong{border-color:#e74c3c;background:#fdecea;color:#7d1a1a;}

.le-feedback{width:100%;border-radius:12px;padding:14px 16px;font-size:0.88em;line-height:1.6;margin-bottom:16px;display:none;}
.le-feedback.correct{background:#eafaf1;border-left:4px solid #27ae60;color:#1a6b3c;}
.le-feedback.wrong{background:#fdecea;border-left:4px solid #e74c3c;color:#7d1a1a;}
.le-feedback-title{font-weight:800;margin-bottom:4px;}

.le-continue{width:100%;max-width:600px;margin:0 auto;padding:0 18px 24px;}
.le-continue-btn{width:100%;padding:15px;border:none;border-radius:14px;background:${color};color:white;font-size:1.05em;font-weight:700;cursor:pointer;transition:opacity 0.2s;}
.le-continue-btn:disabled{opacity:0.35;cursor:not-allowed;}
.le-continue-btn:hover:not(:disabled){opacity:0.88;}

.le-completion{display:none;flex-direction:column;align-items:center;text-align:center;padding:40px 24px;flex:1;}
.le-completion-icon{font-size:4em;margin-bottom:16px;}
.le-completion h2{font-size:1.6em;color:#2c3e50;margin-bottom:8px;}
.le-completion p{color:#7f8c8d;font-size:0.95em;margin-bottom:28px;}
.le-crowns-row{display:flex;gap:10px;justify-content:center;font-size:2.5em;margin-bottom:10px;}
.le-crown-pip{opacity:0.2;transition:opacity 0.4s;}
.le-crown-pip.earned{opacity:1;}
.le-xp-pill{background:${color};color:white;padding:6px 22px;border-radius:20px;font-weight:700;font-size:1em;margin-bottom:32px;display:inline-block;}
.le-comp-btns{display:flex;flex-direction:column;gap:10px;width:100%;max-width:360px;}
.le-comp-btn{padding:14px;border:none;border-radius:12px;font-size:1em;font-weight:700;cursor:pointer;}
.le-comp-btn.primary{background:${color};color:white;}
.le-comp-btn.secondary{background:white;color:#2c3e50;border:2px solid #dce8f5;}
.le-comp-btn:hover{opacity:0.88;}

.le-failure{display:none;flex-direction:column;align-items:center;text-align:center;padding:40px 24px;flex:1;}
.le-failure-icon{font-size:4em;margin-bottom:16px;}
.le-failure h2{font-size:1.5em;color:#2c3e50;margin-bottom:8px;}
.le-failure p{color:#7f8c8d;font-size:0.95em;margin-bottom:32px;}

.le-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;flex:1;text-align:center;padding:40px 24px;gap:16px;}
.le-empty-icon{font-size:4em;}
.le-empty h2{color:#2c3e50;font-size:1.4em;}
.le-empty p{color:#7f8c8d;font-size:0.93em;max-width:320px;}

.le-visual{width:100%;display:flex;justify-content:center;margin-bottom:16px;}
.le-visual svg{max-width:100%;height:auto;}
.le-calc-hint{font-size:0.78em;color:#7f8c8d;text-align:center;margin-top:6px;}
`;
document.head.appendChild(style);

// ── Empty state (no questions due / no errors) ─────────────────────────────────
if (!D.questions || D.questions.length === 0) {
    document.body.innerHTML = `
    <div id="lr">
      <header class="le-header">
        <a class="le-back" href="lessons.html">← Back</a>
        <span class="le-title">${D.title}</span>
        <span style="width:40px"></span>
      </header>
      <div class="le-empty">
        <div class="le-empty-icon">${D.emptyIcon || '✅'}</div>
        <h2>${D.emptyTitle || 'All caught up!'}</h2>
        <p>${D.emptyMsg || 'Nothing to review right now. Come back later.'}</p>
        <button class="le-comp-btn primary" style="margin-top:8px;max-width:260px;" onclick="window.location.href='lessons.html'">Back to Lessons</button>
      </div>
    </div>`;
    return;
}

// ── Inject HTML ────────────────────────────────────────────────────────────────
document.body.innerHTML = `
<div id="lr">
  <header class="le-header">
    <a class="le-back" href="lessons.html">✕</a>
    <span class="le-title">${D.title}</span>
    <div class="le-hearts" id="le-hearts">
      <span class="le-heart" id="h1">♥</span>
      <span class="le-heart" id="h2">♥</span>
      <span class="le-heart" id="h3">♥</span>
    </div>
  </header>
  <div class="le-progress-wrap"><div class="le-progress-fill" id="le-prog" style="width:0%"></div></div>
  <div class="le-progress-label" id="le-prog-label"></div>
  <div class="le-lesson-tag" id="le-lesson-tag"></div>

  <div class="le-card" id="le-card">
    <div class="le-q-type" id="le-q-type"></div>
    <div class="le-visual" id="le-visual" style="display:none"></div>
    <div class="le-q-prompt" id="le-q-prompt"></div>
    <div id="le-q-input"></div>
    <div class="le-feedback" id="le-feedback"></div>
  </div>

  <div class="le-continue" id="le-continue-wrap">
    <button class="le-continue-btn" id="le-continue-btn" disabled>Check</button>
  </div>

  <div class="le-completion" id="le-completion">
    <div class="le-completion-icon">🎉</div>
    <h2>Done!</h2>
    <p id="le-comp-sub"></p>
    <div class="le-crowns-row" id="le-crowns-row">
      <span class="le-crown-pip" id="cp1">♛</span>
      <span class="le-crown-pip" id="cp2">♛</span>
      <span class="le-crown-pip" id="cp3">♛</span>
    </div>
    <div class="le-xp-pill" id="le-xp-pill">+0 XP</div>
    <div class="le-comp-btns">
      <button class="le-comp-btn primary" id="le-comp-primary">Back to Lessons</button>
      <button class="le-comp-btn secondary" onclick="window.location.reload()">Go again</button>
    </div>
  </div>

  <div class="le-failure" id="le-failure">
    <div class="le-failure-icon">💔</div>
    <h2>Out of hearts!</h2>
    <p>Give it another go.</p>
    <div class="le-comp-btns">
      <button class="le-comp-btn primary" onclick="window.location.reload()">Try Again</button>
      <button class="le-comp-btn secondary" onclick="window.location.href='lessons.html'">Back to Lessons</button>
    </div>
  </div>
</div>
`;

// Review mode: "Back" goes to review, else to lessons
if (D.isReview) {
    document.getElementById('le-comp-primary').textContent = 'Back to Lessons';
    document.getElementById('le-comp-primary').onclick = () => window.location.href = 'lessons.html';
} else {
    document.getElementById('le-comp-primary').onclick = () => window.location.href = 'lessons.html';
}

// Hide crowns row for review sessions (no crown tracking)
if (D.isReview) {
    document.getElementById('le-crowns-row').style.display = 'none';
}

// ── SRS ────────────────────────────────────────────────────────────────────────
const SRS_KEY = 'srs_pool';
const INTERVALS = [1, 3, 7, 14, 30, 60]; // days per streak level

function getSRSPool() {
    return JSON.parse(localStorage.getItem(SRS_KEY) || '[]');
}
function saveSRSPool(pool) {
    localStorage.setItem(SRS_KEY, JSON.stringify(pool));
}

function registerInSRS() {
    // Called on first-time lesson completion — adds all questions to the SRS pool
    const pool = getSRSPool();
    const existingIds = new Set(pool.map(q => q.id));
    let added = 0;

    D.questions.forEach((q, i) => {
        const id = `${D.id}_q${i}`;
        if (!existingIds.has(id)) {
            pool.push({
                ...q,
                id,
                lessonId: D.id,
                lessonTitle: D.title,
                color: D.color,
                interval: 1,
                easeFactor: 2.5,
                nextDue: Date.now() + INTERVALS[0] * 24 * 3600 * 1000,
                timesCorrect: 0,
                timesWrong: 0,
                streak: 0
            });
            added++;
        }
    });

    saveSRSPool(pool);
}

function updateSRSRecord(qId, correct) {
    // Called after each answer in review / error sessions
    const pool = getSRSPool();
    const q = pool.find(item => item.id === qId);
    if (!q) return;

    if (correct) {
        q.timesCorrect++;
        q.streak = (q.streak || 0) + 1;
        const idx = Math.min(q.streak, INTERVALS.length - 1);
        q.interval = INTERVALS[idx];
        q.nextDue = Date.now() + q.interval * 24 * 3600 * 1000;
    } else {
        q.timesWrong = (q.timesWrong || 0) + 1;
        q.streak = 0;
        q.interval = INTERVALS[0];
        q.nextDue = Date.now() + q.interval * 24 * 3600 * 1000;
    }
    q.lastSeen = Date.now();
    saveSRSPool(pool);
}

// ── State ──────────────────────────────────────────────────────────────────────
const qs       = D.questions.slice();
let queue      = qs.map((_, i) => i);
let qPos       = 0;
let hearts     = 3;
let wrongCount = 0;
let shownCount = 0;
let answered   = false;
let selected   = null;

function currentQ() { return qs[queue[qPos]]; }

// ── Progress ───────────────────────────────────────────────────────────────────
function updateProgress() {
    const total = qs.length;
    const done  = Math.min(qPos, total);
    document.getElementById('le-prog').style.width = (done / total * 100) + '%';
    document.getElementById('le-prog-label').textContent =
        'Question ' + Math.min(qPos + 1, total) + ' of ' + total;
}

// ── Hearts ─────────────────────────────────────────────────────────────────────
function loseHeart() {
    hearts--;
    const hEl = document.getElementById('h' + (3 - hearts));
    if (hEl) hEl.classList.add('lost');
    if (hearts <= 0) setTimeout(showFailure, 600);
}

// ── Render ─────────────────────────────────────────────────────────────────────
function renderQ() {
    if (qPos >= queue.length) { showCompletion(); return; }

    answered = false;
    selected = null;
    const q = currentQ();

    // Show which lesson this question is from (review mode)
    const tag = document.getElementById('le-lesson-tag');
    tag.textContent = (D.isReview && q.lessonTitle) ? '← ' + q.lessonTitle : '';

    // Show/hide visual
    const visEl = document.getElementById('le-visual');
    if (q.visual) { visEl.innerHTML = q.visual; visEl.style.display = 'flex'; }
    else { visEl.innerHTML = ''; visEl.style.display = 'none'; }

    document.getElementById('le-q-prompt').innerHTML = q.prompt || '';
    document.getElementById('le-feedback').style.display = 'none';
    document.getElementById('le-feedback').className = 'le-feedback';

    const btn = document.getElementById('le-continue-btn');
    btn.textContent = 'Check';
    btn.disabled = true;

    const inp = document.getElementById('le-q-input');
    inp.innerHTML = '';
    document.getElementById('le-q-type').textContent = '';

    if (q.type === 'mc') {
        document.getElementById('le-q-type').textContent = 'Choose the correct answer';
        const wrap = document.createElement('div');
        wrap.className = 'le-options';
        q.options.forEach((opt, i) => {
            const b = document.createElement('button');
            b.className = 'le-opt';
            b.textContent = opt;
            b.onclick = () => { if (answered) return; selected = i; document.querySelectorAll('.le-opt').forEach(x => x.classList.remove('selected')); b.classList.add('selected'); btn.disabled = false; };
            wrap.appendChild(b);
        });
        inp.appendChild(wrap);

    } else if (q.type === 'tf') {
        document.getElementById('le-q-type').textContent = 'True or False?';
        const wrap = document.createElement('div');
        wrap.className = 'le-tf-wrap';
        ['True','False'].forEach(label => {
            const b = document.createElement('button');
            b.className = 'le-tf-btn';
            b.textContent = label;
            b.onclick = () => { if (answered) return; selected = label === 'True'; wrap.querySelectorAll('.le-tf-btn').forEach(x => x.classList.remove('selected')); b.classList.add('selected'); btn.disabled = false; };
            wrap.appendChild(b);
        });
        inp.appendChild(wrap);

    } else if (q.type === 'type') {
        document.getElementById('le-q-type').textContent = 'Type your answer';
        const wrap = document.createElement('div');
        wrap.className = 'le-type-wrap';
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'le-type-input';
        input.placeholder = 'Type here…';
        input.id = 'le-type-field';
        input.addEventListener('input', () => { btn.disabled = input.value.trim().length === 0; });
        input.addEventListener('keydown', e => { if (e.key === 'Enter' && !btn.disabled && !answered) btn.click(); });
        wrap.appendChild(input);
        inp.appendChild(wrap);
        setTimeout(() => input.focus(), 80);

    } else if (q.type === 'fill') {
        document.getElementById('le-q-type').textContent = 'Fill in the blank';
        document.getElementById('le-q-prompt').innerHTML = '';
        const wrap = document.createElement('div');
        wrap.className = 'le-fill-wrap';
        const before = document.createElement('span');
        before.className = 'le-fill-before';
        before.innerHTML = q.before;
        const blank = document.createElement('input');
        blank.type = 'text';
        blank.className = 'le-blank';
        blank.id = 'le-type-field';
        blank.placeholder = '?';
        blank.addEventListener('input', () => { btn.disabled = blank.value.trim().length === 0; });
        blank.addEventListener('keydown', e => { if (e.key === 'Enter' && !btn.disabled && !answered) btn.click(); });
        const after = document.createElement('span');
        after.className = 'le-fill-after';
        after.innerHTML = q.after;
        wrap.appendChild(before);
        wrap.appendChild(blank);
        wrap.appendChild(after);
        inp.appendChild(wrap);
        setTimeout(() => blank.focus(), 80);

    } else if (q.type === 'calc') {
        document.getElementById('le-q-type').textContent = 'Calculate';
        const wrap = document.createElement('div');
        wrap.className = 'le-type-wrap';
        const input = document.createElement('input');
        input.type = 'text';
        input.inputMode = 'decimal';
        input.className = 'le-type-input';
        input.placeholder = 'Enter a number…';
        input.id = 'le-type-field';
        input.addEventListener('input', () => { btn.disabled = input.value.trim().length === 0; });
        input.addEventListener('keydown', e => { if (e.key === 'Enter' && !btn.disabled && !answered) btn.click(); });
        wrap.appendChild(input);
        if (q.hint) {
            const hint = document.createElement('div');
            hint.className = 'le-calc-hint';
            hint.textContent = q.hint;
            wrap.appendChild(hint);
        }
        inp.appendChild(wrap);
        setTimeout(() => input.focus(), 80);
    }

    updateProgress();
    shownCount++;
}

// ── Check answer ───────────────────────────────────────────────────────────────
function checkAnswer() {
    if (answered) { advance(); return; }
    answered = true;

    const q = currentQ();
    let correct = false;

    if (q.type === 'mc') {
        correct = selected === q.answer;
        document.querySelectorAll('.le-opt').forEach((b, i) => {
            if (i === q.answer) b.classList.add('correct');
            else if (i === selected && !correct) b.classList.add('wrong');
        });

    } else if (q.type === 'tf') {
        correct = selected === q.answer;
        document.querySelectorAll('.le-tf-btn').forEach(b => {
            const isTrue = b.textContent === 'True';
            if (isTrue === q.answer) b.classList.add('correct');
            else if (isTrue === selected && !correct) b.classList.add('wrong');
        });

    } else if (q.type === 'type' || q.type === 'fill') {
        const field = document.getElementById('le-type-field');
        const val = (field.value || '').toLowerCase().trim();
        const acceptable = Array.isArray(q.answer) ? q.answer : [q.answer];
        correct = acceptable.some(a => val.includes(a.toLowerCase()));
        field.classList.add(correct ? 'correct' : 'wrong');
        field.disabled = true;

    } else if (q.type === 'calc') {
        const field = document.getElementById('le-type-field');
        const userVal = parseFloat(field.value.replace(',', '.'));
        const expected = parseFloat(q.answer);
        const tol = q.tolerance !== undefined ? q.tolerance : 0.01;
        correct = !isNaN(userVal) && Math.abs(userVal - expected) <= tol;
        field.classList.add(correct ? 'correct' : 'wrong');
        field.disabled = true;
    }

    // Update SRS immediately if in review/error mode
    if (D.isReview && q.id) {
        updateSRSRecord(q.id, correct);
    }

    showFeedback(correct, q.explanation, q);
    document.getElementById('le-continue-btn').textContent = 'Continue';
    document.getElementById('le-continue-btn').disabled = false;

    if (!correct) {
        wrongCount++;
        loseHeart();
        if (hearts > 0) requeue();
    }
}

function showFeedback(correct, explanation, q) {
    const fb = document.getElementById('le-feedback');
    fb.className = 'le-feedback ' + (correct ? 'correct' : 'wrong');
    const correctLabel = q.type === 'tf'   ? (q.answer ? 'True' : 'False') :
                         q.type === 'mc'   ? q.options[q.answer] :
                         q.type === 'calc' ? String(q.answer) :
                         Array.isArray(q.answer) ? q.answer[0] : q.answer;
    fb.innerHTML = `<div class="le-feedback-title">${correct ? '✓ Correct!' : '✗ Incorrect — answer: ' + correctLabel}</div>${explanation}`;
    fb.style.display = 'block';
}

function requeue() {
    const idx = queue[qPos];
    const insertAt = Math.min(qPos + 3, queue.length);
    queue.splice(insertAt, 0, idx);
}

function advance() {
    qPos++;
    if (qPos >= queue.length) { showCompletion(); return; }
    renderQ();
}

// ── Completion ─────────────────────────────────────────────────────────────────
function showCompletion() {
    document.getElementById('le-card').style.display = 'none';
    document.getElementById('le-continue-wrap').style.display = 'none';

    const accuracy = shownCount > 0 ? (shownCount - wrongCount) / shownCount : 1;

    if (D.isReview) {
        // Review completion — no crowns, lighter XP
        const xp = Math.round(accuracy * 30);
        document.getElementById('le-xp-pill').textContent = '+' + xp + ' XP';
        document.getElementById('le-comp-sub').textContent =
            Math.round(accuracy * 100) + '% accuracy across ' + qs.length + ' questions.';
        const totalXP = parseInt(localStorage.getItem('totalXP') || '0') + xp;
        localStorage.setItem('totalXP', totalXP);

    } else {
        // Lesson completion — crowns, full XP, register to SRS
        const crowns = accuracy >= 0.85 ? 3 : accuracy >= 0.65 ? 2 : 1;
        const xp     = crowns === 3 ? 75 : crowns === 2 ? 60 : 50;

        for (let i = 1; i <= crowns; i++) {
            setTimeout(() => document.getElementById('cp' + i).classList.add('earned'), i * 300);
        }

        document.getElementById('le-xp-pill').textContent = '+' + xp + ' XP';
        document.getElementById('le-comp-sub').textContent =
            accuracy >= 0.85 ? 'Excellent! Questions scheduled for review tomorrow.' :
            accuracy >= 0.65 ? 'Good work! Questions added to your review queue.' :
            'Completed — questions added to review queue. Retry for more crowns.';

        // Save lesson progress
        const key  = 'lesson_' + D.id;
        const prev = JSON.parse(localStorage.getItem(key) || '{}');
        if (crowns > (prev.crowns || 0)) {
            localStorage.setItem(key, JSON.stringify({ crowns, xp, completedAt: Date.now(), accuracy: Math.round(accuracy * 100) }));
        }

        // Register questions in SRS pool
        registerInSRS();

        // Accumulate XP
        const totalXP = parseInt(localStorage.getItem('totalXP') || '0') + xp;
        localStorage.setItem('totalXP', totalXP);
    }

    document.getElementById('le-completion').style.display = 'flex';
}

function showFailure() {
    document.getElementById('le-card').style.display = 'none';
    document.getElementById('le-continue-wrap').style.display = 'none';
    document.getElementById('le-failure').style.display = 'flex';
}

// ── Wire up continue ───────────────────────────────────────────────────────────
document.getElementById('le-continue-btn').addEventListener('click', () => {
    if (!answered) checkAnswer();
    else advance();
});

// ── Start ──────────────────────────────────────────────────────────────────────
renderQ();

})();
