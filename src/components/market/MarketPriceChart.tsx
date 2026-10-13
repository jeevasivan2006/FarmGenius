// 3-Year Commodity Market Price Analysis Chart using Recharts
import React from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  Info,
  Calendar,
} from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import type { MarketAnalysis } from '../../types'

interface MarketPriceChartProps {
  analysis: MarketAnalysis | null
}

export const MarketPriceChart: React.FC<MarketPriceChartProps> = ({ analysis }) => {
  const { t } = useLanguage()

  if (!analysis) {
    return (
      <div className="rounded-3xl bg-white p-8 shadow-sm border border-emerald-100 text-center">
        <p className="text-sm text-gray-500">
          Select a recommended crop above to inspect its 3-year mandi price trend.
        </p>
      </div>
    )
  }

  const isDemo = analysis.dataSourceType.includes('Demo')

  // Tooltip component for Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload
      return (
        <div className="bg-gray-900 text-white p-3 rounded-xl shadow-xl text-xs border border-gray-800">
          <p className="text-gray-400 font-medium mb-1">
            {item.displayDate} {item.isForecast ? '(Projected)' : ''}
          </p>
          <p className="text-base font-extrabold text-emerald-400">
            ₹{item.priceINR?.toLocaleString('en-IN')}{' '}
            <span className="text-[10px] text-gray-300 font-normal">/ quintal</span>
          </p>
          {item.isForecast && (
            <span className="inline-block mt-1 text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold">
              AI Forecast
            </span>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm border border-emerald-100 space-y-6">
      {/* Header and Source Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-2 border border-emerald-200">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
            <span>Commodity Intelligence</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-emerald-950">
            {t('marketPriceTitle')}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {analysis.cropName} – 36-month wholesale modal mandi prices + forward trend
          </p>
        </div>

        {/* Real vs Demo Source Badge */}
        <div className="self-start sm:self-auto">
          {isDemo ? (
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-300 text-xs font-bold">
              <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
              <span>{t('demoDataBadge')}</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold shadow-2xs">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>{t('verifiedDataBadge')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="w-full h-72 sm:h-80 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={analysis.historicalPrices}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="displayDate"
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
              interval={4}
            />
            <YAxis
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
              domain={['auto', 'auto']}
              tickFormatter={(v) => `₹${v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            {/* Average benchmark reference line */}
            <ReferenceLine
              y={analysis.averagePriceINR}
              stroke="#10b981"
              strokeDasharray="4 4"
              label={{
                value: `Avg: ₹${analysis.averagePriceINR}`,
                fill: '#059669',
                fontSize: 10,
                position: 'right',
              }}
            />
            <Line
              type="monotone"
              dataKey="priceINR"
              stroke="#059669"
              strokeWidth={3}
              dot={{ r: 2, fill: '#059669' }}
              activeDot={{ r: 6, fill: '#047857' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Market Note */}
      <p className="text-xs text-gray-500 italic bg-gray-50 p-3 rounded-xl border border-gray-100">
        ℹ️ {analysis.marketNote}
      </p>

      {/* Market Price Insights Grid (Average, Min, Max, Latest, YoY) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
        {/* Latest Price */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
            {t('latestPrice')}
          </span>
          <p className="text-xl font-black text-emerald-950 mt-1">
            ₹{analysis.latestPriceINR.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-gray-500 font-semibold">{t('perQuintal')}</span>
        </div>

        {/* Average Price */}
        <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
            {t('avgPrice')}
          </span>
          <p className="text-xl font-black text-gray-900 mt-1">
            ₹{analysis.averagePriceINR.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-gray-500 font-semibold">{t('perQuintal')}</span>
        </div>

        {/* Minimum Price */}
        <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
            {t('minPrice')}
          </span>
          <p className="text-xl font-black text-gray-900 mt-1">
            ₹{analysis.minPriceINR.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-gray-500 font-semibold">{t('perQuintal')}</span>
        </div>

        {/* Maximum Price */}
        <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
            {t('maxPrice')}
          </span>
          <p className="text-xl font-black text-gray-900 mt-1">
            ₹{analysis.maxPriceINR.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-gray-500 font-semibold">{t('perQuintal')}</span>
        </div>

        {/* YoY Change & Trend */}
        <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
            {t('trendLabel')} & YoY
          </span>
          <div className="flex items-center space-x-1.5 mt-1">
            <span
              className={`text-lg font-black ${
                analysis.yoyChangePercent >= 0 ? 'text-emerald-700' : 'text-red-700'
              }`}
            >
              {analysis.yoyChangePercent >= 0 ? '+' : ''}
              {analysis.yoyChangePercent}%
            </span>
            {analysis.trend === 'Increasing' ? (
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            ) : analysis.trend === 'Decreasing' ? (
              <TrendingDown className="h-4 w-4 text-red-600" />
            ) : (
              <Minus className="h-4 w-4 text-amber-600" />
            )}
          </div>
          <span className="text-[10px] font-bold text-gray-600 uppercase">
            {analysis.trend}
          </span>
        </div>
      </div>

      {/* Market Disclaimer */}
      <div className="flex items-start space-x-2 text-xs text-gray-500 pt-2 border-t border-gray-100">
        <Info className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
        <p className="italic">{t('marketDisclaimer')}</p>
      </div>
    </div>
  )
}
