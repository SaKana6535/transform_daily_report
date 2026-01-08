# 日報変換アプリケーション

日報を様々な形式に変換するWebアプリケーションです。日報の要約・添削・語尾変換・俳句生成を行います。

## 機能

- **要約🤖**: 日報をGitコミットメッセージ風の箇条書きに要約
- **添削✏️**: 日報を4項目フォーマット（①うまくいったこと、②うまくいかなかったこと、③やるべきこと、④きづいたこと）に整える
- **語尾変換🥸**: 日報の語尾を指定したキャラクター風に変換（例: クレヨンしんちゃん、関西弁など）
- **俳句生成🐇**: 日報の内容から俳句を自動生成

## 技術スタック

### フロントエンド
- Next.js 16.1.1
- React 19.2.3
- TypeScript
- Tailwind CSS
- Radix UI

### バックエンド
- Express 5.2.1
- TypeScript
- Google Gemini API (@google/genai)

## セットアップ

### 必要な環境変数

#### バックエンド
`.env`ファイルを`backend/`ディレクトリに作成し、Google AI StudioからGEMINI_API_KEYを取得し、設定してください：

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### インストール

#### バックエンド
```bash
cd backend
npm install
```

#### フロントエンド
```bash
cd frontend
npm install
```

## 実行方法

### 開発モード

#### バックエンド
```bash
cd backend
npm run dev
```
バックエンドサーバーが`http://localhost:3005`で起動します。

#### フロントエンド
```bash
cd frontend
npm run dev
```
フロントエンドアプリケーションが`http://localhost:3004`で起動します。

