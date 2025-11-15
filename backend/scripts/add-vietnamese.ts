import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Mapping các từ thông dụng với tiếng Việt
// Có thể mở rộng file này sau
const commonVietnameseMapping: Record<string, string> = {
  // Từ cơ bản
  '你': 'bạn, anh, chị, em',
  '我': 'tôi, ta',
  '他': 'anh ấy, ông ấy',
  '她': 'cô ấy, chị ấy',
  '好': 'tốt, hay, được',
  '是': 'là',
  '不': 'không',
  '的': 'của, thuộc về',
  '了': 'đã, rồi',
  '在': 'ở, tại',
  '有': 'có',
  '人': 'người',
  '一': 'một, số một',
  '这': 'này, đây',
  '个': 'cái, chiếc',
  '上': 'trên, lên',
  '们': 'chúng, các',
  '来': 'đến, tới',
  '到': 'đến, tới',
  '为': 'vì, để',
  '地': 'đất, địa',
  '说': 'nói',
  '时': 'thời gian, lúc',
  '可': 'có thể',
  '能': 'có thể, năng lực',
  '要': 'muốn, cần',
  '以': 'để, bằng',
  '生': 'sinh, sống',
  '家': 'nhà, gia đình',
  '会': 'sẽ, biết',
  '作': 'làm, tác',
  '于': 'ở, tại',
  '成': 'thành, hoàn thành',
  '你好': 'xin chào',
  '谢谢': 'cảm ơn',
  '对不起': 'xin lỗi',
  '没关系': 'không sao',
  '学习': 'học tập',
  '工作': 'công việc, làm việc',
  '喜欢': 'thích',
  '时间': 'thời gian',
  '朋友': 'bạn bè',
  '家人': 'người nhà, gia đình',
  '中国': 'Trung Quốc',
  '北京': 'Bắc Kinh',
  '上海': 'Thượng Hải',
  '学校': 'trường học',
  '老师': 'giáo viên',
  '学生': 'học sinh',
  '今天': 'hôm nay',
  '明天': 'ngày mai',
  '昨天': 'hôm qua',
  '现在': 'bây giờ',
  '什么': 'cái gì',
  '哪里': 'ở đâu',
  '怎么': 'như thế nào',
  '为什么': 'tại sao',
  '多少': 'bao nhiêu',
  '多少': 'bao nhiêu',
  '多少': 'bao nhiêu',
};

async function main() {
  console.log('🇻🇳 Bắt đầu thêm tiếng Việt cho các từ...');

  try {
    let updated = 0;
    let notFound = 0;

    // Update các từ có trong mapping
    for (const [simplified, vietnamese] of Object.entries(commonVietnameseMapping)) {
      try {
        const result = await prisma.chineseWord.updateMany({
          where: {
            simplified: simplified,
            vietnamese: null // Chỉ update những từ chưa có tiếng Việt
          },
          data: {
            vietnamese: vietnamese
          }
        });

        if (result.count > 0) {
          updated += result.count;
          console.log(`✅ Đã thêm tiếng Việt cho "${simplified}": ${vietnamese} (${result.count} từ)`);
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
        console.error(`❌ Lỗi khi update "${simplified}": ${error.message}`);
      }
    }

    console.log(`\n📊 Kết quả:`);
    console.log(`✅ Đã cập nhật: ${updated} từ`);
    if (notFound > 0) {
      console.log(`⚠️  Không tìm thấy: ${notFound} từ trong database`);
    }

    // Thống kê tổng số từ có tiếng Việt
    const totalWithVietnamese = await prisma.chineseWord.count({
      where: {
        vietnamese: { not: null }
      }
    });

    const totalWords = await prisma.chineseWord.count();
    console.log(`\n📈 Thống kê:`);
    console.log(`   Tổng số từ: ${totalWords}`);
    console.log(`   Có tiếng Việt: ${totalWithVietnamese} (${((totalWithVietnamese / totalWords) * 100).toFixed(1)}%)`);

    console.log('\n✅ Hoàn tất!');
  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

