# サークル作成・招待メール送信 更新手順書

技書博の各回で新規サークルをFirestoreに登録し、サークル代表者へログインURLを含む招待メールを送信する一連の作業手順をまとめる。

対象スクリプト（リポジトリ直下`scripts/`配下）:

| スクリプト | 役割 |
| --- | --- |
| `20260428-createCircles.ts` | エントリー一覧CSVからFirestoreの`circles`コレクションへサークルドキュメントを一括作成 |
| `20260428-createInvitation.ts` | 上記で作成した各サークルドキュメント配下に`circleInvitations`サブコレクションを作成し、招待用トークンとログインURLを発行 |
| `20260428-sendCircleInvitation.ts` | 招待メール用CSVに基づき、各サークル代表者へログインURLをSMTP経由でメール送信 |

`20260428-`は技書博13の作業日付。新しい回で使う場合は、スクリプトを複製してファイル名の日付とスクリプト内の`eventId`を更新してから使う（後述の「更新対応時の実行手順」を参照）。

---

## 切り戻し時の共通原則

各手順の個別の切り戻し手順は、該当する手順の末尾「切り戻し手順」節に記載している。ここでは全手順に共通する判断原則をまとめる。

### 進捗判定チェックリスト

切り戻しを開始する前に、現状がどこまで進んでいるかを確認する。

- Firebaseコンソール → Firestore → `circles`コレクションで`eventId == gishohaku<N>`の件数を確認する
- 該当ドキュメントがある場合、任意の1件を開いて`circleInvitations`サブコレクションに招待ドキュメントがあるかを確認する
- SMTPプロバイダの送信ログ（Sendgrid / SES / Postfix等）で送信履歴を確認する

### 切り戻し判断の原則

1. 送信済みメールは取り消せない。`sendCircleInvitation`のDryRun時点までが可逆な最終ポイントになる
2. イベント直前は「サークル代表者がサークル情報を登録できない」ほうが致命的なので、Firestoreの一部データ不整合を許容してでもフロントを稼働させる判断もあり得る
3. ロールバックの実施判断は単独で進めず、運営の合意を取ってから着手する
4. 切り戻し操作の前に、Firebaseコンソールから該当コレクションをexportして現状のスナップショットを退避しておく

---

## 期待されるCSVファイルの構造

使用するCSVは2種類ある。両方とも`scripts/data/`配下に配置する（`scripts/`から見た相対パス`./data/*.csv`）。

### サークルエントリーCSV（`data/entries-gishohaku<N>.csv`）

`20260428-createCircles.ts`と`20260428-createInvitation.ts`の前段で必要となる、Firestoreに登録するサークル情報の元データ。

- 文字コード: UTF-8（BOMなし）
- 区切り: カンマ
- ヘッダー行: 必須（`csv-parser`がヘッダー名でカラムを引くため）
- 必須ヘッダー名（日本語）は次の4つ

| 列名 | 型 | 説明 | Firestoreへの反映先 |
| --- | --- | --- | --- |
| `サークル番号` | 文字列 | 配置番号（例: `A-01`） | `circles.booth` |
| `サークル名` | 文字列 | サークル名。空欄行はスクリプト側でスキップされる | `circles.name` |
| `サークル名カナ` | 文字列 | サークル名のカナ表記 | `circles.nameKana` |
| `サークルジャンル` | 文字列 | ジャンルID。`app/src/utils/circle.ts`の`categoriesByEvent[gishohaku<N>]`に定義済みの値である必要がある | `circles.category` |

`サークル名`が空文字の行は`.filter(r => r.サークル名 !== '')`によって登録スキップされる。

CSVサンプル:

```csv
サークル番号,サークル名,サークル名カナ,サークルジャンル
A-01,技書博サンプルサークル,ギショハクサンプルサークル,software/frontend
A-02,インフラ探検隊,インフラタンケンタイ,infra/etc
```

Firestoreに書き込まれるその他のフィールドはスクリプト内でハードコードされている:

| フィールド | 値 |
| --- | --- |
| `space` | `''`（空文字） |
| `description` | `''` |
| `image` | `''` |
| `imageMonochro` | `''` |
| `plan` | `'normal'` |
| `twitter` | `''` |
| `website` | `''` |
| `eventId` | `'gishohaku<N>'`（スクリプト内で固定。回ごとに書き換える） |

### 招待メール送信CSV（`data/mail-gishohaku<N>.csv`）

`20260428-sendCircleInvitation.ts`が読み込むメール送信用の一覧。

