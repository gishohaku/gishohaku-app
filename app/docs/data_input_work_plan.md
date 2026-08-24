# サークル作成・招待メール送信 更新手順書

技書博の各回で新規サークルを Firestore に登録し、サークル代表者へログイン URL を含む招待メールを送信するための一連のスクリプトの運用手順をまとめます。

対象スクリプト（リポジトリ直下 `scripts/` 配下）:

| スクリプト | 役割 |
| --- | --- |
| `20260428-createCircles.ts` | エントリー一覧 CSV から Firestore の `circles` コレクションへサークルドキュメントを一括作成 |
| `20260428-createInvitation.ts` | 上記で作成した各サークルドキュメント配下に `circleInvitations` サブコレクションを作成し、招待用トークンとログイン URL を発行 |
| `20260428-sendCircleInvitation.ts` | 招待メール用 CSV に基づき、各サークル代表者へログイン URL を SMTP 経由でメール送信 |

> **前提**: `20260428-` は技書博13 の作業日付。**新しい回で使う場合はスクリプトを複製してファイル名の日付・スクリプト内の `eventId` を更新**してから使ってください（後述の「更新対応時の実行手順」参照）。

---

## ① 期待される CSV ファイルの構造

使用する CSV は 2 種類あります。**両方とも `scripts/data/` 配下に配置**します（`scripts/` から見た相対パス `./data/*.csv`）。

### 1-1. サークルエントリー CSV（`data/entries-gishohaku<N>.csv`）

`20260428-createCircles.ts` および `20260428-createInvitation.ts` の**流れの前段**で必要になる、Firestore に登録するサークル情報の元データ。

- **文字コード**: UTF-8
- **区切り**: カンマ
- **ヘッダー行**: **必須**（`csv-parser` がヘッダー名でカラムを引くため）
- **必須ヘッダー名（日本語）**: 以下 4 つ

| 列名 | 型 | 説明 | Firestore への反映先 |
| --- | --- | --- | --- |
| `サークル番号` | 文字列 | 配置番号（例: `A-01`） | `circles.booth` |
| `サークル名` | 文字列 | サークル名。**空欄行はスクリプト側でスキップ** | `circles.name` |
| `サークル名カナ` | 文字列 | サークル名のカナ表記 | `circles.nameKana` |
| `サークルジャンル` | 文字列 | ジャンル ID。`app/src/utils/circle.ts` の `categoriesByEvent[gishohaku<N>]` に**必ず定義済み**の値である必要あり | `circles.category` |

> **注意**: `サークル名` が空文字の行は登録スキップされます（`.filter(r => r.サークル名 !== '')`）。

**CSV サンプル**:

```csv
サークル番号,サークル名,サークル名カナ,サークルジャンル
A-01,技書博サンプルサークル,ギショハクサンプルサークル,software/frontend
A-02,インフラ探検隊,インフラタンケンタイ,infra/etc
```

その他 Firestore に書き込まれる固定値（スクリプト内でハードコード）:

| フィールド | 値 |
| --- | --- |
| `space` | `''`（空文字） |
| `description` | `''` |
| `image` | `''` |
| `imageMonochro` | `''` |
| `plan` | `'normal'` |
| `twitter` | `''` |
| `website` | `''` |
| `eventId` | `'gishohaku<N>'`（スクリプト内で固定。**回ごとに要書き換え**） |

### 1-2. 招待メール送信 CSV（`data/mail-gishohaku<N>.csv`）

`20260428-sendCircleInvitation.ts` が読み込む、メール送信用の一覧。

- **文字コード**: UTF-8
- **区切り**: カンマ
- **ヘッダー行**: **1 行目はヘッダー扱いで読み飛ばす**（`skipLines: 1`）→ 見出しの文言は自由だが 1 行目に何か書く必要あり
- **カラムは位置指定**（ヘッダー名で引かない）
- **カラム順**: 以下の 6 列を**この順番**で並べる

| 位置 | 用途 | 例 | 必須 |
| --- | --- | --- | --- |
| 0 | サークル番号 | `A-01` | ✅（`circleNumber`） |
| 1 | サークル名 | `技書博サンプルサークル` | ✅（`circleName`） |
| 2 | サークル名カナ | `ギショハクサンプルサークル` | 任意 |
| 3 | サークルジャンル | `software/frontend` | 任意 |
| 4 | メールアドレス | `taro@example.com` | ✅（`email` / 形式チェックあり） |
| 5 | ログイン URL | `https://gishohaku.dev/gishohaku14/mypage/join?circleId=...&token=...` | ✅（`loginUrl`） |

> **必須項目（0, 1, 4, 5）のいずれかが欠けた行は `[SKIP]` としてログ出力してスキップ**されます。メールアドレスは `^[^\s@]+@[^\s@]+\.[^\s@]+$` の簡易正規表現で形式チェックされます。

**CSV サンプル**:

