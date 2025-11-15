import { PrismaClient } from '@prisma/client';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const prisma = new PrismaClient();

interface WordToTranslate {
  simplified: string;
  pinyin: string;
  english: string;
  hskLevel?: number | null;
}

interface TranslationResult {
  [simplified: string]: string;
}

async function translateWithGemini(words: WordToTranslate[]): Promise<TranslationResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY không được tìm thấy trong file .env. Vui lòng thêm GEMINI_API_KEY=your_api_key vào file .env');
  }

      const genAI = new GoogleGenerativeAI(apiKey);
      // Sử dụng gemini-2.5-flash làm default (mới nhất, nhanh, rẻ)
      // Có thể override bằng GEMINI_MODEL trong .env
      const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
      console.log(`🤖 Sử dụng model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });

  const result: TranslationResult = {};
  const batchSize = 50; // Dịch 50 từ mỗi lần để tránh quá tải

  console.log(`\n🤖 Bắt đầu dịch ${words.length} từ bằng Gemini AI...`);
  console.log(`   Chia thành ${Math.ceil(words.length / batchSize)} batch\n`);

  for (let i = 0; i < words.length; i += batchSize) {
    const batch = words.slice(i, i + batchSize);
    const batchNumber = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(words.length / batchSize);

    console.log(`📦 Batch ${batchNumber}/${totalBatches}: Đang dịch ${batch.length} từ...`);

    try {
      // Tạo prompt cho batch này
      const wordsJson = JSON.stringify(batch, null, 2);
      const prompt = `Tôi cần bạn dịch danh sách từ tiếng Trung sang tiếng Việt.

Danh sách từ (JSON):
${wordsJson}

Yêu cầu:
1. Dịch nghĩa tiếng Việt dựa trên nghĩa tiếng Anh
2. Nếu từ có nhiều nghĩa, dùng dấu phẩy để phân cách (ví dụ: "bạn, anh, chị, em")
3. Dịch chính xác, phù hợp với ngữ cảnh tiếng Việt
4. Ưu tiên nghĩa thông dụng nhất
5. Chỉ trả về JSON object, không cần giải thích

Format output (chỉ JSON, không có markdown code block):
{
  "你": "bạn, anh, chị, em",
  "我": "tôi, ta",
  ...
}

Key là chữ Hán giản thể (simplified), value là nghĩa tiếng Việt.`;

      const response = await model.generateContent(prompt);
      const responseText = response.response.text();

      // Parse JSON từ response (loại bỏ markdown code block nếu có)
      let jsonText = responseText.trim();
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/^```\n?/, '').replace(/\n?```$/, '');
      }

      const batchResult: TranslationResult = JSON.parse(jsonText);

      // Merge vào result
      Object.assign(result, batchResult);

      console.log(`   ✅ Đã dịch ${Object.keys(batchResult).length} từ`);

      // Delay để tránh rate limit
      if (i + batchSize < words.length) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Đợi 1 giây giữa các batch
      }

    } catch (error: any) {
      console.error(`   ❌ Lỗi khi dịch batch ${batchNumber}:`, error.message);
      console.error(`   Tiếp tục với batch tiếp theo...`);
    }
  }

  return result;
}

async function main() {
  console.log('🇻🇳 Sử dụng Google Gemini AI để dịch từ tiếng Trung sang tiếng Việt\n');

  try {
    // Kiểm tra API key
    if (!process.env.GEMINI_API_KEY) {
      console.error('❌ Lỗi: GEMINI_API_KEY chưa được cấu hình');
      console.log('\n💡 Hướng dẫn lấy API key:');
      console.log('   1. Truy cập: https://makersuite.google.com/app/apikey');
      console.log('   2. Tạo API key mới');
      console.log('   3. Thêm vào file backend/.env:');
      console.log('      GEMINI_API_KEY=your_api_key_here');
      console.log('\n   Hoặc chạy với: GEMINI_API_KEY=your_key npm run db:translate-gemini');
      process.exit(1);
    }

    // Lấy danh sách từ chưa có tiếng Việt
    console.log('📤 Đang lấy danh sách từ chưa có tiếng Việt...');
    const words = await prisma.chineseWord.findMany({
      where: {
        OR: [
          { vietnamese: null },
          { vietnamese: '' }
        ]
      },
      orderBy: [
        { hskLevel: 'asc' },
        { frequency: 'desc' }
      ],
      take: 1000 // Dịch 1000 từ mỗi lần để tránh tốn quá nhiều token
    });

    if (words.length === 0) {
      console.log('✅ Tất cả từ đã có tiếng Việt!');
      return;
    }

    console.log(`📊 Tìm thấy ${words.length} từ chưa có tiếng Việt`);

    // Format dữ liệu
    const wordsToTranslate: WordToTranslate[] = words.map(word => ({
      simplified: word.simplified,
      pinyin: word.pinyin,
      english: word.english,
      hskLevel: word.hskLevel
    }));

    // Dịch bằng Gemini
    const translationResult = await translateWithGemini(wordsToTranslate);

    console.log(`\n✅ Đã dịch được ${Object.keys(translationResult).length} từ`);

    // Lưu vào file JSON để backup
    const outputPath = path.join(__dirname, 'vietnamese-mapping-gemini.json');
    fs.writeFileSync(outputPath, JSON.stringify(translationResult, null, 2), 'utf-8');
    console.log(`💾 Đã lưu kết quả vào: ${outputPath}`);

    // Cập nhật database
    console.log('\n📝 Đang cập nhật database...');
    let updated = 0;
    let notFound = 0;

    for (const [simplified, vietnamese] of Object.entries(translationResult)) {
      try {
        const result = await prisma.chineseWord.updateMany({
          where: {
            simplified: simplified,
            OR: [
              { vietnamese: null },
              { vietnamese: '' }
            ]
          },
          data: {
            vietnamese: vietnamese.trim()
          }
        });

        if (result.count > 0) {
          updated += result.count;
        } else {
          notFound++;
        }
      } catch (error: any) {
        console.error(`   ⚠️  Lỗi khi update "${simplified}": ${error.message}`);
      }
    }

    console.log(`\n📊 Kết quả cập nhật:`);
    console.log(`   ✅ Đã cập nhật: ${updated} từ`);
    if (notFound > 0) {
      console.log(`   ⚠️  Không tìm thấy: ${notFound} từ`);
    }

    // Thống kê
    const totalWithVietnamese = await prisma.chineseWord.count({
      where: {
        vietnamese: { not: null }
      }
    });

    const totalWords = await prisma.chineseWord.count();
    const percentage = ((totalWithVietnamese / totalWords) * 100).toFixed(1);

    console.log(`\n📈 Thống kê:`);
    console.log(`   Tổng số từ: ${totalWords}`);
    console.log(`   Có tiếng Việt: ${totalWithVietnamese} (${percentage}%)`);

    console.log('\n✅ Hoàn tất!');

  } catch (error: any) {
    console.error('❌ Lỗi:', error.message);
    if (error.message.includes('API_KEY')) {
      console.log('\n💡 Vui lòng kiểm tra GEMINI_API_KEY trong file .env');
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

