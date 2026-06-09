(function (global) {
  'use strict';

  const REPO_NAME = 'WordList';

  function getSiteRoot() {
    if (global.location.protocol === 'file:') return null;

    const { origin, pathname } = global.location;
    const repoPrefix = `/${REPO_NAME}/`;

    if (pathname === `/${REPO_NAME}` || pathname.startsWith(repoPrefix)) {
      return `${origin}${repoPrefix}`;
    }

    const themesPos = pathname.indexOf('/themes/');
    if (themesPos >= 0) {
      return `${origin}${pathname.slice(0, themesPos + 1)}`;
    }

    const lastSlash = pathname.lastIndexOf('/');
    const dir = lastSlash >= 0 ? pathname.slice(0, lastSlash + 1) : '/';
    return `${origin}${dir}`;
  }

  function assetUrl(relativePath) {
    const root = getSiteRoot();
    const path = relativePath.replace(/^\//, '');
    if (!root) return path;
    return new URL(path, root).href;
  }

  function themeUrl(themeId) {
    const href = assetUrl(`themes/${themeId}/`);
    try {
      return new URL(href).pathname;
    } catch {
      return href;
    }
  }

  function themeMetaUrl(themeId) {
    return assetUrl(`themes/${themeId}/meta.json`);
  }

  function themesManifestUrl() {
    return assetUrl('themes/manifest.json');
  }

  function isFileProtocol() {
    return global.location.protocol === 'file:';
  }

  global.WordList = global.WordList || {};
  global.WordList.config = {
    REPO_NAME,
    getSiteRoot,
    assetUrl,
    themeUrl,
    themeMetaUrl,
    themesManifestUrl,
    isFileProtocol,
    FALLBACK_THEME_IDS: ['cognitive-bias'],
    get BASE_PATH() {
      const root = getSiteRoot();
      if (!root) return '';
      try {
        return new URL(root).pathname.replace(/\/$/, '');
      } catch {
        return '';
      }
    },
  };
})(window);
