# sancho 削除作業計画(改訂版)

UIフレームワーク [sancho](https://github.com/bmcmahen/sancho) (^3.5.6) を app から削除し、自前コンポーネント(Emotion + インラインSVG)に置き換えるための作業計画。
**この計画は Claude Code が `/goal` で実行する前提**で書かれている。各フェーズがゴール単位のチェックリストになっており、上から順に実行する。

> **改訂注記(2026-07-07)**: 実作業の結果(`PROGRESS.md`)に基づき改訂した。改訂版での変更点・理由・一般化した教訓は末尾の「8. 改訂内容と理由」、次回以降に人間が計画をレビューするための観点は「9. 計画レビューの観点(人間向け)」にまとめてある。改訂箇所には 🔧 マークを付けた。

---

## 0. 前提・実行ルール(全フェーズ共通)

### ビルドルール
- ビルドは **Node 16** で行う(`Dockerfile` が `node:16-alpine` のため。`package.json` の `engines: "14"` は無視する)
  - Windows ローカルでは nvm-windows / volta / Docker のいずれかで Node 16 を用意する。`node -v` で 16.x であることを確認してからビルドすること
- ビルド前に**必ず** `npm ci --legacy-peer-deps` を実行する
- ビルド手順は `app/Dockerfile` の内容に従う:
  ```
  npm ci --legacy-peer-deps
  API_KEY=<値> PROJECT_ID=<値> npm run build
  ```
  - `API_KEY` / `PROJECT_ID` は Firebase 用。値が手元にない場合、まずダミー値でビルドが通るか検証し、結果を PROGRESS.md に記録する。通らない場合はユーザーに値の提供を依頼する

### 🔧 環境の衝突ルール(実績より追加)
- **プロジェクト用 Node(16)と作業ツール用 Node は分離して運用する**。Playwright など Node 18+ を要求するツールは、グローバルの Node を切り替えず、`PATH="<新しいNodeのパス>:$PATH" npx ...` のようにコマンド単位でパスを前置して実行する
- nvm-windows の `nvm use` はグローバル symlink(`C:\nvm4w\nodejs`)を張り替える方式で、(1) 同一コマンドチェーン内では PATH 反映が遅れる、(2) 切り替え時に symlink が一時的に消える不具合がある。**作業途中でのグローバル切り替えは行わない**
- Docker を検証手段に使う予定がある場合、フェーズ1で `docker info`(バージョンではなく**デーモンが起動していること**)を確認する。起動していなければ Docker 検証は best-effort 扱いとし、その旨を最初から PROGRESS.md に記録する

### 🔧 数値・列挙の再検証ルール(実績より追加)
- この計画に書かれている数値・一覧(「19ファイル」「25種類」等)は**事前調査時点のスナップショットであり、正とはみなさない**。フェーズ1で再検証コマンドを実行して一覧を再生成し、計画と差分があれば **PROGRESS.md に「計画との差分」として明示した上で、再生成した一覧を正とする**

### エラー対応ルール
- **ひとつのエラーに対する解決の試行は3回まで**
- 3回目で解決できなかったら、以下を PROGRESS.md に要約して作業を中断し、ユーザーに報告する:
  - エラーの内容(メッセージ全文)
  - 試した3つの対処と各結果
  - 現時点の仮説と、人間に判断してほしいこと

### 記録ルール(中断・再開のため)
- **すべての作業・調査結果・判断を `app/PROGRESS.md` に随時追記する**。まとめて書くのではなく、各ステップの開始時と完了時に書く
- フォーマット:
  ```markdown
  ## YYYY-MM-DD HH:MM [フェーズN]
  - やったこと:
  - 結果(コマンド出力の要点、成功/失敗):
  - 判断・メモ:
  - 次のアクション:
  ```
- **再開手順**: 作業を再開するときは、まず PROGRESS.md を読み、チェックリストの未完了項目から続行する。環境状態(ブランチ、node バージョン、dev サーバーの起動有無)も PROGRESS.md から復元する
- 🔧 **計画から逸脱した場合(コンポーネントの追加実装・簡略化・寄り道修正)は、通常の記録とは別に「計画との差分」として明示的に記録する**(完了報告時に差分だけを抽出できるようにするため)

### Git ルール
- 作業ブランチ `remove_sancho` 上で行う
- フェーズ3では 1〜数ファイルの置き換えごとに小さくコミットする(壊れたとき戻しやすくするため)

---

## 1. フェーズ1: 準備・ベースライン取得

- [ ] 作業ブランチ `remove_sancho` になっていなければ、`master` から作業ブランチ `remove_sancho` を作成する
- [ ] `app/PROGRESS.md` を作成し、この計画へのリンクと開始日時を書く
- [ ] 🔧 **sancho 使用の全数調査(計画の事前調査の再検証)**:
  - `grep -rn "from 'sancho'" src/ pages/` で使用ファイル一覧を再生成する
  - 各ファイルの import 文から**使用している識別子(コンポーネント・アイコン名)を全て抽出**し、ファイル別の一覧表を PROGRESS.md に記録する。この一覧がフェーズ2の実装対象の正となる(計画の「25種類」は目安にすぎない)
  - `_app.tsx` / `_document.tsx` 等でグローバル CSS・ThemeProvider・ToastProvider を import していないか確認する
- [ ] 🔧 **間接依存の相乗りチェック**: sancho を削除すると sancho の依存ツリー(react-spring, @reach/*, open-color, @types/react-dom 等)ごと消える。以下を確認し、結果を PROGRESS.md に記録する:
  - `src/` で import しているモジュールのうち、`package.json` の dependencies/devDependencies に**明示されていないもの**がないか(あれば sancho 等の間接依存に相乗りしている疑い)
  - TypeScript の型定義(`@types/*`)が間接依存経由で入っていないか(実績: `@types/react-dom` が sancho 経由でしか入っておらず、削除後にビルドが壊れた)
  - 見つかったものは、この時点で devDependencies/dependencies に明示追加してよい(フェーズ4での手戻りを防ぐ)
- [ ] Node 16 で `npm ci --legacy-peer-deps` → `npm run build` を実行し、**削除前のビルドが通ること(ベースライン)を確認**する。`API_KEY`/`PROJECT_ID` の要否もここで判明させる(実績: ダミー値でビルド可能。Firebase はビルド時に値を検証しない)
- [ ] `.next` ディレクトリのサイズと、ビルド出力の First Load JS を記録する
- [ ] 🔧 **検証環境の制約を事前に分類する**: フェーズ5の検証項目それぞれについて「静的表示のみで確認可能 / 実データ(Firestore)が必要 / 認証が必要」を分類し、ダミー認証情報の環境で**実行不能な項目とその代替検証(型チェック+コードレビュー等)をこの時点で確定**して PROGRESS.md に記録する(フェーズ5になってから「確認できない」と判明するのを防ぐ)
- [ ] `npm run dev` を起動し、sancho 使用ページの **before スクリーンショット**を取得する
  - 取得方法: `npx playwright screenshot`(Playwright は Node 18+ 必須。「環境の衝突ルール」の PATH 前置方式で実行)。**ビューポートは 1280x800 に固定、fullPage で取得**し、after 取得時も同一条件にする
    - 🔧 fullPage 撮影は撮影時にビューポートを一時拡張するため、**画面外に隠しているはずの fixed 要素(閉じたモーダル等)の隠し漏れも検出できる**。意図的にこの条件を維持する
  - 対象ページ(sancho コンポーネントが表示されるページ):
    | URL | 確認対象 |
    |---|---|
    | `/` | Header(アイコン群、Container) |
    | `/sign_in` | Button, Input, InputGroup, Text, Alert |
    | `/sign_up` | 同上 |
    | `/reset_password` | Button, Input, InputGroup, Alert |
    | `/archive` | Container, List, ListItem, IconChevronRight |
    | サークル一覧・詳細ページ | CircleSelect, CircleCell, CheckButton, LoginSheet |
    | 書籍一覧ページ | BookCell, BookList(IconShoppingCart 等) |
  - 🔧 ルートは実際に存在するものを確認して使う(実績: circle-list は `gishohaku1` にのみ静的生成。`next.config.js` の exportPathMap を参照)
  - 認証必須の `/mypage` や BookForm/CircleForm は可能な範囲で取得し、取れなかったものは理由を PROGRESS.md に記録する
- [ ] 🔧 **console 警告・エラーのベースラインも記録する**: 各ページで出ている既存の警告(hydration mismatch 等)を PROGRESS.md に記録する。置き換え後に「新規のエラーか、既存のものか」を判定する基準になる
- [ ] スクリーンショットを `app/.sancho-migration/before/` に保存する(このディレクトリは**コミットしない**。`.gitignore` に追加するか git add しない)

## 2. フェーズ2: 代替コンポーネント実装

`src/components/common/` に Emotion(`@emotion/core` の `css`/`jsx` プラグマ、既存 `src/components/common/Container.tsx` と同じパターン)で実装する。
**見た目の再現が最優先**。`node_modules/sancho/esm/` の各コンポーネントのソースから元の CSS 値(色・padding・フォントサイズ・角丸・影)を参照して移植する。

- [ ] 🔧 **共通基盤を最初に作る**: `theme.ts`(sancho の light テーマから実使用分の色・spacing・radii・fontSizes を移植)、`colorUtils.ts`(hex→rgba 変換)、`formStyles.ts`(フォーム部品共通の枠線・フォーカスシャドウ)。sancho が `color` パッケージで動的に計算している色(lighten 等)は、実際に計算した結果の値をハードコードしてよい(計算過程を PROGRESS.md に記録)
- [ ] **実装対象はフェーズ1で再生成した識別子一覧に従う**。以下は事前調査時点の一覧(🔧 実績で追加が判明したものを含む):
  - `Button.tsx` — sancho の variant(default/ghost)、intent、size、loading、component(アンカー化)、iconBefore/iconAfter など**実際に使われている props** を洗い出してから互換実装する。intent は実使用分(none/primary/danger)のみでよい
  - `IconButton.tsx` — Button ベース+アイコンのみ表示、label は aria-label に
  - `Input.tsx` / `TextArea.tsx` / `Select.tsx` — フォーム部品。Select は矢印アイコン付きの見た目を再現
  - `InputGroup.tsx` — label + helpText + error 表示のラッパー(🔧 sancho の `:first-child` セレクタは SSR 警告の原因なので `:first-of-type` に変える。挙動は同等で警告が消える)
  - `Check.tsx` — チェックボックス+ラベル
  - `Alert.tsx` — intent 対応。実使用分(info/danger)のみでよい
  - `Text.tsx` — variant(paragraph/muted 等、使用箇所に合わせる)
  - `List.tsx` / `ListItem.tsx` — primary/secondary テキスト、contentAfter(IconChevronRight)、クリック可能な行
  - `Sheet.tsx` — **最難関**。下/横からスライドするモーダル。既存の `src/components/Portal.tsx` と `react-remove-scroll`(導入済み)を再利用し、オーバーレイ・ESC/外側クリックで閉じる挙動を再現する
    - 🔧 **注意: sancho の Sheet はアニメーションに react-spring を使うが、react-spring は sancho の間接依存であり sancho 削除後は消える。CSS transition で代替する**(スワイプ操作は非対応でよい)
    - 🔧 **閉状態の非表示制御も移植する**: sancho は transform によるオフスクリーン移動に加えて `visibility: hidden`(閉時)を併用している。transform だけだと、要素の高さが小さい場合やビューポートが拡張された場合(fullPage 撮影等)に閉じたはずの Sheet が画面内に見えてしまう。**開閉を持つコンポーネントは「閉じた状態のスタイル(visibility/display/pointer-events)」も sancho ソースから必ず移植すること**
  - 🔧 `Menu.tsx`(MenuList/MenuItem)/ `Popover.tsx`(ResponsivePopover)— BookCell.tsx の並べ替えメニューで使用(事前調査の25種類に漏れていた)。使用箇所は placement="bottom-end" 固定の1箇所のみなので、Popper 相当の自動位置決めやモバイル時 Sheet フォールバックは省略し、単純なドロップダウンに簡略化してよい
  - sancho 互換の `Container` — 既存 `common/Container.tsx` と sancho の Container は padding/max-width が異なる可能性があるため比較する(🔧 実績: 完全一致していたため既存をそのまま再利用)
- [ ] `icons/` ディレクトリに Feather Icons のインラインSVGコンポーネントを作成(**依存パッケージは追加しない**。SVG は sancho が内包する feather のパスデータをそのまま移植):
  `IconArrowDown, IconCheck, IconChevronDown, IconChevronLeft, IconChevronRight, IconChevronUp, IconExternalLink, IconHeart, IconLogOut, IconPlay, IconSearch, IconShoppingCart, IconUpload, IconX`
  - 🔧 実績で追加が判明した分: `IconMenu, IconMoreVertical, IconArrowUp, IconAlertOctagon`(フェーズ1の再生成一覧を正とする)
  - props は sancho 互換(`size`, `color`)にし、既定値も sancho に合わせる。`createIcon` のような共通ヘルパー(`icons/IconBase.tsx`)を作ると楽
- [ ] 各コンポーネント作成後、PROGRESS.md に「作成したコンポーネント / 参照した sancho ソース / 意図的に簡略化した点」を記録する

## 3. フェーズ3: 段階的置き換え(依存の少ない順)

import を `'sancho'` から `'./common/...'`(相対パス)に切り替える。**1グループごとにコミット**し、各グループ完了後に型チェック(`npx tsc --noEmit`。通らない設定なら `npm run build`)を行い結果を PROGRESS.md に記録する。

- [ ] グループ1(Button/アイコン単体の単純置き換え):
  `src/components/CircleCopyButton.tsx` → `src/withUser.tsx` → `src/containers/BookEdit.tsx` → `src/containers/CircleJoin.tsx` → `src/components/LiveNow.tsx` → `src/components/ImageUploader.tsx` → `src/components/CheckButton.tsx` → `src/containers/BookList.tsx`
- [ ] グループ2(複数コンポーネント):
  `src/components/BookCell.tsx` → `src/components/CircleSelect.tsx` → `src/containers/Mypage.tsx` → `src/pages/archive/index.tsx` → `src/components/Header.tsx`
- [ ] グループ3(フォーム系):
  `src/pages/reset_password.tsx` → `src/pages/sign_in.tsx` → `src/pages/sign_up.tsx` → `src/components/BookForm.tsx` → `src/components/CircleForm.tsx`
- [ ] グループ4(最難関):
  `src/components/LoginSheet.tsx`(Sheet + Button)
- [ ] 各グループの置き換え後、dev サーバーで該当ページのスクリーンショットを取得して before と比較し、console エラーがフェーズ1のベースラインから増えていないか確認する(🔧 目視だけでなく撮り直し比較を各グループで行う。実績上、この頻度での比較はコストに見合った)

## 4. フェーズ4: sancho の完全削除

- [ ] `grep -r "sancho" src/` が **0 件**であることを確認する(コメント・型 import 含む)
- [ ] `package.json` の dependencies から `sancho` を削除する
- [ ] Node 16 で `npm install --legacy-peer-deps` を実行し、`package-lock.json` を更新する
- [ ] **注意: Emotion 系(`@emotion/*`, `babel-plugin-emotion`)は自前コンポーネントで使用継続するため削除しない**
- [ ] 🔧 削除で何が消えたかを記録する(削除パッケージ数、脆弱性警告の増減)。フェーズ1の「間接依存の相乗りチェック」で対処済みでも、**クリーンビルドで初めて発覚する欠落(特に `@types/*`)がありうる**。エラーが出たら不足パッケージを明示追加して解決し、経緯を PROGRESS.md に記録する
- [ ] クリーンビルドで最終確認: `.next`/`node_modules` を削除 → `npm ci --legacy-peer-deps` → `API_KEY=<値> PROJECT_ID=<値> npm run build`

## 5. フェーズ5: 検証(ビルド以外の方法を含む)

- [ ] **ビルド検証**: Dockerfile と同条件(Node 16 + `npm ci --legacy-peer-deps` + `npm run build`)が成功すること。Docker デーモンが起動している環境なら `docker build --build-arg project_id=<値> --build-arg api_key=<値> .` でも確認する(フェーズ1の確認結果に従う)
- [ ] **スクリーンショット比較(🔧 定量比較を先、目視を後)**: フェーズ1と同じページ・同じ条件(1280x800, fullPage)で after を `app/.sancho-migration/after/` に取得し、比較する
  1. `npx pixelmatch before.png after.png diff.png` で**全ページを機械的に比較**する(人間・AIの目視は差分検出に弱く、実績でも目視では見逃すレベルの実害ある崩れを pixelmatch が検出した)
  2. 🔧 **ノイズ基準を作る**: 同一ページを2回連続撮影した self-diff が 0 であることを確認し、検出された差分が撮影ノイズでないことを保証する
  3. 差分が出たページのみ、diff 画像・クロップ画像で目視判定する
  4. 差分は PROGRESS.md に「意図的な差分(許容)/ 崩れ(要修正)」を判定して記録。崩れは修正して再取得。テキストのアンチエイリアス起因のサブピクセル差(実績: 0.3〜1.2%)は許容してよいが、判定根拠(クロップ目視)を記録する
- [ ] **grep 検証**: `sancho` が `src/`・`package.json`・`package-lock.json` のいずれにも残っていないこと
- [ ] **動作確認**(dev サーバーでクリック操作。🔧 フェーズ1で「実行可能」と分類した項目のみ。実行不能項目は事前に定義した代替検証の結果を記録):
  - sign_in / sign_up / reset_password のフォーム表示とバリデーションエラー表示(Alert)
  - LoginSheet / Header メニュー(Sheet)の開閉: 開く・オーバーレイ表示・ESC で閉じる
  - 🔧 **閉じているはずの UI が表示されていないこと**(Sheet 閉状態、メニュー非表示状態)。fullPage スクリーンショットに写り込んでいないかで確認する
  - CircleSelect のページ送り(IconChevronLeft/Right)※実データ必要
  - CheckButton のトグル(IconCheck/IconHeart)※実データ必要
- [ ] **バンドルサイズ比較**: `.next` のサイズと First Load JS をベースラインと比較して記録(sancho 削除で減るはず)

## 6. フェーズ6: 完了報告

- [ ] PROGRESS.md に最終サマリを書く:
  - 変更ファイル数・作成したコンポーネント一覧
  - 🔧 **計画との差分一覧**(追加実装したコンポーネント、意図的な簡略化、寄り道修正)
  - 既知の見た目差分(許容したもの)と判定根拠
  - 未検証項目(認証必須ページなど)とその理由・代替検証の内容
  - バンドルサイズの増減
- [ ] ユーザーに報告し、PR 作成の要否を確認する

---

## 7. リスク・補足

| リスク | 対応 |
|---|---|
| ビルド/dev サーバーに Firebase 用 `API_KEY`/`PROJECT_ID` が必要 | フェーズ1の最初に検証。ダミー値で不可ならユーザーに依頼(🔧 実績: ダミー値で可) |
| 🔧 間接依存への相乗り(`@types/react-dom` 等) | フェーズ1で事前チェック+フェーズ4のクリーンビルドで検出。不足分は明示追加 |
| 🔧 事前調査の一覧漏れ(Menu/Popover/アイコン4種が漏れていた) | フェーズ1で import 識別子一覧を再生成し、それを正とする |
| sancho の Toast | 既存の自作 `src/components/Toast.tsx` があり sancho 非依存のはず。フェーズ1の grep で確認 |
| sancho のグローバル CSS / ThemeProvider | フェーズ1で `_app.tsx` 等を確認。あれば置き換え対象に追加 |
| Sheet の再現度 | 完全再現が難しければ「開閉して操作できる」を最低ラインとし、差分を PROGRESS.md に記録して報告。🔧 閉状態の非表示制御(visibility)の移植は必須 |
| `engines: "14"` と Dockerfile の node16 の不整合 | 本作業のスコープ外。完了報告時に別途修正を提案する |
| 認証必須ページ(/mypage, BookForm 等)・実データ必須の動作確認 | 🔧 フェーズ1で実行可能性を分類し、代替検証(型チェック+props 突合のコードレビュー)を事前定義 |
| 🔧 既存の警告(hydration mismatch 等)と新規エラーの混同 | フェーズ1で console 警告のベースラインを記録し、差分で判定 |

## 参考情報(調査済み)

- sancho 使用ファイル: **19ファイル**(`grep -rln "from 'sancho'" src/` で再検証可能)、使用コンポーネント: 事前調査では25種類(🔧 実績では Menu 系 3種+アイコン 4種の漏れがあった。フェーズ1の再生成一覧を正とする)
- スタック: Next.js 10.1.3 / React 16.9 / Emotion 10 / Tailwind CSS 2(導入済みだが本作業では Emotion を使う)
- Dockerfile: `node:16-alpine`, `npm ci --legacy-peer-deps`, `API_KEY=xxx PROJECT_ID=xxx npm run build`, port 8080
- 既存の自作コンポーネント例: `src/components/common/Container.tsx`(Emotion パターンの参考)
- テスト・Storybook・ビジュアルリグレッションは未整備(だからスクリーンショット比較を手動で行う)

---

## 8. 改訂内容と理由(実作業からのフィードバック)

実作業(PROGRESS.md)で判明した事実に基づく改訂の一覧。「なぜそう変えたか」と「一般化した教訓」を対で書く。

| # | 改訂内容 | きっかけ(実績) | 一般化した教訓 |
|---|---|---|---|
| 1 | フェーズ1に「import 識別子一覧の再生成」を追加し、計画中の数値(25種類)を目安に格下げ | Menu/Popover 系3種+アイコン4種(IconMenu, IconMoreVertical, IconArrowUp, IconAlertOctagon)が事前調査から漏れており、フェーズ2で追加実装が発生した | 計画に書かれた数値・一覧は書いた時点で古くなる。**「再現コマンド+実行時再検証」をセットにしていない列挙は信用しない** |
| 2 | フェーズ1に「間接依存の相乗りチェック」を追加 | `@types/react-dom` が sancho 経由でしか入っておらず、削除後のクリーンビルドが型エラーで失敗した | **何かを削除する計画には「それが連れてきていた物への暗黙依存の洗い出し」が必須**。特に型定義・polyfill・グローバル CSS は気づきにくい |
| 3 | Sheet の実装項目に「閉状態の非表示制御(visibility)の移植」を明記 | transform のみの実装では閉じた Sheet が fullPage 撮影時に画面内に露出する崩れが発生。sancho は visibility を併用していた | 見た目の再実装では**「表示されている状態」だけでなく「隠れている状態」のスタイルも移植対象**。開閉・表示切替を持つ部品は閉状態を明示的に検証項目にする |
| 4 | スクリーンショット比較を「目視が先」から「pixelmatch(定量)が先、目視は差分の判定のみ」に変更。self-diff によるノイズ基準も追加 | 上記 Sheet の崩れは pixelmatch なしでは目視で見逃していた可能性が高い(作業ログに明記あり) | **目視は差分の検出には使わない。検出は機械、判定(許容/要修正)だけを人間・AIが行う**。比較には必ずノイズの下限基準(self-diff=0)を添える |
| 5 | フェーズ1に「検証項目の実行可能性の事前分類(静的/実データ必要/認証必要)」を追加 | フェーズ5の動作確認に挙げていた CircleSelect ページ送り・CheckButton トグルは、ダミー Firebase 環境では対象 UI 自体が描画されず検証不能だった | 検証リストは**「その環境で本当に実行できるか」を計画時に分類**し、実行不能項目には代替検証を事前定義する。実行段階での「できませんでした」を減らす |
| 6 | 「環境の衝突ルール」を新設(Node 16/18+ の分離、nvm-windows のグローバル切り替え禁止、`docker info` での事前確認) | Playwright が Node 18+ 必須でプロジェクトの Node 16 と衝突。`nvm use` で symlink が一時消失する事故も発生。Docker はバージョン確認のみでデーモン未起動が終盤に発覚 | ツールチェーン間のランタイム要件の衝突は計画段階で洗い出す。**「インストールされている」と「今使える」は別**(Docker デーモン等は実行可能性まで確認) |
| 7 | 「console 警告ベースラインの記録」を追加 | hydration mismatch 警告が全ページで既存発生しており、置き換えのたびに「新規か既存か」の判定が必要になった | 変更前の**エラー・警告の現状もベースライン**として記録する。スクリーンショットだけがベースラインではない |
| 8 | react-spring 非使用(CSS transition 代替)を Sheet の項目に明記 | sancho の Sheet は react-spring 依存だが、react-spring は間接依存のため sancho 削除後に消える。実装時に気づいて回避された | 参照元ライブラリのソースを流用する際、**そのソースが依存しているパッケージが削除後も残るか**を確認する(#2 の裏面) |
| 9 | 「計画との差分」を PROGRESS.md に明示記録するルールを追加 | 追加コンポーネント・簡略化・`:first-of-type` への変更などの逸脱が発生し、完了報告で差分を集約する必要があった | 逸脱は起きる前提で、**逸脱の記録フォーマットを計画側に用意**しておくと完了報告とレビューが楽になる |

## 9. 計画レビューの観点(人間向け)

AI に実行させる作業計画を人間がレビューするためのチェックリスト。上の改訂理由から一般化したもので、この種の「ライブラリ削除・置き換え」以外の計画にも使える。

**A. 事実の検証可能性**
- [ ] 計画中の数値・一覧(ファイル数、コンポーネント数)に、それを再現するコマンドが併記されているか
- [ ] その一覧を**実行時に再検証するステップ**が計画の序盤にあるか(事前調査を鵜呑みにしていないか)

**B. 削除・置き換え作業に固有の観点**
- [ ] 削除対象が「連れてきていたもの」(間接依存、型定義、グローバル CSS、polyfill)への暗黙依存を洗い出すステップがあるか
- [ ] 参照実装(元ライブラリのソース)を流用する場合、その実装が依存するパッケージが削除後も残るか確認しているか
- [ ] UI 部品の再実装で「隠れている状態」(閉じたモーダル、非表示メニュー)のスタイルと検証が対象に含まれているか

**C. 検証計画の実効性**
- [ ] 検証項目ごとに「その環境で実行できるか」(認証・実データ・外部サービスの要否)が分類され、実行不能項目の代替検証が事前定義されているか
- [ ] 差分の**検出**は機械的手段(pixelmatch、diff、型チェック)に任せ、人間・AI の目視は**判定**にだけ使う設計になっているか
- [ ] 比較にはノイズの下限基準(self-diff、再現性確認)があるか
- [ ] 変更前のベースラインに、スクリーンショットだけでなく**既存のエラー・警告・ビルドサイズ**が含まれているか

**D. 環境・前提**
- [ ] ツールチェーン間のランタイム要件の衝突(Node バージョン等)が洗い出されているか
- [ ] 「インストール済み」で済ませず「今この環境で実行できる」(デーモン起動等)まで確認するステップになっているか
- [ ] 秘密情報(API キー等)の要否を**序盤に**ダミー値で切り分けるステップがあるか

**E. AI の暴走・停滞の制御(この計画で機能した仕組み)**
- [ ] エラー対応の試行回数上限と、上限到達時の報告フォーマットが数値で定義されているか(「適宜報告」は機能しない)
- [ ] 小さくコミットする単位が指定されているか(壊れたとき戻せるか)
- [ ] 「見つけたが直さない」(スコープ外)の判定基準が書かれているか(hydration 警告、engines 不整合のような寄り道の抑制)
- [ ] 中断・再開の手順(進捗ファイルの読み方、環境状態の復元)が定義されているか
- [ ] 計画からの逸脱を記録するフォーマットが用意されているか
