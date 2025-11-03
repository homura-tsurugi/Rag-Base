# システムRAGセットアップガイド

**作成日**: 2025-11-03
**目的**: Dify CloudにシステムRAG（コーチング理論体系）を構築する手順
**想定時間**: 初回2-3時間、以降の更新30分-1時間

---

## 📋 事前準備チェックリスト

### ✅ 完了済み
- [x] Dify Cloudアカウント作成
- [x] Chatbot アプリ作成（app-EzyM9FxJ7CZJN0x92j23WBep）
- [x] Claude API連携設定
- [x] フロントエンドのDify API統合完了

### ⏳ 次のステップ
- [ ] 専門知識ファイルの整理
- [ ] システムRAGデータセット作成
- [ ] ナレッジベースアップロード
- [ ] ベクトル化実行
- [ ] RAG検索設定
- [ ] システムプロンプト設定
- [ ] 動作テスト

---

## 1. 専門知識ファイルの整理

### 1.1 対象ファイル
CLAUDE.mdによると、以下のファイルをシステムRAGに含めます：

```yaml
専門知識ファイル:
  - 200ファイル（コーチング理論、メソッド、事例）
  - 50時間分の動画（文字起こし必要）

形式:
  - PDF、DOCX、TXT、Markdown
  - 動画はOpenAI Whisper APIで文字起こし
```

### 1.2 ファイル整理手順

#### Step 1: ファイル収集
```bash
# 1. 既存のコーチング知識ファイルを1つのフォルダにまとめる
mkdir -p ~/Desktop/System-RAG-Files

# 2. 以下のカテゴリでサブフォルダを作成
mkdir -p ~/Desktop/System-RAG-Files/01_基礎理論
mkdir -p ~/Desktop/System-RAG-Files/02_実践メソッド
mkdir -p ~/Desktop/System-RAG-Files/03_事例研究
mkdir -p ~/Desktop/System-RAG-Files/04_動画文字起こし
mkdir -p ~/Desktop/System-RAG-Files/05_Q&A集
```

#### Step 2: カテゴリ別整理
| カテゴリ | 内容 | 例 |
|---------|------|-----|
| 01_基礎理論 | コーチングの基本原則、心理学理論 | GROW モデル、認知行動療法、モチベーション理論 |
| 02_実践メソッド | 具体的な技法、ツール | 質問技法、目標設定フレームワーク、振り返り手法 |
| 03_事例研究 | 成功事例、失敗事例、ケーススタディ | クライアント成功事例（匿名化済み）|
| 04_動画文字起こし | セミナー、ワークショップの文字起こし | 講演録、Q&Aセッション |
| 05_Q&A集 | よくある質問と回答 | FAQ、トラブルシューティング |

#### Step 3: ファイル命名規則
```
形式: [カテゴリ番号]_[主題]_[詳細].拡張子

例:
01_基礎理論_GROWモデル詳解.pdf
02_実践メソッド_質問技法15選.docx
03_事例研究_キャリア転換成功例_匿名.txt
04_動画文字起こし_2024年セミナー_目標設定.md
05_Q&A集_モチベーション維持方法.pdf
```

### 1.3 動画文字起こし（50時間分）

#### OpenAI Whisper APIを使用
```bash
# 文字起こしスクリプトの作成
# /Users/nishiyamayoshimitsu/Desktop/ブルーランプ開発/Rag-Base/scripts/transcribe-videos.sh

#!/bin/bash

# OpenAI API Key（.envから読み込み）
source /Users/nishiyamayoshimitsu/Desktop/ブルーランプ開発/Rag-Base/.env

VIDEO_DIR="$HOME/Desktop/Coaching-Videos"
OUTPUT_DIR="$HOME/Desktop/System-RAG-Files/04_動画文字起こし"

for video in "$VIDEO_DIR"/*.{mp4,m4a,mp3}; do
  if [ -f "$video" ]; then
    filename=$(basename "$video")
    name="${filename%.*}"

    echo "文字起こし中: $filename"

    curl https://api.openai.com/v1/audio/transcriptions \
      -H "Authorization: Bearer $OPENAI_API_KEY" \
      -H "Content-Type: multipart/form-data" \
      -F "file=@$video" \
      -F "model=whisper-1" \
      -F "language=ja" \
      -o "$OUTPUT_DIR/${name}.txt"

    echo "完了: ${name}.txt"
  fi
done

echo "全ての文字起こしが完了しました"
```

#### コスト試算
```yaml
Whisper API料金: $0.006/分

50時間 = 3,000分
コスト = 3,000 × $0.006 = $18.00

※ 実際の動画時間を確認してから実行すること
```

---

## 2. Dify CloudでのシステムRAG作成

