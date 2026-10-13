// Authentication Context with Firebase Authentication and zero-config guest mode
import React, { createContext, useContext, useState, useEffect } from 'react'
import type { UserProfile, LanguageCode } from '../types'
import {
  subscribeToAuthChanges,
  loginWithEmail,
  registerWithEmail,
  loginAsGuest,
  logoutUser,
  requestPasswordReset,
  saveUserProfile,
} from '../services/firebase'

interface AuthContextType {
  user: UserProfile | null
  loading: boolean
  login: (email: string, pass: string) => Promise<void>
  register: (email: string, pass: string, name?: string) => Promise<void>
  loginGuest: () => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateLanguage: (lang: LanguageCode) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const login = async (email: string, pass: string) => {
    const profile = await loginWithEmail(email, pass)
    setUser(profile)
  }

  const register = async (email: string, pass: string, name?: string) => {
    const profile = await registerWithEmail(email, pass, name)
    setUser(profile)
  }

  const loginGuest = async () => {
    const profile = await loginAsGuest()
    setUser(profile)
  }

  const logout = async () => {
    await logoutUser()
    setUser(null)
  }

  const resetPassword = async (email: string) => {
    await requestPasswordReset(email)
  }

  const updateLanguage = async (lang: LanguageCode) => {
    if (user) {
      const updated: UserProfile = { ...user, preferredLanguage: lang }
      setUser(updated)
      await saveUserProfile(updated)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        loginGuest,
        logout,
        resetPassword,
        updateLanguage,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