- 文字コード: UTF-8（BOMなし）
- 区切り: カンマ
- ヘッダー行: 1行目はヘッダー扱いで読み飛ばす（`skipLines: 1`）。見出しの文言は自由だが1行目に何かが書かれている必要がある
- カラムは位置指定で参照する（ヘッダー名では引かない）
- カラム順は次の6列をこの順番で並べる

| 位置 | 用途 | 例 | 必須 |
| --- | --- | --- | --- |
| 0 | サークル番号 | `A-01` | はい（`circleNumber`） |
| 1 | サークル名 | `技書博サンプルサークル` | はい（`circleName`） |
| 2 | サークル名カナ | `ギショハクサンプルサークル` | 任意 |
| 3 | サークルジャンル | `software/frontend` | 任意 |
| 4 | メールアドレス | `taro@example.com` | はい（`email`。形式チェックあり） |
| 5 | ログインURL | `https://gishohaku.dev/gishohaku14/mypage/join?circleId=...&token=...` | はい（`loginUrl`） |

必須項目（0, 1, 4, 5）のいずれかが欠けている行は`[SKIP]`としてログ出力されてスキップされる。メールアドレスは`^[^\s@]+@[^\s@]+\.[^\s@]+$`の正規表現で簡易チェックされる。

CSVサンプル:

```csv
サークル番号,サークル名,サークル名カナ,サークルジャンル,メールアドレス,ログインURL
A-01,技書博サンプルサークル,ギショハクサンプルサークル,software/frontend,taro@example.com,https://gishohaku.dev/gishohaku14/mypage/join?circleId=xxxxxxxxxxxxxxxx&token=yyyyyyyyyyyyyyyy
A-02,インフラ探検隊,インフラタンケンタイ,infra/etc,hanako@example.com,https://gishohaku.dev/gishohaku14/mypage/join?circleId=zzzzzzzzzzzzzzzz&token=wwwwwwwwwwwwwwww
```

ログインURL（列6）は`20260428-createInvitation.ts`の実行結果の最終カラムをそのまま貼り込む（後述の「手順3」を参照）。

### XLS / XLSXファイルからCSVを作成する手順

サークル応募フォームや事前アンケートの一次データはExcelやGoogleスプレッドシート（`.xls` / `.xlsx`）で受領するケースが多く、そのままでは`csv-parser`で読み込めない。次のいずれかの手順でUTF-8のCSVに変換してから`scripts/data/`配下に配置する。

#### 手順A: Excel（macOS / Windows）で変換する

1. 該当XLS / XLSXファイルをExcelで開く
2. 不要なシート・行・列を削除する（`csv-parser`は先頭シートしか読まないため、対象データが2番目以降のシートにある場合は対象シートを1番目に移動するか別ファイルに保存する）
3. 列順を目的のCSVに合わせて並び替える
    - `entries-gishohaku<N>.csv`用: 1列目から`サークル番号`, `サークル名`, `サークル名カナ`, `サークルジャンル`の4列
    - `mail-gishohaku<N>.csv`用: 1列目から`サークル番号`, `サークル名`, `サークル名カナ`, `サークルジャンル`, `メールアドレス`, `ログインURL`の6列（ログインURL列は空のままで、後述の「手順3」で埋める）
4. ヘッダー行の名称を統一する。`entries-gishohaku<N>.csv`は`csv-parser`がヘッダー名でカラム参照するため、前述の表の列名と一字一句合わせる
5. フィルタや非表示行を確認する。フィルタで隠れた行もCSVには出力されるため、不要な行は削除してからエクスポートする
6. `ファイル` → `名前を付けて保存` → ファイル形式に`CSV UTF-8 (コンマ区切り) (.csv)`を選んで保存する。「CSV（コンマ区切り）」を選ぶとSJISで保存され`csv-parser`で日本語が化けるので注意
7. 保存した`.csv`を`scripts/data/entries-gishohaku<N>.csv`（または`mail-gishohaku<N>.csv`）にリネームして配置する

Excel for Macで保存形式に`CSV UTF-8`がない場合は、Excelを更新するか手順B（Googleスプレッドシート経由）を使う。

#### 手順B: Googleスプレッドシートで変換する（推奨）

1. XLS / XLSXファイルをGoogleドライブにアップロードし、Googleスプレッドシートで開く
2. 手順Aの2〜5と同じ整形作業を行う
3. `ファイル` → `ダウンロード` → `カンマ区切り形式 (.csv)`を選択する。GoogleスプレッドシートからのCSVエクスポートは常にUTF-8（BOMなし）で保存される
4. ダウンロードした`.csv`を`scripts/data/`配下に配置する

#### 手順C: コマンドラインで一括変換する

