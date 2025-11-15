import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// Sử dụng PrismaClient từ lib để đảm bảo singleton
// Nếu chạy từ seed, cần tạo instance riêng
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

// Hàm parse dòng CC-CEDICT
function parseCCEDICTLine(line: string) {
  // Bỏ qua các dòng comment và dòng trống
  const trimmedLine = line.trim();
  if (trimmedLine.startsWith('#') || trimmedLine.length === 0) return null;
  
  // Format: traditional simplified [pinyin] /english/ /english2/
  // Regex: tìm traditional, simplified, pinyin trong [], và tất cả các nghĩa trong /.../
  const match = trimmedLine.match(/^([^\s]+)\s+([^\s]+)\s+\[([^\]]+)\]\s+(.+)$/);
  
  if (!match) return null;
  
  const [, traditional, simplified, pinyin, englishPart] = match;
  
  // Lấy tất cả các nghĩa từ /english/ /english2/
  // Tách bằng / và lọc các phần không rỗng
  const englishMatches = englishPart.match(/\/([^\/]+)\//g);
  let english = '';
  
  if (englishMatches && englishMatches.length > 0) {
    english = englishMatches
      .map(m => m.replace(/\//g, '').trim())
      .filter(e => e.length > 0)
      .join('; ');
  } else {
    // Fallback: lấy tất cả sau dấu / đầu tiên
    const firstSlash = englishPart.indexOf('/');
    if (firstSlash >= 0) {
      english = englishPart.substring(firstSlash + 1).replace(/\//g, '').trim();
    } else {
      english = englishPart.trim();
    }
  }
  
  if (!simplified || !pinyin || !english || english.length === 0) return null;
  
  return {
    traditional: traditional.trim(),
    simplified: simplified.trim(),
    pinyin: pinyin.trim().toLowerCase().replace(/\s+/g, ' '),
    english: english
  };
}

// Hàm xác định cấp độ HSK dựa trên tần suất
function determineHSKLevel(simplified: string): number | null {
  // Đây là logic đơn giản, trong thực tế cần dữ liệu HSK chính xác
  const commonWordsHSK1 = ['的', '一', '是', '不', '了', '人', '我', '在', '有', '他'];
  const commonWordsHSK2 = ['这', '个', '上', '们', '来', '到', '为', '地', '说', '时'];
  const commonWordsHSK3 = ['可', '能', '要', '以', '生', '家', '会', '作', '于', '成'];
  
  if (commonWordsHSK1.includes(simplified)) return 1;
  if (commonWordsHSK2.includes(simplified)) return 2;
  if (commonWordsHSK3.includes(simplified)) return 3;
  
  return null;
}

async function main() {
  console.log('🌱 Bắt đầu seed database...');

  try {
    // Đọc file CC-CEDICT (giả định đã tải về)
    const cedictPath = path.join(__dirname, 'cedict_1_0_ts_utf-8_mdbg.txt');
    
    if (!fs.existsSync(cedictPath)) {
      console.log('⚠️  Không tìm thấy file CC-CEDICT.');
      console.log('📥 Để có đầy đủ từ vựng, vui lòng:');
      console.log('   1. Tải file từ: https://www.mdbg.net/chinese/dictionary?page=cc-cedict');
      console.log('   2. Lưu file "cedict_1_0_ts_utf-8_mdbg.txt" vào thư mục backend/prisma/');
      console.log('   3. Chạy lại: npm run db:seed');
      console.log('');
      console.log('⚠️  Tạo dữ liệu mẫu (10 từ) thay thế...');
      
      // Tạo dữ liệu mẫu nếu không có file CC-CEDICT
      const sampleWords = [
        {
          simplified: '你好',
          traditional: '你好',
          pinyin: 'ni3 hao3',
          pinyinTone: 'nǐ hǎo',
          english: 'hello; hi',
          vietnamese: 'xin chào',
          hskLevel: 1,
          frequency: 1000
        },
        {
          simplified: '谢谢',
          traditional: '謝謝',
          pinyin: 'xie4 xie',
          pinyinTone: 'xiè xie',
          english: 'to thank; thanks',
          vietnamese: 'cảm ơn',
          hskLevel: 1,
          frequency: 950
        },
        {
          simplified: '对不起',
          traditional: '對不起',
          pinyin: 'dui4 bu5 qi3',
          pinyinTone: 'duì bu qǐ',
          english: 'sorry; excuse me',
          vietnamese: 'xin lỗi',
          hskLevel: 2,
          frequency: 800
        },
        {
          simplified: '没关系',
          traditional: '沒關係',
          pinyin: 'mei2 guan1 xi5',
          pinyinTone: 'méi guān xi',
          english: 'it doesn\'t matter; no problem',
          vietnamese: 'không sao',
          hskLevel: 2,
          frequency: 750
        },
        {
          simplified: '学习',
          traditional: '學習',
          pinyin: 'xue2 xi2',
          pinyinTone: 'xué xí',
          english: 'to learn; to study',
          vietnamese: 'học tập',
          hskLevel: 3,
          frequency: 700
        },
        {
          simplified: '工作',
          traditional: '工作',
          pinyin: 'gong1 zuo4',
          pinyinTone: 'gōng zuò',
          english: 'work; job',
          vietnamese: 'công việc',
          hskLevel: 3,
          frequency: 650
        },
        {
          simplified: '喜欢',
          traditional: '喜歡',
          pinyin: 'xi3 huan5',
          pinyinTone: 'xǐ huan',
          english: 'to like; to be fond of',
          vietnamese: 'thích',
          hskLevel: 2,
          frequency: 600
        },
        {
          simplified: '时间',
          traditional: '時間',
          pinyin: 'shi2 jian1',
          pinyinTone: 'shí jiān',
          english: 'time',
          vietnamese: 'thời gian',
          hskLevel: 2,
          frequency: 550
        },
        {
          simplified: '朋友',
          traditional: '朋友',
          pinyin: 'peng2 you3',
          pinyinTone: 'péng yǒu',
          english: 'friend',
          vietnamese: 'bạn bè',
          hskLevel: 1,
          frequency: 500
        },
        {
          simplified: '家人',
          traditional: '家人',
          pinyin: 'jia1 ren2',
          pinyinTone: 'jiā rén',
          english: 'family members',
          vietnamese: 'ngườI nhà',
          hskLevel: 2,
          frequency: 450
        }
      ];

      // Xóa dữ liệu cũ
      await prisma.chineseWord.deleteMany();
      
      // Thêm dữ liệu mẫu
      for (const word of sampleWords) {
        await prisma.chineseWord.create({
          data: word
        });
      }

      console.log(`✅ Đã thêm ${sampleWords.length} từ mẫu`);
    } else {
      // Parse file CC-CEDICT
      console.log('📖 Đang đọc file CC-CEDICT...');
      console.log('⏳ Quá trình này có thể mất vài phút, vui lòng đợi...');
      
      const content = fs.readFileSync(cedictPath, 'utf-8');
      const lines = content.split('\n');
      
      let count = 0;
      let skipped = 0;
      const batchSize = 1000;
      let batch: any[] = [];
      const startTime = Date.now();
      
      // Xóa dữ liệu cũ (optional - comment nếu muốn giữ lại)
      console.log('🗑️  Xóa dữ liệu cũ...');
      await prisma.chineseWord.deleteMany();
      
      let parsedCount = 0;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const parsed = parseCCEDICTLine(line);
        
        if (parsed) {
          parsedCount++;
          // Parse pinyin để tách pinyin và pinyinTone
          const pinyinParts = parsed.pinyin.split(' ');
          let pinyinTone = '';
          
          // Tạo pinyin có dấu (đơn giản hóa - có thể cải thiện)
          try {
            pinyinTone = pinyinParts.map(p => {
              // Logic đơn giản để thêm dấu thanh điệu
              // Trong thực tế cần library chuyên dụng
              return p;
            }).join(' ');
          } catch (e) {
            pinyinTone = parsed.pinyin;
          }
          
          const hskLevel = determineHSKLevel(parsed.simplified);
          
          batch.push({
            simplified: parsed.simplified,
            traditional: parsed.traditional !== parsed.simplified ? parsed.traditional : null,
            pinyin: parsed.pinyin.toLowerCase(),
            pinyinTone: pinyinTone || null,
            english: parsed.english,
            hskLevel,
            frequency: Math.floor(Math.random() * 1000) + 1
          });
          
          if (batch.length >= batchSize) {
            try {
            await prisma.chineseWord.createMany({
              data: batch,
              skipDuplicates: true
            });
            count += batch.length;
            batch = [];
              
              // Hiển thị tiến độ mỗi 5000 từ
              if (count % 5000 === 0) {
                const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
                console.log(`⏳ Đã thêm ${count} từ... (${elapsed}s)`);
              }
            } catch (error: any) {
              skipped += batch.length;
              batch = [];
              if (error.code !== 'P2002') { // Bỏ qua lỗi duplicate
                console.error(`Lỗi khi thêm batch: ${error.message}`);
              }
            }
          }
        }
      }
      
      // Thêm batch cuối cùng
      if (batch.length > 0) {
        try {
        await prisma.chineseWord.createMany({
          data: batch,
          skipDuplicates: true
        });
        count += batch.length;
        } catch (error: any) {
          skipped += batch.length;
        }
      }
      
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`📊 Đã parse được ${parsedCount} dòng hợp lệ`);
      console.log(`✅ Đã import ${count} từ từ CC-CEDICT trong ${elapsed} giây`);
      if (skipped > 0) {
        console.log(`⚠️  Đã bỏ qua ${skipped} từ (có thể do duplicate hoặc lỗi)`);
      }
      if (parsedCount > 0 && count === 0) {
        console.log(`⚠️  Cảnh báo: Đã parse được ${parsedCount} từ nhưng không import được. Kiểm tra lỗi database.`);
      }
    }

    console.log('🌱 Seed database thành công!');
  } catch (error) {
    console.error('❌ Lỗi khi seed database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();