# Text Highlighter - Google拡張機能

## 概要
Webページ上で選択したテキストの背景色を変更できるGoogle Chrome拡張機能です。

## 技術スタック
- **Vite** - 高速なビルドツール
- **TypeScript** - 型安全な開発
- **@crxjs/vite-plugin** - Chrome拡張機能用Viteプラグイン（ホットリロード対応）

## 開発方法

### 初回セットアップ
```bash
# 依存パッケージをインストール
npm install
```

### 開発モード（ホットリロード対応）
```bash
# 開発サーバーを起動
npm run dev
```

開発サーバーが起動したら：
1. Chromeで `chrome://extensions/` を開く
2. 「開発者モード」をONにする
3. 「パッケージ化されていない拡張機能を読み込む」をクリック
4. プロジェクトの`dist`フォルダを選択

コードを変更すると、自動的に拡張機能がリロードされます。

### 本番ビルド
```bash
# プロダクション用にビルド
npm run build
```

ビルドされたファイルは`dist`フォルダに出力されます。

## インストール方法

### 開発版のインストール（ローカルファイルから）
1. **リポジトリのダウンロード**
   - このリポジトリをクローンまたはダウンロード
   ```bash
   git clone git@github.com:iririn1998/text-highlighter.git
   cd text-highlighter
   npm install
   npm run build
   ```

2. **Chrome拡張機能の開発者モードを有効化**
   - Google Chromeを開く
   - アドレスバーに `chrome://extensions/` と入力してアクセス
   - 右上の「開発者モード」をONにする

3. **拡張機能の読み込み**
   - 「パッケージ化されていない拡張機能を読み込む」ボタンをクリック
   - ビルドされた `dist` フォルダを選択
   - 拡張機能が正常に読み込まれると、ツールバーにアイコンが表示されます

## 使用方法

### 基本的な使い方
1. **テキストをハイライト**
   - マウスドラッグでテキストを選択
   - 右クリックでメニューから「ハイライトを追加」を押下

2. **ハイライトを削除**
   - ハイライト箇所をダブルクリック

3. **カスタム色を設定**
   - 拡張機能のポップアップから設定画面を開く
   - カラーピッカーで任意の色を作成・命名

## プロジェクト構造
```
text-highlighter/
├── src/
│   ├── background/         # バックグラウンドスクリプト
│   │   ├── backgroundMain.ts
│   │   ├── contextMenuHandler.ts
│   │   ├── messageHandler.ts
│   │   └── serviceWorkerManager.ts
│   ├── content/           # コンテンツスクリプト
│   │   ├── contentMain.ts
│   │   ├── extensionContext.ts
│   │   ├── highlightManager.ts
│   │   ├── storageHelper.ts
│   │   └── textSelection.ts
│   ├── popup/             # ポップアップUI
│   │   ├── popupMain.ts
│   │   ├── colorManager.ts
│   │   └── uiController.ts
│   ├── shared/            # 共通ユーティリティ
│   │   ├── constants.ts
│   │   └── utils.ts
│   ├── popup.html         # ポップアップHTML
│   └── style.css          # スタイルシート
├── icons/                 # アイコン画像
├── vite.config.ts         # Vite設定
├── tsconfig.json          # TypeScript設定
└── package.json           # パッケージ設定
```

