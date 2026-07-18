# Next.js / Node.js バージョンアップ作業計画

技書博アプリ（`app/`）の Next.js・React・Node.js・周辺依存を、レイアウト崩れとデプロイ破壊なしに最新バージョンまで引き上げるための作業計画。
**この計画は Claude Code が `/goal` で実行する前提**で書かれている。各フェーズがゴール単位のチェックリストになっており、原則上から順に実行する。
先行事例 [`remove_sancho_plan.md`](./remove_sancho_plan.md) の構成・運用ルール（ビルドルール／エラー対応ルール／記録ルール／計画レビューの観点）を踏襲している。

> **性質の違い**: sancho 削除は「1ライブラリの置き換え」だったが、本作業は **React・Emotion・Firebase・ビルドツールチェーンが相互に絡む多段の major アップグレード**である。したがって「一気に最新へ」ではなく、**各 major を1段ずつ上げてそのつどビルド＋スクリーンショット比較で checkpoint を取る**ことを最重要の方針とする。1段ごとにコミットし、壊れたら直前の checkpoint に戻せる状態を常に維持する。

---

## 0. 前提・実行ルール（全フェーズ共通）

### スコープ
- **対象**: `app/`（Next.js 本体）と、それに連動するルート `scripts/`（データ追加スクリプト）・`README.md`・`app/Dockerfile`・`app/next.config.js`・`cloudbuild.yaml` の整合。
- **Router 方針**: **Pages Router を維持する**。App Router への移行はスコープ外（ページ全書き換えになりデプロイ・レイアウト崩れリスクが跳ね上がるため）。Next.js 15 でも Pages Router は完全サポートされている。
- **見た目の維持が最優先**。機能追加・リファクタリング・App Router 化・デザイン変更は行わない。

### ビルド・実行ルール
- **プロジェクト用 Node と作業ツール用 Node を分離する**（sancho 計画の教訓）。Playwright など Node 18+ 前提のツールは、グローバルの Node を切り替えず `PATH="<toolのNode>:$PATH" npx ...` のようにコマンド単位でパスを前置して実行する。
- ビルド手順は `app/Dockerfile` に従う（フェーズ進行に合わせて Dockerfile 側の Node も更新する）:
  ```
  npm ci --legacy-peer-deps
  API_KEY=<値> PROJECT_ID=<値> npm run build
  ```
  - `--legacy-peer-deps` は peer 依存の衝突回避のため現状必要。フェーズが進んで依存が整合したら**外せるか検証し、外せた時点で Dockerfile からも外す**（外せない場合は理由を PROGRESS に記録して継続）。
  - `API_KEY` / `PROJECT_ID` は Firebase 用。**ダミー値でビルドが通ること**を前提とする（sancho 計画の実績: Firebase はビルド時に値を検証しない）。通らなくなったらユーザーに実値を依頼する。
- `npm run dev`（= `next dev`）で `http://localhost:3000` が表示されることを各フェーズの受け入れ基準に含める。

### 数値・列挙の再検証ルール
- 本計画中の数値・一覧（「Emotion pragma 72ファイル」「Firebase namespaced API 75箇所」等）は**調査時点のスナップショットであり正とはみなさない**。各フェーズ冒頭で再検証コマンドを実行して一覧を再生成し、差分があれば PROGRESS に「計画との差分」として明示した上で再生成した一覧を正とする。
  - Emotion 使用: `grep -rln "@emotion/core\|@emotion/styled\|@emotion/css" app/src | wc -l`
  - Firebase namespaced 使用: `grep -rln "from 'firebase/app'\|firebase\.\(auth\|firestore\|storage\|functions\)(" app/src`
  - next-images 経由の画像 import: `grep -rn "import .* from '.*\.\(png\|svg\|jpg\|jpeg\|gif\)'" app/src`

### エラー対応ルール
- **ひとつのエラーに対する解決の試行は3回まで**。3回で解決できなければ、以下を PROGRESS にまとめて作業を中断しユーザーに報告する:
  - エラーメッセージ全文
  - 試した3つの対処と各結果
  - 現時点の仮説と、人間に判断してほしいこと

