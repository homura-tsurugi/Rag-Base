# Dify API 連携診断レポート

## 📋 診断日時
2025-11-02

## 🔍 問題の症状
- Networkタブにリクエストが表示されている（APIリクエストは送信されている）
- しかし応答が定型文のまま（モックのような応答）
- コンソールには「Dify API（本番）」と表示されている

## 🎯 根本原因の特定

### 問題1: ChatPageがモックサービスを直接インポート
**ファイル**: `/frontend/src/pages/protected/ChatPage.tsx`

**問題のコード**:
```typescript
import {
  mockSendMessage,
  mockGetConversations,
  mockGetMessages,
  mockCreateConversation,
  groupConversationsByDate,
} from '@/services/api/mockChatService';
```

**影響**:
- chatService.tsで環境変数に基づいてDify APIを使用する設定になっていても、
  ChatPageコンポーネントが直接mockChatServiceをインポートしていたため、
  常にモックの応答が返されていた

**修正内容**:
```typescript
import {
  sendMessage,
  getConversations,
  getMessages,
  createConversation,
  groupConversationsByDate,
} from '@/services/api/chatService';
```

### 問題2: TypeScript厳格モードの警告
**ファイル**: `/frontend/src/services/api/chatService.ts`

**問題のコード**:
```typescript
import {
  mockSendMessage,
  mockGetConversations,
  // ... (未使用のimport)
} from './mockChatService';
```

**影響**:
- `USE_MOCK_API = false`に設定されていたため、mockChatServiceのimportが未使用状態
- TypeScriptビルドエラーが発生

**修正内容**:
```typescript
// Mock imports (currently unused, kept for future development)
// import {
//   mockSendMessage,
//   ...
// } from './mockChatService';
```

## ✅ 実施した修正

### 1. /pages/protected/ChatPage.tsx の修正
- **変更箇所**: インポート文と関数呼び出し
- **修正内容**:
  - `mockSendMessage` → `sendMessage`（user_id パラメータ追加）
  - `mockGetConversations` → `getConversations`
  - `mockGetMessages` → `getMessages`
  - `mockCreateConversation` → `createConversation`

### 2. /pages/ChatPage/index.tsx の修正
- **変更箇所**: インポート文と関数呼び出し
- **修正内容**:
  - `mockSendMessage` → `sendMessage`（user_id パラメータ追加）
  - `mockGetConversations` → `getConversations`
  - `mockGetMessages` → `getMessages`
  - `mockCreateConversation` → `createConversation`

### 3. /pages/ConversationHistoryPage/index.tsx の修正
- **変更箇所**: インポート文と関数呼び出し
- **修正内容**:
  - `mockGetConversations` → `getConversations`
  - `mockDeleteConversation` → `deleteConversation`

### 4. chatService.tsの修正
- **変更箇所**: 未使用のimport文
- **修正内容**: mockChatServiceのimportをコメントアウト
- **理由**: TypeScript strict modeでの未使用import警告を解消

### 5. difyService.tsの改善
- **変更箇所**: sendMessage関数
- **修正内容**: 詳細なログ出力を追加（デバッグ用）
  ```typescript
  console.log('📤 Dify API リクエスト送信:', { ... });
  console.log('📥 Dify API レスポンス受信:', { ... });
  ```
- **目的**: API通信の可視化とデバッグの容易化

## 🧪 検証結果

### API接続テスト
**テストスクリプト**: `test-dify-api.cjs`

**結果**:
```
✅ ステータスコード: 200
✅ 成功！Dify APIからの応答:
こんにちは！接続テストの確認ができました。何かお手伝いできることがありますか？
```

**結論**: Dify API自体は正常に動作している

### ビルドテスト
```bash
npm run build
```

**結果**:
```
✓ built in 9.84s
```

**結論**: TypeScriptエラーなし、正常にビルド成功

## 📊 環境設定の確認

