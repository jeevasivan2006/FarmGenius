// Cropsy Responsive Navigation Bar
import React, { useState } from 'react'
import {
  Sprout,
  Globe,
  LogOut,
  Menu,
  X,
  TrendingUp,
  BookOpen,
  User,
  History,
  LayoutDashboard,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import type { LanguageCode } from '../../types'

interface NavbarProps {
  currentTab: 'dashboard' | 'history' | 'market' | 'guide' | 'profile'
  onTabChange: (tab: 'dashboard' | 'history' | 'market' | 'guide' | 'profile') => void
  onOpenLanguageModal: () => void
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  onOpenLanguageModal,
}) => {
  const { user, logout, updateLanguage } = useAuth()
  const { language, setLanguage, t } = useLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [langDropdownOpen, setLangDropdownOpen] = useState(false)

  const handleLanguageSelect = (lang: LanguageCode) => {
    setLanguage(lang)
    updateLanguage(lang)
    setLangDropdownOpen(false)
  }

  const navItems = [
    { id: 'dashboard' as const, label: t('navDashboard'), icon: LayoutDashboard },
    { id: 'history' as const, label: t('navRecommendations'), icon: History },
    { id: 'market' as const, label: t('navMarketPrices'), icon: TrendingUp },
    { id: 'guide' as const, label: t('navFarmingGuide'), icon: BookOpen },
    { id: 'profile' as const, label: t('navProfile'), icon: User },
  ]

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => onTabChange('dashboard')}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20 group-hover:bg-emerald-700 transition">
              <Sprout className="h-7 w-7 transition-transform group-hover:scale-110" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black tracking-tight text-emerald-950 font-['Plus_Jakarta_Sans']">
                  FarmGenius
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  AI SOLUTION
                </span>
              </div>
              <p className="hidden md:block text-xs font-medium text-emerald-700">
                {t('appTagline')}
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = currentTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs'
                      : 'text-gray-600 hover:text-emerald-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-600' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>

          {/* Language Selector & User Profile */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Language Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-gray-200 bg-gray-50 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-emerald-50 hover:border-emerald-200 transition"
                title="Change Language"
              >
                <Globe className="h-4 w-4 text-emerald-600" />
                <span className="uppercase font-bold text-emerald-800">{language}</span>
                <span className="hidden md:inline text-gray-500">
                  {language === 'en'
                    ? 'English'
                    : language === 'ta'
                    ? 'தமிழ்'
                    : language === 'hi'
                    ? 'हिन्दी'
                    : language === 'ml'
                    ? 'മലയാളം'
                    : language === 'kn'
                    ? 'ಕನ್ನಡ'
                    : 'తెలుగు'}
                </span>
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white shadow-xl border border-gray-100 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-h-72 overflow-y-auto">
                  {[
                    { code: 'en' as const, label: 'English' },
                    { code: 'ta' as const, label: 'தமிழ் (Tamil)' },
                    { code: 'hi' as const, label: 'हिन्दी (Hindi)' },
                    { code: 'ml' as const, label: 'മലയാളം (Malayalam)' },
                    { code: 'kn' as const, label: 'ಕನ್ನಡ (Kannada)' },
                    { code: 'te' as const, label: 'తెలుగు (Telugu)' },
                  ].map((l) => (
                    <button
                      key={l.code}
                      onClick={() => handleLanguageSelect(l.code)}
                      className={`w-full text-left px-4 py-2 text-xs sm:text-sm flex items-center justify-between font-medium ${
                        language === l.code
                          ? 'bg-emerald-50 text-emerald-800 font-bold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>{l.label}</span>
                      {language === l.code && <span className="text-emerald-600">✓</span>}
                    </button>
                  ))}
                  <div className="border-t border-gray-100 my-1" />
                  <button
                    onClick={() => {
                      setLangDropdownOpen(false)
                      onOpenLanguageModal()
                    }}
                    className="w-full text-left px-4 py-1.5 text-xs text-emerald-700 font-semibold hover:bg-emerald-50"
                  >
                    {t('chooseLanguageTitle')}...
                  </button>
                </div>
              )}
            </div>

            {/* User Greeting & Logout */}
            <div className="hidden sm:flex items-center space-x-3 pl-2 border-l border-gray-200">
              <div
                className="text-right cursor-pointer"
                onClick={() => onTabChange('profile')}
              >
                <p className="text-xs font-medium text-gray-500">{t('welcomeUser')}</p>
                <p className="text-xs font-bold text-emerald-950 truncate max-w-[120px]">
                  {user?.displayName || user?.email?.split('@')[0] || t('farmer')}
                </p>
              </div>

              <button
                onClick={() => logout()}
                className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                title={t('logout')}
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6 text-gray-700" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-emerald-100 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-2 bg-emerald-50 rounded-xl mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-emerald-700 font-medium">{t('welcomeUser')}</p>
              <p className="text-sm font-bold text-emerald-950">
                {user?.displayName || user?.email || t('farmer')}
              </p>
            </div>
            {user?.isGuest && (
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                Demo
              </span>
            )}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id)
                  setMobileMenuOpen(false)
                }}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-emerald-700'}`} />
                <span>{item.label}</span>
              </button>
            )
          })}

          <div className="border-t border-gray-100 pt-3 mt-3">
            <button
              onClick={() => {
                logout()
                setMobileMenuOpen(false)
              }}
              className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition"
            >
              <LogOut className="h-5 w-5" />
              <span>{t('logout')}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
