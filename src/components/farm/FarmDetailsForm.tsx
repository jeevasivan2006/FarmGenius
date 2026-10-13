// Multi-Section Farmer Input Form
import React, { useState } from 'react'
import {
  Sprout,
  Droplets,
  Maximize2,
  Calendar,
  IndianRupee,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Loader2,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import { useFarmData } from '../../context/FarmDataContext'
import type { FarmDetails, SoilType, IrrigationMethod, LandAreaUnit, SeasonType } from '../../types'

interface FarmDetailsFormProps {
  onSubmitted?: () => void
}

export const FarmDetailsForm: React.FC<FarmDetailsFormProps> = ({ onSubmitted }) => {
  const { t } = useLanguage()
  const { farmDetails, setFarmDetails, runAnalysis, isLoadingAI } = useFarmData()

  const [formData, setFormData] = useState<FarmDetails>(farmDetails)
  const [showBudgetBreakdown, setShowBudgetBreakdown] = useState(false)
  const [showOptionalFields, setShowOptionalFields] = useState(false)

  const soilOptions: { value: SoilType; labelKey: string }[] = [
    { value: 'Loamy Soil', labelKey: 'loamySoil' },
    { value: 'Clay Soil', labelKey: 'claySoil' },
    { value: 'Black Soil', labelKey: 'blackSoil' },
    { value: 'Red Soil', labelKey: 'redSoil' },
    { value: 'Alluvial Soil', labelKey: 'alluvialSoil' },
    { value: 'Sandy Soil', labelKey: 'sandySoil' },
    { value: 'Laterite Soil', labelKey: 'lateriteSoil' },
    { value: 'Other', labelKey: 'otherOption' },
  ]

  const irrigationOptions: { value: IrrigationMethod; labelKey: string }[] = [
    { value: 'Drip Irrigation', labelKey: 'drip' },
    { value: 'Sprinkler Irrigation', labelKey: 'sprinkler' },
    { value: 'Canal Irrigation', labelKey: 'canal' },
    { value: 'Borewell', labelKey: 'borewell' },
    { value: 'Well', labelKey: 'well' },
    { value: 'Rainfed', labelKey: 'rainfed' },
    { value: 'Flood Irrigation', labelKey: 'flood' },
    { value: 'Other', labelKey: 'otherOption' },
  ]

  const unitOptions: LandAreaUnit[] = ['Acres', 'Hectares', 'Cents']

  const seasonOptions: SeasonType[] = ['Kharif', 'Rabi', 'Zaid', 'Custom']

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFarmDetails(formData)
    await runAnalysis(formData)
    if (onSubmitted) {
      onSubmitted()
    }
  }

  return (
    <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm border border-emerald-100">
      {/* Form Header */}
      <div className="mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-2 border border-emerald-200">
          <Sprout className="h-3.5 w-3.5 text-emerald-600" />
          <span>Agricultural Parameters</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 tracking-tight">
          {t('farmFormTitle')}
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">
          {t('farmFormSubtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION A & B: Soil Type & Irrigation Method */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* A. SOIL TYPE */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-gray-700">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-100 text-emerald-800 text-[10px]">
                A
              </span>
              <span>{t('soilTypeLabel')} *</span>
            </label>
            <select
              value={formData.soilType}
              onChange={(e) => setFormData({ ...formData, soilType: e.target.value as SoilType })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-semibold text-gray-800 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition cursor-pointer"
            >
              {soilOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {t(opt.labelKey as any) || opt.value}
                </option>
              ))}
            </select>

            {formData.soilType === 'Other' && (
              <input
                type="text"
                placeholder={t('specifyOtherSoil')}
                value={formData.customSoilType || ''}
                onChange={(e) => setFormData({ ...formData, customSoilType: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-emerald-300 bg-white text-xs text-gray-800 focus:border-emerald-500 outline-hidden transition mt-2"
                required
              />
            )}
          </div>

          {/* B. IRRIGATION METHOD */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-gray-700">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-100 text-emerald-800 text-[10px]">
                B
              </span>
              <span>{t('irrigationLabel')} *</span>
            </label>
            <select
              value={formData.irrigationMethod}
              onChange={(e) =>
                setFormData({ ...formData, irrigationMethod: e.target.value as IrrigationMethod })
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-semibold text-gray-800 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition cursor-pointer"
            >
              {irrigationOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {t(opt.labelKey as any) || opt.value}
                </option>
              ))}
            </select>

            {formData.irrigationMethod === 'Other' && (
              <input
                type="text"
                placeholder={t('specifyOtherIrrigation')}
                value={formData.customIrrigation || ''}
                onChange={(e) => setFormData({ ...formData, customIrrigation: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-emerald-300 bg-white text-xs text-gray-800 focus:border-emerald-500 outline-hidden transition mt-2"
                required
              />
            )}
          </div>
        </div>

        {/* SECTION C & D: Area of Land & Season */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* C. AREA OF LAND */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-gray-700">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-100 text-emerald-800 text-[10px]">
                C
              </span>
              <span>{t('landAreaLabel')} *</span>
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                min="0.1"
                step="0.1"
                required
                value={formData.landArea}
                onChange={(e) =>
                  setFormData({ ...formData, landArea: parseFloat(e.target.value) || 1 })
                }
                className="w-2/3 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-semibold text-gray-800 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition"
              />
              <select
                value={formData.landAreaUnit}
                onChange={(e) =>
                  setFormData({ ...formData, landAreaUnit: e.target.value as LandAreaUnit })
                }
                className="w-1/3 px-3 py-3 rounded-xl border border-gray-200 bg-gray-50 text-xs sm:text-sm font-bold text-gray-800 focus:bg-white focus:border-emerald-500 outline-hidden transition cursor-pointer"
              >
                {unitOptions.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* D. SEASON */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-gray-700">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-100 text-emerald-800 text-[10px]">
                D
              </span>
              <span>{t('seasonLabel')} *</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {seasonOptions.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setFormData({ ...formData, season: s })}
                  className={`py-3 px-2 rounded-xl text-xs font-bold border transition text-center cursor-pointer ${
                    formData.season === s
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                      : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {formData.season === 'Custom' && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                <select
                  value={formData.startMonth || 'June'}
                  onChange={(e) => setFormData({ ...formData, startMonth: e.target.value })}
                  className="px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700 bg-white"
                >
                  {months.map((m) => (
                    <option key={m} value={m}>
                      From {m}
                    </option>
                  ))}
                </select>
                <select
                  value={formData.endMonth || 'October'}
                  onChange={(e) => setFormData({ ...formData, endMonth: e.target.value })}
                  className="px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700 bg-white"
                >
                  {months.map((m) => (
                    <option key={m} value={m}>
                      To {m}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* SECTION E: Budget (INR) */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-gray-700">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-100 text-emerald-800 text-[10px]">
                E
              </span>
              <span>{t('budgetLabel')} *</span>
            </label>
            <button
              type="button"
              onClick={() => setShowBudgetBreakdown(!showBudgetBreakdown)}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 transition flex items-center space-x-1"
            >
              <span>{t('budgetBreakdownToggle')}</span>
              {showBudgetBreakdown ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-emerald-700 font-bold">
              ₹
            </div>
            <input
              type="number"
              min="1000"
              step="500"
              required
              value={formData.budget}
              onChange={(e) =>
                setFormData({ ...formData, budget: parseInt(e.target.value, 10) || 10000 })
              }
              className="w-full pl-9 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-base font-bold text-gray-900 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition"
              placeholder="50000"
            />
          </div>

          {/* Optional Budget Division */}
          {showBudgetBreakdown && (
            <div className="mt-3 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 grid grid-cols-2 sm:grid-cols-5 gap-3 animate-in fade-in duration-150">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  {t('budgetSeeds')}
                </label>
                <input
                  type="number"
                  value={formData.budgetBreakdown?.seeds || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      budgetBreakdown: {
                        ...formData.budgetBreakdown,
                        seeds: parseInt(e.target.value, 10) || 0,
                      },
                    })
                  }
                  placeholder="8,000"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  {t('budgetFertilizers')}
                </label>
                <input
                  type="number"
                  value={formData.budgetBreakdown?.fertilizers || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      budgetBreakdown: {
                        ...formData.budgetBreakdown,
                        fertilizers: parseInt(e.target.value, 10) || 0,
                      },
                    })
                  }
                  placeholder="15,000"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  {t('budgetIrrigation')}
                </label>
                <input
                  type="number"
                  value={formData.budgetBreakdown?.irrigation || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      budgetBreakdown: {
                        ...formData.budgetBreakdown,
                        irrigation: parseInt(e.target.value, 10) || 0,
                      },
                    })
                  }
                  placeholder="7,000"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  {t('budgetLabour')}
                </label>
                <input
                  type="number"
                  value={formData.budgetBreakdown?.labour || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      budgetBreakdown: {
                        ...formData.budgetBreakdown,
                        labour: parseInt(e.target.value, 10) || 0,
                      },
                    })
                  }
                  placeholder="15,000"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  {t('budgetOther')}
                </label>
                <input
                  type="number"
                  value={formData.budgetBreakdown?.other || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      budgetBreakdown: {
                        ...formData.budgetBreakdown,
                        other: parseInt(e.target.value, 10) || 0,
                      },
                    })
                  }
                  placeholder="5,000"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-xs font-semibold"
                />
              </div>
            </div>
          )}
        </div>

        {/* SECTION F: Optional Details Accordion */}
        <div className="pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={() => setShowOptionalFields(!showOptionalFields)}
            className="w-full py-2 flex items-center justify-between text-xs font-bold text-gray-700 hover:text-emerald-700 transition"
          >
            <div className="flex items-center space-x-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-gray-100 text-gray-700 text-[10px]">
                F
              </span>
              <span>{t('optionalDetailsTitle')}</span>
            </div>
            {showOptionalFields ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {showOptionalFields && (
            <div className="mt-3 p-4 rounded-2xl bg-gray-50 border border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {t('previousCropLabel')}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Paddy, Cotton"
                  value={formData.previousCrop || ''}
                  onChange={(e) => setFormData({ ...formData, previousCrop: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {t('previousYieldLabel')}
                </label>
                <input
                  type="text"
                  placeholder="e.g. 24 Q/acre"
                  value={formData.previousYield || ''}
                  onChange={(e) => setFormData({ ...formData, previousYield: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {t('experienceLabel')}
                </label>
                <select
                  value={formData.experienceLevel || 'Intermediate'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      experienceLevel: e.target.value as 'Beginner' | 'Intermediate' | 'Experienced',
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-medium cursor-pointer"
                >
                  <option value="Beginner">{t('beginnerExp')}</option>
                  <option value="Intermediate">{t('intermediateExp')}</option>
                  <option value="Experienced">{t('experiencedExp')}</option>
                </select>
              </div>

              <div className="sm:col-span-3 flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="organicPref"
                  checked={formData.organicPreference || false}
                  onChange={(e) =>
                    setFormData({ ...formData, organicPreference: e.target.checked })
                  }
                  className="h-4 w-4 rounded-sm border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="organicPref" className="text-xs font-medium text-gray-700 cursor-pointer">
                  {t('organicPreferenceLabel')}
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoadingAI}
            className="w-full py-4 bg-emerald-600 text-white font-black text-sm sm:text-base rounded-2xl hover:bg-emerald-700 active:scale-[0.99] transition shadow-xl shadow-emerald-600/25 flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
          >
            {isLoadingAI ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Analyzing Farm & AI Recommendations...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 text-emerald-200" />
                <span>{t('submitFarmDetailsBtn')}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
