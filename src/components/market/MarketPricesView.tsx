// Dedicated Market Prices Explorer Tab
import React, { useState, useEffect } from 'react'
import { TrendingUp, Search, Calendar, ShieldCheck, AlertCircle } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import { MarketPriceChart } from './MarketPriceChart'
import { getCropMarketAnalysis } from '../../services/market'
import type { MarketAnalysis } from '../../types'

export const MarketPricesView: React.FC = () => {
  const { t } = useLanguage()
  const [selectedCropName, setSelectedCropName] = useState('Rice')
  const [analysis, setAnalysis] = useState<MarketAnalysis | null>(null)
  const [loading, setLoading] = useState(false)

  const commodities = [
    'Rice',
    'Wheat',
    'Cotton',
    'Maize',
    'Groundnut',
    'Tomato',
    'Onion',
    'Sugarcane',
    'Soybean',
    'Chickpea',
  ]

  useEffect(() => {
    setLoading(true)
    getCropMarketAnalysis(selectedCropName).then((res) => {
      setAnalysis(res)
      setLoading(false)
    })
  }, [selectedCropName])

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-6">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-6 w-6 text-emerald-600" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-950">
            {t('navMarketPrices')}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Explore 36-month historical mandi modal prices and econometric trends indexed from Agmarknet benchmarks.
        </p>
      </div>

      {/* Commodity Selector Chips */}
      <div className="flex flex-wrap gap-2">
        {commodities.map((crop) => (
          <button
            key={crop}
            onClick={() => setSelectedCropName(crop)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              selectedCropName === crop
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50'
            }`}
          >
            {crop}
          </button>
        ))}
      </div>

      {/* Market Chart */}
      <MarketPriceChart analysis={analysis} />
    </div>
  )
}
