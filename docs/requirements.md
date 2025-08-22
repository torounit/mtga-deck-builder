# 仕様書

## 📦 技術スタック

このプロジェクトは Hono フレームワークベースのフルスタック Web アプリケーションです：

- **フレームワーク**: Hono + HonoX（ファイルベースルーティング）
- **フロントエンド**: Hono JSX（React風の構文）+ TypeScript
- **スタイリング**: Tailwind CSS v4
- **ランタイム**: Cloudflare Workers
- **ビルドツール**: Vite
- **開発・デプロイ**: Wrangler
- **API**: Scryfall API（カードデータ取得用）

### アーキテクチャ

- `app/routes/`: ページルート（HonoXのファイルベースルーティング）
- `app/islands/`: クライアントサイドでハイドレートされるコンポーネント
- `app/client.ts`: クライアントサイドエントリーポイント
- `app/server.ts`: サーバーサイドエントリーポイント

---

## 🧩 機能仕様（Features）

### レイアウト

```marmaid
block-beta
  columns 4
  block:cards:3
    columns 4
        CardSearchInput:4
        CardPreview1 CardPreview2 CardPreview3 CardPreview4
        CardPreview5 CardPreview6 CardPreview7 CardPreview8
        CardPreview9 CardPreview10 CardPreview11 CardPreview12
        CardPreview13 CardPreview14 CardPreview15 CardPreview16
  end
  block:decks:1
    columns 1
        MainDeckArea:1
        SideboardArea:1
  end
```

### MVP に含めるもの

- [ ] カード検索（キーワード、色、タイプ、マナコストによる検索。及びソート）
- [ ] カード検索結果の表示。ページネーションの実装。一度に表示する枚数は、16枚。表示する内容は、カード画像、カード名、マナコスト。
- [ ] デッキリストへの、ドラッグ＆ドロップでのカードの追加・削除。メインデッキとサイドボード間でのカードの移動。
- [ ] デッキサイズ制限（メインデッキは60枚以上、サイドボードは15枚以下）
- [ ] カード枚数制限。メインデッキ、サイドボードに同名カードは合わせて4枚まで。例外あり。
- [ ] デッキエクスポート機能（MTGA インポート形式でのテキスト出力）
- [ ] デッキ名の入力・保存（ローカルストレージ）
- [ ] デッキコードからのインポート機能
- [ ] MTGAへ直接コピペ可能なクリップボード出力

### 将来的に追加予定（後回し）

- [ ] アカウント機能（ログイン・デッキ保存）
- [ ] デッキの共有URL発行

---

## 🔒 制約・前提条件

- サーバー不要なクライアントのみの構成で MVP を実装する。
- デッキの保存はローカルストレージで行う。（初期段階では）
- カード情報は Scryfall API から取得し、DB やキャッシュは用いない（初期段階では）。
- MTGA に対応するカードセット・言語のみ対象とする（基本は英語カード）。

---

## 📄 用語定義

| 用語       | 定義                                             |
|----------|------------------------------------------------|
| MTGA     | Magic: The Gathering Arena の略称                 |
| メインデッキ   | プレイヤーが構築するカードの組み合わせ。60枚以上                      |
| サイドボード   | プレイヤーが構築するカードの組み合わせ。15枚以下                      |
| エクスポート   | デッキを MTGA にインポート可能な形式のテキストに変換して出力する機能          |
| Scryfall | MTG カード情報 API（ https://scryfall.com/docs/api ） |


---

## 📌 参考情報（Useful Links）

- MTGA インポート形式: https://mtgarena-support.wizards.com/hc/en-us/articles/360035441192
- Scryfall API: https://scryfall.com/docs/api
- Hono ドキュメント: https://hono.dev/
- HonoX ドキュメント: https://github.com/honojs/honox
