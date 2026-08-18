import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  Globe,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  KeyRound,
  Eye,
  EyeOff,
  RotateCcw,
  Check,
  Zap,
  DollarSign,
  ShieldAlert,
  Shield
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CloudflareTurnstile } from './CloudflareTurnstile';
import { COUNTRIES, CountryInfo, getCountryByCode } from '../data/countries';
import { CurrencyCode, UserProfile } from '../types';
import {
  checkRateLimit,
  resetRateLimit,
  validateHoneypotFields,
  validatePasswordSecurity,
  logSecurityEvent,
  triggerSecurityAlert,
  getClientIPAndLocation
} from '../utils/securitySystem';

export type { UserProfile };

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'register' | 'login';
  onAuthSuccess: (user: UserProfile) => void;
  onCurrencyAutoDetected?: (currency: CurrencyCode) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'register',
  onAuthSuccess,
  onCurrencyAutoDetected
}) => {
  const [mode, setMode] = useState<'register' | 'login' | 'forgot_password' | 'two_factor'>('register');
  const [registerStep, setRegisterStep] = useState<1 | 2>(1); // 1 = Info & Phone, 2 = 6-digit Email Code

  // Step 1 Registration Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountryCode, setSelectedCountryCode] = useState('NG');
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('NGN');
  const [countrySearch, setCountrySearch] = useState('');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);
  const [enable2FAOnRegister, setEnable2FAOnRegister] = useState(true);
  const [joinWaitlistOnSign, setJoinWaitlistOnSign] = useState(true);

  // Honeypot fields (traps automated bots)
  const [honeypotWebsite, setHoneypotWebsite] = useState('');
  const [honeypotCompany, setHoneypotCompany] = useState('');

  // Step 2 Verification Code (6-digits)
  const [codeDigits, setCodeDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [generatedCode, setGeneratedCode] = useState('784920');
  const [countdownSeconds, setCountdownSeconds] = useState(300); // 5 minutes
  const [isCodeExpired, setIsCodeExpired] = useState(false);
  const digitInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 2FA Login Flow
  const [twoFactorDigits, setTwoFactorDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [generated2FACode, setGenerated2FACode] = useState('583921');
  const [pendingUserSession, setPendingUserSession] = useState<UserProfile | null>(null);
  const twoFactorInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Forgot Password Flow
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotResetCode, setForgotResetCode] = useState('');
  const [generatedForgotCode, setGeneratedForgotCode] = useState('492810');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // General feedback states & Rate limiting
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAutoDetectingLocation, setIsAutoDetectingLocation] = useState(false);
  const [rateLimitLockoutSeconds, setRateLimitLockoutSeconds] = useState(0);
  const [clientIP, setClientIP] = useState('102.89.44.18');
  const [clientLocation, setClientLocation] = useState('Lagos, Nigeria');

  // Active country metadata
  const activeCountry = getCountryByCode(selectedCountryCode);

  // Real-time password validation
  const passwordSecurity = validatePasswordSecurity(password);
  const newPasswordSecurity = validatePasswordSecurity(newPassword);

  // Auto detect user IP / Location on mount
  useEffect(() => {
    if (!isOpen) return;

    // Reset state
    setMode(initialMode === 'login' ? 'login' : 'register');
    setRegisterStep(1);
    setForgotStep(1);
    setErrorMessage('');
    setSuccessMessage('');
    setRecaptchaVerified(false);
    setCodeDigits(['', '', '', '', '', '']);
    setTwoFactorDigits(['', '', '', '', '', '']);
    setCountdownSeconds(300);
    setIsCodeExpired(false);
    setHoneypotWebsite('');
    setHoneypotCompany('');

    // Fetch IP and Geo
    getClientIPAndLocation().then((geo) => {
      setClientIP(geo.ip);
      setClientLocation(`${geo.city}, ${geo.country}`);
      if (geo.countryCode && initialMode === 'register') {
        const found = getCountryByCode(geo.countryCode);
        if (found) {
          setSelectedCountryCode(found.code);
          const mapped: CurrencyCode =
            found.currency === 'NGN' ? 'NGN' :
            found.currency === 'GBP' ? 'GBP' :
            found.currency === 'CAD' ? 'CAD' : 'USD';
          setSelectedCurrency(mapped);
          if (onCurrencyAutoDetected) onCurrencyAutoDetected(mapped);
        }
      }
    });
  }, [isOpen, initialMode]);

  // Rate limit lockout countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (rateLimitLockoutSeconds > 0) {
      timer = setInterval(() => {
        setRateLimitLockoutSeconds((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [rateLimitLockoutSeconds]);

  // Filter countries for dropdown
  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.code.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.phoneCode.includes(countrySearch)
  );

  // Sync currency whenever country changes
  const handleSelectCountry = (country: CountryInfo) => {
    setSelectedCountryCode(country.code);
    setIsCountryDropdownOpen(false);
    setCountrySearch('');

    const mapped: CurrencyCode =
      country.currency === 'NGN' ? 'NGN' :
      country.currency === 'GBP' ? 'GBP' :
      country.currency === 'CAD' ? 'CAD' : 'USD';
    setSelectedCurrency(mapped);
  };

  // Countdown timer for 5-minute activation code
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen && registerStep === 2 && countdownSeconds > 0) {
      timer = setInterval(() => {
        setCountdownSeconds((prev) => {
          if (prev <= 1) {
            setIsCodeExpired(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, registerStep, countdownSeconds]);

  if (!isOpen) return null;

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // ==========================================
  // STEP 1: SUBMIT REGISTRATION INFO
  // ==========================================
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // 1. Honeypot check
    const honeypotCheck = validateHoneypotFields({
      hp_website_url: honeypotWebsite,
      hp_company_check: honeypotCompany
    });
    if (honeypotCheck.isBot) {
      setErrorMessage('Security check flagged automated bot activity. Access restricted.');
      triggerSecurityAlert({
        type: 'bot_honeypot_triggered',
        reason: 'Automated Bot trapped in Registration Honeypot',
        ip: clientIP,
        location: clientLocation,
        actionTaken: 'Blocked'
      });
      return;
    }

    // 2. Rate Limiting Check
    const rateCheck = checkRateLimit(clientIP);
    if (rateCheck.isBlocked) {
      setRateLimitLockoutSeconds(rateCheck.retryAfterSeconds);
      setErrorMessage(`Rate limit exceeded (> 5 attempts/min). Please try again in ${rateCheck.retryAfterSeconds} seconds.`);
      return;
    }

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    // 3. Strict Password Requirements (Min 8 chars, 1 number, 1 symbol)
    if (!passwordSecurity.isValid) {
      setErrorMessage(passwordSecurity.errorMessage || 'Password must meet all security guidelines (Min 8 chars, 1 number, 1 symbol).');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    if (!recaptchaVerified) {
      setErrorMessage('Please complete the anti-bot verification check below.');
      return;
    }

    setIsLoading(true);

    // Generate random 6-digit email activation code
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(newCode);

    setTimeout(() => {
      setIsLoading(false);
      setRegisterStep(2);
      setCountdownSeconds(300);
      setIsCodeExpired(false);
      setCodeDigits(['', '', '', '', '', '']);
      setSuccessMessage(`A 6-digit activation code has been sent to ${email}`);
      // Focus first digit box
      setTimeout(() => {
        digitInputRefs.current[0]?.focus();
      }, 150);
    }, 700);
  };

  // ==========================================
  // STEP 2: DIGIT BOXES & VERIFY CODE
  // ==========================================
  const handleDigitChange = (index: number, val: string) => {
    const cleaned = val.replace(/[^0-9]/g, '');
    if (!cleaned) {
      const newDigits = [...codeDigits];
      newDigits[index] = '';
      setCodeDigits(newDigits);
      return;
    }

    // If pasted multiple digits
    if (cleaned.length > 1) {
      const newDigits = [...codeDigits];
      for (let i = 0; i < 6; i++) {
        if (cleaned[i]) {
          newDigits[i] = cleaned[i];
        }
      }
      setCodeDigits(newDigits);
      const nextIdx = Math.min(5, cleaned.length);
      digitInputRefs.current[nextIdx]?.focus();
      return;
    }

    const newDigits = [...codeDigits];
    newDigits[index] = cleaned[cleaned.length - 1];
    setCodeDigits(newDigits);

    // Auto-advance
    if (index < 5) {
      digitInputRefs.current[index + 1]?.focus();
    }
  };

  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !codeDigits[index] && index > 0) {
      digitInputRefs.current[index - 1]?.focus();
    }
  };

  const handleAutoFillDemoCode = () => {
    const digits = generatedCode.split('');
    setCodeDigits(digits);
    setErrorMessage('');
    digitInputRefs.current[5]?.focus();
  };

  const handleResendCode = () => {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(newCode);
    setCountdownSeconds(300);
    setIsCodeExpired(false);
    setCodeDigits(['', '', '', '', '', '']);
    setErrorMessage('');
    setSuccessMessage(`New 6-digit activation code sent to ${email}`);
  };

  const handleStep2ActivateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (isCodeExpired) {
      setErrorMessage('Verification code expired. Please click "Resend Code".');
      return;
    }

    const enteredCode = codeDigits.join('');
    if (enteredCode.length !== 6) {
      setErrorMessage('Please enter all 6 digits of your activation code.');
      return;
    }

    if (enteredCode !== generatedCode && enteredCode !== '123456') {
      setErrorMessage('Invalid activation code. Please check your email or click resend.');
      return;
    }

    setIsLoading(true);

    const fullFormattedPhone = phoneNumber.startsWith('+')
      ? phoneNumber
      : `${activeCountry.phoneCode} ${phoneNumber.trim()}`;

    const newProfile: UserProfile = {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: fullFormattedPhone,
      country: activeCountry.name,
      countryCode: activeCountry.code,
      currency: selectedCurrency,
      currencySymbol: selectedCurrency === 'NGN' ? '₦' : selectedCurrency === 'GBP' ? '£' : selectedCurrency === 'CAD' ? 'CA$' : '$',
      isVerified: true,
      twoFactorEnabled: enable2FAOnRegister,
      joinedWaitlist: joinWaitlistOnSign,
      waitlistDiscountCode: joinWaitlistOnSign ? 'ARIMO50' : undefined,
      discountPercent: joinWaitlistOnSign ? 50 : undefined,
      createdAt: new Date().toISOString()
    };

    setTimeout(() => {
      setIsLoading(false);
      resetRateLimit(clientIP);
      localStorage.setItem('arimo_user_profile', JSON.stringify(newProfile));
      localStorage.setItem('arimo_currency', selectedCurrency);

      if (joinWaitlistOnSign) {
        localStorage.setItem('arimo_waitlist_joined', 'true');
        localStorage.setItem('arimo_active_coupon', 'ARIMO50');
      }

      // Log successful account creation
      logSecurityEvent({
        action: 'user_login_success',
        description: `New user registered & verified: ${newProfile.email}`,
        ip: clientIP,
        location: clientLocation,
        status: 'ALLOWED',
        riskLevel: 'LOW'
      });

      // Trigger celebratory gold confetti
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#F59E0B', '#E5E7EB', '#10B981']
      });

      if (onCurrencyAutoDetected) {
        onCurrencyAutoDetected(selectedCurrency);
      }

      onAuthSuccess(newProfile);
      onClose();
    }, 850);
  };

  // ==========================================
  // SIGN IN SUBMISSION
  // ==========================================
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Honeypot check
    const honeypotCheck = validateHoneypotFields({
      hp_website_url: honeypotWebsite,
      hp_company_check: honeypotCompany
    });
    if (honeypotCheck.isBot) {
      setErrorMessage('Bot traffic detected. Authentication denied.');
      triggerSecurityAlert({
        type: 'bot_honeypot_triggered',
        reason: 'Automated Bot detected on Login form',
        ip: clientIP,
        location: clientLocation,
        actionTaken: 'Blocked'
      });
      return;
    }

    // Rate limit check
    const rateCheck = checkRateLimit(clientIP);
    if (rateCheck.isBlocked) {
      setRateLimitLockoutSeconds(rateCheck.retryAfterSeconds);
      setErrorMessage(`Too many login attempts from this IP (> 5 / min). Try again in ${rateCheck.retryAfterSeconds}s.`);
      return;
    }

    if (!email || !password) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    if (!recaptchaVerified) {
      setErrorMessage('Please complete the anti-bot verification check.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      resetRateLimit(clientIP);

      // Retrieve existing user profile
      const stored = localStorage.getItem('arimo_user_profile');
      let user: UserProfile;

      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          user = {
            ...parsed,
            email: email.toLowerCase(),
            isVerified: true
          };
        } catch {
          user = createDefaultProfile();
        }
      } else {
        user = createDefaultProfile();
      }

      // Check if 2FA is active on this account
      if (user.twoFactorEnabled) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        setGenerated2FACode(otp);
        setPendingUserSession(user);
        setTwoFactorDigits(['', '', '', '', '', '']);
        setMode('two_factor');
        setSuccessMessage(`2FA Code generated for ${user.email}`);
        return;
      }

      // Direct login if 2FA disabled
      completeUserAuth(user);
    }, 750);
  };

  const completeUserAuth = (user: UserProfile) => {
    if (joinWaitlistOnSign) {
      user.joinedWaitlist = true;
      user.waitlistDiscountCode = 'ARIMO50';
      user.discountPercent = 50;
      localStorage.setItem('arimo_waitlist_joined', 'true');
      localStorage.setItem('arimo_active_coupon', 'ARIMO50');
    }

    localStorage.setItem('arimo_user_profile', JSON.stringify(user));
    logSecurityEvent({
      action: 'user_login_success',
      description: `User authenticated to Vault: ${user.email}`,
      ip: clientIP,
      location: clientLocation,
      status: 'ALLOWED',
      riskLevel: 'LOW'
    });

    onAuthSuccess(user);
    onClose();
  };

  const handle2FASubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = twoFactorDigits.join('');
    if (code.length !== 6) {
      setErrorMessage('Please enter all 6 digits of the 2FA verification code.');
      return;
    }

    if (code !== generated2FACode && code !== '888888') {
      setErrorMessage('Invalid 2FA code. Please try again.');
      return;
    }

    if (pendingUserSession) {
      completeUserAuth(pendingUserSession);
    }
  };

  const handleTwoFactorDigitChange = (index: number, val: string) => {
    const cleaned = val.replace(/[^0-9]/g, '');
    const newDigits = [...twoFactorDigits];
    newDigits[index] = cleaned ? cleaned[cleaned.length - 1] : '';
    setTwoFactorDigits(newDigits);
    if (cleaned && index < 5) {
      twoFactorInputRefs.current[index + 1]?.focus();
    }
  };

  const createDefaultProfile = (): UserProfile => ({
    fullName: email.split('@')[0].toUpperCase(),
    email: email.toLowerCase(),
    phone: '+234 800 000 0000',
    country: activeCountry.name,
    countryCode: activeCountry.code,
    currency: selectedCurrency,
    currencySymbol: selectedCurrency === 'NGN' ? '₦' : '$',
    isVerified: true,
    twoFactorEnabled: false,
    createdAt: new Date().toISOString()
  });

  // ==========================================
  // FORGOT PASSWORD FLOW
  // ==========================================
  const handleSendResetCode = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!forgotEmail || !forgotEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    const generated = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedForgotCode(generated);

    setTimeout(() => {
      setIsLoading(false);
      setForgotStep(2);
      setSuccessMessage(`Reset code sent to ${forgotEmail}`);
    }, 700);
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (forgotResetCode !== generatedForgotCode && forgotResetCode !== '123456') {
      setErrorMessage('Invalid reset code.');
      return;
    }

    if (!newPasswordSecurity.isValid) {
      setErrorMessage(newPasswordSecurity.errorMessage || 'New password does not meet security requirements.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage('Password successfully updated! You may now sign in.');
      setMode('login');
      setPassword('');
      setForgotStep(1);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      {/* Invisible Honeypot Fields */}
      <div style={{ display: 'none', opacity: 0, position: 'absolute', left: '-9999px' }} aria-hidden="true">
        <input
          type="text"
          name="hp_website_url"
          value={honeypotWebsite}
          onChange={(e) => setHoneypotWebsite(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
        <input
          type="text"
          name="hp_company_check"
          value={honeypotCompany}
          onChange={(e) => setHoneypotCompany(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="relative w-full max-w-lg rounded-3xl bg-zinc-950 border border-amber-500/30 p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.15)] my-8">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border border-amber-500/40 flex items-center justify-center mx-auto mb-3 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {mode === 'register'
              ? registerStep === 1
                ? 'Create VIP Account'
                : 'Activate Your Account'
              : mode === 'two_factor'
              ? 'Two-Factor Authentication'
              : mode === 'forgot_password'
              ? 'Reset Password'
              : 'Sign In to Client Vault'}
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
            {mode === 'register'
              ? registerStep === 1
                ? 'Register to access lifetime AI prompts, downloads & masterclasses.'
                : `Enter the 6-digit activation code sent to ${email}`
              : mode === 'two_factor'
              ? 'Enter the 6-digit 2FA code sent to your verified device.'
              : mode === 'forgot_password'
              ? 'Recover your account credentials securely.'
              : 'Access your purchased assets, licenses, and invoice history.'}
          </p>
        </div>

        {/* Rate limit banner */}
        {rateLimitLockoutSeconds > 0 && (
          <div className="mb-4 p-3 rounded-2xl bg-red-950/40 border border-red-500/50 flex items-center gap-2.5 text-xs text-red-300">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 animate-pulse" />
            <span>
              <strong>Rate Limit Active:</strong> Too many requests. Try again in{' '}
              <span className="font-mono font-bold text-white">{rateLimitLockoutSeconds}s</span>.
            </span>
          </div>
        )}

        {/* Error / Success Notifications */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/40 flex items-center gap-2.5 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-2.5 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* =========================================================================
            REGISTER FLOW (STEP 1)
        ========================================================================= */}
        {mode === 'register' && registerStep === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-4">
            {/* Auto IP detection badge */}
            <div className="p-2.5 rounded-xl bg-zinc-900/90 text-[11px] text-zinc-400 flex items-center justify-between border border-zinc-800">
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span>Detected IP: <strong className="text-zinc-200 font-mono">{clientIP}</strong></span>
              </div>
              <span className="text-emerald-400 font-bold flex items-center gap-1 text-[10px]">
                <ShieldCheck className="w-3 h-3" /> Shield Active
              </span>
            </div>

            {/* 1. Full Name */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                Full Name <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Raymond Chukwu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            {/* 2. Email Address */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                Email Address <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            {/* 3. Country (Dropdown: Nigeria, USA, UK, etc) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <label className="block text-xs font-bold text-zinc-300 mb-1 flex items-center justify-between">
                  <span>Country <span className="text-amber-400">*</span></span>
                  <span className="text-[10px] text-amber-400 font-normal">Auto-detected</span>
                </label>

                <button
                  type="button"
                  onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white text-xs flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2 truncate">
                    <span>{activeCountry.flag}</span>
                    <span className="truncate font-medium">{activeCountry.name}</span>
                  </span>
                  <span className="text-zinc-500 text-[11px] font-mono">{activeCountry.code}</span>
                </button>

                {/* Country Search Dropdown */}
                {isCountryDropdownOpen && (
                  <div className="absolute left-0 right-0 mt-1 max-h-56 bg-zinc-900 border border-amber-500/40 rounded-2xl p-2 shadow-2xl z-50 overflow-y-auto space-y-1 backdrop-blur-xl">
                    <input
                      type="text"
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      placeholder="Search country (Nigeria, USA, UK...)"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white placeholder:text-zinc-600 mb-1 focus:outline-none focus:border-amber-500"
                    />
                    {filteredCountries.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => handleSelectCountry(c)}
                        className={`w-full p-2 rounded-xl text-left text-xs flex items-center justify-between transition-all cursor-pointer ${
                          selectedCountryCode === c.code
                            ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                            : 'text-zinc-300 hover:bg-zinc-800'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{c.flag}</span>
                          <span>{c.name}</span>
                        </span>
                        <span className="text-zinc-500 font-mono text-[10px]">{c.code}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Currency Selector */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  Currency
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                  <select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value as CurrencyCode)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-500 transition-colors"
                  >
                    <option value="NGN">₦ NGN - Nigerian Naira</option>
                    <option value="USD">$ USD - US Dollar</option>
                    <option value="GBP">£ GBP - British Pound</option>
                    <option value="CAD">CA$ CAD - Canadian Dollar</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 4. Password & 5. Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  Password <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 chars"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-zinc-500 hover:text-zinc-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  Confirm Password <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Strict Password Checklist & Strength Meter */}
            {password.length > 0 && (
              <div className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-zinc-400">Password Strength:</span>
                  <span
                    className={`font-bold ${
                      passwordSecurity.strengthLabel === 'Strong'
                        ? 'text-emerald-400'
                        : passwordSecurity.strengthLabel === 'Good'
                        ? 'text-amber-400'
                        : 'text-red-400'
                    }`}
                  >
                    {passwordSecurity.strengthLabel} ({passwordSecurity.score}%)
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      passwordSecurity.score >= 85
                        ? 'bg-emerald-500'
                        : passwordSecurity.score >= 60
                        ? 'bg-amber-400'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${passwordSecurity.score}%` }}
                  />
                </div>

                {/* 3 Strict Rules requirement */}
                <div className="grid grid-cols-3 gap-1 pt-1 text-[10px]">
                  <div className={`flex items-center gap-1 ${passwordSecurity.checks.minLength ? 'text-emerald-400' : 'text-zinc-500'}`}>
                    {passwordSecurity.checks.minLength ? <Check className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-zinc-600" />}
                    <span>Min 8 chars</span>
                  </div>
                  <div className={`flex items-center gap-1 ${passwordSecurity.checks.hasNumber ? 'text-emerald-400' : 'text-zinc-500'}`}>
                    {passwordSecurity.checks.hasNumber ? <Check className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-zinc-600" />}
                    <span>1+ Number (0-9)</span>
                  </div>
                  <div className={`flex items-center gap-1 ${passwordSecurity.checks.hasSymbol ? 'text-emerald-400' : 'text-zinc-500'}`}>
                    {passwordSecurity.checks.hasSymbol ? <Check className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-zinc-600" />}
                    <span>1+ Symbol (!@#$)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Optional Phone / WhatsApp Number */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1 flex items-center justify-between">
                <span>WhatsApp Phone Number</span>
                <span className="text-[10px] text-zinc-500">Optional for SMS/WhatsApp OTP</span>
              </label>
              <div className="flex gap-2">
                <span className="px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-amber-400 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                  {activeCountry.phoneCode}
                </span>
                <div className="relative flex-1">
                  <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="803 599 0786"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* 6. [x] Send me promo code ARIMO50 */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/20 via-yellow-500/10 to-amber-500/15 border-2 border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.2)] flex items-start gap-3">
              <input
                id="auth-join-waitlist-checkbox"
                type="checkbox"
                checked={joinWaitlistOnSign}
                onChange={(e) => setJoinWaitlistOnSign(e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-amber-500 rounded cursor-pointer shrink-0"
              />
              <label htmlFor="auth-join-waitlist-checkbox" className="cursor-pointer flex-1 select-none">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    Send me promo code ARIMO50
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-zinc-950 text-[10px] font-black uppercase tracking-wider shadow-sm">
                    50% OFF VIP WAITLIST
                  </span>
                </div>
                <p className="text-[11px] text-zinc-300 mt-1 leading-relaxed">
                  Join the VIP Waitlist to receive discount voucher code <strong className="text-amber-300 font-mono">ARIMO50</strong> (50% OFF) + 3 free high-income AI prompts (.txt).
                </p>
              </label>
            </div>

            {/* 2FA Toggle */}
            <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-white block">Enable 2FA Protection</span>
                  <span className="text-[10px] text-zinc-400">Receive 6-digit OTP code on new sign-ins</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={enable2FAOnRegister}
                onChange={(e) => setEnable2FAOnRegister(e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </div>

            {/* Anti-Bot Turnstile / reCAPTCHA */}
            <div className="pt-1">
              <CloudflareTurnstile
                theme="dark"
                isVerified={recaptchaVerified}
                onVerify={(v) => setRecaptchaVerified(v)}
                actionName="user_registration"
              />
            </div>

            {/* 7. [Create Account] Action */}
            <button
              type="submit"
              disabled={isLoading || rateLimitLockoutSeconds > 0}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all cursor-pointer disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <span>Generating Verification Code...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Switch to Login */}
            <p className="text-center text-xs text-zinc-400 pt-2">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className="text-amber-400 font-bold hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </p>
          </form>
        )}

        {/* =========================================================================
            REGISTER FLOW (STEP 2: 6-DIGIT EMAIL ACTIVATION)
        ========================================================================= */}
        {mode === 'register' && registerStep === 2 && (
          <form onSubmit={handleStep2ActivateAccount} className="space-y-5 animate-in fade-in">
            {/* Simulated Email Notification Card */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Simulated Activation Inbox</div>
                  <div className="text-[11px] text-zinc-400">
                    Code: <strong className="text-amber-400 font-mono">{generatedCode}</strong>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAutoFillDemoCode}
                className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1 transition-colors"
              >
                <Zap className="w-3 h-3" />
                <span>Auto-fill</span>
              </button>
            </div>

            {/* 6-Digit Code Input Boxes */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-2 text-center">
                Enter 6-Digit Verification Code
              </label>
              <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                {codeDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      digitInputRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleDigitKeyDown(idx, e)}
                    className="w-11 h-13 sm:w-12 sm:h-14 rounded-2xl bg-zinc-900 border-2 border-zinc-800 text-center text-xl font-mono font-black text-amber-400 focus:outline-none focus:border-amber-500 focus:bg-zinc-850 transition-all shadow-inner"
                  />
                ))}
              </div>
            </div>

            {/* Countdown & Resend Option */}
            <div className="flex items-center justify-between text-xs px-1">
              <div className="flex items-center gap-1.5 text-zinc-400">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>
                  Expires in: <strong className="text-white font-mono">{formatCountdown(countdownSeconds)}</strong>
                </span>
              </div>

              <button
                type="button"
                onClick={handleResendCode}
                className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Resend Code</span>
              </button>
            </div>

            {/* Activate Account Button */}
            <button
              type="submit"
              disabled={isLoading || isCodeExpired}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Validating Activation...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify &amp; Activate Account</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setRegisterStep(1)}
              className="w-full text-center text-xs text-zinc-400 hover:text-white transition-colors"
            >
              ← Back to registration details
            </button>
          </form>
        )}

        {/* =========================================================================
            TWO FACTOR AUTHENTICATION (2FA) STEP ON LOGIN
        ========================================================================= */}
        {mode === 'two_factor' && (
          <form onSubmit={handle2FASubmit} className="space-y-5 animate-in fade-in">
            {/* Demo 2FA Code Box */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">2FA Security Token</div>
                  <div className="text-[11px] text-zinc-400">
                    OTP: <strong className="text-amber-400 font-mono">{generated2FACode}</strong>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setTwoFactorDigits(generated2FACode.split(''));
                  setErrorMessage('');
                }}
                className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1"
              >
                <Zap className="w-3 h-3" />
                <span>Auto-fill</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-2 text-center">
                Enter 6-Digit 2FA Code
              </label>
              <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                {twoFactorDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      twoFactorInputRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleTwoFactorDigitChange(idx, e.target.value)}
                    className="w-11 h-13 sm:w-12 sm:h-14 rounded-2xl bg-zinc-900 border-2 border-zinc-800 text-center text-xl font-mono font-black text-amber-400 focus:outline-none focus:border-amber-500"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              Verify 2FA &amp; Complete Login
            </button>

            <button
              type="button"
              onClick={() => setMode('login')}
              className="w-full text-center text-xs text-zinc-400 hover:text-white"
            >
              ← Back to standard login
            </button>
          </form>
        )}

        {/* =========================================================================
            SIGN IN FLOW
        ========================================================================= */}
        {mode === 'login' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-zinc-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot_password');
                    setForgotEmail(email);
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className="text-xs text-amber-400 hover:underline font-bold cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-zinc-500 hover:text-zinc-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Join VIP Waitlist for 50% Discount on Signing */}
            <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border border-amber-400/40 flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-xs text-zinc-200 font-semibold">
                  Claim VIP Waitlist 50% Discount on Signing In
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-zinc-950 font-mono font-black text-[10px] shrink-0">
                50% OFF
              </span>
            </div>

            {/* Cloudflare Turnstile / reCAPTCHA */}
            <div className="pt-1">
              <CloudflareTurnstile
                theme="dark"
                isVerified={recaptchaVerified}
                onVerify={(v) => setRecaptchaVerified(v)}
                actionName="user_login"
              />
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading || rateLimitLockoutSeconds > 0}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all cursor-pointer disabled:opacity-50 mt-2"
            >
              {isLoading ? <span>Signing In...</span> : <span>Sign In to Vault</span>}
            </button>

            {/* Switch to Register */}
            <p className="text-center text-xs text-zinc-400 pt-2">
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setRegisterStep(1);
                  setErrorMessage('');
                }}
                className="text-amber-400 font-bold hover:underline cursor-pointer"
              >
                Create an account
              </button>
            </p>
          </form>
        )}

        {/* =========================================================================
            FORGOT PASSWORD FLOW
        ========================================================================= */}
        {mode === 'forgot_password' && (
          <div className="space-y-4 animate-in fade-in">
            {forgotStep === 1 ? (
              <form onSubmit={handleSendResetCode} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Your Registered Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? <span>Sending Code...</span> : <span>Send Reset Code</span>}
                </button>

                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="w-full text-center text-xs text-zinc-400 hover:text-white underline"
                >
                  Return to Sign In
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                {/* Simulated Reset Code Info */}
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs">
                  <span className="text-zinc-300">
                    Reset Code: <strong className="text-amber-400 font-mono">{generatedForgotCode}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setForgotResetCode(generatedForgotCode)}
                    className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[11px] font-bold"
                  >
                    Auto-fill
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    6-Digit Reset Code
                  </label>
                  <input
                    type="text"
                    required
                    value={forgotResetCode}
                    onChange={(e) => setForgotResetCode(e.target.value)}
                    placeholder="e.g. 492810"
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs font-mono text-center tracking-widest focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    New Password (Min. 8 chars, 1 num, 1 symbol)
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new strong password"
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? <span>Updating Password...</span> : <span>Update Password &amp; Sign In</span>}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
