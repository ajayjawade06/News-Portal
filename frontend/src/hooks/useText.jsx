import { useLiveTranslation } from './useLiveTranslation';

// returns a translated version of the given string; the string itself acts as key
export function useText(str, sourceLang = 'en') {
  return useLiveTranslation(str, sourceLang);
}

export default useText;
