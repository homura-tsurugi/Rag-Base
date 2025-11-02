# RAGシステム用Embeddings API調査レポート

**調査日**: 2025年11月2日
**対象システム**: COM:PASS RAGシステム
**対象言語**: 日本語（メンタルヘルス・カウンセリング専門用語）

---

## エグゼクティブサマリー

日本語RAGシステムに最適なEmbeddings APIとして、以下の3つを推奨します:

1. **OpenAI text-embedding-3-small** - コストパフォーマンス最優先
2. **Voyage AI voyage-multilingual-2** - 日本語品質とコストのバランス重視
3. **Sentence Transformers (self-hosted)** - プライバシーとコスト削減重視

---

## 1. OpenAI Embeddings API

### 1.1 モデルバリエーション

#### text-embedding-3-small
- **料金**: $0.02 / 1M tokens ($0.00002 / 1K tokens)
- **次元数**: 1,536 (デフォルト)、カスタマイズ可能
- **コンテキスト長**: 8,191 tokens
- **パフォーマンス**: 前世代(ada-002)より5倍安価、精度向上

#### text-embedding-3-large
- **料金**: $0.13 / 1M tokens ($0.00013 / 1K tokens)
- **次元数**: 3,072 (デフォルト)、カスタマイズ可能
- **コンテキスト長**: 8,191 tokens
- **パフォーマンス**: 最高精度、MTEB英語タスクで64.6%

### 1.2 APIレート制限

- **Tier 5**: 10M TPM (tokens per minute), 10K RPM (requests per minute)
- **バッチ処理**: 最大300K tokens/request (36入力 × 8K tokens)
- **低Tier**: 150K TPM (利用状況により自動昇格)

### 1.3 日本語対応品質

- **MIRACLベンチマーク**: 多言語検索で31.4% → 54.9%に大幅向上
- **18言語サポート**: 日本語を含む多言語で優れたパフォーマンス
- **課題**: 日本語専用の詳細ベンチマークデータは限定的

### 1.4 特徴的な機能

- **次元カスタマイズ**: APIパラメータで次元数を削減可能（例: 3,072 → 256）
- **コスト最適化**: 短縮後も概念表現の品質を維持
- **既存統合**: OpenAI APIと同一インフラで管理可能

### 1.5 無料枠

なし（従量課金のみ）

---

## 2. Anthropic Claude Embeddings

### 2.1 提供状況

**Anthropicは独自のEmbeddings APIを提供していません**

### 2.2 推奨パートナー

Anthropicは**Voyage AI**を公式推奨パートナーとして指定:
- "Preferred embedding models for Anthropic"
- Claude APIとの統合でRAGシステム構築可能

### 2.3 代替ソリューション

- **AWS Bedrock経由**: Titan Text Embeddings V2 + Claude models
- **直接統合**: Voyage AI APIを利用

---

## 3. Cohere Embed

### 3.1 モデルバリエーション

#### Embed v3 Multilingual
- **料金**: $0.10 / 1M tokens
- **次元数**: 1,024
- **コンテキスト長**: 512 tokens
- **言語サポート**: 100+言語（日本語含む）

#### Embed v3 Multilingual Light
- **次元数**: 384
- **コンテキスト長**: 512 tokens
- **用途**: 高速処理が必要なケース

#### Embed v3 English / English Light
- **次元数**: 1,024 / 384
- **コンテキスト長**: 512 tokens
- **用途**: 英語専用

### 3.2 APIレート制限

#### 無料Tier (Trial Key)
- **テキスト**: 100 RPM
- **画像**: 5 RPM
- **月間上限**: 1,000コール

#### 有料Tier (Production Key)
- **テキスト**: 2,000 RPM
- **画像**: 400 RPM
- **月間上限**: なし
- **課金**: 従量課金、月末または$250到達時請求

### 3.3 日本語対応品質

- **多言語セマンティック保持**: ドイツ語・日本語でも意味を正確に捉える
- **課題**: 専門的な日本語ベンチマークは限定的

### 3.4 最新アップデート（2024年10月）

- **マルチモーダル対応**: 画像埋め込みが可能に
- **テキスト機能**: 既存機能に変更なし

### 3.5 無料枠

Trial Keyで学習・プロトタイピング用途に利用可能（レート制限あり）

---

## 4. Voyage AI

### 4.1 モデルバリエーション

