// Location Permission & Geolocation Fallback Modal
import React, { useState } from 'react'
import {
  MapPin,
  Compass,
  Edit3,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  Globe,
} from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import { useFarmData } from '../../context/FarmDataContext'

interface LocationPermissionModalProps {
  isOpen: boolean
  onClose: () => void
}

export const LocationPermissionModal: React.FC<LocationPermissionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useLanguage()
  const { fetchWeatherFromGPS, fetchWeatherFromManual } = useFarmData()

  const [mode, setMode] = useState<'prompt' | 'manual'>('prompt')
  const [loading, setLoading] = useState(false)
  const [denied, setDenied] = useState(false)
  const [village, setVillage] = useState('Thanjavur')
  const [district, setDistrict] = useState('Thanjavur')
  const [state, setState] = useState('Tamil Nadu')
  const [country, setCountry] = useState('India')

  if (!isOpen) return null

  const handleAllowGPS = async () => {
    setLoading(true)
    setDenied(false)
    const res = await fetchWeatherFromGPS()
    setLoading(false)
    if (res) {
      onClose()
    } else {
      setDenied(true)
      setMode('manual')
    }
  }

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetchWeatherFromManual(village, district, state, country)
    setLoading(false)
    if (res) {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-gray-100">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 mb-4 mx-auto sm:mx-0">
          <MapPin className="h-7 w-7 text-emerald-700" />
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-2 text-center sm:text-left">
          {t('locationModalTitle')}
        </h3>

        <p className="text-xs sm:text-sm text-gray-600 mb-6 leading-relaxed text-center sm:text-left">
          {t('locationModalDesc')}
        </p>

        {denied && (
          <div className="mb-6 flex items-start space-x-3 rounded-2xl bg-amber-50 p-4 text-xs font-medium text-amber-900 border border-amber-200">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">{t('locationDeniedNotice')}</p>
              <p className="text-[11px] text-amber-700 mt-0.5">
                No problem! Enter your farm's region manually and FarmGenius will fetch the exact weather and soil indices for your district.
              </p>
            </div>
          </div>
        )}

        {mode === 'prompt' && !denied ? (
          <div className="space-y-3">
            <button
              onClick={handleAllowGPS}
              disabled={loading}
              className="w-full py-4 bg-emerald-600 text-white font-bold text-sm rounded-xl hover:bg-emerald-700 active:scale-[0.98] transition flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/20 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Detecting Farm Coordinates...</span>
                </>
              ) : (
                <>
                  <Compass className="h-5 w-5" />
                  <span>{t('allowLocationBtn')}</span>
                </>
              )}
            </button>

            <button
              onClick={() => setMode('manual')}
              disabled={loading}
              className="w-full py-3.5 border-2 border-gray-200 text-gray-700 font-bold text-xs sm:text-sm rounded-xl hover:bg-gray-50 hover:border-gray-300 transition flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Edit3 className="h-4 w-4 text-gray-500" />
              <span>{t('enterManuallyBtn')}</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleManualSubmit} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {t('villageLabel')} *
                </label>
                <input
                  type="text"
                  required
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="e.g. Kumbakonam"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {t('districtLabel')} *
                </label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="e.g. Thanjavur"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {t('stateLabel')} *
                </label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Tamil Nadu"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {t('countryLabel')}
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition bg-gray-50"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setMode('prompt')}
                className="w-1/3 py-3 border border-gray-200 text-gray-600 font-bold text-xs rounded-xl hover:bg-gray-50 transition"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-2/3 py-3 bg-emerald-600 text-white font-bold text-xs sm:text-sm rounded-xl hover:bg-emerald-700 active:scale-[0.98] transition flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/20 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Fetching Weather...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{t('saveLocationBtn')}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
