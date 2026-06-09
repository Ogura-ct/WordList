/**
 * 単語帳アプリ
 *
 * @param {HTMLElement} container - マウント先
 * @param {{ words: Array }} data - words.json の内容
 * @param {{ themeId?: string }} options
 */
export function mountWordbook(container, data, options = {}) {
  const words = data?.words ?? [];
  if (words.length === 0) {
    container.textContent = '単語データがありません';
    return;
  }

  let index = 0;
  let flipped = false;

  container.classList.add('app-wordbook');
  container.innerHTML = `
    <div class="app-wordbook__card" role="button" tabindex="0" aria-label="カードをめくる">
      <div class="app-wordbook__face app-wordbook__face--front">
        <span class="app-wordbook__label">英語</span>
        <p class="app-wordbook__term"></p>
      </div>
      <div class="app-wordbook__face app-wordbook__face--back">
        <span class="app-wordbook__label">意味</span>
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

  const card = container.querySelector('.app-wordbook__card');
  const termEl = container.querySelector('.app-wordbook__term');
  const meaningEl = container.querySelector('.app-wordbook__meaning');
  const readingEl = container.querySelector('.app-wordbook__reading');
  const noteEl = container.querySelector('.app-wordbook__note');
  const counterEl = container.querySelector('.app-wordbook__counter');

  function render() {
    const word = words[index];
    termEl.textContent = word.term ?? '';
    meaningEl.textContent = word.meaning ?? '';
    readingEl.textContent = word.reading ? `(${word.reading})` : '';
    noteEl.textContent = word.note ?? '';
    counterEl.textContent = `${index + 1} / ${words.length}`;
    card.classList.toggle('app-wordbook__card--flipped', flipped);
  }

  function flip() {
    flipped = !flipped;
    card.classList.toggle('app-wordbook__card--flipped', flipped);
  }

  function go(delta) {
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
