# gishohaku-app

## 環境

* Node.js 10
* Next.js 9

## 開発

### ローカル環境

Node.js環境を準備した上で次のコマンドを実行

```shell
$ npm install
$ npm run dev
$ open http://localhost:3000
```

### Docker環境

docker-composeを準備した状態で次のコマンドを実行

```shell
$ docker-compose up
```

ただし、ライブラリが更新される度に `docker-compose exec app npm install` を行うこと。

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