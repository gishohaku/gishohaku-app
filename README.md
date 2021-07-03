# gishohaku-app

## 環境

- Node.js 14
- Next.js 10

## 開発

### 環境変数の設定

環境変数はリポジトリで管理せず各自の環境で設定してください。
[direnv](https://github.com/direnv/direnv)を使って管理するのがおすすめです。

設定例を示します。

```
export API_KEY=
export PROJECT_ID=
```

### ローカル環境

Node.js 14 を導入した環境で次のコマンドを実行を実行してください。

```shell
$ cd app
$ npm install
$ npm run dev
$ open http://localhost:3000
```

## デプロイ

デプロイは Google Cloud Build で行っている。
master ブランチに push すると本番に影響があるので、怪しい変更は Pull Request を作ること。

## scripts

scripts/ディレクトリには Firestore のデータを操作するようなスクリプトを配置している。
npm-scripts の runscript に実行したいファイルを渡して利用する。

できるだけ immutable になるように意識はしているが、処理を確認してから実行すること

```
yarn runscript scripts/20191001-refactorBookSchema.ts
```
