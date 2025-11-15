import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY không được tìm thấy trong file .env');
    process.exit(1);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    console.log('🔍 Đang lấy danh sách models có sẵn...\n');

    // Thử list models qua API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    interface GeminiModel {
      name: string;
      displayName?: string;
      description?: string;
      supportedGenerationMethods?: string[];
    }

    interface ModelsResponse {
      models?: GeminiModel[];
    }

    const data = await response.json() as ModelsResponse;
    
    if (data.models && data.models.length > 0) {
      console.log('✅ Các models có sẵn:\n');
      
      const supportedModels = data.models
        .filter((model) => 
          model.supportedGenerationMethods?.includes('generateContent')
        )
        .map((model) => ({
          name: model.name.replace('models/', ''),
          displayName: model.displayName || '',
          description: model.description || '',
          supportedMethods: model.supportedGenerationMethods || []
        }));

      console.table(supportedModels);

      console.log('\n💡 Khuyến nghị sử dụng:');
      const flashModel = supportedModels.find((m) => m.name.includes('flash'));
      const proModel = supportedModels.find((m) => m.name.includes('pro') && !m.name.includes('flash'));
      
      if (flashModel) {
        console.log(`   - ${flashModel.name} (nhanh, rẻ)`);
      }
      if (proModel) {
        console.log(`   - ${proModel.name} (tốt hơn)`);
      }
    } else {
      console.log('⚠️  Không tìm thấy models nào');
    }

  } catch (error: any) {
    console.error('❌ Lỗi:', error.message);
    console.log('\n💡 Thử các model name phổ biến:');
    console.log('   - gemini-pro');
    console.log('   - gemini-1.5-pro');
    console.log('   - gemini-1.5-flash');
    console.log('   - gemini-1.5-pro-latest');
    console.log('   - gemini-1.5-flash-latest');
  }
}

listModels();

