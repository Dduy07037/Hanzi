import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        this.genAI = new GoogleGenerativeAI(apiKey);
        // Thử các model name khác nhau
        // Một số API key có thể chỉ hỗ trợ model cũ
        const modelName = process.env.GEMINI_MODEL || this.getDefaultModel();
        this.model = this.genAI.getGenerativeModel({ model: modelName });
        console.log(`✅ Đã khởi tạo Gemini với model: ${modelName}`);
      } catch (error: any) {
        console.warn('⚠️  Không thể khởi tạo với model mặc định:', error.message);
        // Thử các model khác
        if (apiKey) {
          const fallbackModels = ['gemini-2.0-flash', 'gemini-2.5-pro', 'gemini-pro'];
          for (const modelName of fallbackModels) {
            try {
              console.log(`🔄 Thử model ${modelName}...`);
              this.model = this.genAI!.getGenerativeModel({ model: modelName });
              console.log(`✅ Đã khởi tạo với model: ${modelName}`);
              break;
            } catch (e: any) {
              // Tiếp tục thử model tiếp theo
            }
          }
          if (!this.model) {
            console.error('❌ Không thể khởi tạo với bất kỳ model nào. Vui lòng chạy: npm run db:list-gemini-models để xem models có sẵn');
          }
        }
      }
    }
  }

  /**
   * Lấy default model name
   * Ưu tiên gemini-2.5-flash (mới nhất, nhanh, rẻ)
   * Fallback về gemini-pro nếu không có
   */
  private getDefaultModel(): string {
    // Thử model mới nhất trước
    return 'gemini-2.5-flash';
  }

  /**
   * Dịch một từ tiếng Trung sang tiếng Việt với retry logic
   */
  async translateWord(simplified: string, pinyin: string, english: string): Promise<string | null> {
    if (!this.model) {
      console.warn('⚠️  Gemini API chưa được cấu hình. Vui lòng thêm GEMINI_API_KEY vào .env');
      return null;
    }

    const prompt = `Dịch từ tiếng Trung sau sang tiếng Việt:

Chữ Hán: ${simplified}
Pinyin: ${pinyin}
Nghĩa tiếng Anh: ${english}

Yêu cầu:
1. Dịch nghĩa tiếng Việt dựa trên nghĩa tiếng Anh
2. Nếu từ có nhiều nghĩa, dùng dấu phẩy để phân cách (ví dụ: "bạn, anh, chị, em")
3. Dịch chính xác, phù hợp với ngữ cảnh tiếng Việt
4. Ưu tiên nghĩa thông dụng nhất
5. Chỉ trả về nghĩa tiếng Việt, không cần giải thích thêm

Nghĩa tiếng Việt:`;

    // Thử với model hiện tại trước
    let result = await this.tryTranslateWithModel(this.model, prompt, simplified);
    if (result) return result;

    // Nếu model hiện tại bị overload, thử fallback models
    if (this.genAI) {
      const fallbackModels = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.5-flash-lite'];
      for (const modelName of fallbackModels) {
        try {
          const fallbackModel = this.genAI.getGenerativeModel({ model: modelName });
          console.log(`🔄 Thử fallback model: ${modelName}`);
          result = await this.tryTranslateWithModel(fallbackModel, prompt, simplified);
          if (result) {
            // Nếu fallback thành công, có thể cache model này
            return result;
          }
        } catch (e: any) {
          // Tiếp tục thử model tiếp theo
        }
      }
    }

    return null;
  }

  /**
   * Thử dịch với một model cụ thể, có retry logic
   */
  private async tryTranslateWithModel(model: any, prompt: string, simplified: string, maxRetries = 2): Promise<string | null> {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await model.generateContent(prompt);
        const responseText = result.response.text().trim();
        
        if (!responseText) {
          console.warn(`⚠️  Model trả về response rỗng cho từ "${simplified}"`);
          return null;
        }

        // Làm sạch response
        let translation = responseText.replace(/^["']|["']$/g, '').trim();

        // Giới hạn độ dài
        if (translation.length > 200) {
          translation = translation.substring(0, 200);
        }

        return translation || null;
      } catch (error: any) {
        const isOverloaded = error.message?.includes('503') || error.message?.includes('overloaded');
        const isRateLimit = error.message?.includes('429') || error.message?.includes('rate limit');
        
        if (isOverloaded || isRateLimit) {
          if (attempt < maxRetries) {
            // Exponential backoff: đợi 1s, 2s, 4s...
            const delay = Math.pow(2, attempt) * 1000;
            console.log(`⏳ Model quá tải, đợi ${delay}ms trước khi thử lại... (lần ${attempt + 1}/${maxRetries + 1})`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          } else {
            console.warn(`⚠️  Model quá tải sau ${maxRetries + 1} lần thử cho từ "${simplified}"`);
            return null;
          }
        } else {
          // Lỗi khác, không retry
          console.error(`❌ Lỗi khi dịch từ "${simplified}":`, error.message);
          return null;
        }
      }
    }
    return null;
  }

  /**
   * Tạo danh sách từ vựng dựa trên mô tả của người dùng
   * Trả về danh sách các từ (simplified, pinyin, english) để tìm trong database
   */
  async generateFlashcardsFromDescription(description: string, count: number = 20): Promise<Array<{
    simplified: string;
    pinyin: string;
    english: string;
    hskLevel?: number;
  }> | null> {
    if (!this.model) {
      console.warn('⚠️  Gemini API chưa được cấu hình');
      return null;
    }

    const prompt = `Bạn là trợ lý tạo bộ thẻ học tiếng Trung. Người dùng muốn tạo bộ thẻ với mô tả: "${description}"

Yêu cầu:
1. Tạo danh sách ${count} từ vựng tiếng Trung phù hợp với mô tả
2. Mỗi từ cần có: chữ Hán giản thể (simplified), pinyin (không dấu), nghĩa tiếng Anh
3. Nếu có thể, ước tính cấp độ HSK (1-6)
4. Trả về dưới dạng JSON array, mỗi object có format:
{
  "simplified": "你好",
  "pinyin": "ni hao",
  "english": "hello",
  "hskLevel": 1
}

Chỉ trả về JSON array, không có text thêm.`;

    try {
      const result = await this.model.generateContent(prompt);
      let responseText = result.response.text().trim();
      
      // Làm sạch response - loại bỏ markdown code blocks nếu có
      let jsonText = responseText;
      if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      }
      
      // Thử parse JSON
      try {
        const words = JSON.parse(jsonText);
        
        if (!Array.isArray(words)) {
          console.error('❌ Response không phải là array');
          return null;
        }

        // Validate và format
        const validWords = words
          .filter((word: any) => word.simplified && word.pinyin && word.english)
          .map((word: any) => ({
            simplified: word.simplified.trim(),
            pinyin: word.pinyin.trim().toLowerCase(),
            english: word.english.trim(),
            hskLevel: word.hskLevel && word.hskLevel >= 1 && word.hskLevel <= 6 ? word.hskLevel : undefined
          }));

        return validWords.length > 0 ? validWords : null;
      } catch (parseError) {
        // Nếu parse JSON thất bại, thử extract JSON từ response
        const jsonMatch = responseText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          try {
            const words = JSON.parse(jsonMatch[0]);
            if (Array.isArray(words)) {
              return words
                .filter((word: any) => word.simplified && word.pinyin && word.english)
                .map((word: any) => ({
                  simplified: word.simplified?.trim() || '',
                  pinyin: word.pinyin?.trim().toLowerCase() || '',
                  english: word.english?.trim() || '',
                  hskLevel: word.hskLevel && word.hskLevel >= 1 && word.hskLevel <= 6 ? word.hskLevel : undefined
                }))
                .filter((w: any) => w.simplified && w.pinyin && w.english);
            }
          } catch (e) {
            // Ignore
          }
        }
        console.error('❌ Không thể parse JSON từ response:', parseError);
        return null;
      }
    } catch (error: any) {
      console.error('❌ Lỗi khi generate flashcards:', error.message);
      return null;
    }
  }

  /**
   * Kiểm tra xem Gemini API có sẵn sàng không
   */
  isAvailable(): boolean {
    return this.model !== null;
  }
}

// Singleton instance
export const geminiService = new GeminiService();

