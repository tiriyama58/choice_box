# ChoiceBox

登録した選択肢から、ランダムに1つを選ぶ Web アプリ（MVP）。

## 機能

- 選択肢の追加・一覧表示・削除
- ルーレット回転（減速して当選の選択肢で停止）と結果表示
- ブラウザの localStorage に保存（リロード後も保持）

## 必要環境

- Node.js 24（`.nvmrc` と `package.json` の `engines` で固定）
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
npm run test:e2e  # E2E テスト（Playwright。初回は npx playwright install chromium）
```

## CI/CD

GitHub Actions（`.github/workflows/ci-cd.yml`）でテストとデプロイを行います。

| ジョブ | 実行タイミング | 内容 |
|--------|----------------|------|
| `quality` | PR と main への push | `npm ci` → lint → ユニットテスト → ビルド |
| `e2e` | `quality` 成功後 | Playwright（Chromium）で E2E |
| `deploy_preview` | 同一リポジトリの PR で `e2e` 成功後 | Vercel にプレビューデプロイし、PR にプレビュー URL をコメント（追加 push で同じコメントを更新） |
| `deploy_production` | main への push で `e2e` 成功後 | Vercel に本番デプロイ |

- Vercel の Git 連携による自動デプロイは `vercel.json` で全ブランチ無効です。デプロイはこのワークフローだけが行います。
- fork と Dependabot の PR は Secrets が渡らないため、`quality` と `e2e` だけ実行し、プレビューデプロイはスキップします。
- 必要な Repository secrets: `VERCEL_TOKEN`、`VERCEL_ORG_ID`、`VERCEL_PROJECT_ID`（ID は `vercel link` 後の `.vercel/project.json` にあります）。

## データの保存場所

localStorage キー: `choicebox:choices`
