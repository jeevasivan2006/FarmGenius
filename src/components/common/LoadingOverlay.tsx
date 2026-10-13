// Farmer-friendly Loading Overlay with animated step indicators
import React from 'react'
import { Sprout, CloudSun, Compass, Sparkles, CheckCircle2 } from 'lucide-react'

interface LoadingOverlayProps {
  message: string
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl border border-emerald-100">
        <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 border-4 border-emerald-200">
          <div className="absolute inset-0 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin" />
          <Sprout className="h-10 w-10 text-emerald-600 animate-bounce" />
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">
          FarmGenius AI Intelligence
        </h3>

        <p className="text-base font-semibold text-emerald-800 min-h-[3rem] flex items-center justify-center px-4">
          {message || 'Analyzing farm conditions...'}
        </p>

        {/* Micro-stages indicator */}
        <div className="mt-6 space-y-2 text-left bg-gray-50 p-4 rounded-2xl border border-gray-100">
          <div className="flex items-center space-x-3 text-xs text-gray-600">
            <Compass className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Verifying geolocation & soil zone telemetry</span>
          </div>
          <div className="flex items-center space-x-3 text-xs text-gray-600">
            <CloudSun className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Checking local meteorological moisture indices</span>
          </div>
          <div className="flex items-center space-x-3 text-xs text-gray-600">
            <Sparkles className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Simulating crop suitability & market profit curves</span>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center space-x-2 text-xs text-gray-400">
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          <span>Agricultural science backed recommendations</span>
        </div>
      </div>
    </div>
  )
}
