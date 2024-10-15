import translateEN from '../renderer/src/i18n/languages/en/translation.json'
import translateTW from '../renderer/src/i18n/languages/tw/translation.json'

const resources = {
  en: {
    translation: translateEN
  },
  tw: {
    translation: translateTW
  }
} as const

export default resources
