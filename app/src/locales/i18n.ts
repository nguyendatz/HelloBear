import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import enResources from 'locales/en';
import jpResources from 'locales/jp';
import { initReactI18next } from 'react-i18next';
//Configuration language
const langObject = {
  code: 'en',
  ns: 'common',
  languages: {
    en: 'en',
    jp: 'jp'
  }
};
const langResources = {
  [langObject.languages.en]: enResources,
  [langObject.languages.jp]: jpResources
};

export const appLang = langObject;
export const appLangResources = langResources;

i18next
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init(
    {
      ns: appLang.ns,
      defaultNS: appLang.ns,
      interpolation: { escapeValue: false },
      react: { useSuspense: true },
      lng: appLang.code,
      fallbackLng: appLang.code,
      resources: appLangResources
    },
    (err) => {
      if (err) console.log('I18n ERROR:', err);
    }
  );

export default i18next;