#### voyage-multilingual-2（日本語RAG推奨）
- **料金**: $0.12 / 1M tokens（推定、要確認）
- **次元数**: 1,024
- **コンテキスト長**: 32,000 tokens（OpenAIの4倍）
- **日本語パフォーマンス**: OpenAI v3 large, Cohere v3を平均5.6%上回る
- **評価**: 27言語・85データセットで検証済み

#### voyage-3 / voyage-3-lite（2024年9月リリース）
- **料金**: $0.06 / 1M tokens（voyage-3）
- **次元数**: 1,024（voyage-3は3,072より3-4倍小型）
- **コンテキスト長**: 32,000 tokens
- **パフォーマンス**: OpenAI v3 largeを平均7.55%上回る
- **VectorDBコスト**: 3-4倍削減

#### voyage-3-large（2025年1月リリース、最新）
- **料金**: 要確認
- **パフォーマンス**: OpenAI v3 largeを平均9.74%上回る
- **用途**: 汎用・多言語対応の最先端モデル

### 4.2 APIレート制限

- **Baseline Tier**: 2,000 RPM, 8M TPM
- **Tier 2**: 4,000 RPM, 16M TPM
- **Tier 3**: 6,000 RPM, 24M TPM
- **自動昇格**: 使用量・支出に応じて自動的にTier昇格

### 4.3 日本語対応品質

- **検証データ**: 日本語を含む27言語で評価
- **フランス語・ドイツ語・日本語・スペイン語・韓国語で優れた検索品質**
- **多言語特化**: voyage-multilingual-2は日本語タスクで現時点でも最適

### 4.4 パフォーマンス特性

- **レイテンシ**: 旧モデルより向上
- **スループット**: 大幅改善
- **バックオフ戦略**: レート制限時は指数バックオフ推奨

### 4.5 無料枠

- **voyage-multilingual-2**: 最初の50M tokens無料
- **voyage-3シリーズ**: 最初の200M tokens無料（voyage-3-large, voyage-3, voyage-3-lite）

### 4.6 Anthropicとの統合

Anthropic公式推奨パートナー、Claude APIと併用でRAGシステム構築が容易

---

## 5. Google Vertex AI Embeddings

### 5.1 モデルバリエーション

#### text-multilingual-embedding-002
- **料金（オンライン）**: $0.025 / 1K characters
- **料金（バッチ）**: $0.020 / 1K characters
- **次元数**: 768（デフォルト）、Matryoshkaモデルでカスタマイズ可能
- **コンテキスト長**: 2,048 tokens（最大3,072 tokens）
- **日本語評価済み**: 公式に日本語対応を明記

#### gemini-embedding-001
- **料金**: $0.15 / 1M input tokens
- **次元数**: 3,072
- **コンテキスト長**: 8,000 tokens（実験版）
- **言語サポート**: 100+言語（日本語含む）

### 5.2 APIレート制限

- **textembedding-gecko**: 600 RPM（1リクエストあたり5入力まで）
- **gemini-embedding-001**: 1リクエストあたり1入力のみ
- **リクエスト制約**: 最大250入力テキスト、20,000 tokens/request

### 5.3 日本語対応の特徴

- **文字ベース課金**: トークンベースより有利
- **日本語・韓国語で最安**: 情報密度の高い言語でコスト優位性
  - 理由: 1文字あたりの情報量が多い言語では、文字課金の方が安価

### 5.4 パフォーマンス

- **次元拡張**: gemini-embedding-001は前世代の4倍のトークン数対応
- **高次元**: 3,072次元で詳細な意味表現

### 5.5 無料枠

GCP無料枠の範囲内で利用可能（詳細はプロジェクト設定に依存）

---

## 6. オープンソース（Sentence Transformers等）

### 6.1 概要

- **ライセンス**: Apache 2.0（商用利用可）
- **モデル数**: 15,000+ pre-trainedモデル（Hugging Face）
- **Python**: sentence-transformersライブラリ

### 6.2 代表的なモデル

#### 多言語モデル（日本語対応）

##### paraphrase-multilingual-mpnet-base-v2
- **次元数**: 768
- **対応言語**: 50+言語（日本語含む）
- **用途**: 汎用的なセマンティック類似性

##### paraphrase-multilingual-MiniLM-L12-v2
- **次元数**: 384
- **対応言語**: 50言語
- **用途**: 高速処理、リソース制約環境

##### distiluse-base-multilingual-cased-v2
- **次元数**: 512
- **対応言語**: 多言語
- **用途**: バランス型