`xlsx`パッケージ（SheetJS）のCLIツール`xlsx-cli`を使うとGUIを開かずに変換できる。

```bash
# 一度だけインストール
npm install -g xlsx-cli

# 変換（先頭シートを CSV に出力）
xlsx --output=./scripts/data/entries-gishohaku14.csv ./path/to/received.xlsx
```

Pythonが使える環境であれば次のワンライナーでも変換できる:

```bash
python3 -c "import pandas as pd; pd.read_excel('./received.xlsx', sheet_name=0).to_csv('./scripts/data/entries-gishohaku14.csv', index=False, encoding='utf-8')"
```

#### 変換後の必須チェック

- 文字コード: `file scripts/data/entries-gishohaku<N>.csv`の結果が`UTF-8 Unicode text`となっていること。`ISO-8859`や`Non-ISO extended-ASCII`の場合はSJIS疑い、`UTF-8 Unicode (with BOM)`の場合はBOM除去
- BOM除去（付いていた場合）: `sed -i '' '1s/^\xef\xbb\xbf//' scripts/data/entries-gishohaku<N>.csv`
- 改行コード: `file`の結果に`CRLF line terminators`が含まれる場合は`tr -d '\r' < in.csv > out.csv`でLFに変換する。`csv-parser`はCRLFでも動くが、他コマンドとの相性で崩れることがある
- 先頭行がヘッダーであること（`head -1 scripts/data/entries-gishohaku<N>.csv`で確認）
- 行数の一致: `wc -l scripts/data/entries-gishohaku<N>.csv`の結果が「ヘッダー1行 + 想定サークル数」になっていること
- 空行の混入がないこと（`grep -c '^$' scripts/data/entries-gishohaku<N>.csv`が0）
- カンマを含むセルが二重引用符で囲まれていること（ExcelやGoogleスプレッドシートは自動対応。手動編集した場合は要確認）

---

## スクリプトを実行する際のコマンド

### 共通事項

- 作業ディレクトリは`scripts/`配下に移動してから実行する（各スクリプトが`./data/*.csv`を相対パスで参照するため）
- ランナーは`npx tsx`を使う。`sendCircleInvitation.ts`は`node:fs`などのESM形式importを使うため、`ts-node`ではなく`tsx`を使う必要がある
- DryRunが既定。`DRY_RUN`環境変数を明示しない場合はすべてDryRunで動作し、Firestoreへの書き込みやメール送信は行わない。実行時は`DRY_RUN=false`を明示する

### 環境変数

次の環境変数はすでにシェル環境（`.zshrc` / `direnv` / `.env`等）に設定済みの場合はコマンドラインで再指定する必要はない。未設定の場合のみコマンド先頭に指定するか、シェル環境に追記する。

| 環境変数 | 省略可否 | 用途 |
| --- | --- | --- |
| `GOOGLE_APPLICATION_CREDENTIALS` | 必須（または`gcloud auth application-default login`で代替） | Firebase Admin SDKの認証（サービスアカウントキーJSONへのパス） |
| `PROJECT_ID` | 省略可 | FirebaseプロジェクトID。省略時はサービスアカウントJSONの`project_id`から自動解決される |
| `DATABASE_URL` | 省略可 | Realtime DatabaseのURL。本スクリプト群はFirestoreのみを触るため未使用 |
| `STORAGE_BUCKET` | 省略可 | Cloud Storageバケット名。本スクリプト群はStorageを使わないため未使用 |
| `DRY_RUN` | 既定は`true` | `false`を明示したときだけ実書き込み・実送信を行う |

### `20260428-createCircles.ts`

```bash
# DryRun（追加予定の内容をログ出力するだけ、Firestore には書き込まない）
cd scripts
npx tsx 20260428-createCircles.ts

# 本実行（Firestore へ実際に書き込む）
DRY_RUN=false npx tsx 20260428-createCircles.ts
```

環境変数が未設定の場合は先頭に付与する:

```bash
DRY_RUN=false \
GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccountKey.json \
npx tsx 20260428-createCircles.ts
```

### `20260428-createInvitation.ts`

```bash
# DryRun（Firestore の circles を読み込み、追加予定の招待をログ出力するだけ）
cd scripts
npx tsx 20260428-createInvitation.ts

# 本実行（circleInvitations サブコレクションに書き込み、トークンとログイン URL を出力）
DRY_RUN=false npx tsx 20260428-createInvitation.ts \
  | tee ./data/invitation-output-gishohaku<N>.log
```

本実行時の出力は`docId, booth, name, token, loginUrl`の5カラム。最終カラム`loginUrl`を`mail-gishohaku<N>.csv`の列6に貼り付ける。上の例のように`tee`でファイルに保存しておくと後工程で楽になる。