### 記録ルール（中断・再開のため）
- **すべての作業・調査・判断を `app/PROGRESS.md` に随時追記する**（まとめてではなく各ステップの開始時・完了時に書く）。フォーマット:
  ```markdown
  ## YYYY-MM-DD HH:MM [フェーズN]
  - やったこと:
  - 結果（コマンド出力の要点、成功/失敗、ビルドサイズ）:
  - 判断・メモ:
  - 次のアクション:
  ```
- **再開手順**: 再開時はまず PROGRESS を読み、未完了項目から続行する。環境状態（ブランチ、Node バージョン、dev サーバー起動有無、現在どの Next バージョンまで上げたか）も PROGRESS から復元する。
- **計画からの逸脱（追加改修・簡略化・寄り道）は「計画との差分」として別枠で明示記録する**（完了報告時に差分だけ抽出できるように）。

### Git ルール
- 作業ブランチ `feature/gishohaku_nextjs_version_up`（既に本ブランチ）上で行う。
- **各 checkpoint（Node 更新・Emotion11・React18・Next の各 major・Firebase・Tailwind）ごとに小さくコミットする**。壊れたときに直前の checkpoint に戻せることを最優先する。
- `package.json` / `package-lock.json` はセットでコミットする。

---

## 1. フェーズ1: 準備・現状把握・ベースライン取得

- [ ] `app/PROGRESS.md` を作成し、この計画へのリンクと開始日時、開始時点のブランチ・Node バージョンを記録する。
- [ ] **現行バージョンの確定**（`package-lock.json` から実値を取得し PROGRESS に記録）:
  - `node -e "const p=require('./app/package-lock.json'); ['next','react','react-dom','firebase','@emotion/core','tailwindcss','typescript'].forEach(n=>console.log(n, (p.packages['node_modules/'+n]||{}).version))"`
  - 調査時点の実測値: **next 10.2.3 / react 16.13.1 / firebase 8.6.7 / Emotion 10 / Tailwind 2 / TypeScript 3.4**。
- [ ] **Node バージョンの不整合を洗い出す**（現状バラバラ。統一が必要）:
  | 箇所 | 現状 | 備考 |
  |---|---|---|
  | `app/Dockerfile` | `node:16-alpine` | 実ビルドはこれ。これが事実上の正 |
  | `app/package.json` engines | `"node": "14"` | 未整合 |
  | ルート `.node-version` | `10.15.2` | 明らかに stale（firebase-admin 11 / tsx は Node10 で動かない） |
  | `functions/package.json` engines | `"node": "14"` | Cloud Functions。今回の直接対象外だが記録 |
  - これらを**目標 Node（フェーズ2で決定）に統一する方針**を PROGRESS に明記する。
- [ ] **アップグレードのブロッカー棚卸し**（各項目の使用箇所を grep で再生成し PROGRESS に一覧化）:
  1. **Emotion 10 + jsx pragma**（`/** @jsx jsx */` + `@emotion/core`）— React 18 には Emotion 11（`@emotion/react`）が必須。約72ファイル。
  2. **Firebase 8 namespaced API**（`firebase/app` + `firebase.firestore()` 等）— v9+ はモジュラー。約75箇所。**compat 層（`firebase/compat/*`）で最小改修する方針**を第一候補とする（フェーズ5で判断）。
  3. **next-images**（`import x from './x.png'` が**文字列 URL** を返す前提。`<img src={x}>` で使用）— Next 11+ の標準静的 import は**オブジェクト**（`{src,...}`）を返すため、そのままでは壊れる。約10箇所。
  4. **`exportPathMap`**（`next.config.js`）— Pages Router では Next 15 でも動くが、getStaticProps/getServerSideProps と非互換。**現在 SSR（Cloud Run で `next start`）運用のため production では実質無効の可能性が高い**。フェーズ4で挙動を検証して要否を判断する。
  5. **`getInitialProps`**（`_app.tsx` と 4 コンテナ）— 全 Next バージョンで動作継続可。維持する。
  6. **`@next/mdx` 10 / `.mdx` ページ**（`code-of-conduct.mdx` 等）— Next の major に合わせて上げる。
  7. **`babel-plugin-emotion`（deps にあるが `app/` に babel 設定ファイルなし）** — 現状 pragma 方式で SWC でも一部動く可能性。Next 12+ の SWC + Emotion の組み合わせをフェーズ3で確定する。
  8. **Tailwind 2**（`import 'tailwindcss/tailwind.css'` を `_app.tsx` で使用）— Tailwind 3 でこの import パスは変わる。Tailwind 4 は破壊的変更が大きい。**Tailwind 3 を上限とし、4 は別作業に切り出す**方針を第一候補とする。
