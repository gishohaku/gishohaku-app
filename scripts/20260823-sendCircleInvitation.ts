import fs from "node:fs";
import path from "node:path";
import csvParser from "csv-parser";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

// DryRun(既定 true): 実際のメール送信は行わず、送信予定内容をログ出力するだけ。
// 実送信するときのみ環境変数 DRY_RUN=false を明示的に指定する。
// 例) DRY_RUN=false npx tsx scripts/20260823-sendCircleInvitation.ts
const DRY_RUN = process.env.DRY_RUN !== "false";

const projectRoot = process.cwd();
const envPath = path.resolve(projectRoot, "../.env");

const dotenvResult = dotenv.config({
  path: envPath,
});

if (dotenvResult.error) {
  console.warn(`.envファイルの読み込みに失敗しました: ${envPath}`);
  console.warn(dotenvResult.error);
}

const csvPath = path.resolve(projectRoot, "./data/mail-gishohaku14.csv");

const subject = "【技書博】サークル配置およびログイン情報のご案内";

const template = `<<CIRCLE_NAME>>様

こんにちは。技書博運営事務局です。
技書博14のサークル配置およびログイン情報をご案内します。

==========
サークル <<CIRCLE_NAME>>
配置番号 <<CIRCLE_NUMBER>>
ログインURL <<LOGIN_URL>>
==========

上記ログインURLよりなるべくお早めにお試しいただき、サークル情報をご登録ください。
万が一他サークルの情報が届きましたら、お手数ですが事務局までご連絡ください。

現在懇親会参加者を募集しています。ぜひご参加ください。
※サークル参加者向け
https://gishohaku.connpass.com/event/389493/
※一般参加者向け
https://gishohaku.connpass.com/event/393883/

また、一般参加募集も開始していますので、配置番号などを添えてぜひ告知ご協力ください。
https://gishohaku.connpass.com/event/393530/

今後の提出物について以下に情報をまとめていますので必ずご確認ください。
https://gishohaku.notion.site/gishohaku14-submissions

当日の搬入搬出方法はこちらをご覧ください。
https://gishohaku.notion.site/gishohaku-14-luggage-carry

技書博14のバックアップ印刷所はこちらをご覧ください。
https://gishohaku.notion.site/b4347409e59b831abfc101a4ac2a4da8

見本誌登録はこちらのフォームからお願いします。
https://forms.gle/sHZV4j2cjCEUHoY58

その他、技書博14に関する情報はポータルサイトにまとまっています。
https://gishohaku.notion.site/14-2026-09-13-69c47409e59b8240833a01a080916a4d

今回もフリーペーパー企画を行います。詳細は以下のブログをご確認ください。
https://blog.gishohaku.dev/entry/2026/08/23/160953

サークルアピールにつきましても記載をお願いしております
※締切は8月27日（木）までになります。
https://docs.google.com/presentation/d/1vmPTKx173sLOkQ9TbVLm6YB9yO0jqd8a77YXhRNIkHY/edit?usp=sharing

当日お会いできるのを楽しみにしております。
引き続きどうぞよろしくお願い致します。

-- 
技術書同人誌博覧会
https://gishohaku.dev`;

type CsvRow = Record<string, string>;

type CircleInvitationRow = {
  circleNumber: string;
  circleName: string;
  circleNameKana: string;
  circleGenre: string;
  email: string;
  loginUrl: string;
};

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`環境変数 ${name} が設定されていません`);
  }

  return value;
}

function toCircleInvitationRow(row: string[]): CircleInvitationRow {
  return {
    circleNumber: row[0] ?? "",
    circleName: row[1] ?? "",
    circleNameKana: row[2] ?? "",
    circleGenre: row[3] ?? "",
    email: row[4] ?? "",
    loginUrl: row[5] ?? "",
  };
}

function buildBody(row: CircleInvitationRow): string {
  return template
    .replaceAll("<<CIRCLE_NAME>>", row.circleName)
    .replaceAll("<<CIRCLE_NUMBER>>", row.circleNumber)
    .replaceAll("<<LOGIN_URL>>", row.loginUrl);
}

function readCsvRows(): Promise<CircleInvitationRow[]> {
  return new Promise((resolve, reject) => {
    const rows: CircleInvitationRow[] = [];

    fs.createReadStream(csvPath)
      .pipe(
        csvParser({
          headers: false,
          skipLines: 1,
        }),
      )
      .on("data", (data: CsvRow) => {
        const row = Object.keys(data)
          .sort((a, b) => Number(a) - Number(b))
          .map((key) => data[key] ?? "");

        rows.push(toCircleInvitationRow(row));
      })
      .on("end", () => {
        resolve(rows);
      })
      .on("error", reject);
  });
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function main(): Promise<void> {
  console.log(
    DRY_RUN
      ? "[DRY-RUN] メールは送信しません(送信予定内容をログ出力します)。実送信するには DRY_RUN=false を指定してください。"
      : "[実行] DRY_RUN=false のため実際にメールを送信します。",
  );

  if (!DRY_RUN && !fs.existsSync(envPath)) {
    throw new Error(`.envファイルが見つかりません: ${envPath}`);
  }

  if (!fs.existsSync(csvPath)) {
    throw new Error(`CSVファイルが見つかりません: ${csvPath}`);
  }

  const rows = await readCsvRows();

  // 実送信時のみ SMTP トランスポートを構築する(DryRun では SMTP 設定を要求しない)
  const transporter = DRY_RUN
    ? null
    : nodemailer.createTransport({
        host: requireEnv("SMTP_HOST"),
        port: Number(process.env.SMTP_PORT ?? 587),
        secure: false,
        auth: {
          user: requireEnv("SMTP_USER"),
          pass: requireEnv("SMTP_PASS"),
        },
      });

  const fromAddress = DRY_RUN ? "" : requireEnv("MAIL_FROM");
  const fromName = process.env.MAIL_FROM_NAME ?? "技術書同人誌博覧会";
  const cc = process.env.MAIL_CC;

  for (const [index, row] of rows.entries()) {
    const lineNumber = index + 2;

    if (!row.circleNumber || !row.circleName || !row.email || !row.loginUrl) {
      console.warn(
        `[SKIP] ${lineNumber}行目: 必須項目が不足しています`,
      );
      console.warn(row);
      continue;
    }

    if (!isValidEmail(row.email)) {
      console.warn(
        `[SKIP] ${lineNumber}行目: メールアドレスの形式が不正です: ${row.email}`,
      );
      continue;
    }

    const body = buildBody(row);

    if (DRY_RUN || !transporter) {
      console.log(
        `[DRY-RUN] 送信予定: ${row.circleNumber} ${row.circleName} <${row.email}>`,
      );
      continue;
    }

    console.log(
      `送信中... ${row.circleNumber} ${row.circleName} <${row.email}>`,
    );

    const result = await transporter.sendMail({
      from: {
        address: fromAddress,
        name: fromName,
      },
      to: row.email,
      cc,
      subject,
      text: body,
    });

    console.log(
      `送信完了: ${row.circleNumber} ${row.circleName} <${row.email}>`,
    );
    console.log("messageId:", result.messageId);
    console.log("accepted:", result.accepted);
    console.log("rejected:", result.rejected);

    // まず1件だけテスト送信したい場合は、下のコメントアウトを外してください。
    // break;
  }

  console.log(
    DRY_RUN ? "[DRY-RUN] 送信予定の確認が完了しました" : "すべての送信処理が完了しました",
  );
}

main().catch((error) => {
  console.error("メール送信処理でエラーが発生しました");
  console.error(error);
  process.exit(1);
});