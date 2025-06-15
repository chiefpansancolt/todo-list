import { de } from './de'
import { en } from './en'
import { es } from './es'
import { fr } from './fr'
import { ja } from './ja'
import { pt } from './pt'

export const locales = {
  en,
  es,
  fr,
  de,
  pt,
  ja,
}

export type Locale = keyof typeof locales
export type LocaleData = typeof locales.en