```csv
サークル番号,サークル名,サークル名カナ,サークルジャンル,メールアドレス,ログインURL
A-01,技書博サンプルサークル,ギショハクサンプルサークル,software/frontend,taro@example.com,https://gishohaku.dev/gishohaku14/mypage/join?circleId=xxxxxxxxxxxxxxxx&token=yyyyyyyyyyyyyyyy
A-02,インフラ探検隊,インフラタンケンタイ,infra/etc,hanako@example.com,https://gishohaku.dev/gishohaku14/mypage/join?circleId=zzzzzzzzzzzzzzzz&token=wwwwwwwwwwwwwwww
```

> **ログイン URL（列6）は `20260428-createInvitation.ts` の実行結果の最終カラムをそのまま貼り込む**運用です（後述「更新対応時の実行手順」の手順3参照）。

### 1-3. XLS / XLSX ファイルから CSV を作成する手順

サークル応募フォームや事前アンケートの一次データは Excel / Google スプレッドシート形式 (`.xls` / `.xlsx`) で受領するケースが多く、そのままでは `csv-parser` で読み込めません。以下の手順で **UTF-8 の CSV に変換**してから `scripts/data/` 配下に配置します。

#### 手順 A: Excel（macOS / Windows）で変換する場合

1. 該当 XLS / XLSX ファイルを Excel で開く
2. **不要なシート・行・列を削除**する（`csv-parser` は先頭シートしか読まないため、対象データが 2 番目以降のシートにある場合は対象シートを 1 番目に移動 or 別ファイルに保存）
3. **列順を目的の CSV に合わせて並び替える**
    - `entries-gishohaku<N>.csv` 用: 1 列目からの順に `サークル番号`, `サークル名`, `サークル名カナ`, `サークルジャンル` の 4 列
    - `mail-gishohaku<N>.csv` 用: 1 列目からの順に `サークル番号`, `サークル名`, `サークル名カナ`, `サークルジャンル`, `メールアドレス`, `ログインURL` の 6 列（ログイン URL 列は空でよい。手順3 で埋める）
4. **ヘッダー行の名称を統一**する（`entries-gishohaku<N>.csv` の場合は日本語ヘッダー名で `csv-parser` がカラム参照するため、①の 1-1 の表の通り一字一句合わせる）
5. **フィルタ・非表示行を確認**（フィルタで隠れた行も CSV には出力されるので、不要行は削除してからエクスポートする）
6. `ファイル` → `名前を付けて保存` → **ファイル形式: `CSV UTF-8 (コンマ区切り) (.csv)`** を選択して保存
    - ⚠️ 「CSV（コンマ区切り）」ではなく必ず「**CSV UTF-8**」を選ぶこと（前者は SJIS で保存され `csv-parser` で日本語が化ける）
    - Excel for Mac の場合、保存形式に `CSV UTF-8` がなければ「CSV UTF-8 (コンマ区切り)(*.csv)」がある版まで Excel を更新するか、下記の手順 B（Google スプレッドシート経由）を使う
7. 保存した `.csv` ファイルを `scripts/data/entries-gishohaku<N>.csv`（または `mail-gishohaku<N>.csv`）にリネームして配置

#### 手順 B: Google スプレッドシートで変換する場合（推奨）

1. XLS / XLSX ファイルを Google ドライブにアップロードし、Google スプレッドシートで開く
2. 上記 手順 A の 2〜5 と同じ整形作業を実施
3. `ファイル` → `ダウンロード` → **`カンマ区切り形式 (.csv)`** を選択
    - Google スプレッドシートからの CSV エクスポートは**常に UTF-8**（BOM なし）で保存される
4. ダウンロードした `.csv` を `scripts/data/` 配下に配置

#### 手順 C: コマンドラインで一括変換する場合

`xlsx` パッケージ（`SheetJS`）の CLI ツール `xlsx-cli` を使うと、GUI を開かず変換できます。定期作業の自動化向け。

```bash
# 一度だけインストール
npm install -g xlsx-cli

# 変換 (先頭シートを CSV に出力)
xlsx --output=./scripts/data/entries-gishohaku14.csv ./path/to/received.xlsx
```
q
または Python がある環境なら:

```bash
python3 -c "import pandas as pd; pd.read_excel('./received.xlsx', sheet_name=0).to_csv('./scripts/data/entries-gishohaku14.csv', index=False, encoding='utf-8')"
```

#### 変換後の必須チェック

- [ ] **文字コード**: `file scripts/data/entries-gishohaku<N>.csv` を実行し `UTF-8 Unicode text` と出ること（`ISO-8859` / `Non-ISO extended-ASCII` の場合は SJIS 疑い、`UTF-8 Unicode (with BOM)` の場合は BOM 除去）
- [ ] **BOM 除去**（付いていた場合）: `sed -i '' '1s/^\xef\xbb\xbf//' scripts/data/entries-gishohaku<N>.csv`
- [ ] **改行コード**: `file` 出力が `CRLF line terminators` になっている場合は LF に変換 (`tr -d '\r' < in.csv > out.csv`)。`csv-parser` は CRLF でも動くが、他コマンドとの相性で崩れることがある
- [ ] **先頭行がヘッダー**であること（`head -1 scripts/data/entries-gishohaku<N>.csv` で確認）
- [ ] **行数の一致**: `wc -l scripts/data/entries-gishohaku<N>.csv` の結果が「ヘッダー1行 + 想定サークル数」であること
- [ ] **空行の混入がないこと**（`grep -c '^$' scripts/data/entries-gishohaku<N>.csv` が 0）
- [ ] **カンマを含むセル**が二重引用符で囲まれていること（Excel / Google スプレッドシートは自動対応。手動編集した場合は要確認）

