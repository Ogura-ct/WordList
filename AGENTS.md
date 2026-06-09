# WordList プロジェクト — AI 開発指示書

このドキュメントは、Cursor 等の AI が本プロジェクトでページ作成・機能追加を行う際の共通指示です。**毎回ユーザーが同じ要件を伝えなくてよいよう**、ここに従って作業してください。

---

## 1. プロジェクト概要

| 項目 | 内容 |
|------|------|
| 目的 | スマホ中心の暗記用 Web サイト（単語帳を第一弾とする） |
| ホスティング | **GitHub Pages**（無料・静的配信） |
| 技術スタック | **HTML + CSS + JavaScript のみ**（ビルドツール・フレームワークは使わない） |
| 対象端末 | **モバイルファースト**。PC は最低限読みやすく操作できること |
| 拡張方針 | テーマ（学習セット）とアプリ種別（単語帳以外の暗記ページ）を**フォルダ追加で増やせる**構成 |

---

## 2. フォルダ構成

```
WordList/
├── AGENTS.md                 # 本指示書（AI 向け）
├── README.md                 # 利用者・開発者向け概要
├── index.html                # トップページ（テーマ一覧）
├── .nojekyll                 # GitHub Pages 用（Jekyll 無効化）
│
├── shared/                   # 全ページ共通リソース
│   ├── css/
│   │   └── base.css          # リセット・変数・レイアウト・共通 UI
│   └── js/
│       ├── config.js         # ベースパス等の設定
│       └── utils.js          # 共通ユーティリティ
│
├── apps/                     # アプリ種別（再利用可能な UI・ロジック）
│   ├── wordbook/             # 単語帳
│   │   ├── wordbook.css
│   │   └── wordbook.js
│   └── README.md             # 新規アプリ種別の追加手順
│
├── themes/                   # テーマ（学習コンテンツの単位）
│   ├── _template/            # 新規テーマ用テンプレート（コピーして使う）
│   │   ├── meta.json
│   │   ├── index.html
│   │   └── data/
│   │       └── words.json
│   ├── manifest.json         # 公開テーマ ID 一覧
│   └── sample/               # サンプルテーマ（最初の 1 テーマ）
│       ├── meta.json
│       ├── index.html
│       └── data/
│           └── words.json
│
└── .cursor/
    └── rules/
        └── wordlist-project.mdc  # Cursor 常時適用ルール
```

### 役割の整理

- **`shared/`** … サイト全体で共有する CSS・JS。ここに共通ロジックを集約し、重複を避ける。
- **`apps/`** … 「単語帳」「四択クイズ」など**表示・操作の型**。テーマ非依存。
- **`themes/`** … 具体的な**学習データとテーマ専用ページ**。`meta.json` でタイトル・利用アプリを定義。

---

## 3. GitHub Pages

### デプロイ

- リポジトリ Settings → Pages → Source: **Deploy from a branch** → `main` / `/(root)`
- ルートに `.nojekyll` を置く（`_` 始まりフォルダを Jekyll が無視しないため）

### ベースパス（重要）

プロジェクト Pages（`https://<user>.github.io/<repo>/`）ではサブパスが付く。  
`shared/js/config.js` が **URL から `BASE_PATH` を自動判定**する（手動変更不要）。

| 環境 | アクセス URL | BASE_PATH |
|------|-------------|-----------|
| ローカル（`WordList` 内で server 起動） | `http://localhost:8080/` | `''` |
| ローカル（親フォルダで server 起動） | `http://localhost:8080/WordList/` | `'/WordList'` |
| GitHub プロジェクトサイト | `https://<user>.github.io/WordList/` | `'/WordList'` |

リンク・`fetch`・スクリプトパスは **`config.js` のヘルパー**（`assetUrl`, `themeUrl` 等）経由で組み立てる。ハードコードの `/shared/...` は禁止。

---

## 4. UI / UX 方針

### モバイルファースト

- viewport: `width=device-width, initial-scale=1`
- タップ領域: 最小 **44×44px**
- フォント: 本文 **16px 以上**（iOS の自動ズーム回避）
- セーフエリア: `env(safe-area-inset-*)` をヘッダー・フッターに考慮
- 横スクロール禁止（`overflow-x: hidden` は body レベルで）

### PC

- 最大幅 **480〜640px** 程度のカラムを中央寄せ（スマホ UI をそのまま拡大しない）
- ホバー前提の操作は補助程度に留める

### デザイン

- `shared/css/base.css` の CSS 変数（`--color-*`, `--space-*`）を使用
- ダークモードは `prefers-color-scheme` に追随（将来テーマ切替を足す場合も変数で対応）
- アイコンは初期段階では Unicode / 絵文字またはインライン SVG。外部 CDN 依存は最小限

---

## 5. コーディング規約

### 一般

