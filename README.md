# gishohaku-app

技術書同人誌博覧会（技書博）の Web アプリケーション。

- `app/` … Next.js 製のフロントエンド／SSR アプリ本体
- `scripts/` … Firestore などのデータを操作する運用スクリプト（`firebase-admin` を使用）
- `functions/` … Cloud Functions
- Firebase Hosting はリクエストを Cloud Run（`gishohaku-app`）に rewrite し、実体は Cloud Run 上の Next.js SSR が処理する

## 環境

| 対象 | バージョン |
|---|---|
| Node.js | 22 LTS |
| Next.js | 15 系 |
| React | 18 系 |
| パッケージマネージャ | npm |

> Node.js のバージョンはリポジトリ内の `.node-version` / `app/package.json` の `engines` / `app/Dockerfile` で管理しています。[nodenv](https://github.com/nodenv/nodenv) や [Volta](https://volta.sh/) などで揃えてください。
>
> バージョンアップの経緯・方針は [`app/docs/version_up_nextjs_plan.md`](./app/docs/version_up_nextjs_plan.md) を参照してください。

## 開発

### 環境変数の設定

環境変数はリポジトリで管理せず各自の環境で設定してください。
[direnv](https://github.com/direnv/direnv) を使って管理するのがおすすめです。

`app/` のローカル起動・ビルドで参照する主な変数:

```shell
export API_KEY=          # Firebase Web APIキー
export PROJECT_ID=       # Firebase プロジェクトID
# 必要に応じて
export SENTRY_DSN=
```

`scripts/`（`firebase-admin` を使う運用スクリプト）で参照する主な変数:

```shell
export PROJECT_ID=
export DATABASE_URL=
export STORAGE_BUCKET=
```

### ローカル環境（app）

Node.js 22 を導入した環境で次を実行してください。

```shell
$ cd app
$ npm install
$ npm run dev
$ open http://localhost:3000
```

主なスクリプト（`app/package.json`）:

| コマンド | 内容 |
|---|---|
| `npm run dev` | 開発サーバー起動（`next dev`, http://localhost:3000） |
| `npm run build` | 本番ビルド（`next build`） |
| `npm run start` | ビルド成果物を起動（`next start -p $PORT`） |
| `npm run format` | Prettier による整形 |

## デプロイ

デプロイは Google Cloud Build で行っている（`cloudbuild.yaml`）。

1. `app/Dockerfile`（`node:22-alpine`）で Docker イメージをビルドし、`API_KEY` / `PROJECT_ID` をビルド引数として渡す
2. `gcr.io/gishohaku/gishohaku-app` に push
3. Cloud Run（`asia-northeast1`）へ deploy
4. Firebase Hosting を deploy（`**` を Cloud Run に rewrite）

master ブランチに push すると本番に影響があるので、怪しい変更は必ず Pull Request を作ること。

## scripts（データ操作スクリプト）

`scripts/` ディレクトリには Firestore のデータを操作する運用スクリプトを配置している。
リポジトリ**ルート**の `package.json`（`"type": "module"` / `tsx` / `firebase-admin`）から実行する。

できるだけ immutable になるよう意識はしているが、**書き込みを伴うため処理内容を確認してから実行すること**。

### 実行方法

リポジトリルートで、`tsx` に実行したいファイルを渡して実行する。

```shell
# ルートで依存をインストール
$ npm install

# スクリプトを実行（例）
$ npx tsx scripts/20260428-createCircles.ts
```

- **カレントディレクトリはリポジトリルート**を前提とする。CSV は `data/`（例: `data/entries-gishohaku13.csv`, `data/mail-gishohaku13.csv`）に配置する。
- `20260428-sendCircleInvitation.ts` はメール送信を行い、`.env`（リポジトリルートの1つ上の階層 `../.env`）から SMTP などの設定を読み込む。送信前に宛先 CSV を必ず確認すること。
- `20260428-createCircles.ts` / `20260428-createInvitation.ts` は `firebase-admin` で Firestore に書き込むため、`PROJECT_ID` などの環境変数を設定した上で実行する。

代表的なスクリプト:

| ファイル | 内容 |
|---|---|
| `20260428-createCircles.ts` | CSV からサークル情報を Firestore に登録 |
| `20260428-createInvitation.ts` | 登録済みサークルへの招待（ログインURL）を発行 |
| `20260428-sendCircleInvitation.ts` | サークルへ配置・ログイン情報の案内メールを送信 |
