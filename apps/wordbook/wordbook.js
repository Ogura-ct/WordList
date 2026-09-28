(function (global) {
  'use strict';

  function mountWordbook(container, data) {
    const allWords = data?.words ?? [];
    if (allWords.length === 0) {
      container.textContent = '単語データがありません';
      return;
    }

    const groups = Array.isArray(data?.groups) ? data.groups : [];
    let index = 0;
    let flipped = false;
    let groupId = '';

    function visibleWords() {
      if (!groupId) return allWords;
      return allWords.filter((word) => word.group === groupId);
    }

    container.classList.add('app-wordbook');
    const filterHtml = groups.length
      ? `<label class="app-wordbook__filter">番号
          <select class="app-wordbook__group" aria-label="番号"></select>
        </label>`
      : '';
    container.innerHTML = `
      ${filterHtml}
      <div class="app-wordbook__card" role="button" tabindex="0" aria-label="カードをめくる">
        <div class="app-wordbook__face app-wordbook__face--front">
          <span class="app-wordbook__label"></span>
          <p class="app-wordbook__term"></p>
        </div>
        <div class="app-wordbook__face app-wordbook__face--back">
          <span class="app-wordbook__label"></span>
          <p class="app-wordbook__meaning"></p>
          <p class="app-wordbook__reading"></p>
          <p class="app-wordbook__note"></p>
        </div>
      </div>
      <div class="app-wordbook__nav">
        <button type="button" class="btn btn--secondary app-wordbook__prev">前へ</button>
        <span class="app-wordbook__counter"></span>
        <button type="button" class="btn btn--secondary app-wordbook__next">次へ</button>
      </div>
    `;

    container.querySelector('.app-wordbook__face--front .app-wordbook__label').textContent =
      data?.frontLabel || '英語';
    container.querySelector('.app-wordbook__face--back .app-wordbook__label').textContent =
      data?.backLabel || '意味';

    const card = container.querySelector('.app-wordbook__card');
    const termEl = container.querySelector('.app-wordbook__term');
    const meaningEl = container.querySelector('.app-wordbook__meaning');
    const readingEl = container.querySelector('.app-wordbook__reading');
    const noteEl = container.querySelector('.app-wordbook__note');
    const counterEl = container.querySelector('.app-wordbook__counter');
    const groupEl = container.querySelector('.app-wordbook__group');

    if (groupEl) {
      const allOpt = document.createElement('option');
      allOpt.value = '';
      allOpt.textContent = `すべて（${allWords.length}）`;
      groupEl.appendChild(allOpt);
      groups.forEach((group) => {
        const opt = document.createElement('option');
        opt.value = String(group.id);
        opt.textContent = group.label || String(group.id);
        groupEl.appendChild(opt);
      });
      groupEl.addEventListener('change', () => {
        groupId = groupEl.value;
        index = 0;
        flipped = false;
        render();
      });
    }

    function render() {
      const words = visibleWords();
      const word = words[index] || words[0];
      termEl.textContent = word?.term ?? '';
      meaningEl.textContent = word?.meaning ?? '';
      readingEl.textContent = word?.reading ? `(${word.reading})` : '';
      noteEl.textContent = word?.note ?? '';
      counterEl.textContent = words.length ? `${index + 1} / ${words.length}` : '0 / 0';
      card.classList.toggle('app-wordbook__card--flipped', flipped);
    }

    function flip() {
      flipped = !flipped;
      card.classList.toggle('app-wordbook__card--flipped', flipped);
    }

    function go(delta) {
      const words = visibleWords();
      if (!words.length) return;
      index = (index + delta + words.length) % words.length;
      flipped = false;
      render();
    }

    card.addEventListener('click', flip);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        flip();
      }
    });

    container.querySelector('.app-wordbook__prev').addEventListener('click', () => go(-1));
    container.querySelector('.app-wordbook__next').addEventListener('click', () => go(1));

    render();
  }

  global.WordList = global.WordList || {};
  global.WordList.mountWordbook = mountWordbook;
})(window);
