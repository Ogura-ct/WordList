(function (global) {
  'use strict';

  async function fetchJson(url) {
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  function getQueryParam(key) {
    return new URLSearchParams(global.location.search).get(key);
  }

  function storageKey(themeId, key) {
    return `wordlist:${themeId}:${key}`;
  }

  function clearElement(el) {
    while (el.firstChild) el.removeChild(el.firstChild);
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  global.WordList = global.WordList || {};
  global.WordList.utils = {
    fetchJson,
    getQueryParam,
    storageKey,
    clearElement,
    el,
  };
})(window);
