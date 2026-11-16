# Next.js 15 → 16 バージョンアップ作業計画

技書博アプリ（`app/`）の Next.js を 15 系から 16 系（調査時点の最新: 16.4.6）へ引き上げるための作業計画。
先行事例 [`version_up_nextjs_plan.md`](./version_up_nextjs_plan.md)（10→15 の大規模アップグレード）の運用ルール（段階実行／PROGRESS 記録／ベースライン計測／pixelmatch 比較／エラー試行 3 回上限）を踏襲する。

> **性質**: 10→15 とは異なり、本作業は **1 major の引き上げ** で済むためスコープはかなり小さい。ただし `next/link` の `legacyBehavior` 削除が広範囲に影響するため、「全件機械置換 → 全ページ表示確認」を最大チェックポイントに置く。

---

## 0. 前提

### 現行バージョン（`app/package-lock.json` 実測）

| 対象 | 現行 | 目標 |
|---|---|---|
| Next.js | 15.5.28 | **16.4.6**（または作業開始時点の最新 stable） |
| React / ReactDOM | 19.2.7 | **据え置き**（Next 16 は React 19 必須、現行で充足） |
| @next/mdx | 15.5.20 | **Next に追随**（16 stable 未出時は 15 系据え置きで動作可否を検証） |
| @mdx-js/react | 3.1.1 | 据え置き |
| remark-gfm | 4.0.1 | 据え置き |
| firebase (client) | 11.10.0 | 据え置き |
| tailwindcss | 4.3.3 | 据え置き |
| typescript | 5.9.3 | 据え置き |
| Node.js | 22.23.5 | **据え置き**（Next 16 engines: `>=20.9.0` を充足） |

### スコープ

- **対象**: `app/`（Next.js 本体）と、連動する `README.md`・`app/Dockerfile`（Node 版は現状維持想定だが変更があれば整合）・`app/next.config.js`・`cloudbuild.yaml`・ルート `scripts/`（実行継続性の確認）。
- **Router 方針**: **Pages Router を維持する**。App Router への移行はスコープ外。Next 16 でも Pages Router は完全サポートされている（主要開発は App Router 中心だが Pages Router は legacy として継続）。
- **見た目の維持が最優先**。機能追加・デザイン変更・リファクタリングは行わない。
- **本番デプロイは本作業に含めない**。Docker ビルド成功とデプロイ経路の机上確認までを完了条件とする。

### ブランチ

- 作業ブランチ: `feature/upgrade-next-js-ver-16`（本ブランチ上で作業）。
- 各フェーズ完了時に小さくコミットする。壊れたら直前の checkpoint に戻せる粒度を優先する。

### 実行ルール（10→15 計画から踏襲）

- ビルド検証は `app/Dockerfile` と同条件で行う（`npm ci` → `API_KEY=dummy PROJECT_ID=dummy npm run build`）。Firebase はビルド時に値を検証しないため **ダミー値で通ることが前提**。通らなくなったらユーザーに実値を依頼する。
- `npm run dev` で `http://localhost:3000` が表示されることを各フェーズの受け入れ基準に含める。
- **ひとつのエラーに対する解決の試行は 3 回まで**。3 回で解決できなければ、エラーメッセージ全文・試した対処と結果・現時点の仮説・人間に判断してほしいことを `app/PROGRESS.md` にまとめて中断・報告する。
- **すべての作業・判断を `app/PROGRESS.md` に随時追記する**。中断・再開時はまず PROGRESS を読む。

---

## 1. Next.js 16 の破壊的変更と本プロジェクトへの影響（調査結果）

> 各項目の実コード側検出コマンドを併記する。**計画中の数値（「15 ファイル」等）は調査時点のスナップショット**であり、各フェーズ冒頭で再生成して正とする。

### 1-1. 影響あり（本プロジェクトで対応が必要）

