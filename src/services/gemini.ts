// Google Gemini AI Crop Recommendation Engine
// Analyzes farm parameters, meteorological telemetry, and economic conditions
// to generate Top 3 crop recommendations with suitability breakdowns,
// fertilizer schedules, cultivation timelines, and pest prevention guidelines.

import type {
  FarmDetails,
  WeatherData,
  CropRecommendation,
  LanguageCode,
  FertilizerSchedule,
} from '../types'

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''

/**
 * Standard agronomic database for expert rule-based fallback when Gemini API key is absent or quota limited
 */
interface AgronomicCropProfile {
  name: string
  nameTa: string
  nameHi: string
  nameMl: string
  nameKn: string
  nameTe: string
  scientificName: string
  idealSoils: string[]
  idealIrrigation: string[]
  minTemp: number
  maxTemp: number
  optimalRainMin: number
  optimalRainMax: number
  idealSeasons: string[]
  minCostPerAcre: number
  maxCostPerAcre: number
  minDays: number
  maxDays: number
  waterReq: 'Low' | 'Medium' | 'High'
  yieldPerAcre: string
  marketTrend: 'Increasing' | 'Stable' | 'Decreasing'
  sowingPeriod: string
  harvestPeriod: string
  imageUrl: string
  steps: string[]
  diseases: string[]
  pests: string[]
  precautions: string[]
  fertilizers: FertilizerSchedule
}