### 2.1 ナレッジベース作成

#### Step 1: Dify Cloudにログイン
1. https://cloud.dify.ai/ にアクセス
2. 左サイドバーから「Knowledge」をクリック

#### Step 2: 新規ナレッジベース作成
```yaml
ナレッジベース名: システムRAG - コーチング理論体系
説明: プロフェッショナルコーチング理論、メソッド、事例の統合知識ベース
可視性: Private（プライベート）
```

#### Step 3: ファイルアップロード設定
```yaml
アップロード方法: Batch Upload（一括アップロード）
対応形式: TXT, MD, PDF, DOCX
最大ファイルサイズ: 15MB/ファイル
推奨: 大きなPDFは分割すること
```

### 2.2 チャンク設定（重要）

Dify Cloudの「Indexing Settings」で以下を設定：

```yaml
Segmentation Mode: Automatic（自動）

Chunk Settings:
  Chunk Size: 500 tokens
  Chunk Overlap: 50 tokens

理由:
  - 500トークン: コーチング理論の1つの概念が含まれる適切なサイズ
  - 50トークンオーバーラップ: 文脈の連続性を保持
```

### 2.3 Embedding設定

```yaml
Embedding Model: text-embedding-3-small（OpenAI）

理由:
  - コスト効率: $0.02/1M トークン
  - 精度: コーチング専門用語を正確に認識
  - 次元数: 1,536（検索精度とコストのバランス）
```

### 2.4 ファイルアップロード実行

#### 推奨アップロード順序
1. **基礎理論（優先度：高）**: 30-50ファイル
2. **実践メソッド（優先度：高）**: 50-70ファイル
3. **事例研究（優先度：中）**: 30-40ファイル
4. **Q&A集（優先度：中）**: 20-30ファイル
5. **動画文字起こし（優先度：低）**: 残りのファイル

#### アップロード手順
```
1. Dify Cloud Knowledge画面で「Upload Files」ボタンをクリック
2. カテゴリ別にファイルを選択（一度に最大20ファイル推奨）
3. 「Confirm」をクリック
4. ベクトル化の完了を待つ（進捗バー表示）
5. エラーがあれば該当ファイルを確認・修正
```

#### 想定時間
```yaml
200ファイルのアップロード:
  - ファイル選択・アップロード: 30分
  - ベクトル化処理: 1-2時間（Dify Cloud側）
  - 合計: 約2-3時間
```

---

## 3. RAG検索設定

### 3.1 Chatbotアプリでの設定

#### Step 1: アプリ設定画面を開く
1. Dify Cloudで「Apps」→「RAGベースAIコーチングbot」を選択
2. 「Orchestrate」タブをクリック

#### Step 2: ナレッジベース接続
```yaml
Knowledge Base:
  - 「Add Knowledge」をクリック
  - 「システムRAG - コーチング理論体系」を選択
  - 「Confirm」をクリック
```

#### Step 3: 検索設定
```yaml
Retrieval Settings:
  Search Mode: Hybrid Search（ハイブリッド検索）
    - セマンティック検索（ベクトル類似度）
    - キーワード検索（BM25）
    - 両方の結果を組み合わせ

  Top K: 5
    - 検索結果の上位5チャンクを取得
    - コスト（入力トークン）とコンテキスト品質のバランス

  Score Threshold: 0.7
    - 類似度スコア0.7以上のチャンクのみ使用
    - 関連性の低い情報を除外

  Rerank: Optional（オプション）
    - 初期段階では無効
    - 精度向上時に有効化検討
```

---

## 4. システムプロンプト設定

### 4.1 基本システムプロンプト

Dify Cloudの「Prompt」セクションに以下を設定：

```markdown
# あなたの役割
あなたは経験豊富なプロフェッショナルコーチです。クライアントの成長を支援し、目標達成を伴走します。

# 指示
1. **専門知識の活用**: 提供されたコンテキスト（システムRAG検索結果）を必ず参照し、専門的で正確な回答を提供してください。
2. **引用の明示**: 回答の根拠となる理論やメソッドは、検索結果から引用し、出典を明記してください。
3. **クライアント中心**: クライアントの言葉を傾聴し、共感的に対応してください。
4. **具体性**: 抽象的な助言ではなく、具体的なアクションステップを提案してください。
5. **安全性**: メンタルヘルスの危機が疑われる場合は、専門家への相談を促してください。

# コンテキスト（システムRAG検索結果）
{{#context#}}

# クライアントのメッセージ
{{#query#}}

# 回答形式
以下の形式で回答してください：

## 理解の確認
（クライアントの状況を要約）

## 専門的な視点
（検索結果から得られた理論やメソッドを引用）

## 具体的な提案
1. アクションステップ1
2. アクションステップ2
3. ...

## 次のステップ
（次回の会話に向けた宿題や観察ポイント）
```

