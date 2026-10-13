// Cultivation Duration Timeline Component
import React from 'react'
import { Clock, Calendar, ArrowRight, CheckCircle2, Sprout } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import type { CropRecommendation } from '../../types'

interface CultivationTimelineProps {
  crop: CropRecommendation | null
}

export const CultivationTimeline: React.FC<CultivationTimelineProps> = ({ crop }) => {
  const { t, getCropName } = useLanguage()

  if (!crop) return null

  const localizedName = getCropName(crop)

  return (
    <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm border border-emerald-100 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-2 border border-emerald-200">
            <Clock className="h-3.5 w-3.5 text-emerald-600" />
            <span>Growth Cycle Phases</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-emerald-950">
            {t('timelineTitle')}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {t('timelineSubtitle')} for {localizedName}.
          </p>
        </div>

        {/* Total Duration Badge */}
        <div className="p-3 sm:p-4 rounded-2xl bg-emerald-600 text-white text-right self-start sm:self-auto shadow-md shadow-emerald-600/20">
          <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-100">
            {t('cultivationDuration')}
          </p>
          <p className="text-xl sm:text-2xl font-black">
            {crop.cultivationDays.minimum}–{crop.cultivationDays.maximum} {t('days')}
          </p>
        </div>
      </div>

      {/* Visual Timeline (Horizontal on desktop, Vertical on mobile) */}
      <div className="relative pt-6">
        {/* Connecting line */}
        <div className="hidden md:block absolute top-12 left-8 right-8 h-1 bg-emerald-200 z-0" />

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
          {crop.timeline.map((stage, index) => {
            return (
              <div
                key={index}
                className="flex flex-col items-start md:items-center text-left md:text-center p-4 rounded-2xl bg-emerald-50/40 border border-emerald-100/70 hover:bg-emerald-50 transition"
              >
                {/* Stage Step Number Circle */}
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white font-black text-base shadow-sm mb-3">
                  {index + 1}
                </div>

                <div className="w-full">
                  <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-extrabold text-[10px] mb-1">
                    Day {stage.startDay} - {stage.endDay}
                  </span>
                  <h4 className="font-extrabold text-sm text-emerald-950 mb-1">
                    {stage.stage}
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {stage.keyActivity}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Seasonal Sowing & Harvest Windows */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center space-x-3">
          <Calendar className="h-5 w-5 text-emerald-600 shrink-0" />
          <div className="text-xs">
            <span className="text-gray-500 font-semibold">{t('sowingPeriod')}:</span>
            <p className="font-extrabold text-gray-900 mt-0.5">{crop.sowingPeriod}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center space-x-3">
          <Sprout className="h-5 w-5 text-emerald-600 shrink-0" />
          <div className="text-xs">
            <span className="text-gray-500 font-semibold">{t('harvestPeriod')}:</span>
            <p className="font-extrabold text-gray-900 mt-0.5">{crop.harvestPeriod}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