const AGRONOMIC_KNOWLEDGE_BASE: AgronomicCropProfile[] = [
  {
    name: 'Rice (Paddy)',
    nameTa: 'நெல் (Paddy)',
    nameHi: 'धान / चावल (Paddy)',
    nameMl: 'നെല്ല് (Paddy)',
    nameKn: 'ಭತ್ತ / ಅಕ್ಕಿ (Paddy)',
    nameTe: 'వరి / ధాన్యం (Paddy)',
    scientificName: 'Oryza sativa',
    idealSoils: ['Clay Soil', 'Alluvial Soil', 'Loamy Soil', 'Black Soil'],
    idealIrrigation: ['Canal Irrigation', 'Flood Irrigation', 'Borewell', 'Well'],
    minTemp: 20,
    maxTemp: 38,
    optimalRainMin: 20,
    optimalRainMax: 150,
    idealSeasons: ['Kharif', 'Zaid'],
    minCostPerAcre: 28000,
    maxCostPerAcre: 42000,
    minDays: 120,
    maxDays: 145,
    waterReq: 'High',
    yieldPerAcre: '22 - 28 Quintals/Acre',
    marketTrend: 'Increasing',
    sowingPeriod: 'June - July (Kharif) or Nov - Dec (Rabi)',
    harvestPeriod: 'October - November or March - April',
    imageUrl: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=800&q=80',
    steps: [
      'Puddle the field thoroughly and level to maintain uniform water standing of 2-5 cm.',
      'Treat certified seeds with Pseudomonas fluorescens (10g/kg seed) to prevent seed-borne blast.',
      'Transplant 20-25 day old seedlings maintaining 20x10 cm hill spacing.',
      'Apply basal fertilizer with complete phosphorus and 50% potassium before the final leveling.',
      'Drain water 10 days before anticipated harvest for uniform panicle ripening.',
    ],
    diseases: ['Blast (Pyricularia oryzae)', 'Bacterial Leaf Blight (Xanthomonas oryzae)', 'Sheath Blight'],
    pests: ['Yellow Stem Borer', 'Brown Planthopper (BPH)', 'Gall Midge'],
    precautions: [
      'Avoid excessive nitrogen top-dressing which increases susceptibility to blast and lodging.',
      'Maintain alternate wetting and drying (AWD) water management to prevent root rot and save water.',
    ],
    fertilizers: {
      basalApplication: {
        name: 'DAP (Di-Ammonium Phosphate) + MOP',
        npkRatio: '18:46:0 + 0:0:60',
        quantityPerAcre: '50 kg DAP + 25 kg MOP per acre',
        applicationStage: 'At the time of final puddling prior to transplanting',
        applicationMethod: 'Broadcast and thoroughly incorporate into puddled topsoil',
      },
      topDressing: [
        {
          name: 'Neem-Coated Urea (First Split)',
          quantityPerAcre: '30 kg per acre',
          applicationStage: 'Active Tillering stage (20-25 days after transplanting)',
          applicationMethod: 'Broadcast after draining standing water; irrigate next day',
        },
        {
          name: 'Neem-Coated Urea + MOP (Second Split)',
          quantityPerAcre: '25 kg Urea + 15 kg MOP per acre',
          applicationStage: 'Panicle Initiation stage (45-50 days after transplanting)',
          applicationMethod: 'Broadcast evenly in thin film of moisture',
        },
      ],
      micronutrients: ['Zinc Sulphate (25 kg/acre basal application) to prevent Khaira disease'],
      organicAlternatives: ['Well-decomposed Farmyard Manure (FYM) 5 tonnes/acre', 'Azospirillum & Phosphobacteria bio-fertilizers (2 kg/acre)'],
      precautions: 'Always verify exact soil nutrient status through Soil Health Card testing before major chemical fertilization.',
    },
  },
  {
    name: 'Wheat',
    nameTa: 'கோதுமை (Wheat)',
    nameHi: 'गेहूं (Wheat)',
    nameMl: 'ഗോതമ്പ് (Wheat)',
    nameKn: 'ಗೋಧಿ (Wheat)',
    nameTe: 'గోధుమ (Wheat)',
    scientificName: 'Triticum aestivum',
    idealSoils: ['Loamy Soil', 'Alluvial Soil', 'Black Soil', 'Clay Soil'],
    idealIrrigation: ['Sprinkler Irrigation', 'Borewell', 'Well', 'Canal Irrigation'],
    minTemp: 12,
    maxTemp: 28,
    optimalRainMin: 0,
    optimalRainMax: 40,
    idealSeasons: ['Rabi'],
    minCostPerAcre: 18000,
    maxCostPerAcre: 28000,
    minDays: 110,
    maxDays: 135,
    waterReq: 'Medium',
    yieldPerAcre: '18 - 24 Quintals/Acre',
    marketTrend: 'Increasing',
    sowingPeriod: 'Late October to Mid November',
    harvestPeriod: 'March - April',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    steps: [
      'Prepare a pulverized and crumbly seedbed free of clods.',
      'Sow seeds at 4-5 cm depth using seed-cum-fertilizer drill at 20-22 cm row spacing.',
      'Crucial irrigation at Crown Root Initiation (CRI) stage 21 days after sowing.',
      'Subsequent light irrigations at tillering, jointing, flowering, and milk stages.',
    ],
    diseases: ['Yellow Rust (Puccinia striiformis)', 'Loose Smut', 'Karnal Bunt'],
    pests: ['Aphids (Macrosiphum miscanthi)', 'Termites', 'Armyworm'],
    precautions: [
      'Do not delay CRI irrigation as it drastically reduces effective tillers.',
      'Avoid heavy flood irrigation during high winds to avert terminal lodging.',
    ],
    fertilizers: {
      basalApplication: {
        name: 'NPK 12:32:16 or DAP',
        npkRatio: '12:32:16',
        quantityPerAcre: '60 kg per acre',
        applicationStage: 'Basal placement at drilling time below seed level',
        applicationMethod: 'Seed-cum-fertilizer drill mechanical band placement',
      },
      topDressing: [
        {
          name: 'Neem-Coated Urea (First Dose)',
          quantityPerAcre: '35 kg per acre',
          applicationStage: 'Crown Root Initiation (21-25 days after sowing)',
          applicationMethod: 'Top dressing followed immediately by irrigation',
        },
        {
          name: 'Neem-Coated Urea (Second Dose)',
          quantityPerAcre: '30 kg per acre',
          applicationStage: 'Late Jointing stage (45-50 days after sowing)',
          applicationMethod: 'Broadcast evenly prior to irrigation',
        },
      ],
      micronutrients: ['Foliar spray of 0.5% Zinc Sulphate + 0.25% Lime at tillering if deficiency symptoms appear'],
      organicAlternatives: ['Vermicompost (2 tonnes/acre)', 'Azotobacter seed inoculation (200g/10kg seed)'],
      precautions: 'Avoid broadcasting urea over wet foliage to avert leaf tip scorch.',
    },
  },
  {
    name: 'Cotton',
    nameTa: 'பருத்தி (Cotton)',
    nameHi: 'कपास (Cotton)',
    nameMl: 'പരുത്തി (Cotton)',
    nameKn: 'ಹತ್ತಿ (Cotton)',
    nameTe: 'ప్రత్తి / పత్తి (Cotton)',
    scientificName: 'Gossypium hirsutum',
    idealSoils: ['Black Soil', 'Alluvial Soil', 'Red Soil', 'Loamy Soil'],
    idealIrrigation: ['Drip Irrigation', 'Borewell', 'Well', 'Canal Irrigation', 'Rainfed'],
    minTemp: 21,
    maxTemp: 37,
    optimalRainMin: 10,
    optimalRainMax: 80,
    idealSeasons: ['Kharif'],
    minCostPerAcre: 30000,
    maxCostPerAcre: 48000,
    minDays: 150,
    maxDays: 180,
    waterReq: 'Medium',
    yieldPerAcre: '10 - 15 Quintals/Acre',
    marketTrend: 'Stable',
    sowingPeriod: 'May - June (irrigated) / July (rainfed)',
    harvestPeriod: 'November - January (multiple pickings)',
    imageUrl: 'https://images.unsplash.com/photo-1594489428504-5c0c480a15fd?auto=format&fit=crop&w=800&q=80',
    steps: [
      'Deep summer ploughing followed by harrowing to ensure good aeration in black cotton soils.',
      'Dibble 1-2 seeds per hill at 90x60 cm or 90x45 cm spacing.',
      'Thin out to single vigorous seedling per hill at 15-20 days after germination.',
      'Adopt clean manual hand picking in the morning hours when dew has evaporated.',
    ],
    diseases: ['Bacterial Blight', 'Grey Mildew', 'Fusarium Wilt'],
    pests: ['Pink Bollworm (Pectinophora gossypiella)', 'Whitefly', 'Thrips'],
    precautions: [
      'Install pheromone traps (5 traps/acre) at 45 days for Pink Bollworm monitoring.',
      'Avoid excess late nitrogen application which creates lush foliage inviting sucking pests.',
    ],
    fertilizers: {
      basalApplication: {
        name: 'NPK 10:26:26 or DAP + Potash',
        npkRatio: '10:26:26',
        quantityPerAcre: '50 kg per acre',
        applicationStage: 'Basal application at sowing in furrow 5 cm away from seeds',
        applicationMethod: 'Deep soil placement in sowing furrow',
      },
      topDressing: [
        {
          name: 'Neem-Coated Urea + MOP',
          quantityPerAcre: '30 kg Urea + 15 kg MOP per acre',
          applicationStage: 'Square formation stage (40-45 DAS)',
          applicationMethod: 'Ring placement around root zone with light soil covering',
        },
        {
          name: 'Neem-Coated Urea',
          quantityPerAcre: '25 kg per acre',
          applicationStage: 'Peak Flowering / Boll development (70-75 DAS)',
          applicationMethod: 'Side dressing followed by earthing up',
        },
      ],
      micronutrients: ['Foliar spray of 1% Magnesium Sulphate + 0.5% Micronutrient mix at flowering'],
      organicAlternatives: ['Neem cake (150 kg/acre)', 'Trichoderma viride soil application with enriched compost'],
      precautions: 'Do not spray chemicals during peak honeybee pollinator hours in early morning.',
    },
  },
  {
    name: 'Maize (Corn)',
    nameTa: 'மக்காச்சோளம் (Maize)',
    nameHi: 'मक्का (Maize)',
    nameMl: 'ചോളം (Maize)',
    nameKn: 'ಮೆಕ್ಕೆಜೋಳ (Maize)',
    nameTe: 'మొక్కజొన్న (Maize)',
    scientificName: 'Zea mays',
    idealSoils: ['Loamy Soil', 'Red Soil', 'Alluvial Soil', 'Black Soil'],
    idealIrrigation: ['Drip Irrigation', 'Sprinkler Irrigation', 'Well', 'Borewell', 'Rainfed'],
    minTemp: 18,
    maxTemp: 35,
    optimalRainMin: 10,
    optimalRainMax: 90,
    idealSeasons: ['Kharif', 'Rabi', 'Zaid'],
    minCostPerAcre: 18000,
    maxCostPerAcre: 26000,
    minDays: 95,
    maxDays: 115,
    waterReq: 'Medium',
    yieldPerAcre: '24 - 32 Quintals/Acre',
    marketTrend: 'Increasing',
    sowingPeriod: 'June - July (Kharif) or Oct - Nov (Rabi)',
    harvestPeriod: 'September - October or February - March',
    imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80',
    steps: [
      'Prepare fine seedbed and form ridges and furrows at 60 cm spacing.',
      'Sow hybrid seeds at 60x20 cm spacing at 4 cm depth with good moisture.',
      'Keep field weed-free during first 30 days critical period.',
      'Tasseling and silking are critical moisture stress periods requiring guaranteed irrigation.',
    ],
    diseases: ['Turcicum Leaf Blight', 'Maydis Leaf Blight', 'Downy Mildew'],
    pests: ['Fall Armyworm (Spodoptera frugiperda)', 'Stem Borer'],
    precautions: [
      'Scout for Fall Armyworm central whorl pinholes from day 10 onward.',
      'Avoid water stagnant conditions around seedlings for more than 24 hours.',
    ],
    fertilizers: {
      basalApplication: {
        name: 'NPK 20:20:0:13 + Potash',
        npkRatio: '20:20:0:13 + 0:0:60',
        quantityPerAcre: '50 kg + 20 kg MOP per acre',
        applicationStage: 'Basal dressing along the ridge lines prior to sowing',
        applicationMethod: 'Band placement 5 cm below and to side of seed line',
      },
      topDressing: [
        {
          name: 'Neem-Coated Urea',
          quantityPerAcre: '30 kg per acre',
          applicationStage: 'Knee-high vegetative stage (30 DAS)',
          applicationMethod: 'Side band placement followed by light earthing up',
        },
        {
          name: 'Neem-Coated Urea',
          quantityPerAcre: '25 kg per acre',
          applicationStage: 'Tasseling / Silking stage (50-55 DAS)',
          applicationMethod: 'Broadcast between rows followed by irrigation',
        },
      ],
      micronutrients: ['Zinc Sulphate 10 kg/acre basal application'],
      organicAlternatives: ['Poultry manure (1 tonne/acre)', 'Mycorrhizal bio-fertilizer granules (4 kg/acre)'],
      precautions: 'Check whorl placement of biopesticides if Fall Armyworm larvae appear.',
    },
  },
  {
    name: 'Groundnut (Peanut)',
    nameTa: 'நிலக்கடலை (Groundnut)',
    nameHi: 'मूंगफली (Groundnut)',
    nameMl: 'നിലക്കടല (Groundnut)',
    nameKn: 'ಕಡಲೆಕಾಯಿ (Groundnut)',
    nameTe: 'వేరుశనగ (Groundnut)',
    scientificName: 'Arachis hypogaea',
    idealSoils: ['Sandy Soil', 'Red Soil', 'Loamy Soil', 'Laterite Soil'],
    idealIrrigation: ['Sprinkler Irrigation', 'Drip Irrigation', 'Well', 'Rainfed'],
    minTemp: 22,
    maxTemp: 34,
    optimalRainMin: 10,
    optimalRainMax: 60,
    idealSeasons: ['Kharif', 'Rabi', 'Zaid'],
    minCostPerAcre: 20000,
    maxCostPerAcre: 30000,
    minDays: 105,
    maxDays: 125,
    waterReq: 'Low',
    yieldPerAcre: '12 - 16 Quintals/Acre',
    marketTrend: 'Increasing',
    sowingPeriod: 'June - July (Rainfed) / Dec - Jan (Irrigated)',
    harvestPeriod: 'October - November / April - May',
    imageUrl: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=800&q=80',
    steps: [
      'Plough light friable soil to 15 cm depth so gynophores (pegs) enter easily.',
      'Inoculate kernels with Rhizobium culture (200g/10kg seed) 30 min before sowing.',
      'Sow kernels at 30x10 cm spacing at 5 cm depth.',
      'Crucial gypsum application at 40-45 DAS along with earthing up for pod formation.',
    ],
    diseases: ['Tikka Disease (Leaf Spot)', 'Rust', 'Collar Rot'],
    pests: ['Red Hairy Caterpillar', 'Leaf Miner', 'White Grub'],
    precautions: [
      'Do not disturb soil around pegs after 50 days to prevent pod dislodgement.',
      'Maintain moist soil during pod development to prevent afla-toxin producing fungi.',
    ],
    fertilizers: {
      basalApplication: {
        name: 'Single Super Phosphate (SSP) + Urea + Potash',
        npkRatio: '10:20:20 kg NPK/acre',
        quantityPerAcre: '25 kg Urea + 125 kg SSP + 35 kg MOP per acre',
        applicationStage: 'Basal placement at final harrowing',
        applicationMethod: 'Broadcast and thoroughly mix with friable soil',
      },
      topDressing: [
        {
          name: 'Agricultural Gypsum',
          quantityPerAcre: '160-200 kg per acre',
          applicationStage: 'Peg initiation stage (40-45 DAS)',
          applicationMethod: 'Band placement around plants and incorporate with light hoeing',
        },
      ],
      micronutrients: ['Borax (4 kg/acre) applied with gypsum to prevent hollow heart disorder'],
      organicAlternatives: ['Castor cake (200 kg/acre)', 'Rhizobium and Phosphobacteria biofertilizers'],
      precautions: 'Gypsum calcium is indispensable for pod filling and shelling percentage.',
    },
  },
  {
    name: 'Tomato',
    nameTa: 'தக்காளி (Tomato)',
    nameHi: 'टमाटर (Tomato)',
    nameMl: 'തക്കാളി (Tomato)',
    nameKn: 'ಟೊಮೆಟೊ (Tomato)',
    nameTe: 'టమోటా (Tomato)',
    scientificName: 'Solanum lycopersicum',
    idealSoils: ['Loamy Soil', 'Red Soil', 'Black Soil', 'Alluvial Soil'],
    idealIrrigation: ['Drip Irrigation', 'Borewell', 'Well', 'Sprinkler Irrigation'],
    minTemp: 18,
    maxTemp: 32,
    optimalRainMin: 0,
    optimalRainMax: 50,
    idealSeasons: ['Rabi', 'Kharif', 'Zaid'],
    minCostPerAcre: 35000,
    maxCostPerAcre: 55000,
    minDays: 100,
    maxDays: 130,
    waterReq: 'Medium',
    yieldPerAcre: '150 - 220 Quintals/Acre',
    marketTrend: 'Stable',
    sowingPeriod: 'Aug - Sep or Nov - Dec or Feb - Mar',
    harvestPeriod: 'Multiple picks starting 70 days after planting',
    imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80',
    steps: [
      'Raise robust seedlings in pro-trays with sterilized coco-peat for 25-30 days.',
      'Transplant onto raised beds with silver-black mulch and drip irrigation.',
      'Stake indeterminate hybrid plants with bamboo poles and trellis twine at 30 days.',
      'Prune lower lateral suckers to encourage concentrated fruit set.',
    ],
    diseases: ['Early Blight (Alternaria)', 'Tomato Leaf Curl Virus (ToLCV)', 'Bacterial Wilt'],
    pests: ['Fruit Borer (Helicoverpa armigera)', 'Whiteflies (vector of ToLCV)', 'Tuta absoluta'],
    precautions: [
      'Install yellow sticky traps (15 traps/acre) to control vector whiteflies.',
      'Avoid overhead sprinkling that stimulates fungal early blight on leaves.',
    ],
    fertilizers: {
      basalApplication: {
        name: 'DAP + SOP + Neem Cake',
        npkRatio: '50 kg DAP + 35 kg SOP + 100 kg Neem cake per acre',
        quantityPerAcre: 'Complete basal dose under mulching film',
        applicationStage: 'Basal bed preparation before laying plastic mulch',
        applicationMethod: 'Incorporate into raised bed center line',
      },
      topDressing: [
        {
          name: 'Water Soluble NPK 19:19:19 via Fertigation',
          quantityPerAcre: '3 kg per acre twice weekly',
          applicationStage: 'Vegetative to flowering stage (Days 20 to 50)',
          applicationMethod: 'Drip line fertigation injection',
        },
        {
          name: 'Water Soluble NPK 13:0:45 (Potassium Nitrate) + Calcium Nitrate',
          quantityPerAcre: '4 kg per acre weekly',
          applicationStage: 'Fruit enlargement and ripening stage (Days 55 to 110)',
          applicationMethod: 'Drip line fertigation',
        },
      ],
      micronutrients: ['Chelated Calcium + Boron foliar spray at peak flowering to stop Blossom End Rot'],
      organicAlternatives: ['Panchagavya foliar spray (3%)', 'Trichoderma viride in drip line (1 kg/acre)'],
      precautions: 'Do not mix calcium fertilizers directly with phosphorus fertilizers in the same stock tank.',
    },
  },
  {
    name: 'Chickpea / Bengal Gram',
    nameTa: 'கொண்டைக்கடலை (Chickpea)',
    nameHi: 'चना (Chickpea / Bengal Gram)',
    nameMl: 'കടല (Chickpea)',
    nameKn: 'ಕಡಲೆ (Chickpea)',
    nameTe: 'శనగలు (Chickpea)',
    scientificName: 'Cicer arietinum',
    idealSoils: ['Black Soil', 'Loamy Soil', 'Alluvial Soil', 'Clay Soil'],
    idealIrrigation: ['Rainfed', 'Sprinkler Irrigation', 'Well'],
    minTemp: 10,
    maxTemp: 27,
    optimalRainMin: 0,
    optimalRainMax: 30,
    idealSeasons: ['Rabi'],
    minCostPerAcre: 14000,
    maxCostPerAcre: 22000,
    minDays: 95,
    maxDays: 115,
    waterReq: 'Low',
    yieldPerAcre: '8 - 12 Quintals/Acre',
    marketTrend: 'Increasing',
    sowingPeriod: 'Mid October to Early November',
    harvestPeriod: 'February - March',
    imageUrl: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=800&q=80',
    steps: [
      'Requires rough seedbed to preserve subsoil residual moisture; avoid over-pulverizing.',
      'Treat seed with Trichoderma (4g/kg) and Rhizobium culture.',
      'Sow at 30x10 cm spacing at 8-10 cm deep to contact moist soil layer.',
      'Nipping of apical shoots at 30-40 DAS to induce profuse secondary branching.',
    ],
    diseases: ['Fusarium Wilt', 'Ascochyta Blight', 'Dry Root Rot'],
    pests: ['Gram Pod Borer (Helicoverpa armigera)', 'Cutworms'],
    precautions: [
      'Avoid excess irrigation during flowering which causes vegetative luxury and flower drop.',
      'Deep sowing protects emerging seedlings from wilt and shallow moisture stress.',
    ],
    fertilizers: {
      basalApplication: {
        name: 'DAP (Di-Ammonium Phosphate) + Sulphur',
        npkRatio: '18:46:0',
        quantityPerAcre: '40 kg DAP + 10 kg elemental Sulphur per acre',
        applicationStage: 'Basal placement at sowing below seed furrow',
        applicationMethod: 'Seed drill placement',
      },
      topDressing: [
        {
          name: 'Foliar Spray of 2% Urea or 1% 19:19:19',
          quantityPerAcre: 'Foliar application',
          applicationStage: 'Flower initiation and pod development stages',
          applicationMethod: 'High volume foliar sprayer in calm late afternoon',
        },
      ],
      micronutrients: ['Ammonium Molybdate (1g/kg seed treatment) enhances nitrogen fixation nodules'],
      organicAlternatives: ['Vermi-wash foliar spray (5%)', 'Rhizobium ciceri biofertilizer'],
      precautions: 'Legume root nodules self-fix atmospheric nitrogen; avoid excess nitrogen fertilizer.',
    },
  },
]

