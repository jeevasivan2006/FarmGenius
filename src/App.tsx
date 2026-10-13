// Main Application Component for CROPSY – AI Powered Crop Recommendation Agent
import React, { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { LanguageProvider } from './context/LanguageContext'
import { FarmDataProvider, useFarmData } from './context/FarmDataContext'
import { LoginPage } from './components/auth/LoginPage'
import { Navbar } from './components/common/Navbar'
import { Footer } from './components/common/Footer'
import { LoadingOverlay } from './components/common/LoadingOverlay'
import { LanguageSelectorModal } from './components/onboarding/LanguageSelectorModal'
import { LocationPermissionModal } from './components/onboarding/LocationPermissionModal'
import { DashboardHome } from './components/dashboard/DashboardHome'
import { RecommendationsHistory } from './components/history/RecommendationsHistory'
import { MarketPricesView } from './components/market/MarketPricesView'
import { FarmingGuideView } from './components/guide/FarmingGuideView'
import { UserProfileView } from './components/profile/UserProfileView'
import type { RecommendationHistoryItem } from './types'

type ActiveTab = 'dashboard' | 'history' | 'market' | 'guide' | 'profile'

const AppContent: React.FC = () => {
  const { user, loading: authLoading } = useAuth()
  const {
    weatherData,
    isLoadingAI,
    loadingStage,
    setFarmDetails,
    setWeatherData,
    setSelectedCrop,
  } = useFarmData()

  const [currentTab, setCurrentTab] = useState<ActiveTab>('dashboard')
  const [languageModalOpen, setLanguageModalOpen] = useState(false)
  const [locationModalOpen, setLocationModalOpen] = useState(false)
  const [hasPromptedOnboarding, setHasPromptedOnboarding] = useState(false)

  // Onboarding sequence immediately post-login:
  // 1. Language Selection -> 2. Location Permission
  useEffect(() => {
    if (user && !hasPromptedOnboarding) {
      const languageSeen = localStorage.getItem('cropsy_language_modal_seen')
      if (!languageSeen) {
        setLanguageModalOpen(true)
      } else if (!weatherData) {
        setLocationModalOpen(true)
      }
      setHasPromptedOnboarding(true)
    }
  }, [user, hasPromptedOnboarding, weatherData])

  // Handle closing Language Modal and transitioning to Location Permission
  const handleCloseLanguageModal = () => {
    setLanguageModalOpen(false)
    localStorage.setItem('cropsy_language_modal_seen', 'true')
    if (!weatherData) {
      setLocationModalOpen(true)
    }
  }

  // Handle selecting history item and loading into dashboard
  const handleSelectHistoryItem = (item: RecommendationHistoryItem) => {
    setFarmDetails(item.farmDetails)
    setWeatherData(item.weatherData)
    if (item.recommendations.length > 0) {
      setSelectedCrop(item.recommendations[0])
    }
    setCurrentTab('dashboard')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8faf7]">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-14 w-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30 animate-pulse">
            <span className="text-2xl font-black">🌾</span>
          </div>
          <p className="text-sm font-bold text-emerald-950">Loading FarmGenius...</p>
        </div>
      </div>
    )
  }

  // If not logged in, show split-screen login page
  if (!user) {
    return <LoginPage />
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8faf7] text-gray-900 selection:bg-emerald-500 selection:text-white">
      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
        onOpenLanguageModal={() => setLanguageModalOpen(true)}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {currentTab === 'dashboard' && (
          <DashboardHome onOpenLocationModal={() => setLocationModalOpen(true)} />
        )}

        {currentTab === 'history' && (
          <RecommendationsHistory
            onSelectHistoryItem={handleSelectHistoryItem}
            onNewAnalysis={() => setCurrentTab('dashboard')}
          />
        )}

        {currentTab === 'market' && <MarketPricesView />}

        {currentTab === 'guide' && <FarmingGuideView />}

        {currentTab === 'profile' && (
          <UserProfileView onEditFarm={() => setCurrentTab('dashboard')} />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Full-screen Loading Overlay during AI analysis */}
      {isLoadingAI && <LoadingOverlay message={loadingStage} />}

      {/* Language Selection Modal */}
      <LanguageSelectorModal
        isOpen={languageModalOpen}
        onClose={handleCloseLanguageModal}
      />

      {/* Location Permission & Fallback Modal */}
      <LocationPermissionModal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
      />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <FarmDataProvider>
          <AppContent />
        </FarmDataProvider>
      </LanguageProvider>
    </AuthProvider>
  )
}