| # | 変更点 | 影響箇所 | 対応方針 |
|---|---|---|---|
| A | **`next/link` の `legacyBehavior` 削除** | `legacyBehavior` を使用中の箇所。検出: `grep -rln "legacyBehavior" src` → 現状 **約 15 ファイル**（調査時点。再検証コマンド: 下記） | `<Link legacyBehavior href=... passHref><a>...</a></Link>` → `<Link href=...>...</Link>` へ全件機械置換。内部の `<a>` タグは削除し、スタイルは Link 要素へ引き継ぐ。`passHref` も不要に。**最大の変更点**。 |
| B | **Turbopack が `next dev` のデフォルト化** | `next.config.js` の `webpack(config)` カスタムで `asset/resource` ルールを追加している（画像 import を URL 文字列として解決） | Turbopack は `webpack()` フックを認識しない。選択肢は次の 2 つ: (B-1) `next dev --webpack` で明示的に webpack を使う（1 コマンド追加のみで済む最小案）、(B-2) Turbopack 対応設定（`turbopack.rules`）へ移植。**(B-1) を第一候補**とし、実運用で挙動差が出なければそのまま。 |
| C | **`@next/mdx` の追随可否** | 現状 `@next/mdx` 15.5.20。npm 上の 16 系は canary のみ（stable 未リリースの可能性） | (C-1) 15 系を据え置いたまま Next 16 で動くか検証を先行。動けば据え置き。(C-2) 動かなければ canary 採用の可否をユーザーに判断依頼。**代替案**: canary を避けるなら Next を 16 の初期パッチで止めて `@next/mdx` stable を待つ。 |
| D | **`next/image` の挙動変更（`qualities` デフォルト絞り込み等）** | `src/pages/gishohaku5/index.tsx` の 1 箇所のみ（`width`/`height`/`src`/`alt` のみ使用。deprecated props なし） | 影響軽微。dev / build で警告が出れば個別対応。 |
| E | **`images.domains` deprecated → `remotePatterns` 推奨** | `app/next.config.js` の `images.disableStaticImages: true` のみ（外部ドメイン設定なし） | **対応不要**（外部画像ドメイン未使用）。 |

**再検証コマンド（フェーズ 2 冒頭で実行し、PROGRESS に実測値を記録）**:
```shell
# legacyBehavior 使用箇所
grep -rln "legacyBehavior" app/src
grep -rn  "legacyBehavior" app/src | wc -l

# next/link 使用全体
grep -rln "from 'next/link'" app/src

# next/image 使用
grep -rn "from 'next/image'" app/src
```

### 1-2. 影響なし（本プロジェクトでは使用していない）

以下は Next 16 で変更があるが、本プロジェクトは未使用のため対応不要。PROGRESS には「使用していないことを確認済み」とだけ記録する。

- **App Router 関連**（async request APIs の default 化、`revalidateTag` 挙動変更等）: 本プロジェクトは Pages Router 専用。`src/pages/` のみ。
- **AMP 削除**: `useAmp` / `amp:` 設定とも未使用。
- **`next lint` 削除**: `app/package.json` に `lint` script 定義なし。
- **`next/font` / `next/script`**: 未使用（grep で 0 件）。
- **`next/dynamic` の `noSSR` → `ssr: false`**: `next/dynamic` 自体を未使用（grep で 0 件）。
- **Node 最低ライン `>=20.9.0`**: 現行 22.23.5 で充足。
- **React 19 必須**: 現行 19.2.7 で充足。
- **`getInitialProps` / `getServerSideProps` / `getStaticProps`**: Pages Router の API は Next 16 でも継続動作。`_app.tsx` / `BookList` / `CircleList` / `BookPage` / `CirclePage` で使用中だが変更不要。

---

## 2. フェーズ分解

### フェーズ 1: 準備・ベースライン取得

- [ ] `app/PROGRESS.md` の末尾に本作業の節を追加し、開始日時・ブランチ名・開始時点の各バージョンを記録する。
- [ ] **現行バージョン実測**: 上記 0 節の「現行」列を `node -e "..."` で lockfile から再確認し、差異があれば PROGRESS に記録。
- [ ] **影響箇所の再生成**: 1-1 節の検出コマンドを実行し、`legacyBehavior` 使用箇所の実ファイル・行番号一覧を PROGRESS に貼り付ける。
- [ ] **ベースライン取得**:
  - `cd app && npm ci && API_KEY=dummy PROJECT_ID=dummy npm run build` が **現行（Next 15）で通る**ことを確認し、`.next` サイズ・First Load JS を記録。
  - `npm run dev` で主要ページ（`/` `/sign_in` `/gishohaku1/circles` `/gishohaku1/books` `/code-of-conduct` 等）を開き、console 警告のベースラインを記録。