##### static-similarity-mrl-multilingual-v1
- **次元数**: 1,024（Matryoshka対応、削減可能）
- **パフォーマンス**: CPU 125倍、GPU 10倍高速（vs multilingual-e5-small）

#### 日本語専用モデル（2024年最新）

##### Ruri (cl-nagoya/Ruri series)
- **開発**: 名古屋大学等、2024年
- **特徴**: 日本語専用埋め込みモデル、LLM生成データセットで学習
- **評価**: JMTEB（Japanese Massive Text Embedding Benchmark）で検証
- **パフォーマンス**: mE5等の多言語モデルを上回る（日本語タスク）
- **Ollama対応**: kun432/cl-nagoya-ruri-large（初の日本語専用Ollama組み込み）

##### GLuCoSE (pkshatech/GLuCoSE-base-ja)
- **ベース**: LUKE（日本語BERT）
- **学習データ**: Webデータ + 自然言語推論 + 検索データセット
- **用途**: 文ベクトル類似性、セマンティック検索

##### JaColBERT (bclavie/JaColBERT)
- **開発者**: Benjamin Clavié
- **用途**: 日本語文書検索（JSTS/JSICKには不向き）
- **特徴**: 検索タスク最適化

##### Multilingual E5 (intfloat/multilingual-e5-base, large)
- **開発**: Microsoft
- **ベース**: XLM-RoBERTa
- **学習**: Contrastive Learning（Web データ）
- **評価**: 日本語タスクのベースライン

### 6.3 評価ベンチマーク

#### JMTEB（2024年10月リリース）
- **タスク数**: 5種類（Clustering, Classification, STS, Retrieval, Reranking）
- **データセット**: 28データセット
- **日本語専用**: 日本語埋め込みモデルの標準ベンチマーク

#### MTEB（国際標準）
- **言語数**: 112言語（日本語含む）
- **タスク数**: 58タスク
- **制約**: 日本語特化の詳細評価は限定的

### 6.4 コスト

- **API料金**: なし（完全無料）
- **インフラコスト**:
  - セルフホスティング（GPU推奨、CPUでも可）
  - クラウドインスタンス費用（AWS EC2, GCP Compute Engine等）
- **月150万トークン以上処理の場合**: 商用APIよりコスト削減

### 6.5 メリット

1. **データプライバシー**: データが外部に送信されない
2. **コスト最適化**: 大量処理で大幅削減
3. **カスタマイズ**: ドメイン特化ファインチューニング可能
4. **オフライン**: インターネット接続不要

### 6.6 デメリット

1. **初期構築コスト**: インフラ・運用設定が必要
2. **メンテナンス**: モデル更新、サーバー管理が必要
3. **スケーリング**: 高負荷時のスケールアウトが複雑
4. **精度**: 商用APIより若干劣る可能性（モデルによる）

### 6.7 日本語医療・メンタルヘルス対応

#### 医療専門モデル（参考情報）
- **日本語臨床BERT**: MeCab + J-MeDic辞書使用
- **NCVC-slm-1**: 日本語臨床・医療特化（1Bパラメータ、2024年12月）
  - 疾患・薬剤・検査項目データで拡張
  - J-Medicベース、厚労省薬価リストで学習

**注**: これらは主にLLMであり、Embeddingモデルとしては別途検討が必要

---

## 7. 比較マトリックス

### 7.1 料金比較（1M tokensあたり）

| サービス | モデル | 料金 | 備考 |
|---------|--------|------|------|
| **OpenAI** | text-embedding-3-small | $0.02 | 最もコスパ良 |
| **OpenAI** | text-embedding-3-large | $0.13 | 高精度 |
| **Cohere** | Embed v3 Multilingual | $0.10 | 中間価格 |
| **Voyage AI** | voyage-3 | $0.06 | 高コスパ |
| **Voyage AI** | voyage-multilingual-2 | ~$0.12 | 日本語特化 |
| **Google Vertex AI** | text-multilingual-embedding | $0.025/1K chars | 日本語で有利 |
| **Google Vertex AI** | gemini-embedding-001 | $0.15 | 高次元・長コンテキスト |
| **Sentence Transformers** | セルフホスト | $0.00（API料金） | インフラコスト別途 |

### 7.2 次元数比較