---

## ② スクリプトを実行する際のコマンド

### 共通事項

- **作業ディレクトリ**: すべてリポジトリの `scripts/` 配下で実行します（各スクリプトが `./data/*.csv` を相対パスで参照するため）
- **ランナー**: `npx tsx`（各スクリプトのコメント内サンプルでも `npx tsx` を推奨）
  - 3 番目のスクリプト（`sendCircleInvitation.ts`）は `node:fs` などの ESM 形式 import を使うため、**`tsx` を使うこと**
- **DryRun 既定**: `DRY_RUN` 環境変数を明示しない場合はすべて DryRun 動作（Firestore への書き込みおよびメール送信は行わない）。実行時は **`DRY_RUN=false` を明示**する

### 環境変数について

以下の環境変数は**すでにシェル環境 (`.zshrc` / `direnv` / `.env` 等) に設定済みの場合はコマンドラインで再指定する必要はありません**。未設定の場合のみコマンド先頭に指定するか、シェル環境に追記してください。

| 環境変数 | 省略可否 | 用途 |
| --- | --- | --- |
| `GOOGLE_APPLICATION_CREDENTIALS` | **原則必須**（または `gcloud auth application-default login` で代替） | Firebase Admin SDK の認証（サービスアカウントキー JSON へのパス） |
| `PROJECT_ID` | 省略可 | Firebase プロジェクト ID。省略時はサービスアカウント JSON の `project_id` から自動解決 |
| `DATABASE_URL` | 省略可 | Realtime Database の URL。本スクリプト群は Firestore のみを触るため未使用 |
| `STORAGE_BUCKET` | 省略可 | Cloud Storage バケット名。本スクリプト群は Storage を一切使わないため未使用 |
| `DRY_RUN` | 既定 `true` | `false` を明示した時のみ実書き込み・実送信を行う |

### 2-1. `20260428-createCircles.ts`

```bash
# DryRun (追加予定の内容をログ出力するのみ、Firestore に書き込まない)
cd scripts
npx tsx 20260428-createCircles.ts

# 実行 (Firestore へ実際に書き込む)
DRY_RUN=false npx tsx 20260428-createCircles.ts
```

環境変数が未設定の場合は先頭に付与:

```bash
DRY_RUN=false \
GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccountKey.json \
npx tsx 20260428-createCircles.ts
```

### 2-2. `20260428-createInvitation.ts`

```bash
# DryRun (Firestore の circles を読み込み、追加予定の招待をログ出力するのみ)
cd scripts
npx tsx 20260428-createInvitation.ts

# 実行 (circleInvitations サブコレクションに書き込み、トークンとログイン URL を出力)
DRY_RUN=false npx tsx 20260428-createInvitation.ts \
  | tee ./data/invitation-output-gishohaku<N>.log
```

**実行出力（`DRY_RUN=false` のとき）**: `docId, booth, name, token, loginUrl` の CSV 相当の 5 カラム。この最終カラム `loginUrl` を `mail-gishohaku<N>.csv` の列 6 に貼り付けます。上記のように `tee` でファイルに保存しておくと後工程が楽です。

> **⚠️ DryRun スキップ厳禁**: このスクリプトは冪等ではなく、**同じサークルに 2 回実行すると招待が 2 つ生成**されます（古いトークンも有効なまま残る）。必ず DryRun で件数確認 → 本実行の順で。

### 2-3. `20260428-sendCircleInvitation.ts`

**追加で必要な環境変数**（`scripts/../.env`、つまり**リポジトリルート直下の `.env`** から自動読込）

| 変数 | 用途 | 既定値 |
| --- | --- | --- |
| `SMTP_HOST` | SMTP サーバホスト | 必須 |
| `SMTP_PORT` | SMTP ポート | `587` |
| `SMTP_USER` | SMTP 認証ユーザ | 必須 |
| `SMTP_PASS` | SMTP 認証パスワード | 必須 |
| `MAIL_FROM` | 送信元メールアドレス | 必須 |
| `MAIL_FROM_NAME` | 送信元表示名 | `技術書同人誌博覧会` |
| `MAIL_CC` | CC アドレス | 任意 |

> `secure: false` 固定。STARTTLS 対応の SMTP を想定（Port 587）。

```bash
# DryRun (CSV を読み込んで送信予定内容をログ出力するのみ、実際には送信しない)
cd scripts
npx tsx 20260428-sendCircleInvitation.ts

# 実行 (実際に SMTP でメールを送信)
DRY_RUN=false npx tsx 20260428-sendCircleInvitation.ts
```