- [ ] **before スクリーンショット取得**（Playwright, 1280x800 固定・fullPage、after と同一条件）。保存先: `app/.nextjs-16-migration/before/`（`.gitignore` に追加し**コミットしない**）。対象:
  | URL | 確認対象 |
  |---|---|
  | `/` | トップ（Hero, Header, 各 section） |
  | `/sign_in` `/sign_up` `/reset_password` | フォーム |
  | `/archive` | リスト |
  | `/gishohaku1/circles` | サークル一覧 |
  | `/gishohaku1/books` | 書籍一覧 |
  | `/code-of-conduct` | MDX ページ |
- [ ] フェーズ 1 完了時点でコミット（PROGRESS・`.gitignore` のみ。コードは未変更）。

### フェーズ 2: `next/link` の `legacyBehavior` 全件除去（Next 15 のまま先行実施）

**目的**: Next 16 への切り替え前に、最大の破壊点である `legacyBehavior` 依存を**先に**取り除く。Next 15 でも新形式（`<Link href>`）で動作するため、Next バージョンを上げずに検証できる。段階が独立するので切り分けやすい。

- [ ] 1-1 節 A の検出コマンドで実ファイル一覧を再生成。
- [ ] 各ファイルで以下のパターンを機械置換:
  - `<Link legacyBehavior href={...} passHref><a className=... onClick=...>children</a></Link>`
  - → `<Link href={...} className=... onClick=...>children</Link>`
  - `<a>` が CSS-in-JS の `css` prop / Emotion styled を担っている場合は、Link コンポーネントへそのまま移動（Next 13+ の新 Link は内部で `<a>` を生成するため、Link に渡した props は `<a>` に適用される）。
- [ ] 置換ごとに grep 残 0 件を確認（`grep -rn "legacyBehavior" app/src` が空になること）。
- [ ] `npm run build` → `npm run dev` で主要ページ表示確認。
- [ ] **スクリーンショット比較（1 回目の本格比較）**: `app/.nextjs-16-migration/after-link-migration/` を取得し、`npx pixelmatch` で全ページ機械比較。崩れがあれば修正して再取得。
- [ ] checkpoint コミット（`chore(app): migrate next/link from legacyBehavior`）。

### フェーズ 3: Next.js 16 本体の引き上げ

- [ ] `app/package.json` の `next` / `@next/mdx` を 16 系最新 stable へ更新（公式 codemod `npx @next/codemod@canary upgrade latest` を**併用**。codemod が壊した差分は PROGRESS に記録し、必要なら手戻し）。
- [ ] `npm install` → `npm run build` を実行。
  - 1-1 節 B（Turbopack デフォルト化）対応: `package.json` の `dev` スクリプトは `next` のまま維持し、まずは **Turbopack デフォルト**で動作確認。`next.config.js` の `webpack(config)` で追加した `asset/resource` ルール（画像 import → URL 文字列）が Turbopack 下で機能しないようなら、`"dev": "next dev --webpack"` に切り替える（第一候補）。
  - 1-1 節 C（`@next/mdx`）対応: 15 系据え置きで動作すれば採用。動かなければ、(a) canary 採用の可否をユーザーに判断依頼、(b) Next 16 の初期パッチで止めて stable を待つ、を選択肢として提示。
- [ ] `npm run dev` で主要ページ表示確認。
- [ ] **スクリーンショット比較**: `app/.nextjs-16-migration/after-next16/` を取得し、フェーズ 2 の after と機械比較。self-diff=0 のノイズ基準を取ってから判定。
- [ ] checkpoint コミット（`build: bump next to 16.x`）。

### フェーズ 4: 周辺追随・微調整

- [ ] `@next/mdx` / `@mdx-js/*` / `remark-gfm` を Next 16 と整合するバージョンに追随（必要な場合のみ）。
- [ ] `next.config.js` の `images.disableStaticImages: true` が Next 16 で引き続き有効か確認。非推奨化されていればコメントで記録（挙動変化がなければ据え置き）。
- [ ] `tsconfig.json` の `moduleResolution` / `target` を Next 16 推奨値に合わせる必要があれば追従（Next 15 時点で `bundler` / ES2017 以上なら通常追従不要）。
- [ ] `npm audit` の結果を記録。新規に増えた高リスクのみ対応し、既存の積み残しは広げない。
- [ ] checkpoint コミット（`chore: adjust surrounding deps for next 16`）。

### フェーズ 5: scripts 実行継続性の確認

