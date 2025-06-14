import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import enCommon from '../locales/en/common.json'
import esCommon from '../locales/es/common.json'

const resources = {
  en: { common: enCommon },
  es: { common: esCommon },
}

const getStoredLanguage = () => {
  try {
    return localStorage.getItem('language') || 'en'
  } catch {
    return 'en'
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: getStoredLanguage(),
    fallbackLng: 'en',
    debug: !window.electron,
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    defaultNS: 'common',
    ns: ['common'],
  })

i18n.on('initialized', () => {
  if (window.api) {
    window.api.send('language-initialized', i18n.language)
  }
})

i18n.on('languageChanged', (lng) => {
  try {
    localStorage.setItem('language', lng)
  } catch (error) {
    console.error('Failed to save language preference:', error)
  }
})

export default i18n