> **テスト送信**: スクリプト末尾の `// break;` コメントを外すと**最初の1件だけ**送信して終了できます（本番前の SMTP 疎通確認に使用）。

---

## ③ 更新対応時の実行手順

新しい回（例: `gishohaku14`）に更新する場合の推奨フローです。

### ⚠️ 手順 0. 【必須先行】Next.js フロントエンドへの新イベント登録

**データ投入 (手順1〜) を実施する前に、必ずこのフェーズを完了させる**こと。フロントエンドが新しい `eventId` を認識していない状態で Firestore にデータを投入すると、以下のような**本番障害**が発生します。

- `/gishohaku<N>/circles` が **SSR 500 エラー**（`userStars[eventId].circleStars` の undefined 参照）
- サークル情報更新画面が **client-side exception**（`Object.keys(categoriesByEvent[eventId])` で undefined 参照）
- サークル詳細ページの前後遷移がクラッシュ

> **実例**: 技書博14 (2026-08) 対応時、フロントエンド未登録のままデータ投入した結果、サークル代表者が招待メール受信直後にログイン画面へアクセスできず、緊急ホットフィックス対応が発生しました（詳細は関連 PR: #291 / #292）。

#### 修正対象ファイル（1 PR にまとめて実施）

TypeScript の型定義が `EventId` union に紐付いているため、`event.ts` を更新すると**依存箇所がビルドエラーで一括検知**されます。それをすべて潰す形で修正を進めるのが最も安全。

| # | ファイル | 変更内容 | 未対応時の症状 |
|---|---|---|---|
| 1 | `app/src/utils/event.ts` | `EventId` union に `'gishohaku<N>'` を追加 | 他マップの型チェックが甘くなり暗黙 undefined を許容してしまう |
| 2 | `app/src/utils/circle.ts` | `categories<N>` 定数を追加し、`categoriesByEvent` / `CricleCategory` 型 / `allCategories` にも登録 | **サークル情報更新画面が client-side exception でクラッシュ** |
| 3 | `app/src/contexts/StarsContext.tsx` | 3 箇所に `gishohaku<N>: { bookStars: [], circleStars: [] }` を追加 (`useState` 初期値 / `fetchStars` の `stars<N>` 取得 & 返却 / `createContext` デフォルト値) | **`/gishohaku<N>/circles` が SSR 500** |
| 4 | `app/src/containers/CircleList.tsx` | `mapUrl` / `appealUrl` に `gishohaku<N>` エントリを追加（画像・スライド URL 未確定なら空文字で仮登録可） | 会場マップ / アピールスライドのリンクが空（クラッシュはしない） |
| 5 | `app/src/components/Layout.tsx` | BottomBar 表示対象の配列に `'gishohaku<N>'` を追加 | 新イベントページで BottomBar が非表示になる（クラッシュはしない） |
| 6 | `app/src/components/CircleSelect.tsx` | `gishohaku<N>Circles = []`（**空配列スタブ**）を宣言し、`circles` マップに `gishohaku<N>: gishohaku<N>Circles` を登録 | サークル詳細の前後遷移がクラッシュ |
| 7 | `app/src/components/Header.tsx` | イベント一覧メニューを新回に更新（先頭を新イベント名/開催日に差し替え、以降を 1 つずつシフト） | ヘッダーのイベント切替メニューが古いまま |
| 8 | `app/src/components/BottomBar.tsx` | ホームリンク判定の三項演算子で参照している旧 `eventId` を新 `eventId` に更新 (`eventId === 'gishohaku<N-1>' ? '/' : ...` → `eventId === 'gishohaku<N>' ? '/' : ...`) | 新イベントページで「ホーム」ボタンがトップ (`/`) に飛ばない |
| 9 | `app/src/components/SEO.tsx` | favicon / OGP 画像の URL を `gishohaku<N>-icon.png` 等の新回アセットに差し替え | favicon / OGP 画像が旧回のまま |
| 10 | `app/src/contexts/EventContext.tsx` | フォールバック用の `return 'gishohaku<N-1>'` を新 `'gishohaku<N>'` に更新 | `/`（トップ）で古いイベントがデフォルト扱いになる |

> **注意 (`CircleSelect.tsx` の `gishohaku<N>Circles`)**: 
> このフェーズでは**空配列 `[]` で仮登録**します。実データ (`{ id, name, booth }` の 86 件等) の投入には **Firestore の docId が必要**で、それは手順1 (`createCircles.ts`) 実行後に判明します。データ反映は**別 PR (手順6 参照)** で後追い実施してください。
> **TypeScript ビルドエラー回避のため、空配列でも型注釈が必要**な場合があります。過去実績: `const gishohaku<N>Circles: { id: string; name: string; booth: string }[] = []` の形が安全。

