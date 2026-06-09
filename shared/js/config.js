/**
 * ベースパス設定（GitHub Pages / ローカル両対応）
 *
 * - ローカル（WordList 内で server 起動）     → http://localhost:8080/
 * - ローカル（親フォルダで server 起動）       → http://localhost:8080/WordList/
 * - GitHub プロジェクトサイト                  → https://<user>.github.io/WordList/
 * - GitHub ユーザーサイト                        → https://<user>.github.io/
 */
const REPO_NAME = 'WordList';

function detectBasePath() {
  const path = window.location.pathname;
  if (path === `/${REPO_NAME}` || path.startsWith(`/${REPO_NAME}/`)) {
    return `/${REPO_NAME}`;
  }
  return '';
}

export const BASE_PATH = detectBasePath();

/** ベースパス付き URL を生成 */
export function assetUrl(relativePath) {
  const base = BASE_PATH.replace(/\/$/, '');
  const path = relativePath.replace(/^\//, '');
  return `${base}/${path}`;
}

/** テーマページ URL */
export function themeUrl(themeId) {
  return assetUrl(`themes/${themeId}/`);
}

/** テーマ meta.json URL */
export function themeMetaUrl(themeId) {
  return assetUrl(`themes/${themeId}/meta.json`);
}

/** 既知のテーマ ID 一覧（manifest.json 取得失敗時のフォールバック） */
export const FALLBACK_THEME_IDS = ['sample'];

/** themes/manifest.json の URL */
export function themesManifestUrl() {
  return assetUrl('themes/manifest.json');
}
