/**
 * 共通ユーティリティ
 */

/** JSON を fetch してパース。失敗時は null */
export async function fetchJson(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/** URL クエリパラメータを取得 */
export function getQueryParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

/** localStorage キーを生成 */
export function storageKey(themeId, key) {
  return `wordlist:${themeId}:${key}`;
}

/** 要素を空にする */
export function clearElement(el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}

/** テキストノード付き要素を作成 */
export function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}
