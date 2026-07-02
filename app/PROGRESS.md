# sancho 削除作業 進捗記録

計画: [remove_sancho_plan.md](./remove_sancho_plan.md)
開始日時: 2026-07-02

---

## 2026-07-02 [フェーズ1] 準備・環境確認

- やったこと:
  - `git branch --show-current` で作業ブランチを確認
  - Node バージョン切り替え(nvm-windows で 16.20.2 に切り替え)
- 結果:
  - 既に `remove_sancho` ブランチ上だった(origin/master と同期済み)
  - `node -v` → v16.20.2、`npm -v` → 8.19.4
  - Docker (29.1.3) も利用可能
- 判断・メモ:
  - nvm-windows での `nvm use` はコマンドチェーン内(`;`区切り)だと同一シェル呼び出し内でPATH反映が遅れるため、別コマンドで確認する必要があった
- 次のアクション:
  - `_app.tsx` 等のグローバル sancho import 確認
  - ベースラインビルド実行

## 2026-07-02 [フェーズ1] grep 確認・ベースラインビルド

- やったこと:
  - `grep -r "sancho" src/` を実行し、sancho 使用ファイルを洗い出し
  - `_app.tsx` / `_document.tsx` が sancho を import していないか確認
  - Node 16.20.2 で `npm ci --legacy-peer-deps` → `API_KEY=dummy PROJECT_ID=dummy npm run build` を実行
  - `.next` のサイズを記録
- 結果:
  - sancho 使用ファイルは **19ファイル**(計画の事前調査と一致):
    src/components/BookCell.tsx, BookForm.tsx, CheckButton.tsx, CircleCopyButton.tsx, CircleForm.tsx, CircleSelect.tsx, Header.tsx, ImageUploader.tsx, LiveNow.tsx, LoginSheet.tsx, src/containers/BookEdit.tsx, BookList.tsx, CircleJoin.tsx, Mypage.tsx, src/pages/archive/index.tsx, reset_password.tsx, sign_in.tsx, sign_up.tsx, src/withUser.tsx
  - `src/pages/_app.tsx` / `_document.tsx` は上記リストに含まれず → グローバル ThemeProvider/CSS 使用なし(該当なし)
  - `npm ci --legacy-peer-deps` 成功(EBADENGINE警告のみ、多数の deprecated 警告、脆弱性警告あり。ビルド自体は成功)
  - `API_KEY=dummy PROJECT_ID=dummy npm run build` **成功**。ダミー値でビルド可能と判明(Firebase初期化はビルド時に値の妥当性を検証しない)
  - `.next` ディレクトリサイズ: **91M**(ベースライン)
- 判断・メモ:
  - ダミー値でビルドが通ったため、API_KEY/PROJECT_IDの実値取得をユーザーに依頼する必要はない
  - sancho の Toast は既存 grep 結果に `src/components/Toast.tsx` が含まれていないため、sancho 非依存と確認
- 次のアクション:
  - dev サーバー起動、before スクリーンショット取得

## 2026-07-02 [フェーズ1] dev サーバー起動・before スクリーンショット取得

