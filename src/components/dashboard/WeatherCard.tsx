// Weather & Farm Climate Card Component
import React from 'react'
import {
  CloudSun,
  Thermometer,
  Droplets,
  CloudRain,
  Wind,
  MapPin,
  RefreshCw,
  Sparkles,
  Info,
} from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import type { WeatherData } from '../../types'

interface WeatherCardProps {
  weather: WeatherData | null
  onRefreshLocation: () => void
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  weather,
  onRefreshLocation,
}) => {
  const { t } = useLanguage()

  if (!weather) {
    return (
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-emerald-100 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CloudSun className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Weather Status</p>
            <p className="text-sm font-bold text-gray-900">Setting up farm climate telemetry...</p>
          </div>
        </div>
        <button
          onClick={onRefreshLocation}
          className="px-3 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-800 rounded-xl hover:bg-emerald-100 transition"
        >
          Detect Location
        </button>
      </div>
    )
  }

  // Get suitability badge color
  const getSuitabilityColor = (suitability: WeatherData['suitability']) => {
    switch (suitability) {
      case 'Excellent':
        return {
          bg: 'bg-emerald-500/10 text-emerald-800 border-emerald-300',
          dot: 'bg-emerald-500',
          label: t('suitabilityExcellent'),
        }
      case 'Good':
        return {
          bg: 'bg-teal-500/10 text-teal-800 border-teal-300',
          dot: 'bg-teal-500',
          label: t('suitabilityGood'),
        }
      case 'Moderate':
        return {
          bg: 'bg-amber-500/10 text-amber-900 border-amber-300',
          dot: 'bg-amber-500',
          label: t('suitabilityModerate'),
        }
      case 'Poor':
      default:
        return {
          bg: 'bg-red-500/10 text-red-900 border-red-300',
          dot: 'bg-red-500',
          label: t('suitabilityPoor'),
        }
    }
  }

  const suitabilityInfo = getSuitabilityColor(weather.suitability)

  return (
    <div className="rounded-3xl bg-white p-6 sm:p-7 shadow-sm border border-emerald-100 relative overflow-hidden transition-all hover:shadow-md">
      {/* Background soft ambient gradient */}
      <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-emerald-50/50 blur-2xl pointer-events-none" />

      {/* Header with location and data source badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-gray-100">
        <div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
            <h3 className="text-base sm:text-lg font-black text-emerald-950 truncate max-w-xs sm:max-w-md">
              {weather.locationName}
            </h3>
          </div>
          {/* Source indicator */}
          <div className="mt-1 flex items-center space-x-2">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                weather.source === 'Current Location'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-blue-50 text-blue-800 border border-blue-200'
              }`}
            >
              {weather.source === 'Current Location'
                ? t('currentLocationBadge')
                : t('manualLocationBadge')}
            </span>
            <span className="text-[11px] text-gray-400">
              via {weather.rawDataSource}
            </span>
          </div>
        </div>

        <button
          onClick={onRefreshLocation}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-800 transition cursor-pointer"
          title="Change or refresh location"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Update Location</span>
        </button>
      </div>

      {/* Main Meteorological Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 py-5">
        {/* Temperature */}
        <div className="flex items-center space-x-3 p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100/80">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
            <Thermometer className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              {t('tempLabel')}
            </p>
            <p className="text-xl sm:text-2xl font-black text-gray-900">
              {weather.temperature}°C
            </p>
          </div>
        </div>

        {/* Humidity */}
        <div className="flex items-center space-x-3 p-3 rounded-2xl bg-cyan-50/50 border border-cyan-100/80">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-600 text-white shadow-xs">
            <Droplets className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              {t('humidityLabel')}
            </p>
            <p className="text-xl sm:text-2xl font-black text-gray-900">
              {weather.humidity}%
            </p>
          </div>
        </div>

        {/* Rainfall */}
        <div className="flex items-center space-x-3 p-3 rounded-2xl bg-blue-50/50 border border-blue-100/80">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
            <CloudRain className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              {t('rainfallLabel')}
            </p>
            <p className="text-xl sm:text-2xl font-black text-gray-900">
              {weather.rainfall} <span className="text-xs font-bold text-gray-500">mm</span>
            </p>
          </div>
        </div>

        {/* Wind Speed */}
        <div className="flex items-center space-x-3 p-3 rounded-2xl bg-teal-50/50 border border-teal-100/80">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-600 text-white shadow-xs">
            <Wind className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              {t('windSpeedLabel')}
            </p>
            <p className="text-xl sm:text-2xl font-black text-gray-900">
              {weather.windSpeed} <span className="text-xs font-bold text-gray-500">km/h</span>
            </p>
          </div>
        </div>

        {/* Condition & Rain Probability */}
        <div className="col-span-2 sm:col-span-1 flex items-center space-x-3 p-3 rounded-2xl bg-amber-50/50 border border-amber-100/80">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs">
            <CloudSun className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              {t('conditionLabel')}
            </p>
            <p className="text-sm font-bold text-gray-900 truncate">
              {weather.condition}
            </p>
            <p className="text-[10px] text-amber-800 font-semibold">
              {weather.rainProbability}% {t('rainProbabilityLabel')}
            </p>
          </div>
        </div>
      </div>

      {/* Farming Suitability Indicator Section */}
      <div className="mt-2 pt-4 border-t border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-gray-700">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            <span>{t('suitabilityTitle')}:</span>
          </div>

          <div
            className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border text-xs font-extrabold ${suitabilityInfo.bg}`}
          >
            <span className={`h-2 w-2 rounded-full ${suitabilityInfo.dot} animate-pulse`} />
            <span>{suitabilityInfo.label}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <Info className="h-4 w-4 text-emerald-600 shrink-0" />
          <span className="italic">{weather.suitabilityReason}</span>
        </div>
      </div>
    </div>
  )
}
