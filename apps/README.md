# アプリ種別の追加手順

`apps/` には、テーマ非依存の**暗記 UI の型**を置く。

## 新規アプリ追加チェックリスト

1. **フォルダ作成**  
   `apps/<app-type>/` に `<app-type>.js` と `<app-type>.css` を置く。

2. **エントリ関数**  
   次のシグネチャで export する:

   ```javascript
   /**
    * @param {HTMLElement} container
    * @param {object} data - テーマの JSON データ
    * @param {{ themeId?: string }} options
    */
   export function mount<AppName>(container, data, options = {}) {}
   ```

3. **データスキーマ**  
   `AGENTS.md` のデータ形式に追記するか、`apps/<app-type>/README.md` にスキーマを文書化。

4. **テーマ連携**  
   テーマの `meta.json` で `"type": "<app-type>"` を指定。

5. **スタイル**  
   クラス名は `.app-<app-type>-*` でスコープ。共通スタイルは `shared/css/base.css` を利用。

6. **依存**  
   他アプリ種別への依存は禁止。共通処理は `shared/js/` に置く。

## 既存アプリ

| type | パス | 説明 |
|------|------|------|
| `wordbook` | `apps/wordbook/` | 単語カード（タップで表裏切替） |

## 想定される将来のアプリ例

- `quiz` — 四択クイズ
- `fill-blank` — 穴埋め
- `flashcard` — シンプルなフラッシュカード（wordbook の別 UI）

追加時は上記チェックリストに従うこと。
