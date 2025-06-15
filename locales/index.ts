import { en } from './en'
import { es } from './es'
import { fr } from './fr'

export const locales = {
  en,
  es,
  fr,
}

export type Locale = keyof typeof locales
export type LocaleData = typeof locales.en
