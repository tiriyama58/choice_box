# AGENTS.md

## 基本方針
- 要件を満たすために必要な実装に集中し、過剰な機能や変更を加えない。
- 変更は依頼された範囲に限定し、他の機能や既存の挙動に影響を与えない。
- 指示された目的と範囲を逸脱して独自に作業を拡張せず、必要な対応にとどめる。

## 安全性
- 既存のユーザー変更を勝手に上書き・削除しない。
- ファイル削除、破壊的操作、本番環境への変更は、事前に説明して許可を得る。
- APIキーやパスワードなどの秘密情報をコードやGitに含めない。

## 完了報告
- 変更内容、主な変更ファイル、検証結果、未解決の問題を簡潔に報告する。

## デプロイルール
- 本番デプロイは、main への push で quality と e2e が成功したあとの deploy_production だけが行う。
- エージェントは CLI や Dashboard から本番デプロイしない。

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
