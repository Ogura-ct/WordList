/**
 * トップページ — テーマ一覧
 */
import {
  FALLBACK_THEME_IDS,
  themesManifestUrl,
  themeMetaUrl,
  themeUrl,
} from '../config.js';
import { fetchJson, clearElement, el } from '../utils.js';

async function getThemeIds() {
  const manifest = await fetchJson(themesManifestUrl());
  if (manifest?.themes?.length) return manifest.themes;
  return [...FALLBACK_THEME_IDS];
}

async function loadThemes() {
  const listEl = document.getElementById('theme-list');
  if (!listEl) return;

  const ids = await getThemeIds();
  const themes = [];

  for (const id of ids) {
    const meta = await fetchJson(themeMetaUrl(id));
    if (meta) themes.push(meta);
  }

  clearElement(listEl);

  if (themes.length === 0) {
    listEl.appendChild(el('li', 'theme-list__empty', 'テーマがありません'));
    return;
  }

  for (const theme of themes) {
    const li = el('li', 'theme-list__item');
    const a = el('a', 'theme-list__link');
    a.href = themeUrl(theme.id);

    const title = el('span', 'theme-list__link-title', theme.title);
    a.appendChild(title);

    if (theme.description) {
      a.appendChild(el('span', 'theme-list__link-desc', theme.description));
    }

    li.appendChild(a);
    listEl.appendChild(li);
  }
}

loadThemes().catch(() => {
  const listEl = document.getElementById('theme-list');
  if (listEl) {
    clearElement(listEl);
    listEl.appendChild(el('li', 'theme-list__error', 'テーマの読み込みに失敗しました'));
  }
});
