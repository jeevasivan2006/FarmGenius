// Modern Split-Screen Authentication Page for Cropsy
import React, { useState } from 'react'
import {
  Sprout,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  CloudSun,
  UserCheck,
  Globe,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { ForgotPasswordModal } from './ForgotPasswordModal'
import type { LanguageCode } from '../../types'

export const LoginPage: React.FC = () => {
  const { login, register, loginGuest } = useAuth()
  const { language, setLanguage, t } = useLanguage()

  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [forgotModalOpen, setForgotModalOpen] = useState(false)

  const validate = (): boolean => {
    if (!email.trim() || !email.includes('@')) {
      setError(t('authErrorInvalidEmail'))
      return false
    }
    if (password.length < 6) {
      setError(t('authErrorWeakPassword'))
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validate()) return

    setLoading(true)
    try {
      if (isSignUp) {
        await register(email.trim(), password, displayName.trim())
      } else {
        await login(email.trim(), password)
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleGuestLogin = async () => {
    setError(null)
    setLoading(true)
    try {
      await loginGuest()
    } catch (err: any) {
      setError(err.message || 'Guest login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#f8faf7]">
      {/* Left Column: Full-Height Clean Agricultural Visual with Soft Dark/Green Overlay */}
      <div className="relative w-full lg:w-1/2 min-h-[380px] lg:min-h-screen flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden">
        {/* Background Image with Fallback Pattern & Soft Green Gradient Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=85')`,
          }}
        />
        {/* Soft Dark / Agricultural Green Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/95 via-emerald-900/80 to-emerald-900/60 backdrop-blur-[1px]" />

        {/* Decorative Grid Lines */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Top Header Badge */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md text-emerald-300 border border-white/20 shadow-lg">
              <Sprout className="h-7 w-7 text-emerald-300" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-white">FarmGenius</span>
              <p className="text-xs text-emerald-200 font-medium">AI-Powered Farming Solution</p>
            </div>
          </div>

          {/* Quick Language Toggle on Login */}
          <div className="flex items-center space-x-1 bg-white/10 backdrop-blur-md rounded-xl p-1 border border-white/20">
            {(['en', 'ta', 'hi', 'ml', 'kn', 'te'] as LanguageCode[]).map((l) => (
              <button
                key={l}
                onClick={() => setLanguage(l)}
                className={`px-2 py-1 text-xs font-bold rounded-lg transition ${
                  language === l
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'text-emerald-100 hover:text-white hover:bg-white/10'
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Hero Narrative Content */}
        <div className="relative z-10 my-auto py-12 max-w-lg">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-300/30 text-xs font-semibold mb-6 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-emerald-300 animate-spin" />
            <span>AI Powered Agronomic Intelligence</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
            Smart Crop Decisions for Every Indian Farmer.
          </h1>

          <p className="mt-4 text-emerald-100/90 text-sm sm:text-base leading-relaxed">
            Harness real-time meteorological conditions, soil chemistry analysis, dynamic irrigation parameters, and mandi price analytics to maximize farm yields and income.
          </p>

          {/* Tech Feature Badges */}
          <div className="mt-8 grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-3.5 text-left text-white">
              <CloudSun className="h-5 w-5 text-emerald-300 mb-1.5" />
              <p className="text-xs font-bold">Live Climate</p>
              <p className="text-[10px] text-emerald-200">GPS weather data</p>
            </div>
            <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-3.5 text-left text-white">
              <ShieldCheck className="h-5 w-5 text-emerald-300 mb-1.5" />
              <p className="text-xs font-bold">Soil Matching</p>
              <p className="text-[10px] text-emerald-200">Scientific suitability</p>
            </div>
            <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-3.5 text-left text-white">
              <TrendingUp className="h-5 w-5 text-emerald-300 mb-1.5" />
              <p className="text-xs font-bold">Mandi Trends</p>
              <p className="text-[10px] text-emerald-200">3-Year Agmarknet</p>
            </div>
          </div>
        </div>

        {/* Bottom Trust Badge */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-emerald-200/80">
          <span>Trusted by farmers across India</span>
          <span>English • தமிழ் • हिन्दी</span>
        </div>
      </div>

      {/* Right Column: Clean, Professional Login & Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-gray-100">
          {/* Header */}
          <div className="mb-8 text-center sm:text-left">
            <div className="flex items-center space-x-2 justify-center sm:justify-start mb-2">
              <div className="h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Official Farmer Portal
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {isSignUp ? t('signupTitle') : t('loginTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {t('loginSubtitle')}
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 flex items-start space-x-2.5 rounded-2xl bg-red-50 p-4 text-xs font-medium text-red-800 border border-red-200 animate-in fade-in duration-150">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Full Name / Farmer Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition bg-gray-50/50 hover:bg-white"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                {t('emailLabel')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="farmer@example.com"
                required
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition bg-gray-50/50 hover:bg-white"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  {t('passwordLabel')}
                </label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(true)}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
                  >
                    {t('forgotPasswordLink')}
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3.5 pr-12 rounded-xl border border-gray-200 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition bg-gray-50/50 hover:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition"
                  title={showPassword ? t('hidePassword') : t('showPassword')}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-4 bg-emerald-600 text-white font-bold text-sm rounded-xl hover:bg-emerald-700 active:scale-[0.99] transition shadow-lg shadow-emerald-600/25 flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>{isSignUp ? t('signUpBtn') : t('signInBtn')}</span>
              )}
            </button>
          </form>

          {/* Toggle between Login and Signup */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError(null)
              }}
              className="text-xs sm:text-sm font-semibold text-emerald-800 hover:text-emerald-950 hover:underline"
            >
              {isSignUp ? t('haveAccount') : t('needAccount')}
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-gray-400 font-semibold">Or for quick evaluation</span>
            </div>
          </div>

          {/* One-Click Guest Demo Login */}
          <button
            type="button"
            onClick={handleGuestLogin}
            disabled={loading}
            className="w-full py-3.5 border-2 border-emerald-600/30 bg-emerald-50 text-emerald-900 font-bold text-xs sm:text-sm rounded-xl hover:bg-emerald-100 hover:border-emerald-600/50 active:scale-[0.99] transition flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
          >
            <UserCheck className="h-4 w-4 text-emerald-700" />
            <span>{t('guestSignInBtn')}</span>
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        initialEmail={email}
      />
    </div>
  )
}