- [ ] **ビルドのベースライン取得**: 現行 Node 16 で `cd app && npm ci --legacy-peer-deps && API_KEY=dummy PROJECT_ID=dummy npm run build` が通ることを確認し、**`.next` サイズと First Load JS を記録**する（各フェーズの回帰比較基準）。ダミー値で通らなければユーザーに実値を依頼。
- [ ] **console 警告のベースライン記録**（sancho 計画の教訓）: `npm run dev` で主要ページを開き、既存の警告（hydration mismatch 等）を PROGRESS に記録する。以降「新規エラーか既存か」の判定基準にする。
- [ ] **検証項目の実行可能性を事前分類**（sancho 計画の教訓）: フェーズ7の各検証について「静的表示のみで確認可能 / 実データ（Firestore）が必要 / 認証が必要」を分類し、ダミー認証環境で実行不能な項目とその代替検証（型チェック＋コードレビュー）を今の時点で確定して記録する。
- [ ] **before スクリーンショット取得**（Playwright, **1280x800 固定・fullPage**、after と同一条件）。対象ルートは `next.config.js` の `exportPathMap` と実在ルートを突合して確定（sancho 計画の実績: circle 一覧は `gishohaku1` 等の実在イベントのみ静的生成）。最低限の対象:
  | URL | 確認対象 |
  |---|---|
  | `/` | トップ（Hero, Header, 各 section） |
  | `/sign_in` `/sign_up` `/reset_password` | フォーム（Button/Input/Alert） |
  | `/archive` | Container/List |
  | `/gishohaku1/circles`・詳細 | CircleCell/CircleSelect |
  | `/gishohaku1/books`・詳細 | BookCell/BookList、画像表示（next-images 影響） |
  | `.mdx` ページ（`/code-of-conduct` 等） | MDX レンダリング |
  - スクリーンショットは `app/.nextjs-migration/before/` に保存（**コミットしない**。`.gitignore` に追加）。
- [ ] フェーズ1完了時点でコミット（PROGRESS・`.gitignore` のみ。コードは未変更）。

## 2. フェーズ2: 足回りの近代化（Node / TypeScript / ツールチェーン統一）— Next 10 のまま

**目的**: Next の major を上げる前に、Node と TypeScript を目標水準へ引き上げてビルドが通る土台を作る。Next 10 のままなので変更が小さく切り分けやすい。

- [ ] **目標 Node バージョンの決定**: LTS を採用する。**Node 22 LTS を最低ラインの推奨**とする（Node 24 が LTS 化していれば 24 でも可。決定値を PROGRESS に記録）。
  - Node を上げる際は「作業ツール用 Node と分離」ルールに従い、プロジェクト用 Node を `.node-version` / Dockerfile / engines に一元的に記述する。
- [ ] **Node バージョン記述を目標値に統一する**:
  - `app/package.json` の `engines.node`
  - `app/Dockerfile` の `FROM node:<major>-alpine`
  - ルート `.node-version`（stale な `10.15.2` を目標値へ）
  - （`functions/` は今回の直接対象外だが、Node 不整合として PROGRESS に putback 候補として記録）
- [ ] **TypeScript を 5 系へ**（`app` は 3.4、ルートは 4.9）。`app/package.json` の `typescript` を `^5` に。`tsconfig.json` の `target`/`lib`/`moduleResolution` を必要に応じて調整（`skipLibCheck: true` は維持）。`npx tsc --noEmit` で型エラーの現状を把握（この時点で通らなくても可、フェーズ進行で解消）。
- [ ] 目標 Node で `npm ci --legacy-peer-deps && npm run build` が**引き続き通ること**を確認（Node だけ上げても Next 10 が動くこと）。通らない場合、Next 10 が新しい Node で動かない既知問題なら**フェーズ4の Next 更新を前倒しする**判断を検討し PROGRESS に記録。
- [ ] `npm run dev` で表示確認 → checkpoint コミット（`node-upgrade`）。

## 3. フェーズ3: React 16 → 18 ＋ Emotion 10 → 11（相互依存のためセットで実施）

