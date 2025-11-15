# Hướng dẫn Import Từ Điển Đầy Đủ

Để có thể tra được bất cứ từ nào, bạn cần import từ điển CC-CEDICT (hơn 100,000 từ).

## Cách 1: Tự động (Khuyến nghị)

Chạy script PowerShell để tải và giải nén tự động:

```powershell
.\backend\scripts\download-cedict.ps1
```

Sau đó import vào database:

```bash
cd backend
npm run db:seed
```

## Cách 2: Thủ công

### Bước 1: Tải file CC-CEDICT

1. Truy cập: https://www.mdbg.net/chinese/dictionary?page=cc-cedict
2. Tải file: `cedict_1_0_ts_utf-8_mdbg.txt.gz`
3. Giải nén file `.gz` (dùng 7-Zip hoặc WinRAR)
4. Đổi tên file thành: `cedict_1_0_ts_utf-8_mdbg.txt`
5. Di chuyển file vào thư mục: `backend/prisma/`

### Bước 2: Import vào Database

```bash
cd backend
npm run db:seed
```

Script sẽ tự động phát hiện file CC-CEDICT và import tất cả từ vựng.

## Kết quả

Sau khi import thành công:
- ✅ Hơn 100,000 từ vựng tiếng Trung
- ✅ Có thể tra được hầu hết các từ thông dụng
- ✅ Bao gồm cả giản thể và phồn thể
- ✅ Có pinyin và nghĩa tiếng Anh

## Lưu ý

- File CC-CEDICT có thể rất lớn (20-30 MB)
- Quá trình import có thể mất 5-10 phút tùy máy
- Database sẽ tăng kích thước đáng kể
- Nếu import lỗi, có thể chạy lại `npm run db:seed`

## Kiểm tra

Sau khi import, thử tra các từ:
- 你好 (nǐ hǎo) - hello
- 谢谢 (xiè xie) - thank you
- 中国 (zhōng guó) - China
- 学习 (xué xí) - to study

Nếu tìm thấy các từ này, import đã thành công! 🎉

