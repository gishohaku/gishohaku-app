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
