# Node.jsの軽量イメージを使用
FROM node:18-slim

# 作業ディレクトリを作成
WORKDIR /app

# パッケージファイルをコンテナにコピー
COPY package*.json ./

# 依存関係をインストールし、脆弱性を修正
RUN npm install && npm audit fix

# アプリケーションのソースコードをコピー
COPY . .

# サーバーを起動するコマンド
CMD ["node", "server.js"]

# コンテナのポート3000を公開
EXPOSE 3000