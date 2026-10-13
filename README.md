# 🌾 FarmGenius – AI-Powered Farming Solution

> **An intelligent, farmer-centric agricultural technology web application designed to recommend the most optimal crops using AI, soil properties, live weather telemetry, irrigation infrastructure, seasonal calendars, and 3-year commodity market trends.**

---

## 1. Project Overview

**FarmGenius** is an advanced Agricultural Technology (AgTech) platform built to bridge the gap between artificial intelligence and on-the-ground farming decisions. Designed specifically for Indian farming contexts, FarmGenius empowers cultivators to:
- Select their preferred language (**English**, natural farmer-friendly **Tamil [தமிழ்]**, **Hindi [हिन्दी]**, **Malayalam [മലയാളം]**, **Kannada [ಕನ್ನಡ]**, and **Telugu [తెలుగు]**).
- Authenticate securely via **Firebase Authentication** or evaluate instantly using the built-in zero-config **Guest Farmer Demo Mode**.
- Acquire live farm meteorological parameters via the **Browser Geolocation API** or manual administrative district selection.
- Input farm characteristics (Soil type with custom options, Irrigation method, Land area in Acres/Hectares/Cents, Kharif/Rabi/Zaid seasons, and Budget allocation in ₹ INR).
- Receive **Top 3 Recommended Crops** computed by **Google Gemini AI** and scientific agronomic suitability matrices.
- Inspect detailed **Fertilizer & Nutrient Schedules** (Basal application, Top dressing splits, Micronutrients, and Bio-fertilizers).
- Visualize a complete **Cultivation Growth Timeline** (Sowing → Vegetative → Flowering → Harvest).
- Analyze **3-Year Commodity Market Price Charts** with Agmarknet benchmarks, historical volatility, and economic forecasting.
- Archive farming plans securely in **Firebase Firestore** for retrospective review.

---

## 2. Key Features

- **Split-Screen Authentication Page**:
  - High-resolution agricultural landscape imagery with a soft emerald gradient overlay.
  - Email/Password sign-in, account creation, and password reset with Firebase Authentication.
  - Instant One-Click **Guest Farmer Demo** access.
  - Client-side and server-side validation with informative farmer-friendly error banners.

- **Full Trilingual Localization (i18n)**:
  - English, natural farmer-friendly Tamil (தமிழ்), and Hindi (हिन्दी).
  - Dynamically updates the entire application interface: form controls, weather metrics, crop names, fertilizer regimens, and safety disclaimers.
  - Persists preference in `localStorage` and user Firestore documents.

- **Dual-Mode Location & Weather Intelligence**:
  - Direct GPS detection via HTML5 Geolocation API with reverse geocoding to village/district.
  - Graceful fallback to manual location input (Village, District, State, Country) if location permission is denied.
  - Live temperature, humidity, rainfall (mm), wind speed (km/h), condition, and precipitation probability.
  - Automated **Farming Weather Suitability Index** (*Excellent*, *Good*, *Moderate*, *Poor*).
  - Explicit provenance badges (*Current Location [GPS]* vs *Manually Selected Location*).

- **Multi-Section Farm Parameter Configuration**:
  - **Soil Type**: Sandy, Clay, Loamy, Black, Red, Alluvial, Laterite, and "Other" with dynamic text input.
  - **Irrigation**: Rainfed, Drip, Sprinkler, Canal, Borewell, Open Well, Flood Irrigation, and Other.
  - **Land Area**: Numeric entry with Acres, Hectares, or Cents units.
  - **Season**: Kharif, Rabi, Zaid, or Custom month range.
  - **Budget**: Total ₹ INR with optional cost breakdown (Seeds, Fertilizers, Irrigation, Labour, Other).
  - **Optional Parameters**: Previous crop, previous yield, organic farming preference, and farmer experience level.

- **AI Crop Recommendation Engine**:
  - Powered by **Google Gemini AI** (`gemini-2.5-flash`) with structured JSON schema enforcement.
  - Deterministic **Agronomic Expert Rule Engine** fallback ensuring 100% offline uptime and scientific validity even without API keys.
  - Returns exactly the **Top 3 Suitable Crops** with circular match percentage dials and 5-factor breakdown (Soil, Climate, Rainfall, Season, Budget).

