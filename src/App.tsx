/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  Compass,
  ShieldCheck,
  Building2,
  Car,
  Hotel,
  Plane,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  User,
  Globe,
  MapPin,
  FileText,
  Lock,
  Calendar,
  Sparkles,
  ChevronRight,
  ExternalLink,
  LogOut,
  Info,
  SlidersHorizontal,
  Bookmark,
  Award,
  QrCode,
  Download,
  Eye,
  X,
  WifiOff,
  Copy
} from 'lucide-react';

type Screen = 'login' | 'tourist-type' | 'foreign-verification' | 'verification-pending' | 'dashboard';
type TouristType = 'domestic' | 'international' | null;

interface VerificationData {
  fullName: string;
  nationality: string;
  passportNumber: string;
  visaDetails: string;
}

interface HeritageDestination {
  id: string;
  name: string;
  region: string;
  category: 'Fort' | 'Monument' | 'Caves';
  builtYear: string;
  foreignFootfall: string;
  description: string;
  entryFee: string;
  audioGuideAvailable: boolean;
}

const HERITAGE_DESTINATIONS: HeritageDestination[] = [
  {
    id: 'sinhagad-fort',
    name: 'Sinhagad Fort',
    region: 'Pune, Maharashtra',
    category: 'Fort',
    builtYear: 'Circa 14th Century',
    foreignFootfall: '500+ visited this month',
    description: 'An iconic 17th-century hill fortress perched in the Sahyadri mountains, renowned for the historic Battle of Sinhagad in 1670.',
    entryFee: '₹50 (Standard) / ₹250 (Foreign Nationals)',
    audioGuideAvailable: true,
  },
  {
    id: 'raigad-fort',
    name: 'Raigad Fort',
    region: 'Raigad District, Maharashtra',
    category: 'Fort',
    builtYear: 'Coronation Citadel 1674',
    foreignFootfall: '500+ visited this month',
    description: 'The sovereign hill citadel and historic capital of the Maratha Empire under Chhatrapati Shivaji Maharaj, accessible by scenic steps and ropeway.',
    entryFee: '₹25 (Standard) / ₹300 (Foreign Nationals)',
    audioGuideAvailable: true,
  },
  {
    id: 'ajanta-ellora',
    name: 'Ajanta & Ellora Caves',
    region: 'Chhatrapati Sambhajinagar, Maharashtra',
    category: 'Caves',
    builtYear: '2nd Century BCE - 10th Century CE',
    foreignFootfall: '500+ visited this month',
    description: 'Ancient rock-cut cave monuments and monastic complexes featuring exquisite masterwork Buddhist, Hindu, and Jain frescoes and monolithic sculptures.',
    entryFee: '₹40 (Domestic) / ₹600 (Foreign Nationals)',
    audioGuideAvailable: true,
  },
];

