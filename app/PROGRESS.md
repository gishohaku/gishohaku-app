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