- **In-Depth Crop Agronomic Modal**:
  - Botanical classification, seed rate, temperature window, sowing period, harvest period, and expected yield per acre.
  - Step-by-step cultivation practices, common fungal/bacterial diseases, pest thresholds, and preventative precautions.

- **Fertilizer & Nutrient Advisory**:
  - Basal application dosages (e.g., DAP, Potash, SSP) with NPK ratios.
  - Split-dose Top Dressing schedules (Urea, MOP) linked to physiological growth stages.
  - Micronutrient supplements (Zinc Sulphate, Borax, Gypsum) and organic bio-fertilizer alternatives.
  - Clear safety disclaimer emphasizing Soil Health Card testing.

- **Cultivation Timeline**:
  - Visual timeline broken down into key developmental stages (Seed Preparation → Sowing → Vegetative Growth → Flowering → Harvest) with day counts.

- **3-Year Commodity Market Price Analysis**:
  - Interactive financial commodity price line chart rendered via **Recharts**.
  - Historical modal mandi prices (₹/quintal) indexed from Agmarknet benchmarks.
  - Statistical insights: Average price, Minimum price, Maximum price, Latest price, Market trend (*Increasing*, *Stable*, *Decreasing*), and Year-over-Year (YoY) percentage change.
  - Clear distinction between *Verified Agmarknet Real Data* and *Historical Commodity Simulation Models*.

- **"Your Cropsy Farming Plan" Executive Summary**:
  - High-level decision document compiling the primary crop, alternative crops, cultivation period, budget allocation, and agricultural safety notices.
  - Built-in one-click browser report printing.

- **Knowledge Base & Archived History**:
  - "My Recommendations" tab to review previously generated farm advisory runs stored in Firestore.
  - "Farming Guide" tab featuring best practices for soil testing, drip maintenance, IPM pest traps, and links to Indian agricultural portals (*Soil Health Card*, *Agmarknet*, *e-NAM*).

---

## 3. Technologies Used

| Domain | Technology / Library |
| :--- | :--- |
| **Frontend Framework** | React 19 + TypeScript (Strict Type Safety) |
| **Build Tool & Bundler** | Vite 8 + `@tailwindcss/vite` |
| **Styling & Design System** | Tailwind CSS v4 + Plus Jakarta Sans typography |
| **Icons & Visuals** | Lucide React |
| **Data Visualization** | Recharts (Responsive Line Charts, Custom Tooltips, Reference Lines) |
| **Authentication** | Firebase Authentication (Email/Password + Offline Guest Provider) |
| **Database** | Firebase Firestore (Real-time NoSQL storage + LocalStorage offline sync) |
| **AI / LLM Engine** | Google Gemini API (`gemini-2.5-flash`) + Agronomic Expert Engine |
| **Meteorological APIs** | Open-Meteo Live API (Free global telemetry) + OpenWeatherMap |
| **Geocoding** | OpenStreetMap Nominatim API (Reverse & Forward Geocoding) |
| **Celebration FX** | Canvas Confetti |

---

## 4. Firebase Setup

CROPSY supports both production Firebase projects and seamless zero-config local simulation.

