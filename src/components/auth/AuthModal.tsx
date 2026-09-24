import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole, VerificationStatus } from '../../types';
import {
  X,
  Wheat,
  ShoppingBag,
  Building2,
  ShieldCheck,
  CheckCircle,
  FileText,
  CreditCard,
  MapPin,
  Lock,
  Mail,
  Phone,
  User as UserIcon,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'register';
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  onClose,
  onSuccess,
}) => {
  const { login, register, switchRole } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [selectedRole, setSelectedRole] = useState<UserRole>('farmer');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [stateName, setStateName] = useState('Uttar Pradesh');
  const [district, setDistrict] = useState('Meerut');
  const [village, setVillage] = useState('Daurala');
  const [kccId, setKccId] = useState('');
  const [khatianNumber, setKhatianNumber] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [loginInput, setLoginInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginInput) {
      setErrorMsg('Please enter email or mobile');
      return;
    }
    const ok = login(loginInput);
    if (ok) {
      onSuccess();
      onClose();
    } else {
      setErrorMsg('User not found. Try one of the 1-click demo accounts below.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !mobile) {
      setErrorMsg('Please fill in required fields');
      return;
    }

    // Determine verification status
    let verificationStatus: VerificationStatus = 'temporary';
    if (selectedRole === 'farmer' && (kccId || khatianNumber)) {
      verificationStatus = 'verified';
    } else if (selectedRole === 'consumer') {
      verificationStatus = 'verified';
    }

    register({
      name,
      email,
      mobile,
      role: selectedRole,
      location: {
        state: stateName,
        district,
        villageOrTown: village,
      },
      verificationStatus,
      kccId: kccId || undefined,
      khatianNumber: khatianNumber || undefined,
      businessName: businessName || undefined,
    });

    onSuccess();
    onClose();
  };

  const handleQuickDemoSwitch = (role: UserRole) => {
    switchRole(role);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 dark:border-stone-800 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mx-auto mb-2">
            <Wheat className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-white">
            {mode === 'login' ? 'Welcome Back to PriceXact' : 'Create Your PriceXact Account'}
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            {mode === 'login'
              ? 'Access crowdsourced farmgate rates, alerts, and market trends.'
              : 'Join the transparent agricultural marketplace intelligence network.'}
          </p>

          <div className="flex rounded-lg bg-stone-100 dark:bg-stone-800 p-1 mt-4">
            <button
              onClick={() => {
                setMode('login');
                setErrorMsg('');
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                mode === 'login'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-sm'
                  : 'text-stone-500 dark:text-stone-400'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('register');
                setErrorMsg('');
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                mode === 'register'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-sm'
                  : 'text-stone-500 dark:text-stone-400'
              }`}
            >
              Register (KCC & Khatian)
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs">
            {errorMsg}
          </div>
        )}

        {mode === 'login' ? (
          <div>
            <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Email or Registered Mobile Number
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={loginInput}
                    onChange={(e) => setLoginInput(e.target.value)}
                    placeholder="e.g. ramesh.farmer@pricexact.org or +91 98765 43210"
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    defaultValue="demo123"
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors"
              >
                Sign In to Account
              </button>
            </form>

            {/* Quick Demo Logins Box */}
            <div className="mt-5 pt-4 border-t border-stone-200 dark:border-stone-800">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-2 text-center">
                Instant 1-Click Demo Profiles
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleQuickDemoSwitch('farmer')}
                  className="p-2 text-left rounded-lg border border-stone-200 dark:border-stone-700 hover:border-emerald-500 bg-stone-50 dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
                >
                  <div className="font-bold text-stone-800 dark:text-stone-100 flex items-center gap-1">
                    🌾 Farmer Rameshwar
                  </div>
                  <span className="text-[10px] text-emerald-600">Verified KCC, 92 Trust</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoSwitch('consumer')}
                  className="p-2 text-left rounded-lg border border-stone-200 dark:border-stone-700 hover:border-emerald-500 bg-stone-50 dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
                >
                  <div className="font-bold text-stone-800 dark:text-stone-100 flex items-center gap-1">
                    🛒 Consumer Priya
                  </div>
                  <span className="text-[10px] text-emerald-600">Saket Delhi, 78 Trust</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoSwitch('trader')}
                  className="p-2 text-left rounded-lg border border-stone-200 dark:border-stone-700 hover:border-emerald-500 bg-stone-50 dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
                >
                  <div className="font-bold text-stone-800 dark:text-stone-100 flex items-center gap-1">
                    🏢 Trader Sanjay Gupta
                  </div>
                  <span className="text-[10px] text-stone-500">Azadpur APMC Yard</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoSwitch('admin')}
                  className="p-2 text-left rounded-lg border border-stone-200 dark:border-stone-700 hover:border-emerald-500 bg-stone-50 dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
                >
                  <div className="font-bold text-stone-800 dark:text-stone-100 flex items-center gap-1">
                    ⚡ Admin Hub
                  </div>
                  <span className="text-[10px] text-stone-500">KCC Approval & Flags</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs max-h-[60vh] overflow-y-auto pr-1">
            {/* Role Selection */}
            <div>
              <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                Select Your Role *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRole('farmer')}
                  className={`p-2.5 rounded-lg border text-left flex items-center gap-2 ${
                    selectedRole === 'farmer'
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 font-bold'
                      : 'border-stone-200 dark:border-stone-700 text-stone-600'
                  }`}
                >
                  <Wheat className="w-4 h-4 text-emerald-600" />
                  <span>🌾 I am a Farmer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('consumer')}
                  className={`p-2.5 rounded-lg border text-left flex items-center gap-2 ${
                    selectedRole === 'consumer'
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 font-bold'
                      : 'border-stone-200 dark:border-stone-700 text-stone-600'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 text-emerald-600" />
                  <span>🛒 I am a Consumer</span>
                </button>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rameshwar Patel"
                  className="w-full p-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full p-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full p-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                />
              </div>
            </div>

            {/* Location fields */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  className="w-full p-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                  District
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full p-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Town / Village
                </label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full p-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                />
              </div>
            </div>

            {/* Farmer Verification Section */}
            {selectedRole === 'farmer' && (
              <div className="p-3 bg-amber-50/70 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800/40 space-y-2">
                <div className="flex items-center gap-1.5 text-amber-900 dark:text-amber-300 font-bold">
                  <CreditCard className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                  <span>Kisan Verification (Optional for Instant Verified Badge)</span>
                </div>
                <p className="text-[10px] text-amber-800/80 dark:text-amber-400/80">
                  Enter your Kisan Credit Card (KCC) or land survey number for instant Verified Farmer status (otherwise Temporary status).
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 dark:text-stone-300 mb-0.5">
                      KCC ID Number
                    </label>
                    <input
                      type="text"
                      value={kccId}
                      onChange={(e) => setKccId(e.target.value)}
                      placeholder="e.g. KCC-UP-MEE-2026"
                      className="w-full p-2 rounded border border-amber-300 dark:border-amber-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 dark:text-stone-300 mb-0.5">
                      Khatian / Land Record No.
                    </label>
                    <input
                      type="text"
                      value={khatianNumber}
                      onChange={(e) => setKhatianNumber(e.target.value)}
                      placeholder="e.g. KH-892/14B"
                      className="w-full p-2 rounded border border-amber-300 dark:border-amber-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors"
            >
              Complete Registration & Enter
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
