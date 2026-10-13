// Farming Guide & Agronomic Knowledge Base Component
import React from 'react'
import {
  BookOpen,
  Sprout,
  Droplets,
  ShieldCheck,
  Leaf,
  Bug,
  HelpCircle,
  ExternalLink,
} from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export const FarmingGuideView: React.FC = () => {
  const { t, language } = useLanguage()

  const guides = [
    {
      title: language === 'ta' ? 'மண் பரிசோதனை வழிகாட்டி' : language === 'hi' ? 'मृदा स्वास्थ्य परीक्षण गाइड' : 'Soil Health & Testing Protocols',
      category: 'Soil Management',
      icon: Sprout,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      description:
        language === 'ta'
          ? 'மண் மாதிரி எடுக்கும் போது நிலத்தின் 5 இடங்களில் ஆங்கில ‘V’ வடிவத்தில் 15 செ.மீ ஆழத்தில் மண் சேகரித்து நிழலில் உலர்த்தி பரிசோதனைக்கு அனுப்பவும்.'
          : language === 'hi'
          ? 'खेत में 5 विभिन्न स्थानों से 15 सेमी गहराई पर V-आकार में मिट्टी का नमूना लें। छांव में सुखाकर निकटतम कृषि विज्ञान केंद्र (KVK) भेजें।'
          : 'Collect composite soil samples from 5 zig-zag points across the field at 15 cm plow depth. Air-dry in shade and test for pH, EC, Organic Carbon, and NPK.',
      tips: [
        'Test soil every 2-3 years prior to Kharif sowing',
        'Maintain soil pH between 6.5 and 7.5 for optimal micronutrient uptake',
        'Incorporate 5 tonnes of organic compost per acre annually to sustain microbiology',
      ],
    },
    {
      title: language === 'ta' ? 'நுண்ணீர் பாசன மேலாண்மை' : language === 'hi' ? 'सूक्ष्म सिंचाई प्रबंधन' : 'Micro-Irrigation & Water Conservation',
      category: 'Water Management',
      icon: Droplets,
      color: 'bg-blue-50 text-blue-800 border-blue-200',
      description:
        language === 'ta'
          ? 'சொட்டு நீர் மற்றும் தெளிப்பு நீர் பாசனம் மூலம் 40-50% நீர் சேமிப்பு மற்றும் 25-30% கூடுதல் மகசூல் பெறலாம். உரங்களை நீருடன் சேர்த்து (Fertigation) அளிக்கவும்.'
          : language === 'hi'
          ? 'ड्रिप एवं स्प्रिंकलर सिंचाई से 40-50% पानी की बचत और 25-30% अधिक पैदावार होती है। घुलनशील खादों को ड्रिप द्वारा दें।'
          : 'Drip and sprinkler irrigation conserve 40-50% water while boosting yield by 25-30%. Adopt fertigation using 100% water-soluble fertilizers for direct root uptake.',
      tips: [
        'Run drip lines for 1.5 - 2 hours in early mornings to minimize evaporation',
        'Acid wash drip drippers twice per season with 0.5% nitric acid to prevent calcium clogging',
        'Use plastic mulch to retain 60% higher soil moisture',
      ],
    },
    {
      title: language === 'ta' ? 'ஒருங்கிணைந்த பூச்சி கட்டுப்பாடு' : language === 'hi' ? 'एकीकृत कीट प्रबंधन (IPM)' : 'Integrated Pest Management (IPM)',
      category: 'Crop Protection',
      icon: Bug,
      color: 'bg-amber-50 text-amber-900 border-amber-200',
      description:
        language === 'ta'
          ? 'பூச்சிக்கொல்லிகளை உடனடியாக தெளிக்காமல் மஞ்சள் ஒட்டுப்பொறிகள், இனக்கவர்ச்சி பொறிகள் மற்றும் வேப்பெண்ணெய் கரைசல் மூலம் ஆரம்ப நிலையிலேயே கட்டுப்படுத்தவும்.'
          : language === 'hi'
          ? 'अंधाधुंध रासायनिक कीटनाशक न छिड़कें। फेरोमोन ट्रैप, पीले चिपचिपे कार्ड और नीम के तेल (5ml/L) से शुरुआत करें।'
          : 'Monitor pest thresholds using pheromone traps (5 traps/acre) and yellow sticky sheets. Prioritize botanical sprays (5% NSKE / Neem Oil) before synthetic molecules.',
      tips: [
        'Install yellow sticky traps against whiteflies, aphids, and thrips',
        'Conserve natural predators such as ladybird beetles and spiders',
        'Rotate chemical insecticide modes of action (IRAC groups) to prevent resistance',
      ],
    },
    {
      title: language === 'ta' ? 'இயற்கை உரம் & மண்புழு உரம்' : language === 'hi' ? 'जैविक खाद एवं केंचुआ खाद' : 'Organic Manures & Bio-Fertilizers',
      category: 'Nutrient Management',
      icon: Leaf,
      color: 'bg-lime-50 text-lime-900 border-lime-200',
      description:
        language === 'ta'
          ? 'மண்புழு உரம், பஞ்சகாவ்யா மற்றும் அசோஸ்பைரில்லம் பயன்பாடு மண்ணின் வளத்தை கூட்டி பயிர்களின் நோய் எதிர்ப்பு சக்தியை அதிகரிக்கிறது.'
          : language === 'hi'
          ? 'वर्मीकम्पोस्ट, जीवामृत और राइजोबियम/अजोटोबैक्टर बायोफर्टिलाइजर से मिट्टी में पोषक तत्वों की उपलब्धता बढ़ती है।'
          : 'Vermicompost, Jeevamrutha, and microbial inoculants (Azospirillum, PSB) foster beneficial mycorrhizae and solubilize bound soil phosphorus.',
      tips: [
        'Inoculate legume seeds with Rhizobium culture (20g/kg seed)',
        'Foliar spray 3% Panchagavya during early tillering and flowering',
        'Grow sunnhemp or sesbania green manure crops and incorporate at 45 days',
      ],
    },
  ]

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-6">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-emerald-600" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-950">
            {t('navFarmingGuide')}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Scientific agronomy practices, soil care guidelines, and water management knowledge for farmers.
        </p>
      </div>

      {/* Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {guides.map((item, idx) => {
          const Icon = item.icon
          return (
            <div
              key={idx}
              className="rounded-3xl bg-white p-6 sm:p-7 shadow-sm border border-gray-100 hover:border-emerald-200 hover:shadow-md transition space-y-4"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider border ${item.color}`}
                >
                  {item.category}
                </span>
                <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-black text-emerald-950 mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1.5 text-xs">
                <span className="font-bold text-gray-700 block text-[11px] uppercase tracking-wider">
                  Key Recommendations:
                </span>
                {item.tips.map((tip, i) => (
                  <p key={i} className="text-gray-600 flex items-start space-x-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{tip}</span>
                  </p>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Government AgTech Initiatives */}
      <div className="rounded-3xl bg-emerald-900 text-white p-6 sm:p-8 space-y-4 shadow-xl">
        <h4 className="text-lg font-black text-white">
          Indian Agricultural Support Portals
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <a
            href="https://soilhealth.dac.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 transition border border-white/10 flex items-center justify-between"
          >
            <div>
              <p className="font-bold text-white">Soil Health Card</p>
              <p className="text-[11px] text-emerald-200">Govt. of India Portal</p>
            </div>
            <ExternalLink className="h-4 w-4 text-emerald-300" />
          </a>

          <a
            href="https://agmarknet.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 transition border border-white/10 flex items-center justify-between"
          >
            <div>
              <p className="font-bold text-white">Agmarknet</p>
              <p className="text-[11px] text-emerald-200">Daily Mandi Prices</p>
            </div>
            <ExternalLink className="h-4 w-4 text-emerald-300" />
          </a>

          <a
            href="https://enam.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 transition border border-white/10 flex items-center justify-between"
          >
            <div>
              <p className="font-bold text-white">e-NAM Portal</p>
              <p className="text-[11px] text-emerald-200">National Agri Market</p>
            </div>
            <ExternalLink className="h-4 w-4 text-emerald-300" />
          </a>
        </div>
      </div>
    </div>
  )
}