| サービス | モデル | 次元数 |
|---------|--------|--------|
| OpenAI | text-embedding-3-small | 1,536（可変） |
| OpenAI | text-embedding-3-large | 3,072（可変） |
| Cohere | Embed v3 Multilingual | 1,024 |
| Cohere | Embed v3 Light | 384 |
| Voyage AI | voyage-3 | 1,024 |
| Voyage AI | voyage-multilingual-2 | 1,024 |
| Google Vertex AI | text-multilingual-embedding | 768 |
| Google Vertex AI | gemini-embedding-001 | 3,072 |
| Sentence Transformers | paraphrase-multilingual-mpnet | 768 |
| Sentence Transformers | MiniLM-L12 | 384 |
| Sentence Transformers | static-similarity-mrl | 1,024（可変） |
| Ruri | Ruri-large | 要確認 |

### 7.3 コンテキスト長比較

| サービス | モデル | 最大トークン数 |
|---------|--------|---------------|
| OpenAI | text-embedding-3 | 8,191 |
| Cohere | Embed v3 | 512 |
| Voyage AI | voyage-3, multilingual-2 | 32,000 |
| Google Vertex AI | text-multilingual-embedding | 2,048（最大3,072） |
| Google Vertex AI | gemini-embedding-001 | 8,000 |
| Sentence Transformers | モデルによる | 128〜512（一般的） |

### 7.4 レート制限比較

| サービス | モデル | RPM | TPM | 備考 |
|---------|--------|-----|-----|------|
| OpenAI | text-embedding-3 | 10K（Tier 5） | 10M（Tier 5） | Tier別 |
| Cohere | Embed v3（Trial） | 100 | - | 月1,000コール上限 |
| Cohere | Embed v3（Prod） | 2,000 | - | 無制限 |
| Voyage AI | voyage-3（Baseline） | 2,000 | 8M | 自動Tier昇格 |
| Voyage AI | voyage-3（Tier 3） | 6,000 | 24M | - |
| Google Vertex AI | textembedding-gecko | 600 | - | 5入力/request |
| Google Vertex AI | gemini-embedding-001 | 要確認 | - | 1入力/request |
| Sentence Transformers | セルフホスト | 無制限 | 無制限 | サーバースペック次第 |

### 7.5 日本語品質評価（総合）

| ランク | サービス | 評価根拠 |
|-------|---------|---------|
| A+ | **Ruri (Sentence Transformers)** | 日本語専用、JMTEBで高評価 |
| A | **Voyage AI voyage-multilingual-2** | 27言語評価で日本語上位、専門ベンチマーク済み |
| A- | **OpenAI text-embedding-3-large** | MIRACL多言語で大幅向上（54.9%） |
| B+ | **Multilingual E5 (Sentence Transformers)** | 日本語ベースライン、広く利用 |
| B | **Google Vertex AI text-multilingual-embedding** | 日本語評価済み、文字課金で有利 |
| B | **Cohere Embed v3 Multilingual** | 100+言語、日本語セマンティック保持 |
| B- | **OpenAI text-embedding-3-small** | コスパ最優先、日本語も対応 |

**注**: メンタルヘルス専門用語での評価データは現時点で公開情報なし

---

## 8. 推奨事項

### 8.1 第1推奨: OpenAI text-embedding-3-small

#### 採用理由
1. **コストパフォーマンス**: $0.02/1M tokens（最安クラス）
2. **既存統合**: COM:PASSシステムで既にOpenAI API使用予定（管理統合が容易）
3. **バランス**: 精度・速度・コストのバランスが良好
4. **多言語対応**: 日本語含む18言語で検証済み
5. **スケーラビリティ**: 高レート制限（10K RPM, 10M TPM）

#### 適用ケース
- 初期構築フェーズ
- コスト重視
- OpenAI APIとの統合を重視

#### 注意点
- コンテキスト長8,191 tokens（長文は分割必要）
- 専門用語（メンタルヘルス）の精度は実測要

---

### 8.2 第2推奨: Voyage AI voyage-multilingual-2

#### 採用理由
1. **日本語品質**: 日本語含む27言語で専門評価済み（OpenAI/Cohereを5.6%上回る）
2. **長コンテキスト**: 32,000 tokens（OpenAIの4倍）
3. **無料枠**: 最初の50M tokens無料
4. **Anthropic連携**: Claude APIとの統合が公式推奨
5. **コストパフォーマンス**: 比較的安価（推定$0.12/1M）

#### 適用ケース
- 日本語品質最優先
- 長文カウンセリングログの処理
- Claude APIとの併用
- Anthropicエコシステムとの統合