**目的**: React 18 と Emotion 11 は片方だけ上げられない（Emotion 10 は React 18 非対応、Emotion 11 は React 16 でも動くが本作業では同時に上げる）。**Next はまだ 10 系のまま**にして、ランタイム側の破壊的変更をここに閉じ込める。

> React 16→18 を一段で行うか、17 を経由するかは実施時に判断する。Next 10 が React 18 を正式サポートしないため、**React 17 まで上げてフェーズ4で Next と一緒に 18 へ**という順序も選択肢になる。フェーズ4冒頭の互換表で最終決定し PROGRESS に記録する。

- [ ] **Emotion 11 への移行**（公式 codemod を利用）:
  - `npx @emotion/eslint-plugin` 等ではなく、パッケージの置き換え: `@emotion/core` → `@emotion/react`、`@emotion/styled` は同名で v11 へ、`@emotion/css` は v11 へ。`babel-plugin-emotion` → `@emotion/babel-plugin`。
  - jsx pragma を全ファイルで置換: `/** @jsx jsx */ import { jsx } from '@emotion/core'` → `/** @jsx jsx */ import { jsx } from '@emotion/react'`。**フェーズ1で再生成した使用ファイル一覧を正**として全件処理する。
  - `theme.ts` / `colorUtils.ts` / `formStyles.ts`（sancho 削除で自作したもの）が Emotion API に依存していれば追従する。
  - 型定義 `@emotion/react` の `Theme` 型に合わせて `ThemeProvider` 利用箇所を確認（本アプリは ThemeProvider 未使用の可能性。grep で確認）。
- [ ] **React 18（or 17）への更新**: `react` / `react-dom` / `@types/react` / `@types/react-dom` を更新。
  - `ReactDOM.render` を直接呼ぶ箇所は Next が管理するため通常なし（`_app.tsx`/`_document.tsx` はクラスコンポーネントのまま維持可）。
  - React 18 の厳格な副作用（StrictMode 二重実行）や `useEffect` 依存は、**見た目に影響する範囲のみ**確認（機能改修はしない）。
- [ ] **周辺 React ライブラリの互換確認**（React 18 で壊れやすいもの。使用有無を grep で確認し、必要なら更新）: `react-helmet`（→ `react-helmet-async` 検討）、`react-infinite-scroller`、`react-lazyload`、`react-image-lightbox`、`react-dropzone`、`formik`、`react-ga`（→ `react-ga4` 検討）。**更新は最小限**にし、動くなら据え置き。壊れたものだけ対応して PROGRESS に記録。
- [ ] 目標 Node で `npm run build` → `npm run dev` 表示確認。
- [ ] **スクリーンショット比較（この checkpoint で1回目の本格比較）**: フェーズ1と同条件で after を `app/.nextjs-migration/after-react18/` に取得し、`npx pixelmatch` で**全ページ機械比較**。self-diff=0 のノイズ基準を先に取る。差分は「意図的（許容）/ 崩れ（要修正）」を判定して記録。Emotion 移行はスタイル崩れが出やすい最重要チェックポイント。
- [ ] checkpoint コミット（`react18-emotion11`）。

## 4. フェーズ4: Next.js を major 1段ずつ引き上げ（10 → 11 → 12 → 13 → 14 → 15）

**方針**: **1 major ごとに**「アップグレード → ビルド → dev 表示 → スクショ比較 → コミット」を1サイクルとする。各サイクルで公式 upgrade codemod を使う: `npx @next/codemod@latest upgrade`（または各バージョン個別の codemod）。飛ばさない。

各段の**主な破壊的変更と対応**:

- [ ] **10 → 11**:
  - **next-images の廃止対応**（Next 11 で画像 import が標準化）。現状 `import x from './x.png'` が**文字列**を返す前提。Next の標準静的 import は**オブジェクト**を返すため、以下いずれかで対応（フェーズ1の再生成一覧を正に全件）:
    - (A) 使用箇所を `x.src` に変更する（`<img src={x.src}>`）。**推奨**（追加依存なし）。
    - (B) `next-images` を維持して文字列返却を保つ（延命策。将来また詰まるので非推奨）。
  - `next/image` を使っている箇所（`gishohaku5/index.tsx`）は Next 11 の `next/image` 仕様変更を確認。
  - ESLint 統合が入るが CI では未使用なら無視可。
