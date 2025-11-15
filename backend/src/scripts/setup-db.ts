import prisma from '../lib/prisma';
import { execSync } from 'child_process';
import * as path from 'path';

async function setupDatabase() {
  try {
    console.log('🔧 Đang kiểm tra và setup database...');
    
    // Kiểm tra xem database đã có schema chưa bằng cách thử query một bảng
    try {
      await prisma.$queryRaw`SELECT 1 FROM users LIMIT 1`;
      console.log('✅ Database đã có schema, bỏ qua setup');
      return;
    } catch (error: any) {
      // Nếu bảng chưa tồn tại, cần push schema
      if (error.code === '42P01' || error.message?.includes('does not exist') || error.message?.includes('relation') && error.message?.includes('does not exist')) {
        console.log('📦 Database chưa có schema, đang push schema...');
        
        // Chạy prisma db push
        try {
          execSync('npx prisma db push --accept-data-loss', { 
            stdio: 'inherit',
            cwd: path.join(__dirname, '../..')
          });
          console.log('✅ Đã push schema thành công');
        } catch (pushError: any) {
          console.error('❌ Lỗi khi push schema:', pushError.message);
          // Tiếp tục thử seed dù có lỗi
        }
        
        // Thử seed nếu có thể
        try {
          console.log('🌱 Đang seed dữ liệu...');
          execSync('npx ts-node prisma/seed.ts', { 
            stdio: 'inherit',
            cwd: path.join(__dirname, '../..')
          });
          console.log('✅ Đã seed dữ liệu thành công');
        } catch (seedError: any) {
          console.warn('⚠️  Không thể seed dữ liệu (có thể đã có dữ liệu hoặc thiếu ts-node):', seedError.message);
          // Không throw, chỉ warn
        }
      } else {
        // Lỗi khác, có thể là connection error
        console.warn('⚠️  Lỗi khi kiểm tra database:', error.message);
        console.warn('⚠️  Server vẫn sẽ start, nhưng có thể cần setup database thủ công');
      }
    }
  } catch (error: any) {
    console.error('❌ Lỗi khi setup database:', error.message);
    // Không throw error để server vẫn có thể start
    // Admin có thể setup thủ công sau
  }
}

// Chỉ chạy nếu được gọi trực tiếp
if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log('✅ Setup database hoàn tất');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Lỗi setup database:', error);
      process.exit(1);
    });
}

export default setupDatabase;