- やったこと:
  - `API_KEY=dummy PROJECT_ID=dummy npm run dev` を起動(Node16、background、http://localhost:3000)
  - スクリーンショット取得のため Playwright を導入。**Playwright は Node 18+ が必須**なので、プロジェクトのビルド/devサーバー用の Node16 環境とは別に、nvm-windows に既に入っていた Node 24.6.0 を `PATH` に一時的にプレフィックスして `npx playwright` のみ実行(グローバル `nvm use` はしていない。理由は下記メモ参照)
  - `npx playwright install chromium` でブラウザ導入
  - 1280x800 ビューポートで以下のページをスクリーンショット(fullPage)。`app/.sancho-migration/before/` に保存(.gitignoreに追加済み)
    - `/` (home.png) — Header
    - `/sign_in` (sign_in.png) — Button, Input, InputGroup, Text
    - `/sign_up` (sign_up.png)
    - `/reset_password` (reset_password.png)
    - `/archive` (archive.png) — Container, List, ListItem, IconChevronRight
    - `/gishohaku1/circle-list` (circle_list.png) — サークル一覧
    - `/gishohaku13/circles/1` (circle_detail.png) — サークル詳細(CircleSelect等)
    - `/gishohaku13/books` (book_list.png) — BookCell, BookList
- 結果:
  - 8ページとも HTTP 200 でスクリーンショット取得成功(circle_detail のみ Firebase ダミー認証情報のため `FirebaseError: Failed to get document because the client is offline.` が発生し、実データは出ないが sancho コンポーネントを含むページ骨格は描画されている)
  - 全ページ共通で React hydration mismatch 警告(LoginSheet の Portal 関連、`validateDOMNesting`)が出ているが、これは**既存の(sancho由来ではない)警告**であり、今回の作業のスコープ外
  - `/mypage` は認証必須のため**未取得**(テストアカウントなし)。フェーズ5でも同様に未検証項目として扱う
- 判断・メモ:
  - **重要な環境知見**: このマシンには `C:\Users\FORTE\AppData\Local\nvm\v16.20.2` と `v24.6.0` が両方インストール済み。`nvm use X` はグローバル symlink (`C:\nvm4w\nodejs`) を張り替える方式で、PowerShellの同一コマンドチェーン内では反映が遅れる(別コマンドで確認要)。一度 `nvm use 24.6.0` を試したところ一瞬 symlink が消える不具合が発生したが `nvm use 16.20.2` で復旧できた。**以後、ビルド用Node16と切り替えるのは避け、Playwright 実行時は `PATH="/c/Users/.../v24.6.0:$PATH" npx ...` の形で直接パス指定する方式に統一**(symlink切り替え自体はしない)
  - dev サーバーは Node16 のまま起動し続けていたため、Playwright側だけ別Nodeで動かしても問題なかった
  - circle-list ルートは `gishohaku13` には存在せず(404)、`gishohaku1` にのみ静的生成されていた(next.config.js の exportPathMap 参照)。circle詳細は動的ルート `/[eventId]/circles/[id]` のため `gishohaku13/circles/1` を使用
- 次のアクション:
  - フェーズ2: `src/components/common/` に代替コンポーネントを実装開始

## 2026-07-02 [フェーズ2] 使用状況調査・代替コンポーネント実装

- やったこと:
  - 19ファイル全てで実際に import されている sancho の識別子を洗い出し
  - node_modules/sancho/esm の各コンポーネントソース・open-color パレット・color パッケージで実際の色計算を行い、視覚的に忠実な値を確認
  - `src/components/common/` 配下に以下を新規実装:
    - `theme.ts`(色・spacing・radii・fontSizes 等の定数。sancho の light テーマから実使用分のみ移植)
    - `colorUtils.ts`(alphaOf: hex→rgba変換ヘルパー)
    - `formStyles.ts`(Input/TextArea/Select共通の枠線・フォーカスシャドウ)
    - `Spinner.tsx`, `Text.tsx`, `Button.tsx`, `IconButton.tsx`
    - `Input.tsx`, `TextArea.tsx`, `Select.tsx`, `Check.tsx`
    - `InputGroupContext.tsx`, `InputGroup.tsx`, `Alert.tsx`
    - `List.tsx`(List, ListItem), `Sheet.tsx`
    - `Menu.tsx`(MenuList, MenuItem), `Popover.tsx`(ResponsivePopover)
    - `icons/IconBase.tsx`(createIcon ヘルパー), `icons/index.tsx`(全アイコン)
  - 既存 `common/Container.tsx` は sancho の Container(max-width 1200px, padding 1rem/1.5rem@992px)と**完全一致**するためそのまま再利用することに決定(変更なし)
- 結果・判断・メモ:
  - **計画にない追加コンポーネントが必要だった**: `src/components/BookCell.tsx` が `ResponsivePopover`, `MenuList`, `MenuItem`, `IconMoreVertical`, `IconArrowUp`, `IconArrowDown` を、`src/components/Header.tsx` が `IconMenu` を使用しており、計画の「25種類」に含まれていなかった。すべて追加実装した
  - **意図的な簡略化**:
    - `Sheet.tsx`: sancho は react-spring + react-gesture-responder でスワイプ操作・ばねアニメーションを実装しているが、**react-spring は sancho の transitive dependency であり app の package.json には存在しない**(sancho 削除後は入らなくなる)。plan の指示通り Portal + react-remove-scroll のみを使い、CSS transition(transform/opacity)で開閉アニメーションを実装。スワイプでの閉じ操作は非対応(クリック/ESC/オーバーレイクリックのみ)
    - `Popover.tsx` (ResponsivePopover): sancho は Popper 相当の自動位置決め+モバイル時はSheetへのフォールバックを行うが、本アプリでの使用箇所(BookCell.tsx の並べ替えメニュー、placement="bottom-end" 固定)は影響範囲が小さいため、常時「アンカー右下に絶対配置」の単純なドロップダウンに簡略化(モバイル判定によるSheet切り替えは省略)
    - `Alert.tsx`: intent は実際に使われている `info`(デフォルト)/`danger` のみ実装(success/warning/questionは未実装)
    - `Button.tsx`/`IconButton.tsx`: intent は `none`/`primary`/`danger` のみ実装(success/warningは未使用のため省略)
    - グラデーション終端色(primary: lighten(blue.base,0.4)=#4B9DE8, danger: lighten(red.base,0.3)=#EB7878)は Node の `color` パッケージで実際に計算した値をハードコード
  - InputGroup の `error` prop は現コードベースで未使用(grep で確認済み)だが、型として実装だけしておいた(表示ロジックは簡略化: アイコンなしテキストのみ)
- 次のアクション:
  - `npx tsc --noEmit` で新規コンポーネント群の型チェック
  - フェーズ3: グループ1から段階的に import を置き換え

## 2026-07-02 [フェーズ3] グループ1置き換え完了

- やったこと:
  - グループ1(8ファイル)の `from 'sancho'` を `./common/...` に置換:
    CircleCopyButton.tsx, withUser.tsx, BookEdit.tsx, CircleJoin.tsx, LiveNow.tsx, ImageUploader.tsx, CheckButton.tsx, BookList.tsx
  - `npx tsc --noEmit` 実行 → エラー0件
  - dev サーバーで `/gishohaku13/books` を Playwright で再スクリーンショットし、フェーズ1の before と比較
- 結果:
  - 型チェック: エラーなし
  - スクリーンショット: before/after でピクセル差なし(目視一致)。コンソールエラーも sancho 由来分(LoginSheet未移行)のみで新規エラーなし
  - git commit 39a7e96 で共通コンポーネント一式+グループ1をコミット
- 次のアクション:
  - グループ2(BookCell.tsx → CircleSelect.tsx → Mypage.tsx → archive/index.tsx → Header.tsx)

## 2026-07-02 [フェーズ3] グループ2置き換え完了

- やったこと:
  - グループ2(5ファイル)の import を置換: BookCell.tsx, CircleSelect.tsx, Mypage.tsx, archive/index.tsx, Header.tsx
  - `npx tsc --noEmit` 実行 → エラー0件
  - dev サーバーで `/`(Header), `/archive`(List/ListItem), `/gishohaku13/circles/1`(CircleSelect/BookCell) を再スクリーンショットしフェーズ1 before と比較
- 結果:
  - 型チェック: エラーなし
  - home / archive: before/after でピクセル差なし
  - circle_detail: フェーズ1と同一の Server Error オーバーレイ(ダミー Firebase 認証情報による `FirebaseError: client is offline` が getInitialProps 内で未処理例外になる、既知の制限。sancho 移行とは無関係、既存動作を変更していないことを確認)
  - Mypage.tsx は認証必須のためスクリーンショット未取得(型チェックとコードレビューで代替。フェーズ5で再度記録)
- 次のアクション:
  - グループ3(reset_password.tsx → sign_in.tsx → sign_up.tsx → BookForm.tsx → CircleForm.tsx)
