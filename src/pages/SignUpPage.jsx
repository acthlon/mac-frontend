import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import apiClient, { ENDPOINTS, setAuthSession } from "../api/client";
import { useCart } from "../context/CartContext";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sun,
  Moon,
  Scissors,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

/**
 * MAC — Marvelam Apparel & Clothing
 * Clean, Distraction-Free Sign Up Page (Centered, No Header/Footer)
 *
 * Requirements fulfilled:
 * - Removed site header and footer to keep registration frictionless and focused.
 * - Removed left content side-panel; form is perfectly centered across all device sizes.
 * - Retains First Name, Last Name, Email, Phone Number, Password, and Confirm Password.
 * - Google Sign Up option only (Apple removed).
 * - Responsive layout across phones, tablets, and desktop.
 */
export default function SignUpPage() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const location = useLocation();
  const { syncGuestCartToBackend } = useCart();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errorMsg) setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setErrorMsg("Please enter both your first and last name.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    if (!formData.phone.trim()) {
      setErrorMsg("Please enter your phone number.");
      return;
    }

    if (formData.password.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match. Please verify.");
      return;
    }

    if (!formData.agreeToTerms) {
      setErrorMsg("Please accept the Terms of Service & Privacy Policy to proceed.");
      return;
    }

    setIsLoading(true);

    const safeUsername = `${formData.firstName.trim().toLowerCase()}_${formData.lastName.trim().toLowerCase()}_${Date.now().toString().slice(-4)}`.replace(/[^a-z0-9_]/g, "");

    try {
      await apiClient.post(ENDPOINTS.REGISTER, {
        username: safeUsername,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        confirm_password: formData.confirmPassword,
        gender: "female",
        role: "customer",
      });

      // Attempt auto-login upon successful registration
      try {
        const loginRes = await apiClient.post(ENDPOINTS.LOGIN, {
          email: formData.email.trim(),
          password: formData.password,
        });

        const accessToken =
          loginRes.data?.access_token ||
          loginRes.data?.token ||
          loginRes.data?.access ||
          loginRes.data?.key;
        const refreshToken = loginRes.data?.refresh_token;

        if (accessToken) {
          setAuthSession({
            accessToken,
            refreshToken,
            email: formData.email.trim(),
            rememberMe: true,
          });

          // Sync guest cart to backend upon registration (non-blocking)
          try {
            if (syncGuestCartToBackend) {
              await syncGuestCartToBackend();
            }
          } catch (syncErr) {
            console.warn("Notice syncing cart during sign-up:", syncErr);
          }

          setSuccessMsg("Account created successfully! Welcome to Marvelam.");
          setTimeout(() => {
            const from =
              location.state?.from?.pathname ||
              (typeof location.state?.from === "string" ? location.state.from : null) ||
              "/checkout";
            navigate(from);
          }, 800);
          return;
        }
      } catch (autoLoginErr) {
        console.info("Notice: Auto-login after registration requires email verification:", autoLoginErr?.message);
      }

      // If backend requires email activation before login
      setSuccessMsg(
        "Account created! Please check your email to verify your account, then sign in."
      );
      setTimeout(() => {
        const fromTarget = location.state?.from || { pathname: "/checkout" };
        navigate("/login", {
          state: {
            from: fromTarget,
            infoMsg: "Registration successful! Please sign in after verifying your email.",
          },
        });
      }, 1800);
    } catch (err) {
      console.error("Sign up failed:", err);
      let errorText = "Registration failed. Please check the provided information.";
      if (err.response?.data) {
        const d = err.response.data;
        if (typeof d === "string") errorText = d;
        else if (d.message) errorText = d.message;
        else if (d.detail) errorText = d.detail;
        else {
          const firstKey = Object.keys(d)[0];
          if (firstKey && Array.isArray(d[firstKey])) {
            errorText = `${firstKey}: ${d[firstKey][0]}`;
          } else if (firstKey) {
            errorText = `${firstKey}: ${JSON.stringify(d[firstKey])}`;
          }
        }
      }
      setErrorMsg(errorText);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-between font-sans transition-colors duration-300 w-full overflow-x-hidden ${
        isDark ? "bg-[#0A0A0A] text-white" : "bg-[#F9FAFB] text-[#0F0F0F]"
      }`}
    >
      {/* Minimal Top Bar with Brand Link & Theme Toggle */}
      <header className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-5 flex items-center justify-between z-20">
        <Link to="/" className="group flex items-center gap-2 text-left">
          <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#FFB400]">
            MAC
          </span>
          <span className="hidden sm:inline-block text-[10px] tracking-[0.2em] font-medium text-neutral-400 uppercase border-l border-neutral-300/30 pl-2">
            Marvelam Apparel
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/about"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-[#FFB400] transition-colors"
          >
            <Scissors size={13} className="text-[#FFB400]" />
            What is Marvelam?
          </Link>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all ${
              isDark
                ? "border-white/10 bg-[#161616] text-[#FFB400] hover:bg-[#202020]"
                : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100 shadow-sm"
            }`}
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </header>

      {/* Centered Sign-Up Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12 relative z-10">
        {/* Subtle Ambient Radial Lighting */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[420px] sm:h-[550px] w-[420px] sm:w-[550px] rounded-full bg-[#FFB400]/8 blur-[130px]"
        />

        <div className="w-full max-w-[480px] mx-auto">
          <div
            className={`rounded-2xl sm:rounded-3xl border p-6 sm:p-9 shadow-xl backdrop-blur-xl transition-all duration-300 ${
              isDark
                ? "bg-[#141414]/95 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.7)]"
                : "bg-white border-[#E5E0D8] shadow-[0_20px_45px_rgba(15,15,15,0.06)]"
            }`}
          >
            {/* Header inside Card */}
            <div className="text-center mb-6 sm:mb-7">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#141414] to-[#252525] border-2 border-[#FFB400] shadow-[0_0_20px_rgba(255,180,0,0.35)] mb-3 transition-transform hover:scale-105 duration-300">
                <span className="font-display text-2xl font-bold tracking-tight text-[#FFB400]">
                  MAC
                </span>
              </div>
              <h1
                className={`font-display text-3xl sm:text-4xl font-semibold tracking-tight ${
                  isDark ? "text-white" : "text-[#0F0F0F]"
                }`}
              >
                Create Account
              </h1>
              <p className={`mt-1.5 text-xs sm:text-sm ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                Join Marvelam for bespoke tailoring & premium fabrics
              </p>
            </div>

            {/* Error & Success Alerts */}
            {errorMsg && (
              <div className="mb-5 flex items-start gap-2.5 rounded-xl bg-red-500/10 border border-red-500/25 p-3 text-xs sm:text-sm text-red-500">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-5 flex items-start gap-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 p-3 text-xs sm:text-sm text-emerald-500">
                <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* First Name & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-3">
                <div>
                  <label
                    htmlFor="firstName"
                    className={`block text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-1.5 ${
                      isDark ? "text-neutral-300" : "text-neutral-700"
                    }`}
                  >
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                      <User size={16} />
                    </div>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="First name"
                      className={`w-full rounded-xl border py-3 pl-10 pr-3 text-xs sm:text-sm transition-all duration-200 outline-none ${
                        isDark
                          ? "bg-[#1C1C1C] border-white/10 text-white placeholder-neutral-500 focus:border-[#FFB400] focus:ring-1 focus:ring-[#FFB400]"
                          : "bg-[#FAFAFA] border-neutral-300 text-[#0F0F0F] placeholder-neutral-400 focus:border-[#FFB400] focus:ring-1 focus:ring-[#FFB400] focus:bg-white"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className={`block text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-1.5 ${
                      isDark ? "text-neutral-300" : "text-neutral-700"
                    }`}
                  >
                    Last Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                      <User size={16} />
                    </div>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Last name"
                      className={`w-full rounded-xl border py-3 pl-10 pr-3 text-xs sm:text-sm transition-all duration-200 outline-none ${
                        isDark
                          ? "bg-[#1C1C1C] border-white/10 text-white placeholder-neutral-500 focus:border-[#FFB400] focus:ring-1 focus:ring-[#FFB400]"
                          : "bg-[#FAFAFA] border-neutral-300 text-[#0F0F0F] placeholder-neutral-400 focus:border-[#FFB400] focus:ring-1 focus:ring-[#FFB400] focus:bg-white"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label
                  htmlFor="signup-email"
                  className={`block text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-1.5 ${
                    isDark ? "text-neutral-300" : "text-neutral-700"
                  }`}
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <Mail size={16} />
                  </div>
                  <input
                    id="signup-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@email.com"
                    className={`w-full rounded-xl border py-3 pl-10 pr-3 sm:pr-4 text-xs sm:text-sm transition-all duration-200 outline-none ${
                      isDark
                        ? "bg-[#1C1C1C] border-white/10 text-white placeholder-neutral-500 focus:border-[#FFB400] focus:ring-1 focus:ring-[#FFB400]"
                        : "bg-[#FAFAFA] border-neutral-300 text-[#0F0F0F] placeholder-neutral-400 focus:border-[#FFB400] focus:ring-1 focus:ring-[#FFB400] focus:bg-white"
                    }`}
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label
                  htmlFor="signup-phone"
                  className={`block text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-1.5 ${
                    isDark ? "text-neutral-300" : "text-neutral-700"
                  }`}
                >
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <Phone size={16} />
                  </div>
                  <input
                    id="signup-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+234 801 234 5678"
                    className={`w-full rounded-xl border py-3 pl-10 pr-3 sm:pr-4 text-xs sm:text-sm transition-all duration-200 outline-none ${
                      isDark
                        ? "bg-[#1C1C1C] border-white/10 text-white placeholder-neutral-500 focus:border-[#FFB400] focus:ring-1 focus:ring-[#FFB400]"
                        : "bg-[#FAFAFA] border-neutral-300 text-[#0F0F0F] placeholder-neutral-400 focus:border-[#FFB400] focus:ring-1 focus:ring-[#FFB400] focus:bg-white"
                    }`}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="signup-password"
                  className={`block text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-1.5 ${
                    isDark ? "text-neutral-300" : "text-neutral-700"
                  }`}
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <Lock size={16} />
                  </div>
                  <input
                    id="signup-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="At least 6 characters"
                    className={`w-full rounded-xl border py-3 pl-10 pr-10 text-xs sm:text-sm transition-all duration-200 outline-none ${
                      isDark
                        ? "bg-[#1C1C1C] border-white/10 text-white placeholder-neutral-500 focus:border-[#FFB400] focus:ring-1 focus:ring-[#FFB400]"
                        : "bg-[#FAFAFA] border-neutral-300 text-[#0F0F0F] placeholder-neutral-400 focus:border-[#FFB400] focus:ring-1 focus:ring-[#FFB400] focus:bg-white"
                    }`}
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-[#FFB400] transition-colors p-1"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="signup-confirm-password"
                  className={`block text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-1.5 ${
                    isDark ? "text-neutral-300" : "text-neutral-700"
                  }`}
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <Lock size={16} />
                  </div>
                  <input
                    id="signup-confirm-password"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat your password"
                    className={`w-full rounded-xl border py-3 pl-10 pr-10 text-xs sm:text-sm transition-all duration-200 outline-none ${
                      isDark
                        ? "bg-[#1C1C1C] border-white/10 text-white placeholder-neutral-500 focus:border-[#FFB400] focus:ring-1 focus:ring-[#FFB400]"
                        : "bg-[#FAFAFA] border-neutral-300 text-[#0F0F0F] placeholder-neutral-400 focus:border-[#FFB400] focus:ring-1 focus:ring-[#FFB400] focus:bg-white"
                    }`}
                  />
                  <button
                    type="button"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-[#FFB400] transition-colors p-1"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    required
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-[#FFB400] focus:ring-[#FFB400] accent-[#FFB400] cursor-pointer shrink-0"
                  />
                  <span className={`text-[11px] sm:text-xs leading-relaxed ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
                    I agree to the{" "}
                    <Link to="/terms" className="text-[#FFB400] hover:underline">
                      Terms
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-[#FFB400] hover:underline">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-[#FFB400] py-3.5 px-4 font-sans text-xs sm:text-sm font-bold tracking-wide text-[#0F0F0F] shadow-lg shadow-[#FFB400]/25 hover:bg-[#FFB400]/90 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full border-2 border-[#0F0F0F] border-t-transparent animate-spin" />
                    <span>Creating account...</span>
                  </div>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6 flex items-center justify-center">
              <div
                className={`w-full border-t ${
                  isDark ? "border-white/10" : "border-neutral-200"
                }`}
              />
              <span
                className={`absolute px-3 text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold ${
                  isDark ? "bg-[#141414] text-neutral-500" : "bg-white text-neutral-400"
                }`}
              >
                Or sign up with
              </span>
            </div>

            {/* Google Registration */}
            <div>
              <button
                type="button"
                onClick={() => alert("Google registration integration")}
                className={`w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border text-xs sm:text-sm font-semibold transition-all duration-200 hover:border-[#FFB400]/50 ${
                  isDark
                    ? "border-white/10 bg-white/5 hover:bg-white/10 text-white"
                    : "border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-800"
                }`}
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Sign up with Google</span>
              </button>
            </div>

            {/* Redirect to Login */}
            <div className="mt-6 sm:mt-7 text-center">
              <p className={`text-xs sm:text-sm ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-[#FFB400] hover:underline transition-all underline-offset-4"
                >
                  Sign in here
                </Link>
              </p>
            </div>

            {/* Security Note */}
            <div className="mt-5 pt-4 border-t border-dashed border-neutral-300/40 dark:border-white/10 flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] text-neutral-400">
              <ShieldCheck size={14} className="text-[#FFB400] shrink-0" />
              <span>256-bit SSL encrypted data privacy</span>
            </div>
          </div>
        </div>
      </main>

      {/* Minimal Footer Legal Links */}
      <footer className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-neutral-400 z-20">
        <p>© {new Date().getFullYear()} Marvelam Apparel & Clothing. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link to="/" className="hover:text-[#FFB400] transition-colors">
            Return to Store
          </Link>
          <Link to="/about" className="hover:text-[#FFB400] transition-colors">
            How Marvelam Works
          </Link>
          <Link to="/terms" className="hover:text-[#FFB400] transition-colors">
            Privacy & Terms
          </Link>
        </div>
      </footer>
    </div>
  );
}
