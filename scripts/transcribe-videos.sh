#!/bin/bash

# ============================================
# OpenAI Whisper APIを使用した動画文字起こしスクリプト
# ============================================
# 使用方法:
#   1. 動画ファイルを ~/Desktop/Coaching-Videos/ に配置
#   2. プロジェクトルートに .env ファイルがあることを確認
#   3. このスクリプトを実行: bash scripts/transcribe-videos.sh
#
# 対応形式: mp4, m4a, mp3, wav, webm
# 料金: $0.006/分

set -e  # エラー時に停止

# 色付きログ
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}動画文字起こしスクリプト (Whisper API)${NC}"
echo -e "${GREEN}========================================${NC}"

# OpenAI API Keyの確認
if [ -z "$OPENAI_API_KEY" ]; then
  if [ -f ".env" ]; then
    echo -e "${YELLOW}✓ .env ファイルから API Key を読み込みます${NC}"
    export $(grep -v '^#' .env | grep OPENAI_API_KEY | xargs)
  fi
fi

if [ -z "$OPENAI_API_KEY" ]; then
  echo -e "${RED}✗ OPENAI_API_KEY が設定されていません${NC}"
  echo -e "${YELLOW}  .env ファイルに OPENAI_API_KEY=your-api-key を追加してください${NC}"
  exit 1
fi

echo -e "${GREEN}✓ OpenAI API Key が設定されています${NC}"

# ディレクトリ設定
VIDEO_DIR="$HOME/Desktop/Coaching-Videos"
OUTPUT_DIR="$HOME/Desktop/System-RAG-Files/04_動画文字起こし"

# ディレクトリが存在しない場合は作成
if [ ! -d "$VIDEO_DIR" ]; then
  echo -e "${YELLOW}⚠ 動画ディレクトリが存在しません: $VIDEO_DIR${NC}"
  echo -e "${YELLOW}  ディレクトリを作成しますか? (y/n)${NC}"
  read -r response
  if [[ "$response" =~ ^[Yy]$ ]]; then
    mkdir -p "$VIDEO_DIR"
    echo -e "${GREEN}✓ ディレクトリを作成しました${NC}"
  else
    echo -e "${RED}✗ 処理を中止しました${NC}"
    exit 1
  fi
fi

mkdir -p "$OUTPUT_DIR"

# 動画ファイルの検索
echo ""
echo -e "${YELLOW}動画ファイルを検索中...${NC}"

video_count=0
for ext in mp4 m4a mp3 wav webm; do
  count=$(find "$VIDEO_DIR" -maxdepth 1 -type f -iname "*.$ext" | wc -l | tr -d ' ')
  video_count=$((video_count + count))
done

if [ "$video_count" -eq 0 ]; then
  echo -e "${RED}✗ 動画ファイルが見つかりませんでした${NC}"
  echo -e "${YELLOW}  $VIDEO_DIR に動画ファイルを配置してください${NC}"
  exit 1
fi

echo -e "${GREEN}✓ $video_count 個の動画ファイルが見つかりました${NC}"

# コスト試算（仮に平均60分/ファイルとして計算）
avg_minutes=60
estimated_minutes=$((video_count * avg_minutes))
estimated_cost=$(echo "scale=2; $estimated_minutes * 0.006" | bc)

echo ""
echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}コスト試算（概算）${NC}"
echo -e "${YELLOW}========================================${NC}"
echo -e "ファイル数: $video_count"
echo -e "想定総時間: $estimated_minutes 分（平均 $avg_minutes 分/ファイル）"
echo -e "推定コスト: \$$estimated_cost"
echo -e "${YELLOW}========================================${NC}"
echo ""
echo -e "${YELLOW}文字起こしを開始しますか? (y/n)${NC}"
read -r confirm

if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
  echo -e "${RED}✗ 処理を中止しました${NC}"
  exit 0
fi

# 文字起こし実行
echo ""
echo -e "${GREEN}文字起こしを開始します...${NC}"
echo ""

total_processed=0
total_success=0
total_failed=0

for video in "$VIDEO_DIR"/*.{mp4,m4a,mp3,wav,webm}; do
  # ファイルが実際に存在するか確認（globが展開されない場合のスキップ）
  [ -e "$video" ] || continue

  filename=$(basename "$video")
  name="${filename%.*}"
  output_file="$OUTPUT_DIR/${name}.txt"

  # 既に文字起こし済みの場合はスキップ
  if [ -f "$output_file" ]; then
    echo -e "${YELLOW}⊘ スキップ: $filename (既に存在)${NC}"
    continue
  fi

  total_processed=$((total_processed + 1))

  echo -e "${GREEN}[$total_processed/$video_count] 処理中: $filename${NC}"

  # Whisper API呼び出し
  response=$(curl -s -w "\n%{http_code}" https://api.openai.com/v1/audio/transcriptions \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -H "Content-Type: multipart/form-data" \
    -F "file=@$video" \
    -F "model=whisper-1" \
    -F "language=ja" \
    -F "response_format=text")

  # HTTPステータスコードの取得
  http_code=$(echo "$response" | tail -n 1)
  body=$(echo "$response" | head -n -1)

  if [ "$http_code" -eq 200 ]; then
    # 成功: テキストをファイルに保存
    echo "$body" > "$output_file"
    echo -e "${GREEN}✓ 完了: ${name}.txt${NC}"
    total_success=$((total_success + 1))
  else
    # 失敗: エラーメッセージを表示
    echo -e "${RED}✗ 失敗: $filename (HTTP $http_code)${NC}"
    echo -e "${RED}  エラー: $body${NC}"
    total_failed=$((total_failed + 1))
  fi

  echo ""

  # APIレート制限対策（1秒待機）
  sleep 1
done

# 結果サマリー
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}文字起こし完了${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "処理ファイル数: $total_processed"
echo -e "成功: ${GREEN}$total_success${NC}"
echo -e "失敗: ${RED}$total_failed${NC}"
echo -e "出力先: $OUTPUT_DIR"
echo -e "${GREEN}========================================${NC}"

if [ "$total_failed" -gt 0 ]; then
  echo -e "${YELLOW}⚠ 一部のファイルが失敗しました。エラーメッセージを確認してください。${NC}"
fi

exit 0
