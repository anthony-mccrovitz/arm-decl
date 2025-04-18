
// In a real app, this would make API calls to a backend
// For now, we'll use our local utility functions directly

import { translateToEnglish, translateToArm } from "../utils/armTranslator";

export type TranslationMode = "toEnglish" | "toArm";

export interface TranslationRequest {
  text: string;
  mode: TranslationMode;
}

export interface TranslationResponse {
  result: string;
  success: boolean;
  error?: string;
}

export const translateText = async (request: TranslationRequest): Promise<TranslationResponse> => {
  try {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 200));
    
    let result = '';
    
    if (request.mode === "toEnglish") {
      result = translateToEnglish(request.text);
    } else {
      result = translateToArm(request.text);
    }
    
    return {
      result,
      success: true
    };
  } catch (error) {
    console.error("Translation error:", error);
    return {
      result: '',
      success: false,
      error: 'An error occurred during translation.'
    };
  }
};