#### 注意点
- 新興サービス（OpenAIより知名度低い）
- 日本語ドキュメントは限定的

---

### 8.3 第3推奨: Sentence Transformers (Ruri / Multilingual E5)

#### 採用理由
1. **データプライバシー**: クライアントデータが外部送信されない（重要）
2. **長期コスト削減**: 大量処理でAPI料金ゼロ
3. **日本語専用モデル**: Ruri（2024年最新、JMTEB高評価）
4. **カスタマイズ**: メンタルヘルス用語でファインチューニング可能
5. **オフライン運用**: インターネット接続不要

#### 適用ケース
- プライバシー規制が厳しい
- 長期的な大量処理（月数百万トークン以上）
- 専門用語のカスタマイズが必要
- オンプレミス運用

#### 注意点
- 初期構築コスト（インフラ・運用）
- メンテナンス負担
- GPUリソース推奨（コスト別途）
- 商用APIより若干精度劣る可能性

---

## 9. 段階的導入戦略

### Phase 1: MVP（最小実装）
- **推奨**: OpenAI text-embedding-3-small
- **理由**: 迅速な構築、低コスト、既存OpenAI API統合
- **期間**: 1〜2ヶ月

### Phase 2: 品質検証
- **並行テスト**:
  - OpenAI text-embedding-3-small（ベースライン）
  - Voyage AI voyage-multilingual-2（日本語品質）
  - Sentence Transformers Ruri（プライバシー）
- **評価指標**: 検索精度、レイテンシ、コスト、メンタルヘルス用語の正確性
- **期間**: 1〜2ヶ月

### Phase 3: 本番展開
- **選定基準**:
  1. 日本語品質（特に専門用語）
  2. コスト（運用規模に応じて）
  3. プライバシー要件
  4. 運用負荷
- **推奨**:
  - **小〜中規模**: OpenAI or Voyage AI
  - **大規模 or 高プライバシー**: Sentence Transformers（セルフホスト）

---

## 10. メンタルヘルス専門用語対応

### 10.1 現状の課題
- **公開ベンチマークなし**: メンタルヘルス・カウンセリング用語の専門評価データなし
- **医療専門モデル**: 日本語医療BERTは存在するが、Embeddingモデルは限定的

### 10.2 推奨アプローチ

#### A. 短期: 汎用モデル + プロンプトエンジニアリング
1. **OpenAI text-embedding-3-small** or **Voyage voyage-multilingual-2**をベースに採用
2. 検索時のクエリ拡張（専門用語の類義語展開）
3. Rerankerの導入（検索結果の再ランク付け）

#### B. 中期: ファインチューニング
1. **Sentence Transformers Ruri**をベースに採用
2. メンタルヘルス用語コーパスでファインチューニング
3. 専門辞書（心理学・精神医学用語）を統合

#### C. 長期: 専門モデル開発
1. NCVC-slm-1（臨床医療特化LLM）を参考に、メンタルヘルス特化Embeddingモデルを開発
2. J-Medicのようなメンタルヘルス専門辞書の構築・統合

---

## 11. コスト試算（参考例）

### 前提条件
- **月間処理量**: 1,000万トークン（10M tokens）
- **用途**: カウンセリングログ検索、FAQ検索

### 11.1 商用API

| サービス | モデル | 月額コスト |
|---------|--------|-----------|
| OpenAI | text-embedding-3-small | $200 |
| OpenAI | text-embedding-3-large | $1,300 |
| Cohere | Embed v3 Multilingual | $1,000 |
| Voyage AI | voyage-3 | $600 |
| Voyage AI | voyage-multilingual-2 | ~$1,200 |
| Google Vertex AI | text-multilingual-embedding | $250（文字課金、日本語で有利） |
| Google Vertex AI | gemini-embedding-001 | $1,500 |

### 11.2 セルフホスト（Sentence Transformers）

#### GPUインスタンス（AWS p3.2xlarge）
- **インスタンス費用**: 約$3.06/時間 × 730時間 = $2,234/月
- **ストレージ**: 約$50/月
- **ネットワーク**: 約$20/月
- **合計**: 約$2,304/月

#### CPUインスタンス（AWS c5.4xlarge）
- **インスタンス費用**: 約$0.68/時間 × 730時間 = $496/月
- **ストレージ**: 約$50/月
- **ネットワーク**: 約$20/月
- **合計**: 約$566/月

