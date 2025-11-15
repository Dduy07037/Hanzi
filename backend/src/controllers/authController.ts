import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';

export class AuthController {
  // Đăng ký ngưởi dùng mới
  async register(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;

      // Kiểm tra dữ liệu đầu vào
      if (!email || !password || !name) {
        return res.status(400).json({ 
          error: 'Vui lòng điền đầy đủ thông tin' 
        });
      }

      // Kiểm tra định dạng email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ 
          error: 'Email không hợp lệ' 
        });
      }

      // Kiểm tra độ dài mật khẩu
      if (password.length < 6) {
        return res.status(400).json({ 
          error: 'Mật khẩu phải có ít nhất 6 ký tự' 
        });
      }

      // Kiểm tra xem email đã tồn tại chưa
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return res.status(400).json({ 
          error: 'Email này đã được sử dụng' 
        });
      }

      // Mã hóa mật khẩu
      const hashedPassword = await bcrypt.hash(password, 10);

      // Tạo ngưởi dùng mới
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true
        }
      });

      // Kiểm tra JWT_SECRET
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET không được cấu hình');
      }

      // Tạo JWT token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        message: 'Đăng ký thành công',
        user,
        token
      });
    } catch (error: any) {
      console.error('Lỗi đăng ký:', error);
      
      // Xử lý lỗi Prisma unique constraint
      if (error.code === 'P2002') {
        return res.status(400).json({ 
          error: 'Email này đã được sử dụng' 
        });
      }
      
      res.status(500).json({ 
        error: error.message || 'Có lỗi xảy ra khi đăng ký',
        ...(process.env.NODE_ENV === 'development' && { details: error.message })
      });
    }
  }

  // Đăng nhập
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Kiểm tra dữ liệu đầu vào
      if (!email || !password) {
        return res.status(400).json({ 
          error: 'Vui lòng điền email và mật khẩu' 
        });
      }

      // Tìm ngưởi dùng theo email
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return res.status(400).json({ 
          error: 'Email hoặc mật khẩu không đúng' 
        });
      }

      // Kiểm tra mật khẩu
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(400).json({ 
          error: 'Email hoặc mật khẩu không đúng' 
        });
      }

      // Kiểm tra JWT_SECRET
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET không được cấu hình');
      }

      // Tạo JWT token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Đăng nhập thành công',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt
        },
        token
      });
    } catch (error: any) {
      console.error('Lỗi đăng nhập:', error);
      res.status(500).json({ 
        error: error.message || 'Có lỗi xảy ra khi đăng nhập',
        ...(process.env.NODE_ENV === 'development' && { details: error.message })
      });
    }
  }
}