- [ ] **11 → 12**:
  - **SWC がデフォルト化**。`app/` に babel 設定が無いため SWC で動く見込み。Emotion 11 を SWC で使うため `next.config.js` に `compiler: { emotion: true }` を追加する。
  - Node 12 サポート終了（目標 Node は 22 なので問題なし）。
  - `next start` / Cloud Run の挙動が変わらないことを確認。
- [ ] **12 → 13**:
  - **App Router が導入されるが Pages Router を維持**（`app/` ディレクトリは作らない）。
  - `next/image` / `next/link` の破壊的変更（`<Link>` が `<a>` を自動生成、`legacyBehavior`）。使用箇所を確認し、`<Link><a>...</a></Link>` パターンは修正または `legacyBehavior` を付す。
  - `@next/font` 等は未使用なら無視。
  - **`exportPathMap` の要否をここで確定**: SSR 運用のため production で無効なら**削除**する。削除して dev/build/デプロイ挙動（対象ルートの生成・除外）が変わらないことを検証。変わる場合は `getStaticPaths` へ移行するか、削除を見送って PROGRESS に理由を記録。
- [ ] **13 → 14**:
  - 最小 Node が 18.17 に。目標 Node で問題なし。
  - `exportPathMap` は Pages Router では継続動作するが、13 で削除済みなら影響なし。
  - Server Actions 等は未使用。
- [ ] **14 → 15**:
  - **React 19 が推奨**（Pages Router は React 18 でも動作可）。React 19 へ上げるかはここで判断（Emotion 11.14+ は React 19 対応済み。周辺 React ライブラリの React 19 互換を再確認）。**リスクを抑えるなら React 18 のまま Next 15 で止める**選択も可。決定を PROGRESS に記録。
  - `next/image` の追加変更、`fetch` キャッシュのデフォルト変更（Pages Router の getInitialProps には影響小）。
  - `@next/mdx` を 15 系へ。`.mdx` ページのレンダリング差分をスクショ確認。
- [ ] **各段共通**: `npm run build` → `npm run dev` 表示確認 → `npx pixelmatch` でスクショ比較 → checkpoint コミット（`next11` … `next15`）。**1段で崩れたら次段に進まない**。

## 5. フェーズ5: 周辺依存の追随（Firebase / Tailwind / MDX / その他）

- [ ] **Firebase 8 → 最新（v11/v12 系）**:
  - **第一候補: compat 層で最小改修**。`firebase/app` → `firebase/compat/app`、`firebase/firestore` → `firebase/compat/firestore` 等に置換すれば namespaced API（`firebase.firestore()` 等 約75箇所）をほぼそのまま維持できる。`utils/firebase.ts` の初期化も compat で書き換え。
  - 完全モジュラー化（`getFirestore`/`collection`/`doc` 関数形式）は**スコープ外**（75箇所の書き換えは崩れリスク・工数大）。将来の別作業として README/PROGRESS に putback 記録。
  - **注意**: ルート `scripts/` は `firebase-admin`（別 SDK）を使っており本項の影響を受けない（フェーズ6で別途）。
  - 更新後 `npm run dev` で認証・Firestore 読み取り系ページが動くこと（実データが必要な項目はフェーズ1の分類に従い代替検証）。
- [ ] **Tailwind 2 → 3**:
  - `_app.tsx` の `import 'tailwindcss/tailwind.css'` は Tailwind 3 で廃止 → `@tailwind base; @tailwind components; @tailwind utilities;` を書いた CSS を作って import する方式へ。
  - `tailwind.config.js` / `postcss.config.js` を v3 形式へ。`@tailwindcss/line-clamp` は v3.3+ でコアに統合されたのでプラグイン削除可。`@tailwindcss/forms` は追随。
  - **Tailwind 4 は破壊的変更が大きいためスコープ外**（別作業）。3 で止める判断を記録。
  - 本アプリは主に Emotion でスタイリングし Tailwind は限定利用のため、崩れ影響範囲を grep（`className=` の Tailwind クラス使用箇所）で把握してから実施。
- [ ] **その他依存の追随**: `dayjs` / `classnames` / `qs` / `marked`（→ 最新 `marked` は API 変更あり、使用箇所確認）/ `axios`（0.19 → 1.x、breaking あり。使用箇所確認）/ `@sentry/browser`（コメントアウト中なので削除 or 更新判断）。**使って壊れているものだけ**対応し、動くものは最小更新。
- [ ] `npm audit` の結果を記録（脆弱性の増減）。**この作業で新規に増えた高リスクのみ**対応し、既存の積み残しは putback 記録（スコープを広げない）。
- [ ] checkpoint コミット（`firebase-tailwind`）。

