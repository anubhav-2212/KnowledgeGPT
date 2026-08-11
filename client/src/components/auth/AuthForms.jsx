import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure, clearError } from '../../store/slices/authSlice';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/* ─── Icons ──────────────────────────────────────────────── */
const GoogleIcon = () => (
  <svg className="w-[18px] h-[18px] mr-2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const EyeIcon = ({ open }) =>
  open ? (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );

const SpinnerIcon = () => (
  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const AlertIcon = () => (
  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

/* ─── Input Component ────────────────────────────────────── */
function FormInput({ label, id, type = 'text', placeholder, value, onChange, error, rightElement, autoComplete }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-[13px] font-medium text-[#0d1117]">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          className={cn(
            "w-full px-4 py-2.5 rounded-xl border bg-white text-[13.5px] text-[#0d1117] placeholder:text-[#b0bac5]",
            "focus:outline-none transition-all duration-200",
            "focus:border-[#3B82C4] focus:shadow-[0_0_0_3px_rgba(59,130,196,0.12)]",
            error
              ? "border-red-400 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
              : "border-gray-200",
            rightElement ? "pr-10" : ""
          )}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
      {error && (
        <p className="flex items-center gap-1.5 text-[12px] text-red-500 mt-1">
          <AlertIcon />
          {error}
        </p>
      )}
    </div>
  );
}

/* ─── Password Input Component ───────────────────────────── */
function PasswordInput({ label, id, placeholder, value, onChange, error, showForgot = false, autoComplete }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="block text-[13px] font-medium text-[#0d1117]">
          {label}
        </label>
        {showForgot && (
          <a href="#" className="text-[12px] text-[#3B82C4] hover:text-[#296499] font-medium transition-colors">
            Forgot password?
          </a>
        )}
      </div>
      <div className="relative">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          className={cn(
            "w-full px-4 py-2.5 pr-10 rounded-xl border bg-white text-[13.5px] text-[#0d1117] placeholder:text-[#b0bac5]",
            "focus:outline-none transition-all duration-200",
            "focus:border-[#3B82C4] focus:shadow-[0_0_0_3px_rgba(59,130,196,0.12)]",
            error
              ? "border-red-400 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
              : "border-gray-200"
          )}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7a8799] hover:text-[#0d1117] transition-colors"
          tabIndex={-1}
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          <EyeIcon open={visible} />
        </button>
      </div>
      {error && (
        <p className="flex items-center gap-1.5 text-[12px] text-red-500 mt-1">
          <AlertIcon />
          {error}
        </p>
      )}
    </div>
  );
}

