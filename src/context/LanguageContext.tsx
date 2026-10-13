// Language Context for Multilingual Support (English, Tamil, Hindi, Malayalam, Kannada, Telugu)
import React, { createContext, useContext, useState, useEffect } from 'react'
import { translations, type TranslationKey } from '../i18n/translations'
import type { LanguageCode, CropRecommendation } from '../types'

interface LanguageContextType {
  language: LanguageCode
  setLanguage: (lang: LanguageCode) => void
  t: (key: TranslationKey) => string
  getCropName: (crop: CropRecommendation | string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const STORAGE_LANG_KEY = 'farmgenius_language_pref'
const LEGACY_LANG_KEY = 'cropsy_language_pref'

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = (localStorage.getItem(STORAGE_LANG_KEY) || localStorage.getItem(LEGACY_LANG_KEY)) as LanguageCode | null
    if (saved && ['en', 'ta', 'hi', 'ml', 'kn', 'te'].includes(saved)) {
      return saved
    }
    return 'en'
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_LANG_KEY, language)
    document.documentElement.lang = language
  }, [language])

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang)
  }

  const t = (key: TranslationKey): string => {
    const currentDict = (translations as any)[language] || translations.en
    return (currentDict[key] as string) || (translations.en[key] as string) || (key as string)
  }

  const getCropName = (crop: CropRecommendation | string): string => {
    if (typeof crop === 'string') {
      return crop
    }
    if (language === 'ta' && crop.cropTa) {
      return crop.cropTa
    }
    if (language === 'hi' && crop.cropHi) {
      return crop.cropHi
    }
    if (language === 'ml' && crop.cropMl) {
      return crop.cropMl
    }
    if (language === 'kn' && crop.cropKn) {
      return crop.cropKn
    }
    if (language === 'te' && crop.cropTe) {
      return crop.cropTe
    }
    return crop.crop
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getCropName }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