## 6. フェーズ6: データ追加スクリプトの動作保証

**対象**: `scripts/20260428-createCircles.ts` / `scripts/20260428-createInvitation.ts` / `scripts/20260428-sendCircleInvitation.ts`（ルート `package.json` = `"type":"module"` + `tsx` + `firebase-admin` 11 で動く別プロジェクト）。

- [ ] **現状の実行方法を確定して README に明記する**（現 README の `yarn runscript` は存在しないスクリプトを指しており誤り）。実際の想定は `tsx`。ルート `package.json` に実行用 npm-script を追加する案:
  ```json
  "scripts": { "runscript": "tsx" }
  // 実行例: npm run runscript scripts/20260428-createCircles.ts
  ```
  - `20260428-createCircles.ts` / `20260428-createInvitation.ts` は `admin from 'firebase-admin'` と `../app/src/utils/circle`（TS）を import。**tsx でルートから実行**でき、cwd 依存で `./data/entries-gishohaku13.csv` を読む点を確認。
  - `20260428-sendCircleInvitation.ts` は `node:` プロトコル import・`csv-parser`・`nodemailer`・`dotenv` を使い、`../.env`（cwd の親）と `./data/mail-gishohaku13.csv` を参照。cwd 前提を README に明記。
- [ ] **目標 Node との整合**: `firebase-admin` 11 は新しい Node（22）で警告・非互換が出る可能性。**Node 22 で動くか実行検証**し、必要なら `firebase-admin` を最新（v12/13）へ、`@types/node` は 22 系のまま整合。tsx も最新へ。
- [ ] **`../app/src/utils/circle` への依存が壊れていないこと**を確認（Emotion/Firebase 更新後も、この util は型・純ロジックのみで import 可能か。もし util が client SDK に依存して import 不能になっていたら、スクリプト側で必要な型のみ切り出す等の最小対応を検討し PROGRESS に記録）。
- [ ] **ドライラン検証**: ダミー/エミュレータ or 実書き込みを避ける形で、少なくとも「import 解決 → firebase-admin 初期化 → CSV パース」までがエラーなく進むことを確認する（実書き込みはユーザー判断。破壊的操作は勝手に実行しない）。
- [ ] ルート `.node-version` / `package.json` engines（あれば）を目標 Node に統一。checkpoint コミット（`scripts-compat`）。

## 7. フェーズ7: 総合検証（dev 表示 / ビルド / デプロイ / スクショ）

- [ ] **dev 検証**: 目標 Node で `cd app && npm run dev` → `http://localhost:3000` が主要ページで正しく表示される（ゴールの受け入れ基準）。
- [ ] **ビルド検証**: `app/Dockerfile` と同条件（目標 Node + `npm ci`（`--legacy-peer-deps` の要否は再判定）+ `API_KEY=<値> PROJECT_ID=<値> npm run build`）が成功。Docker デーモンが起動していれば `docker build --build-arg project_id=<値> --build-arg api_key=<値> .` でも確認（`docker info` で起動確認してから。未起動なら best-effort で PROGRESS に記録）。
- [ ] **スクリーンショット比較（最終・定量先行）**: フェーズ1と同一ページ・同一条件（1280x800, fullPage）で after を `app/.nextjs-migration/after-final/` に取得。
  1. `npx pixelmatch before after diff` で**全ページ機械比較**。
  2. self-diff=0 のノイズ基準を確認。
  3. 差分ページのみ diff/crop で目視判定。「意図的（許容）/ 崩れ（要修正）」を PROGRESS に記録。崩れは修正して再取得。
- [ ] **デプロイ経路の非破壊確認**（実デプロイはユーザー判断。勝手に本番へ出さない）:
  - `cloudbuild.yaml` の手順（Docker build → push → Cloud Run deploy → Firebase hosting deploy）が、変更した Dockerfile/Node/ビルド成果物と整合するか机上レビュー。
  - `firebase.json` の rewrites（`**` → Cloud Run `gishohaku-app`）・headers（CSP 等）は**変更しない**。Next の major 更新で `_next/static/**` のパスや CSP に抵触する変化（inline script のハッシュ要求等）が出ていないかを、build 出力と CSP を突合して確認。
  - `exportPathMap` を削除した場合、Firebase hosting の redirects（`/books`→`/gishohaku1/books` 等）と実ルートの整合を確認。