> **注意 (`categoriesByEvent`)**: 
> 応募フォームで**過去回に存在しないカテゴリ値**（例: gishohaku14 での `その他`）が選択される可能性がある場合、CSV データを事前確認し、`categories<N>` に該当キーを追加しておくこと（`allCategories` 経由でカテゴリ表示に使われる）。

#### 検証・リリース手順

1. 上記 10 ファイルの修正を**単一 PR (`feature/add_gishohaku<N>_frontend_registration` 等)** で提出
2. ローカルで **`npx tsc --noEmit`** グリーンを確認
3. ローカルで **`npm run build`** グリーンを確認
4. ローカルで **`npm run dev`** を起動、`/gishohaku<N>/circles` （データがまだ無いので空リスト）にアクセスして 500 にならないことを確認
5. レビュー → マージ → **本番デプロイまで完了させてから**手順1 に進む
6. **本 PR は「新イベントを扱える枠組みを追加するだけ」で、ユーザー影響ゼロ**（旧イベントページには変化なし、新イベントページは中身が空）なので、余裕をもってマージ・デプロイできる

### 事前準備

- [ ] **スクリプトの複製（必須）**: 既存の `20260428-*.ts` を**直接編集せず**、必ず**作業日付を先頭に付けた新ファイル名**でコピーして複製する。以降は複製先を編集する
    - 命名規則: `<YYYYMMDD>-<元のスクリプト名>.ts`（`YYYYMMDD` は**実行日**を指す。例: 2026-09-01 に作業するなら `20260901-`）
    - コピー対象は 3 ファイルすべて:
      ```bash
      cd scripts
      TODAY=$(date +%Y%m%d)
      cp 20260428-createCircles.ts        "${TODAY}-createCircles.ts"
      cp 20260428-createInvitation.ts     "${TODAY}-createInvitation.ts"
      cp 20260428-sendCircleInvitation.ts "${TODAY}-sendCircleInvitation.ts"
      ```
    - **理由**: (1) 元スクリプトは過去回の実行履歴として残す運用（PR / git log で「その回で使ったスクリプト」を追える）、(2) メール本文テンプレートや `eventId` を直接書き換えると過去回の証跡が失われる、(3) 「新回用の複製」がリポジトリ上に残ることでレビュー時の差分が明確になる
    - 複製後、以降の項目は**複製先のファイル**に対して実施する
- [ ] **スクリプト内の `eventId` を更新**: 3 ファイルすべてで文字列 `gishohaku13` → `gishohaku<N>` に置換
  - `createCircles.ts`: `circle.eventId`、CSV パス `./data/entries-gishohaku13.csv`
  - `createInvitation.ts`: `where("eventId", "==", "gishohaku13")`、実行後のログ出力 URL の `gishohaku13`
  - `sendCircleInvitation.ts`: `csvPath` の `./data/mail-gishohaku13.csv`、メール本文テンプレート内の `gishohaku13` 表記および告知 URL（懇親会 connpass、一般参加募集 connpass、Notion のイベントページ、印刷所ページ、フリーペーパー企画ブログ 等）を新回のものに差し替え
- [ ] **フロントエンド登録 PR が本番デプロイ済み**であること（**手順0** を必ず完了）
- [ ] **カテゴリ定義の追加**: `app/src/utils/circle.ts` の `categories<N>` を CSV データに合わせて確認・追加（手順0 で対応済みだが、応募フォームで新規カテゴリが追加された場合は再確認）
- [ ] **`data/entries-gishohaku<N>.csv` 作成**（①の 1-1 の形式）
- [ ] **`.env`**（リポジトリルート）に SMTP・Firebase 環境変数を設定（機密情報のためコミット禁止）
- [ ] **サービスアカウントキー**を安全な場所に配置し、`GOOGLE_APPLICATION_CREDENTIALS` にパスを指定できるようにしておく

### 手順1. サークル作成（Firestore への `circles` 登録）

1. **DryRun 実行**して `entries-gishohaku<N>.csv` に想定通りサークル数が読み込めているかログで確認

    ```bash
    cd scripts
    npx tsx 20260901-createCircles.ts
    ```
2. `[DRY-RUN] 追加予定: <booth> <name>` の件数が想定と一致することを目視確認
3. `サークルジャンル` の値が `categoriesByEvent[gishohaku<N>]` の keys と一致していることを確認（不一致だとフロント側のカテゴリ表示が壊れる）
4. **本実行**

    ```bash
    DRY_RUN=false npx tsx 20260901-createCircles.ts
    ```
5. Firebase コンソールで `circles` コレクションに `eventId == gishohaku<N>` のドキュメントが期待数分作成されていることを確認

### 手順2. 招待トークンの発行（`circleInvitations` サブコレクション作成）

> **⚠️ DryRun 必須**: このスクリプトは冪等ではないため、DryRun スキップは事故につながります（詳細は「② 2-2」の注記参照）。

1. **DryRun 実行**

    ```bash
    cd scripts
    npx tsx 20260901-createInvitation.ts
    ```
