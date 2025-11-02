// ============================================
// Dify API 接続テストスクリプト
// ============================================
// Node.jsで直接Dify APIを呼び出してテスト
//
// 実行方法: node test-dify-api.js

const https = require('https');

// 環境変数から取得（.env ファイルに設定してください）
const DIFY_API_KEY = process.env.VITE_DIFY_API_KEY || 'your-api-key-here';
const DIFY_API_URL = process.env.VITE_DIFY_API_URL || 'https://api.dify.ai/v1';

console.log('🔍 Dify API 接続テスト開始...\n');
console.log('API URL:', DIFY_API_URL);
console.log('API Key:', DIFY_API_KEY.substring(0, 10) + '...\n');

// テストメッセージ送信
const testMessage = {
  inputs: {},
  query: 'こんにちは！接続テストです。',
  user: 'test-user-001',
  response_mode: 'blocking',
};

const postData = JSON.stringify(testMessage);

const options = {
  hostname: 'api.dify.ai',
  port: 443,
  path: '/v1/chat-messages',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${DIFY_API_KEY}`,
    'Content-Length': Buffer.byteLength(postData),
  },
};

console.log('📤 リクエスト送信中...\n');

const req = https.request(options, (res) => {
  console.log(`✅ ステータスコード: ${res.statusCode}`);
  console.log('📋 レスポンスヘッダー:', JSON.stringify(res.headers, null, 2));
  console.log('\n📥 レスポンスボディ:');

  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log(JSON.stringify(response, null, 2));

      if (res.statusCode === 200 && response.answer) {
        console.log('\n✅ 成功！Dify APIからの応答:');
        console.log('---');
        console.log(response.answer);
        console.log('---');
        console.log('\n✨ Dify API接続は正常に動作しています！');
      } else {
        console.log('\n⚠️ 警告：レスポンスは受信しましたが、期待した形式ではありません。');
        console.log('ステータスコード:', res.statusCode);
      }
    } catch (error) {
      console.error('\n❌ JSONパースエラー:', error.message);
      console.log('生データ:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('\n❌ リクエストエラー:', error.message);
  console.error('詳細:', error);
});

req.write(postData);
req.end();
