# Scripts Directory

このディレクトリには、RAGベースAIコーチングbotのセットアップと運用のためのスクリプトが含まれています。

## スクリプト一覧

### 1. `transcribe-videos.sh`
**目的**: コーチング動画をOpenAI Whisper APIを使用して文字起こしする

**使用方法**:
```bash
# 1. 動画ファイルを準備
mkdir -p ~/Desktop/Coaching-Videos
# 動画ファイルを ~/Desktop/Coaching-Videos/ に配置

# 2. 環境変数を設定（プロジェクトルートの .env に OPENAI_API_KEY が必要）
cd /Users/nishiyamayoshimitsu/Desktop/ブルーランプ開発/Rag-Base

# 3. スクリプトを実行
bash scripts/transcribe-videos.sh
```

**対応形式**: mp4, m4a, mp3, wav, webm
**料金**: $0.006/分
**出力先**: `~/Desktop/System-RAG-Files/04_動画文字起こし/`

**注意事項**:
- APIレート制限を避けるため、1ファイルずつ処理し、1秒間隔を空けます
- 既に文字起こし済みのファイルは自動的にスキップされます
- コスト試算が表示されるので、実行前に確認してください

---

## 今後追加予定のスクリプト

### `export-compass-data.sh`
COM:PASSからユーザーデータをエクスポートし、ユーザーRAG用のMarkdownファイルを生成（Week 2実装予定）

### `backup-dify-knowledge.sh`
Dify Cloudのナレッジベースをバックアップするスクリプト（Week 3実装予定）

---

**最終更新**: 2025-11-03