このスクリプトは冪等ではない。同じサークルに対して2回本実行すると招待が2件発行され、古いトークンも有効なまま残る。DryRunで件数を確認してから本実行する流れを守ること。

### `20260428-sendCircleInvitation.ts`

追加で必要な環境変数は`scripts/../.env`（リポジトリルート直下の`.env`）から自動で読み込まれる。

| 変数 | 用途 | 既定値 |
| --- | --- | --- |
| `SMTP_HOST` | SMTPサーバホスト | 必須 |
| `SMTP_PORT` | SMTPポート | `587` |
| `SMTP_USER` | SMTP認証ユーザ | 必須 |
| `SMTP_PASS` | SMTP認証パスワード | 必須 |
| `MAIL_FROM` | 送信元メールアドレス | 必須 |
| `MAIL_FROM_NAME` | 送信元表示名 | `技術書同人誌博覧会` |
| `MAIL_CC` | CCアドレス | 任意 |

`secure: false`固定で、STARTTLS対応のSMTP（Port 587）を想定している。

```bash
# DryRun（CSV を読み込んで送信予定内容をログ出力するだけ、実際には送信しない）
cd scripts
npx tsx 20260428-sendCircleInvitation.ts

# 本実行（実際に SMTP でメールを送信）
DRY_RUN=false npx tsx 20260428-sendCircleInvitation.ts
```

スクリプト末尾の`// break;`のコメントを外すと、最初の1件だけ送信して終了する。本番前のSMTP疎通確認に使う。

---

## 更新対応時の実行手順

新しい回（例: `gishohaku14`）に更新する場合の推奨フロー。

### 手順0. Next.jsフロントエンドへの新イベント登録

データ投入（手順1以降）を実施する前に、必ずこのフェーズを完了させる。フロントエンドが新しい`eventId`を認識していない状態でFirestoreにデータを投入すると、次の不具合が発生する。

- `/gishohaku<N>/circles`がSSR 500エラーになる（`userStars[eventId].circleStars`のundefined参照）
- サークル情報更新画面がclient-side exceptionで落ちる（`Object.keys(categoriesByEvent[eventId])`のundefined参照）
- サークル詳細ページの前後遷移がクラッシュする

技書博14（2026-08）対応時はフロントエンド未登録のままデータ投入した結果、サークル代表者が招待メール受信直後にログイン画面へアクセスできず、緊急ホットフィックス対応が発生した（詳細はPR #291 / #292）。

#### 修正対象ファイル（1PRにまとめて実施）

TypeScriptの型定義が`EventId`unionに紐付いているため、`event.ts`を更新すると依存箇所がビルドエラーで検知される。それを順に潰す形で進めれば漏れが起きにくい。

| # | ファイル | 変更内容 | 未対応時の症状 |
|---|---|---|---|
| 1 | `app/src/utils/event.ts` | `EventId` unionに`'gishohaku<N>'`を追加 | 他マップの型チェックが甘くなり暗黙undefinedを許容してしまう |
| 2 | `app/src/utils/circle.ts` | `categories<N>`定数を追加し、`categoriesByEvent` / `CirclePlan`型 / `allCategories`にも登録 | サークル情報更新画面がclient-side exceptionでクラッシュする |
| 3 | `app/src/contexts/StarsContext.tsx` | 3箇所に`gishohaku<N>: { bookStars: [], circleStars: [] }`を追加（`useState`初期値 / `fetchStars`の`stars<N>`取得と返却 / `createContext`デフォルト値） | `/gishohaku<N>/circles`がSSR 500になる |
| 4 | `app/src/containers/CircleList.tsx` | `mapUrl` / `appealUrl`に`gishohaku<N>`エントリを追加（画像・スライドURLが未確定なら空文字で仮登録） | 会場マップやアピールスライドのリンクが空になる（クラッシュはしない） |
| 5 | `app/src/components/Layout.tsx` | BottomBar表示対象の配列に`'gishohaku<N>'`を追加 | 新イベントページでBottomBarが非表示になる（クラッシュはしない） |
| 6 | `app/src/components/CircleSelect.tsx` | `gishohaku<N>Circles = []`（空配列スタブ）を宣言し、`circles`マップに`gishohaku<N>: gishohaku<N>Circles`を登録 | サークル詳細の前後遷移がクラッシュする |
| 7 | `app/src/components/Header.tsx` | イベント一覧メニューを新回に更新（先頭を新イベント名／開催日に差し替え、以降を1つずつシフト） | ヘッダーのイベント切替メニューが古いままになる |
| 8 | `app/src/components/BottomBar.tsx` | ホームリンク判定の三項演算子で参照している旧`eventId`を新`eventId`に更新（`eventId === 'gishohaku<N-1>' ? '/' : ...` → `eventId === 'gishohaku<N>' ? '/' : ...`） | 新イベントページで「ホーム」ボタンがトップ (`/`) に飛ばない |
| 9 | `app/src/components/SEO.tsx` | favicon / OGP画像のURLを`gishohaku<N>-icon.png`等の新回アセットに差し替え | faviconやOGP画像が旧回のままになる |
| 10 | `app/src/contexts/EventContext.tsx` | フォールバック用の`return 'gishohaku<N-1>'`を新`'gishohaku<N>'`に更新 | `/`（トップ）で古いイベントがデフォルト扱いになる |

