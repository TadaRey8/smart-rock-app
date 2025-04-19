### 要件定義ドキュメント

#### 1. プロジェクト概要

- **プロジェクト名**: smart-rock-app
- **作成日**: 2025-04-19
- **目的**: WebアプリでRaspberry Piに接続したサーボモーターを動かし、ドアの鍵を開閉する

#### 2. 利用者・役割

- **エンドユーザー**: スマートフォンから操作する利用者
- **管理者**: 有り（システムの初期設定やユーザー管理を行う担当者）
- **利用シナリオ**: スマートフォンで部屋のドアの鍵を開閉する

#### 3. ハードウェア構成

- **Raspberry Piモデル**: Raspberry Pi Pico W
- **OS**: MicroPython (Python 3をRP2040上で実装した組み込み向けファームウェア) ([raspberrypi.com](https://www.raspberrypi.com/documentation/microcontrollers/micropython.html?utm_source=chatgpt.com))
- **サーボモーター**: TowerPro SG90（9gマイクロサーボ）
  - 動作電圧: 4.8～6.0 V DC ([jsumo.com](https://www.jsumo.com/sg90-micro-servo-motor?utm_source=chatgpt.com))
  - ストールトルク: 1.8 kg·cm (4.8 V時) ([friendlywire.com](https://www.friendlywire.com/projects/ne555-servo-safe/SG90-datasheet.pdf?utm_source=chatgpt.com))
  - 動作速度: 0.1 s/60° (4.8 V時) ([friendlywire.com](https://www.friendlywire.com/projects/ne555-servo-safe/SG90-datasheet.pdf?utm_source=chatgpt.com))
  - 寸法: 約22.2×11.8×31 mm ([friendlywire.com](https://www.friendlywire.com/projects/ne555-servo-safe/SG90-datasheet.pdf?utm_source=chatgpt.com))
- **ドアロック仕様**: 指で回すタイプのノブ錠
  - 錠形式: 回転式ノブ（メカニカルシリンダー式）
  - 接続方法: ノブ部分に3Dプリンターで製作したアダプタを介し、サーボモーターと直結
  - 必要トルク: SG90（1.8 kg·cm以上）で対応可能

#### 4. 機能要件

##### 4.1 Web UI

- ボタン: 施錠（Lock）、開錠（Unlock）
- ステータス表示: 現在の鍵状態（Locked/Unlocked）
- レスポンスタイム: <500ms

##### 4.2 APIエンドポイント

- **POST /v1/lock**: 施錠を実行
- **POST /v1/unlock**: 開錠を実行
- **GET /v1/status**: 鍵状態を取得

#### 5. 非機能要件

- 同時接続数: 最大1接続
- 可用性: 99%稼働
- レスポンス時間（非機能）: 平均<500ms
- ロギング: 操作履歴とエラーログをファイルに保存
- エラーハンドリング: 通信やサーボ制御失敗時のリトライと通知
- ファームウェア更新: OTA／USB経由でのPythonスクリプト更新機能

#### 6. 運用・保守要件

- バックアップ: 設定情報の定期バックアップ
- モニタリング: サービス稼働状況を監視し、障害検知時に管理者へ通知
- ドキュメント: インストール手順・運用手順書の整備

#### 7. セキュリティ要件

- TLS証明書自動更新: Let’s EncryptのACME利用
- ファームウェア署名検証: 不正改ざん防止
- ネットワーク隔離: VLANやファイアウォールによるアクセス制御

#### 9. システム設計

##### 9.1 アーキテクチャ概要

- Webブラウザ（スマホ） → Nginx リバースプロキシ → Node.js Webアプリ → Raspberry Pi Pico W MicroPythonサーバ → SG90サーボ制御 ([blog.logrocket.com](https://blog.logrocket.com/how-to-run-node-js-server-nginx/?utm_source=chatgpt.com), [randomnerdtutorials.com](https://randomnerdtutorials.com/raspberry-pi-pico-web-server-micropython/?utm_source=chatgpt.com))
- DockerはRaspberry Pi 4やサーバー上でNode.jsとNginxをコンテナ化して運用します ([reddit.com](https://www.reddit.com/r/docker/comments/15jkent/docker_on_raspberry_pi_why_and_how/?utm_source=chatgpt.com), [sunfounder.com](https://www.sunfounder.com/blogs/news/raspberry-pi-docker-from-installation-to-advanced-usage-and-troubleshooting?srsltid=AfmBOopZcwud6Psi3X8fRVl01nbwn8urLfpL6DPYYFbeQisuIq2HjA4c\&utm_source=chatgpt.com))
- NginxはSSL終端、ロードバランシング、静的コンテンツ配信を担当します ([dev.to](https://dev.to/imsushant12/nginx-for-nodejs-applications-what-why-and-how-to-use-it-1gbn?utm_source=chatgpt.com))

##### 9.2 コンポーネント詳細

- **Nginx**: Webサーバおよびリバースプロキシ。クライアントからのHTTPSリクエストを受け、Node.jsコンテナへフォワード ([betterstack.com](https://betterstack.com/community/guides/scaling-nodejs/nodejs-reverse-proxy-nginx/?utm_source=chatgpt.com))
- **Node.jsアプリケーション**: HTML/CSS/JSを提供し、API経路 `/lock`、`/unlock`、`/status` を実装。ポート3000で動作 ([blog.logrocket.com](https://blog.logrocket.com/how-to-run-node-js-server-nginx/?utm_source=chatgpt.com))
- **Raspberry Pi Pico W**: MicroPythonで非同期Webサーバを実装し、GPIO経由でサーボを制御 ([randomnerdtutorials.com](https://randomnerdtutorials.com/raspberry-pi-pico-web-server-micropython/?utm_source=chatgpt.com), [randomnerdtutorials.com](https://randomnerdtutorials.com/raspberry-pi-pico-w-asynchronous-web-server-micropython/?utm_source=chatgpt.com))
- **Docker**: マルチステージビルドと公式ベースイメージを推奨 ([docs.docker.com](https://docs.docker.com/build/building/best-practices/?utm_source=chatgpt.com))

##### 9.3 通信シーケンス

1. ユーザーがUIのボタンをクリック → ブラウザが `POST /lock` リクエストを送信
2. NginxがリクエストをNode.jsの `/lock` にプロキシ → Node.jsがリクエストを受領
3. Node.jsがRaspberry Pi Pico WのエンドポイントへHTTP POST送信
4. Pico Wがサーボを動作 → `200 OK`を返却
5. Node.jsがブラウザへレスポンスを返却 → UIがステータスを更新 ([stackoverflow.com](https://stackoverflow.com/questions/45193586/good-example-of-a-sequence-diagram-for-web-service-calls?utm_source=chatgpt.com), [sequencediagram.org](https://sequencediagram.org/instructions.html?utm_source=chatgpt.com))

##### 9.4 Docker構成

- `docker-compose.yml` 例:
  ```yaml
  version: '3'
  services:
    nginx:
      image: nginx:latest
      ports:
        - '80:80'
        - '443:443'
      volumes:
        - ./nginx/conf.d:/etc/nginx/conf.d
    web:
      build:
        context: ./node-app
        dockerfile: Dockerfile
      ports:
        - '3000:3000'
  ```
- ベストプラクティス: `.dockerignore` の活用、不要パッケージの排除 (docs.docker.com)

#### 10. API詳細設計

##### 10.1 全体方針

- 本APIはRESTful設計に準拠し、リソース指向のURL設計を採用します。
- バージョニングはURIバージョンプレフィックス `/v1/` を使用します。
- レート制限を設け、同一IPからのリクエストを1分間あたり10回に制限します。 ([tyk.io](https://tyk.io/learning-center/api-rate-limiting/?utm_source=chatgpt.com))
- `GET /v1/status` には `Cache-Control: no-cache` ヘッダーを設定し、常に最新状態を取得します。 ([restfulapi.net](https://restfulapi.net/caching/?utm_source=chatgpt.com))

##### 10.2 エンドポイント定義

| メソッド | エンドポイント    | 説明     | リクエストボディ | レスポンス                      | ステータスコード           |
| ---- | ---------- | ------ | -------- | -------------------------- | ------------------ |
| POST | /v1/lock   | 鍵を施錠   | -        | `{ "status": "locked" }`   | 200, 401, 429, 500 |
| POST | /v1/unlock | 鍵を開錠   | -        | `{ "status": "unlocked" }` | 200, 401, 429, 500 |
| GET  | /v1/status | 鍵状態を取得 | -        | `{ "status": "locked" }`   | 200, 401           |

##### 10.3 リクエスト/レスポンススキーマ

- リクエストは `application/json` を期待し、空のオブジェクトを許容します。
- レスポンスはJSON形式とし、`status` フィールドを含めます。

##### 10.4 エラー設計

- HTTPステータスコードは標準規約に従い、クライアントエラーは4xx、サーバエラーは5xxを返却します。 ([merge.dev](https://www.merge.dev/blog/rest-api-rate-limits?utm_source=chatgpt.com))
- エラー時は `429 Too Many Requests` を利用し、 `X-RateLimit-Remaining` 等のヘッダーを含めます。 ([getknit.dev](https://www.getknit.dev/blog/10-best-practices-for-api-rate-limiting-and-throttling?utm_source=chatgpt.com))
- エラーレスポンスは下記形式とし、`error` フィールドを含めます:

```json
{
  "error": {
    "code": 401,
    "message": "Unauthorized"
  }
}
```

##### 10.5 ドキュメント化

- OpenAPI (Swagger) 形式で仕様を定義し、Swagger UIにより可視化します。

##### 10.6 ログ出力

- APIリクエストとレスポンスをJSON形式でファイルに保存します。
- 保存フォーマット:

```json
{
  "timestamp": "2025-04-19T12:34:56Z",
  "method": "POST",
  "endpoint": "/v1/lock",
  "status": 200,
  "ip": "192.168.1.10"
}
```



##### 11 ファイル構成

```
smart-rock-app/

├── nginx/

│   └── conf.d/

│       └── default.conf          # Nginxの設定（リバースプロキシやSSL終端）

│

├── node-app/

│   ├── public/

│   │   ├── index.html            # Web UI（ロック・アンロックボタンなど）

│   │   ├── style.css             # UIのスタイル（シンプルでクールなデザイン）

│   │   └── script.js             # UIのJS処理（API呼び出しとステータス更新）

│   │

│   ├── routes/

│   │   └── api.js                # /v1/lock, /v1/unlock, /v1/status API実装

│   │

│   ├── logs/

│   │   └── access.log            # APIリクエストログ（リクエスト時の詳細保存）

│   │

│   ├── server.js                 # Expressサーバ設定とルーティング

│   ├── package.json              # Node.jsパッケージと依存関係

│   └── .env                      # 環境変数（APIキーやデータベース設定など）

│

├── docker-compose.yml            # Docker構成（コンテナの設定）

└── .dockerignore                 # Dockerビルド時に除外するファイル・ディレクトリ
```