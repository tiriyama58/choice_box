# ChoiceBox

登録した選択肢から、ランダムに1つを選ぶ Web アプリ（MVP）。

## 機能

- 選択肢の追加・一覧表示・削除
- ルーレット回転（減速して当選の選択肢で停止）と結果表示
- ブラウザの localStorage に保存（リロード後も保持）

## 必要環境

- Node.js 20 以上（推奨）
- npm

## ローカルでの起動

```bash
npm install
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

## その他のコマンド

```bash
npm run lint    # ESLint
npm run test    # ユニットテスト（Vitest）
npm run build   # 本番ビルド
npm run start   # 本番ビルド後の起動（build の後）
```

## データの保存場所

localStorage キー: `choicebox:choices`