`CircleSelect.tsx`の`gishohaku<N>Circles`はこのフェーズでは空配列で仮登録する。実データ（`{ id, name, booth }`の86件等）の投入にはFirestoreのdocIdが必要で、それは手順1（`createCircles.ts`）実行後に判明する。実データ反映は別PRで後追い実施する（後述の「手順6」を参照）。TypeScriptビルドエラーを避けるため、空配列でも型注釈を付けておく（例: `const gishohaku<N>Circles: { id: string; name: string; booth: string }[] = []`）。

応募フォームで過去回に存在しないカテゴリ値（例: gishohaku14での`その他`）が選択される可能性がある場合は、CSVデータを事前確認して`categories<N>`に該当キーを追加しておく（`allCategories`経由でカテゴリ表示に使われる）。

#### 検証・リリース手順

1. 上記10ファイルの修正を単一PR（`feature/add_gishohaku<N>_frontend_registration`等）で提出する
2. ローカルで`npx tsc --noEmit`がグリーンになることを確認する
3. ローカルで`npm run build`がグリーンになることを確認する
4. ローカルで`npm run dev`を起動し、`/gishohaku<N>/circles`（データがまだ無いので空リスト）にアクセスして500にならないことを確認する
5. レビュー → マージ → 本番デプロイを完了させてから、手順1に進む

このPRは「新イベントを扱える枠組みを追加するだけ」で既存ページには変化がないため、余裕をもってマージ・デプロイできる。

#### 切り戻し手順（手順0失敗時）

PRマージ後のデプロイでビルド失敗が起きた場合、または本番反映後に`/gishohaku<N>/circles`等がエラーになる場合に実施する。

1. GitHubのPRのRevertボタンで自動リバートPRを作成し、マージ → 再デプロイする
2. それでも復旧しない場合はCloud Runで手動で1世代前のリビジョンにトラフィックを100%ロールバックする（Firebase管理画面 → Cloud Run → リビジョン → 過去リビジョンを選択 → 「トラフィックの管理」）
3. 原因を修正した新規PRを作成し直す

この段階ではまだFirestoreにデータを入れていないため、DB側のクリーンアップは不要。

### 事前準備

- [ ] スクリプトの複製: 既存の`20260428-*.ts`を直接編集せず、作業日付を先頭に付けた新ファイル名でコピーする。以降は複製先を編集する
    - 命名規則: `<YYYYMMDD>-<元のスクリプト名>.ts`（`YYYYMMDD`は実行日。例: 2026-09-01に作業するなら`20260901-`）
    - コピー対象は3ファイルすべて:
      ```bash
      cd scripts
      TODAY=$(date +%Y%m%d)
      cp 20260428-createCircles.ts        "${TODAY}-createCircles.ts"
      cp 20260428-createInvitation.ts     "${TODAY}-createInvitation.ts"
      cp 20260428-sendCircleInvitation.ts "${TODAY}-sendCircleInvitation.ts"
      ```
    - 理由: (1) 元スクリプトは過去回の実行履歴として残す運用で、PRや`$ git log`から「その回で使ったスクリプト」を追えるようにしている。(2) メール本文テンプレートや`eventId`を直接書き換えると過去回の証跡が失われる。(3) 新回用の複製がリポジトリ上に残ることでレビュー時の差分が明確になる
    - 複製後、以降の項目は複製先のファイルに対して実施する
- [ ] スクリプト内の`eventId`を更新する。3ファイルすべてで文字列`gishohaku13` → `gishohaku<N>`に置換する
    - `createCircles.ts`: `circle.eventId`、CSVパス`./data/entries-gishohaku13.csv`
    - `createInvitation.ts`: `where("eventId", "==", "gishohaku13")`、実行後のログ出力URLの`gishohaku13`
    - `sendCircleInvitation.ts`: `csvPath`の`./data/mail-gishohaku13.csv`、メール本文テンプレート内の`gishohaku13`表記、告知URL（懇親会connpass、一般参加募集connpass、Notionのイベントページ、印刷所ページ、フリーペーパー企画ブログ 等）を新回のものに差し替える
