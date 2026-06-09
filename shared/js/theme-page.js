(function (global) {
  'use strict';

  const APP_LOADERS = {
    quiz: (root, data, opts) => global.WordList.mountQuiz(root, data, opts),
  };

  function renderSource(meta, data) {
    const src = meta?.source ?? data?.source;
    const el = document.getElementById('theme-source');
    if (!src || !el) return;
    el.hidden = false;
    el.innerHTML = `
      <p><strong>出典</strong></p>
      <p>
        <a href="${src.url}" target="_blank" rel="noopener noreferrer">${src.title}</a>
        ${src.organization ? `<br>${src.organization}` : ''}
      </p>
      ${src.note ? `<p>${src.note}</p>` : ''}
      ${src.copyright ? `<p>${src.copyright}</p>` : ''}
    `;
  }

  async function initThemePage(themeId) {
    const { assetUrl } = global.WordList.config;
    const { fetchJson, getQueryParam } = global.WordList.utils;

    if (global.WordList.config.isFileProtocol()) {
      const root = document.getElementById('app-root');
      if (root) {
        root.textContent =
          'HTMLファイルを直接開くと動作しません。python -m http.server 8080 を実行し、http://localhost:8080/ からアクセスしてください。';
      }
      return;
    }

    const meta = await fetchJson(assetUrl(`themes/${themeId}/meta.json`));
    if (meta) {
      const titleEl = document.getElementById('theme-title');
      if (titleEl) titleEl.textContent = meta.title;
      const desc = document.getElementById('theme-desc');
      if (desc && meta.description) desc.textContent = meta.description;
    }

    const appType = getQueryParam('app') || meta?.apps?.[0]?.type || 'quiz';
    const appConfig = meta?.apps?.find((a) => a.type === appType) ?? meta?.apps?.[0];
    const dataFile = appConfig?.dataFile ?? 'data/quiz.json';
    const data = await fetchJson(assetUrl(`themes/${themeId}/${dataFile}`));

    renderSource(meta, data);

    const root = document.getElementById('app-root');
    const mount = APP_LOADERS[appType];
    if (mount && data) {
      mount(root, data, { themeId });
    } else if (root) {
      root.textContent = 'アプリを読み込めませんでした';
    }
  }

  global.WordList = global.WordList || {};
  global.WordList.initThemePage = initThemePage;
})(window);
