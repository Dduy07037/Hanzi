# Template Prompt để gửi cho AI (ChatGPT/Claude)

## Prompt mẫu

Copy và paste prompt này vào ChatGPT hoặc Claude, sau đó attach file `words-to-translate.json`:

```
Tôi cần bạn dịch danh sách từ tiếng Trung sang tiếng Việt.

Mỗi từ có thông tin:
- simplified: Chữ Hán giản thể
- pinyin: Phiên âm
- english: Nghĩa tiếng Anh
- hskLevel: Cấp độ HSK (1-6, null nếu không có)

Yêu cầu:
1. Dịch nghĩa tiếng Việt dựa trên nghĩa tiếng Anh
2. Nếu từ có nhiều nghĩa, dùng dấu phẩy để phân cách (ví dụ: "bạn, anh, chị, em")
3. Dịch chính xác, phù hợp với ngữ cảnh tiếng Việt
4. Ưu tiên nghĩa thông dụng nhất
5. Giữ nguyên format JSON

Format output mong muốn:
{
  "你": "bạn, anh, chị, em",
  "我": "tôi, ta",
  "好": "tốt, hay, được",
  "是": "là",
  ...
}

Lưu ý:
- Key là chữ Hán giản thể (simplified)
- Value là nghĩa tiếng Việt
- Không cần thêm metadata khác
- Chỉ trả về JSON object, không cần giải thích

Hãy dịch tất cả các từ trong file đính kèm.
```

## Cách sử dụng

### Với ChatGPT:
1. Mở ChatGPT
2. Paste prompt trên
3. Attach file `words-to-translation.json` (nếu có nhiều từ, chia nhỏ thành nhiều file)
4. Copy kết quả JSON
5. Lưu vào file `vietnamese-mapping.json`

### Với Claude:
1. Mở Claude
2. Paste prompt trên
3. Upload file `words-to-translation.json`
4. Copy kết quả JSON
5. Lưu vào file `vietnamese-mapping.json`

## Chia nhỏ dữ liệu

Nếu có quá nhiều từ (hơn 2000), nên chia thành nhiều batch:

**Batch 1: HSK 1-2 (ưu tiên cao nhất)**
```
Chỉ dịch các từ có hskLevel là 1 hoặc 2
```

**Batch 2: HSK 3-4**
```
Chỉ dịch các từ có hskLevel là 3 hoặc 4
```

**Batch 3: HSK 5-6**
```
Chỉ dịch các từ có hskLevel là 5 hoặc 6
```

**Batch 4: Không có HSK**
```
Chỉ dịch các từ không có hskLevel
```

## Kiểm tra chất lượng

Sau khi AI dịch, nên kiểm tra một số từ quan trọng:

- 你 (nǐ) - bạn
- 我 (wǒ) - tôi
- 好 (hǎo) - tốt
- 是 (shì) - là
- 不 (bù) - không
- 的 (de) - của
- 了 (le) - đã, rồi
- 在 (zài) - ở, tại
- 有 (yǒu) - có
- 人 (rén) - người

Nếu các từ này dịch đúng, có thể tin tưởng phần còn lại.