### .envファイル
```
VITE_DIFY_API_KEY=app-xxxxxxxxxxxxxxxxxxxxx
VITE_DIFY_API_URL=https://api.dify.ai/v1
VITE_USE_MOCK_API=false
```

### chatService.ts設定
```typescript
const USE_MOCK_API = false; // 強制的にDify APIを使用
```

## 🚀 動作確認手順

### 1. 開発サーバーの再起動
```bash
cd /Users/nishiyamayoshimitsu/Desktop/ブルーランプ開発/Rag-Base/frontend
npm run dev
```

### 2. ブラウザでアクセス
```
http://localhost:3000
```

### 3. ログイン
- Email: `client1@rag-base.local`
- Password: `TestClient2025!`

### 4. チャットページで確認
- メッセージ送信: 「こんにちは」
- **期待される動作**:
  - コンソールに「📤 Dify API リクエスト送信:」が表示
  - コンソールに「📥 Dify API レスポンス受信:」が表示
  - **実際のClaude APIからの応答**が表示される（定型文ではない）
  - Networkタブに `chat-messages` リクエストが表示
  - レスポンスボディに `answer` フィールドが含まれる

### 5. コンソールログの確認
開発者ツール（F12）→ Consoleタブで以下を確認:
```
🔌 チャットサービスモード: Dify API（本番）
📤 Dify API リクエスト送信: { url: ..., user_id: ..., content: ... }
📥 Dify API レスポンス受信: { status: 200, conversation_id: ..., answer_preview: ... }
```

## 🔧 トラブルシューティング

### 問題: まだモックの応答が返ってくる

**チェック項目**:
1. 開発サーバーを再起動したか？
   ```bash
   # Ctrl+C で停止後
   npm run dev
   ```

2. ブラウザのキャッシュをクリアしたか？
   - Chrome: Cmd+Shift+Delete → キャッシュクリア
   - または「完全リロード」: Cmd+Shift+R

3. .envファイルは正しいか？
   ```bash
   cat .env | grep VITE_USE_MOCK_API
   # 出力: VITE_USE_MOCK_API=false
   ```

### 問題: APIキーエラー (401 Unauthorized)

**チェック項目**:
1. .envファイルにAPIキーが設定されているか？
   ```bash
   cat .env | grep VITE_DIFY_API_KEY
   ```

2. APIキーは有効か？
   - Dify Cloudダッシュボードで確認
   - 必要に応じて再生成

### 問題: CORSエラー

**原因**: ブラウザのセキュリティ制限

**解決策**:
- Dify Cloudの場合、通常はCORS設定済み
- セルフホストの場合、Difyサーバー側でCORS設定が必要

## 📝 次のステップ

### 1. E2Eテストの実装
- [ ] クライアントチャットページのE2Eテスト作成
- [ ] 管理画面の会話履歴E2Eテスト作成

### 2. 本番デプロイ準備
- [ ] 環境変数の本番設定
- [ ] エラーハンドリングの強化
- [ ] レート制限の実装

### 3. パフォーマンス最適化
- [ ] プロンプトキャッシングの有効化
- [ ] ストリーミング応答の実装（オプション）

## 🎉 結論

**修正完了**: ChatPageがDify API経由で実際のClaudeからの応答を受信するように修正しました。

**主な変更点**:
1. ChatPage.tsxのインポートをmockChatServiceからchatServiceに変更
2. chatService.tsの未使用importをクリーンアップ
3. difyService.tsにデバッグログを追加

**動作確認方法**:
1. 開発サーバーを再起動
2. ブラウザのキャッシュをクリア
3. ログイン後、チャットページでメッセージを送信
4. コンソールログで「📤 Dify API リクエスト送信」「📥 Dify API レスポンス受信」を確認

**期待される結果**:
- 実際のClaude APIからの応答が表示される
- 毎回異なる応答が返る（定型文ではない）
- Networkタブで正常なAPI通信が確認できる
