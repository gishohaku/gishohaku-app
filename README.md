# gishohaku-app

## 環境

* Node.js 10
* Next.js 9

## 開発

```shell
$ npm install
$ npm run dev
$ open http://localhost:3000
```

## デプロイ

デプロイはCircleCIで行っている。認証系の情報もCircleCIにもたせているので意識する必要はない。

masterブランチでのみ有効。怪しい変更はPull Requestを作ること。

## scripts

scripts/ディレクトリにはFirestoreのデータを操作するようなスクリプトを配置している。
次のようなコマンドで実行されることを想定している。

できるだけimmutableになるように意識はしているが、処理を確認してから実行すること

```
yarn babel-node scripts/20191001-refactorBookSchema.ts  --extensions=".ts
```