export default function App() {
  // Screen routing state
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [touristType, setTouristType] = useState<TouristType>(null);

  // Login credentials state
  const [email, setEmail] = useState('demo@atithi.com');
  const [password, setPassword] = useState('password123');
  const [loginError, setLoginError] = useState('');

  // Foreign verification form state
  const [verificationForm, setVerificationForm] = useState<VerificationData>({
    fullName: 'Alexander J. Vance',
    nationality: 'United States of America',
    passportNumber: 'P8920415A',
    visaDetails: 'Tourist Visa (e-TV #IND-778942) - Valid through 2027',
  });
  const [isVerified, setIsVerified] = useState(false);
  const [pendingVerified, setPendingVerified] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Generate real, offline scannable QR code when passport is verified
  useEffect(() => {
    if (isVerified && touristType === 'international') {
      const passPayload = JSON.stringify(
        {
          portal: 'ATITHI_GOVT_TOURISM_GATEWAY',
          clearanceId: `ATT-FRRO-${verificationForm.passportNumber.slice(-4)}-2026`,
          holder: verificationForm.fullName,
          nationality: verificationForm.nationality,
          passport: verificationForm.passportNumber,
          visa: verificationForm.visaDetails,
          status: 'VERIFIED_ACTIVE',
          gateClearance: 'UNRESTRICTED_ASI_HERITAGE_ENTRY',
          validUntil: '31-DEC-2026',
          offlineVerified: true,
        },
        null,
        2
      );

      QRCode.toDataURL(passPayload, {
        errorCorrectionLevel: 'M',
        margin: 1,
        width: 280,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      })
        .then((url) => setQrCodeUrl(url))
        .catch((err) => console.error('Error generating offline QR:', err));
    }
  }, [isVerified, touristType, verificationForm]);

  // Dashboard Section 1: Trip Planner state (100% Offline, no external AI/network API)
  const [plannerQuery, setPlannerQuery] = useState('');
  const [plannerPlan, setPlannerPlan] = useState<string | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  // Offline Smart Itinerary Generator (Client-Side Only, Zero Network Latency)
  const generateOfflineItinerary = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes('sinhagad') || q.includes('pune')) {
      return `[OFFLINE ITINERARY: Pune & Sinhagad Heritage Circuit]
• 08:30 AM: Depart central Pune via authorized tourist transport.
• 09:45 AM: Ascent to Sinhagad Fort via Kalyan Darwaja with historical trail map.
• 11:30 AM: Exploration of Tanaji Malusare Memorial & historic ammunition depot.
• 01:00 PM: Authentic summit dining: Pithla Bhakri, Thecha & earthenware Matka Dahi.
• 03:00 PM: Scenic Sahyadri valley photography from Pune Darwaja ridge.
• Fast-Track: Show Atithi Verified International QR at the gate for zero-queue entry.`;
    }
    if (q.includes('raigad')) {
      return `[OFFLINE ITINERARY: Raigad Royal Maratha Citadel]
• 07:00 AM: Scenic highway transit through Western Ghats passes to Pachad village.
• 09:30 AM: Aerial ropeway ascent directly to Raigad Citadel (altitude 2,700 ft).
• 10:30 AM: Comprehensive tour of Raj Bhavan, Nagarkhana & Takmak Tok panoramic cliff.
• 01:30 PM: Authentic heritage lunch at MTDC Tourist Lodge terrace.
• 03:30 PM: Chhatrapati Shivaji Maharaj Samadhi reverence & royal queen chambers.
• Fast-Track: Atithi Verified QR pass provides immediate consular gate clearance.`;
    }
    if (q.includes('caves') || q.includes('ajanta') || q.includes('ellora')) {
      return `[OFFLINE ITINERARY: UNESCO Ajanta & Ellora Monuments]
• Day 1: Ellora Caves Complex (Kailash Temple monolithic rock excavation Cave 16).
• Day 2: Ajanta World Heritage Frescoes & Buddhist Chaityas (Caves 1, 2, 19, 26).
• Logistics: Pre-screened air-conditioned heritage cab reserved with bilingual guide.
• Fast-Track: Present Atithi Verified QR pass for foreign tourist fast-lane entry.`;
    }
    return `[OFFLINE ITINERARY: ${query || 'Maharashtra Historical Discovery Circuit'}]
• Morning: Heritage exploration of premier hill citadels with licensed ASI guide.
• Afternoon: Regional architectural monuments, state archives & traditional artisan markets.
• Evening: Scenic sunset vantage point and regional culinary tasting.
• Fast-Track: Pre-verified Atithi QR code accepted across all 120+ ASI heritage checkpoints.`;
  };

  // Dashboard Section 2: Quick Booking modal / feedback state
  const [activeBooking, setActiveBooking] = useState<string | null>(null);

  // Dashboard Section 3 & 4: Heritage search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [savedForts, setSavedForts] = useState<Record<string, boolean>>({});

  // Handlers
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setLoginError('Please enter both email and password.');
      return;
    }
    setLoginError('');
    setCurrentScreen('tourist-type');
  };

  const handleSelectDomestic = () => {
    setTouristType('domestic');
    setIsVerified(true);
    setCurrentScreen('dashboard');
  };

  const handleSelectInternational = () => {
    setTouristType('international');
    setCurrentScreen('foreign-verification');
  };

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentScreen('verification-pending');
  };

  const handleDevBypass = () => {
    setIsVerified(true);
    setPendingVerified(true);
  };

  const handlePlanTrip = (e: React.FormEvent) => {
    e.preventDefault();
    const query = plannerQuery.trim() || 'Sinhagad Fort & Historical Western Ghats Circuit';
    setIsGeneratingPlan(true);
    // 100% offline instant generation - zero external AI / API dependencies
    setTimeout(() => {
      const plan = generateOfflineItinerary(query);
      setPlannerPlan(plan);
      setIsGeneratingPlan(false);
    }, 200);
  };

  const handleToggleSaveFort = (id: string) => {
    setSavedForts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filtered heritage destinations
  const filteredDestinations = useMemo(() => {
    return HERITAGE_DESTINATIONS.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.region.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-slate-800 selection:text-white">
      {/* Universal Top Header */}
      <header id="global-header" className="bg-[#0f172a] text-white border-b border-slate-800 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-slate-800 border border-slate-700 flex items-center justify-center rounded-lg text-slate-100">
              <Compass className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight uppercase text-white">Atithi</span>
                <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  Tourism Portal
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">National Tourism & Heritage Gateway</p>
            </div>
          </div>

          {/* Navigation State Info */}
          <div className="flex items-center gap-3">
            {currentScreen !== 'login' && (
              <div className="hidden md:flex items-center gap-2 text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-md border border-slate-700">
                <span className="text-slate-400">Status:</span>
                {touristType === 'domestic' && (
                  <span className="font-medium text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Domestic Profile
                  </span>
                )}
                {touristType === 'international' && (
                  <span className={`font-medium flex items-center gap-1 ${isVerified ? 'text-emerald-400' : 'text-amber-400'}`}>
                    <Globe className="w-3.5 h-3.5" />
                    International {isVerified ? '(Verified)' : '(Pending)'}
                  </span>
                )}
                {!touristType && <span className="font-medium text-slate-300">Profile Selection</span>}
              </div>
            )}

            {currentScreen !== 'login' && (
              <button
                id="header-signout-button"
                onClick={() => {
                  setCurrentScreen('login');
                  setTouristType(null);
                  setIsVerified(false);
                }}
                className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-md border border-slate-700 transition-colors"
                title="Return to Login"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Exit Portal</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* ========================================================================= */}
        {/* SCREEN 1: LOGIN                                                          */}
        {/* ========================================================================= */}
        {currentScreen === 'login' && (
          <div id="screen-login" className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-md">
              {/* Corporate Card */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
                <div className="text-center mb-8">
                  <div className="w-12 h-12 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center mx-auto mb-3 text-slate-800">
                    <Building2 className="w-6 h-6 text-slate-700" />
                  </div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Atithi Portal Login</h1>
                  <p className="text-sm text-slate-500 mt-1">Official access for travelers, tourists & verified visitors</p>
                </div>

                {loginError && (
                  <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <Info className="w-4 h-4 shrink-0 text-red-500" />
                    <span>{loginError}</span>
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="login-email-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        id="login-email-input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:bg-white transition"
                        placeholder="name@domain.com"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="login-password-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                        Password
                      </label>
                      <span className="text-xs text-slate-400">Default: password123</span>
                    </div>
                    <div className="relative">
                      <input
                        id="login-password-input"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:bg-white transition"
                        placeholder="••••••••••••"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2.5">
                    <Lock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Pre-filled with demonstrator credentials <strong className="text-slate-800 font-semibold">demo@atithi.com</strong>. Click Sign In to begin.
                    </p>
                  </div>

                  <button
                    id="login-submit-button"
                    type="submit"
                    className="w-full bg-[#0f172a] hover:bg-slate-800 active:bg-slate-900 text-white font-medium text-sm py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition shadow-sm cursor-pointer"
                  >
                    <span>Sign In to Atithi</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>SSL 256-Bit Protection</span>
                  <span>Ministry Compliance</span>
                </div>
              </div>

              <div className="mt-4 text-center text-xs text-slate-500">
                Authorized prototype deployment for tourism verification and management.
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 2: TOURIST TYPE SELECTION                                         */}
        {/* ========================================================================= */}
        {currentScreen === 'tourist-type' && (
          <div id="screen-tourist-type" className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-12 flex flex-col justify-center">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 bg-slate-200/80 px-2.5 py-1 rounded">
                Step 1 of 2
              </span>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight mt-3">Select Your Profile</h1>
              <p className="text-slate-600 text-sm mt-2">
                Choose your visitor category to streamline heritage passes, booking permissions, and statutory verification requirements.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Option 1: Domestic Tourist */}
              <div
                id="domestic-tourist-card"
                onClick={handleSelectDomestic}
                className="group bg-white rounded-xl border-2 border-slate-200 hover:border-slate-800 p-8 cursor-pointer transition-all duration-150 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 group-hover:bg-[#0f172a] group-hover:text-white transition-colors">
                      <User className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      Direct Access
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-[#0f172a]">
                    Domestic Tourist
                  </h2>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    For Indian citizens and domestic travelers. Instantly access the Atithi.ai Trip Planner, direct transport and hotel bookings, and standard ASI heritage reservations without additional document uploads.
                  </p>

                  <ul className="space-y-2 text-xs text-slate-500 mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Zero document review waiting period</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Domestic fare tier on monuments & forts</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Instant dashboard access</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-sm font-semibold text-[#0f172a]">
                  <span>Continue to Dashboard</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Option 2: International Tourist */}
              <div
                id="international-tourist-card"
                onClick={handleSelectInternational}
                className="group bg-white rounded-xl border-2 border-slate-200 hover:border-slate-800 p-8 cursor-pointer transition-all duration-150 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 group-hover:bg-[#0f172a] group-hover:text-white transition-colors">
                      <Globe className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-full">
                      Verification Flow
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-[#0f172a]">
                    International Tourist
                  </h2>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    For foreign visitors and overseas travelers. Complete standardized passport and visa verification to access international concierge services, multilingual guides, and foreign footfall clearance.
                  </p>

                  <ul className="space-y-2 text-xs text-slate-500 mb-6">
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-sky-600" />
                      <span>Passport & e-Visa authentication</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-sky-600" />
                      <span>FRRO-compliant priority heritage clearance</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-sky-600" />
                      <span>Certified bilingual audio guides included</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-sm font-semibold text-[#0f172a]">
                  <span>Proceed to Verification</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                id="back-to-login-btn"
                onClick={() => setCurrentScreen('login')}
                className="text-xs text-slate-500 hover:text-slate-800 underline underline-offset-4"
              >
                Return to Login screen
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 3: FOREIGN VERIFICATION FORM                                      */}
        {/* ========================================================================= */}
        {currentScreen === 'foreign-verification' && (
          <div id="screen-foreign-verification" className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-10">
            <div className="mb-6">
              <button
                id="verification-back-btn"
                onClick={() => setCurrentScreen('tourist-type')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 mb-3"
              >
                ← Back to Profile Selection
              </button>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Foreign Visitor Verification</h1>
              <p className="text-sm text-slate-600 mt-1">
                Please provide your travel and identity credentials as recorded in your official entry documents.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
              <form onSubmit={handleVerificationSubmit} className="space-y-5">
                {/* Full Name */}
                <div>
                  <label htmlFor="verify-fullname-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Full Name (As per Passport)
                  </label>
                  <input
                    id="verify-fullname-input"
                    type="text"
                    required
                    value={verificationForm.fullName}
                    onChange={(e) =>
                      setVerificationForm({ ...verificationForm, fullName: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:bg-white transition"
                    placeholder="e.g. Johnathan Henry Miller"
                  />
                </div>

                {/* Nationality */}
                <div>
                  <label htmlFor="verify-nationality-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Nationality / Country of Citizenship
                  </label>
                  <input
                    id="verify-nationality-input"
                    type="text"
                    required
                    value={verificationForm.nationality}
                    onChange={(e) =>
                      setVerificationForm({ ...verificationForm, nationality: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:bg-white transition"
                    placeholder="e.g. United Kingdom, Germany, Japan"
                  />
                </div>

                {/* Passport Number */}
                <div>
                  <label htmlFor="verify-passport-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Passport Number
                  </label>
                  <input
                    id="verify-passport-input"
                    type="text"
                    required
                    value={verificationForm.passportNumber}
                    onChange={(e) =>
                      setVerificationForm({ ...verificationForm, passportNumber: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 font-mono placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:bg-white transition"
                    placeholder="e.g. P12345678"
                  />
                </div>

                {/* Visa Details */}
                <div>
                  <label htmlFor="verify-visa-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Visa Details
                  </label>
                  <textarea
                    id="verify-visa-input"
                    required
                    rows={3}
                    value={verificationForm.visaDetails}
                    onChange={(e) =>
                      setVerificationForm({ ...verificationForm, visaDetails: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:bg-white transition"
                    placeholder="e.g. Tourist Visa (e-TV #IND-892301) valid for 30 days entry"
                  />
                </div>

                {/* Security Advisory notice */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-600 leading-relaxed">
                    <p className="font-semibold text-slate-800 mb-0.5">Government Data Privacy Notice</p>
                    Your passport credentials will be validated against the national tourism clearance authority. Data is processed strictly for monument safety and visitor authentication.
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    id="submit-documents-btn"
                    type="submit"
                    className="w-full bg-[#0f172a] hover:bg-slate-800 active:bg-slate-900 text-white font-medium text-sm py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition shadow-sm cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Submit Documents</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 4: VERIFICATION PENDING & GENERATED QR PASS                       */}
        {/* ========================================================================= */}
        {currentScreen === 'verification-pending' && (
          <div id="screen-verification-pending" className="flex-1 max-w-xl mx-auto w-full px-4 sm:px-6 py-12 flex flex-col justify-center">
            {!pendingVerified ? (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
                <div className="w-16 h-16 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center mx-auto mb-5 text-amber-600">
                  <Clock className="w-8 h-8" />
                </div>

                <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 bg-amber-100/70 px-2.5 py-1 rounded">
                  Status: Pending Admin Review
                </span>

                <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-3 mb-3">
                  Review in Progress
                </h1>

                {/* Exact required text string */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg mb-6">
                  <p className="text-slate-700 font-medium text-sm leading-relaxed">
                    Your documents have been securely submitted and are under review by the admin.
                  </p>
                </div>

                {/* Submitted Details Snapshot */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-left mb-6 text-xs space-y-2">
                  <div className="text-[11px] font-semibold uppercase text-slate-400 border-b border-slate-200 pb-1 mb-2">
                    Submitted Reference: #ATT-2026-8812
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Applicant:</span>
                    <span className="font-semibold text-slate-800">{verificationForm.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Nationality:</span>
                    <span className="font-semibold text-slate-800">{verificationForm.nationality}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Passport Number:</span>
                    <span className="font-mono font-semibold text-slate-800">{verificationForm.passportNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Estimated SLA:</span>
                    <span className="text-slate-700">12–24 business hours</span>
                  </div>
                </div>

                {/* DEV BYPASS BUTTON (Explicitly required) */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold mb-2">
                    Developer Prototype Control
                  </div>
                  <button
                    id="dev-bypass-verify-btn"
                    onClick={handleDevBypass}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition shadow-sm cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>DEV BYPASS: Mark as Verified</span>
                  </button>
                  <p className="text-xs text-slate-400 mt-2">
                    Instantly skips administrative review queue, generates the offline digital QR pass, and unlocks verified access.
                  </p>
                </div>
              </div>
            ) : (
              /* Screen 4 Verified State with Generated QR */
              <div id="verified-qr-pass-screen" className="bg-white rounded-xl border-2 border-emerald-500 shadow-sm p-8 text-center">
                <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                  Passport Authenticated • Clearance Issued
                </span>

                <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-3 mb-1">
                  Digital Tourist QR Pass
                </h1>
                <p className="text-xs text-slate-500 mb-6">
                  Official clearance QR code generated locally (100% offline, zero server dependence).
                </p>

                {/* Generated QR Box */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6 flex flex-col items-center">
                  <div className="bg-white p-3 rounded-lg border-2 border-slate-800 shadow-xs mb-3">
                    {qrCodeUrl ? (
                      <img
                        id="generated-passport-qr-image"
                        src={qrCodeUrl}
                        alt="Verified Passport QR Pass"
                        className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
                      />
                    ) : (
                      <div className="w-48 h-48 flex items-center justify-center text-xs text-slate-400">
                        Generating QR Code...
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-mono mb-2">
                    <QrCode className="w-3.5 h-3.5 text-slate-700" />
                    <span>ID: ATT-FRRO-{verificationForm.passportNumber.slice(-4)}-2026</span>
                  </div>

                  <div className="w-full bg-white border border-slate-200 rounded-lg p-3 text-left text-xs space-y-1.5 mt-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tourist Name:</span>
                      <span className="font-semibold text-slate-900">{verificationForm.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Nationality:</span>
                      <span className="font-semibold text-slate-900">{verificationForm.nationality}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Passport Number:</span>
                      <span className="font-mono font-semibold text-slate-900">{verificationForm.passportNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Gate Status:</span>
                      <span className="font-bold text-emerald-700">UNRESTRICTED ASI ACCESS</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    id="goto-dashboard-verified-btn"
                    onClick={() => setCurrentScreen('dashboard')}
                    className="w-full bg-[#0f172a] hover:bg-slate-800 text-white font-semibold text-sm py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition shadow-sm cursor-pointer"
                  >
                    <span>Proceed to Main Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (qrCodeUrl) {
                        const link = document.createElement('a');
                        link.href = qrCodeUrl;
                        link.download = `atithi-verified-pass-${verificationForm.passportNumber}.png`;
                        link.click();
                      }
                    }}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download QR Pass Image</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 5: MAIN DASHBOARD                                                 */}
        {/* ========================================================================= */}
        {currentScreen === 'dashboard' && (
          <div id="screen-dashboard" className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Header: Welcome to Atithi */}
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome to Atithi</h1>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-700 flex items-center gap-1">
                    <WifiOff className="w-3 h-3" /> Offline Mode
                  </span>
                </div>
                <p className="text-sm text-slate-600 mt-1">
                  Centralized destination intelligence, automated trip planning, and state heritage discovery.
                </p>
              </div>

              <div className="flex items-center flex-wrap gap-2.5">
                {touristType === 'international' && isVerified && (
                  <button
                    id="header-view-qr-btn"
                    onClick={() => setQrModalOpen(true)}
                    className="flex items-center gap-1.5 text-xs bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-3 py-2 rounded-lg transition shadow-xs cursor-pointer"
                    title="View Verified Tourist QR Pass"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>View QR Pass</span>
                  </button>
                )}

                <div className="bg-white border border-slate-200 rounded-lg px-3.5 py-2 flex items-center gap-2 text-xs shadow-xs">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-slate-500 font-medium">Profile:</span>
                  <span className="font-semibold text-slate-800 uppercase tracking-wide">
                    {touristType === 'domestic' ? 'Domestic Tourist' : 'International Tourist'}
                  </span>
                  {isVerified && (
                    <span className="ml-1 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                      Verified
                    </span>
                  )}
                </div>

                <button
                  id="switch-profile-btn"
                  onClick={() => {
                    setCurrentScreen('tourist-type');
                    setPendingVerified(false);
                  }}
                  className="text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-200/80 hover:bg-slate-300 px-3 py-2 rounded-lg transition cursor-pointer"
                >
                  Switch Profile
                </button>
              </div>
            </div>

            {/* Prominent Verified International Pass & QR Code Card (Shows after passport is verified) */}
            {touristType === 'international' && isVerified && (
              <div id="dashboard-verified-qr-card" className="bg-white rounded-xl border-2 border-emerald-600 shadow-sm overflow-hidden">
                <div className="bg-emerald-800 text-white px-6 py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-emerald-300" />
                    <span>Government of India • Ministry of Tourism & ASI Verified Digital Gate Pass</span>
                  </div>
                  <span className="text-emerald-200 text-[11px] font-mono">FRRO SECURE SEAL</span>
                </div>

                <div className="p-6 flex flex-col md:flex-row items-center gap-6">
                  {/* The Generated QR Code */}
                  <div className="shrink-0 flex flex-col items-center">
                    <div className="bg-white p-2.5 rounded-lg border-2 border-slate-800 shadow-xs cursor-pointer group relative"
                         onClick={() => setQrModalOpen(true)}
                         title="Click to enlarge QR code">
                      {qrCodeUrl ? (
                        <img
                          id="dashboard-verified-qr-image"
                          src={qrCodeUrl}
                          alt="Verified Visitor QR Code"
                          className="w-36 h-36 object-contain"
                        />
                      ) : (
                        <div className="w-36 h-36 flex items-center justify-center text-xs text-slate-400">
                          Generating QR...
                        </div>
                      )}
                      <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded">
                        <span className="bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded font-medium shadow">Enlarge</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500 mt-1.5">Scan at Entry Gates</span>
                  </div>

                  {/* Pass Holder Details */}
                  <div className="flex-1 w-full space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Pass Holder</div>
                        <div className="text-lg font-bold text-slate-900">{verificationForm.fullName}</div>
                      </div>
                      <div className="sm:text-right">
                        <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Passport Number</div>
                        <div className="font-mono font-bold text-slate-900">{verificationForm.passportNumber}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-slate-500 block">Nationality</span>
                        <span className="font-semibold text-slate-800">{verificationForm.nationality}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Clearance Certificate</span>
                        <span className="font-mono font-semibold text-slate-800">ATT-FRRO-{verificationForm.passportNumber.slice(-4)}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Status</span>
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
                      <button
                        onClick={() => setQrModalOpen(true)}
                        className="bg-[#0f172a] hover:bg-slate-800 text-white px-3.5 py-1.5 rounded-md font-medium flex items-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Enlarge for Monument Scanner</span>
                      </button>

                      <button
                        onClick={() => {
                          if (qrCodeUrl) {
                            const link = document.createElement('a');
                            link.href = qrCodeUrl;
                            link.download = `atithi-verified-pass-${verificationForm.passportNumber}.png`;
                            link.click();
                          }
                        }}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-1.5 rounded-md font-medium flex items-center gap-1.5 border border-slate-300 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download QR</span>
                      </button>

                      <span className="text-slate-500 text-[11px] ml-auto">
                        Zero roaming data required • Accepted offline by ASI scanners
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 1: Atithi.ai Trip Planner */}
            <section id="section-trip-planner" aria-labelledby="trip-planner-title">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-7">
                <div className="flex items-center gap-2.5 mb-1">
                  <div className="w-7 h-7 bg-slate-900 text-white rounded flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-sky-400" />
                  </div>
                  <h2 id="trip-planner-title" className="text-xl font-bold text-slate-900 tracking-tight">
                    Atithi.ai Trip Planner
                  </h2>
                </div>

                {/* Subtext explicitly required */}
                <p className="text-xs text-slate-500 mb-5">
                  Plan your trip here with our smart AI agent.
                </p>

                <form onSubmit={handlePlanTrip} className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <input
                        id="trip-planner-input"
                        type="text"
                        value={plannerQuery}
                        onChange={(e) => setPlannerQuery(e.target.value)}
                        placeholder="Where do you want to explore? (e.g. Pune heritage forts, Sahyadri historical trails)"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:bg-white transition"
                      />
                    </div>
                    <button
                      id="plan-trip-btn"
                      type="submit"
                      disabled={isGeneratingPlan}
                      className="bg-[#0f172a] hover:bg-slate-800 text-white font-medium text-sm px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition shadow-sm shrink-0 cursor-pointer disabled:opacity-60"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{isGeneratingPlan ? 'Drafting Itinerary...' : 'Plan Trip'}</span>
                    </button>
                  </div>
                </form>

                {/* Planned Itinerary Output if generated */}
                {plannerPlan && (
                  <div className="mt-4 p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Generated Smart Itinerary Preview
                      </span>
                      <button
                        onClick={() => setPlannerPlan(null)}
                        className="text-[11px] text-slate-400 hover:text-slate-700"
                      >
                        Dismiss
                      </button>
                    </div>
                    <p className="whitespace-pre-line leading-relaxed text-slate-700 font-mono text-[12px]">
                      {plannerPlan}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* SECTION 2: Quick Bookings */}
            <section id="section-quick-bookings" aria-labelledby="quick-bookings-title">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 id="quick-bookings-title" className="text-lg font-bold text-slate-900 tracking-tight">
                    Quick Bookings
                  </h2>
                  <p className="text-xs text-slate-500">Government authorized transit and partner hospitality integrations</p>
                </div>
                {activeBooking && (
                  <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-medium">
                    Active: {activeBooking}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Book Cab */}
                <button
                  id="book-cab-btn"
                  onClick={() => setActiveBooking('Book Cab (Uber/Ola)')}
                  className={`bg-white rounded-xl border p-5 text-left transition-all shadow-sm hover:border-slate-800 cursor-pointer ${
                    activeBooking === 'Book Cab (Uber/Ola)' ? 'border-slate-800 ring-2 ring-slate-800' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800">
                      <Car className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      Instant Dispatch
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Book Cab (Uber/Ola)</h3>
                  <p className="text-xs text-slate-500 mt-1">Verified drivers with pre-negotiated hill-station and monument tariffs.</p>
                  <div className="mt-4 flex items-center text-xs font-semibold text-[#0f172a] gap-1">
                    <span>Reserve Transport</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </button>

                {/* Book Hotel */}
                <button
                  id="book-hotel-btn"
                  onClick={() => setActiveBooking('Book Hotel')}
                  className={`bg-white rounded-xl border p-5 text-left transition-all shadow-sm hover:border-slate-800 cursor-pointer ${
                    activeBooking === 'Book Hotel' ? 'border-slate-800 ring-2 ring-slate-800' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800">
                      <Hotel className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      MTDC / Certified
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Book Hotel</h3>
                  <p className="text-xs text-slate-500 mt-1">Verified heritage homestays, MTDC tourist resorts, and boutique lodges.</p>
                  <div className="mt-4 flex items-center text-xs font-semibold text-[#0f172a] gap-1">
                    <span>Browse Accommodations</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </button>

                {/* Book Flights */}
                <button
                  id="book-flights-btn"
                  onClick={() => setActiveBooking('Book Flights')}
                  className={`bg-white rounded-xl border p-5 text-left transition-all shadow-sm hover:border-slate-800 cursor-pointer ${
                    activeBooking === 'Book Flights' ? 'border-slate-800 ring-2 ring-slate-800' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800">
                      <Plane className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      Commercial & Regional
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Book Flights</h3>
                  <p className="text-xs text-slate-500 mt-1">Direct connections to Pune International Airport (PNQ) & Mumbai (BOM).</p>
                  <div className="mt-4 flex items-center text-xs font-semibold text-[#0f172a] gap-1">
                    <span>Search Flight Schedules</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              </div>

              {/* Quick Booking feedback popup dialog */}
              {activeBooking && (
                <div className="mt-3 p-4 bg-white border border-slate-300 rounded-lg flex items-center justify-between text-xs text-slate-700">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      <strong className="font-semibold text-slate-900">{activeBooking} portal initialized:</strong> Authorized ticketing channel connected. Ready for destination routing.
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveBooking(null)}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 ml-4"
                  >
                    Close
                  </button>
                </div>
              )}
            </section>

            {/* SECTION 3: Heritage Search */}
            <section id="section-heritage-search" aria-labelledby="heritage-search-title">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h2 id="heritage-search-title" className="text-lg font-bold text-slate-900 tracking-tight">
                    Heritage Search
                  </h2>
                  <p className="text-xs text-slate-500">Discover historical citadels, forts, and archaeological landmarks</p>
                </div>

                {/* Filter tags */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {['All', 'Fort', 'Caves'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-xs px-3 py-1 rounded-md font-medium transition-colors ${
                        selectedCategory === cat
                          ? 'bg-[#0f172a] text-white'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {cat === 'All' ? 'All Heritage' : `${cat}s`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="heritage-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search destinations (e.g., Sinhagad Fort, Raigad Fort, Ajanta Caves)..."
                  className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-800 transition shadow-2xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                  >
                    Clear
                  </button>
                )}
              </div>
            </section>

            {/* SECTION 4: Hardcoded Search Results */}
            <section id="section-heritage-results" aria-label="Heritage Search Results">
              <div className="flex items-center justify-between mb-3 text-xs text-slate-500 font-medium">
                <span>Showing {filteredDestinations.length} Verified Heritage Sites</span>
                <span>Archaeological Survey of India (ASI) Affiliated</span>
              </div>

              {filteredDestinations.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                  <p className="text-slate-500 text-sm">No heritage destinations matching &quot;{searchQuery}&quot;.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                    }}
                    className="mt-3 text-xs text-slate-800 font-semibold underline underline-offset-4"
                  >
                    Reset filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {filteredDestinations.map((destination) => {
                    const isSaved = !!savedForts[destination.id];
                    return (
                      <div
                        key={destination.id}
                        id={`destination-card-${destination.id}`}
                        className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:border-slate-400 transition"
                      >
                        <div className="p-6">
                          {/* Header of card */}
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                                {destination.category} • {destination.builtYear}
                              </span>
                              <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-1.5">
                                {destination.name}
                              </h3>
                            </div>
                            <button
                              id={`bookmark-btn-${destination.id}`}
                              onClick={() => handleToggleSaveFort(destination.id)}
                              className={`p-1.5 rounded-md border transition ${
                                isSaved
                                  ? 'bg-slate-900 text-white border-slate-900'
                                  : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-700'
                              }`}
                              title={isSaved ? 'Remove from saved' : 'Save destination'}
                            >
                              <Bookmark className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Location line */}
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{destination.region}</span>
                          </div>

                          {/* Stat line explicitly required: "Foreign Tourist Footfall: 500+ visited this month" */}
                          <div className="my-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2">
                            <Globe className="w-4 h-4 text-sky-700 shrink-0" />
                            <div className="text-xs">
                              <span className="font-semibold text-slate-900">Foreign Tourist Footfall: </span>
                              <span className="text-slate-700 font-medium">500+ visited this month</span>
                            </div>
                          </div>

                          {/* Short 1-line heritage description explicitly required */}
                          <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                            {destination.description}
                          </p>

                          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                            <span>Entry: {destination.entryFee}</span>
                            {destination.audioGuideAvailable && (
                              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                Audio Guide
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Card Action footer */}
                        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
                          <span className="font-medium text-slate-700">ASI Heritage Monitored</span>
                          <button
                            id={`view-details-${destination.id}`}
                            onClick={() => {
                              setPlannerQuery(`Itinerary for ${destination.name}`);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="font-semibold text-[#0f172a] hover:text-slate-700 flex items-center gap-1"
                          >
                            <span>Plan Visit</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      {/* Corporate Minimalist Footer */}
      <footer id="global-footer" className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-slate-700" />
            <span className="font-semibold text-slate-700">Atithi</span>
            <span>— Official Tourism Information & Heritage Clearance Prototype</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Corporate Flat UI</span>
            <span>•</span>
            <span>State-driven Workflow</span>
            <span>•</span>
            <span>100% Offline Engine</span>
          </div>
        </div>
      </footer>

      {/* Enlarged QR Code Modal for Monument Gate Scanners */}
      {qrModalOpen && (
        <div
          id="qr-enlarged-modal"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/80 flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-xl border border-slate-300 shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-150">
            {/* Modal Header */}
            <div className="bg-[#0f172a] text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-sky-400" />
                <span className="text-sm font-bold tracking-tight">Official Digital Clearance QR Pass</span>
              </div>
              <button
                id="close-qr-modal-btn"
                onClick={() => setQrModalOpen(false)}
                className="text-slate-400 hover:text-white transition p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex flex-col items-center text-center">
              <span className="text-[11px] font-bold tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded uppercase mb-3">
                FRRO & ASI Monument Gate Clearance
              </span>

              {/* High-contrast QR Container */}
              <div className="bg-white p-4 rounded-xl border-2 border-slate-900 shadow-sm mb-4">
                {qrCodeUrl ? (
                  <img
                    src={qrCodeUrl}
                    alt="Verified Passport QR"
                    className="w-56 h-56 object-contain"
                  />
                ) : (
                  <div className="w-56 h-56 flex items-center justify-center text-xs text-slate-400">
                    Generating QR code...
                  </div>
                )}
              </div>

              <div className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-left text-xs space-y-1.5 mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-500">Tourist:</span>
                  <span className="font-semibold text-slate-900">{verificationForm.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Passport:</span>
                  <span className="font-mono font-semibold text-slate-900">{verificationForm.passportNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nationality:</span>
                  <span className="font-semibold text-slate-900">{verificationForm.nationality}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Clearance ID:</span>
                  <span className="font-mono text-slate-700">ATT-FRRO-{verificationForm.passportNumber.slice(-4)}-2026</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
                Present this screen to the official barcode or camera scanner at the entrance turnstiles of Sinhagad, Raigad, Ajanta Caves, and other ASI heritage sites.
              </p>

              <div className="w-full flex items-center gap-2">
                <button
                  onClick={() => {
                    if (qrCodeUrl) {
                      const link = document.createElement('a');
                      link.href = qrCodeUrl;
                      link.download = `atithi-verified-pass-${verificationForm.passportNumber}.png`;
                      link.click();
                    }
                  }}
                  className="flex-1 bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-semibold py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Pass</span>
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(
                      `ATITHI CLEARANCE PASS | ID: ATT-FRRO-${verificationForm.passportNumber.slice(-4)}-2026 | Holder: ${verificationForm.fullName} | Passport: ${verificationForm.passportNumber}`
                    );
                    setCopiedNotification(true);
                    setTimeout(() => setCopiedNotification(false), 2000);
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 border border-slate-300 transition cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedNotification ? 'Copied!' : 'Copy Info'}</span>
                </button>

                <button
                  onClick={() => setQrModalOpen(false)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold py-2.5 px-4 rounded-lg transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
