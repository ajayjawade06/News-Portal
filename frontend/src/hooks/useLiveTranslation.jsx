import { useState, useEffect } from 'react';
import { useNews } from '../context/NewsContext';

export function useLiveTranslation(text, sourceLang = 'en') {
  const { selectedLanguage } = useNews();
  const [translated, setTranslated] = useState(text);

  useEffect(() => {
    setTranslated(text);
  }, [text, sourceLang, selectedLanguage]);

  return translated;
}