**対象**: ルート `scripts/` 配下のデータ追加スクリプト（`firebase-admin` を使用する別プロジェクト。`app/` の Next とは独立）。

- [ ] スクリプトが `../app/src/utils/circle`（または類似 util）を import している場合、Next 16 に伴う型変更で import が壊れていないかを確認する。
  - 検出: ルート `scripts/` 配下で `grep -rn "../app/src" scripts/` を実行し、該当ファイルの import 解決を確認。
- [ ] **ドライラン検証**: 代表スクリプトを DRY_RUN（デフォルト）で実行し、「import 解決 → firebase-admin 初期化 → CSV パース」までがエラーなく進むことを確認する。実書き込み・実メール送信は**行わない**（ユーザー判断）。
  ```shell
  # リポジトリルートで
  npx tsx scripts/20260428-createCircles.ts
  ```
- [ ] 問題があれば、type-only import へ切り出すなど最小対応を PROGRESS に記録しつつ修正。
- [ ] checkpoint コミット（`chore(scripts): verify compatibility with next 16`、変更があれば）。

### フェーズ 6: 総合検証

- [ ] **dev 検証**: `cd app && npm run dev` → `http://localhost:3000` が主要ページで正しく表示される（ゴールの受け入れ基準）。
- [ ] **ビルド検証**: `app/Dockerfile` と同条件（`npm ci` + `API_KEY=dummy PROJECT_ID=dummy npm run build`）が成功。Docker デーモンが起動していれば `docker build --build-arg project_id=dummy --build-arg api_key=dummy .` でも確認（未起動なら best-effort で PROGRESS に記録）。
- [ ] **スクリーンショット比較（最終）**: `app/.nextjs-16-migration/after-final/` を取得。フェーズ 1 の before と pixelmatch で全ページ機械比較。self-diff=0 のノイズ基準を確認してから、差分ページを目視判定し「意図的（許容）/ 崩れ（要修正）」を PROGRESS に記録。崩れは修正して再取得。
- [ ] **デプロイ経路の非破壊確認**（実デプロイはユーザー判断。勝手に本番へ出さない）:
  - `cloudbuild.yaml` の手順（Docker build → push → Cloud Run deploy → Firebase Hosting deploy）が本作業後も変わらないことを机上レビュー。
  - `firebase.json` の rewrites（`**` → Cloud Run `gishohaku-app`）・headers（CSP 等）は**変更しない**。Next 16 で `_next/static/**` のパスや、CSP に抵触する inline script のハッシュ要求等が出ていないかを build 出力と突合して確認。
- [ ] **バンドルサイズ比較**: `.next` サイズと First Load JS をフェーズ 1 ベースラインと比較して記録。大幅増（例: +20% 以上）があれば原因を調査。
- [ ] **console エラー比較**: フェーズ 1 のベースラインに対し新規エラーが増えていないこと。
- [ ] 手動確認項目（ユーザー実施）の洗い出し:
  - ログイン後のサークル向けページ閲覧（実認証が必要）
  - スマートフォンサイズでの閲覧（Playwright でモバイル viewport でも機械比較するが、実機確認は最終的にユーザー）
  - 代表的な MDX ページの表組み描画（`remark-gfm` 継続動作）

### フェーズ 7: README 更新・完了報告

- [ ] **`README.md` を更新**（本計画とセットで実施）。差分は最小限に:
  - 「環境」表の Next.js 行を `15 系（Pages Router）` → `16 系（Pages Router）` に。
  - 「バージョンアップの経緯・方針」のリンクに本計画（`app/docs/version_up_nextjs_16_plan.md`）を追加。
  - Node.js バージョン / Dockerfile / `.node-version` / engines はいずれも変更なし（Next 16 の engines `>=20.9.0` を 22.23.5 が充足するため）。
  - 「ローカル環境（app）」節の手順（`npm install` → `npm run dev`）はそのまま。Turbopack がデフォルトになる旨を 1 行追記（必要なら `--webpack` で webpack に切替可能、と注記）。
  - `scripts/` 節は変更なし（スクリプトの実行方法は維持）。
- [ ] **PROGRESS.md に最終サマリ**:
  - 最終到達バージョン（Next / @next/mdx / その他）
  - **計画との差分一覧**（Turbopack 採用 or `--webpack` 退避、`@next/mdx` 15 据え置き or 16 canary 等の判断）
  - 既知の見た目差分（許容したもの）と判定根拠
  - 未検証項目（認証必須・実データ必須・実デプロイ）とその理由・代替検証
  - スコープ外に putback したもの（App Router 化、Turbopack 完全移行等）
  - バンドルサイズ・脆弱性の増減
