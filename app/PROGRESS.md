# Next.js / Node.js バージョンアップ 作業ログ

計画: [`docs/version_up_nextjs_plan.md`](./docs/version_up_nextjs_plan.md)
ブランチ: `feature/gishohaku_nextjs_version_up`
開始: 2026-07-18

## 確定方針（ユーザー判断）
- React は **19** まで / Firebase は **compat 層**で最小改修 / Tailwind は **4** まで / 本番デプロイは**別途**
- Node は作業ディレクトリで**自動切替**（`.nvmrc` / `.node-version` = **22.23.1**、nvm 等）

## 現行バージョン（package-lock.json 実測）
- next 10.2.3 / react 16.13.1 / firebase 8.6.7 / Emotion 10 / Tailwind 2 / TypeScript 3.4（app）
- Node: Dockerfile=node:16 / app engines=14 / .node-version=10.15.2(stale) / functions=14

---

## 2026-07-18 [フェーズ1-2 準備・Node統一]
- やったこと:
  - Node 22.23.1（LTS jod）を nvm で導入（npm 10.9.8）。導入前は Node 16.20.2 のみ。
  - `.nvmrc` / `.node-version`（ルート・`app/`）を **22.23.1** に統一。ルート `.node-version` は stale な 10.15.2 から更新。
  - `app/package.json` engines を `>=22`、`app/Dockerfile` を `node:22-alpine` に更新。
  - 計画ドキュメントに確定方針を反映。`.gitignore` に `app/.nextjs-migration` 追加。
- 結果: （ベースラインビルドは次ステップで確認）
- 判断・メモ: Node を 22 に統一したことで、Playwright 等（Node18+ 必須）との「作業ツール用 Node 分離」ルールは不要になった（全て Node22 で実行可）。
- 次のアクション: Node22 で現行（Next10）のベースラインビルドが通るか確認。

## 追加要件・制約メモ
- **ポート**: プロジェクトの正規 dev ポートは **3000**（`next dev` デフォルト、config 未変更）。現在 3000/3100 は Docker が占有中のため、検証用の一時起動のみ 4321 を使用。before/after は同一ポートで比較すれば層崩れ検証に影響なし。**最終状態は 3000 のまま**。
- **DryRun 要件（ユーザー指示 2026-07-18）**: `20260428-createCircles.ts` / `20260428-createInvitation.ts` / `20260428-sendCircleInvitation.ts` は**既定で DryRun**（Firestore へ書き込まない・メール送信しない）に改修する。誤実行時も DB が変わらないようにするため。明示フラグ（例 `DRY_RUN=false`）指定時のみ実書き込み。→ フェーズ6で実装。

## 2026-07-18 [ベースライン取得]
- Node22 で旧 Next10 dev 起動を試行 → **`ERR_OSSL_EVP_UNSUPPORTED`（OpenSSL3 が MD4 非対応）で起動不可**。Next<12 + Node17+ の既知問題。→ 「Next を上げる必要がある」ことの裏付け。
- before スクリーンショットは旧アプリ本来の **Node16** で取得（`app/src/.babelrc` = Babel 使用であることも判明）。
- Playwright（chromium）を scratchpad に導入（プロジェクト依存を汚さない）。1280x800 / fullPage で8ページ取得成功: top / sign_in / sign_up / reset_password / archive / code-of-conduct / gishohaku1 circles / books。`app/.nextjs-migration/before/`（gitignore）に保存。top は技書博ブランディング・各セクションが正常描画。
- **console 警告ベースライン**: 全ページで `Sheet.tsx:107` の hydration mismatch（`Expected server HTML to contain a matching div`）が**既存**発生。以降「新規か既存か」の判定基準。