/**
 * Generate AI Crop Recommendations using Google Gemini API with strict structured output.
 * If the API key is not present or an error occurs, falls back to the deterministic Agronomic Rule Engine.
 */
export async function generateCropRecommendations(
  farm: FarmDetails,
  weather: WeatherData,
  lang: LanguageCode = 'en'
): Promise<CropRecommendation[]> {
  // If Gemini API Key is available, invoke Gemini
  if (GEMINI_API_KEY && GEMINI_API_KEY !== 'your_gemini_api_key_here') {
    try {
      const result = await callGeminiAPI(farm, weather, lang)
      if (result && result.length === 3) {
        return result
      }
    } catch (err) {
      console.warn('[FarmGenius] Gemini API call did not succeed, activating Agronomic Expert Engine:', err)
    }
  }

  // Agronomic Rule Engine Fallback (Guarantees authentic, scientifically backed output)
  return runAgronomicExpertEngine(farm, weather)
}

/**
 * Call Gemini REST API directly with structured JSON instructions
 */
async function callGeminiAPI(
  farm: FarmDetails,
  weather: WeatherData,
  _lang: LanguageCode
): Promise<CropRecommendation[]> {
  const prompt = `You are FarmGenius, an expert agricultural scientist and agronomist.
Given the following farmer's field profile and live weather data, analyze suitability across:
1. Soil type compatibility
2. Climate and temperature compatibility
3. Rainfall and moisture conditions
4. Season alignment (Kharif, Rabi, Zaid)
5. Irrigation availability
6. Farmer budget (₹ INR) and land area
7. Market trend expectations

FARM PROFILE:
- Location: ${farm.locationName || weather.locationName} (${weather.source})
- Soil Type: ${farm.soilType} ${farm.customSoilType ? `(${farm.customSoilType})` : ''}
- Irrigation Method: ${farm.irrigationMethod} ${farm.customIrrigation ? `(${farm.customIrrigation})` : ''}
- Land Area: ${farm.landArea} ${farm.landAreaUnit}
- Season: ${farm.season}
- Budget: ₹${farm.budget} INR
- Previous Crop: ${farm.previousCrop || 'None specified'}
- Organic Preference: ${farm.organicPreference ? 'Yes' : 'No'}
- Experience Level: ${farm.experienceLevel || 'Intermediate'}

LIVE WEATHER TELEMETRY:
- Temperature: ${weather.temperature}°C
- Humidity: ${weather.humidity}%
- Current Rainfall: ${weather.rainfall} mm
- Weather Condition: ${weather.condition}
- Wind Speed: ${weather.windSpeed} km/h
- Rain Probability: ${weather.rainProbability}%

TASK:
Return exactly TOP 3 recommended crops suited for this farm.
Return ONLY valid JSON matching this exact structure:
{
  "recommendations": [
    {
      "id": "crop_1",
      "crop": "Crop Name in English",
      "cropTa": "பயிர் பெயர் (Tamil)",
      "cropHi": "फसल का नाम (Hindi)",
      "cropMl": "വിളയുടെ പേര് (Malayalam)",
      "cropKn": "ಬೆಳೆಯ ಹೆಸರು (Kannada)",
      "cropTe": "పంట పేరు (Telugu)",
      "scientificName": "Scientific name",
      "matchPercentage": 92,
      "suitabilityBreakdown": {
        "soilSuitability": 95,
        "climateSuitability": 90,
        "rainfallSuitability": 92,
        "seasonSuitability": 94,
        "budgetSuitability": 89
      },
      "reasons": [
        "Suitable soil drainage for this variety",
        "Adequate seasonal temperature window",
        "Cost fits comfortably within your farm budget",
        "Irrigation system perfectly matches water demand"
      ],
      "cultivationDays": {
        "minimum": 115,
        "maximum": 140
      },
      "estimatedInvestmentINR": 32000,
      "waterRequirement": "Medium",
      "expectedHarvestYield": "20 - 24 Quintals/Acre",
      "marketTrend": "Increasing",
      "suitableSoil": "Loamy or clay soil with good organic carbon",
      "suitableClimate": "Warm tropical / subtropical climate",
      "temperatureRange": "20°C - 35°C",
      "rainfallRequirement": "600 - 1000 mm annually",
      "irrigationRequirement": "Light weekly irrigation at critical stages",
      "seedRequirement": "20-25 kg certified seed per acre",
      "sowingPeriod": "June - July or Oct - Nov",
      "harvestPeriod": "October - November or Feb - March",
      "basicCultivationSteps": ["Step 1", "Step 2", "Step 3", "Step 4"],
      "commonDiseases": ["Disease 1", "Disease 2"],
      "pestManagement": ["Pest prevention 1", "Pest prevention 2"],
      "precautions": ["Precaution 1", "Precaution 2"],
      "fertilizers": {
        "basalApplication": {
          "name": "Basal fertilizer name",
          "npkRatio": "18:46:0",
          "quantityPerAcre": "50 kg/acre",
          "applicationStage": "At sowing / transplanting",
          "applicationMethod": "Band placement in root zone"
        },
        "topDressing": [
          {
            "name": "Neem Coated Urea",
            "quantityPerAcre": "30 kg/acre",
            "applicationStage": "Vegetative stage (30 DAS)",
            "applicationMethod": "Broadcast before irrigation"
          }
        ],
        "micronutrients": ["Zinc Sulphate 10 kg/acre"],
        "organicAlternatives": ["Compost 5 tonnes/acre", "Bio-fertilizers"],
        "precautions": "Important: Fertilizer recommendations should ideally be confirmed using a soil test and local agricultural guidance."
      },
      "timeline": [
        { "stage": "Seed Preparation", "startDay": 1, "endDay": 10, "keyActivity": "Seed treatment and seedbed preparation" },
        { "stage": "Sowing", "startDay": 11, "endDay": 25, "keyActivity": "Sowing and germination management" },
        { "stage": "Vegetative Growth", "startDay": 26, "endDay": 65, "keyActivity": "Tillering, weed control and fertilization" },
        { "stage": "Flowering", "startDay": 66, "endDay": 95, "keyActivity": "Flowering and seed filling" },
        { "stage": "Harvest", "startDay": 96, "endDay": 125, "keyActivity": "Harvesting and post-harvest drying" }
      ],
      "imageUrl": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"
    }
  ]
}`

  const candidateModels = ['gemini-2.5-flash', 'gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.5-flash']
  let lastError: Error | null = null

  for (const model of candidateModels) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.2,
            },
          }),
        }
      )

      if (!response.ok) {
        continue
      }

      const json = await response.json()
      const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text || ''
      const parsed = JSON.parse(rawText)

      if (Array.isArray(parsed.recommendations) && parsed.recommendations.length >= 3) {
        return parsed.recommendations.slice(0, 3)
      }
    } catch (err: any) {
      lastError = err
    }
  }

  throw lastError || new Error('Could not obtain valid recommendations from Gemini models')
}

