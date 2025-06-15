import { de } from './de'
import { en } from './en'
import { es } from './es'
import { fr } from './fr'
import { it } from './it'
import { ja } from './ja'
import { ko } from './ko'
import { nl } from './nl'
import { pt } from './pt'
import { zhCN } from './zh-CN'

export const locales = {
  en,
  es,
  fr,
  de,
  pt,
  ja,
  'zh-CN': zhCN,
  ko,
  it,
  nl,
}

export type Locale = keyof typeof locales
export type LocaleData = typeof locales.en