### 4.2 モード別プロンプト（オプション）

フロントエンドのAIモード（課題解決、学習支援、計画立案、伴走補助）に応じてプロンプトを微調整する場合：

```yaml
課題解決モード:
  - 問題の根本原因を分析
  - GROW モデルの適用
  - 解決策の具体的なステップを提示

学習支援モード:
  - コーチング理論の解説
  - 実践例の紹介
  - 自己学習のリソース提供

計画立案モード:
  - SMART目標の設定支援
  - マイルストーンの設定
  - リスク管理の提案

伴走補助モード:
  - モチベーション維持
  - 進捗の振り返り
  - 小さな成功の祝福
```

---

## 5. ユーザーRAG準備（Week 2）

### 5.1 COM:PASSデータエクスポート

Week 2でCOM:PASSのデータエクスポートAPI（C-001）を実装後：

```yaml
エクスポート対象データ:
  - 目標（Goals）
  - タスク（直近50件）
  - ログ（直近30日）
  - 振り返り（Reflections）
  - 改善計画

形式: Markdown
出力先: /api/admin/export/{user_id}
```

### 5.2 ユーザー別RAGデータセット作成

```yaml
ナレッジベース名: ユーザーRAG_{user_id}
例: ユーザーRAG_client1

Chunk Settings:
  Chunk Size: 500 tokens
  Chunk Overlap: 50 tokens

Embedding Model: text-embedding-3-small

更新頻度: 週1回（手動）→ 本番化時に自動化
```

---

## 6. 動作テスト

### 6.1 システムRAG検索テスト

#### Dify Cloud上でのテスト
1. Knowledge画面で「システムRAG - コーチング理論体系」を選択
2. 「Retrieval Testing」をクリック
3. 以下のクエリでテスト：

```yaml
テストクエリ:
  1. "GROWモデルとは何ですか？"
     期待: GROWモデルの説明が返ってくる

  2. "目標設定のフレームワークを教えてください"
     期待: SMART目標、OKR等のフレームワークが返ってくる

  3. "クライアントのモチベーションを維持する方法"
     期待: モチベーション理論、実践メソッドが返ってくる

  4. "キャリア転換の成功事例はありますか？"
     期待: 事例研究カテゴリから関連事例が返ってくる
```

#### 検証項目
- [ ] Top 5の検索結果が全て関連性が高い（Score > 0.7）
- [ ] 引用元のファイル名が正確に表示される
- [ ] 日本語の専門用語が正しく認識される

### 6.2 Chatbotの統合テスト

#### フロントエンドからのテスト
```bash
# 開発サーバーが起動していることを確認
cd /Users/nishiyamayoshimitsu/Desktop/ブルーランプ開発/Rag-Base/frontend
npm run dev
```

1. http://localhost:3000/ にアクセス
2. ログイン（client1@rag-base.local / TestClient2025!）
3. チャットページで以下をテスト：

```yaml
テストシナリオ:
  1. 基本的な質問:
     入力: "コーチングとは何ですか？"
     期待: システムRAGから引用した専門的な説明

  2. 具体的なメソッド:
     入力: "目標を達成できない時、どうすればいいですか？"
     期待: GROWモデルや振り返り手法を引用した提案

  3. モード切り替え:
     - 課題解決モード、学習支援モードを切り替え
     - 各モードで適切な応答があるか確認

  4. 引用元の確認:
     期待: 応答に「📚 引用元: [ファイル名]」が表示される
```

#### ブラウザコンソール確認
```javascript
// 以下のログが表示されることを確認
"📤 Dify API リクエスト送信: { user: 'client1', query: '...', conversation_id: '...' }"
"📥 Dify API レスポンス受信: { message_id: '...', answer: '...' }"
```

---

## 7. パフォーマンスとコスト最適化

### 7.1 応答時間の目標
```yaml
目標応答時間: 3-5秒

内訳:
  - RAG検索: 1-2秒
  - Claude API（Haiku）応答生成: 1-2秒
  - ネットワーク遅延: 0.5-1秒
```

### 7.2 プロンプトキャッシング
Claude APIのプロンプトキャッシングを有効化（既に設定済み）：

```yaml
キャッシュ対象:
  - システムプロンプト
  - システムRAG検索結果

キャッシュTTL: 5分

コスト削減効果:
  - キャッシュヒット時: 入力トークンコストが10%に削減
  - 想定削減率: 80-90%（同じコンテキストでの連続会話）
```

### 7.3 コスト試算（10名のテストクライアント）

