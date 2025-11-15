import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './lib/prisma';
import setupDatabase from './scripts/setup-db';

import authRoutes from './routes/auth';
import dictionaryRoutes from './routes/dictionary';
import flashcardRoutes from './routes/flashcards';
import statsRoutes from './routes/stats';
import listeningRoutes from './routes/listening';
import writingRoutes from './routes/writing';
import aiFlashcardRoutes from './routes/aiFlashcards';
import healthRoutes from './routes/health';

dotenv.config();

// Setup database tự động (chỉ chạy một lần khi start)
let dbSetupDone = false;
async function initializeDatabase() {
  if (!dbSetupDone && process.env.AUTO_SETUP_DB !== 'false') {
    dbSetupDone = true;
    await setupDatabase();
  }
}

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

// Middleware
// CORS: Cho phép nhiều origins (frontend có thể có URL khác nhau)
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : ['http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    // Cho phép requests không có origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Kiểm tra origin có trong danh sách allowed không
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // Log để debug
      console.log(`⚠️  CORS blocked origin: ${origin}`);
      console.log(`📋 Allowed origins: ${allowedOrigins.join(', ')}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dictionary', dictionaryRoutes);
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/listening', listeningRoutes);
app.use('/api/writing', writingRoutes);
app.use('/api/ai-flashcards', aiFlashcardRoutes);

// Health check với database status
app.use('/health', healthRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ 
    error: err.message || 'Có lỗi xảy ra trên server',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Không tìm thấy endpoint này' 
  });
});

// Start server
async function startServer() {
  // Setup database trước khi start server
  await initializeDatabase();
  
  app.listen(PORT, '0.0.0.0', () => {
    const serverUrl = process.env.SERVER_URL || `http://localhost:${PORT}`;
    console.log(`🚀 Server đang chạy tại ${serverUrl}`);
    console.log(`📚 Hán Ngữ Hub API đã sẵn sàng!`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer().catch((error) => {
  console.error('❌ Lỗi khi khởi động server:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Đang đóng kết nối database...');
  await prisma.$disconnect();
  process.exit(0);
});