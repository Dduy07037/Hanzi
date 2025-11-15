import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// Enhanced health check với database status
router.get('/', async (req: Request, res: Response) => {
  try {
    // Kiểm tra database connection
    let dbStatus = 'unknown';
    let dbError = null;
    
    try {
      await prisma.$queryRaw`SELECT 1`;
      dbStatus = 'connected';
      
      // Kiểm tra xem có schema chưa
      try {
        await prisma.$queryRaw`SELECT 1 FROM users LIMIT 1`;
        dbStatus = 'connected_with_schema';
      } catch (schemaError: any) {
        if (schemaError.code === '42P01' || schemaError.message?.includes('does not exist')) {
          dbStatus = 'connected_no_schema';
          dbError = 'Database chưa có schema. Cần chạy migrations.';
        } else {
          throw schemaError;
        }
      }
    } catch (error: any) {
      dbStatus = 'disconnected';
      dbError = error.message;
    }

    res.json({
      status: dbStatus === 'connected_with_schema' ? 'OK' : 'WARNING',
      message: 'Hán Ngữ Hub API đang hoạt động',
      timestamp: new Date().toISOString(),
      database: {
        status: dbStatus,
        error: dbError,
        hasSchema: dbStatus === 'connected_with_schema'
      },
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Có lỗi xảy ra khi kiểm tra health',
      error: error.message
    });
  }
});

export default router;

