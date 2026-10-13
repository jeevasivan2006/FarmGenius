// AI Farming Plan Summary Component
import React from 'react'
import {
  FileCheck2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Printer,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import type { CropRecommendation } from '../../types'

interface FarmingPlanSummaryProps {
  recommendations: CropRecommendation[]
  onSelectCrop: (crop: CropRecommendation) => void
  onReanalyze: () => void
}

export const FarmingPlanSummary: React.FC<FarmingPlanSummaryProps> = ({
  recommendations,
  onSelectCrop,
  onReanalyze,
}) => {
  const { t, getCropName } = useLanguage()

  if (!recommendations || recommendations.length < 3) return null

  const primary = recommendations[0]
  const alt1 = recommendations[1]
  const alt2 = recommendations[2]

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-950 to-teal-950 text-white p-6 sm:p-10 shadow-xl border border-emerald-800 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-emerald-800/60">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-2 border border-emerald-400/30">
            <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
            <span>Integrated Crop Advisory</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white">
            {t('farmingPlanTitle')}
          </h3>
          <p className="text-xs sm:text-sm text-emerald-200/80 mt-1">
            {t('farmingPlanSubtitle')}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>{t('printReport')}</span>
          </button>
          <button
            onClick={onReanalyze}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            <span>{t('recalculate')}</span>
          </button>
        </div>
      </div>

      {/* Primary Crop Executive Showcase */}
      <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-6 sm:p-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-400 text-emerald-950 text-xs font-black uppercase tracking-wider">
            {t('primaryRecommendation')}
          </span>
          <span className="text-emerald-300 font-extrabold text-sm">
            {primary.matchPercentage}% AI Suitability Score
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div>
            <h4 className="text-3xl sm:text-4xl font-black text-white">
              {getCropName(primary)}
            </h4>
            <p className="text-xs text-emerald-200 mt-1 italic">
              {primary.scientificName || primary.crop}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs text-emerald-300">Estimated Investment</p>
            <p className="text-2xl font-black text-white">
              ₹{primary.estimatedInvestmentINR.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Highlight Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10 text-xs">
          <div className="p-3 rounded-xl bg-black/20">
            <span className="text-emerald-300 block text-[11px]">{t('cultivationDuration')}</span>
            <span className="font-extrabold text-white text-sm">
              {primary.cultivationDays.minimum}–{primary.cultivationDays.maximum} {t('days')}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-black/20">
            <span className="text-emerald-300 block text-[11px]">{t('waterRequirement')}</span>
            <span className="font-extrabold text-white text-sm">
              {primary.waterRequirement}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-black/20">
            <span className="text-emerald-300 block text-[11px]">{t('marketTrend')}</span>
            <span className="font-extrabold text-white text-sm">
              {primary.marketTrend}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-black/20">
            <span className="text-emerald-300 block text-[11px]">{t('expectedHarvest')}</span>
            <span className="font-extrabold text-white text-sm truncate">
              {primary.expectedHarvestYield}
            </span>
          </div>
        </div>

        {/* Recommended Fertilizer Brief */}
        <div className="p-3 rounded-xl bg-black/20 text-xs">
          <span className="text-emerald-300 font-semibold block mb-1">
            Basal Fertilizer Recommendation:
          </span>
          <p className="text-emerald-100 font-medium">
            {primary.fertilizers.basalApplication.name} ({primary.fertilizers.basalApplication.quantityPerAcre})
          </p>
        </div>
      </div>

      {/* Alternative Crops Selection */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-3">
          Diversification Options & Alternative Crops
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Alternative 1 */}
          <div
            onClick={() => onSelectCrop(alt1)}
            className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition cursor-pointer flex items-center justify-between group"
          >
            <div>
              <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">
                {t('firstAlternative')}
              </span>
              <h5 className="text-lg font-bold text-white group-hover:text-emerald-300 transition">
                {getCropName(alt1)}
              </h5>
              <p className="text-xs text-emerald-200 mt-0.5">
                {alt1.matchPercentage}% Match • {alt1.cultivationDays.minimum} {t('days')}
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
          </div>

          {/* Alternative 2 */}
          <div
            onClick={() => onSelectCrop(alt2)}
            className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition cursor-pointer flex items-center justify-between group"
          >
            <div>
              <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">
                {t('secondAlternative')}
              </span>
              <h5 className="text-lg font-bold text-white group-hover:text-emerald-300 transition">
                {getCropName(alt2)}
              </h5>
              <p className="text-xs text-emerald-200 mt-0.5">
                {alt2.matchPercentage}% Match • {alt2.cultivationDays.minimum} {t('days')}
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Official AI Agricultural Disclaimer */}
      <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-xs text-emerald-200/90 leading-relaxed flex items-start space-x-3">
        <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
        <p>
          <strong className="text-white">Notice to Farmers:</strong> {t('finalDisclaimer')}
        </p>
      </div>
    </div>
  )
}
