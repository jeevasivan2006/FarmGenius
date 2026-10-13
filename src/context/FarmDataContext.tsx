// Farm Data Context: Manages farm parameters, live weather telemetry,
// AI crop recommendations, selected crop insights, and history persistence.

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type {
  FarmDetails,
  WeatherData,
  CropRecommendation,
  MarketAnalysis,
  RecommendationHistoryItem,
} from '../types'
import { fetchFarmWeather, reverseGeocode, forwardGeocode } from '../services/weather'
import { generateCropRecommendations } from '../services/gemini'
import { getCropMarketAnalysis } from '../services/market'
import {
  saveFarmDetails as saveFarmToDB,
  getSavedFarmDetails,
  saveRecommendationHistory,
  getRecommendationHistory,
} from '../services/firebase'
import { useAuth } from './AuthContext'
import { useLanguage } from './LanguageContext'

interface FarmDataContextType {
  farmDetails: FarmDetails
  setFarmDetails: React.Dispatch<React.SetStateAction<FarmDetails>>
  weatherData: WeatherData | null
  setWeatherData: React.Dispatch<React.SetStateAction<WeatherData | null>>
  recommendations: CropRecommendation[]
  selectedCrop: CropRecommendation | null
  setSelectedCrop: (crop: CropRecommendation | null) => void
  marketAnalysis: MarketAnalysis | null
  history: RecommendationHistoryItem[]
  isLoadingAI: boolean
  loadingStage: string
  fetchWeatherFromGPS: () => Promise<WeatherData | null>
  fetchWeatherFromManual: (
    village: string,
    district: string,
    state: string,
    country?: string
  ) => Promise<WeatherData | null>
  runAnalysis: (overrideDetails?: Partial<FarmDetails>) => Promise<void>
  loadHistory: () => Promise<void>
}

const defaultFarmDetails: FarmDetails = {
  soilType: 'Loamy Soil',
  irrigationMethod: 'Drip Irrigation',
  landArea: 2.5,
  landAreaUnit: 'Acres',
  season: 'Kharif',
  budget: 50000,
  budgetBreakdown: {
    seeds: 8000,
    fertilizers: 15000,
    irrigation: 7000,
    labour: 15000,
    other: 5000,
  },
  previousCrop: 'Paddy',
  previousYield: '22 Quintals/Acre',
  organicPreference: false,
  experienceLevel: 'Intermediate',
  locationName: 'Thanjavur, Tamil Nadu, India',
  latitude: 10.787,
  longitude: 79.1378,
  locationSource: 'Current Location',
}

const FarmDataContext = createContext<FarmDataContextType | undefined>(undefined)