- [ ] **バンドルサイズ比較**: `.next` サイズと First Load JS をフェーズ1ベースラインと比較して記録。
- [ ] **console エラー比較**: フェーズ1のベースラインに対し新規エラーが増えていないこと。

## 8. フェーズ8: README 更新・完了報告

- [ ] **`README.md` を更新**（本計画とセットで実施）: Node/Next の目標バージョン、`app/` のローカル手順（`npm install` → `npm run dev` → `http://localhost:3000`）、環境変数（`API_KEY`/`PROJECT_ID`/`DATABASE_URL`/`STORAGE_BUCKET` 等）、デプロイ（Cloud Build/Cloud Run/Firebase hosting の関係）、**データスクリプトの正しい実行方法**（`yarn runscript` の誤記を修正し、tsx 実行例・cwd・CSV/`.env` の配置を明記）を反映する。
- [ ] **PROGRESS.md に最終サマリ**:
  - 最終到達バージョン（Node / Next / React / Emotion / Firebase / Tailwind / TypeScript）
  - **計画との差分一覧**（追加改修・簡略化・寄り道、React 19 まで上げたか等の判断）
  - 既知の見た目差分（許容したもの）と判定根拠
  - 未検証項目（認証必須・実データ必須・実デプロイ）とその理由・代替検証
  - スコープ外に putback したもの（Firebase 完全モジュラー化 / Tailwind 4 / App Router / functions の Node / `--legacy-peer-deps` を外せなかった等）
  - バンドルサイズ・脆弱性の増減
- [ ] ユーザーに報告し、PR 作成の要否と本番デプロイの実施可否を確認する。

---

## 9. リスク・補足

| リスク | 対応 |
|---|---|
| Emotion 10→11 でスタイルが崩れる（最大リスク） | フェーズ3で pixelmatch 全ページ比較を必須 checkpoint に。jsx pragma の全件置換をフェーズ1再生成一覧で担保 |
| React 18/19 の副作用・周辺ライブラリ非互換 | 周辺 React ライブラリは「壊れたものだけ」最小更新。React 19 化は 14→15 段で任意判断 |
| next-images 廃止で画像が文字列→オブジェクトになり `<img src>` が壊れる | フェーズ4(10→11) で使用箇所を `x.src` に全件修正。フェーズ1で使用箇所を再生成 |
| `exportPathMap` が Next 13+ で非互換 | SSR 運用のため production 無効の想定。13段で挙動検証し削除 or getStaticPaths 化。Firebase redirects との整合も確認 |
| Firebase 8→9+ のモジュラー化コスト（75箇所） | compat 層で最小改修。完全モジュラー化はスコープ外に putback |
| Next の major を飛ばして未知の破壊的変更に当たる | **1 major ずつ**上げ、各段でビルド＋スクショ＋コミット。飛ばさない |
| デプロイ破壊（Dockerfile Node・CSP・rewrites） | Dockerfile の Node を各段で追随。CSP/rewrites は変更せず build 出力と突合。実デプロイはユーザー判断 |
| ビルドに Firebase 実値が必要になる | フェーズ1でダミー値検証。不可ならユーザーに実値依頼 |
| データスクリプトが app/src util の変更で import 不能になる | フェーズ6で import 解決を検証。壊れたら型の切り出し等で最小対応 |
| firebase-admin 11 が Node 22 で非互換 | フェーズ6で実行検証し、必要なら admin を最新へ |
| `--legacy-peer-deps` が外せない | 依存整合後に外せるか検証。外せなければ理由を記録して継続（無理に外さない） |
| Node バージョン不整合（app/engines・.node-version・functions） | フェーズ2で app/ルートを統一。functions は putback 記録（スコープ外） |
| Tailwind 2→3 の CSS import パス変更・4 の破壊的変更 | 3 で止める。import 方式を `@tailwind` ディレクティブへ。4 は別作業 |

## 10. バージョン対応表（現行 → 目標）