- **ビルド不要**で `index.html` をブラウザで直接開いても動くよう/react 等は使わない
- ES Modules（`type="module"`）を使用。共通 JS は `export` / `import`
- ファイル名: **kebab-case**（例: `wordbook.js`）
- インデント: 2 スペース
- コメント: 非自明なロジックのみ（日本語可）

### HTML

- セマンティックタグ（`header`, `main`, `nav`, `section`）
- アクセシビリティ: `lang="ja"`, ボタンには `type="button"`, 意味のある `aria-label`

### CSS

- BEM 風クラス名: `.block__element--modifier` または `.app-wordbook-card` のようにアプリ接頭辞
- テーマ固有スタイルは `themes/<id>/` 内か、`data-theme` 属性でスコープ
- `!important` は原則禁止

### JavaScript

- `const` / `let`（`var` 禁止）
- データ取得は `fetch` + JSON
- 状態永続化が必要な場合は **localStorage**（キーは `wordlist:<themeId>:<key>` 形式）
- 外部 API・認証は現時点では不要

---

## 6. データ形式

### テーマメタデータ `themes/<id>/meta.json`

```json
{
  "id": "sample",
  "title": "サンプル単語帳",
  "description": "説明文",
  "apps": [
    {
      "type": "wordbook",
      "dataFile": "data/words.json",
      "label": "単語帳"
    }
  ]
}
```

| フィールド | 必須 | 説明 |
|-----------|------|------|
| `id` | ✓ | フォルダ名と一致する英数字・ハイフン |
| `title` | ✓ | 表示名 |
| `description` | | 一覧・トップに表示 |
| `apps` | ✓ | このテーマで使うアプリの配列 |
| `apps[].type` | ✓ | `apps/` 内のアプリ名（例: `wordbook`） |
| `apps[].dataFile` | ✓ | テーマルートからの相対パス |
| `apps[].label` | | リンク表示名 |

### 単語データ `data/words.json`

```json
{
  "words": [
    {
      "id": "w001",
      "term": "apple",
      "reading": "アップル",
      "meaning": "りんご",
      "note": "任意のメモ"
    }
  ]
}
```

- `id`: テーマ内で一意
- `term`: 問い側（表面）
- `meaning`: 答え側（裏面）。`reading` / `note` は任意

---

## 7. 新規テーマの追加手順

1. `themes/_template/` を `themes/<新id>/` にコピー
2. `meta.json` の `id`, `title`, `description` を編集
3. `data/words.json`（またはアプリに応じた JSON）を編集
4. `themes/manifest.json` の `themes` 配列に新 ID を追加
5. ルート `index.html` のテーマ一覧は manifest + 各 `meta.json` から**動的生成**（HTML への手動追記は避ける）
6. ローカル確認後、GitHub に push

---

## 8. 新規アプリ種別の追加手順

単語帳以外（例: 四択、穴埋め、フラッシュカード）を足す場合:

1. `apps/<app-type>/` に `<app-type>.js` と `<app-type>.css` を作成
2. エントリ関数を export: `export function mountWordbook(container, data, options) { ... }`
3. `apps/README.md` のチェックリストに従う
4. テーマの `meta.json` で `"type": "<app-type>"` を指定
5. テーマ `index.html` または共通ローダーから `apps/<type>/` を動的 import

**アプリ JS はテーマデータのスキーマのみ知り、他テーマの存在は知らない**（疎結合）。

---

## 9. ページ構成（URL 想定）

| パス | 内容 |
|------|------|
| `/` | テーマ一覧 |
| `/themes/<id>/` | テーマ hub（利用可能なアプリへのリンク） |
| `/themes/<id>/` + アプリ起動 | 同一 HTML 内で hash または query でアプリ切替（例: `?app=wordbook`） |

初期実装では **テーマごとに 1 つの `index.html`** が hub 兼アプリ起動ページでよい。

---

## 10. 作業時のチェックリスト

機能追加・修正後、以下を確認すること:

- [ ] スマホ幅（375px）でレイアウト崩れなし
- [ ] PC 幅（1280px）で中央カラム表示
- [ ] GitHub Pages の `BASE_PATH` 設定下でリンク・fetch が動作
- [ ] 新テーマは `_template` コピーのみで追加可能
- [ ] 共通-max ツールなしでファイルを直接開いても主要機能が動く
- [ ] 既存テーマ `sample` が引き続き動作

---

## 11. やってはいけないこと

- React / Vue / bundler（Vite 等）の導入（ユーザーが明示的に要求するまで）
- 有料ホスティング・バックエンド・DB の追加
- テーマごとに `shared/` の CSS をコピペして増殖させる
- ルートパス `/` 直書きのリンク（`config.js` 経由必須）
- 大きな画像・フォントの無断追加（リポジトリ肥大化）

---

## 12. 今後の拡張（参考）

ユーザーが求めた場合のみ実装:

- 学習進捗の localStorage 保存・復元
- テーマのカテゴリ・タグ
- PWA（オフライン）
- カスタムドメイン
- 複数言語 UI

---

*最終更新: プロジェクト初期構成時*
