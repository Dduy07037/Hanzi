# Hướng dẫn sử dụng AI để tạo file tiếng Việt cho từ điển

## Vấn đề hiện tại

Script `add-vietnamese.ts` hiện chỉ có khoảng 70 từ thông dụng. Để có đầy đủ tiếng Việt cho từ điển, bạn cần tạo file mapping lớn hơn với hàng nghìn từ.

## Cách sử dụng AI để tạo file tiếng Việt

### Bước 1: Lấy danh sách từ từ database

Chạy script để export danh sách từ cần dịch:

```bash
cd backend
npx ts-node scripts/export-words-for-translation.ts
```

Script này sẽ tạo file `words-to-translate.json` chứa danh sách từ cần dịch.

### Bước 2: Sử dụng AI để dịch

**Option A: Sử dụng ChatGPT/Claude**

1. Mở ChatGPT hoặc Claude
2. Copy nội dung file `words-to-translate.json`
3. Gửi prompt sau:

```
Tôi có danh sách từ tiếng Trung cần dịch sang tiếng Việt. Mỗi từ có:
- simplified: chữ giản thể
- pinyin: phiên âm
- english: nghĩa tiếng Anh

Hãy dịch nghĩa tiếng Việt cho mỗi từ dựa trên nghĩa tiếng Anh. 
Trả về dạng JSON với format:
{
  "你": "bạn, anh, chị, em",
  "我": "tôi, ta",
  ...
}

Lưu ý:
- Nếu từ có nhiều nghĩa, dùng dấu phẩy để phân cách
- Dịch chính xác, phù hợp với ngữ cảnh tiếng Việt
- Ưu tiên nghĩa thông dụng nhất
```

4. Copy kết quả và lưu vào file `vietnamese-mapping.json`

**Option B: Sử dụng API dịch thuật**

Bạn có thể sử dụng Google Translate API hoặc các dịch vụ dịch thuật khác để tự động dịch.

### Bước 3: Tạo file TypeScript mapping

Sau khi có file JSON từ AI, chuyển đổi sang format TypeScript:

```bash
npx ts-node scripts/convert-json-to-ts.ts
```

Hoặc tự tạo file `vietnamese-mapping-large.ts` với format:

```typescript
export const vietnameseMapping: Record<string, string> = {
  '你': 'bạn, anh, chị, em',
  '我': 'tôi, ta',
  // ... thêm các từ khác
};
```

### Bước 4: Cập nhật script add-vietnamese.ts

Thay thế `commonVietnameseMapping` trong `add-vietnamese.ts` bằng mapping mới:

```typescript
import { vietnameseMapping } from './vietnamese-mapping-large';

const commonVietnameseMapping = vietnameseMapping;
```

### Bước 5: Chạy script để cập nhật database

```bash
cd backend
npm run db:add-vietnamese
```

## Template để gửi cho AI

### Template cho ChatGPT/Claude:

```
Tôi cần bạn dịch danh sách từ tiếng Trung sang tiếng Việt. 

Dữ liệu đầu vào (JSON):
[
  {
    "simplified": "你",
    "pinyin": "ni3",
    "english": "you"
  },
  {
    "simplified": "我", 
    "pinyin": "wo3",
    "english": "I, me"
  },
  ...
]

Yêu cầu:
1. Dịch nghĩa tiếng Việt dựa trên nghĩa tiếng Anh
2. Nếu từ có nhiều nghĩa, dùng dấu phẩy để phân cách
3. Trả về dạng JSON object với key là chữ giản thể, value là nghĩa tiếng Việt

Format output:
{
  "你": "bạn, anh, chị, em",
  "我": "tôi, ta",
  ...
}

Hãy dịch chính xác và phù hợp với ngữ cảnh tiếng Việt.
```

## Lưu ý quan trọng

1. **Chia nhỏ dữ liệu**: Nếu có quá nhiều từ (hơn 1000), chia thành nhiều batch để AI xử lý tốt hơn
2. **Kiểm tra chất lượng**: Sau khi AI dịch, nên review lại một số từ quan trọng
3. **Ưu tiên HSK 1-6**: Nên dịch các từ HSK 1-6 trước vì đây là từ thông dụng nhất
4. **Backup database**: Trước khi chạy script update, nên backup database

## Script hỗ trợ

Tôi sẽ tạo các script hỗ trợ:
- `export-words-for-translation.ts`: Export danh sách từ cần dịch
- `convert-json-to-ts.ts`: Chuyển đổi JSON từ AI sang TypeScript
- `import-vietnamese-from-json.ts`: Import trực tiếp từ file JSON

