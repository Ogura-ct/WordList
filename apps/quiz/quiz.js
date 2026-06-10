(function (global) {
  'use strict';

  function mountQuiz(container, data, options) {
    options = options || {};
    const allQuestions = [...(data?.questions ?? [])];
    if (allQuestions.length === 0) {
      container.textContent = '問題データがありません';
      return;
    }

    let pool = [];
    let index = 0;
    let score = 0;
    let answered = false;

    showStartScreen();

    function showStartScreen() {
      container.className = 'app-quiz';
      container.innerHTML = `
        <div class="app-quiz__start">
          <p class="app-quiz__start-count">${allQuestions.length} 問</p>
          <p class="app-quiz__start-desc">問題は開始時にランダムな順序で出題されます。</p>
          <button type="button" class="btn app-quiz__start-btn">開始</button>
        </div>
      `;
      container.querySelector('.app-quiz__start-btn').addEventListener('click', beginQuiz);
    }

    function beginQuiz() {
      pool = shuffle(allQuestions);
      index = 0;
      score = 0;
      answered = false;

      container.classList.add('app-quiz');
      container.innerHTML = `
        <div class="app-quiz__header">
          <span class="app-quiz__counter"></span>
          <span class="app-quiz__score"></span>
        </div>
        <p class="app-quiz__prompt">次の説明に当てはまる認知バイアスを選んでください。</p>
        <div class="app-quiz__question">
          <p class="app-quiz__meaning"></p>
          <p class="app-quiz__example"></p>
        </div>
        <p class="app-quiz__category"></p>
        <ul class="app-quiz__choices" role="list"></ul>
        <div class="app-quiz__feedback" hidden></div>
        <button type="button" class="btn app-quiz__next" hidden>次の問題</button>
      `;

      container.querySelector('.app-quiz__next').addEventListener('click', onNext);
      renderQuestion();
    }

    function renderQuestion() {
      answered = false;
      const q = pool[index];
      const counterEl = container.querySelector('.app-quiz__counter');
      const scoreEl = container.querySelector('.app-quiz__score');
      const meaningEl = container.querySelector('.app-quiz__meaning');
      const exampleEl = container.querySelector('.app-quiz__example');
      const categoryEl = container.querySelector('.app-quiz__category');
      const choicesEl = container.querySelector('.app-quiz__choices');
      const feedbackEl = container.querySelector('.app-quiz__feedback');
      const nextBtn = container.querySelector('.app-quiz__next');

      counterEl.textContent = `${index + 1} / ${pool.length}`;
      scoreEl.textContent = `正解 ${score}`;
      meaningEl.textContent = q.meaning;
      if (q.example) {
        exampleEl.textContent = q.example;
        exampleEl.hidden = false;
      } else {
        exampleEl.textContent = '';
        exampleEl.hidden = true;
      }
      categoryEl.textContent = q.category ? `カテゴリ: ${q.category}` : '';
      feedbackEl.hidden = true;
      feedbackEl.textContent = '';
      nextBtn.hidden = true;

      const distractors = pickDistractors(allQuestions, q, 3);
      const choices = shuffle([
        { question: q, correct: true },
        ...distractors.map((d) => ({ question: d, correct: false })),
      ]);

      clearElement(choicesEl);
      choices.forEach((choice) => {
        const li = document.createElement('li');
        li.className = 'app-quiz__choice-item';
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'app-quiz__choice';
        renderChoiceLabel(btn, choice.question);
        btn.dataset.correct = choice.correct ? '1' : '0';
        btn.addEventListener('click', () => selectAnswer(btn, q));
        li.appendChild(btn);
        choicesEl.appendChild(li);
      });
    }

    function selectAnswer(btn, q) {
      if (answered) return;
      answered = true;
      const isCorrect = btn.dataset.correct === '1';
      if (isCorrect) score += 1;

      container.querySelectorAll('.app-quiz__choice').forEach((b) => {
        b.disabled = true;
        if (b.dataset.correct === '1') b.classList.add('app-quiz__choice--correct');
        else if (b === btn) b.classList.add('app-quiz__choice--wrong');
      });

      const scoreEl = container.querySelector('.app-quiz__score');
      const feedbackEl = container.querySelector('.app-quiz__feedback');
      const nextBtn = container.querySelector('.app-quiz__next');

      scoreEl.textContent = `正解 ${score}`;
      feedbackEl.hidden = false;
      feedbackEl.className = `app-quiz__feedback app-quiz__feedback--${isCorrect ? 'ok' : 'ng'}`;
      feedbackEl.innerHTML = isCorrect
        ? `<strong>正解！</strong> ${formatTermLabel(q)}`
        : `<strong>不正解</strong> 正解は ${formatTermLabel(q)} です。`;

      nextBtn.hidden = false;
      nextBtn.textContent =
        index < pool.length - 1 ? '次の問題' : `結果を見る（${score}/${pool.length}）`;
    }

    function onNext() {
      if (index < pool.length - 1) {
        index += 1;
        renderQuestion();
      } else {
        showResult();
      }
    }

    function showResult() {
      container.innerHTML = `
        <div class="app-quiz__result">
          <h2 class="app-quiz__result-title">結果</h2>
          <p class="app-quiz__result-score">${score} / ${pool.length} 問正解</p>
          <p class="app-quiz__result-rate">${Math.round((score / pool.length) * 100)}%</p>
          <button type="button" class="btn app-quiz__retry">もう一度</button>
        </div>
      `;
      container.querySelector('.app-quiz__retry').addEventListener('click', showStartScreen);
    }
  }

  function pickDistractors(all, current, count) {
    const others = all.filter((q) => q.id !== current.id);
    return shuffle(others).slice(0, count);
  }

  function renderChoiceLabel(btn, question) {
    btn.innerHTML = '';
    const ja = document.createElement('span');
    ja.className = 'app-quiz__choice-ja';
    ja.textContent = question.term;
    btn.appendChild(ja);
    if (question.termEn) {
      const en = document.createElement('span');
      en.className = 'app-quiz__choice-en';
      en.textContent = question.termEn;
      btn.appendChild(en);
    }
  }

  function formatTermLabel(question) {
    const ja = escapeHtml(question.term);
    if (!question.termEn) return ja;
    return `${ja} <span class="app-quiz__feedback-en">(${escapeHtml(question.termEn)})</span>`;
  }

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function clearElement(el) {
    while (el.firstChild) el.removeChild(el.firstChild);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  global.WordList = global.WordList || {};
  global.WordList.mountQuiz = mountQuiz;
})(window);
