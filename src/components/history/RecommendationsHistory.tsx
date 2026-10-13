// Recommendation History View Component
import React from 'react'
import {
  History,
  Calendar,
  MapPin,
  Sparkles,
  ChevronRight,
  Sprout,
  ArrowRight,
} from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import { useFarmData } from '../../context/FarmDataContext'
import type { RecommendationHistoryItem } from '../../types'

interface RecommendationsHistoryProps {
  onSelectHistoryItem: (item: RecommendationHistoryItem) => void
  onNewAnalysis: () => void
}

export const RecommendationsHistory: React.FC<RecommendationsHistoryProps> = ({
  onSelectHistoryItem,
  onNewAnalysis,
}) => {
  const { t, getCropName } = useLanguage()
  const { history } = useFarmData()

  if (!history || history.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-12 text-center shadow-sm border border-emerald-100 max-w-2xl mx-auto my-12">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mx-auto mb-4">
          <History className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {t('navRecommendations')}
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 mb-6 max-w-md mx-auto">
          {t('noHistoryYet')}
        </p>
        <button
          onClick={onNewAnalysis}
          className="px-6 py-3 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition"
        >
          {t('submitFarmDetailsBtn')}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <History className="h-6 w-6 text-emerald-600" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-950">
              {t('navRecommendations')}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Archived AI crop recommendations and farm conditions saved to your profile.
          </p>
        </div>

        <button
          onClick={onNewAnalysis}
          className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition flex items-center space-x-1.5"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>New Recommendation</span>
        </button>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {history.map((item) => {
          const dateStr = new Date(item.timestamp).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })

          const primaryCrop = item.recommendations[0]

          return (
            <div
              key={item.id}
              onClick={() => onSelectHistoryItem(item)}
              className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100 hover:border-emerald-300 hover:shadow-md transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex items-center space-x-1 text-xs font-semibold text-gray-500">
                    <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                    <span>{dateStr}</span>
                  </span>

                  <span className="text-gray-300">•</span>

                  <span className="flex items-center space-x-1 text-xs text-gray-600">
                    <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="font-semibold">{item.farmDetails.locationName || item.weatherData.locationName}</span>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold">
                    {item.farmDetails.soilType}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 font-semibold">
                    {item.farmDetails.irrigationMethod}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 font-semibold">
                    {item.farmDetails.landArea} {item.farmDetails.landAreaUnit}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 font-semibold">
                    ₹{item.farmDetails.budget.toLocaleString('en-IN')} Budget
                  </span>
                </div>

                {/* Recommended Crops list */}
                <div className="flex items-center space-x-3 pt-2">
                  <span className="text-xs font-bold text-gray-400">Top Crops:</span>
                  <div className="flex items-center space-x-2">
                    {item.recommendations.map((c, i) => (
                      <span
                        key={c.id || i}
                        className="text-xs font-bold text-emerald-950 flex items-center space-x-1 bg-emerald-50/80 px-2 py-0.5 rounded-md border border-emerald-100"
                      >
                        <span>{getCropName(c)}</span>
                        <span className="text-[10px] text-emerald-700">({c.matchPercentage}%)</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* View Button */}
              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 self-end md:self-center">
                <span>View Farming Plan</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