export const FarmDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const { language, t } = useLanguage()

  const [farmDetails, setFarmDetails] = useState<FarmDetails>(defaultFarmDetails)
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([])
  const [selectedCrop, setSelectedCrop] = useState<CropRecommendation | null>(null)
  const [marketAnalysis, setMarketAnalysis] = useState<MarketAnalysis | null>(null)
  const [history, setHistory] = useState<RecommendationHistoryItem[]>([])
  const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false)
  const [loadingStage, setLoadingStage] = useState<string>('')

  // Load saved farm details and history on user change
  useEffect(() => {
    if (user?.uid) {
      getSavedFarmDetails(user.uid).then((saved) => {
        if (saved) {
          setFarmDetails(saved)
        }
      })
      getRecommendationHistory(user.uid).then((items) => {
        setHistory(items)
      })
    }
  }, [user?.uid])

  // Update market analysis whenever the selected crop changes
  useEffect(() => {
    if (selectedCrop) {
      getCropMarketAnalysis(selectedCrop.crop).then((analysis) => {
        setMarketAnalysis(analysis)
      })
    } else {
      setMarketAnalysis(null)
    }
  }, [selectedCrop])

  // Fetch live weather using Browser Geolocation
  const fetchWeatherFromGPS = useCallback(async (): Promise<WeatherData | null> => {
    setLoadingStage(t('loadingLocation'))
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.warn('Geolocation not supported by browser')
        resolve(null)
        return
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            setLoadingStage(t('loadingWeather'))
            const lat = position.coords.latitude
            const lon = position.coords.longitude
            const geo = await reverseGeocode(lat, lon)
            const weather = await fetchFarmWeather(lat, lon, geo.name, 'Current Location')

            setWeatherData(weather)
            setFarmDetails((prev) => ({
              ...prev,
              latitude: lat,
              longitude: lon,
              locationName: geo.name,
              locationSource: 'Current Location',
            }))
            resolve(weather)
          } catch (err) {
            console.error('Error fetching GPS weather:', err)
            resolve(null)
          } finally {
            setLoadingStage('')
          }
        },
        (error) => {
          console.warn('Geolocation permission denied or error:', error.message)
          setLoadingStage('')
          resolve(null)
        },
        { timeout: 10000, enableHighAccuracy: true }
      )
    })
  }, [t])

  // Fetch weather from manually entered location
  const fetchWeatherFromManual = useCallback(
    async (
      village: string,
      district: string,
      state: string,
      country: string = 'India'
    ): Promise<WeatherData | null> => {
      try {
        setLoadingStage(t('loadingLocation'))
        const geocoded = await forwardGeocode(village, district, state, country)
        setLoadingStage(t('loadingWeather'))
        const weather = await fetchFarmWeather(
          geocoded.lat,
          geocoded.lon,
          geocoded.formattedName,
          'Manually Selected Location'
        )

        setWeatherData(weather)
        setFarmDetails((prev) => ({
          ...prev,
          latitude: geocoded.lat,
          longitude: geocoded.lon,
          locationName: geocoded.formattedName,
          locationSource: 'Manually Selected Location',
        }))
        return weather
      } catch (err) {
        console.error('Manual location weather fetch failed:', err)
        return null
      } finally {
        setLoadingStage('')
      }
    },
    [t]
  )

  // Run end-to-end AI recommendation analysis
  const runAnalysis = useCallback(
    async (overrideDetails?: Partial<FarmDetails>) => {
      setIsLoadingAI(true)
      const currentFarm: FarmDetails = {
        ...farmDetails,
        ...(overrideDetails || {}),
      }

      try {
        // Step 1: Ensure weather data is populated
        let activeWeather = weatherData
        if (!activeWeather) {
          setLoadingStage(t('loadingWeather'))
          const lat = currentFarm.latitude || 10.787
          const lon = currentFarm.longitude || 79.1378
          const locName = currentFarm.locationName || 'Thanjavur, Tamil Nadu'
          activeWeather = await fetchFarmWeather(lat, lon, locName, currentFarm.locationSource || 'Current Location')
          setWeatherData(activeWeather)
        }

        // Step 2: Analyze soil and climate
        setLoadingStage(t('loadingSoilClimate'))
        await new Promise((r) => setTimeout(r, 600)) // smooth visual progression

        // Step 3: Run Gemini AI model
        setLoadingStage(t('loadingAI'))
        const recs = await generateCropRecommendations(currentFarm, activeWeather, language)

        // Step 4: Finalize plan
        setLoadingStage(t('loadingPlan'))
        await new Promise((r) => setTimeout(r, 500))

        setRecommendations(recs)
        if (recs.length > 0) {
          setSelectedCrop(recs[0])
        }

        // Persist to user profile and history
        if (user?.uid) {
          await saveFarmToDB(user.uid, currentFarm)
          await saveRecommendationHistory(user.uid, {
            timestamp: new Date().toISOString(),
            farmDetails: currentFarm,
            weatherData: activeWeather,
            recommendations: recs,
          })
          const updatedHistory = await getRecommendationHistory(user.uid)
          setHistory(updatedHistory)
        }
      } catch (error) {
        console.error('Failed to run recommendation analysis:', error)
      } finally {
        setIsLoadingAI(false)
        setLoadingStage('')
      }
    },
    [farmDetails, weatherData, language, user?.uid, t]
  )

  const loadHistory = useCallback(async () => {
    if (user?.uid) {
      const items = await getRecommendationHistory(user.uid)
      setHistory(items)
    }
  }, [user?.uid])

  return (
    <FarmDataContext.Provider
      value={{
        farmDetails,
        setFarmDetails,
        weatherData,
        setWeatherData,
        recommendations,
        selectedCrop,
        setSelectedCrop,
        marketAnalysis,
        history,
        isLoadingAI,
        loadingStage,
        fetchWeatherFromGPS,
        fetchWeatherFromManual,
        runAnalysis,
        loadHistory,
      }}
    >
      {children}
    </FarmDataContext.Provider>
  )
}

export function useFarmData() {
  const context = useContext(FarmDataContext)
  if (!context) {
    throw new Error('useFarmData must be used within a FarmDataProvider')
  }
  return context
}
