import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import { locales } from '@/locales'

const getStoredLanguage = () => {
  try {
    return localStorage.getItem('language') || 'en'
  } catch {
    return 'en'
  }
}

const resources = Object.entries(locales).reduce((acc, [lang, data]) => {
  acc[lang] = {
    common: data.common,
    menu: data.menu,
  }
  return acc
}, {} as any)

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
    ns: ['common', 'menu'],
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
