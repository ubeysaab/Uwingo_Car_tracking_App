import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './languages/en.json';
import tr from './languages/tr.json';
import kr from './languages/kr.json'

const LANGUAGES = {
  en: { translation: en },
  tr: { translation: tr },
  kr: { translation: kr }
} as const;

const LANG_CODES = Object.keys(LANGUAGES);

const languageDetector = {
  type: 'languageDetector' as const,
  async: true,
  detect: async (callback: (lang: string) => void) => {
    // 1. Try to get saved language from storage
    const savedLanguage = await AsyncStorage.getItem('user-language');
    if (savedLanguage) {
      return callback(savedLanguage);
    }

    // 2. If no saved language, detect system language
    const best = RNLocalize.findBestLanguageTag(LANG_CODES);
    callback(best?.languageTag || 'en');
  },
  init: () => { },
  cacheUserLanguage: async (language: string) => {
    await AsyncStorage.setItem('user-language', language);
  },
};

i18n
  .use(languageDetector) // Custom detector
  .use(initReactI18next)
  .init({
    debug: true,
    resources: LANGUAGES,
    fallbackLng: 'en',
    compatibilityJSON: 'v4', // 'v4' often causes issues with RN pluralization
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false, // Prevents crashes if translations aren't loaded yet
    },
  });

export default i18n;