// Language Selection Modal shown immediately post-login or when requested
import React from 'react'
import { Globe, Check, ArrowRight } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import { useAuth } from '../../context/AuthContext'
import type { LanguageCode } from '../../types'

interface LanguageSelectorModalProps {
  isOpen: boolean
  onClose: () => void
}

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { language, setLanguage, t } = useLanguage()
  const { updateLanguage } = useAuth()

  if (!isOpen) return null

  const handleSelect = (code: LanguageCode) => {
    setLanguage(code)
    updateLanguage(code)
  }

  const languages: {
    code: LanguageCode
    name: string
    nativeName: string
    region: string
    sample: string
  }[] = [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      region: 'Universal / Standard',
      sample: 'AI-Powered Farming Solution',
    },
    {
      code: 'ta',
      name: 'Tamil',
      nativeName: 'தமிழ்',
      region: 'தமிழ்நாடு (Tamil Nadu)',
      sample: 'செயற்கை நுண்ணறிவு வேளாண்மை தீர்வு',
    },
    {
      code: 'hi',
      name: 'Hindi',
      nativeName: 'हिन्दी',
      region: 'उत्तर एवं मध्य भारत (North & Central India)',
      sample: 'एआई-संचालित कृषि समाधान',
    },
    {
      code: 'ml',
      name: 'Malayalam',
      nativeName: 'മലയാളം',
      region: 'കേരളം (Kerala)',
      sample: 'നിർമ്മിത ബുദ്ധി കാർഷിക പരിഹാരം',
    },
    {
      code: 'kn',
      name: 'Kannada',
      nativeName: 'ಕನ್ನಡ',
      region: 'ಕರ್ನಾಟಕ (Karnataka)',
      sample: 'ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ಆಧಾರಿತ ಕೃಷಿ ಪರಿಹಾರ',
    },
    {
      code: 'te',
      name: 'Telugu',
      nativeName: 'తెలుగు',
      region: 'ఆంధ్రప్రదేశ్ & తెలంగాణ (AP & Telangana)',
      sample: 'ఆర్టిఫిషియల్ ఇంటెలిజెన్స్ వ్యవసాయ పరిష్కారం',
    },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-gray-100 max-h-[90vh] flex flex-col">
        <div className="flex items-center space-x-3 mb-3 shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
            <Globe className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-gray-900">
              {t('chooseLanguageTitle')}
            </h3>
            <p className="text-xs text-gray-500">
              {t('chooseLanguageSubtitle')}
            </p>
          </div>
        </div>

        {/* Language Cards */}
        <div className="space-y-3 my-4 overflow-y-auto max-h-[50vh] pr-1">
          {languages.map((item) => {
            const isSelected = language === item.code
            return (
              <div
                key={item.code}
                onClick={() => handleSelect(item.code)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/80 shadow-md shadow-emerald-600/10'
                    : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
                }`}
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-base font-bold text-gray-900">
                      {item.nativeName}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      ({item.name})
                    </span>
                  </div>
                  <p className="text-xs text-emerald-800 font-medium mt-0.5">
                    {item.region}
                  </p>
                  <p className="text-[11px] text-gray-500 italic mt-1">
                    "{item.sample}"
                  </p>
                </div>

                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full border ${
                    isSelected
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {isSelected && <Check className="h-4 w-4 stroke-[3]" />}
                </div>
              </div>
            )
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 bg-emerald-600 text-white font-bold text-sm rounded-xl hover:bg-emerald-700 active:scale-[0.98] transition flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/20 cursor-pointer"
        >
          <span>{t('continueBtn')}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
