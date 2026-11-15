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

## 2026-07-19 [レビュー指摘対応: npm install の ERESOLVE 解消]
- **事象**: 新規環境で `npm install`(オプション無し)が ERESOLVE で失敗。既存の `package-lock.json` は React 19 昇格前の解決(react-ga@2.7.0 = peer react ^15.6.2 || ^16.0)を保持しており、既存の `node_modules` を持つ環境では顕在化しなかった。
- **原因の内訳**:
  - `react-ga@^2.6.0`: peer が React 15/16 固定。**メンテ停止**。
  - `react-image-lightbox@^5.1.0`: peer `react ^16.x`(実機は React 19 で動作確認済 = 前回レビュー④)。
  - `react-infinite-scroller@^1.2.4`: peer が React 18 まで。React 19 未対応の宣言(実機動作は問題なし)。
- **対応**:
  - `react-ga` → **`react-ga4@^2.1.0` に置換**(GA4 対応かつ React 19 対応の後継)。`_app.tsx` の `initialize`/`pageview` を GA4 API に更新(`ReactGA.send({ hitType: 'pageview', page })`)。
  - `react-image-lightbox` / `react-infinite-scroller` は npm `overrides` で peer(react/react-dom)を `$react`/`$react-dom` に上書き。両者とも実機で React 19 動作確認済のため実害なし。
  - **`app/Dockerfile` の `npm ci --legacy-peer-deps` → `npm ci`** に修正(`--legacy-peer-deps` は不要になった)。
  - `docs/version_up_nextjs_plan.md` のビルド手順も同期。
- **検証**:
  - `rm -rf node_modules package-lock.json && npm install`(オプション無し)成功。ERESOLVE 解消。
  - `npx tsc --noEmit` 成功。
  - `API_KEY=dummy PROJECT_ID=dummy npm run build` 成功。First Load JS shared 304kB(既存基準内)。
- **既知の注意**: 現状の `TRACKING_ID` は Universal Analytics ID(`UA-129667923-2`)で、UA 自体は 2023-07 にサンセット済み。`react-ga4` への置換で**インストール・ビルドは通る**が、GA4 の計測データを送るには `G-XXXXXXX` 形式の測定 ID への差し替えが別途必要。本 PR のスコープは install 失敗の解消までとし、GA4 移行(測定 ID 更新)は follow-up とする。

## 2026-07-19 [レビュー指摘対応: 計画外の副次修正 3件の記録]
観点1(機械的変換 vs 要人間レビュー)の分類で「計画書に記載のない副次修正」として抽出された 3 件について、いずれも維持することとし、判断理由をここに残す。
- **`app/src/components/top/hero.jsx` (with → width)**: 元は React に無視される無効属性(`with="100%"`)。React 19 で不明属性の扱いが厳しくなった際にコンソール警告になる可能性があり、実害のない改善として据え置き。差戻すと無効属性の復活になるため revert しない。
- **`app/tsconfig.json` (`incremental: true` 追加)**: 2 回目以降の `next build` / `tsc --noEmit` を高速化する一般的設定。生成される `*.tsbuildinfo` は `.gitignore` で除外済み(b9e9fd2)。ビルド出力への影響なし。
- **`app/docs/remove_sancho_plan_progress.md` (新規)**: 本バージョンアップ着手前に sancho 依存の削除ベースラインを整えた実作業の記録。Next 10→15 化のスタート地点(react 16.13.1 でグリーンビルド)を作るために不可欠だった作業のため、経緯として同梱。

