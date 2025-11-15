import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

interface VietnameseMapping {
  [simplified: string]: string;
}

async function main() {
  console.log('🇻🇳 Bắt đầu import tiếng Việt từ file JSON...');

  try {
    // Đọc file JSON mapping
    const mappingPath = path.join(__dirname, 'vietnamese-mapping.json');
    
    if (!fs.existsSync(mappingPath)) {
      console.error(`❌ Không tìm thấy file: ${mappingPath}`);
      console.log('\n💡 Hướng dẫn:');
      console.log('   1. Sử dụng AI để dịch danh sách từ');
      console.log('   2. Lưu kết quả vào file vietnamese-mapping.json với format:');
      console.log('      {');
      console.log('        "你": "bạn, anh, chị, em",');
      console.log('        "我": "tôi, ta",');
      console.log('        ...');
      console.log('      }');
      process.exit(1);
    }

    const mappingContent = fs.readFileSync(mappingPath, 'utf-8');
    const mapping: VietnameseMapping = JSON.parse(mappingContent);

    console.log(`📖 Đã đọc ${Object.keys(mapping).length} từ từ file mapping`);

    let updated = 0;
    let notFound = 0;
    let errors = 0;

    // Update từng từ
    for (const [simplified, vietnamese] of Object.entries(mapping)) {
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
          if (updated % 100 === 0) {
            console.log(`   ✅ Đã cập nhật ${updated} từ...`);
          }
        } else {
          // Kiểm tra xem từ có tồn tại không
          const exists = await prisma.chineseWord.findFirst({
            where: { simplified: simplified }
          });
          if (!exists) {
            notFound++;
          }
        }
      } catch (error: any) {
        errors++;
        if (errors <= 10) {
          console.error(`   ⚠️  Lỗi khi update "${simplified}": ${error.message}`);
        }
      }
    }

    console.log(`\n📊 Kết quả:`);
    console.log(`   ✅ Đã cập nhật: ${updated} từ`);
    if (notFound > 0) {
      console.log(`   ⚠️  Không tìm thấy trong database: ${notFound} từ`);
    }
    if (errors > 0) {
      console.log(`   ❌ Lỗi: ${errors} từ`);
    }

    // Thống kê tổng số từ có tiếng Việt
    const totalWithVietnamese = await prisma.chineseWord.count({
      where: {
        vietnamese: { not: null }
      }
    });

    const totalWords = await prisma.chineseWord.count();
    const percentage = ((totalWithVietnamese / totalWords) * 100).toFixed(1);

    console.log(`\n📈 Thống kê sau khi import:`);
    console.log(`   Tổng số từ: ${totalWords}`);
    console.log(`   Có tiếng Việt: ${totalWithVietnamese} (${percentage}%)`);

    console.log('\n✅ Hoàn tất!');

  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

