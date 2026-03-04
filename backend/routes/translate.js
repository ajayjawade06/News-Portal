import express from 'express';
import translator from '../utils/translator.js';

const router = express.Router();

/**
 * POST /api/translate
 * Body: { text, sourceLang, targetLang }
 * Returns translated text using translation utility.
 */
router.post('/', async (req, res) => {
  try {
    const { text, sourceLang, targetLang } = req.body;
    if (!text || !sourceLang || !targetLang) {
      return res.status(400).json({ success: false, message: 'Missing parameters' });
    }
    const translated = await translator.translateText(text, sourceLang, targetLang);
    res.json({ success: true, translated });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ success: false, message: 'Translation failed', error: error.message });
  }
});

export default router;