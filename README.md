# 🌙 何時寝~NANJINE~ - 進捗共有アプリ

**理系大学生や看護学生、ズボラで課題に追われる人たちのための進捗共有アプリ**

## 📋 概要

何時寝~NANJINE~は、学生や忙しい人たちが課題の進捗状況をリアルタイムで共有できるWebアプリケーションです。ポモドーロ技法を活用しながら、友達と一緒に頑張ることでモチベーションを維持し、効率的に作業を進めることができます。

## ✨ 主な機能

### 🍅 ポモドーロタイマー
- 25分の作業時間と5分の休憩時間
- カスタマイズ可能な時間設定（50分モードも選択可能）
- タイマーの無効化機能
- セッション完了時の自動進捗更新

### 📝 タスク管理
- タスクの作成、編集、削除
- 進捗状況の可視化（0-100%）
- 予想ポモドーロ数の設定
- 締切日の設定と管理
- リアルタイムの就寝時刻予測

### 🏃‍♂️ マラソンビジュアライゼーション
- 進捗状況をマラソンランナーとして可視化
- 友達の進捗状況をリアルタイムで確認
- 作業中・休憩中の状態表示
- インタラクティブなトラック表示

### 👥 フレンド機能
- 友達の進捗状況の確認
- 現在のタスクと進捗の共有
- 予想就寝時刻の表示
- オンライン状態の確認

## 🛠 技術スタック

- **フロントエンド**: React 18, TypeScript
- **ビルドツール**: Vite
- **スタイリング**: CSS Modules
- **アイコン**: Lucide React
- **日付処理**: date-fns
- **ルーティング**: React Router

## 🚀 セットアップ

### 必要な環境
- Node.js (v18以上推奨)
- npm または yarn

### インストール

1. リポジトリをクローン
```bash
git clone https://github.com/your-username/nanjine-app.git
cd nanjine-app
```

2. 依存関係をインストール
```bash
npm install
```

3. 開発サーバーを起動
```bash
npm run dev
```

4. ブラウザで `http://localhost:5173` を開く

### ビルド

```bash
npm run build
```

### プレビュー

```bash
npm run preview
```

## 📁 プロジェクト構造

```
src/
├── components/          # Reactコンポーネント
│   ├── PomodoroTimer.tsx    # ポモドーロタイマー
│   ├── TaskManager.tsx      # タスク管理
│   ├── MarathonTrack.tsx    # マラソン可視化
│   └── FriendsList.tsx      # フレンドリスト
├── hooks/              # カスタムフック
│   └── usePomodoro.ts      # ポモドーロロジック
├── types/              # TypeScript型定義
│   └── index.ts           # アプリケーション型
├── App.tsx             # メインアプリケーション
├── App.css             # スタイルシート
└── main.tsx            # エントリーポイント
```

## 🎯 ターゲットユーザー

- **理系大学生**: レポートや実験の進捗管理
- **看護学生**: 実習準備や課題の管理
- **忙しい学生**: 複数の課題を効率的に進めたい人
- **ズボラな人**: モチベーション維持が必要な人

## 🔮 今後の予定機能

- [ ] ユーザー認証システム
- [ ] リアルタイム同期（WebSocket）
- [ ] 通知機能
- [ ] 統計とレポート機能
- [ ] カスタマイズ可能なテーマ
- [ ] モバイルアプリ版
- [ ] グループ機能
- [ ] 目標設定と達成記録

## 🤝 貢献

プルリクエストや Issue の報告を歓迎します！

### 開発に参加するには

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。詳細は [LICENSE](LICENSE) ファイルを参照してください。

## 📞 お問い合わせ

質問や提案がある場合は、Issue を作成するか、以下までご連絡ください：

- GitHub: [@your-username](https://github.com/your-username)
- Email: your-email@example.com

---

**何時寝~NANJINE~で、みんなで一緒に頑張りましょう! 🌙✨**
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
