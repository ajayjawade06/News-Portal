/**
 * Auto-Translation Utility - Multi-Provider Support
 * 
 * This utility automatically translates news content from one language to others.
 * Supports multiple translation methods:
 * 1. @vitalets/google-translate-api (Free, no API key, reliable) - Default
 * 2. LibreTranslate API (free, public endpoint)
 * 3. MyMemory Translation API (free tier)
 * 
 * For MCA Viva: This demonstrates API integration and automatic content translation
 * to support multilingual content without manual input.
 */

import { translate } from '@vitalets/google-translate-api';

/**
 * Language code mapping
 * Supports: en (English), hi (Hindi), mr (Marathi)
 */
const LANGUAGE_CODES = {
  en: 'en',
  hi: 'hi',
  mr: 'mr'
};

/**
 * Translate using Google Translate (Free, no API key required)
 * Uses @vitalets/google-translate-api library
 * 
 * This is the most reliable option for Hindi and Marathi translations
 */
async function translateWithGoogleLib(text, sourceLang, targetLang) {
  try {
    const result = await translate(text, {
      from: LANGUAGE_CODES[sourceLang],
      to: LANGUAGE_CODES[targetLang]
    });
    return result.text;
  } catch (error) {
    throw new Error(`Google Translate error: ${error.message}`);
  }
}

/**
 * Translate using LibreTranslate API (Free, public endpoint)
 */
async function translateWithLibreTranslate(text, sourceLang, targetLang) {
  const LIBRETRANSLATE_API = 'https://libretranslate.com/translate';
  
  const response = await fetch(LIBRETRANSLATE_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      q: text,
      source: LANGUAGE_CODES[sourceLang],
      target: LANGUAGE_CODES[targetLang],
      format: 'text'
    })
  });

  if (!response.ok) {
    throw new Error(`LibreTranslate API error: ${response.status}`);
  }

  const data = await response.json();
  return data.translatedText || text;
}

/**
 * Translate using MyMemory Translation API (Free tier)
 */
async function translateWithMyMemory(text, sourceLang, targetLang) {
  const MYMEMORY_API = 'https://api.mymemory.translated.net/get';
  const langPair = `${LANGUAGE_CODES[sourceLang]}|${LANGUAGE_CODES[targetLang]}`;
  const url = `${MYMEMORY_API}?q=${encodeURIComponent(text)}&langpair=${langPair}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`MyMemory API error: ${response.status}`);
  }

  const data = await response.json();
  
  if (data.responseStatus !== 200) {
    throw new Error(`MyMemory API error: ${data.responseStatus}`);
  }

  return data.responseData.translatedText || text;
}

/**
 * Translate text from source language to target language
 * Automatically tries multiple providers if one fails
 * 
 * @param {string} text - Text to translate
 * @param {string} sourceLang - Source language code (en, hi, mr)
 * @param {string} targetLang - Target language code (en, hi, mr)
 * @returns {Promise<string>} - Translated text
 */
async function translateText(text, sourceLang, targetLang) {
  // If source and target are same, return original text
  if (sourceLang === targetLang) {
    return text;
  }

  // Skip translation if text is empty
  if (!text || text.trim().length === 0) {
    return '';
  }

  // List of providers to try (in order of preference)
  // Google Translate library is most reliable for Hindi/Marathi
  const providers = [
    { name: 'google-lib', fn: translateWithGoogleLib },
    { name: 'libretranslate', fn: translateWithLibreTranslate },
    { name: 'mymemory', fn: translateWithMyMemory }
  ];

  // Try each provider until one succeeds
  for (const provider of providers) {
    try {
      const translated = await provider.fn(text, sourceLang, targetLang);
      
      // Validate translation
      if (translated && translated.trim() && translated !== text) {
        return translated;
      } else if (translated === text && sourceLang !== targetLang) {
        // Translation returned same text - might be an error, try next
        continue;
      }
      return translated;
    } catch (error) {
      // Silently try next provider
      continue;
    }
  }

  // All providers failed - return original text
  console.error(`Translation failed for ${sourceLang} -> ${targetLang}. Using original text.`);
  return text;
}

/**
 * Translate news content to all supported languages
 * 
 * For MCA Viva: This function demonstrates:
 * - Async/await pattern for API calls
 * - Error handling with fallback mechanism
 * - Automatic multi-language content generation
 * 
 * @param {string} title - News title in base language
 * @param {string} content - News content in base language
 * @param {string} baseLanguage - Base language code (en, hi, mr)
 * @param {string} subHeading - Optional sub-heading in base language (auto-translated)
 * @returns {Promise<Object>} - Object with translated title, subHeading, and content for all languages
 */
export async function translateNewsContent(title, content, baseLanguage, subHeading = '') {
  const languages = ['en', 'hi', 'mr'];
  const translatedTitle = {};
  const translatedSubHeading = {};
  const translatedContent = {};

  // Set base language content directly (no translation needed)
  translatedTitle[baseLanguage] = title;
  translatedContent[baseLanguage] = content;
  translatedSubHeading[baseLanguage] = subHeading || '';

  // Translate to other languages
  const translationPromises = [];

  for (const lang of languages) {
    if (lang !== baseLanguage) {
      // Translate title
      translationPromises.push(
        translateText(title, baseLanguage, lang)
          .then(translated => {
            translatedTitle[lang] = translated;
          })
          .catch(() => {
            // Fallback to base language if translation fails
            translatedTitle[lang] = title;
          })
      );

      // Translate sub-heading if provided
      if (subHeading && subHeading.trim()) {
        translationPromises.push(
          translateText(subHeading, baseLanguage, lang)
            .then(translated => {
              translatedSubHeading[lang] = translated;
            })
            .catch(() => {
              // Fallback to base language if translation fails
              translatedSubHeading[lang] = subHeading;
            })
        );
      } else {
        translatedSubHeading[lang] = '';
      }

      // Translate content (split into chunks if too long to avoid API limits)
      const maxChunkLength = 4000; // Safe chunk size for translation APIs
      if (content.length > maxChunkLength) {
        // Split content into chunks and translate separately
        const chunks = [];
        let currentChunk = '';
        const sentences = content.split(/[.!?]\s+/);
        
        for (const sentence of sentences) {
          if ((currentChunk + sentence).length > maxChunkLength && currentChunk) {
            chunks.push(currentChunk.trim());
            currentChunk = sentence;
          } else {
            currentChunk += (currentChunk ? '. ' : '') + sentence;
          }
        }
        if (currentChunk) chunks.push(currentChunk.trim());

        // Translate each chunk
        const chunkPromises = chunks.map(chunk => 
          translateText(chunk, baseLanguage, lang)
        );
        
        translationPromises.push(
          Promise.all(chunkPromises)
            .then(translatedChunks => {
              translatedContent[lang] = translatedChunks.join('. ');
            })
            .catch(() => {
              translatedContent[lang] = content;
            })
        );
      } else {
        // Translate entire content at once
        translationPromises.push(
          translateText(content, baseLanguage, lang)
            .then(translated => {
              translatedContent[lang] = translated;
            })
            .catch(() => {
              // Fallback to base language if translation fails
              translatedContent[lang] = content;
            })
        );
      }
    }
  }

  // Wait for all translations to complete
  await Promise.all(translationPromises);

  return {
    title: translatedTitle,
    subHeading: translatedSubHeading,
    content: translatedContent
  };
}

export default {
  translateNewsContent,
  translateText
};