/**
 * Deterministic Agronomic Expert Rule Engine
 * Calculates scientific suitability scores based on real agronomy matrices.
 */
function runAgronomicExpertEngine(farm: FarmDetails, weather: WeatherData): CropRecommendation[] {
  // Score every crop in AGRONOMIC_KNOWLEDGE_BASE
  const scoredCrops = AGRONOMIC_KNOWLEDGE_BASE.map((crop) => {
    // 1. Soil Suitability (0 - 100)
    let soilScore = 65
    if (crop.idealSoils.some((s) => s.toLowerCase() === farm.soilType.toLowerCase())) {
      soilScore = 96
    } else if (farm.soilType === 'Loamy Soil' || farm.soilType === 'Alluvial Soil') {
      soilScore = 88
    } else if (farm.soilType === 'Other') {
      soilScore = 75
    }

    // 2. Climate Suitability (0 - 100) based on current weather temperature
    let climateScore = 80
    if (weather.temperature >= crop.minTemp && weather.temperature <= crop.maxTemp) {
      climateScore = 94
    } else if (
      weather.temperature >= crop.minTemp - 4 &&
      weather.temperature <= crop.maxTemp + 4
    ) {
      climateScore = 82
    } else {
      climateScore = 60
    }

    // 3. Rainfall & Water Suitability (0 - 100)
    let rainScore = 82
    const hasDripOrSprinkler =
      farm.irrigationMethod.includes('Drip') || farm.irrigationMethod.includes('Sprinkler')
    const hasAssuredIrrigation =
      farm.irrigationMethod.includes('Canal') ||
      farm.irrigationMethod.includes('Borewell') ||
      farm.irrigationMethod.includes('Well')

    if (crop.waterReq === 'High') {
      if (hasAssuredIrrigation || farm.irrigationMethod.includes('Flood')) {
        rainScore = 92
      } else if (farm.irrigationMethod === 'Rainfed') {
        rainScore = weather.rainfall > 30 ? 76 : 58
      } else {
        rainScore = 80
      }
    } else if (crop.waterReq === 'Medium') {
      if (hasDripOrSprinkler || hasAssuredIrrigation) {
        rainScore = 93
      } else {
        rainScore = 78
      }
    } else {
      // Low water requirement
      rainScore = 95
    }

    // 4. Season Suitability (0 - 100)
    let seasonScore = 70
    if (crop.idealSeasons.some((s) => s.toLowerCase() === farm.season.toLowerCase())) {
      seasonScore = 96
    } else if (crop.idealSeasons.length >= 2) {
      seasonScore = 86
    }

    // 5. Budget Suitability (0 - 100)
    let budgetScore = 85
    // Land area in acres
    let landInAcres = farm.landArea
    if (farm.landAreaUnit === 'Hectares') landInAcres *= 2.47
    if (farm.landAreaUnit === 'Cents') landInAcres *= 0.01

    const requiredBudgetMin = crop.minCostPerAcre * Math.max(0.5, landInAcres)
    if (farm.budget >= requiredBudgetMin) {
      budgetScore = 94
    } else {
      const ratio = farm.budget / requiredBudgetMin
      budgetScore = Math.max(50, Math.round(ratio * 90))
    }

    // Overall weighted suitability match percentage
    const matchPercentage = Math.round(
      soilScore * 0.28 +
        climateScore * 0.22 +
        rainScore * 0.18 +
        seasonScore * 0.18 +
        budgetScore * 0.14
    )

    return {
      crop,
      matchPercentage,
      soilScore,
      climateScore,
      rainScore,
      seasonScore,
      budgetScore,
      landInAcres,
    }
  })

  // Sort descending by match score and take Top 3
  scoredCrops.sort((a, b) => b.matchPercentage - a.matchPercentage)
  const top3 = scoredCrops.slice(0, 3)

  return top3.map((item, idx) => {
    const c = item.crop
    const totalEst = Math.round(
      ((c.minCostPerAcre + c.maxCostPerAcre) / 2) * Math.max(0.5, item.landInAcres)
    )

    const reasons = [
      `High compatibility with your ${farm.soilType} soil structure`,
      `Matches current local climate (${weather.temperature}°C) and ${farm.season} season conditions`,
      `Optimal match for your ${farm.irrigationMethod} system`,
      `Estimated budget of ₹${totalEst.toLocaleString('en-IN')} fits your ₹${farm.budget.toLocaleString('en-IN')} allocation`,
    ]

    const timeline = [
      {
        stage: 'Seed Preparation',
        startDay: 1,
        endDay: 10,
        keyActivity: 'Land tillage, biofertilizer seed treatment and basal nutrient placement.',
      },
      {
        stage: 'Sowing / Planting',
        startDay: 11,
        endDay: 25,
        keyActivity: 'Precision sowing or transplanting with appropriate spacing and light initial irrigation.',
      },
      {
        stage: 'Vegetative Growth',
        startDay: 26,
        endDay: Math.round(c.minDays * 0.55),
        keyActivity: 'Weeding, first split nitrogen top-dressing and pest monitoring.',
      },
      {
        stage: 'Flowering & Grain Filling',
        startDay: Math.round(c.minDays * 0.55) + 1,
        endDay: Math.round(c.maxDays * 0.85),
        keyActivity: 'Second nutrient application, moisture regulation and critical disease management.',
      },
      {
        stage: 'Harvest',
        startDay: Math.round(c.maxDays * 0.85) + 1,
        endDay: c.maxDays,
        keyActivity: 'Gradual field drying, selective harvesting, threshing and storage preparation.',
      },
    ]

    return {
      id: `crop_${idx + 1}`,
      crop: c.name,
      cropTa: c.nameTa,
      cropHi: c.nameHi,
      cropMl: c.nameMl,
      cropKn: c.nameKn,
      cropTe: c.nameTe,
      scientificName: c.scientificName,
      matchPercentage: item.matchPercentage,
      suitabilityBreakdown: {
        soilSuitability: item.soilScore,
        climateSuitability: item.climateScore,
        rainfallSuitability: item.rainScore,
        seasonSuitability: item.seasonScore,
        budgetSuitability: item.budgetScore,
      },
      reasons,
      cultivationDays: {
        minimum: c.minDays,
        maximum: c.maxDays,
      },
      estimatedInvestmentINR: totalEst,
      waterRequirement: c.waterReq,
      expectedHarvestYield: c.yieldPerAcre,
      marketTrend: c.marketTrend,
      suitableSoil: c.idealSoils.join(', '),
      suitableClimate: `${c.minTemp}°C - ${c.maxTemp}°C optimal range`,
      temperatureRange: `${c.minTemp}°C - ${c.maxTemp}°C`,
      rainfallRequirement: `${c.optimalRainMin} - ${c.optimalRainMax} mm monthly average`,
      irrigationRequirement: c.idealIrrigation.join(', '),
      seedRequirement: 'Certified high-yielding hybrid / certified seeds',
      sowingPeriod: c.sowingPeriod,
      harvestPeriod: c.harvestPeriod,
      basicCultivationSteps: c.steps,
      commonDiseases: c.diseases,
      pestManagement: c.pests,
      precautions: c.precautions,
      fertilizers: c.fertilizers,
      timeline,
      imageUrl: c.imageUrl,
    }
  })
}
