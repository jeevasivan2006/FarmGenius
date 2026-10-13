// User Profile & Farm Attributes View
import React from 'react'
import {
  User,
  Mail,
  Calendar,
  Globe,
  MapPin,
  Sprout,
  Edit3,
  LogOut,
  ShieldCheck,
  Check,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { useFarmData } from '../../context/FarmDataContext'
import type { LanguageCode } from '../../types'

interface UserProfileViewProps {
  onEditFarm: () => void
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({ onEditFarm }) => {
  const { user, logout, updateLanguage } = useAuth()
  const { language, setLanguage, t } = useLanguage()
  const { farmDetails, weatherData } = useFarmData()

  const handleLanguageChange = (lang: LanguageCode) => {
    setLanguage(lang)
    updateLanguage(lang)
  }

  const dateJoined = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Recent'

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      {/* Header Profile Card */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm border border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-white font-black text-2xl shadow-md shadow-emerald-600/20">
            {user?.displayName ? user.displayName[0].toUpperCase() : 'F'}
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-black text-gray-900">
                {user?.displayName || user?.email?.split('@')[0] || t('farmer')}
              </h2>
              {user?.isGuest && (
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                  Guest Demo
                </span>
              )}
            </div>

            <p className="text-xs text-gray-500 flex items-center space-x-1.5 mt-0.5">
              <Mail className="h-3.5 w-3.5 text-gray-400" />
              <span>{user?.email}</span>
            </p>

            <p className="text-xs text-gray-400 flex items-center space-x-1.5 mt-0.5">
              <Calendar className="h-3.5 w-3.5 text-gray-400" />
              <span>Registered: {dateJoined}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => logout()}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-600 font-bold text-xs hover:bg-red-50 transition self-start sm:self-center"
        >
          <LogOut className="h-4 w-4" />
          <span>{t('logout')}</span>
        </button>
      </div>

      {/* Language Preference Section */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm border border-emerald-100 space-y-4">
        <div className="flex items-center space-x-2 text-emerald-950">
          <Globe className="h-5 w-5 text-emerald-600" />
          <h3 className="text-lg font-black">{t('chooseLanguageTitle')}</h3>
        </div>

        <p className="text-xs text-gray-500">
          Select your primary working language for AI recommendations, weather alerts, and crop advisories.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {[
            { code: 'en' as const, name: 'English', sub: 'Universal / Standard' },
            { code: 'ta' as const, name: 'தமிழ் (Tamil)', sub: 'தமிழ்நாடு' },
            { code: 'hi' as const, name: 'हिन्दी (Hindi)', sub: 'उत्तर व मध्य भारत' },
            { code: 'ml' as const, name: 'മലയാളം (Malayalam)', sub: 'കേരളം' },
            { code: 'kn' as const, name: 'ಕನ್ನಡ (Kannada)', sub: 'ಕರ್ನಾಟಕ' },
            { code: 'te' as const, name: 'తెలుగు (Telugu)', sub: 'ఆంధ్రప్రదేశ్ & తెలంగాణ' },
          ].map((item) => {
            const isSelected = language === item.code
            return (
              <button
                key={item.code}
                onClick={() => handleLanguageChange(item.code)}
                className={`p-4 rounded-2xl border-2 text-left transition flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs'
                    : 'border-gray-200 hover:border-emerald-300 text-gray-700'
                }`}
              >
                <div>
                  <p className="font-bold text-sm">{item.name}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{item.sub}</p>
                </div>
                {isSelected && <Check className="h-4 w-4 text-emerald-600 stroke-[3]" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* Saved Farm Parameters Overview */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm border border-emerald-100 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-emerald-950">
            <Sprout className="h-5 w-5 text-emerald-600" />
            <h3 className="text-lg font-black">Farm Parameters Profile</h3>
          </div>

          <button
            onClick={onEditFarm}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-xs hover:bg-emerald-100 transition cursor-pointer"
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>{t('editDetailsBtn')}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-2">
          <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
            <span className="text-gray-500 block mb-0.5">{t('soilTypeLabel')}</span>
            <span className="font-bold text-gray-900">{farmDetails.soilType}</span>
          </div>

          <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
            <span className="text-gray-500 block mb-0.5">{t('irrigationLabel')}</span>
            <span className="font-bold text-gray-900">{farmDetails.irrigationMethod}</span>
          </div>

          <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
            <span className="text-gray-500 block mb-0.5">{t('landAreaLabel')}</span>
            <span className="font-bold text-gray-900">
              {farmDetails.landArea} {farmDetails.landAreaUnit}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
            <span className="text-gray-500 block mb-0.5">{t('seasonLabel')}</span>
            <span className="font-bold text-gray-900">{farmDetails.season}</span>
          </div>

          <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
            <span className="text-gray-500 block mb-0.5">{t('budgetLabel')}</span>
            <span className="font-bold text-gray-900">
              ₹{farmDetails.budget.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
            <span className="text-gray-500 block mb-0.5">Farm Region</span>
            <span className="font-bold text-gray-900 truncate block">
              {farmDetails.locationName || weatherData?.locationName || 'Tamil Nadu'}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
            <span className="text-gray-500 block mb-0.5">{t('experienceLabel')}</span>
            <span className="font-bold text-gray-900">
              {farmDetails.experienceLevel || 'Intermediate'}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
            <span className="text-gray-500 block mb-0.5">Organic Preference</span>
            <span className="font-bold text-gray-900">
              {farmDetails.organicPreference ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
