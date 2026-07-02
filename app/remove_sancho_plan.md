# sancho 削除作業計画

UIフレームワーク [sancho](https://github.com/bmcmahen/sancho) (^3.5.6) を app から削除し、自前コンポーネント(Emotion + インラインSVG)に置き換えるための作業計画。
**この計画は Claude Code が `/goal` で実行する前提**で書かれている。各フェーズがゴール単位のチェックリストになっており、上から順に実行する。

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

### Git ルール
- 作業ブランチ `remove_sancho` 上で行う
- フェーズ3では 1〜数ファイルの置き換えごとに小さくコミットする(壊れたとき戻しやすくするため)

---

## 1. フェーズ1: 準備・ベースライン取得

- [ ] 作業ブランチ `remove_sancho` になっていなければ、`master` から作業ブランチ `remove_sancho` を作成する
- [ ] `app/PROGRESS.md` を作成し、この計画へのリンクと開始日時を書く
- [ ] `_app.tsx` / `_document.tsx` 等で sancho のグローバル CSS・ThemeProvider・ToastProvider を import していないか grep で確認する(`grep -r "sancho" src/ pages/`)。結果を PROGRESS.md に記録
- [ ] Node 16 で `npm ci --legacy-peer-deps` → `npm run build` を実行し、**削除前のビルドが通ること(ベースライン)を確認**する。`API_KEY`/`PROJECT_ID` の要否もここで判明させる
- [ ] `.next` ディレクトリのサイズ(バンドルサイズ)を記録する
- [ ] `npm run dev` を起動し、sancho 使用ページの **before スクリーンショット**を取得する
  - 取得方法: `npx playwright screenshot`(または Claude Code のブラウザツール)。**ビューポートは 1280x800 に固定**し、after 取得時も同一条件にする
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
  - 認証必須の `/mypage` や BookForm/CircleForm は可能な範囲で取得し、取れなかったものは理由を PROGRESS.md に記録する
- [ ] スクリーンショットを `app/.sancho-migration/before/` に保存する(このディレクトリは**コミットしない**。`.gitignore` に追加するか git add しない)

## 2. フェーズ2: 代替コンポーネント実装

`src/components/common/` に Emotion(`@emotion/core` の `css`/`jsx` プラグマ、既存 `src/components/common/Container.tsx` と同じパターン)で実装する。
**見た目の再現が最優先**。`node_modules/sancho/esm/` の各コンポーネントのソースから元の CSS 値(色・padding・フォントサイズ・角丸・影)を参照して移植する。

- [ ] `Button.tsx` — sancho の variant(default/ghost)、intent(none/primary/danger)、size、loading、component(アンカー化)、iconBefore/iconAfter など**実際に使われている props** を洗い出してから互換実装する
- [ ] `IconButton.tsx` — Button ベース+アイコンのみ表示、label は aria-label に
- [ ] `Input.tsx` / `TextArea.tsx` / `Select.tsx` — フォーム部品。Select は矢印アイコン付きの見た目を再現
- [ ] `InputGroup.tsx` — label + helpText + error 表示のラッパー
- [ ] `Check.tsx` — チェックボックス+ラベル
- [ ] `Alert.tsx` — intent(danger 等)対応のアラート表示
- [ ] `Text.tsx` — variant(paragraph/muted 等、使用箇所に合わせる)
- [ ] `List.tsx` / `ListItem.tsx` — primary/secondary テキスト、contentAfter(IconChevronRight)、クリック可能な行
- [ ] `Sheet.tsx` — **最難関**。下/横からスライドするモーダル。既存の `src/components/Portal.tsx` と `react-remove-scroll`(導入済み)を再利用し、オーバーレイ・ESC/外側クリックで閉じる挙動を再現する
- [ ] sancho 互換の `Container` — 既存 `common/Container.tsx` と sancho の Container は padding/max-width が異なる可能性があるため、sancho 版の値で用意する(既存のものが一致するならそれを使う)
- [ ] `icons/` ディレクトリに Feather Icons のインラインSVGコンポーネントを作成(**依存パッケージは追加しない**。SVG は sancho が内包する feather のパスデータをそのまま移植):
  `IconArrowDown, IconCheck, IconChevronDown, IconChevronLeft, IconChevronRight, IconChevronUp, IconExternalLink, IconHeart, IconLogOut, IconPlay, IconSearch, IconShoppingCart, IconUpload, IconX`
  - props は sancho 互換(`size`, `color`)にし、既定値も sancho に合わせる
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
- [ ] 各グループの置き換え後、dev サーバーで該当ページを開き、表示崩れ・console エラーがないか目視確認する

## 4. フェーズ4: sancho の完全削除

- [ ] `grep -r "sancho" src/` が **0 件**であることを確認する(コメント・型 import 含む)
- [ ] `package.json` の dependencies から `sancho` を削除する
- [ ] Node 16 で `npm install --legacy-peer-deps` を実行し、`package-lock.json` を更新する
- [ ] **注意: Emotion 系(`@emotion/*`, `babel-plugin-emotion`)は自前コンポーネントで使用継続するため削除しない**
- [ ] クリーンビルドで最終確認: `npm ci --legacy-peer-deps` → `API_KEY=<値> PROJECT_ID=<値> npm run build`

## 5. フェーズ5: 検証(ビルド以外の方法を含む)

- [ ] **ビルド検証**: Dockerfile と同条件(Node 16 + `npm ci --legacy-peer-deps` + `npm run build`)が成功すること。Docker が使える環境なら `docker build --build-arg project_id=<値> --build-arg api_key=<値> .` でも確認する
- [ ] **スクリーンショット比較**: フェーズ1と同じページ・同じビューポート(1280x800)で after を `app/.sancho-migration/after/` に取得し、before と比較する
  - まず目視で並べて比較。微妙な差は `npx pixelmatch before.png after.png diff.png` で差分画像を生成
  - 差分は PROGRESS.md に「意図的な差分(許容)/ 崩れ(要修正)」を判定して記録。崩れは修正して再取得
- [ ] **grep 検証**: `sancho` が `src/`・`package.json`・`package-lock.json` のいずれにも残っていないこと
- [ ] **動作確認**(dev サーバーでクリック操作):
  - sign_in / sign_up / reset_password のフォーム表示とバリデーションエラー表示(Alert)
  - LoginSheet(Sheet)の開閉
  - CircleSelect のページ送り(IconChevronLeft/Right)
  - CheckButton のトグル(IconCheck/IconHeart)
- [ ] **バンドルサイズ比較**: `.next` のサイズをベースラインと比較して記録(sancho 削除で減るはず)

## 6. フェーズ6: 完了報告

- [ ] PROGRESS.md に最終サマリを書く:
  - 変更ファイル数・作成したコンポーネント一覧
  - 既知の見た目差分(許容したもの)
  - 未検証項目(認証必須ページなど)とその理由
  - バンドルサイズの増減
- [ ] ユーザーに報告し、PR 作成の要否を確認する

---

## 7. リスク・補足

| リスク | 対応 |
|---|---|
| ビルド/dev サーバーに Firebase 用 `API_KEY`/`PROJECT_ID` が必要 | フェーズ1の最初に検証。ダミー値で不可ならユーザーに依頼 |
| sancho の Toast | 既存の自作 `src/components/Toast.tsx` があり sancho 非依存のはず。フェーズ1の grep で確認 |
| sancho のグローバル CSS / ThemeProvider | フェーズ1で `_app.tsx` 等を確認。あれば置き換え対象に追加 |
| Sheet の再現度 | 完全再現が難しければ「開閉して操作できる」を最低ラインとし、差分を PROGRESS.md に記録して報告 |
| `engines: "14"` と Dockerfile の node16 の不整合 | 本作業のスコープ外。完了報告時に別途修正を提案する |
| 認証必須ページ(/mypage, BookForm 等)のスクリーンショットが取れない | テストアカウントがあればユーザーに依頼。なければコードレビュー+型チェックで代替し、その旨を記録 |

## 参考情報(調査済み)

- sancho 使用ファイル: **19ファイル**、使用コンポーネント: **25種類**
- スタック: Next.js 10.1.3 / React 16.9 / Emotion 10 / Tailwind CSS 2(導入済みだが本作業では Emotion を使う)
- Dockerfile: `node:16-alpine`, `npm ci --legacy-peer-deps`, `API_KEY=xxx PROJECT_ID=xxx npm run build`, port 8080
- 既存の自作コンポーネント例: `src/components/common/Container.tsx`(Emotion パターンの参考)
- テスト・Storybook・ビジュアルリグレッションは未整備(だからスクリーンショット比較を手動で行う)