## 2026-07-18 [Emotion 10→11 移行（Next10/Node16 上でリスク隔離）]
- やったこと: `@emotion/core`→`@emotion/react` を全ファイル置換（71→ jsx/css/Global/keyframes すべて v11 に存在）。`@emotion/styled` v11 へ（import パス不変）。未使用の `@emotion/css` 削除。`src/.babelrc` の `emotion`→`@emotion/babel-plugin`。`babel-plugin-emotion`→`@emotion/babel-plugin`(devDep)。
- 結果: Node16 で `npm install --legacy-peer-deps` 成功（593 pkg 削除/48 追加。Emotion10 の依存ツリー整理）。`API_KEY=dummy PROJECT_ID=dummy npm run build` **成功**。next 10.2.3 / react 16.13.1 / @emotion/react 11.14.0。**First Load JS 269kB**（回帰比較基準）。
- 判断・メモ: Emotion を先に単独で上げ、Next/React はまだ据え置き。既知良好プラットフォームで72ファイルの置換を検証できた。
- 次のアクション: React18/19 + Next10→15 + Firebase compat + Tailwind4 へ。

## 2026-07-18 [C3: Next 10→15 + React 16→18(→19は次段)]
- **計画との差分**: 中間 major を1段ずつ踏まず、**目標(Next15/React18)へ協調アップグレード**した。理由: 中間バージョンの組合せ(Next12+React16+…)は依存インストール性が悪く、codemod と既知破壊的変更リストで一括対応する方が実務上確実。findDOMNode 削除の影響を避けるため React は一旦 18 に留め、19 化は次段(C4)に隔離する。
- やったこと:
  - package.json: next→15.5.20 / react,react-dom→18.3.1 / @types/react(-dom)→18 / @next/mdx→15 / @mdx-js/loader,react→3 / formik→2.4.6 / react-remove-scroll→2.6 / typescript→5.9 / next-images・react-helmet・request・@sentry/browser・babel-plugin-emotion 削除。firebase(8)・tailwind(2) は据え置き(C4/Task4)。
  - next.config.js: next-images 除去 → `images.disableStaticImages:true` + webpack asset/resource ルールで画像を URL 文字列解決(使用箇所ゼロ変更)。`exportPathMap` 削除(SSR 運用のため production 無効)。`compiler.emotion:true` 追加。env/MDX 維持。
  - `React.SFC`→`React.FC`(削除済み型)、さらに `React.FC`→children 込みの自前型 `FCC`(src/types/react-children.d.ts で定義)へ一括置換。React18 の暗黙 children 削除に対応(定義側=`props.children`, 消費側=JSX 両方)。
  - Emotion: classic pragma `/** @jsx jsx */`(70ファイル) → automatic runtime `/** @jsxImportSource @emotion/react */` に一括変換。`src/.babelrc` 削除して **SWC** 化(`compiler.emotion`)。
  - 個別型修正: emotion css の falsy 条件(`error ? x : undefined`)、Formik エラー表示の `as string` cast、`book.ts` の delete を any cast、`gishohaku5` の next/image に alt 追加。
- 結果: `npx tsc --noEmit` **0エラー**。`API_KEY=dummy PROJECT_ID=dummy npm run build` **成功**。全ルート SSR(`ƒ Dynamic`)。First Load JS **281kB**。
- 判断・メモ: BSD sed が `\b` 非対応で Toast の置換のみ取りこぼし→個別修正。unused な `jsx` import は残置(noUnusedLocals=false のため無害)。
- 次のアクション: dev 起動 + after スクショ比較で層崩れ確認 → C4(React19+findDOMNode系) → Firebase compat / Tailwind4。

## 2026-07-18 [C3 検証: dev + スクショ比較 + Next15 ランタイム修正]
- dev 起動(Node22, port 4321): 全対象ページ 200。
- **Next 15 の破壊的変更をランタイムで検出・修正**:
  1. `<Link><a>` 禁止 → 全 `<Link>`(66箇所) に `legacyBehavior` 付与(<a>とスタイル保持で層崩れ回避)。/sign_in の 500 解消。
  2. **Portal の hydration mismatch**: `useState` 初期化で即 portal 生成 → SSR(null)と不一致。マウント後(useEffect)生成に変更。これは before ベースラインの Sheet 警告の根本原因。Next15+React18 では dev で**エラーオーバーレイ化**する(スクショも汚す)ため修正必須だった。
  3. **index.tsx banner の `<p>`>`<div>` 不正ネスト** → `<div>` に修正(他の gishohaku ページは元から div で問題なし。index のみ構造が異なっていた)。