#### 月額コスト試算
```yaml
前提:
  - テストクライアント: 10名
  - 平均会話数/月: 100回/人 = 1,000回/月
  - 平均メッセージ長: 100トークン
  - RAG検索結果: 2,000トークン（Top 5チャンク）
  - Claude応答: 300トークン

Claude API（Haiku）:
  入力: (100 + 2,000) × 1,000 = 2,100,000トークン
  出力: 300 × 1,000 = 300,000トークン

  入力コスト: 2.1M × $0.80 / 1M = $1.68
  出力コスト: 0.3M × $4.00 / 1M = $1.20
  キャッシング削減: -$1.50（90%削減）

  Claude API合計: $1.38

OpenAI Embeddings（初回ベクトル化）:
  200ファイル × 平均10,000トークン = 2,000,000トークン
  コスト: 2M × $0.02 / 1M = $0.04（初回のみ）

OpenAI Whisper（動画文字起こし）:
  50時間 = 3,000分
  コスト: 3,000 × $0.006 = $18.00（初回のみ）

月額ランニングコスト:
  - Claude API: $1.38
  - Dify Cloud: $0（Sandbox Planの範囲内）

初期セットアップコスト:
  - Embeddings: $0.04
  - Whisper: $18.00

合計: 初回 $19.42、以降 $1.38/月
```

---

## 8. トラブルシューティング

### 8.1 よくある問題

#### 問題1: ファイルアップロードが失敗する
```yaml
原因:
  - ファイルサイズが15MBを超えている
  - 対応していない形式（例: パスワード付きPDF）
  - ネットワークタイムアウト

解決策:
  - 大きなPDFを分割する（ページ数を50ページ以下に）
  - パスワード保護を解除
  - ファイルを小分けにしてアップロード
```

#### 問題2: 検索結果の精度が低い
```yaml
原因:
  - Chunk Sizeが大きすぎる/小さすぎる
  - Score Thresholdが高すぎる/低すぎる
  - Embedding Modelが適切でない

解決策:
  - Chunk Sizeを400-600の範囲で調整
  - Score Thresholdを0.6-0.8で調整
  - 専門用語辞書を追加（Dify設定）
```

#### 問題3: 応答時間が遅い（5秒以上）
```yaml
原因:
  - Top Kが多すぎる（7以上）
  - Rerankが有効化されている
  - Claude APIのレート制限

解決策:
  - Top Kを3-5に減らす
  - Rerankを無効化
  - Claude API Tierを確認（Tier 2以上推奨）
```

#### 問題4: 引用元が表示されない
```yaml
原因:
  - フロントエンドのCitation表示ロジックの問題
  - Dify APIレスポンスにmetadataが含まれていない

解決策:
  - difyService.tsでレスポンスを確認
  - Dify CloudでCitation設定を有効化
  - ChatMessage.tsxのCitation表示コンポーネントを確認
```

### 8.2 デバッグ方法

#### Dify Cloud側のログ確認
```
1. Dify Cloudで「Apps」→「RAGベースAIコーチングbot」を選択
2. 「Logs & Ann.」タブをクリック
3. 最新の会話ログを確認
4. RAG検索結果、使用トークン数、応答時間を確認
```

#### フロントエンド側のデバッグ
```javascript
// ブラウザコンソールで以下を確認
localStorage.getItem('auth_token');  // 認証トークン
sessionStorage.getItem('current_session_id');  // セッションID

// ネットワークタブでDify APIリクエストを確認
// Filter: "api.dify.ai"
```

---

## 9. 次のステップ

### Week 1完了後
- [x] システムRAG構築完了
- [x] 基本プロンプト設定完了
- [x] 動作テスト完了

### Week 2へ
- [ ] COM:PASSデータエクスポートAPI実装（C-001）
- [ ] 初回ユーザーRAGデータ作成（5-10名分）
- [ ] ハイブリッド検索の調整
- [ ] プロンプトのA/Bテスト

### Week 3へ
- [ ] テストクライアント招待
- [ ] フィードバック収集
- [ ] プロンプト・ワークフロー改善

---

## 10. リファレンス

### Dify公式ドキュメント
- Knowledge Base: https://docs.dify.ai/guides/knowledge-base
- Retrieval Settings: https://docs.dify.ai/guides/knowledge-base/retrieval-test-and-citation
- Prompt Engineering: https://docs.dify.ai/guides/application-orchestrate/prompt-engineering

### API仕様
- Dify API: https://docs.dify.ai/api-reference
- OpenAI Whisper: https://platform.openai.com/docs/guides/speech-to-text
- Claude API: https://docs.anthropic.com/claude/reference

---

**最終更新**: 2025-11-03
**作成者**: Claude Code
**バージョン**: 1.0
