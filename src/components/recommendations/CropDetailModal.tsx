// Detailed Crop Agronomic & Cultivation Modal
import React from 'react'
import {
  X,
  Sparkles,
  Droplets,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Bug,
  ShieldAlert,
  Sprout,
  Sun,
  Layers,
} from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import type { CropRecommendation } from '../../types'

interface CropDetailModalProps {
  crop: CropRecommendation | null
  isOpen: boolean
  onClose: () => void
}

export const CropDetailModal: React.FC<CropDetailModalProps> = ({
  crop,
  isOpen,
  onClose,
}) => {
  const { t, getCropName } = useLanguage()

  if (!isOpen || !crop) return null

  const localizedName = getCropName(crop)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-4xl max-h-[90vh] rounded-3xl bg-white shadow-2xl border border-gray-100 flex flex-col overflow-hidden my-auto">
        {/* Modal Header with Hero Image */}
        <div className="relative h-48 sm:h-64 w-full bg-emerald-900 shrink-0">
          <img
            src={crop.imageUrl}
            alt={crop.crop}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/60 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Title on Image */}
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/80 backdrop-blur-md text-white text-xs font-bold mb-2">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{crop.matchPercentage}% AI Suitability Match</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {localizedName}
              </h2>
              {crop.scientificName && (
                <p className="text-xs italic text-emerald-200">
                  {crop.scientificName}
                </p>
              )}
            </div>

            <div className="hidden sm:block text-right text-emerald-100 text-xs font-semibold">
              <p>Expected Yield:</p>
              <p className="text-sm font-extrabold text-white">{crop.expectedHarvestYield}</p>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Key Agronomic Attributes Grid */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-3 flex items-center space-x-1.5">
              <Layers className="h-4 w-4 text-emerald-600" />
              <span>Agronomic Criteria</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                <span className="text-gray-500 block mb-0.5">{t('soilTypeLabel')}</span>
                <span className="font-bold text-gray-900">{crop.suitableSoil}</span>
              </div>

              <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                <span className="text-gray-500 block mb-0.5">{t('tempRange')}</span>
                <span className="font-bold text-gray-900">{crop.temperatureRange}</span>
              </div>

              <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                <span className="text-gray-500 block mb-0.5">{t('cultivationDuration')}</span>
                <span className="font-bold text-gray-900">
                  {crop.cultivationDays.minimum}–{crop.cultivationDays.maximum} {t('days')}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                <span className="text-gray-500 block mb-0.5">{t('waterRequirement')}</span>
                <span className="font-bold text-gray-900">{crop.waterRequirement}</span>
              </div>

              <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                <span className="text-gray-500 block mb-0.5">{t('sowingPeriod')}</span>
                <span className="font-bold text-gray-900">{crop.sowingPeriod}</span>
              </div>

              <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                <span className="text-gray-500 block mb-0.5">{t('harvestPeriod')}</span>
                <span className="font-bold text-gray-900">{crop.harvestPeriod}</span>
              </div>

              <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                <span className="text-gray-500 block mb-0.5">{t('seedReq')}</span>
                <span className="font-bold text-gray-900">{crop.seedRequirement}</span>
              </div>

              <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                <span className="text-gray-500 block mb-0.5">{t('rainfallLabel')} Req.</span>
                <span className="font-bold text-gray-900">{crop.rainfallRequirement}</span>
              </div>
            </div>
          </div>

          {/* Basic Cultivation Steps */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-3 flex items-center space-x-1.5">
              <Sprout className="h-4 w-4 text-emerald-600" />
              <span>{t('cultivationStepsTitle')}</span>
            </h4>

            <div className="space-y-2">
              {crop.basicCultivationSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start space-x-3 p-3 rounded-2xl bg-emerald-50/40 border border-emerald-100/60 text-xs text-gray-700"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Plant Protection: Diseases & Pests */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Common Diseases */}
            <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100">
              <h5 className="text-xs font-bold text-rose-900 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <ShieldAlert className="h-4 w-4 text-rose-600" />
                <span>{t('diseasesTitle')}</span>
              </h5>
              <ul className="space-y-1.5 text-xs text-gray-700">
                {crop.commonDiseases.map((d, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pests Management */}
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100">
              <h5 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <Bug className="h-4 w-4 text-amber-600" />
                <span>{t('pestsTitle')}</span>
              </h5>
              <ul className="space-y-1.5 text-xs text-gray-700">
                {crop.pestManagement.map((p, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Important Precautions */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
            <h5 className="text-xs font-bold text-emerald-950 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <AlertTriangle className="h-4 w-4 text-emerald-700" />
              <span>{t('precautionsTitle')}</span>
            </h5>
            <ul className="space-y-1 text-xs text-emerald-900">
              {crop.precautions.map((prec, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{prec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition"
          >
            {t('closeBtn')}
          </button>
        </div>
      </div>
    </div>
  )
}
