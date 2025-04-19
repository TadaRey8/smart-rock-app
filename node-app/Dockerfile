# Node.jsの基本イメージを使用
FROM node:18

# 作業ディレクトリを作成
WORKDIR /app

# パッケージファイルをコンテナにコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# アプリケーションのソースコードをコピー
COPY . .

# サーバーを起動するコマンド
CMD ["node", "server.js"]

# コンテナのポート3000を公開
EXPOSE 3000