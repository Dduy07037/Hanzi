import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { geminiService } from '../services/geminiService';

// Helper function to remove Vietnamese diacritics for search
function removeDiacritics(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export class DictionaryController {
  // Tìm kiếm từ trong từ điển
  async search(req: Request, res: Response) {
    try {
      const { q, lang } = req.query;

      if (!q || typeof q !== 'string') {
        return res.status(400).json({ 
          error: 'Vui lòng nhập từ khóa tìm kiếm' 
        });
      }

      const query = q.trim();
      const queryLower = query.toLowerCase();

      // Build search conditions
      const searchConditions: any[] = [
            { simplified: { contains: query } },
            { traditional: { contains: query } },
            { pinyin: { contains: queryLower } },
            { english: { contains: query } }
      ];

      // Add Vietnamese search
      searchConditions.push({ vietnamese: { contains: query } });

      // Build where clause
      const whereClause: any = {
        OR: searchConditions
      };

      // Filter by language if specified
      if (lang === 'vi' || lang === 'vietnamese') {
        whereClause.vietnamese = { not: null };
      }

      const allWords = await prisma.chineseWord.findMany({
        where: whereClause,
        take: 100 // Lấy nhiều hơn để sort
      });

      // Sắp xếp: ưu tiên exact match và từ có tiếng Việt
      const sortedWords = allWords.sort((a, b) => {
        // Exact match simplified
        const aExactSimplified = a.simplified === query;
        const bExactSimplified = b.simplified === query;
        if (aExactSimplified && !bExactSimplified) return -1;
        if (!aExactSimplified && bExactSimplified) return 1;

        // Exact match traditional
        const aExactTraditional = a.traditional === query;
        const bExactTraditional = b.traditional === query;
        if (aExactTraditional && !bExactTraditional) return -1;
        if (!aExactTraditional && bExactTraditional) return 1;

        // Priority: words with Vietnamese translation
        const aHasVietnamese = !!a.vietnamese;
        const bHasVietnamese = !!b.vietnamese;
        if (aHasVietnamese && !bHasVietnamese) return -1;
        if (!aHasVietnamese && bHasVietnamese) return 1;

        // Starts with query
        const aStartsWith = a.simplified.startsWith(query);
        const bStartsWith = b.simplified.startsWith(query);
        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;

        // Frequency (higher is better)
        const freqDiff = (b.frequency || 0) - (a.frequency || 0);
        if (freqDiff !== 0) return freqDiff;

        // HSK level (lower is better)
        const hskA = a.hskLevel || 999;
        const hskB = b.hskLevel || 999;
        return hskA - hskB;
      });

      // Giới hạn kết quả
      const words = sortedWords.slice(0, 50);

      // Tự động dịch từ đầu tiên nếu chưa có tiếng Việt (để hiển thị ngay)
      // Các từ khác sẽ được dịch khi user click vào
      if (words.length > 0 && !words[0].vietnamese && geminiService.isAvailable()) {
        try {
          const firstWord = words[0];
          const vietnamese = await geminiService.translateWord(
            firstWord.simplified,
            firstWord.pinyin,
            firstWord.english
          );

          if (vietnamese) {
            // Lưu vào database (async)
            prisma.chineseWord.update({
              where: { id: firstWord.id },
              data: { vietnamese }
            }).catch(err => {
              console.error(`Lỗi khi lưu tiếng Việt:`, err);
            });

            // Cập nhật để trả về ngay
            words[0].vietnamese = vietnamese;
          }
        } catch (error: any) {
          // Không block response nếu dịch lỗi
          console.error('Lỗi khi dịch từ đầu tiên:', error.message);
        }
      }

      res.json({
        query,
        results: words,
        count: words.length
      });
    } catch (error: any) {
      console.error('Lỗi tìm kiếm:', error);
      res.status(500).json({ 
        error: 'Có lỗi xảy ra khi tìm kiếm',
        ...(process.env.NODE_ENV === 'development' && { details: error.message })
      });
    }
  }

  /**
   * Helper function: Dịch và cache từ nếu chưa có tiếng Việt
   */
  private async translateAndCacheWord(word: any): Promise<any> {
    // Nếu đã có tiếng Việt, không cần dịch
    if (word.vietnamese && word.vietnamese.trim()) {
      return word;
    }

    // Kiểm tra Gemini có sẵn sàng không
    if (!geminiService.isAvailable()) {
      return word;
    }

    try {
      // Dịch bằng Gemini
      const vietnamese = await geminiService.translateWord(
        word.simplified,
        word.pinyin,
        word.english
      );

      if (vietnamese) {
        // Lưu vào database (async, không block response)
        prisma.chineseWord.update({
          where: { id: word.id },
          data: { vietnamese }
        }).catch(err => {
          console.error(`Lỗi khi lưu tiếng Việt cho "${word.simplified}":`, err);
        });

        // Cập nhật word object để trả về ngay
        word.vietnamese = vietnamese;
      }
    } catch (error: any) {
      console.error(`Lỗi khi dịch từ "${word.simplified}":`, error.message);
      // Không throw error, chỉ log và trả về word không có tiếng Việt
    }

    return word;
  }

  // Lấy thông tin chi tiết của một từ
  async getWordById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const word = await prisma.chineseWord.findUnique({
        where: { id }
      });

      if (!word) {
        return res.status(404).json({ 
          error: 'Không tìm thấy từ này' 
        });
      }

      // Tự động dịch nếu chưa có tiếng Việt
      const wordWithTranslation = await this.translateAndCacheWord(word);

      res.json(wordWithTranslation);
    } catch (error) {
      console.error('Lỗi lấy thông tin từ:', error);
      res.status(500).json({ 
        error: 'Có lỗi xảy ra khi lấy thông tin từ' 
      });
    }
  }

  // Lấy danh sách từ theo cấp độ HSK
  async getWordsByHSK(req: Request, res: Response) {
    try {
      const { level } = req.params;
      const hskLevel = parseInt(level);

      if (hskLevel < 1 || hskLevel > 6) {
        return res.status(400).json({ 
          error: 'Cấp độ HSK phải từ 1 đến 6' 
        });
      }

      const words = await prisma.chineseWord.findMany({
        where: { hskLevel },
        orderBy: { frequency: 'desc' }
      });

      res.json({
        hskLevel,
        words,
        count: words.length
      });
    } catch (error) {
      console.error('Lỗi lấy từ HSK:', error);
      res.status(500).json({ 
        error: 'Có lỗi xảy ra khi lấy từ HSK' 
      });
    }
  }
}