### Setting up Production Firebase:
1. Navigate to the [Firebase Console](https://console.firebase.google.com/) and create a new project (e.g. `cropsy-agtech`).
2. **Enable Authentication**:
   - In the sidebar, select **Authentication** > **Get Started**.
   - Under the **Sign-in method** tab, enable **Email/Password**.
3. **Enable Firestore Database**:
   - In the sidebar, select **Firestore Database** > **Create database**.
   - Start in **Production mode** (or Test mode during evaluation).
   - Recommended Firestore Security Rules:
     ```javascript
     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {
         match /users/{userId} {
           allow read, write: if request.auth != null && request.auth.uid == userId;
           match /recommendations/{recommendationId} {
             allow read, write: if request.auth != null && request.auth.uid == userId;
           }
         }
         match /farms/{userId} {
           allow read, write: if request.auth != null && request.auth.uid == userId;
         }
       }
     }
     ```
4. **Register Web App**:
   - Go to **Project Settings** > **General** > **Your apps** > click the **Web (</>)** icon.
   - Copy the `firebaseConfig` keys into your `.env` file (see Section 8).

---

## 5. Gemini API Setup

CROPSY utilizes Google's Gemini models for structured crop recommendation inference.

1. Obtain an API key from [Google AI Studio](https://aistudio.google.com/).
2. Click **Create API key** and copy your key.
3. Add the key to your `.env` file under `VITE_GEMINI_API_KEY`.
4. *Note*: If the key is left empty or quota is exhausted, CROPSY automatically routes queries through its built-in **Agronomic Rule Engine**, ensuring uninterrupted functionality.

---

## 6. Weather API Setup

1. **Open-Meteo (Default Live API)**:
   - Configured out of the box with **zero API keys required**.
   - Fetches live temperature, humidity, wind speed, precipitation, and rain probability globally.
2. **OpenWeatherMap (Optional)**:
   - Sign up at [OpenWeatherMap](https://openweathermap.org/api) and generate a free API key.
   - Place the key in `.env` as `VITE_OPENWEATHER_API_KEY`.

---

## 7. Market Price API Setup

- The market data service (`src/services/market.ts`) is designed in a **modular architecture**.
- It provides 36-month historical monthly series indexed against verified **Agmarknet modal prices** across key Indian agricultural mandis.
- To connect a custom or state Agmarknet API endpoint, simply update the `getCropMarketAnalysis` function in `src/services/market.ts`.
- The interface automatically marks commodities with a **Verified Agmarknet Benchmark** badge when data is authoritative, or a **Demo Commodity Model** badge if running in simulation.

---

## 8. Environment Variables

Create a file named `.env` in the root directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

# Google Gemini API
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Weather API (Optional: OpenWeatherMap; Open-Meteo works automatically)
VITE_OPENWEATHER_API_KEY=your_openweather_api_key_here
```

---

## 9. How to Run Locally

### Prerequisites
- [Node.js](https://nodejs.org/) v18.0 or newer
- `npm` v9.0 or newer

### Installation Steps
```bash
# 1. Clone or navigate to the repository
cd Cropsy

# 2. Install dependencies
npm install

# 3. Create your .env file
cp .env.example .env

# 4. Start the development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

> [!TIP]
> You can click **"Quick Guest Farmer Demo"** on the login screen to instantly explore the complete application without creating an account or providing Firebase credentials.

### Production Build & Linting
```bash
# Verify TypeScript types and generate production bundle in /dist
npm run build

# Preview production build locally
npm run preview
```

---

## 10. How to Deploy

### Option A: Deploy to Firebase Hosting
```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize hosting
firebase init hosting
# - Public directory: dist
# - Configure as single-page app: Yes
# - Set up automatic builds: No

# Build and deploy
npm run build
firebase deploy --only hosting
```

### Option B: Deploy to Vercel
1. Push your repository to GitHub / GitLab.
2. Import the repository in [Vercel](https://vercel.com).
3. Set the Framework Preset to **Vite**.
4. Configure your Environment Variables (`VITE_FIREBASE_API_KEY`, `VITE_GEMINI_API_KEY`, etc.).
5. Click **Deploy**.

### Option C: Deploy to Netlify
1. Create a `_redirects` file in `public/` containing:
   ```
   /*    /index.html   200
   ```
2. Link repository in Netlify with build command `npm run build` and publish directory `dist`.

---

## 🌾 Agricultural Advisory & Safety Notice
*Recommendations provided by CROPSY are AI-assisted and intended for informational and advisory guidance. Agricultural outcomes depend heavily on local micro-climates, soil biological activity, seed provenance, and pest dynamics. Farmers are strongly encouraged to confirm fertilizer dosages with their state Soil Health Card laboratory and consult local agricultural extension officers (KVK / Krishi Vigyan Kendra).*
"# Cropsy"  
