// Fertilizer & Nutrient Recommendation Section
import React from 'react'
import {
  FlaskConical,
  Sprout,
  AlertTriangle,
  Layers,
  Leaf,
  CheckCircle2,
  Atom,
} from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import type { CropRecommendation } from '../../types'

interface FertilizerSectionProps {
  crop: CropRecommendation | null
}

export const FertilizerSection: React.FC<FertilizerSectionProps> = ({ crop }) => {
  const { t, getCropName } = useLanguage()

  if (!crop) return null

  const fertilizers = crop.fertilizers
  const localizedName = getCropName(crop)

  return (
    <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm border border-emerald-100 space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-2 border border-emerald-200">
          <FlaskConical className="h-3.5 w-3.5 text-emerald-600" />
          <span>Crop Nutrition Management</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-emerald-950">
          {t('fertilizerTitle')}
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Nutritional dosage and application timing calibrated for {localizedName} ({crop.crop}).
        </p>
      </div>

      {/* Grid of Basal & Top Dressing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basal Application */}
        <div className="rounded-2xl bg-emerald-50/50 border border-emerald-100 p-5 space-y-3">
          <div className="flex items-center space-x-2 text-emerald-950 font-bold text-sm">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-600 text-white text-xs">
              1
            </span>
            <span>{t('basalApplicationTitle')}</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-2xs">
              <span className="text-gray-500 block mb-0.5">Fertilizer Formulation</span>
              <span className="font-extrabold text-gray-900 text-sm">
                {fertilizers.basalApplication.name}
              </span>
              {fertilizers.basalApplication.npkRatio && (
                <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  {t('npkRatioLabel')}: {fertilizers.basalApplication.npkRatio}
                </span>
              )}
            </div>

            <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-2xs">
              <span className="text-gray-500 block mb-0.5">{t('recommendedQty')}</span>
              <span className="font-bold text-gray-900">
                {fertilizers.basalApplication.quantityPerAcre}
              </span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-2xs">
              <span className="text-gray-500 block mb-0.5">{t('applicationStage')} & Method</span>
              <p className="font-medium text-gray-800">
                {fertilizers.basalApplication.applicationStage}
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Method: {fertilizers.basalApplication.applicationMethod}
              </p>
            </div>
          </div>
        </div>

        {/* Top Dressing */}
        <div className="rounded-2xl bg-teal-50/50 border border-teal-100 p-5 space-y-3">
          <div className="flex items-center space-x-2 text-teal-950 font-bold text-sm">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-teal-600 text-white text-xs">
              2
            </span>
            <span>{t('topDressingTitle')}</span>
          </div>

          <div className="space-y-2 text-xs">
            {fertilizers.topDressing.map((split, idx) => (
              <div
                key={idx}
                className="bg-white p-3 rounded-xl border border-gray-100 shadow-2xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-gray-900">{split.name}</span>
                  <span className="px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 font-bold text-[10px]">
                    Split #{idx + 1}
                  </span>
                </div>
                <p className="font-semibold text-gray-700">
                  Dosage: {split.quantityPerAcre}
                </p>
                <p className="text-gray-600">
                  Stage: {split.applicationStage}
                </p>
                <p className="text-[11px] text-gray-400">
                  Method: {split.applicationMethod}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Micronutrients & Bio / Organic Alternatives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Micronutrients */}
        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
            <Atom className="h-4 w-4 text-emerald-600" />
            <span>{t('micronutrientsTitle')}</span>
          </div>
          <ul className="space-y-1 text-xs text-gray-700">
            {fertilizers.micronutrients.map((micro, i) => (
              <li key={i} className="flex items-start space-x-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{micro}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Organic Alternatives */}
        <div className="p-4 rounded-2xl bg-emerald-50/30 border border-emerald-100">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-900 mb-2">
            <Leaf className="h-4 w-4 text-emerald-600" />
            <span>{t('organicAlternativesTitle')}</span>
          </div>
          <ul className="space-y-1 text-xs text-emerald-900">
            {fertilizers.organicAlternatives.map((org, i) => (
              <li key={i} className="flex items-start space-x-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{org}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mandatory Fertilizer Soil Testing Disclaimer */}
      <div className="flex items-start space-x-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <p className="font-bold">{t('fertilizerDisclaimer')}</p>
          <p className="text-[11px] text-amber-800 mt-0.5">
            Fertilizer efficacy is directly governed by soil pH, organic carbon content, and electrical conductivity. Follow your state agricultural university (KAU/TNAU/PAU) package of practices.
          </p>
        </div>
      </div>
    </div>
  )
}
