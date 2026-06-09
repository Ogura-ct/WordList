# WordList

スマホ向けの暗記用 Web サイト（単語帳など）。GitHub Pages で無料ホスティング。

## 技術

- HTML / CSS / JavaScript（ビルド不要）
- 静的ファイルのみ

## ローカルで確認

`WordList` フォルダでサーバーを起動:

```bash
cd WordList
python -m http.server 8080
```

ブラウザで **`http://localhost:8080/`** を開く（`/WordList/` ではない）。

> 親フォルダから起動した場合のみ `http://localhost:8080/WordList/` を使う。  
> `BASE_PATH` は URL から自動判定されるため、手動変更は不要。

## フォルダ

| パス | 内容 |
|------|------|
| `shared/` | 共通 CSS・JS |
| `apps/` | アプリ種別（単語帳等） |
| `themes/` | 学習テーマとデータ |
| `AGENTS.md` | AI・開発者向け詳細指示 |

## GitHub Pages

1. リポジトリを GitHub に push
2. Settings → Pages → Branch: `main`, Folder: `/ (root)`
3. プロジェクトサイトでも `BASE_PATH` は URL から自動判定（リポジトリ名を `config.js` の `REPO_NAME` に合わせる）

## テーマの追加

1. `themes/_template/` をコピーして `themes/<新しいid>/` を作成
2. `meta.json`・`index.html` 内の `THEME_ID`・`data/` を編集
3. `themes/manifest.json` に ID を追加

詳細は [AGENTS.md](./AGENTS.md) を参照。