- [ ] ユーザーに報告し、PR 作成の要否と本番デプロイの実施可否を確認する。

---

## 3. リスク・補足

| リスク | 対応 |
|---|---|
| `next/link` の `legacyBehavior` 全件置換で見た目崩れ・遷移挙動変化（最大リスク） | フェーズ 2 で Next 15 のまま先行実施し、pixelmatch 全ページ比較を必須 checkpoint に。崩れたら Next 16 に進まない |
| Turbopack デフォルト化で `webpack(config)` カスタムの画像ルールが無効化し画像が表示されない | `"dev": "next dev --webpack"` で webpack に固定する選択を第一候補とし、Turbopack 対応は後続課題として PROGRESS に putback |
| `@next/mdx` 16 stable 未リリース | 15 系据え置きで動作可否を先に検証。動かなければ (a) canary 採用の可否をユーザー判断、(b) Next 16 の初期パッチで止めて stable を待つ、を提示 |
| `next/image` の内部実装変化で `/static/gishohaku5-logo.png` のレンダリング差分 | 影響範囲 1 ファイル。pixelmatch で検出できる |
| scripts が app 側の型/モジュール変更で import 解決不能になる | フェーズ 5 で代表スクリプトのドライラン実行を確認。壊れたら type-only 切り出し等で最小対応 |
| デプロイ破壊（CSP / rewrites / Dockerfile） | CSP / rewrites は変更せず build 出力と突合。Dockerfile は Node 据え置きのため変更なし。実デプロイはユーザー判断 |
| ビルドに Firebase 実値が必要になる | ダミー値で通ることを前提。通らなければユーザーに実値依頼 |
| Next 16 の未知の破壊的変更 | 公式 `@next/codemod` を併用し、エラー 3 回試行で解決しないものは中断・報告 |

---

## 4. 完了条件（受け入れ基準）

1. `cd app && npm run dev` で `http://localhost:3000` が表示され、主要ページで新規エラーが出ない。
2. `cd app && API_KEY=dummy PROJECT_ID=dummy npm run build` が成功する。
3. フェーズ 1 の before とフェーズ 6 の after の pixelmatch 比較で、崩れとして判定された差分がゼロである（意図的な差分は許容判定して記録）。
4. `cloudbuild.yaml` / `firebase.json` / `Dockerfile` の手順・設定に手を入れず（または最小限の整合のみで）、デプロイ経路の机上レビューが通っている。
5. ルート `scripts/` の代表スクリプトを DRY_RUN で実行して import 解決・初期化・CSV パースまで通る。
6. `README.md` が本作業後の状態（Next 16・Turbopack の扱い）と整合している。
7. `app/PROGRESS.md` に本作業の全ログ（計画との差分・判断根拠・未検証項目）が残っている。

---

## 5. 計画レビューの観点（人間向け）

**A. 段階化**
- [x] `legacyBehavior` 除去を Next 15 のまま先行実施する段取りが切り分けられているか
- [x] Next 本体引き上げが独立した checkpoint として分離されているか

**B. 事実の検証可能性**
- [x] 計画中の数値（「15 ファイル」等）に再生成コマンドが併記され、フェーズ冒頭で再検証するステップがあるか
- [x] 現行バージョンを lockfile から実測する手順があるか

**C. 影響範囲の棚卸し**
- [x] Next 16 の破壊的変更すべてについて、本プロジェクトでの使用有無が検出コマンド付きで判定されているか
- [x] 「使用していない」と判定した項目に根拠（grep の結果）が残るか

**D. 検証計画**
- [x] 検証項目ごとに実行可能性（静的 / 認証必須 / 実データ必須）が分類され、手動確認が必要なものがユーザー向けに明記されているか
- [x] 差分検出を pixelmatch に任せ、目視は判定だけに使う設計か

**E. AI の暴走・停滞の制御**
- [x] エラー試行 3 回上限と報告フォーマットが定義されているか
- [x] スコープ外（App Router 化、Turbopack 完全移行、Firebase/Tailwind 更新）の判定基準が明示されているか
- [x] 中断・再開の手順（PROGRESS の読み方）が定義されているか
