# gishohaku-app

技術書同人誌博覧会（技書博）の Web アプリケーション。

- `app/` … Next.js 製のフロントエンド／SSR アプリ本体
- `scripts/` … Firestore などのデータを操作する運用スクリプト（`firebase-admin` を使用）
- `functions/` … Cloud Functions
- Firebase Hosting はリクエストを Cloud Run（`gishohaku-app`）に rewrite し、実体は Cloud Run 上の Next.js SSR が処理する

## 環境

| 対象 | バージョン |
|---|---|
| Node.js | 22 (LTS jod) |
| Next.js | 15 系（Pages Router） |
| React | 19 系 |
| Emotion | 11 系 |
| Firebase (client) | 11 系（compat 層） |
| Tailwind CSS | 4 系 |
| TypeScript | 5 系 |
| パッケージマネージャ | npm |

> バージョンアップの経緯・方針は [`app/docs/version_up_nextjs_plan.md`](./app/docs/version_up_nextjs_plan.md)、作業ログは [`app/PROGRESS.md`](./app/PROGRESS.md) を参照してください。

### Node.js バージョンの切り替え（作業ディレクトリで自動）

このリポジトリでは Node のバージョンを `.node-version` / `.nvmrc`（ともに **22.23.1**）で固定しています。`app/package.json` の `engines` と `app/Dockerfile`（`node:22-alpine`）も揃えてあります。

- **[nodenv](https://github.com/nodenv/nodenv) / [Volta](https://volta.sh/) / [fnm](https://github.com/Schniz/fnm) / [mise](https://mise.jdx.dev/)**: `.node-version` を読み、ディレクトリ移動時に自動で 22 系へ切り替わります（推奨）。
- **[nvm](https://github.com/nvm-sh/nvm)**: 作業ディレクトリで `nvm use`（`.nvmrc` を参照）を実行します。`cd` で自動切替したい場合は、`~/.zshrc` に nvm 公式の [zsh 自動 `nvm use` フック](https://github.com/nvm-sh/nvm#zsh)を追加してください。

```shell
# 初回のみ: 対象バージョンを導入
$ nvm install     # .nvmrc の 22.23.1 を導入
# 以降、このディレクトリで
$ nvm use         # 22 系に切り替え
$ node -v         # v22.x であることを確認
```

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

> ポート 3000 が別プロセス（Docker 等）で使われている場合は `npm run dev -- -p <別ポート>` で起動できます。

### エラーの確認方法（どこを見ればよいか）

| 状況 | 確認場所 |
|---|---|
| **ビルド時のエラー** | `npm run build` を実行した**ターミナルの出力**。`Failed to compile` の直下にファイル名・行番号・内容が表示されます。 |
| **型エラーのみを確認したい** | `cd app && npx tsc --noEmit`（ビルドせず型エラーだけを一覧表示） |
| **開発中（`npm run dev`）のエラー** | ①`npm run dev` を実行した**ターミナル**（サーバー側のエラー・ログ）②**ブラウザ画面のエラーオーバーレイ**（画面全体に表示）③**ブラウザの開発者ツール → Console**（クライアント側のエラー・警告） |
| **本番（Cloud Run）のエラー** | GCP コンソール → **Cloud Run → `gishohaku-app` → ログ**。ユーザー側のクライアントエラーは各自の**ブラウザ Console**。 |
| **デプロイ（Cloud Build）の失敗** | GCP コンソール → **Cloud Build → 履歴** の各ステップのログ。 |

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

### DryRun（既定・安全装置）

`20260428-` で始まる主要スクリプトは **既定で DryRun（Firestore へ書き込まない／メールを送信しない）** で動作する。
これは**誤って実行してもデータベースやメール送信に影響が出ない**ようにするための安全装置で、DryRun 時は「何が行われる予定か」をログに出力するだけです。

**実際に書き込み／送信を行うときのみ**、環境変数 `DRY_RUN=false` を明示的に指定する。

```shell
# DryRun（既定）: 書き込み・送信はされず、予定内容だけがログに出る
$ npx tsx scripts/20260428-createCircles.ts

# 実行（本当に書き込む／送信する）
$ DRY_RUN=false npx tsx scripts/20260428-createCircles.ts
```

### 実行方法

リポジトリルートで、`tsx`（または `npm run runscript`）に実行したいファイルを渡して実行する。

```shell
# ルートで依存をインストール
$ npm install

# スクリプトを実行（例・DryRun）
$ npx tsx scripts/20260428-createCircles.ts
# もしくは
$ npm run runscript scripts/20260428-createCircles.ts
```

- **カレントディレクトリはリポジトリルート**を前提とする。CSV は `data/`（例: `data/entries-gishohaku13.csv`, `data/mail-gishohaku13.csv`）に配置する。
- `20260428-sendCircleInvitation.ts` はメール送信を行い、`.env`（リポジトリルートの1つ上の階層 `../.env`）から SMTP などの設定を読み込む（DryRun 時は SMTP 設定不要）。送信前に宛先 CSV を必ず確認すること。
- `20260428-createCircles.ts` / `20260428-createInvitation.ts` は `firebase-admin` で Firestore を操作するため、実行時は `PROJECT_ID` などの環境変数を設定する。

代表的なスクリプト:

| ファイル | 内容 | 既定 |
|---|---|---|
| `20260428-createCircles.ts` | CSV からサークル情報を Firestore に登録 | DryRun |
| `20260428-createInvitation.ts` | 登録済みサークルへの招待（ログインURL）を発行 | DryRun |
| `20260428-sendCircleInvitation.ts` | サークルへ配置・ログイン情報の案内メールを送信 | DryRun |