- [ ] フロントエンド登録PRが本番デプロイ済みであること（手順0を完了させておく）
- [ ] カテゴリ定義を確認する。`app/src/utils/circle.ts`の`categories<N>`をCSVデータに合わせて確認する（手順0で対応済みだが、応募フォームで新規カテゴリが追加された場合は再確認する）
- [ ] `data/entries-gishohaku<N>.csv`を作成する（前述の「エントリーCSV」の形式）
- [ ] リポジトリルートの`.env`にSMTPとFirebaseの環境変数を設定する（機密情報のためコミット禁止）
- [ ] サービスアカウントキーを安全な場所に配置し、`GOOGLE_APPLICATION_CREDENTIALS`にパスを指定できる状態にしておく

### 手順1. サークル作成（Firestoreへの`circles`登録）

1. DryRunを実行して`entries-gishohaku<N>.csv`から想定どおりのサークル数が読み込めているかをログで確認する

    ```bash
    cd scripts
    npx tsx 20260901-createCircles.ts
    ```
2. `[DRY-RUN] 追加予定: <booth> <name>`の件数が想定と一致していることを目視確認する
3. `サークルジャンル`の値が`categoriesByEvent[gishohaku<N>]`のkeysと一致していることを確認する（不一致だとフロント側のカテゴリ表示が壊れる）
4. 本実行する

    ```bash
    DRY_RUN=false npx tsx 20260901-createCircles.ts
    ```
5. Firebaseコンソールで`circles`コレクションに`eventId == gishohaku<N>`のドキュメントが期待数分作成されていることを確認する

#### 切り戻し手順（手順1失敗時）

一部サークルだけFirestoreに作成された状態（並列非同期実装のため、失敗時に部分的な書き込みが残る可能性がある）。

1. Firebaseコンソール → Firestore → `circles`コレクション → `eventId == gishohaku<N>`でフィルタして該当ドキュメントを全件削除する
2. 削除方法:
    - 少数（〜数十件）: コンソール上で個別に削除する
    - 多数: `firebase-admin`を使った削除スクリプトを別途作成するか、本スクリプトを一時的に「削除モード」に改造して実行する
3. 削除完了後、原因（CSV誤り / 権限 / ネットワーク 等）を修正して手順1のDryRunからやり直す

全件削除の一時スクリプト例:

```ts
// scripts/temporary-delete-circles-gishohaku<N>.ts
import admin from 'firebase-admin'
admin.initializeApp({ projectId: process.env.PROJECT_ID })
const db = admin.firestore()
;(async () => {
  const snap = await db.collection('circles').where('eventId', '==', 'gishohaku<N>').get()
  console.log(`削除対象: ${snap.size}件`)
  const batch = db.batch()
  snap.docs.forEach(d => batch.delete(d.ref))
  await batch.commit()
  console.log('削除完了')
})()
```

DryRun相当のログ確認 → 明示的な`DRY_RUN=false`で実行、の2段階を踏む。実行後はスクリプトを削除する（証跡はgit履歴に残る）。

### 手順2. 招待トークンの発行（`circleInvitations`サブコレクション作成）

このスクリプトは冪等ではない。DryRunをスキップして本実行すると事故につながるため、必ずDryRun経由で件数確認してから本実行する（詳細は「スクリプトを実行する際のコマンド」節の`createInvitation.ts`項を参照）。

1. DryRunを実行する

    ```bash
    cd scripts
    npx tsx 20260901-createInvitation.ts
    ```
2. `[DRY-RUN] 招待作成予定: <docId>, <booth>, <name>`の件数が手順1で作成したサークル数と一致していることを確認する
3. 本実行する。出力を必ずファイルに保存する

    ```bash
    DRY_RUN=false npx tsx 20260901-createInvitation.ts \
      | tee ./data/invitation-output-gishohaku<N>.log
    ```
4. 出力ファイル`invitation-output-gishohaku<N>.log`に`docId, booth, name, token, loginUrl`形式で1行ずつ出力されていることを確認する

`loginUrl`は再発行できない（同じサークルで再実行すると新規招待が別トークンで作成され、以前のリンクも有効なまま残る）。このログは必ず保存しておく。

#### 切り戻し手順（手順2失敗時）

一部サークルのみ招待トークンが発行された状態。冪等ではないため、再実行する前に既存の招待ドキュメントをクリーンアップする。

