// Type definitions for FarmGenius – AI-Powered Farming Solution

export type LanguageCode = 'en' | 'ta' | 'hi' | 'ml' | 'kn' | 'te'

export interface UserProfile {
  uid: string
  email: string
  displayName?: string
  preferredLanguage: LanguageCode
  createdAt: string
  isGuest?: boolean
}

export type SoilType =
  | 'Sandy Soil'
  | 'Clay Soil'
  | 'Loamy Soil'
  | 'Black Soil'
  | 'Red Soil'
  | 'Alluvial Soil'
  | 'Laterite Soil'
  | 'Other'

export type IrrigationMethod =
  | 'Rainfed'
  | 'Drip Irrigation'
  | 'Sprinkler Irrigation'
  | 'Canal Irrigation'
  | 'Borewell'
  | 'Well'
  | 'Flood Irrigation'
  | 'Other'

export type LandAreaUnit = 'Acres' | 'Hectares' | 'Cents'

export type SeasonType = 'Kharif' | 'Rabi' | 'Zaid' | 'Custom'

export interface BudgetBreakdown {
  seeds?: number
  fertilizers?: number
  irrigation?: number
  labour?: number
  other?: number
}

export interface FarmDetails {
  soilType: SoilType | string
  customSoilType?: string
  irrigationMethod: IrrigationMethod | string
  customIrrigation?: string
  landArea: number
  landAreaUnit: LandAreaUnit
  season: SeasonType | string
  startMonth?: string
  endMonth?: string
  budget: number
  budgetBreakdown?: BudgetBreakdown
  previousCrop?: string
  previousYield?: string
  organicPreference?: boolean
  fertilizerPreference?: string
  experienceLevel?: 'Beginner' | 'Intermediate' | 'Experienced'
  locationName?: string
  latitude?: number
  longitude?: number
  locationSource?: 'Current Location' | 'Manually Selected Location'
}

export interface WeatherData {
  locationName: string
  village?: string
  district?: string
  state?: string
  country?: string
  latitude: number
  longitude: number
  temperature: number // °C
  humidity: number // %
  rainfall: number // mm
  condition: string
  windSpeed: number // km/h
  rainProbability: number // %
  forecastSummary: string
  suitability: 'Excellent' | 'Good' | 'Moderate' | 'Poor'
  suitabilityReason: string
  source: 'Current Location' | 'Manually Selected Location'
  rawDataSource: 'OpenWeatherMap' | 'Open-Meteo'
}

export interface FertilizerStage {
  name: string
  npkRatio?: string
  quantityPerAcre: string
  applicationStage: string
  applicationMethod: string
}

export interface FertilizerSchedule {
  basalApplication: FertilizerStage
  topDressing: FertilizerStage[]
  micronutrients: string[]
  organicAlternatives: string[]
  precautions: string
}

export interface CultivationTimelineStage {
  stage: string
  startDay: number
  endDay: number
  keyActivity: string
}

export interface CropRecommendation {
  id: string
  crop: string
  cropTa?: string
  cropHi?: string
  cropMl?: string
  cropKn?: string
  cropTe?: string
  scientificName?: string
  matchPercentage: number
  suitabilityBreakdown: {
    soilSuitability: number
    climateSuitability: number
    rainfallSuitability: number
    seasonSuitability: number
    budgetSuitability: number
  }
  reasons: string[]
  cultivationDays: {
    minimum: number
    maximum: number
  }
  estimatedInvestmentINR: number
  waterRequirement: 'Low' | 'Medium' | 'High'
  expectedHarvestYield: string
  marketTrend: 'Increasing' | 'Stable' | 'Decreasing'
  suitableSoil: string
  suitableClimate: string
  temperatureRange: string
  rainfallRequirement: string
  irrigationRequirement: string
  seedRequirement: string
  sowingPeriod: string
  harvestPeriod: string
  basicCultivationSteps: string[]
  commonDiseases: string[]
  pestManagement: string[]
  precautions: string[]
  fertilizers: FertilizerSchedule
  timeline: CultivationTimelineStage[]
  imageUrl: string
}

export interface MarketPricePoint {
  date: string // YYYY-MM
  displayDate: string
  priceINR: number // ₹/quintal
  isForecast?: boolean
}

export interface MarketAnalysis {
  cropName: string
  averagePriceINR: number
  minPriceINR: number
  maxPriceINR: number
  latestPriceINR: number
  trend: 'Increasing' | 'Stable' | 'Decreasing'
  yoyChangePercent: number
  historicalPrices: MarketPricePoint[]
  dataSourceType: 'Agmarknet Real Data' | 'Historical Commodity Model (Demo / Simulation)'
  marketNote: string
}

export interface RecommendationHistoryItem {
  id: string
  timestamp: string
  farmDetails: FarmDetails
  weatherData: WeatherData
  recommendations: CropRecommendation[]
}