- **スクショ定量比較(pixelmatch, before=Next10 vs after=Next15, 1280x800/fullPage)**:
  - top 0.27% / sign_in・sign_up・g1-circles・g1-books 0.09% / reset_password 0.09% / archive 0.05%。**いずれも AA・console バッジ程度の微差で層崩れなし**。
  - code-of-conduct のみ高さ +10px(4819→4829, 0.2%)。MDX の軽微な余白差。実害なし。
- 残る console: `legacyBehavior is deprecated` の**非推奨 warning のみ**(エラーではない。Next15 で動作は正常)。将来的な new Link 移行は follow-up。
- `npx tsc --noEmit` 0エラー維持。
- 検証用ポートは 4321(Docker が 3000/3100 占有のため)。**正規ポート 3000 は config 未変更で維持**。

## 2026-07-18 [C4: React 18→19]
- **findDOMNode 削除(React19)対応**: 使用ライブラリを調査 → `react-lazyload`(2.6.5)が findDOMNode 使用で破損確定。`react-image-lightbox`/`react-infinite-scroller` は findDOMNode 不使用。
  - `react-lazyload` を**自前 `src/components/LazyLoad.tsx`(IntersectionObserver ベース)に置換**(4ファイル、`offset` 互換、SSR 整合)。依存削除。
  - `react-image-lightbox`(peer ^16, 旧ライフサイクル)は findDOMNode/string ref 不使用のため据え置き。import は React19 で正常(books ページ 200)。**クリック時のライトボックス表示は実データ必要のため未検証**(代替: import 解決とページ描画で確認)。
- package.json: react/react-dom→19.2.7 / @types/react(-dom)→19 / react-dropzone→14.4.1 / react-lazyload・@types/react-lazyload 削除。
- React19 型修正: `useRef<string>()`→`useRef<string|undefined>(undefined)`(引数必須化, Check/InputGroup)、`cloneElement` の要素を `as ReactElement<any>` cast(IconButton/Popover)、react-dropzone14 の `accept` をオブジェクト形式へ(ImageUploader)。
- 結果: `tsc --noEmit` 0エラー、`npm run build` 成功(First Load JS 294kB)。
- **スクショ比較(React19 vs Next10 baseline)**: top 0.02% / sign_in等 0.09% / archive 0.05% / code-of-conduct のみ +10px。**層崩れなし**。残 console は legacyBehavior 非推奨 warning のみ。
- 次のアクション: Firebase 8→compat / Tailwind 2→4。

## 2026-07-18 [Firebase 8→11 compat]
- `firebase/app`・`firestore`・`storage`・`functions`・`auth` を `firebase/compat/*` に置換(11ファイル)。namespaced API(約75箇所)は不変。
- firebase 11.10.0、tsc 0エラー、build 成功、dev で初期化・接続確認(ダミー project の PERMISSION_DENIED は想定通り=実 creds なら動作)。

## 2026-07-18 [Tailwind 2→4]
- package.json: tailwindcss→4.3.3 / `@tailwindcss/postcss`→4 追加 / `@tailwindcss/forms`→0.5.11 / `@tailwindcss/line-clamp` 削除(v4 コア内蔵) / autoprefixer 削除(v4 内蔵)。
- postcss.config.js → `{ '@tailwindcss/postcss': {} }`。
- tailwind.config.js: `purge`→`content`、`mode:'jit'`/`variants` 削除、`theme.extend.colors` 維持。
- CSS エントリ `src/tailwind.css` 新設: `@import 'tailwindcss'` + `@config '../tailwind.config.js'` + `@plugin '@tailwindcss/forms'`。`_app.tsx` の `import 'tailwindcss/tailwind.css'` を差し替え。
- **v4 互換対応**: border 既定色が currentColor 化する破壊的変更に対し、`@layer base` で `border-color: var(--color-gray-200, currentColor)` を復元。
- 結果: build 成功。**スクショ比較(Tailwind4/React19 vs Next10 baseline)**: top 0.02% / archive 0.05% / circles・books 0.09% / フォーム系 sign_in 0.11%・sign_up 0.13%・reset_password 0.14%(forms プラグインの微差)。**層崩れなし**。sign_in を目視確認し入力欄・ボタン正常。
- 次のアクション: データスクリプト(DryRun 化含む) / 総合検証 / README 最終化。

