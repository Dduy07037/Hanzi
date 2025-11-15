-- Script tạo database cho Hán Ngữ Hub
-- Chạy: psql -U postgres -f create-db.sql

-- Tạo database
CREATE DATABASE han_ngu_hub;

-- Kết nối vào database mới
\c han_ngu_hub

-- Hiển thị thông báo
\echo 'Database han_ngu_hub đã được tạo thành công!'
\echo 'Bây giờ bạn có thể chạy: cd backend && npm run db:push && npm run db:seed'