| 対象 | 現行（実測） | 目標 | 備考 |
|---|---|---|---|
| Node.js | 16（Dockerfile）/ 14（engines）/ 10.15.2（.node-version, stale） | **22 LTS**（24 可） | 全箇所を統一 |
| Next.js | 10.2.3 | **15 系（最新）** | Pages Router 維持。1 major ずつ |
| React / ReactDOM | 16.13.1 | **19** | Emotion 11 とセット |
| Emotion | 10（`@emotion/core`） | **11（`@emotion/react`）** | pragma 全件置換 + SWC plugin |
| Firebase (client) | 8.6.7 | **11/12 系（compat 層）** | namespaced 維持。完全モジュラーは別作業 |
| Tailwind CSS | 2 | **4** | import 方式・config を v4 へ |
| TypeScript | 3.4（app）/ 4.9（root） | **5 系** | |
| @next/mdx | 10 | Next に追随（15） | |
| next-images | 使用 | **廃止**（標準静的 import） | 画像使用箇所を `.src` へ |
| firebase-admin (scripts) | 11 | Node 22 で動く版（必要なら 12/13） | フェーズ6 |

> **確定した方針（2026-07-18 ユーザー判断）**:
> 1. **React は 19 まで**上げる（Next 15 + React 19）。
> 2. **Firebase は compat 層で最小改修**（工数最小を優先。完全モジュラー化はスコープ外）。
> 3. **Tailwind は 4 まで**上げる（3 で止めず 4 へ）。
> 4. **本番デプロイは本作業に含めない**（Docker ビルド成功・デプロイ経路の机上確認まで。実デプロイは別途ユーザーが実施）。
> 5. **Node はこの作業ディレクトリで自動切替できる形にする**（グローバル依存を解消）。目標 **Node 22.23.1（LTS jod）** を `.nvmrc` / `.node-version` に固定し、nvm 等で per-directory 切替。auto-switch のシェルフック導入は README で案内する。

---

## 11. 計画レビューの観点（人間向け）

`remove_sancho_plan.md` の観点を本作業向けに具体化したチェックリスト。

**A. 段階化と後戻り可能性**
- [ ] major アップグレードが1段ずつに分解され、各段に「ビルド＋スクショ＋コミット」の checkpoint があるか
- [ ] 壊れたとき直前の checkpoint に戻せる粒度でコミットが設計されているか
- [ ] 相互依存（React⇔Emotion、Next⇔next-images/exportPathMap/MDX）が同一フェーズにまとめられているか

**B. 事実の検証可能性**
- [ ] 計画中の数値・一覧（72ファイル/75箇所/画像10箇所）に再生成コマンドが併記され、序盤で再検証するステップがあるか
- [ ] 現行バージョンを lockfile から実測するステップがあるか（package.json の `^` レンジを鵜呑みにしない）

**C. 削除・置き換え固有の観点**
- [ ] next-images 廃止で「文字列→オブジェクト」に変わる暗黙の破壊が使用箇所レベルで洗い出されているか
- [ ] `exportPathMap` が production で本当に効いているか（SSR 運用との関係）を検証するステップがあるか
- [ ] Firebase の namespaced→modular を「全書き換え」せず compat で最小化する判断が明示されているか

**D. 検証計画の実効性**
- [ ] 検証項目ごとに実行可能性（静的/実データ/認証/実デプロイ）が分類され、実行不能項目の代替検証が事前定義されているか
- [ ] 差分の検出を機械（pixelmatch/型チェック/build）に任せ、目視は判定だけに使う設計か（self-diff ノイズ基準つき）
- [ ] ベースラインにスクショだけでなく console 警告・ビルドサイズが含まれているか

**E. 環境・デプロイ**
- [ ] Node バージョン記述の分散（Dockerfile/engines/.node-version/functions）を統一するステップがあるか
- [ ] デプロイ経路（Cloud Build→Cloud Run→Firebase hosting、CSP、rewrites）への影響を build 出力と突合するステップがあるか
- [ ] 秘密情報（API_KEY/PROJECT_ID）の要否を序盤にダミー値で切り分けるステップがあるか

**F. AI の暴走・停滞の制御**
- [ ] エラー対応の試行回数上限（3回）と報告フォーマットが定義されているか
- [ ] スコープ外（App Router 化、Firebase 完全モジュラー、Tailwind 4、機能改修）の判定基準が明示され putback 記録の仕組みがあるか
- [ ] 中断・再開の手順（PROGRESS の読み方、現在到達バージョンの復元）が定義されているか
