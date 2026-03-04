import axios from 'axios';

// simple helper to use the backend live-translation endpoint
export async function translate(text, sourceLang, targetLang) {
  try {
    const response = await axios.post('/api/translate', { text, sourceLang, targetLang });
    if (response.data && response.data.success) {
      return response.data.translated;
    }
  } catch (err) {
    console.error('Live translation error:', err);
  }
  return text;
}