/* ─── Helpers ────────────────────────────────────────────── */
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ─── Main AuthForms Component ───────────────────────────── */
export default function AuthForms() {
  const dispatch = useDispatch();
  const { isLoading, error: reduxError } = useSelector((s) => s.auth);

  const [isLogin, setIsLogin] = useState(true);
  const [success, setSuccess] = useState(false);

  // Form fields
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  // Field-level errors
  const [errors, setErrors] = useState({});

  // Clear everything when switching tabs
  const switchTab = (toLogin) => {
    setIsLogin(toLogin);
    setName(''); setEmail(''); setPassword(''); setConfirmPw('');
    setErrors({});
    setSuccess(false);
    dispatch(clearError());
  };

  // Validate form and return boolean
  const validate = () => {
    const e = {};
    if (!isLogin && !name.trim()) e.name = 'Please enter your name.';
    if (!email.trim()) e.email = 'Email is required.';
    else if (!validateEmail(email)) e.email = 'Please enter a valid email address.';
    if (!password) e.password = 'Password is required.';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters.';
    if (!isLogin) {
      if (!confirmPw) e.confirmPw = 'Please confirm your password.';
      else if (confirmPw !== password) e.confirmPw = 'Passwords do not match.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    if (!validate()) return;

    dispatch(loginStart());
    // Simulate API call (replace with real API later)
    await new Promise((r) => setTimeout(r, 1400));
    // Mock: fail if email contains "fail"
    if (email.toLowerCase().includes('fail')) {
      dispatch(loginFailure('Invalid credentials. Please try again.'));
    } else {
      dispatch(loginSuccess({ name: name || email.split('@')[0], email }));
      setSuccess(true);
    }
  };

  const buttonLabel = isLoading
    ? null
    : success
    ? null
    : isLogin
    ? 'Sign in'
    : 'Create account';

  return (
    <div className="w-full max-w-[400px] flex flex-col min-h-[580px]">
      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center">

        {/* Heading */}
        <div className="mb-7">
          <h2 className="font-['DM_Serif_Display'] text-[28px] leading-snug text-[#0d1117] mb-1.5">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h2>
          <p className="text-[#7a8799] text-[13.5px]">
            {isLogin
              ? 'Enter your details to access your workspace.'
              : 'Start building your knowledge space today.'}
          </p>
        </div>

        {/* Pill Switcher */}
        <div className="flex p-1 bg-[#f1f4f8] rounded-full mb-7">
          {['Sign in', 'Sign up'].map((label, i) => {
            const active = i === 0 ? isLogin : !isLogin;
            return (
              <button
                key={label}
                type="button"
                onClick={() => switchTab(i === 0)}
                className={cn(
                  'flex-1 text-[13px] font-medium py-[9px] rounded-full transition-all duration-200',
                  active
                    ? 'bg-white text-[#0d1117] shadow-sm'
                    : 'text-[#7a8799] hover:text-[#0d1117]'
                )}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Google SSO */}
        <button
          type="button"
          className="w-full flex items-center justify-center py-[11px] px-4 bg-white border border-gray-200 rounded-xl hover:bg-[#f8fbff] active:scale-[0.99] transition-all duration-200 text-[13px] font-medium text-[#0d1117] shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center my-5">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="px-3 text-[11px] text-[#7a8799] uppercase tracking-widest font-medium">or</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Redux / Global Error Banner */}
        {reduxError && !success && (
          <div className="mb-4 flex items-start gap-2.5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-[12.5px] text-red-600">
            <AlertIcon />
            <span>{reduxError}</span>
          </div>
        )}

        {/* Success Banner */}
        {success && (
          <div className="mb-4 flex items-start gap-2.5 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[12.5px] text-emerald-700">
            <CheckIcon />
            <span>{isLogin ? 'Signed in successfully! Redirecting…' : 'Account created! Welcome to Folio.'}</span>
          </div>
        )}

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          {!isLogin && (
            <FormInput
              id="name"
              label="Your name"
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors((prev) => ({ ...prev, name: '' })); }}
              error={errors.name}
              autoComplete="name"
            />
          )}

          <FormInput
            id="email"
            label="Email address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setErrors((prev) => ({ ...prev, email: '' })); }}
            error={errors.email}
            autoComplete="email"
          />

          <PasswordInput
            id="password"
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setErrors((prev) => ({ ...prev, password: '' })); }}
            error={errors.password}
            showForgot={isLogin}
            autoComplete={isLogin ? 'current-password' : 'new-password'}
          />

          {!isLogin && (
            <PasswordInput
              id="confirmPw"
              label="Confirm password"
              placeholder="••••••••"
              value={confirmPw}
              onChange={(e) => { setConfirmPw(e.target.value); setErrors((prev) => ({ ...prev, confirmPw: '' })); }}
              error={errors.confirmPw}
              autoComplete="new-password"
            />
          )}

          {/* CTA */}
          <button
            type="submit"
            disabled={isLoading || success}
            className={cn(
              "w-full mt-2 py-[11px] px-4 rounded-xl text-[13.5px] font-medium transition-all duration-200",
              "flex items-center justify-center gap-2",
              "active:scale-[0.98]",
              isLoading || success
                ? "bg-[#3B82C4]/70 text-white cursor-not-allowed"
                : "bg-[#3B82C4] hover:bg-[#296499] text-white shadow-[0_1px_3px_rgba(59,130,196,0.25)]"
            )}
          >
            {isLoading ? (
              <><SpinnerIcon /><span>Please wait…</span></>
            ) : success ? (
              <><CheckIcon /><span>Done</span></>
            ) : (
              <span>{buttonLabel}</span>
            )}
          </button>
        </form>

        {/* Switch Mode */}
        <div className="mt-7 text-center">
          <p className="text-[13px] text-[#7a8799]">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => switchTab(!isLogin)}
              className="text-[#3B82C4] hover:text-[#296499] font-medium transition-colors"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>

          {!isLogin && (
            <p className="text-[11.5px] text-[#7a8799] mt-4 leading-relaxed">
              By creating an account, you agree to our{' '}
              <a href="#" className="underline underline-offset-2 hover:text-[#0d1117] transition-colors">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="underline underline-offset-2 hover:text-[#0d1117] transition-colors">Privacy Policy</a>.
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-10 text-center">
        <p className="text-[11px] text-[#b0bac5]">
          © {new Date().getFullYear()} Folio, Inc. All rights reserved.
        </p>
      </div>
    </div>
  );
}
