// Top 3 Recommended Crops Cards Component
import React from 'react'
import {
  Sparkles,
  CheckCircle2,
  Clock,
  IndianRupee,
  Droplets,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
  Info,
  Layers,
} from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import type { CropRecommendation } from '../../types'

interface TopCropsListProps {
  recommendations: CropRecommendation[]
  selectedCropId?: string
  onSelectCrop: (crop: CropRecommendation) => void
  onOpenDetailsModal: (crop: CropRecommendation) => void
}

export const TopCropsList: React.FC<TopCropsListProps> = ({
  recommendations,
  selectedCropId,
  onSelectCrop,
  onOpenDetailsModal,
}) => {
  const { t, getCropName } = useLanguage()

  if (!recommendations || recommendations.length === 0) {
    return null
  }

  // Ranks medals
  const rankBadges = [
    { rank: '1', label: '1st Recommendation', color: 'bg-amber-400 text-amber-950 border-amber-300' },
    { rank: '2', label: '2nd Recommendation', color: 'bg-slate-300 text-slate-800 border-slate-200' },
    { rank: '3', label: '3rd Recommendation', color: 'bg-amber-700/80 text-amber-50 border-amber-600' },
  ]

  const getTrendIcon = (trend: CropRecommendation['marketTrend']) => {
    switch (trend) {
      case 'Increasing':
        return <TrendingUp className="h-4 w-4 text-emerald-600 inline ml-1" />
      case 'Decreasing':
        return <TrendingDown className="h-4 w-4 text-red-600 inline ml-1" />
      default:
        return <Minus className="h-4 w-4 text-amber-600 inline ml-1" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Title & Subtitle */}
      <div>
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-emerald-600" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 tracking-tight">
            {t('topCropsTitle')}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          {t('topCropsSubtitle')}
        </p>
      </div>

      {/* Grid of Top 3 Crop Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {recommendations.map((rec, index) => {
          const isSelected = selectedCropId === rec.id
          const rankInfo = rankBadges[index] || rankBadges[0]
          const localizedName = getCropName(rec)

          return (
            <div
              key={rec.id}
              onClick={() => onSelectCrop(rec)}
              className={`rounded-3xl bg-white p-6 shadow-sm border-2 transition-all cursor-pointer relative flex flex-col justify-between hover:shadow-lg ${
                isSelected
                  ? 'border-emerald-600 ring-4 ring-emerald-500/10 shadow-md'
                  : 'border-gray-100 hover:border-emerald-300'
              }`}
            >
              {/* Header: Rank + Circular Match Indicator */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border shadow-xs ${rankInfo.color}`}
                  >
                    #{rankInfo.rank} Match
                  </span>

                  {/* Circular Score Dial */}
                  <div className="relative flex items-center justify-center">
                    <svg className="w-16 h-16 transform -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="26"
                        stroke="#e2e8f0"
                        strokeWidth="5"
                        fill="transparent"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="26"
                        stroke={rec.matchPercentage >= 90 ? '#10b981' : '#059669'}
                        strokeWidth="5"
                        strokeDasharray={163.36}
                        strokeDashoffset={163.36 - (163.36 * rec.matchPercentage) / 100}
                        strokeLinecap="round"
                        fill="transparent"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-sm font-black text-gray-900">
                        {rec.matchPercentage}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Crop Name & Scientific Name */}
                <div className="mb-4">
                  <h3 className="text-2xl font-black text-emerald-950 flex items-center space-x-2">
                    <span>{localizedName}</span>
                  </h3>
                  {rec.scientificName && (
                    <p className="text-xs italic text-gray-500 mt-0.5">
                      {rec.scientificName}
                    </p>
                  )}
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100/60 mb-4 text-xs">
                  <div>
                    <span className="text-gray-500 flex items-center space-x-1">
                      <Clock className="h-3.5 w-3.5 text-emerald-700" />
                      <span>{t('cultivationDuration')}</span>
                    </span>
                    <p className="font-extrabold text-gray-900 mt-0.5">
                      {rec.cultivationDays.minimum}–{rec.cultivationDays.maximum} {t('days')}
                    </p>
                  </div>

                  <div>
                    <span className="text-gray-500 flex items-center space-x-1">
                      <IndianRupee className="h-3.5 w-3.5 text-emerald-700" />
                      <span>{t('estimatedInvestment')}</span>
                    </span>
                    <p className="font-extrabold text-gray-900 mt-0.5">
                      ₹{rec.estimatedInvestmentINR.toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div>
                    <span className="text-gray-500 flex items-center space-x-1">
                      <Droplets className="h-3.5 w-3.5 text-blue-600" />
                      <span>{t('waterRequirement')}</span>
                    </span>
                    <p className="font-extrabold text-gray-900 mt-0.5">
                      {rec.waterRequirement}
                    </p>
                  </div>

                  <div>
                    <span className="text-gray-500 flex items-center space-x-1">
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-700" />
                      <span>{t('marketTrend')}</span>
                    </span>
                    <p className="font-extrabold text-gray-900 mt-0.5 flex items-center">
                      <span>{rec.marketTrend}</span>
                      {getTrendIcon(rec.marketTrend)}
                    </p>
                  </div>
                </div>

                {/* Why this crop? Checklist */}
                <div className="space-y-1.5 mb-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                    {t('whyThisCrop')}
                  </p>
                  {rec.reasons.slice(0, 4).map((r, i) => (
                    <div key={i} className="flex items-start space-x-2 text-xs text-gray-700">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{r}</span>
                    </div>
                  ))}
                </div>

                {/* Suitability Breakdown Progress Bars */}
                <div className="space-y-2 pt-3 border-t border-gray-100 mb-4">
                  <div className="flex items-center justify-between text-[11px] font-bold text-gray-600 uppercase">
                    <span>{t('breakdownTitle')}</span>
                    <span className="text-emerald-700">{t('scoreNote')}</span>
                  </div>

                  <div className="space-y-1.5 text-xs text-gray-600">
                    <div>
                      <div className="flex justify-between text-[11px] mb-0.5">
                        <span>{t('soilScore')}</span>
                        <span className="font-bold">{rec.suitabilityBreakdown.soilSuitability}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                          style={{ width: `${rec.suitabilityBreakdown.soilSuitability}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-0.5">
                        <span>{t('climateScore')}</span>
                        <span className="font-bold">{rec.suitabilityBreakdown.climateSuitability}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-teal-600 rounded-full transition-all duration-500"
                          style={{ width: `${rec.suitabilityBreakdown.climateSuitability}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-0.5">
                        <span>{t('budgetScore')}</span>
                        <span className="font-bold">{rec.suitabilityBreakdown.budgetSuitability}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full transition-all duration-500"
                          style={{ width: `${rec.suitabilityBreakdown.budgetSuitability}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onOpenDetailsModal(rec)
                  }}
                  className="w-full py-2.5 px-4 rounded-xl border border-emerald-600/30 bg-emerald-50 text-emerald-900 font-bold text-xs hover:bg-emerald-600 hover:text-white transition flex items-center justify-center space-x-1.5"
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>{t('viewDetailsBtn')}</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