1. Firebaseコンソールで各`circles/{docId}/circleInvitations`サブコレクションの全招待ドキュメントを削除する
2. 削除方法（`firebase-admin`スクリプト例）:

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
3. 削除完了後、手順2のDryRunからやり直す
4. 新しいトークンが発行されるため、手順3（mail CSV作成）もやり直す必要がある

### 手順3. 招待メール送信用CSVの作成

1. サークル代表者のメールアドレス一覧を手元で用意する（応募フォームや事前アンケートから抽出する）
2. 手順2の出力ログを開き、`loginUrl`カラムをサークル番号やサークル名で紐付ける
3. `scripts/data/mail-gishohaku<N>.csv`を前述の「メールCSV」の形式で作成する
    - 1行目はヘッダー（`csv-parser`は`skipLines: 1`で読み飛ばすので中身は任意）
    - 2行目以降は`サークル番号, サークル名, サークル名カナ, サークルジャンル, メールアドレス, ログインURL`の6列
    - メールアドレスとログインURLは1行たりとも取り違えないよう、サークル番号での突き合わせをダブルチェックする

### 手順4. メール本文テンプレートの見直し

`20260901-sendCircleInvitation.ts`の`template`変数を確認し、以下を新回の情報に更新する。

- [ ] `技書博13のサークル配置` → `技書博<N>のサークル配置`
- [ ] 懇親会connpass URL（`https://gishohaku.connpass.com/event/386796/`）
- [ ] 一般参加募集connpass URL（`https://gishohaku.connpass.com/event/372013/`）
- [ ] 提出物情報のNotion URL（`https://gishohaku.notion.site/gishohaku13-submissions`）
- [ ] 搬入搬出情報のNotion URL（`https://gishohaku.notion.site/gishohaku-13-luggage-carry`）
- [ ] バックアップ印刷所のNotion URL（`https://gishohaku.notion.site/gishohaku13-printings`）
- [ ] ポータルサイトURL（`https://gishohaku.notion.site/gishohaku13`）
- [ ] フリーペーパー企画ブログURL（回ごとに差し替え）
- [ ] Podcast宣伝企画の記述（実施しない回では削除）

### 手順5. 招待メール送信

1. DryRunを実行して全件のフォーマット・宛先・URL埋め込みを目視確認する

    ```bash
    cd scripts
    npx tsx 20260901-sendCircleInvitation.ts
    ```
2. 出力の`[SKIP]`行を確認し、必須項目欠損やメール形式不正がないかをチェックする（あればCSVを修正して再度DryRun）
3. 1件だけテスト送信する。スクリプト末尾の`// break;`のコメントを外し、`.env`に運営宛のテストアドレスを`MAIL_FROM`やCCに指定した上で実行する

    ```bash
    DRY_RUN=false npx tsx 20260901-sendCircleInvitation.ts
    ```

    テスト用にCSVの1行目（データ行）を運営スタッフのメールアドレスに置き換えておくと確実。
4. 受信確認: 件名・本文・URL・改行・文字化けをチェックする
5. `// break;`を戻してから全件送信する

    ```bash
    DRY_RUN=false npx tsx 20260901-sendCircleInvitation.ts
    ```
6. 出力ログの`messageId` / `accepted` / `rejected`を目視確認し、`rejected`があれば個別対応する（CSVから該当行だけ抜き出して再送）

#### 切り戻し手順（手順5失敗時）

症状別に対処する。

##### A. 送信途中でネットワーク切断やSMTPエラー等で停止した場合

スクリプトは順次処理（for-of + await）のため、停止した時点で送信済みの件数はログで判別できる。

1. `tee`ログを確認し、最後に「送信完了」が出ているサークル番号を特定する
2. 未送信分だけを含む差分CSV（`mail-gishohaku<N>-remaining.csv`）を作成する
3. スクリプトの`csvPath`を差分CSVに一時的に書き換えて`DRY_RUN=false`で実行する
4. スクリプトの`csvPath`を元に戻す（差分CSVは退避後に削除する）

##### B. 誤った本文で全件送信してしまった場合

メールは取り消せない。訂正メールの配信や別媒体での案内が必要になる可能性があるが、具体的な対応方針は技書博というコミュニティの性質を踏まえて運営リード（ariaki氏・fumiyasac氏等）と合意の上で決定する。本手順書で挙げる例はあくまで一例で、以下のアクションを採るかどうかは個別判断に委ねる。