2. `[DRY-RUN] 招待作成予定: <docId>, <booth>, <name>` が手順1で作成したサークル数と一致することを確認
3. **本実行**（**必ず出力を保存する**）

    ```bash
    DRY_RUN=false npx tsx 20260901-createInvitation.ts \
      | tee ./data/invitation-output-gishohaku<N>.log
    ```
4. 出力ファイル `invitation-output-gishohaku<N>.log` に `docId, booth, name, token, loginUrl` 形式で1行ずつ出力されている

    ⚠️ **`loginUrl` は再発行できない**（同じサークルで再実行すると新規招待が別トークンで作成され、以前のリンクも有効なままで残る）ので、**このログは必ず保存**しておくこと。

### 手順3. 招待メール送信用 CSV の作成

1. サークル代表者の**メールアドレス一覧**を手元で用意（応募フォーム or 事前アンケートから抽出）
2. 手順2 の出力ログを開き、`loginUrl` カラムをサークル番号やサークル名で紐付ける
3. `scripts/data/mail-gishohaku<N>.csv` を①の 1-2 の形式で作成
    - 1 行目はヘッダー（`csv-parser` は `skipLines: 1` で読み飛ばすので中身は任意）
    - 2 行目以降、`サークル番号, サークル名, サークル名カナ, サークルジャンル, メールアドレス, ログインURL` の 6 列
    - **メールアドレスとログイン URL は 1 行たりとも取り違えないよう**、サークル番号での突き合わせをダブルチェック

### 手順4. メール本文テンプレートの見直し

`20260901-sendCircleInvitation.ts` の `template` 変数を確認し、以下を新回の情報に更新:

- [ ] `技書博13のサークル配置` → `技書博<N>のサークル配置`
- [ ] 懇親会 connpass URL（`https://gishohaku.connpass.com/event/386796/`）
- [ ] 一般参加募集 connpass URL（`https://gishohaku.connpass.com/event/372013/`）
- [ ] 提出物情報の Notion URL（`https://gishohaku.notion.site/gishohaku13-submissions`）
- [ ] 搬入搬出情報の Notion URL（`https://gishohaku.notion.site/gishohaku-13-luggage-carry`）
- [ ] バックアップ印刷所の Notion URL（`https://gishohaku.notion.site/gishohaku13-printings`）
- [ ] ポータルサイト URL（`https://gishohaku.notion.site/gishohaku13`）
- [ ] フリーペーパー企画ブログ URL（回ごとに差し替え）
- [ ] Podcast 宣伝企画の記述（実施しない回では削除）

### 手順5. 招待メール送信

1. **DryRun 実行**して全件のフォーマット・宛先・URL 埋め込みを目視確認

    ```bash
    cd scripts
    npx tsx 20260901-sendCircleInvitation.ts
    ```
2. 出力の `[SKIP]` 行を確認し、必須項目欠損・メール形式不正がないかチェック（あれば CSV を修正して再度 DryRun）
3. **1 件だけテスト送信**: スクリプト末尾の `// break;` を外し、`.env` に運営宛のテストアドレスを `MAIL_FROM` や CC に指定した上で以下を実行

    ```bash
    DRY_RUN=false npx tsx 20260901-sendCircleInvitation.ts
    ```

    テスト用に CSV の 1 行目（データ行）を運営スタッフのメールアドレスに置き換えておくと確実。
4. 受信確認: 件名・本文の URL・改行・文字化けをチェック
5. **`// break;` を戻して**全件送信

    ```bash
    DRY_RUN=false npx tsx 20260901-sendCircleInvitation.ts
    ```
6. 出力ログの `messageId` / `accepted` / `rejected` を目視確認し、`rejected` があれば個別対応（CSV から該当行だけ抜き出して再送）

### 手順6. 【必須】CircleSelect にサークル配置データを反映

手順1 (`createCircles.ts`) 実行により Firestore の docId が確定したため、手順0 で空配列スタブとして仮登録した `gishohaku<N>Circles` に実データを投入します。**この対応を怠ると TypeScript ビルドエラー (`TS7034` / `TS7005: implicit any[]`) で Cloud Build が失敗する**ことがあるため、必ず実施すること。

1. 手順3-1 で生成した `mail-gishohaku<N>.csv`（`loginUrl` に `circleId=<docId>` を含む）から docId を抽出:

    ```bash
    cd scripts
    python3 << 'EOF'
    import csv, re

    rows = []
    with open('./data/mail-gishohaku<N>.csv', encoding='utf-8', newline='') as f:
        next(f)  # header
        for r in csv.reader(f):
            booth = r[0]
            name = r[1]
            m = re.search(r'circleId=([^&]+)', r[5])
            doc_id = m.group(1) if m else ''
            rows.append((booth, name, doc_id))

    rows.sort(key=lambda x: x[0])
    for booth, name, doc_id in rows:
        name_escaped = name.replace("'", "\\'")
        print(f"{{ id: '{doc_id}', name: '{name_escaped}', booth: '{booth}'}},")
    EOF
    ```