**結論**:
- **月10M tokens未満**: OpenAI text-embedding-3-small（$200）が最安
- **月50M tokens以上**: セルフホストCPU（$566）の方がコスト効率良好
- **プライバシー重視**: セルフホスト一択

---

## 12. 最終推奨サマリー

### 12.1 推奨ランキング

| 順位 | サービス・モデル | 総合評価 | 主な理由 |
|-----|----------------|---------|---------|
| 1 | **OpenAI text-embedding-3-small** | ★★★★★ | コスパ最高、統合容易、実績豊富 |
| 2 | **Voyage AI voyage-multilingual-2** | ★★★★☆ | 日本語品質トップクラス、長コンテキスト |
| 3 | **Sentence Transformers Ruri** | ★★★★☆ | プライバシー、長期コスト削減、日本語専用 |

### 12.2 採用判断フローチャート

```
スタート
  ↓
既にOpenAI APIを使用？
  ├─ Yes → OpenAI text-embedding-3-small（推奨度: 最高）
  └─ No
      ↓
日本語品質最優先？
  ├─ Yes → Voyage AI voyage-multilingual-2（推奨度: 高）
  └─ No
      ↓
データプライバシーが厳格？
  ├─ Yes → Sentence Transformers Ruri（推奨度: 高）
  └─ No
      ↓
月間処理量が50M tokens以上？
  ├─ Yes → Sentence Transformers（セルフホスト）（推奨度: 中〜高）
  └─ No → OpenAI text-embedding-3-small（推奨度: 最高）
```

---

## 13. アクションプラン

### 13.1 即座に実施
1. **OpenAI API契約**: text-embedding-3-small APIキー取得
2. **小規模テスト**: 100〜1,000件のカウンセリングログで検索精度検証
3. **メンタルヘルス用語リスト作成**: 専門用語（例: 認知行動療法、PTSD、共感疲労等）を列挙

### 13.2 1ヶ月以内
1. **Voyage AI評価**: voyage-multilingual-2 APIキー取得、並行テスト
2. **Sentence Transformers PoC**: Ruriモデルをローカル環境でテスト
3. **ベンチマーク作成**: メンタルヘルス用語検索の評価セット構築

### 13.3 3ヶ月以内
1. **本番採用決定**: テスト結果に基づき最終モデル選定
2. **スケーリング計画**: 本番運用のインフラ・コスト計画策定
3. **ファインチューニング検討**: 必要に応じてSentence Transformersのカスタマイズ開始

---

## 14. 参考リンク

### 公式ドキュメント
- **OpenAI Embeddings**: https://platform.openai.com/docs/guides/embeddings
- **Anthropic Claude**: https://docs.anthropic.com/claude/docs/embeddings（Voyage AI推奨）
- **Cohere Embed**: https://docs.cohere.com/docs/cohere-embed
- **Voyage AI**: https://docs.voyageai.com/docs/embeddings
- **Google Vertex AI**: https://cloud.google.com/vertex-ai/generative-ai/docs/embeddings
- **Sentence Transformers**: https://sbert.net/

### ベンチマーク
- **MTEB Leaderboard**: https://huggingface.co/spaces/mteb/leaderboard
- **JMTEB**: https://github.com/sbintuitions/JMTEB
- **JapaneseEmbeddingEval**: https://github.com/oshizo/JapaneseEmbeddingEval

### 日本語モデル
- **Ruri**: https://arxiv.org/abs/2409.07737
- **GLuCoSE**: https://huggingface.co/pkshatech/GLuCoSE-base-ja
- **JaColBERT**: https://huggingface.co/bclavie/JaColBERT

---

## 15. まとめ

本調査により、日本語RAGシステムに最適なEmbeddings APIとして、以下の3つを推奨します:

1. **OpenAI text-embedding-3-small** - 統合の容易性、コストパフォーマンス、実績を重視
2. **Voyage AI voyage-multilingual-2** - 日本語品質と長コンテキストを重視
3. **Sentence Transformers (Ruri)** - プライバシーと長期コスト削減を重視

COM:PASSシステムの構築フェーズでは、まず**OpenAI text-embedding-3-small**でMVPを構築し、並行して**Voyage AI**と**Sentence Transformers**の評価を進めることで、最適なモデル選定が可能になります。

メンタルヘルス専門用語への対応は、短期的には汎用モデル + プロンプトエンジニアリング、中長期的にはファインチューニングまたは専門モデル開発を検討することを推奨します。
