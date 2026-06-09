(function () {
  'use strict';

  const { config, utils } = WordList;
  const { fetchJson, clearElement, el } = utils;
  const {
    FALLBACK_THEME_IDS,
    isFileProtocol,
    themesManifestUrl,
    themeMetaUrl,
    themeUrl,
  } = config;

  function showError(listEl, message) {
    clearElement(listEl);
    listEl.appendChild(el('li', 'theme-list__error', message));
  }

  async function getThemeIds() {
    const manifest = await fetchJson(themesManifestUrl());
    if (manifest?.themes?.length) return manifest.themes;
    return [...FALLBACK_THEME_IDS];
  }

  async function loadThemes() {
    const listEl = document.getElementById('theme-list');
    if (!listEl) return;

    if (isFileProtocol()) {
      showError(
        listEl,
        'HTMLファイルを直接開くと動作しません。WordList フォルダで python -m http.server 8080 を実行し、http://localhost:8080/ を開いてください。'
      );
      return;
    }

    try {
      const ids = await getThemeIds();
      const themes = [];

      for (const id of ids) {
        const meta = await fetchJson(themeMetaUrl(id));
        if (meta) themes.push(meta);
      }

      clearElement(listEl);

      if (themes.length === 0) {
        listEl.appendChild(
          el('li', 'theme-list__empty', 'テーマがありません（manifest.json を確認してください）')
        );
        return;
      }

      for (const theme of themes) {
        const li = el('li', 'theme-list__item');
        const a = el('a', 'theme-list__link');
        a.href = themeUrl(theme.id);
        a.appendChild(el('span', 'theme-list__link-title', theme.title));
        if (theme.description) {
          a.appendChild(el('span', 'theme-list__link-desc', theme.description));
        }
        li.appendChild(a);
        listEl.appendChild(li);
      }
    } catch {
      showError(listEl, 'テーマの読み込みに失敗しました');
    }
  }

  loadThemes();
})();