2. 出力を `app/src/components/CircleSelect.tsx` の `gishohaku<N>Circles = [` と `]` の間に貼り込む
3. `npx tsc --noEmit` / `npm run build` グリーンを確認
4. 別 PR (`feature/add_circle_list_gishohaku<N>` 等) で提出、レビュー → マージ → デプロイ

> **なぜ手順0 と分けるのか**: `gishohaku<N>Circles` の実データには Firestore docId が必要で、それは手順1 実行後に初めて判明するため、フロントエンド登録 PR (手順0) と分割する必要がある。

### 事後対応

- [ ] 送信ログを保存（`tee` などで残す）
- [ ] `data/invitation-output-gishohaku<N>.log` と `data/mail-gishohaku<N>.csv` を安全な場所へ退避（機密情報を含むため**リポジトリにコミットしない**、`.gitignore` に該当パターンが入っているか確認）
- [ ] Firebase コンソールで `circles` / `circleInvitations` の件数最終確認
- [ ] 参加者から「メールが届かない」等の問い合わせ用に、送信済みリスト・エラー行リストを別途保存

---

## ④ エラー時の切り戻し (ロールバック) 手順

各手順で本実行 (`DRY_RUN=false`) 中に想定外のエラーが発生した場合や、DryRun で見落とした誤りに本実行後に気付いた場合の切り戻し方法をまとめます。**先に「どこまで進んだか」を確認**してから該当節に従ってください。

### 進捗判定チェックリスト

- Firebase コンソール → Firestore → `circles` コレクションで `eventId == gishohaku<N>` の件数を確認
- 上記に該当ドキュメントがある場合、任意の 1 件を開いて `circleInvitations` サブコレクションに招待ドキュメントがあるか確認
- SMTP プロバイダの送信ログ (Sendgrid / SES / Postfix 等) で送信履歴を確認

### 4-1. 手順0 (フロントエンド登録 PR) 失敗時

