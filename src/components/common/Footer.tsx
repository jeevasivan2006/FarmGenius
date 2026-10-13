// Cropsy AgTech Footer Component
import React from 'react'
import { Sprout, ShieldCheck, HeartHandshake, FileText } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export const Footer: React.FC = () => {
  const { t } = useLanguage()

  return (
    <footer className="mt-20 border-t border-emerald-100 bg-white/80 py-12 text-sm text-gray-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white">
                <Sprout className="h-5 w-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-emerald-950">FarmGenius</span>
            </div>
            <p className="text-xs text-gray-500 max-w-md leading-relaxed">
              FarmGenius is an AI-powered farming solution platform designed to equip farmers with scientific crop recommendations, real-time meteorological analysis, customized fertilizer regimens, and mandi commodity price projections.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950 mb-3">
              Platform Modules
            </h4>
            <ul className="space-y-2 text-xs text-gray-500">
              <li>• Soil & Climate Suitability Analysis</li>
              <li>• Live Meteorological Telemetry</li>
              <li>• Basal & Top-Dressing Fertilizer Charts</li>
              <li>• 3-Year Agmarknet Mandi Benchmarks</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950 mb-3">
              Agricultural Safety
            </h4>
            <ul className="space-y-2 text-xs text-gray-500">
              <li className="flex items-center space-x-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Soil Health Card Alignment</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <HeartHandshake className="h-3.5 w-3.5 text-emerald-600" />
                <span>Farmer-First AgTech Design</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <FileText className="h-3.5 w-3.5 text-emerald-600" />
                <span>Verified Commodity Trends</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Mandatory Agricultural Disclaimer */}
        <div className="rounded-2xl bg-amber-50/70 border border-amber-200/60 p-4 text-xs text-amber-900 leading-relaxed">
          <p className="font-semibold mb-1">
            🌾 {t('finalDisclaimer')}
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400">
          <p>© {new Date().getFullYear()} FarmGenius Technologies. Dedicated to Indian Farmers.</p>
          <p className="mt-2 sm:mt-0 font-medium text-emerald-800">
            FarmGenius – AI-Powered Farming Solution
          </p>
        </div>
      </div>
    </footer>
  )
}