## 2026-07-19 [レビュー指摘対応: 未使用スクリプトの削除と Docker イメージ最適化]
- **`scripts/addCache.ts` 削除**: 2019-07 の一括投入コミット(`ee80240`)以降 7 年間変更なし・参照ゼロ・ハードコードされた 1 ファイル分の `cacheControl` メタデータ更新用途のみの使い捨てスクリプト。ルート `package.json` に `firebase` が宣言されていない幽霊依存状態でもあった。React 19 化とは無関係の掃除だが、レビュー観点3(#1)で「firebase v11 化により実行時に壊れる可能性」として指摘されたため、実行実績・計画の両面から**削除**が最も安全と判断。
- **`app/.dockerignore` 新設 + Dockerfile の `.next/cache` 除去**: `COPY . .` 前にローカルの `node_modules` / `.next` / `.git` / `.env*` / `docs` / `PROGRESS.md` などをコンテキストから除外(ビルドコンテキスト削減)。また `next build` 直後に `rm -rf .next/cache`(Next 15 で 103MB)を追加して Cloud Run イメージから不要キャッシュを排除。Next 10 → 15 でキャッシュサイズが約 1.75 倍(59MB→103MB)に拡大していたため、既存の設定不備が Next 15 化で相対的に効いてくる状況を解消。

## 2026-07-28 [Issue #261 対応: engines の Node バージョン上限固定]
- **背景**: Issue #261(サプライチェーン対策)より。allow-scripts 見送り時の派生提案。
- **対応**: `app/package.json` の `engines.node` を `">=22"` → `">=22 <23"` に変更。Node の予期せぬメジャー上げ(Node 23/24 等)で `lightningcss` / `sharp` 等の native binary が壊れる事故を防ぐ。`.node-version` / `.nvmrc` (22.23.1) / `Dockerfile` (`node:22-alpine`) と整合。
- **検証**: `npm install` 成功、`npx tsc --noEmit` グリーン、`API_KEY=dummy PROJECT_ID=dummy npm run build` 成功。
- **`.npmrc` の `min-release-age` について**: Issue #261 のもう一つの提案(公開後 N 日未満のパッケージをブロック)は**現時点の npm には未実装**と判明したため本 PR では見送り。検証結果:
  - npm 11.3(現行) / 11.5.2 / 11.11.0 / 11.18.0 で試験
  - `min-release-age=<数値>` は `Unknown project config` 警告
  - `min-release-age=7d` / `1s` などの期間文字列は内部で `before` config にマップされ「valid Date string を指定せよ」というエラー
  - `before=<日付>` の別機能はあるが、これは「特定日時より前のリリースを install」する用途で「N日待つ」とは意味が異なる
  - つまり pnpm の `minimum-release-age` / yarn 4 相当の機能は npm には未搭載
  - 実装状況の再確認は Issue #261 に findings をコメントし、将来 npm に機能追加された時点で follow-up として再検討

---

# Next.js 15 → 16 バージョンアップ作業（2026-11-15 開始）

計画書: [`docs/version_up_nextjs_16_plan.md`](./docs/version_up_nextjs_16_plan.md)
作業ブランチ: `feature/upgrade-next-js-ver-16`

## 2026-11-15 [フェーズ1] 準備・ベースライン取得
- **やったこと**: 計画書の作成、`.gitignore` に `app/.nextjs-16-migration` を追加、現行バージョン実測、`legacyBehavior` 使用箇所の再生成、Next 15 ベースラインビルド取得
- **開始時点の環境**:
  - ブランチ: `feature/upgrade-next-js-ver-16`（clean）
  - Node: v22.23.5（nvm で切り替え。シェル初期状態は v16.17.1 だったため `nvm use 22.23.5` を明示）
  - npm: v10.9.9
- **現行バージョン実測（`app/package-lock.json`）**:
  | 対象 | バージョン |
  |---|---|
  | next | 15.5.28 |
  | react / react-dom | 19.2.7 |
  | @next/mdx | 15.5.20 |
  | @mdx-js/react / @mdx-js/loader | 3.1.1 |
  | remark-gfm | 4.0.1 |
  | firebase | 11.10.0 |
  | tailwindcss | 4.3.3 |
  | typescript | 5.9.3 |
- **`legacyBehavior` 使用箇所一覧（計 45 件 / 15 ファイル）**:
  - `app/src/withUser.tsx:26`
  - `app/src/components/top/hero.jsx:133,178`
  - `app/src/components/CircleDetail.tsx:105,214`
  - `app/src/components/CircleCell.tsx:56`
  - `app/src/components/BottomBar.tsx:76,82,88,94`
  - `app/src/components/StarTab.tsx:40,45`
  - `app/src/components/Layout.tsx:101`
  - `app/src/components/Header.tsx:122,155,167,177,187,198`
  - `app/src/components/BookCell.tsx:154,220,241`
  - `app/src/containers/BookList.tsx:47,140`
  - `app/src/containers/Mypage.tsx:33,42,52`
  - `app/src/containers/CircleMypage.tsx:94`
  - `app/src/pages/archive/index.tsx:32,41,50,59,68,77,86,95,108,125,134`
  - `app/src/pages/sign_in.tsx:98,162,167`
  - `app/src/pages/sign_up.tsx:110,168,173`
  - **計画との差分なし**（計画書の「約 15 ファイル」と一致）。
- **`next/image` 使用箇所**: `app/src/pages/gishohaku5/index.tsx:3` のみ（1 ファイル、`width`/`height`/`src`/`alt` のみ）。計画書通り。
- **ベースラインビルド（Next 15.5.28）**:
  - コマンド: `API_KEY=dummy PROJECT_ID=dummy npm run build`
  - 結果: 成功
  - `.next` サイズ: **114MB**（うち `.next/static` 2.2MB、`.next/server` 2.8MB）
  - **First Load JS shared: 304 kB**（`framework` 59.7kB / `main` 37.1kB / `_app` 200kB / その他 7.23kB）
  - 判定: フェーズ6 のバンドルサイズ比較基準として採用。
- **スクリーンショット・console 警告ベースライン**: Playwright が未導入・既存の capture スクリプトも無いため、フェーズ2 入りの直前にセットアップしてから before 取得を行う（before/after の時間差を小さくするため）。計画書フェーズ1 のうちこの 2 項目のみ**次フェーズ冒頭に繰り越し**。
- **判断・メモ**:
  - 計画書フェーズ1 の「現行バージョン実測」「影響箇所の再生成」「ビルドベースライン」「`.gitignore` 追加」は完了。
  - Playwright 系作業は別途ユーザー確認を経て進める想定。
- **次のアクション**: フェーズ1 のコミット（PROGRESS・`.gitignore`）→ Playwright セットアップ方針のユーザー確認 → フェーズ2（`legacyBehavior` 全件除去）。

## 2026-11-15 [フェーズ1 追補] Playwright セットアップと before スクリーンショット取得
- **やったこと**: ユーザー判断（フル機械比較を採用）を受けて、Playwright + pixelmatch のセットアップ、before スクリーンショット取得、self-diff ノイズ基準の確認、dev console 警告のベースライン記録。
- **セットアップ**:
  - 配置: `app/.nextjs-16-migration/tools/`（`.gitignore` 配下、ephemeral）。app/ の `devDependencies` を汚さず分離。
  - 依存: `playwright@1.56.1` / `pixelmatch@5.3.0` / `pngjs@7.0.0`（`npm install --no-save`）。
  - ブラウザ: `npx playwright install chromium`（Chromium Headless Shell 159.0.8154.6、約 100MB）。Firefox/WebKit は入れない。
  - スクリプト:
    - `capture.mjs`: 9 ページ × desktop(1280x800)/mobile(375x812) の 2 viewport で fullPage 取得
    - `compare.mjs`: pixelmatch で機械比較、threshold=0.1、サイズ違い/欠損も判定、diff PNG を `_diff/` へ保存
- **取得対象**（認証不要ページ 9 件 × 2 viewport = **18 枚**）:
  - `/`, `/sign_in`, `/sign_up`, `/reset_password`, `/archive`, `/gishohaku1/circles`, `/gishohaku1/books`, `/code-of-conduct`, `/harassment-case-study`
  - 認証必須ページ（mypage 系）・サークル編集系はユーザー手動確認に委ねる。
- **self-diff 結果**: Next 15 のまま 2 回続けて capture して pixelmatch 比較 → **18/18 完全一致（non-OK 0）**。ノイズ 0 のクリーンなベースライン。以降の after 取得で検出される差分は実変更と判定できる。
- **dev console 警告ベースライン**（`API_KEY=dummy PROJECT_ID=dummy npm run dev`）:
  - 📌 **`legacyBehavior` is deprecated**: Next 15 時点で既に deprecation 警告が多数出ている。**これはフェーズ2 で全件除去する対象**。警告ゼロが after の判定基準になる。
  - 📌 Firestore `PERMISSION_DENIED` (code=7): ダミー PROJECT_ID で API 未有効のため発生。**既存の運用上想定内**で Next 16 とは無関係。after でも同じ警告が出るのは許容。
  - その他の新規警告・エラーなし。
- **ベースライン保存先**: `app/.nextjs-16-migration/before/`（gitignore 下）。消さないよう注意。
- **判断・メモ**:
  - Playwright 系ファイル（`tools/`, `before/`）はすべて gitignore 配下のため、コミット対象には含めない。将来再現する際は本 PROGRESS のセットアップ手順をたどる形でよい。
  - `--no-save` 指定で tools/package.json に依存は書かれないが、必要になれば個別インストールで復元できる（最小構成を優先）。
- **次のアクション**: **フェーズ2（`next/link` の `legacyBehavior` 全件除去）に着手**。Next 15 のまま先行実施。

## 2026-11-15 [フェーズ2] `next/link` の `legacyBehavior` 全件除去（Next 15 のまま先行実施）
- **やったこと**: 公式 codemod で機械置換 + bail-out 箇所を手動修正。Next 15 のままで型・ビルド・pixelmatch を検証。
- **codemod 実行**: `npx @next/codemod@latest new-link ./src`
  - 結果: 15 ファイル修正、0 エラー、0 skipped
  - **bail-out**: 8 箇所で `@next-codemod-error` コメントを挿入（子要素が `<a>` かどうか判定できなかったため）
- **手動修正方針**（bail-out 8 箇所の分類と対応）:
  | 件数 | パターン | 対応 |
  |---|---|---|
  | 3 | `styled.a` 子コンポーネント（`NewBookButton`/`CircleLink`/`BookLink`）| `styled.a` → `styled.div` に変更。外側 Link が `<a>` を生成するため入れ子アンカー回避。各コンポーネントは Link 内でのみ使われていることを grep で確認済 |
  | 3 | `<Button component="a">` （`withUser.tsx` / `sign_in.tsx` / `sign_up.tsx`）| `component="span"` に変更。外側 Link が `<a>` を生成 |
  | 2 | `styled.div` 子コンポーネント（`StarTab.tsx` の `Item`）| 変更不要。`@next-codemod-error` コメントのみ削除 |
- **検証**:
  - `grep -rn "legacyBehavior" app/src` → 0 件
  - `grep -rn "@next-codemod-error" app/src` → 0 件
  - `npx tsc --noEmit` → エラー 0
  - `API_KEY=dummy PROJECT_ID=dummy npm run build` → 成功、**First Load JS shared 304 kB（ベースラインと同値）**、`_app` チャンクが 11150898→3fd09aa9 にハッシュ変化（内容差分あり）、`reset_password` 312→311kB、`sign_up` 1.7→1.68kB（微減）
  - **pixelmatch 比較（before vs after-link-migration）: 18/18 完全一致**。視覚的回帰ゼロ
  - **dev console の `legacyBehavior` deprecation 警告: 多数 → 0** に解消
  - Firestore `PERMISSION_DENIED`（想定内のダミー ID 由来）は before と同数の 5 件、新規 warn/error なし
- **変更統計**: 15 ファイル / +376 / -377 行
- **判断・メモ**:
  - `styled.a → styled.div` は Link の内部に閉じたコンポーネントなので影響なし。もし今後 Link 外で単独の `<a>` として使う必要が出た場合は再設計が必要（コメントは付けず、必要になった時点で判断）。
  - `Button component="span"` も見た目同一。Button 内部ロジックは `component || 'div'` のフォールバックのため span でも問題ない。
  - このフェーズを Next 15 のまま済ませたことで、Next 16 引き上げ時にリンクまわりの切り分けができる状態になった。
- **次のアクション**: フェーズ2 コミット → フェーズ3（Next.js 16 本体の引き上げ）。

## 2026-11-15 [フェーズ3] Next.js 16 本体引き上げ
- **やったこと**: `@next/codemod upgrade latest` で next / @next/mdx / react を 16/19.3 に bump。Turbopack 下で `@next/mdx` の `remarkPlugins`（async import の remark-gfm）が serializable でないビルドエラーが出たため、webpack 退避方針で確定。
- **バージョン変化**:
  | 対象 | 旧 | 新 |
  |---|---|---|
  | next | 15.5.28 | **16.4.6** |
  | @next/mdx | 15.5.20 | **16.4.6** |
  | react / react-dom | 19.2.7 | 19.3.1 |
  | @types/react / @types/react-dom | ^19.2.0 | 19.3.0 (package.json `overrides` にも固定) |
  | tsconfig `jsx` | `preserve` | **`react-jsx`**（Next 16 が自動書換） |
  | tsconfig `moduleResolution` | `node` | **`bundler`**（Next 16 が自動書換） |
  | next-env.d.ts | `routes.d.ts` 参照 | `.next/dev/types/{routes,root-params}.d.ts` を import（Next 16 が自動書換） |
- **破壊的変更に遭遇した点**:
  - 🔴 **Turbopack がビルドでもデフォルト化** → `@next/mdx` loader の `options` （非シリアライズな関数を含む `remarkPlugins`）で Rust 側のシリアライズに失敗。公式メッセージ: `Error: loader @next/mdx/mdx-js-loader.js for match "{*,next-mdx-rule}" does not have serializable options. Ensure that options passed are plain JavaScript objects and values.`
  - 📘 判断: 計画書フェーズ3 の第一候補（**`--webpack` 退避**）を採用。`package.json` の scripts を `next dev --webpack` / `next build --webpack` に変更。`next.config.js` の `webpack(config)` カスタム（画像 import を URL 文字列化する `asset/resource` ルール）もそのまま維持できる。
  - 📘 Turbopack 完全対応は putback: `@next/mdx` の remarkPlugins を Turbopack で動かすには Rust 製 remark プラグインか別経路が必要。GFM 表の描画互換性を優先し、webpack で据え置く。将来 `@next/mdx` が Turbopack 向けの serializable 構成を提供したら再検討。
- **その他 Next 16 由来の自動追加**:
  - `app/AGENTS.md` を Next 16 の `next dev` が自動生成（node_modules 側のドキュメント参照を促す agent 向け注意書き）。削除しても再生成されるため**コミット対象に含める**。
- **検証結果**:
  - `npx tsc --noEmit` → エラー 0
  - `API_KEY=dummy PROJECT_ID=dummy npm run build`（= `next build --webpack`） → `✓ Compiled successfully in 5.8s`。全ルート生成完了。`.next` サイズ **121MB**（Next 15 の 114MB → +7MB、約 +6%。Next 16 で dev types 等が増えたため）。
    - ⚠️ 補足: Next 16 のビルド出力は各ルートの kB/First Load JS を表示しなくなった（フォーマット変更）。詳細な First Load JS 計測が必要なら `--analyze` 併用が別途必要。本フェーズは成功判定のみ採用。
  - `npm run dev` で全ページ 200 OK を返す
  - **pixelmatch 比較（before[Next15] vs after-next16）: 18/18 完全一致**。desktop + mobile 全ページで視覚的回帰ゼロ
  - dev console の `legacyBehavior` 警告: 引き続き 0
  - 📘 **Next 16 の新機能で `[browser]` プレフィックス付き browser console 転送**が有効化され、既存の Formik `<Formik render>` deprecation 警告がサーバーログに可視化。これは **既存の Formik 側の積み残し**で Next 16 の回帰ではない（Next 15 時点から browser 側で出ていた）。本作業スコープ外として putback。
- **判断・メモ**:
  - 計画書との差分: `@next/mdx` は stable 16.4.6 が出ていたため「canary 採用の判断」は不要だった。計画書フェーズ3 の 1-1 節 C は解消。
  - tsconfig 変更は Next 16 の推奨で、Emotion の jsx pragma 記述を持つファイルは pragma が tsconfig より優先されるため影響なし（ビルドで実証）。
  - `next-env.d.ts` の変更は自動生成ファイル。手を入れる必要なし。
  - `--webpack` 退避により Cloud Build 経路（`Dockerfile` が `npm run build` を叩く）も自動的に webpack で動く。Dockerfile 側の変更は不要。
- **次のアクション**: フェーズ3 コミット → フェーズ4（周辺追随・微調整）→ フェーズ5（scripts 動作確認）→ フェーズ6（総合検証）→ フェーズ7（README 更新・完了報告）。

## 2026-11-15 [フェーズ4・5・6・7] 周辺追随／scripts 確認／総合検証／README 更新
短時間で実施できる最終 4 フェーズをまとめて実施した。

### フェーズ4: 周辺追随・微調整
- Next 16 本体引き上げ時点で、tsconfig.json / next-env.d.ts は Next 16 が自動書換済（jsx: react-jsx / moduleResolution: bundler）。追加対応不要。
- `next.config.js` の `images.disableStaticImages: true` / `webpack(config)` は Next 16 webpack モードで引き続き動作（ビルドで実証済）。据え置き。
- `@next/mdx` は 16.4.6（stable）が存在したため計画書のリスク C（canary 採用）は不要だった。既に 16.4.6 に bump 済。
- **npm audit**: 9 vulnerabilities (2 moderate, 7 high)。内訳:
  - `nanoid` (high): custom generators infinite loop → Firebase 推移的依存
  - `qs` 2.2.5–6.16.0 (moderate): array-limit bypass / DoS 他 → 本アプリ直接依存
  - いずれも **Next 16 化で新規発生したものではなく既存の積み残し**。計画書ルール「新規高リスクのみ対応、既存は広げない」により**スコープ外 putback**。
- 追加の変更なし。
- **判断**: フェーズ4 は実質「既に自動対応済みを確認したのみ」。コミット対象の変更は発生しない。

### フェーズ5: scripts 動作確認
- **import 解決確認**: `scripts/*.ts` が参照する `../app/src/utils/circle.ts` は純粋な型/定数モジュール（Next / React / Firebase client に非依存）。tsx 経由で import 可能であることを `npx tsx -e "import('./app/src/utils/circle.ts')..."` で確認 → `OK: imported keys: [ 'default' ]`。
- **ドライラン実行**: `npx tsx scripts/20260428-createCircles.ts` を実行 → `[DRY-RUN] Firestore へは書き込みません...` ログ出力後、CSV 未配置で ENOENT 終了。期待通りの挙動（**Next 16 の破壊的変更は scripts 側に波及していない**）。
- 7 ファイルの `*-createCircles.ts`（2019〜2026）が `../app/src/utils/circle` を import しているが、circle.ts が純粋モジュールのため全て影響なし。

### フェーズ6: 総合検証
- **dev**: `npm run dev` で 9 ページすべて 200 OK。
- **build**: `npm run build`（= `next build --webpack`）成功。`.next` 114MB → **121MB**（+7MB, +6%。Next 16 で dev types 等が増加）。
  - ⚠️ Next 16 webpack モードは各ルートの kB を表示しなくなった。First Load JS の数値比較は不可。必要なら `--analyze` 併用が別途必要（putback）。
- **pixelmatch 最終（before[Next15] vs after-final[Next16]）: 18/18 完全一致**。desktop + mobile 全ページで視覚的回帰ゼロ。
- **Docker build**: `docker build --build-arg project_id=dummy --build-arg api_key=dummy -t gishohaku-app-next16-local .` を実行 → 成功（build step 24.7s、exporting 3.7s）。`SecretsUsedInArgOrEnv` 警告は Next 16 前からの既存事項。イメージはテスト後に削除。
- **デプロイ経路の机上レビュー**:
  - `cloudbuild.yaml`: Docker build → push → Cloud Run deploy → Firebase Hosting deploy の手順に変更なし。Dockerfile の Node 22.23.5-alpine も据え置き。
  - `firebase.json`: rewrites（`**` → Cloud Run `gishohaku-app`）・redirects（`/books`→`/gishohaku1/books` 等）・headers（CSP / `_next/static/**` cache）に変更不要。Next 16 の `_next/static/<buildId>/` 構造は Next 15 と同一（buildId ハッシュのみ変動）で、CSP に新規の inline script ハッシュ要求も発生していない。
- **console 比較**: フェーズ2 で `legacyBehavior` 警告ゼロを達成し、Next 16 でもゼロ維持。Firestore `PERMISSION_DENIED` は同数（ダミー PROJECT_ID 由来、想定内）。新規の Formik `<Formik render>` deprecation は **Next 16 の browser log 転送機能で可視化されただけで回帰ではない**（Formik 側の積み残し、スコープ外 putback）。
- **手動確認の委ね**: 認証必須ページ（mypage 系 / サークル編集系）・モバイル実機確認はユーザーに委ねる。

### フェーズ7: README 更新
- `README.md` の「環境」表 Next.js 行を 15 系 → **16 系（Pages Router / webpack ビルド）** に更新。
- バージョンアップの経緯・方針リンクに `app/docs/version_up_nextjs_16_plan.md` を追加。
- 主なスクリプト表の `npm run dev` / `npm run build` を **`next dev --webpack` / `next build --webpack`** に更新し、Turbopack デフォルト化と webpack 固定の理由を注記。
- Node.js / Dockerfile / `.node-version` / engines は変更なし（Next 16 の engines `>=20.9.0` を 22.23.5 が充足）。
- `scripts/` 節は変更なし。

### 最終サマリ
| 項目 | Before | After | 変化 |
|---|---|---|---|
| Next.js | 15.5.28 | **16.4.6** | +1 major |
| @next/mdx | 15.5.20 | 16.4.6 | 追随 |
| React / React-DOM | 19.2.7 | 19.3.1 | patch |
| @types/react | ^19.2 | 19.3.0（overrides で固定） | — |
| tsconfig jsx | preserve | react-jsx | Next 16 自動 |
| tsconfig moduleResolution | node | bundler | Next 16 自動 |
| `next/link` `legacyBehavior` | 45 件 / 15 ファイル | **0 件** | 全件除去 |
| ビルドツール | （Next 15 デフォルト = webpack） | **webpack 固定**（`--webpack` 明示） | Turbopack デフォルト化を退避 |
| pixelmatch | ベースライン | **18/18 完全一致** | 視覚的回帰ゼロ |
| `.next` サイズ | 114MB | 121MB | +7MB (+6%) |
| Node.js | 22.23.5 | 22.23.5 | 据え置き |

**計画との差分（putback）**:
- Turbopack 完全対応（`@next/mdx` の serializable 対応待ち）
- `npm audit` の既存 9 件（nanoid / qs。Next 16 新規発生ではない）
- First Load JS の数値比較（Next 16 の webpack 出力が kB を表示しなくなった。`--analyze` 併用は別課題）
- Formik `<Formik render>` deprecation（Next 16 の browser log 転送で可視化されただけ。既存の Formik 側積み残し）

**完了条件の充足**:
1. ✅ `npm run dev` で主要ページ表示
2. ✅ `npm run build` 成功
3. ✅ pixelmatch 崩れゼロ
4. ✅ `cloudbuild.yaml` / `firebase.json` / `Dockerfile` 変更最小（scripts に `--webpack` 追加のみ、Dockerfile は無変更）
5. ✅ scripts の import 解決・DryRun 到達
6. ✅ `README.md` 更新
7. ✅ PROGRESS に全ログ

**手動確認を要する項目**（ユーザー実施推奨）:
- ログイン後のサークル向けページ閲覧（実認証が必要）
- スマートフォン実機での表示（Playwright mobile viewport では崩れゼロ確認済）
- 実環境でのデプロイ試行（本作業はローカル Docker build 成功まで。実デプロイはユーザー判断）

本作業ブランチ: `feature/upgrade-next-js-ver-16`
コミット履歴: `1f9cd34`（計画書+ベースライン）→ `612c947`（Playwright）→ `2d22331`（legacyBehavior 除去）→ `ee18689`（Next 16 bump）→ 本コミット（フェーズ4-7）

## 2026-11-15 [追補] Turbopack 退避の putback を解消（@next/mdx 文字列指定 + 画像 StaticImageData 移行）
ユーザー要望により、フェーズ3 で putback した「Turbopack デフォルト化で @next/mdx の serializable エラー」の恒久対応を実施。参考リンク: https://nextjsjp.org/docs/app/guides/mdx / https://suekichi-system.com/blog/nextjs-static-export-mdx-blog

### 対応内容
- **`@next/mdx` の remark プラグインを文字列指定に**
  - `next.config.js`: `remarkPlugins: [remarkGfm]`（関数参照、async dynamic import）→ `remarkPlugins: ['remark-gfm']`（文字列）
  - async wrapper（`module.exports = async () => { ... }`）も不要になり、同期的な通常 config に戻す
  - Turbopack は Rust 側でプラグインを解決するため関数参照を渡せず、文字列名で指定する必要がある
- **画像 import を StaticImageData に移行**
  - Turbopack は `images.disableStaticImages: true` も `webpack(config)` の `asset/resource` ルールも無視する → 画像 import が常に `StaticImageData` オブジェクト (`{src, width, height}`) を返す
  - その結果、既存の `<img src={logo}>` が `src="[object Object]"` にレンダリングされ画像表示が壊れていた（Turbopack 切替時の pixelmatch で初回検出: 18/18 すべてに 0.02〜0.78% の差分）
  - `.nextjs-16-migration/tools/migrate-image-src.mjs` を作成して **19 ファイル** を機械置換:
    - `src={<name>}` → `src={<name>.src}`
    - `|| <name>`（ImageBox の fallback URL）→ `|| <name>.src`
  - 置換対象: `defaultImage` / `placeIcon` / `directionsIcon` / `logo` / `circleTumbnail` / `editIcon` / `book` / `groupWork` / `home` / `person` / `check`
- **`next.config.js` のクリーンアップ**
  - `images.disableStaticImages: true` 削除
  - `webpack(config)` の `asset/resource` カスタムルール削除（Turbopack が呼ばない上、Next 16 ネイティブの StaticImageData で代替済み）
  - コメントを「Turbopack 時代の画像運用」を説明する内容に更新
- **`package.json` の scripts を Next 16 デフォルトに戻す**
  - `"dev": "next dev --webpack"` → `"dev": "next dev"`
  - `"build": "next build --webpack"` → `"build": "next build"`
- **`next-env.d.ts`**: Next 16 build 実行時に `/// <reference types="next/image-types/global" />` が自動追加（StaticImageData の型解決用）

### 検証結果
- `npx tsc --noEmit` → エラー 0
- `npm run build`（= `next build`, Turbopack） → `✓ Compiled successfully in 3.6s`。警告・エラーなし
  - **`.next` サイズ: 121MB (webpack) → 52MB (Turbopack)** = 43%・約 **-57%**
  - ビルド時間: 5.8s → 3.0〜3.6s（約 -40%）
- `npm run dev`（= `next dev`, Turbopack）で全ページ 200 OK
- `curl http://localhost:3000/` の HTML 内に `[object Object]` 残存ゼロ、画像は `/_next/static/media/<hash>.svg` など正しい URL で出力
- **pixelmatch 比較（before[Next 15] vs after-turbopack-final[Next 16 Turbopack]）: 18/18 完全一致**。desktop + mobile 全ページで視覚的回帰ゼロ
- dev console の `legacyBehavior` 警告: 0 維持 / Firestore `PERMISSION_DENIED`: 5（ダミー ID 由来、想定内）/ Formik `<Formik render>` deprecation: 既存事項（Next 16 の browser log 転送で可視化、スコープ外）
- **Docker build** `gishohaku-app-turbo-local` も成功（Dockerfile 無変更、Cloud Build 経路に影響なし）。イメージはテスト後に削除

### 再更新
- `README.md`: 環境表の Next.js 行を「16 系（Pages Router / Turbopack）」に、scripts 表と注記を Turbopack 運用に合わせて書換
- このフェーズで putback リストから「Turbopack 完全対応」を除外

### 残っている putback（本作業スコープ外）
- 既存の `npm audit` 9件（nanoid / qs。Next 16 新規発生ではない）
- First Load JS の数値比較（Next 16 build 出力が kB 非表示化、`--analyze` 併用は別課題）
- Formik `<Formik render>` deprecation（Next 16 の browser log 転送で可視化されただけ。Formik 側の積み残し）

### 最終コミット履歴
`1f9cd34`（計画+ベースライン）→ `612c947`（Playwright）→ `2d22331`（legacyBehavior 除去）→ `ee18689`（Next 16 bump, webpack 退避）→ `a98e517`（フェーズ4-7 + README）→ 本コミット（Turbopack 完全対応）