**症状**: PR マージ後のデプロイでビルド失敗、または本番反映後に \`/gishohaku<N>/circles\` 等がエラー。

**切り戻し**:
1. GitHub の PR を **Revert** ボタンで自動リバート PR を作成 → マージ → 再デプロイ
2. Cloud Run で**手動で 1 世代前のリビジョンにトラフィックを 100% ロールバック**（Firebase 管理画面 → Cloud Run → リビジョン → 過去リビジョンを選択 → 「トラフィックの管理」）
3. 原因を修正した新規 PR を作成し直す

> **注意**: この段階ではまだ Firestore にデータを入れていないため、DB 側のクリーンアップは不要。

### 4-2. 手順1 (createCircles) 失敗時

**症状**: 一部サークルのみ Firestore に作成された（並列非同期実装のため、失敗時に部分的な書き込みが残る可能性あり）。

**切り戻し**:
1. Firebase コンソール → Firestore → `circles` コレクション → `eventId == gishohaku<N>` でフィルタして**該当ドキュメントを全件削除**
2. 削除方法:
    - 少数（〜数十件）: コンソール上で個別に削除
    - 多数: `firebase-admin` を使った削除スクリプトを別途作成、または本スクリプトを一時的に「削除モード」に改造して実行
3. 削除完了後、原因（CSV 誤り / 権限 / ネットワーク 等）を修正して手順1 の DryRun からやり直し

> **参考: 全件削除の一時スクリプト例**
> ```ts
> // scripts/temporary-delete-circles-gishohaku<N>.ts
> import admin from 'firebase-admin'
> admin.initializeApp({ projectId: process.env.PROJECT_ID })
> const db = admin.firestore()
> ;(async () => {
>   const snap = await db.collection('circles').where('eventId', '==', 'gishohaku<N>').get()
>   console.log(`削除対象: ${snap.size}件`)
>   const batch = db.batch()
>   snap.docs.forEach(d => batch.delete(d.ref))
>   await batch.commit()
>   console.log('削除完了')
> })()
> ```
> **必ず DryRun 相当のログ確認 → 明示的な `DRY_RUN=false` で実行の 2 段階を踏むこと**。実行後はスクリプトを削除（証跡は git 履歴に残る）。

### 4-3. 手順2 (createInvitation) 失敗時

**症状**: 一部サークルにのみ招待トークンが発行された。**このスクリプトは冪等ではない**（再実行すると同じサークルに追加の招待が作られる）ため、必ずクリーンアップしてから再実行する。

**切り戻し**:
1. Firebase コンソールで各 `circles/{docId}/circleInvitations` サブコレクションの**全招待ドキュメントを削除**
2. 削除方法（`firebase-admin` スクリプト例）:
    ```ts
    // scripts/temporary-delete-invitations-gishohaku<N>.ts
    ;(async () => {
      const circles = await db.collection('circles').where('eventId', '==', 'gishohaku<N>').get()
      for (const circle of circles.docs) {
        const invs = await circle.ref.collection('circleInvitations').get()
        for (const inv of invs.docs) {
          await inv.ref.delete()
        }
        console.log(`${circle.data().booth}: ${invs.size}件削除`)
      }
    })()
    ```
3. 削除完了後、手順2 の DryRun からやり直し
4. **新しいトークンが発行されるため、手順3 (mail CSV 作成) もやり直しが必要**

### 4-4. 手順5 (sendCircleInvitation) 失敗時

**症状パターン別**:

**A. 送信途中でネットワーク切断・SMTP エラー等で停止**
- スクリプトは順次処理 (for-of + await) のため、**停止した時点で送信済みの件数はログで判別可能**
- 対処:
  1. `tee` ログを確認し、最後に「送信完了」が出ているサークル番号を特定
  2. **未送信分だけを含む差分 CSV** (`mail-gishohaku<N>-remaining.csv`) を作成
  3. スクリプトの `csvPath` を差分 CSV に一時的に書き換えて `DRY_RUN=false` で実行
  4. スクリプトの `csvPath` を元に戻す（差分 CSV は退避後に削除）

**B. 誤った本文で全件送信してしまった**
- **メールは取り消し不可**
- 対処:
  1. 誤送信の事実を認め、**訂正メールを別途配信**（同じ mail CSV で `template` だけ差し替えて再送）
  2. サークル代表者への Discord / X (Twitter) 経由でも案内
  3. ポストモーテムを記録し、原因を再発防止（DryRun ログの目視項目強化 / テスト送信の観点追加 等）

**C. `[SKIP]` されたサークルの手動フォロー**
- `invitation-output-gishohaku<N>.log` から該当サークルの `loginUrl` を抽出
- Discord DM / X (Twitter) 等でログイン URL を個別送付

### 4-5. 手順6 (CircleSelect データ反映) 失敗時

**症状**: CI ビルド失敗、または反映後にサークル詳細ページで前後遷移が壊れる。

**切り戻し**:
1. 該当 PR を Revert してデプロイ → **手順0 マージ時点の状態 (空配列)** に戻す
2. `CircleSelect` の前後遷移だけが機能しない状態になるが、サークル一覧・詳細表示自体は正常動作するため**本番影響は限定的**
3. データ抽出（Python スニペット）からやり直して修正 PR を再提出

### 4-6. 共通: 判断に迷った時の原則

1. **メール送信済みの取り消しは不可** → 送信前 (`sendCircleInvitation` DryRun 時点) までは完全巻き戻し可能。ここが最後の砦
2. **サービス停止 vs データ不整合** → イベント直前は「サークル代表者がサークル情報を登録できない」ほうが致命的なので、**Firestore の一部データ不整合を許容してでもフロントを稼働させる**判断もあり
3. **ロールバック実施は運営リード (fumiyasac 氏等) の合意を取ってから** → 単独判断で削除操作を進めない
4. **すべての切り戻し操作前に Firebase コンソールから該当コレクションを export** して現状スナップショットを退避

---

## 補足: よくあるハマりどころ

| 症状 | 原因 | 対処 |
| --- | --- | --- |
| DryRun のはずが Firestore に書き込まれた | `DRY_RUN=false` を明示していた／シェル履歴に残っていた | 環境変数を `unset DRY_RUN` してから DryRun |
| `.env` が読めない警告 | 実行ディレクトリが `scripts/` 以外 | 必ず `cd scripts` してから実行 |
| CSV の日本語ヘッダーが読めない | UTF-8 BOM 付き / SJIS で保存 | UTF-8（BOM なし）で再保存 |
| `カテゴリ` が Firestore で拾えているのに一覧画面で崩れる | `categoriesByEvent[gishohaku<N>]` に該当 key が未定義 | `app/src/utils/circle.ts` に追加 |
| `sendCircleInvitation` で全件 `[SKIP]` になる | ヘッダー行がデータ行として読まれている／列順が違う | CSV の 1 行目にヘッダーがあること、列順を①の 1-2 の順に修正 |
| 同じサークルに 2 通目の招待メールが届いた | `createInvitation` を複数回実行してトークンが重複発行された | Firestore の `circleInvitations` を確認し古いトークンを無効化（**Issue #16 の未対応事項**） |
| `Could not load the default credentials` エラー | `GOOGLE_APPLICATION_CREDENTIALS` 未設定かつ ADC も未設定 | 環境変数に JSON パスを設定するか `gcloud auth application-default login` を実行 |
| `/gishohaku<N>/circles` が SSR 500 | フロントエンドで新 `eventId` が `userStars` 等に未登録 | **手順0** の StarsContext / EventId / mapUrl 等の登録漏れを確認。ホットフィックス PR で追加 |
| サークル情報更新画面が client-side exception | `categoriesByEvent[gishohaku<N>]` が未定義で `Object.keys(undefined)` | **手順0** の `app/src/utils/circle.ts` に `categories<N>` が登録されているか確認 |
| Cloud Build ビルドが `TS7034 / TS7005 implicit any[]` で失敗 | `gishohaku<N>Circles` が空配列のまま放置されている | **手順6** で実データを投入。緊急時は型注釈 `const gishohaku<N>Circles: {id: string; name: string; booth: string}[] = []` で回避可 |
