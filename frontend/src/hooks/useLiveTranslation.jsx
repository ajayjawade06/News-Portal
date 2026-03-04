import { useState, useEffect } from 'react';
import { useNews } from '../context/NewsContext';
import { translate } from '../utils/liveTranslator';

// Hook that returns a live translated version of the given text.
// sourceLang defaults to 'en'.
export function useLiveTranslation(text, sourceLang = 'en') {
  const { selectedLanguage } = useNews();
  const [translated, setTranslated] = useState(text);

  useEffect(() => {
    let cancelled = false;
    async function doTranslate() {
      if (!text) {
        setTranslated('');
        return;
      }
      const target = selectedLanguage || 'en';
      if (sourceLang === target) {
        setTranslated(text);
        return;
      }
      try {
        const result = await translate(text, sourceLang, target);
        if (!cancelled) {
          setTranslated(result || text);
        }
      } catch (err) {
        if (!cancelled) setTranslated(text);
      }
    }
    doTranslate();
    return () => { cancelled = true; };
  }, [text, sourceLang, selectedLanguage]);

  return translated;
}
