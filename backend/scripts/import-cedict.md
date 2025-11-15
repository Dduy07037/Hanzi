# Hướng dẫn Import CC-CEDICT Dictionary

CC-CEDICT là từ điển tiếng Trung miễn phí với hơn 100,000 từ vựng.

## Bước 1: Tải file CC-CEDICT

1. Truy cập: https://www.mdbg.net/chinese/dictionary?page=cc-cedict
2. Tải file: `cedict_1_0_ts_utf-8_mdbg.txt`
3. Lưu file vào thư mục: `backend/prisma/cedict_1_0_ts_utf-8_mdbg.txt`

Hoặc dùng direct link:
- https://www.mdbg.net/chinese/export/cedict/cedict_1_0_ts_utf-8_mdbg.txt.gz
- Giải nén file .gz và đặt vào `backend/prisma/`

## Bước 2: Import vào Database

Sau khi có file, chạy:

```bash
cd backend
npm run db:seed
```

Script sẽ tự động phát hiện file CC-CEDICT và import tất cả từ vựng.

## Lưu ý

- File CC-CEDICT có thể rất lớn (hàng chục MB)
- Quá trình import có thể mất vài phút
- Database sẽ có hơn 100,000 từ vựng sau khi import

