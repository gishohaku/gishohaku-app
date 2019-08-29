# gishohaku-app

## 開発

Cloud Functions for Firebaseの制約でNode.js v10を使う。

```shell
$ cd app/
$ node server.js
```

## デプロイ

デプロイはCircleCIで行っている。認証系の情報もCircleCIにもたせているので意識する必要はない。

masterブランチでのみ有効。怪しい変更はPull Requestを作ること。
