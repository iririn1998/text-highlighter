# Text Highlighter - Chrome拡張機能

<p align="center">
  <img src="../icons/icon128.png" alt="Text Highlighter" width="128" height="128">
</p>

<p align="center">
  Webページ上で選択したテキストの背景色を変更できるGoogle Chrome拡張機能です。
</p>

> 🇺🇸 [English version is here](README_en.md)

## ✨ 特徴

- 🎨 **4色のプリセットカラー** — 黄・緑・赤・青からワンクリックで選択
- 🖱️ **右クリックメニュー対応** — テキストを選択して右クリックするだけ
- 🗑️ **ダブルクリックで削除** — ハイライトの解除も簡単
- 💾 **設定の自動保存** — 選択した色はChrome Storageに保存され、デバイス間で同期
- 🌐 **日本語・英語対応** — ブラウザの言語設定を自動検出
- 🔒 **プライバシー重視** — データの外部送信は一切なし

## 📦 技術スタック

| 技術 | 用途 |
|------|------|
| [Vite](https://vitejs.dev/) | 高速なビルドツール |
| [TypeScript](https://www.typescriptlang.org/) | 型安全な開発 |
| [@crxjs/vite-plugin](https://crxjs.dev/vite-plugin) | Chrome拡張機能用Viteプラグイン |
| [Biome](https://biomejs.dev/) | Lint・フォーマッター |

## 🚀 インストール方法

### リポジトリからビルド

```bash
git clone https://github.com/iririn1998/text-highlighter.git
cd text-highlighter
npm install
npm run build
```

### Chromeに読み込み

1. Google Chromeで `chrome://extensions/` を開く
2. 右上の「**開発者モード**」をONにする
3. 「**パッケージ化されていない拡張機能を読み込む**」をクリック
4. ビルドされた `dist` フォルダを選択
5. ツールバーにアイコンが表示されたらインストール完了です

## 📖 使い方

### テキストをハイライトする

1. マウスドラッグでテキストを選択
2. 右クリック →「**ハイライトを追加**」を選択

### ハイライトを削除する

- ハイライトされたテキストを**ダブルクリック**

### ハイライトの色を変更する

1. ツールバーの拡張機能アイコンをクリック
2. ポップアップから好みの色を選択（黄・緑・赤・青）
3. 選択した色は自動的に保存されます

## 🛠️ 開発方法

### 初回セットアップ

```bash
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

開発サーバーが起動したら、Chromeで `chrome://extensions/` を開き、`dist` フォルダを拡張機能として読み込んでください。コードを変更すると自動的にリロードされます。

### ビルド

```bash
npm run build
```

ビルドされたファイルは `dist` フォルダに出力されます。

### その他のコマンド

| コマンド | 説明 |
|---------|------|
| `npm run type-check` | TypeScriptの型チェック |
| `npm run lint` | Biomeによるリント |
| `npm run format` | Biomeによるフォーマット |
| `npm run check` | Biomeによるリント＋フォーマット |

## 📁 プロジェクト構成

```
text-highlighter/
├── src/
│   ├── background/    # Service Worker（コンテキストメニュー管理）
│   ├── content/       # コンテンツスクリプト（ハイライト処理）
│   ├── popup/         # ポップアップUI（色選択）
│   ├── shared/        # 共通定数・型定義・i18n
│   ├── popup.html     # ポップアップHTML
│   └── style.css      # ハイライト用CSS
├── icons/             # 拡張機能アイコン（16/32/48/128px）
├── manifest.json      # Chrome拡張機能マニフェスト（v3）
├── vite.config.ts     # Vite設定
├── tsconfig.json      # TypeScript設定
└── biome.json         # Biome設定
```

## 🔒 プライバシーポリシー

この拡張機能は、ユーザーのプライバシーを最優先に設計されています。

- 個人情報の収集は一切行いません
- ハイライトしたテキストの内容や閲覧履歴は記録しません
- 保存するのはハイライトの色設定のみです（Chrome Storage Sync）
- 外部サーバーへのデータ送信は行いません

詳しくは [PRIVACY_POLICY.md](../PRIVACY_POLICY.md) をご覧ください。