## 2026-07-18 [データスクリプト DryRun 化 + Node22 対応]
- **DryRun 実装(ユーザー要件)**: `20260428-createCircles.ts` / `createInvitation.ts` / `sendCircleInvitation.ts` を**既定で DryRun**(Firestore 書き込み・メール送信をしない)に改修。`DRY_RUN=false` 明示時のみ実行。誤実行しても DB は変わらない。
  - createCircles: `db.collection('circles').add()` を DryRun ガード(追加予定をログ)。
  - createInvitation: `circleInvitations.add()` を DryRun ガード(作成予定をログ)。読み取り(get)は DB 非変更のため DryRun でも実行。
  - sendCircleInvitation: DryRun 時は transporter を生成せず(SMTP 設定も不要)、`sendMail` をスキップして送信予定をログ。
- **Node22 対応**: root `package.json` の `firebase-admin` を ^11→^13(13.10.0, Node18-22 対応)、`firebase-functions` ^4→^6、typescript ^4.9→^5.6 に更新。`runscript`(=tsx)スクリプト追加。
- **検証(実行なし、ユーザー指示)**: `tsc --noEmit`(esModuleInterop/bundler/esnext/es2022)で3スクリプトを静的チェック → **exit 0**。import 解決(`../app/src/utils/circle` の default interface、firebase-admin default)・型・DryRun 実装すべて OK。実行(dry-run 含む)はしていない。
- **完了**: 全フェーズのアップグレード完了。残: README 最終化・総合報告。

## 2026-07-18 [総合検証・完了]
- **README 最終化**: バージョン表(React19/Tailwind4/Firebase11/Emotion11/TS5)、Node 自動切替(nvm/.node-version)手順、**エラー確認方法**(ビルド/開発/本番/デプロイ別)、スクリプト DryRun 手順を反映。
- **クリーンビルド**: `npm ci --legacy-peer-deps`(lock 整合)→ `npm run build` 成功。
- **Docker ビルド(デプロイ経路検証)**: `docker build`(node:22-alpine, npm ci, next build)完走・イメージ生成成功。
- **本番サーバ起動検証**: コンテナを `docker run`(next start, Cloud Run 相当)→ /・/sign_in・/gishohaku1/circles すべて **200**。イメージは検証後クリーンアップ。
- **正規ポート**: `npm run dev` は 3000 が既定(config 未変更)。検証用の一時起動のみ 4321 を使用(3000 は Docker が占有中のため)。

## 最終到達バージョン
| 対象 | 変更前 | 変更後 |
|---|---|---|
| Node.js | 16/14/10.15.2(不整合) | **22.23.1**(統一) |
| Next.js | 10.2.3 | **15.5.20**(Pages Router) |
| React | 16.13.1 | **19.2.7** |
| Emotion | 10 | **11**(SWC + jsxImportSource) |
| Firebase(client) | 8.6.7 | **11.10.0**(compat) |
| Tailwind CSS | 2 | **4.3.3** |
| TypeScript | 3.4/4.9 | **5.9** |
| firebase-admin(scripts) | 11 | **13.10.0** |

## スコープ外(将来の follow-up)に putback
- `<Link legacyBehavior>` は非推奨(将来削除)。new Link API(`<a>` 除去)への移行は別作業。
- Firebase の完全モジュラー化(compat 脱却)は別作業。
- App Router 化はスコープ外(Pages Router 維持)。
- `functions/` の Node バージョン(engines 14)は本作業の直接対象外。
- Dockerfile CMD の `-p` 重複(`next start -p $PORT -p 8080`)は動作上無害(既存)。
- 依存の脆弱性(npm audit)の積み残しは本作業で新規増加分以外は未対応。
- `marked`/`axios`/`qs`/`immer` 等の非 React ライブラリは動作維持のため最小限のまま(必要時にバージョンアップ)。

## 既知の見た目差分(許容)
- スクショ pixelmatch: 全ページ 0.02〜0.14%(AA・dev バッジ程度)。code-of-conduct のみ高さ +10px(MDX 余白の微差)。**層崩れなし**。
