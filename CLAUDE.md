# CLAUDE.md

このファイルは、このリポジトリでコード作業を行う際の Claude Code (claude.ai/code) へのガイダンスを提供します。

## 📘 プロジェクト概要

Magic: The Gathering ARENA 向けの **ブラウザ上で動作するデッキビルダーアプリ**を開発します。ユーザーはカード検索、フィルター、デッキ保存、共有、エクスポート（Arena用インポート形式）などを行えるようにします。

このファイルは Claude Code に対して、仕様や制約・目的を明示するためのガイドラインです。

---

## ✅ タスクの目的（GOAL）

- モダンな UI を持つ Web デッキビルダーを作成する。
- Magic: The Gathering ARENA にインポート可能な形式でデッキをエクスポートできるようにする。
- MTG のカード情報（例：Scryfall API）を取得して検索・フィルタリングできるようにする。

---

## 📦 技術スタック

このプロジェクトは Hono フレームワークベースのフルスタック Web アプリケーションです：

- **フレームワーク**: Hono + HonoX（ファイルベースルーティング）
- **フロントエンド**: Hono JSX（React風の構文）+ TypeScript
- **スタイリング**: Tailwind CSS v4
- **ランタイム**: Cloudflare Workers
- **ビルドツール**: Vite
- **開発・デプロイ**: Wrangler
- **API**: Scryfall API（カードデータ取得用）
- **エクスポート形式**: Arena インポート形式（例: `4 Shock (M21) 159`）

### アーキテクチャ

- `app/routes/`: ページルート（HonoXのファイルベースルーティング）
- `app/islands/`: クライアントサイドでハイドレートされるコンポーネント
- `app/client.ts`: クライアントサイドエントリーポイント
- `app/server.ts`: サーバーサイドエントリーポイント

---

## 🧩 機能仕様（Features）

### MVP に含めるもの

- [ ] カード検索（キーワード、色、タイプ、マナコスト）
- [ ] カード一覧の表示（画像 or テキスト）
- [ ] カードの追加・削除（デッキリストの管理）
- [ ] 枚数カウントとデッキサイズ制限（60枚以上など）
- [ ] デッキエクスポート（テキスト形式）
- [ ] デッキ名の入力・保存（ローカルストレージ）
- [ ] デッキコードからのインポート機能
- [ ] MTGAへ直接コピペ可能なクリップボード出力

### 将来的に追加予定（後回し）

- [ ] アカウント機能（ログイン・デッキ保存）
- [ ] デッキの共有URL発行

---

## 🔒 制約・前提条件

- サーバー不要なクライアントのみの構成で MVP を実装する。
- デッキの保存はローカルストレージで行う。
- カード情報は Scryfall API から取得し、DB やキャッシュは用いない（初期段階では）。
- MTGA に対応するカードセット・言語のみ対象とする（基本は英語カード）。

---

## 📄 用語定義

| 用語         | 定義                                                                 |
| ------------ | -------------------------------------------------------------------- |
| MTGA         | Magic: The Gathering Arena の略称                                    |
| デッキ       | プレイヤーが構築するカードの組み合わせ                               |
| エクスポート | デッキを MTGA にインポート可能な形式のテキストに変換して出力する機能 |
| Scryfall     | MTG カード情報 API（ https://scryfall.com/docs/api ）                |

---

## 🤖 Claude へのお願い（INSTRUCTIONS）

日本語で応答して下さい。コミットメッセージも日本語で記述してください。

テスト駆動開発（TDD）を採用し、以下のステップで実装を進めてください：

1. Red - まず失敗するテストを書く
2. Green - テストを通すための最小限のコードを書く
3. Refactor - コードをリファクタリングして改善する

Git Commit の際は、以下のルールに従ってください：

- 【重要】: 1つのタスク完了したら必ずコミットして下さい。
- 1機能1コミットで小さくコミットして下さい。
- コミットする際は、必ず、Typescript のエラー、ESLint のエラーを解消してからコミットして下さい。
- Conventional Commits のルールに従ってコミットメッセージを記述してください。
- テストを書いたら: test: [機能] の失敗するテストを追加
- テストを通したら: feat: テストを通すために [機能] を実装
- リファクタリングしたら: refactor: [説明]

---

## 🔧 開発コマンド

### 基本コマンド
- `npm run dev` - 開発サーバー起動（Vite + HonoX）
- `npm run build` - 本番ビルド（クライアント + サーバー）
- `npm run preview` - Wranglerでローカルプレビュー
- `npm run deploy` - Cloudflare Workers にデプロイ

### コード品質
- `npm run lint` - ESLint実行
- `npm run lint:fix` - ESLint自動修正
- `npm run format` - Prettier実行

### 重要事項
- TypeScriptエラーとESLintエラーはコミット前に必ず解消すること
- Husky + lint-stagedが設定済み（コミット時に自動でlint/format実行）

---

## 📌 参考情報（Useful Links）

- MTGA インポート形式: https://mtgarena-support.wizards.com/hc/en-us/articles/360035441192
- Scryfall API: https://scryfall.com/docs/api
- Hono ドキュメント: https://hono.dev/
- HonoX ドキュメント: https://github.com/honojs/honox