- 訂正メールを別途配信する（同じmail CSVで`template`だけ差し替えて再送）
- サークル代表者へのDiscord / X（Twitter）経由での案内
- ポストモーテムの記録（DryRunログの目視項目強化やテスト送信の観点追加などの再発防止策検討）

##### C. `[SKIP]`されたサークルの手動フォロー

- `invitation-output-gishohaku<N>.log`から該当サークルの`loginUrl`を抽出する
- Discord DMやX（Twitter）等でログインURLを個別送付する

### 手順6. CircleSelectにサークル配置データを反映

手順1（`createCircles.ts`）実行によりFirestoreのdocIdが確定したので、手順0で空配列スタブとして仮登録した`gishohaku<N>Circles`に実データを投入する。この対応を怠るとTypeScriptビルドエラー（`TS7034` / `TS7005: implicit any[]`）でCloud Buildが失敗することがあるため、本手順も忘れずに実施する。

1. 手順3で作成した`mail-gishohaku<N>.csv`（`loginUrl`に`circleId=<docId>`を含む）からdocIdを抽出する

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
2. 出力を`app/src/components/CircleSelect.tsx`の`gishohaku<N>Circles = [`と`]`の間に貼り込む
3. `npx tsc --noEmit` / `npm run build`がグリーンになることを確認する
4. 別PR（`feature/add_circle_list_gishohaku<N>`等）で提出し、レビュー → マージ → デプロイする

手順0と分けている理由: `gishohaku<N>Circles`の実データにはFirestore docIdが必要で、それは手順1実行後に初めて判明する。フロントエンド登録PR（手順0）と時間差で進めるしかないため分割している。

#### 切り戻し手順（手順6失敗時）

CIビルドが失敗する、または反映後にサークル詳細ページで前後遷移が壊れる状態。

1. 該当PRをRevertしてデプロイする。手順0マージ時点の状態（空配列）に戻る
2. `CircleSelect`の前後遷移だけが機能しない状態になるが、サークル一覧・詳細表示自体は正常動作するため本番影響は限定的
3. データ抽出（上述のPythonスニペット）からやり直して修正PRを再提出する

### 事後対応

- [ ] 送信ログを保存する（`tee`などで残す）
- [ ] `data/invitation-output-gishohaku<N>.log`と`data/mail-gishohaku<N>.csv`を安全な場所へ退避する（機密情報を含むためリポジトリにコミットしない。`.gitignore`にパターンが含まれていることも確認する）
- [ ] Firebaseコンソールで`circles` / `circleInvitations`の件数を最終確認する
- [ ] 参加者から「メールが届かない」等の問い合わせがあった場合に備えて、送信済みリストやエラー行リストを別途保存する

---

## 補足: よくあるハマりどころ

| 症状 | 原因 | 対処 |
| --- | --- | --- |
| `.env`が読めない警告 | 実行ディレクトリが`scripts/`以外 | 必ず`cd scripts`してから実行 |
| CSVの日本語ヘッダーが読めない | UTF-8 BOM付き / SJISで保存されている | UTF-8（BOMなし）で再保存 |
| カテゴリがFirestoreで拾えているのに一覧画面で崩れる | `categoriesByEvent[gishohaku<N>]`に該当keyが未定義 | `app/src/utils/circle.ts`に追加 |
| `sendCircleInvitation`で全件`[SKIP]`になる | ヘッダー行がデータ行として読まれている、または列順が違う | CSVの1行目にヘッダーがあること、列順を「メールCSV」の順に修正 |
| 同じサークルに2通目の招待メールが届いた | `createInvitation`を複数回実行してトークンが重複発行された | Firestoreの`circleInvitations`を確認し古いトークンを無効化する（Issue #16の未対応事項） |
| `Could not load the default credentials`エラー | `GOOGLE_APPLICATION_CREDENTIALS`未設定かつADCも未設定 | 環境変数にJSONパスを設定するか`gcloud auth application-default login`を実行する |
| `/gishohaku<N>/circles`がSSR 500 | フロントエンドで新`eventId`が`userStars`等に未登録 | 手順0のStarsContext / EventId / mapUrl等の登録漏れを確認。ホットフィックスPRで追加する |
| サークル情報更新画面がclient-side exception | `categoriesByEvent[gishohaku<N>]`が未定義で`Object.keys(undefined)` | 手順0の`app/src/utils/circle.ts`に`categories<N>`が登録されているか確認 |
| Cloud Buildのビルドが`TS7034 / TS7005 implicit any[]`で失敗 | `gishohaku<N>Circles`が空配列のまま放置されている | 手順6で実データを投入する。緊急時は型注釈`const gishohaku<N>Circles: {id: string; name: string; booth: string}[] = []`で回避可能 |
