import { en } from './en'
import { es } from './es'

export const locales = {
  en,
  es,
}

export type Locale = keyof typeof locales
export type LocaleData = typeof locales.en
