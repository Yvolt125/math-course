// prog-srs.js — registers data-analysis lesson questions into prog_srs_pool
// Called as: registerProgSRS('lessonId', 'Lesson Title', QUESTIONS)

const PROG_SRS_KEY = 'prog_srs_pool';
const PROG_INTERVALS = [1, 3, 7, 14, 30, 60]; // days

function registerProgSRS(lessonId, lessonTitle, questions) {
    const pool = JSON.parse(localStorage.getItem(PROG_SRS_KEY) || '[]');
    const existingIds = new Set(pool.map(q => q.id));

    questions.forEach((q, i) => {
        const id = lessonId + '_q' + i;
        if (existingIds.has(id)) return;

        // Normalise question format (data-analysis lessons use different field names)
        let type = q.type || 'mc';
        if (type === 'mcq') type = 'mc';

        let answer;
        if (type === 'tf') {
            // answer is "True"/"False" string → convert to boolean
            answer = q.answer === true || q.answer === 'True';
        } else if (type === 'fill') {
            answer = q.answer;
        } else {
            // mc: answer is the string value → convert to index
            answer = Array.isArray(q.options) ? q.options.indexOf(q.answer) : 0;
            if (answer === -1) answer = 0;
        }

        pool.push({
            id,
            lessonId,
            lessonTitle,
            color: '#8e44ad',
            type,
            prompt: q.prompt,
            options: q.options || null,
            answer,
            explanation: q.explain || q.explanation || '',
            interval: 1,
            easeFactor: 2.5,
            nextDue: Date.now() + PROG_INTERVALS[0] * 24 * 3600 * 1000,
            timesCorrect: 0,
            timesWrong: 0,
            streak: 0
        });
    });

    localStorage.setItem(PROG_SRS_KEY, JSON.stringify(pool));
}
