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
