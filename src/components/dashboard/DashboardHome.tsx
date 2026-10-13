// Main Dashboard Assembly Component
import React, { useState, useEffect } from 'react'
import {
  Sprout,
  Edit3,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp,
  MapPin,
  Compass,
  ArrowRight,
} from 'lucide-react'
import confetti from 'canvas-confetti'
import { useLanguage } from '../../context/LanguageContext'
import { useFarmData } from '../../context/FarmDataContext'
import { WeatherCard } from './WeatherCard'
import { FarmDetailsForm } from '../farm/FarmDetailsForm'
import { TopCropsList } from '../recommendations/TopCropsList'
import { CropDetailModal } from '../recommendations/CropDetailModal'
import { FertilizerSection } from '../recommendations/FertilizerSection'
import { CultivationTimeline } from '../recommendations/CultivationTimeline'
import { MarketPriceChart } from '../market/MarketPriceChart'
import { FarmingPlanSummary } from '../recommendations/FarmingPlanSummary'
import type { CropRecommendation } from '../../types'

interface DashboardHomeProps {
  onOpenLocationModal: () => void
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({ onOpenLocationModal }) => {
  const { t, getCropName } = useLanguage()
  const {
    farmDetails,
    weatherData,
    recommendations,
    selectedCrop,
    setSelectedCrop,
    marketAnalysis,
    runAnalysis,
    isLoadingAI,
  } = useFarmData()

  const [isEditingForm, setIsEditingForm] = useState(false)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [modalCrop, setModalCrop] = useState<CropRecommendation | null>(null)

  // Fire celebratory confetti when recommendations first arrive
  useEffect(() => {
    if (recommendations.length > 0) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#10b981', '#059669', '#34d399', '#f59e0b'],
        })
      } catch {}
    }
  }, [recommendations.length])

  const handleOpenCropDetails = (crop: CropRecommendation) => {
    setModalCrop(crop)
    setDetailModalOpen(true)
  }

  return (
    <div className="space-y-10 pb-16">
      {/* 1. WEATHER & CLIMATE CARD */}
      <section>
        <WeatherCard
          weather={weatherData}
          onRefreshLocation={onOpenLocationModal}
        />
      </section>

      {/* 2. YOUR FARM DETAILS (Summary with Edit Details toggle) */}
      <section className="rounded-3xl bg-white p-6 sm:p-7 shadow-sm border border-emerald-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <Sprout className="h-5 w-5 text-emerald-600" />
            <h3 className="text-lg font-black text-emerald-950 uppercase tracking-wide">
              Your Farm Details
            </h3>
          </div>

          <button
            onClick={() => setIsEditingForm(!isEditingForm)}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition self-start sm:self-auto cursor-pointer"
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>{isEditingForm ? 'Hide Form' : t('editDetailsBtn')}</span>
            {isEditingForm ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* Compact summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-gray-50/70 border border-gray-100">
            <span className="text-gray-500 block mb-0.5">{t('soilTypeLabel')}</span>
            <span className="font-bold text-gray-900">{farmDetails.soilType}</span>
          </div>

          <div className="p-3 rounded-2xl bg-gray-50/70 border border-gray-100">
            <span className="text-gray-500 block mb-0.5">{t('irrigationLabel')}</span>
            <span className="font-bold text-gray-900 truncate block">
              {farmDetails.irrigationMethod}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-gray-50/70 border border-gray-100">
            <span className="text-gray-500 block mb-0.5">{t('landAreaLabel')}</span>
            <span className="font-bold text-gray-900">
              {farmDetails.landArea} {farmDetails.landAreaUnit}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-gray-50/70 border border-gray-100">
            <span className="text-gray-500 block mb-0.5">{t('seasonLabel')}</span>
            <span className="font-bold text-gray-900">{farmDetails.season}</span>
          </div>

          <div className="p-3 rounded-2xl bg-gray-50/70 border border-gray-100">
            <span className="text-gray-500 block mb-0.5">{t('budgetLabel')}</span>
            <span className="font-bold text-gray-900">
              ₹{farmDetails.budget.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-gray-50/70 border border-gray-100">
            <span className="text-gray-500 block mb-0.5">Location</span>
            <span className="font-bold text-gray-900 truncate block">
              {farmDetails.locationName || weatherData?.locationName || 'Tamil Nadu'}
            </span>
          </div>
        </div>

        {/* Multi-Section Farm Input Form (Expandable) */}
        {isEditingForm && (
          <div className="pt-4 border-t border-gray-100 animate-in fade-in duration-200">
            <FarmDetailsForm onSubmitted={() => setIsEditingForm(false)} />
          </div>
        )}
      </section>

      {/* 3. AI CROP RECOMMENDATION: Top 3 Crops List */}
      {recommendations.length > 0 ? (
        <>
          <section id="top-crops">
            <TopCropsList
              recommendations={recommendations}
              selectedCropId={selectedCrop?.id}
              onSelectCrop={(crop) => setSelectedCrop(crop)}
              onOpenDetailsModal={handleOpenCropDetails}
            />
          </section>

          {/* 4. SELECTED CROP DETAILS BANNER */}
          {selectedCrop && (
            <section className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm border border-emerald-100 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                <div>
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Active Crop In Focus</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-emerald-950">
                    {getCropName(selectedCrop)}
                  </h3>
                  {selectedCrop.scientificName && (
                    <p className="text-xs italic text-gray-500 mt-0.5">
                      {selectedCrop.scientificName}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleOpenCropDetails(selectedCrop)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition flex items-center space-x-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <Layers className="h-4 w-4" />
                  <span>Full Agronomic Sheet</span>
                </button>
              </div>

              {/* Crop Hero Banner with Image & Specs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative h-56 md:h-auto rounded-2xl overflow-hidden border border-gray-200">
                  <img
                    src={selectedCrop.imageUrl}
                    alt={selectedCrop.crop}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-600 text-white font-black text-xs shadow-md">
                    {selectedCrop.matchPercentage}% AI Match
                  </div>
                </div>

                <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                    <span className="text-gray-500 block mb-0.5">{t('soilTypeLabel')}</span>
                    <span className="font-bold text-gray-900">{selectedCrop.suitableSoil}</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                    <span className="text-gray-500 block mb-0.5">{t('tempRange')}</span>
                    <span className="font-bold text-gray-900">{selectedCrop.temperatureRange}</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                    <span className="text-gray-500 block mb-0.5">{t('waterRequirement')}</span>
                    <span className="font-bold text-gray-900">{selectedCrop.waterRequirement}</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                    <span className="text-gray-500 block mb-0.5">{t('cultivationDuration')}</span>
                    <span className="font-bold text-gray-900">
                      {selectedCrop.cultivationDays.minimum}–{selectedCrop.cultivationDays.maximum} {t('days')}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                    <span className="text-gray-500 block mb-0.5">{t('expectedHarvest')}</span>
                    <span className="font-bold text-gray-900">{selectedCrop.expectedHarvestYield}</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                    <span className="text-gray-500 block mb-0.5">{t('seedReq')}</span>
                    <span className="font-bold text-gray-900">{selectedCrop.seedRequirement}</span>
                  </div>

                  <div className="col-span-2 sm:col-span-3 p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
                    <span className="text-gray-500 block mb-1 font-semibold">
                      Agronomic Justification:
                    </span>
                    <p className="text-gray-800 leading-relaxed font-medium">
                      {selectedCrop.reasons.join('. ')}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 5. FERTILIZER RECOMMENDATION */}
          <section>
            <FertilizerSection crop={selectedCrop} />
          </section>

          {/* 6. CULTIVATION TIMELINE */}
          <section>
            <CultivationTimeline crop={selectedCrop} />
          </section>

          {/* 7. 3-YEAR MARKET PRICE CHART */}
          <section id="market-chart">
            <MarketPriceChart analysis={marketAnalysis} />
          </section>

          {/* 8. YOUR CROPSY FARMING PLAN (Final Summary) */}
          <section id="farming-plan">
            <FarmingPlanSummary
              recommendations={recommendations}
              onSelectCrop={(crop) => {
                setSelectedCrop(crop)
                window.scrollTo({ top: 400, behavior: 'smooth' })
              }}
              onReanalyze={() => runAnalysis()}
            />
          </section>
        </>
      ) : (
        /* Empty / Initial State prompting farmer to run analysis */
        <section className="rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-emerald-50/40 p-8 sm:p-12 text-center border-2 border-dashed border-emerald-200">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-white mx-auto mb-4 shadow-md shadow-emerald-600/20">
            <Sparkles className="h-8 w-8" />
          </div>
          <h3 className="text-2xl font-black text-emerald-950 mb-2">
            Ready to Generate Your Farm's Recommendation
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto mb-6">
            We've loaded your regional climate parameters. Click below to start the Gemini AI agronomic engine and evaluate suitable crops, fertilizers, and market outlook.
          </p>
          <button
            onClick={() => runAnalysis()}
            disabled={isLoadingAI}
            className="px-8 py-4 bg-emerald-600 text-white font-black text-sm rounded-2xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/30 flex items-center space-x-2 mx-auto cursor-pointer"
          >
            <Sparkles className="h-5 w-5 text-emerald-200" />
            <span>{t('submitFarmDetailsBtn')}</span>
          </button>
        </section>
      )}

      {/* Modal for In-depth Agronomic Guidelines */}
      <CropDetailModal
        crop={modalCrop}
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
      />
    </div>
  )
}
