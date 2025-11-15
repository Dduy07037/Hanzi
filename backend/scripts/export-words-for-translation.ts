import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('📤 Đang export danh sách từ cần dịch...');

  try {
    // Lấy tất cả từ chưa có tiếng Việt, ưu tiên HSK 1-6
    const words = await prisma.chineseWord.findMany({
      where: {
        OR: [
          { vietnamese: null },
          { vietnamese: '' }
        ]
      },
      orderBy: [
        { hskLevel: 'asc' }, // Ưu tiên HSK level thấp trước
        { frequency: 'desc' } // Sau đó ưu tiên từ có tần suất cao
      ],
      take: 5000 // Lấy 5000 từ đầu tiên
    });

    console.log(`📊 Tìm thấy ${words.length} từ chưa có tiếng Việt`);

    // Format dữ liệu để gửi cho AI
    const exportData = words.map(word => ({
      simplified: word.simplified,
      pinyin: word.pinyin,
      english: word.english,
      hskLevel: word.hskLevel,
      frequency: word.frequency
    }));

    // Lưu vào file JSON
    const outputPath = path.join(__dirname, 'words-to-translate.json');
    fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2), 'utf-8');

    console.log(`✅ Đã export ${words.length} từ vào file:`);
    console.log(`   ${outputPath}`);

    // Tạo file summary
    const summary = {
      total: words.length,
      byHSK: {
        hsk1: words.filter(w => w.hskLevel === 1).length,
        hsk2: words.filter(w => w.hskLevel === 2).length,
        hsk3: words.filter(w => w.hskLevel === 3).length,
        hsk4: words.filter(w => w.hskLevel === 4).length,
        hsk5: words.filter(w => w.hskLevel === 5).length,
        hsk6: words.filter(w => w.hskLevel === 6).length,
        noHSK: words.filter(w => !w.hskLevel).length
      }
    };

    const summaryPath = path.join(__dirname, 'translation-summary.json');
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), 'utf-8');

    console.log(`\n📈 Thống kê:`);
    console.log(`   HSK 1: ${summary.byHSK.hsk1} từ`);
    console.log(`   HSK 2: ${summary.byHSK.hsk2} từ`);
    console.log(`   HSK 3: ${summary.byHSK.hsk3} từ`);
    console.log(`   HSK 4: ${summary.byHSK.hsk4} từ`);
    console.log(`   HSK 5: ${summary.byHSK.hsk5} từ`);
    console.log(`   HSK 6: ${summary.byHSK.hsk6} từ`);
    console.log(`   Không có HSK: ${summary.byHSK.noHSK} từ`);

    console.log(`\n💡 Bước tiếp theo:`);
    console.log(`   1. Mở file words-to-translate.json`);
    console.log(`   2. Copy nội dung và gửi cho AI (ChatGPT/Claude)`);
    console.log(`   3. Yêu cầu AI dịch sang tiếng Việt`);
    console.log(`   4. Lưu kết quả vào file vietnamese-mapping.json`);
    console.log(`   5. Chạy: npm run db:import-vietnamese`);

  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

