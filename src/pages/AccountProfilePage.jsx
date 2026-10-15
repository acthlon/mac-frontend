import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  Shield,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Camera,
  Scissors,
  Package,
  Heart,
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronRight,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  Award,
  Bell,
  Check,
  ExternalLink,
  Smartphone,
  Laptop,
  Globe,
  Clock,
  ArrowRight,
  Save,
  X,
  CreditCard,
} from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useTheme } from "../context/ThemeContext";
import apiClient, { ENDPOINTS, isAuthenticated, logout } from "../api/client";
import formatNaira from "../utils/formatNaira";

export default function AccountProfilePage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const location = useLocation();

  // Active tab state: 'profile' | 'measurements' | 'addresses' | 'security' | 'preferences'
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get("tab") || "profile";
  });

  // User state
  const storedEmail =
    localStorage.getItem("mac_user_email") ||
    sessionStorage.getItem("mac_user_email") ||
    "aliakintayo04@gmail.com";

  const [personalInfo, setPersonalInfo] = useState({
    firstName: "Ali",
    lastName: "Akintayo",
    email: storedEmail,
    phone: "+234 801 234 5678",
    altPhone: "+234 809 876 5432",
    gender: "Male",
    dateOfBirth: "1994-08-16",
    streetAddress: "15 Admiralty Way, Lekki Phase 1",
    city: "Lekki",
    state: "Lagos",
    country: "Nigeria",
    bio: "Lover of bespoke African luxury agbada and minimalist modern cuts.",
    avatarUrl: null,
  });

  // Bespoke Measurements State (Brand Tailoring Hub)
  const [measurementUnit, setMeasurementUnit] = useState("inches"); // 'inches' | 'cm'
  const [activeMeasurementProfile, setActiveMeasurementProfile] = useState("Agbada Traditional");
  const [measurements, setMeasurements] = useState({
    neck: "16.5",
    chest: "42.0",
    shoulder: "19.5",
    sleeve: "34.0",
    shirtLength: "32.0",
    waist: "35.0",
    hip: "42.5",
    trouserLength: "41.0",
    thigh: "25.0",
    ankle: "15.0",
    agbadaSpan: "66.0",
    height: "6'1\"",
    preferredFit: "Tailored Regular", // 'Slim Fit' | 'Tailored Regular' | 'Traditional Loose'
    atelierNotes: "Keep armholes roomy for traditional inner kaftan layering.",
  });

  // Saved Addresses State
  const [addresses, setAddresses] = useState([
    {
      id: "addr-1",
      title: "Home (Primary)",
      fullName: "Ali Akintayo",
      phone: "+234 801 234 5678",
      address: "15 Admiralty Way, Lekki Phase 1",
      city: "Lekki",
      state: "Lagos",
      country: "Nigeria",
      additionalInfo: "Ring the black gate doorbell upon arrival.",
      isDefault: true,
      type: "HOME",
    },
    {
      id: "addr-2",
      title: "Victoria Island Office",
      fullName: "Ali Akintayo",
      phone: "+234 809 876 5432",
      address: "Plot 1204 Ahmadu Bello Way, VI",
      city: "Victoria Island",
      state: "Lagos",
      country: "Nigeria",
      additionalInfo: "Deliver to 3rd Floor Reception (Palfe Associate).",
      isDefault: false,
      type: "OFFICE",
    },
  ]);

  // Security Form State
  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: true,
  });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Notification Preferences State
  const [notifications, setNotifications] = useState({
    orderUpdatesSms: true,
    orderUpdatesWhatsapp: true,
    exclusiveDrops: true,
    fabricRestockAlerts: true,
    atelierNewsletter: false,
  });

  // UI States
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [newAddressForm, setNewAddressForm] = useState({
    title: "New Address",
    fullName: "",
    phone: "",
    address: "",
    city: "Lagos",
    state: "Lagos",
    country: "Nigeria",
    additionalInfo: "",
    isDefault: false,
    type: "HOME",
  });

  // Trigger feedback toast
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Handle Logout
  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate("/login");
  };

  // Avatar Upload simulation
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPersonalInfo((prev) => ({ ...prev, avatarUrl: previewUrl }));
      showToast("Profile photograph updated successfully.");
    }
  };

  // Save Personal Profile
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast("Account details saved successfully.");
    }, 600);
  };

  // Save Measurements
  const handleSaveMeasurements = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast(`Bespoke measurements for "${activeMeasurementProfile}" saved.`);
    }, 600);
  };

  // Save Password / Security
  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!securityData.currentPassword) {
      showToast("Please enter your current password.");
      return;
    }
    if (securityData.newPassword !== securityData.confirmPassword) {
      showToast("New passwords do not match.");
      return;
    }
    if (securityData.newPassword.length < 8) {
      showToast("Password must be at least 8 characters long.");
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSecurityData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      showToast("Password changed successfully.");
    }, 700);
  };

  // Address Actions
  const handleSetDefaultAddress = (id) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
    showToast("Default delivery address updated.");
  };

  const handleDeleteAddress = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    showToast("Address removed from your address book.");
  };

  const handleSaveAddressModal = (e) => {
    e.preventDefault();
    if (editingAddressId) {
      setAddresses((prev) =>
        prev.map((a) => (a.id === editingAddressId ? { ...newAddressForm, id: editingAddressId } : a))
      );
      showToast("Address updated.");
    } else {
      const newId = `addr-${Date.now()}`;
      if (newAddressForm.isDefault) {
        setAddresses((prev) => [
          ...prev.map((a) => ({ ...a, isDefault: false })),
          { ...newAddressForm, id: newId },
        ]);
      } else {
        setAddresses((prev) => [...prev, { ...newAddressForm, id: newId }]);
      }
      showToast("New address added.");
    }
    setAddressModalOpen(false);
    setEditingAddressId(null);
  };

  const openEditAddressModal = (addr) => {
    setEditingAddressId(addr.id);
    setNewAddressForm(addr);
    setAddressModalOpen(true);
  };

  const openAddAddressModal = () => {
    setEditingAddressId(null);
    setNewAddressForm({
      title: "Home",
      fullName: `${personalInfo.firstName} ${personalInfo.lastName}`,
      phone: personalInfo.phone,
      address: "",
      city: "Lekki",
      state: "Lagos",
      country: "Nigeria",
      additionalInfo: "",
      isDefault: addresses.length === 0,
      type: "HOME",
    });
    setAddressModalOpen(true);
  };

  const userInitials =
    `${personalInfo.firstName?.[0] || "M"}${personalInfo.lastName?.[0] || "A"}`.toUpperCase();

  // Navigation tabs list
  const NAV_ITEMS = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, link: "/account/orders" },
    { id: "orders", label: "Orders", icon: Package, link: "/account/orders" },
    { id: "profile", label: "Personal Details", icon: User },
    { id: "measurements", label: "Bespoke Measurements", icon: Scissors, badge: "Atelier" },
    { id: "addresses", label: "Saved Addresses", icon: MapPin },
    { id: "security", label: "Security & Passwords", icon: Shield },
    { id: "preferences", label: "Notifications & Style", icon: Bell },
  ];

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-300 ${
        isDark ? "bg-[#0F0F0F] text-white" : "bg-[#F9FAFB] text-[#0F0F0F]"
      }`}
    >
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-[#FFB400]/40 bg-[#0F0F0F] px-5 py-3.5 text-sm text-white shadow-2xl animate-in slide-in-from-bottom-5">
          <CheckCircle2 size={18} className="text-[#FFB400] shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Main Storefront Header */}
      <Header />

      <main className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className={`mb-6 flex flex-wrap items-center gap-2 text-xs ${
            isDark ? "text-white/50" : "text-[#0F0F0F]/60"
          }`}
        >
          <Link to="/" className="hover:text-[#FFB400] transition-colors">
            Home
          </Link>
          <ChevronRight size={13} className="shrink-0" />
          <Link to="/account/orders" className="hover:text-[#FFB400] transition-colors">
            My Account
          </Link>
          <ChevronRight size={13} className="shrink-0" />
          <span className="text-[#FFB400] font-medium capitalize">
            {activeTab === "profile"
              ? "Personal Profile"
              : activeTab === "measurements"
              ? "Bespoke Measurements"
              : activeTab === "addresses"
              ? "Saved Addresses"
              : activeTab === "security"
              ? "Account Security"
              : "Preferences"}
          </span>
        </nav>

        {/* Master Account Profile Layout: Sidebar + Main Content Panel */}
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* ========================================================= */}
          {/* LEFT COLUMN: User Summary Card & Navigation Sidebar       */}
          {/* ========================================================= */}
          <aside className="w-full shrink-0 lg:w-72">
            <div className="sticky top-28 space-y-6">
              {/* User Identity Profile Card */}
              <div
                className={`overflow-hidden rounded-2xl border transition-all ${
                  isDark
                    ? "border-white/10 bg-[#151515] shadow-lg shadow-black/40"
                    : "border-neutral-200 bg-white shadow-sm"
                }`}
              >
                {/* Decorative Atelier Header Strip */}
                <div className="h-16 bg-gradient-to-r from-[#FFB400]/20 via-[#FFB400]/40 to-[#FFB400]/10 border-b border-[#FFB400]/20" />

                <div className="relative px-6 pb-6 pt-0">
                  {/* Avatar with Camera Overlay */}
                  <div className="-mt-10 relative mb-4 inline-block">
                    {personalInfo.avatarUrl ? (
                      <img
                        src={personalInfo.avatarUrl}
                        alt={`${personalInfo.firstName} ${personalInfo.lastName}`}
                        className="h-20 w-20 rounded-full border-4 border-white dark:border-[#151515] object-cover shadow-md"
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white dark:border-[#151515] bg-[#FFB400]/15 font-display text-2xl font-bold text-[#FFB400] shadow-md">
                        {userInitials}
                      </div>
                    )}

                    <label
                      htmlFor="avatar-upload"
                      className="absolute bottom-0 right-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-[#FFB400] text-[#0F0F0F] shadow transition-transform hover:scale-110 active:scale-95"
                      title="Upload profile photo"
                    >
                      <Camera size={13} className="stroke-[2.5]" />
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </label>
                  </div>

                  {/* Name & Atelier Status Badge */}
                  <div className="flex items-center gap-2">
                    <h2
                      className={`font-display text-xl font-bold leading-tight ${
                        isDark ? "text-white" : "text-[#0F0F0F]"
                      }`}
                    >
                      {personalInfo.firstName} {personalInfo.lastName}
                    </h2>
                    <span className="flex items-center gap-1 rounded-full bg-[#FFB400]/15 px-2 py-0.5 text-[10px] font-semibold text-[#FFB400]">
                      <Sparkles size={10} />
                      VIP
                    </span>
                  </div>

                  <p
                    className={`mt-1 truncate font-sans text-xs ${
                      isDark ? "text-white/50" : "text-[#0F0F0F]/60"
                    }`}
                  >
                    {personalInfo.email}
                  </p>

                  {/* Loyalty Points / Tier Progress */}
                  <div
                    className={`mt-4 rounded-xl border p-3 ${
                      isDark ? "border-white/5 bg-[#1C1C1C]" : "border-neutral-100 bg-[#F9FAFB]"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 font-medium text-[#FFB400]">
                        <Award size={14} />
                        Gold Tier Patron
                      </span>
                      <span className="font-semibold text-xs">2,850 Pts</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-neutral-200 dark:bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#FFB400] transition-all duration-500"
                        style={{ width: "72%" }}
                      />
                    </div>
                    <p
                      className={`mt-1.5 text-[10px] ${
                        isDark ? "text-white/40" : "text-neutral-500"
                      }`}
                    >
                      150 points away from Platinum Atelier VIP status
                    </p>
                  </div>
                </div>

                {/* Navigation Links */}
                <nav
                  aria-label="Account Tabs"
                  className={`border-t px-3 py-3 ${
                    isDark ? "border-white/10" : "border-neutral-200"
                  }`}
                >
                  <ul className="space-y-1">
                    {NAV_ITEMS.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;

                      if (item.link) {
                        return (
                          <li key={item.id}>
                            <Link
                              to={item.link}
                              className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                                isDark
                                  ? "text-white/70 hover:bg-white/5 hover:text-white"
                                  : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <Icon
                                  size={17}
                                  className="text-neutral-400 group-hover:text-[#FFB400] transition-colors"
                                />
                                <span>{item.label}</span>
                              </div>
                              <ChevronRight size={14} className="opacity-40" />
                            </Link>
                          </li>
                        );
                      }

                      return (
                        <li key={item.id}>
                          <button
                            type="button"
                            onClick={() => setActiveTab(item.id)}
                            className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all cursor-pointer ${
                              isActive
                                ? isDark
                                  ? "bg-[#FFB400]/15 text-[#FFB400] font-semibold"
                                  : "bg-[#FFB400]/15 text-[#B37D00] font-semibold"
                                : isDark
                                ? "text-white/70 hover:bg-white/5 hover:text-white"
                                : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Icon
                                size={17}
                                className={
                                  isActive
                                    ? "text-[#FFB400]"
                                    : "text-neutral-400 group-hover:text-[#FFB400] transition-colors"
                                }
                              />
                              <span>{item.label}</span>
                            </div>

                            {item.badge ? (
                              <span className="rounded-full bg-[#FFB400]/20 px-2 py-0.5 text-[10px] font-bold text-[#FFB400]">
                                {item.badge}
                              </span>
                            ) : (
                              isActive && (
                                <span className="h-1.5 w-1.5 rounded-full bg-[#FFB400]" />
                              )
                            )}
                          </button>
                        </li>
                      );
                    })}

                    {/* Logout Button */}
                    <li className="pt-2">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                      >
                        <LogOut size={17} className="transition-transform group-hover:-translate-x-0.5" />
                        <span>Sign Out</span>
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>

              {/* Atelier Concierge Box */}
              <div
                className={`rounded-2xl border p-5 transition-all ${
                  isDark
                    ? "border-[#FFB400]/20 bg-gradient-to-b from-[#1C180E] to-[#151515]"
                    : "border-[#FFB400]/30 bg-gradient-to-b from-[#FFFDF7] to-white"
                }`}
              >
                <div className="flex items-center gap-2 text-[#FFB400] font-display text-base font-semibold">
                  <Scissors size={16} />
                  <span>Personal Atelier Tailor</span>
                </div>
                <p
                  className={`mt-2 text-xs leading-relaxed ${
                    isDark ? "text-white/60" : "text-neutral-600"
                  }`}
                >
                  Need bespoke fitting adjustments or advice on premium fabric selections for your
                  next occasion?
                </p>
                <a
                  href="https://wa.me/2348000000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3.5 inline-flex items-center gap-2 rounded-lg bg-[#FFB400] px-3.5 py-2 text-xs font-semibold text-[#0F0F0F] transition-all hover:bg-[#FFB400]/90 hover:scale-[1.02] shadow-sm"
                >
                  <span>Chat with Master Stylist</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </aside>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: Interactive Profile Panels                  */}
          {/* ========================================================= */}
          <section className="flex-1 min-w-0">
            {/* Quick Hero Banner with Stat Cards */}
            <header
              className={`mb-6 rounded-2xl border p-6 transition-all ${
                isDark
                  ? "border-white/10 bg-[#151515]"
                  : "border-neutral-200 bg-white shadow-sm"
              }`}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#FFB400] uppercase">
                    <Sparkles size={13} />
                    <span>Marvelam Haute Couture Profile</span>
                  </div>
                  <h1
                    className={`mt-1 font-display text-3xl font-bold sm:text-4xl ${
                      isDark ? "text-white" : "text-[#0F0F0F]"
                    }`}
                  >
                    Welcome back, {personalInfo.firstName}
                  </h1>
                  <p
                    className={`mt-1 text-xs sm:text-sm ${
                      isDark ? "text-white/60" : "text-neutral-600"
                    }`}
                  >
                    Review your account settings, bespoke measurement profiles, and address book.
                  </p>
                </div>

                <Link
                  to="/catalog"
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#FFB400] px-4 py-2.5 font-sans text-xs font-bold text-[#0F0F0F] transition-all hover:bg-[#FFB400]/90 hover:scale-105 shadow-md shadow-[#FFB400]/20"
                >
                  <span>Explore New Arrivals</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              {/* 4 Stat Cards */}
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                <div
                  className={`rounded-xl border p-3.5 ${
                    isDark ? "border-white/5 bg-[#1C1C1C]" : "border-neutral-100 bg-[#F9FAFB]"
                  }`}
                >
                  <p className={`text-[11px] font-medium ${isDark ? "text-white/50" : "text-neutral-500"}`}>
                    Completed Orders
                  </p>
                  <p className="mt-1 font-display text-xl font-bold text-[#FFB400]">14 Orders</p>
                  <p className="mt-0.5 text-[10px] text-emerald-500 font-medium">1 in transit</p>
                </div>

                <div
                  className={`rounded-xl border p-3.5 ${
                    isDark ? "border-white/5 bg-[#1C1C1C]" : "border-neutral-100 bg-[#F9FAFB]"
                  }`}
                >
                  <p className={`text-[11px] font-medium ${isDark ? "text-white/50" : "text-neutral-500"}`}>
                    Atelier Points
                  </p>
                  <p className="mt-1 font-display text-xl font-bold text-[#FFB400]">2,850</p>
                  <p className={`mt-0.5 text-[10px] ${isDark ? "text-white/40" : "text-neutral-500"}`}>
                    Worth {formatNaira(28500)}
                  </p>
                </div>

                <div
                  className={`rounded-xl border p-3.5 ${
                    isDark ? "border-white/5 bg-[#1C1C1C]" : "border-neutral-100 bg-[#F9FAFB]"
                  }`}
                >
                  <p className={`text-[11px] font-medium ${isDark ? "text-white/50" : "text-neutral-500"}`}>
                    Fit Profiles
                  </p>
                  <p className="mt-1 font-display text-xl font-bold text-[#FFB400]">3 Saved</p>
                  <p className="mt-0.5 text-[10px] text-emerald-500 font-medium">Verified by tailor</p>
                </div>

                <div
                  className={`rounded-xl border p-3.5 ${
                    isDark ? "border-white/5 bg-[#1C1C1C]" : "border-neutral-100 bg-[#F9FAFB]"
                  }`}
                >
                  <p className={`text-[11px] font-medium ${isDark ? "text-white/50" : "text-neutral-500"}`}>
                    Primary City
                  </p>
                  <p className="mt-1 font-display text-xl font-bold truncate text-[#FFB400]">
                    {personalInfo.city}
                  </p>
                  <p className={`mt-0.5 text-[10px] truncate ${isDark ? "text-white/40" : "text-neutral-500"}`}>
                    Lekki Phase 1
                  </p>
                </div>
              </div>
            </header>

            {/* Mobile Tab Scroller for Easy Switch on Small Screens */}
            <div className="mb-6 flex gap-2 overflow-x-auto pb-1 lg:hidden no-scrollbar">
              {NAV_ITEMS.filter((i) => !i.link).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                    activeTab === item.id
                      ? "bg-[#FFB400] text-[#0F0F0F] shadow-sm"
                      : isDark
                      ? "bg-[#181818] text-white/70 hover:bg-[#202020]"
                      : "bg-white text-neutral-600 border border-neutral-200"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* ========================================================= */}
            {/* TAB 1: PERSONAL DETAILS                                  */}
            {/* ========================================================= */}
            {activeTab === "profile" && (
              <article
                className={`rounded-2xl border p-6 sm:p-8 transition-all ${
                  isDark
                    ? "border-white/10 bg-[#151515]"
                    : "border-neutral-200 bg-white shadow-sm"
                }`}
              >
                <div className="border-b pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-inherit">
                  <div>
                    <h3
                      className={`font-display text-2xl font-bold ${
                        isDark ? "text-white" : "text-[#0F0F0F]"
                      }`}
                    >
                      Personal Details &amp; Contact
                    </h3>
                    <p
                      className={`mt-1 text-xs sm:text-sm ${
                        isDark ? "text-white/60" : "text-neutral-600"
                      }`}
                    >
                      Update your contact information for order dispatches, receipts, and atelier notifications.
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-500 border border-emerald-500/30">
                    <CheckCircle2 size={13} />
                    Verified Customer
                  </span>
                </div>

                <form onSubmit={handleSaveProfile} className="mt-6 space-y-6">
                  {/* Row 1: First Name & Last Name */}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label
                        className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                          isDark ? "text-white/70" : "text-neutral-700"
                        }`}
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        required
                        value={personalInfo.firstName}
                        onChange={(e) =>
                          setPersonalInfo({ ...personalInfo, firstName: e.target.value })
                        }
                        className={`w-full rounded-xl border px-4 py-3 text-sm font-medium transition-all focus:border-[#FFB400] focus:outline-none ${
                          isDark
                            ? "border-white/15 bg-[#1C1C1C] text-white focus:bg-[#202020]"
                            : "border-neutral-300 bg-white text-[#0F0F0F] focus:border-[#FFB400]"
                        }`}
                      />
                    </div>

                    <div>
                      <label
                        className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                          isDark ? "text-white/70" : "text-neutral-700"
                        }`}
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        required
                        value={personalInfo.lastName}
                        onChange={(e) =>
                          setPersonalInfo({ ...personalInfo, lastName: e.target.value })
                        }
                        className={`w-full rounded-xl border px-4 py-3 text-sm font-medium transition-all focus:border-[#FFB400] focus:outline-none ${
                          isDark
                            ? "border-white/15 bg-[#1C1C1C] text-white focus:bg-[#202020]"
                            : "border-neutral-300 bg-white text-[#0F0F0F] focus:border-[#FFB400]"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Row 2: Email & Phone */}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label
                        className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                          isDark ? "text-white/70" : "text-neutral-700"
                        }`}
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          value={personalInfo.email}
                          onChange={(e) =>
                            setPersonalInfo({ ...personalInfo, email: e.target.value })
                          }
                          className={`w-full rounded-xl border pl-11 pr-4 py-3 text-sm font-medium transition-all focus:border-[#FFB400] focus:outline-none ${
                            isDark
                              ? "border-white/15 bg-[#1C1C1C] text-white"
                              : "border-neutral-300 bg-white text-[#0F0F0F]"
                          }`}
                        />
                        <Mail
                          size={16}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                        />
                      </div>
                      <p className="mt-1.5 text-[11px] text-[#FFB400]">
                        Primary address used for tracking and digital receipts.
                      </p>
                    </div>

                    <div>
                      <label
                        className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                          isDark ? "text-white/70" : "text-neutral-700"
                        }`}
                      >
                        Primary Phone / WhatsApp
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          required
                          value={personalInfo.phone}
                          onChange={(e) =>
                            setPersonalInfo({ ...personalInfo, phone: e.target.value })
                          }
                          className={`w-full rounded-xl border pl-11 pr-4 py-3 text-sm font-medium transition-all focus:border-[#FFB400] focus:outline-none ${
                            isDark
                              ? "border-white/15 bg-[#1C1C1C] text-white"
                              : "border-neutral-300 bg-white text-[#0F0F0F]"
                          }`}
                        />
                        <Phone
                          size={16}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 3: Gender & Date of Birth */}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label
                        className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                          isDark ? "text-white/70" : "text-neutral-700"
                        }`}
                      >
                        Gender
                      </label>
                      <select
                        value={personalInfo.gender}
                        onChange={(e) =>
                          setPersonalInfo({ ...personalInfo, gender: e.target.value })
                        }
                        className={`w-full rounded-xl border px-4 py-3 text-sm font-medium transition-all focus:border-[#FFB400] focus:outline-none ${
                          isDark
                            ? "border-white/15 bg-[#1C1C1C] text-white"
                            : "border-neutral-300 bg-white text-[#0F0F0F]"
                        }`}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Others">Prefer not to say</option>
                      </select>
                    </div>

                    <div>
                      <label
                        className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                          isDark ? "text-white/70" : "text-neutral-700"
                        }`}
                      >
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={personalInfo.dateOfBirth}
                        onChange={(e) =>
                          setPersonalInfo({ ...personalInfo, dateOfBirth: e.target.value })
                        }
                        className={`w-full rounded-xl border px-4 py-3 text-sm font-medium transition-all focus:border-[#FFB400] focus:outline-none ${
                          isDark
                            ? "border-white/15 bg-[#1C1C1C] text-white"
                            : "border-neutral-300 bg-white text-[#0F0F0F]"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Row 4: Street Address, City, State, Country */}
                  <div className="space-y-4">
                    <div>
                      <label
                        className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                          isDark ? "text-white/70" : "text-neutral-700"
                        }`}
                      >
                        Primary Residential Address
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={personalInfo.streetAddress}
                          onChange={(e) =>
                            setPersonalInfo({ ...personalInfo, streetAddress: e.target.value })
                          }
                          className={`w-full rounded-xl border pl-11 pr-4 py-3 text-sm font-medium transition-all focus:border-[#FFB400] focus:outline-none ${
                            isDark
                              ? "border-white/15 bg-[#1C1C1C] text-white"
                              : "border-neutral-300 bg-white text-[#0F0F0F]"
                          }`}
                        />
                        <MapPin
                          size={16}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div>
                        <label
                          className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                            isDark ? "text-white/70" : "text-neutral-700"
                          }`}
                        >
                          City / District
                        </label>
                        <input
                          type="text"
                          value={personalInfo.city}
                          onChange={(e) =>
                            setPersonalInfo({ ...personalInfo, city: e.target.value })
                          }
                          className={`w-full rounded-xl border px-4 py-3 text-sm font-medium transition-all focus:border-[#FFB400] focus:outline-none ${
                            isDark
                              ? "border-white/15 bg-[#1C1C1C] text-white"
                              : "border-neutral-300 bg-white text-[#0F0F0F]"
                          }`}
                        />
                      </div>

                      <div>
                        <label
                          className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                            isDark ? "text-white/70" : "text-neutral-700"
                          }`}
                        >
                          State / Province
                        </label>
                        <input
                          type="text"
                          value={personalInfo.state}
                          onChange={(e) =>
                            setPersonalInfo({ ...personalInfo, state: e.target.value })
                          }
                          className={`w-full rounded-xl border px-4 py-3 text-sm font-medium transition-all focus:border-[#FFB400] focus:outline-none ${
                            isDark
                              ? "border-white/15 bg-[#1C1C1C] text-white"
                              : "border-neutral-300 bg-white text-[#0F0F0F]"
                          }`}
                        />
                      </div>

                      <div>
                        <label
                          className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                            isDark ? "text-white/70" : "text-neutral-700"
                          }`}
                        >
                          Country
                        </label>
                        <input
                          type="text"
                          value={personalInfo.country}
                          onChange={(e) =>
                            setPersonalInfo({ ...personalInfo, country: e.target.value })
                          }
                          className={`w-full rounded-xl border px-4 py-3 text-sm font-medium transition-all focus:border-[#FFB400] focus:outline-none ${
                            isDark
                              ? "border-white/15 bg-[#1C1C1C] text-white"
                              : "border-neutral-300 bg-white text-[#0F0F0F]"
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 5: Tailoring / Style Bio */}
                  <div>
                    <label
                      className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                        isDark ? "text-white/70" : "text-neutral-700"
                      }`}
                    >
                      Style &amp; Fitting Preferences Note
                    </label>
                    <textarea
                      rows={3}
                      value={personalInfo.bio}
                      onChange={(e) =>
                        setPersonalInfo({ ...personalInfo, bio: e.target.value })
                      }
                      placeholder="e.g. Prefer relaxed agbada shoulders, lightweight inner fabrics..."
                      className={`w-full rounded-xl border p-4 text-sm font-medium transition-all focus:border-[#FFB400] focus:outline-none ${
                        isDark
                          ? "border-white/15 bg-[#1C1C1C] text-white"
                          : "border-neutral-300 bg-white text-[#0F0F0F]"
                      }`}
                    />
                  </div>

                  {/* Form Action Buttons */}
                  <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-inherit">
                    <button
                      type="button"
                      onClick={() => showToast("Changes discarded.")}
                      className={`w-full sm:w-auto rounded-xl px-5 py-2.5 text-xs font-semibold transition-colors ${
                        isDark
                          ? "text-white/70 hover:bg-white/5"
                          : "text-neutral-600 hover:bg-neutral-100"
                      }`}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isSaving}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFB400] px-6 py-3 font-sans text-xs font-bold text-[#0F0F0F] transition-all hover:bg-[#FFB400]/90 hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-[#FFB400]/20 disabled:opacity-50 cursor-pointer"
                    >
                      {isSaving ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#0F0F0F] border-t-transparent" />
                          <span>Updating Atelier Profile...</span>
                        </>
                      ) : (
                        <>
                          <Save size={15} />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </article>
            )}

            {/* ========================================================= */}
            {/* TAB 2: BESPOKE MEASUREMENTS (Brand Luxury Tailoring Hub)   */}
            {/* ========================================================= */}
            {activeTab === "measurements" && (
              <article
                className={`rounded-2xl border p-6 sm:p-8 transition-all ${
                  isDark
                    ? "border-white/10 bg-[#151515]"
                    : "border-neutral-200 bg-white shadow-sm"
                }`}
              >
                <div className="border-b pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-inherit">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3
                        className={`font-display text-2xl font-bold ${
                          isDark ? "text-white" : "text-[#0F0F0F]"
                        }`}
                      >
                        Bespoke Measurements Hub
                      </h3>
                      <span className="rounded-full bg-[#FFB400]/15 px-2.5 py-0.5 text-xs font-bold text-[#FFB400]">
                        Tailored Fit
                      </span>
                    </div>
                    <p
                      className={`mt-1 text-xs sm:text-sm ${
                        isDark ? "text-white/60" : "text-neutral-600"
                      }`}
                    >
                      Your exact anatomical measurements are used by Marvelam master artisans to craft
                      perfect-fitting agbadas, kaftans, and couture garments.
                    </p>
                  </div>

                  {/* Unit Toggle: Inches vs Centimeters */}
                  <div
                    className={`inline-flex items-center rounded-xl border p-1 self-start sm:self-auto ${
                      isDark ? "border-white/10 bg-[#1A1A1A]" : "border-neutral-200 bg-neutral-100"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setMeasurementUnit("inches")}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                        measurementUnit === "inches"
                          ? "bg-[#FFB400] text-[#0F0F0F] shadow-sm"
                          : isDark
                          ? "text-white/60 hover:text-white"
                          : "text-neutral-600 hover:text-neutral-900"
                      }`}
                    >
                      Inches (in)
                    </button>
                    <button
                      type="button"
                      onClick={() => setMeasurementUnit("cm")}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                        measurementUnit === "cm"
                          ? "bg-[#FFB400] text-[#0F0F0F] shadow-sm"
                          : isDark
                          ? "text-white/60 hover:text-white"
                          : "text-neutral-600 hover:text-neutral-900"
                      }`}
                    >
                      Centimeters (cm)
                    </button>
                  </div>
                </div>

                {/* Profile Selector Pills */}
                <div className="mt-6 flex flex-wrap items-center gap-2">
                  <span className={`text-xs font-semibold uppercase tracking-wider mr-2 ${isDark ? "text-white/50" : "text-neutral-500"}`}>
                    Active Profile:
                  </span>
                  {["Agbada Traditional", "Kaftan & Senator Cut", "Modern Suit / Blazer"].map(
                    (prof) => (
                      <button
                        key={prof}
                        type="button"
                        onClick={() => {
                          setActiveMeasurementProfile(prof);
                          showToast(`Switched to "${prof}" fit profile.`);
                        }}
                        className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                          activeMeasurementProfile === prof
                            ? "bg-[#FFB400] text-[#0F0F0F] shadow-sm"
                            : isDark
                            ? "border border-white/10 bg-[#1C1C1C] text-white/70 hover:border-[#FFB400]/40"
                            : "border border-neutral-200 bg-white text-neutral-700 hover:border-[#FFB400]"
                        }`}
                      >
                        {prof}
                      </button>
                    )
                  )}

                  <button
                    type="button"
                    onClick={() => showToast("New measurement profile created.")}
                    className="flex items-center gap-1 rounded-xl border border-dashed border-[#FFB400]/50 px-3 py-2 text-xs font-semibold text-[#FFB400] hover:bg-[#FFB400]/10 transition-colors"
                  >
                    <Plus size={14} />
                    <span>Add Fit Profile</span>
                  </button>
                </div>

                {/* Measurements Form Grid */}
                <form onSubmit={handleSaveMeasurements} className="mt-8 space-y-6">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {/* Neck */}
                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 ${isDark ? "text-white/70" : "text-neutral-700"}`}>
                        Neck / Collar ({measurementUnit === "inches" ? "in" : "cm"})
                      </label>
                      <input
                        type="text"
                        value={measurements.neck}
                        onChange={(e) => setMeasurements({ ...measurements, neck: e.target.value })}
                        className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-all focus:border-[#FFB400] focus:outline-none ${
                          isDark ? "border-white/15 bg-[#1C1C1C] text-white" : "border-neutral-300 bg-white"
                        }`}
                      />
                    </div>

                    {/* Chest / Bust */}
                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 ${isDark ? "text-white/70" : "text-neutral-700"}`}>
                        Chest / Bust ({measurementUnit === "inches" ? "in" : "cm"})
                      </label>
                      <input
                        type="text"
                        value={measurements.chest}
                        onChange={(e) => setMeasurements({ ...measurements, chest: e.target.value })}
                        className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-all focus:border-[#FFB400] focus:outline-none ${
                          isDark ? "border-white/15 bg-[#1C1C1C] text-white" : "border-neutral-300 bg-white"
                        }`}
                      />
                    </div>

                    {/* Shoulder Width */}
                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 ${isDark ? "text-white/70" : "text-neutral-700"}`}>
                        Shoulder Width
                      </label>
                      <input
                        type="text"
                        value={measurements.shoulder}
                        onChange={(e) => setMeasurements({ ...measurements, shoulder: e.target.value })}
                        className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-all focus:border-[#FFB400] focus:outline-none ${
                          isDark ? "border-white/15 bg-[#1C1C1C] text-white" : "border-neutral-300 bg-white"
                        }`}
                      />
                    </div>

                    {/* Sleeve Length */}
                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 ${isDark ? "text-white/70" : "text-neutral-700"}`}>
                        Sleeve Length
                      </label>
                      <input
                        type="text"
                        value={measurements.sleeve}
                        onChange={(e) => setMeasurements({ ...measurements, sleeve: e.target.value })}
                        className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-all focus:border-[#FFB400] focus:outline-none ${
                          isDark ? "border-white/15 bg-[#1C1C1C] text-white" : "border-neutral-300 bg-white"
                        }`}
                      />
                    </div>

                    {/* Shirt Length */}
                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 ${isDark ? "text-white/70" : "text-neutral-700"}`}>
                        Shirt / Top Length
                      </label>
                      <input
                        type="text"
                        value={measurements.shirtLength}
                        onChange={(e) => setMeasurements({ ...measurements, shirtLength: e.target.value })}
                        className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-all focus:border-[#FFB400] focus:outline-none ${
                          isDark ? "border-white/15 bg-[#1C1C1C] text-white" : "border-neutral-300 bg-white"
                        }`}
                      />
                    </div>

                    {/* Waist */}
                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 ${isDark ? "text-white/70" : "text-neutral-700"}`}>
                        Waist Circumference
                      </label>
                      <input
                        type="text"
                        value={measurements.waist}
                        onChange={(e) => setMeasurements({ ...measurements, waist: e.target.value })}
                        className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-all focus:border-[#FFB400] focus:outline-none ${
                          isDark ? "border-white/15 bg-[#1C1C1C] text-white" : "border-neutral-300 bg-white"
                        }`}
                      />
                    </div>

                    {/* Hip */}
                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 ${isDark ? "text-white/70" : "text-neutral-700"}`}>
                        Hip Circumference
                      </label>
                      <input
                        type="text"
                        value={measurements.hip}
                        onChange={(e) => setMeasurements({ ...measurements, hip: e.target.value })}
                        className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-all focus:border-[#FFB400] focus:outline-none ${
                          isDark ? "border-white/15 bg-[#1C1C1C] text-white" : "border-neutral-300 bg-white"
                        }`}
                      />
                    </div>

                    {/* Trouser / Inseam Length */}
                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 ${isDark ? "text-white/70" : "text-neutral-700"}`}>
                        Trouser Length
                      </label>
                      <input
                        type="text"
                        value={measurements.trouserLength}
                        onChange={(e) => setMeasurements({ ...measurements, trouserLength: e.target.value })}
                        className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-all focus:border-[#FFB400] focus:outline-none ${
                          isDark ? "border-white/15 bg-[#1C1C1C] text-white" : "border-neutral-300 bg-white"
                        }`}
                      />
                    </div>

                    {/* Thigh Circumference */}
                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 ${isDark ? "text-white/70" : "text-neutral-700"}`}>
                        Thigh Width
                      </label>
                      <input
                        type="text"
                        value={measurements.thigh}
                        onChange={(e) => setMeasurements({ ...measurements, thigh: e.target.value })}
                        className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-all focus:border-[#FFB400] focus:outline-none ${
                          isDark ? "border-white/15 bg-[#1C1C1C] text-white" : "border-neutral-300 bg-white"
                        }`}
                      />
                    </div>

                    {/* Ankle Width */}
                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 ${isDark ? "text-white/70" : "text-neutral-700"}`}>
                        Ankle Width
                      </label>
                      <input
                        type="text"
                        value={measurements.ankle}
                        onChange={(e) => setMeasurements({ ...measurements, ankle: e.target.value })}
                        className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-all focus:border-[#FFB400] focus:outline-none ${
                          isDark ? "border-white/15 bg-[#1C1C1C] text-white" : "border-neutral-300 bg-white"
                        }`}
                      />
                    </div>

                    {/* Agbada Wingspan */}
                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 text-[#FFB400]`}>
                        Agbada Wingspan
                      </label>
                      <input
                        type="text"
                        value={measurements.agbadaSpan}
                        onChange={(e) => setMeasurements({ ...measurements, agbadaSpan: e.target.value })}
                        className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-all focus:border-[#FFB400] focus:outline-none ${
                          isDark ? "border-white/15 bg-[#1C1C1C] text-white" : "border-neutral-300 bg-white"
                        }`}
                      />
                    </div>

                    {/* Height */}
                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 ${isDark ? "text-white/70" : "text-neutral-700"}`}>
                        Total Height
                      </label>
                      <input
                        type="text"
                        value={measurements.height}
                        onChange={(e) => setMeasurements({ ...measurements, height: e.target.value })}
                        className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-all focus:border-[#FFB400] focus:outline-none ${
                          isDark ? "border-white/15 bg-[#1C1C1C] text-white" : "border-neutral-300 bg-white"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Fit Style Radio Options */}
                  <div className="pt-4 border-t border-inherit">
                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-3 ${isDark ? "text-white/70" : "text-neutral-700"}`}>
                      Preferred Cut &amp; Silhouette
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { label: "Slim Fit", desc: "Tapered waist, snug chest, modern European drape." },
                        { label: "Tailored Regular", desc: "Balanced comfort, structured line, all-day ease." },
                        { label: "Traditional Loose", desc: "Full volume, majestic traditional drape." },
                      ].map((opt) => (
                        <div
                          key={opt.label}
                          onClick={() => setMeasurements({ ...measurements, preferredFit: opt.label })}
                          className={`cursor-pointer rounded-xl border p-4 transition-all ${
                            measurements.preferredFit === opt.label
                              ? isDark
                                ? "border-[#FFB400] bg-[#FFB400]/10"
                                : "border-[#FFB400] bg-[#FFFBF0]"
                              : isDark
                              ? "border-white/10 bg-[#1C1C1C] hover:border-white/30"
                              : "border-neutral-200 bg-white hover:border-neutral-400"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold">{opt.label}</span>
                            <div
                              className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                                measurements.preferredFit === opt.label
                                  ? "border-[#FFB400] bg-[#FFB400]"
                                  : "border-neutral-400"
                              }`}
                            >
                              {measurements.preferredFit === opt.label && (
                                <div className="h-1.5 w-1.5 rounded-full bg-[#0F0F0F]" />
                              )}
                            </div>
                          </div>
                          <p className={`mt-1.5 text-[11px] leading-relaxed ${isDark ? "text-white/50" : "text-neutral-500"}`}>
                            {opt.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tailoring Notes */}
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? "text-white/70" : "text-neutral-700"}`}>
                      Special Tailor Instructions &amp; Posture Notes
                    </label>
                    <textarea
                      rows={2}
                      value={measurements.atelierNotes}
                      onChange={(e) => setMeasurements({ ...measurements, atelierNotes: e.target.value })}
                      className={`w-full rounded-xl border p-4 text-sm font-medium transition-all focus:border-[#FFB400] focus:outline-none ${
                        isDark ? "border-white/15 bg-[#1C1C1C] text-white" : "border-neutral-300 bg-white"
                      }`}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end pt-4 border-t border-inherit">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#FFB400] px-6 py-3 font-sans text-xs font-bold text-[#0F0F0F] transition-all hover:bg-[#FFB400]/90 hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-[#FFB400]/20 disabled:opacity-50 cursor-pointer"
                    >
                      <Scissors size={15} />
                      <span>Update Tailoring Measurements</span>
                    </button>
                  </div>
                </form>
              </article>
            )}

            {/* ========================================================= */}
            {/* TAB 3: SAVED ADDRESSES                                   */}
            {/* ========================================================= */}
            {activeTab === "addresses" && (
              <article
                className={`rounded-2xl border p-6 sm:p-8 transition-all ${
                  isDark
                    ? "border-white/10 bg-[#151515]"
                    : "border-neutral-200 bg-white shadow-sm"
                }`}
              >
                <div className="border-b pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-inherit">
                  <div>
                    <h3
                      className={`font-display text-2xl font-bold ${
                        isDark ? "text-white" : "text-[#0F0F0F]"
                      }`}
                    >
                      Saved Addresses
                    </h3>
                    <p
                      className={`mt-1 text-xs sm:text-sm ${
                        isDark ? "text-white/60" : "text-neutral-600"
                      }`}
                    >
                      Manage delivery destinations for rapid checkout and courier dispatches.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={openAddAddressModal}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#FFB400] px-4 py-2.5 text-xs font-bold text-[#0F0F0F] transition-all hover:bg-[#FFB400]/90 hover:scale-[1.02] shadow-sm cursor-pointer"
                  >
                    <Plus size={15} />
                    <span>Add New Address</span>
                  </button>
                </div>

                {/* Addresses Grid */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`relative flex flex-col justify-between rounded-xl border p-5 transition-all ${
                        addr.isDefault
                          ? isDark
                            ? "border-[#FFB400]/50 bg-[#1A1812]"
                            : "border-[#FFB400] bg-[#FFFDF7]"
                          : isDark
                          ? "border-white/10 bg-[#1C1C1C] hover:border-white/20"
                          : "border-neutral-200 bg-white hover:border-neutral-300"
                      }`}
                    >
                      <div>
                        {/* Header Badge */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">{addr.title}</span>
                            <span
                              className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                                addr.type === "HOME"
                                  ? "bg-blue-500/10 text-blue-400"
                                  : "bg-purple-500/10 text-purple-400"
                              }`}
                            >
                              {addr.type}
                            </span>
                          </div>

                          {addr.isDefault && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#FFB400]/20 px-2.5 py-0.5 text-[11px] font-bold text-[#FFB400]">
                              <Check size={11} className="stroke-[3]" />
                              Default
                            </span>
                          )}
                        </div>

                        {/* Recipient Details */}
                        <div className="mt-3 space-y-1 text-xs">
                          <p className="font-bold text-sm">{addr.fullName}</p>
                          <p
                            className={`leading-relaxed ${
                              isDark ? "text-white/80" : "text-neutral-700"
                            }`}
                          >
                            {addr.address}
                          </p>
                          <p className={isDark ? "text-white/60" : "text-neutral-500"}>
                            {addr.city}, {addr.state}, {addr.country}
                          </p>
                          <p className="font-mono text-xs pt-1 text-[#FFB400]">{addr.phone}</p>

                          {addr.additionalInfo && (
                            <div
                              className={`mt-2 rounded-lg p-2.5 text-[11px] italic ${
                                isDark ? "bg-[#252525] text-white/60" : "bg-neutral-100 text-neutral-600"
                              }`}
                            >
                              "{addr.additionalInfo}"
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="mt-5 flex items-center justify-between border-t pt-3.5 border-inherit text-xs">
                        {!addr.isDefault ? (
                          <button
                            type="button"
                            onClick={() => handleSetDefaultAddress(addr.id)}
                            className="font-medium text-[#FFB400] hover:underline cursor-pointer"
                          >
                            Set as default
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
                            <CheckCircle2 size={12} />
                            Active Delivery Destination
                          </span>
                        )}

                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => openEditAddressModal(addr)}
                            className="flex items-center gap-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                            title="Edit Address"
                          >
                            <Edit2 size={13} />
                            <span>Edit</span>
                          </button>

                          {addresses.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleDeleteAddress(addr.id)}
                              className="flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                              title="Delete Address"
                            >
                              <Trash2 size={13} />
                              <span>Remove</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            )}

            {/* ========================================================= */}
            {/* TAB 4: SECURITY & PASSWORDS                               */}
            {/* ========================================================= */}
            {activeTab === "security" && (
              <article
                className={`rounded-2xl border p-6 sm:p-8 transition-all ${
                  isDark
                    ? "border-white/10 bg-[#151515]"
                    : "border-neutral-200 bg-white shadow-sm"
                }`}
              >
                <div className="border-b pb-5 border-inherit">
                  <h3
                    className={`font-display text-2xl font-bold ${
                      isDark ? "text-white" : "text-[#0F0F0F]"
                    }`}
                  >
                    Security &amp; Credentials
                  </h3>
                  <p
                    className={`mt-1 text-xs sm:text-sm ${
                      isDark ? "text-white/60" : "text-neutral-600"
                    }`}
                  >
                    Keep your account secure with strong cryptographic passwords and two-factor verification.
                  </p>
                </div>

                {/* Password Update Form */}
                <form onSubmit={handleUpdatePassword} className="mt-6 space-y-5 max-w-xl">
                  <div>
                    <label className={`block text-xs font-semibold mb-2 ${isDark ? "text-white/70" : "text-neutral-700"}`}>
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPass ? "text" : "password"}
                        required
                        value={securityData.currentPassword}
                        onChange={(e) =>
                          setSecurityData({ ...securityData, currentPassword: e.target.value })
                        }
                        placeholder="••••••••••••"
                        className={`w-full rounded-xl border pl-4 pr-11 py-3 text-sm font-medium transition-all focus:border-[#FFB400] focus:outline-none ${
                          isDark ? "border-white/15 bg-[#1C1C1C] text-white" : "border-neutral-300 bg-white"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                      >
                        {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-semibold mb-2 ${isDark ? "text-white/70" : "text-neutral-700"}`}>
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPass ? "text" : "password"}
                        required
                        value={securityData.newPassword}
                        onChange={(e) =>
                          setSecurityData({ ...securityData, newPassword: e.target.value })
                        }
                        placeholder="••••••••••••"
                        className={`w-full rounded-xl border pl-4 pr-11 py-3 text-sm font-medium transition-all focus:border-[#FFB400] focus:outline-none ${
                          isDark ? "border-white/15 bg-[#1C1C1C] text-white" : "border-neutral-300 bg-white"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                      >
                        {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-semibold mb-2 ${isDark ? "text-white/70" : "text-neutral-700"}`}>
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPass ? "text" : "password"}
                        required
                        value={securityData.confirmPassword}
                        onChange={(e) =>
                          setSecurityData({ ...securityData, confirmPassword: e.target.value })
                        }
                        placeholder="••••••••••••"
                        className={`w-full rounded-xl border pl-4 pr-11 py-3 text-sm font-medium transition-all focus:border-[#FFB400] focus:outline-none ${
                          isDark ? "border-white/15 bg-[#1C1C1C] text-white" : "border-neutral-300 bg-white"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                      >
                        {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#FFB400] px-6 py-3 font-sans text-xs font-bold text-[#0F0F0F] transition-all hover:bg-[#FFB400]/90 hover:scale-[1.02] shadow-md shadow-[#FFB400]/20 disabled:opacity-50 cursor-pointer"
                  >
                    <Lock size={15} />
                    <span>Update Password</span>
                  </button>
                </form>

                {/* 2-Factor Authentication Section */}
                <div className="mt-10 border-t pt-8 border-inherit">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={18} className="text-[#FFB400]" />
                        <h4 className="font-semibold text-base">Two-Factor Authentication (2FA)</h4>
                      </div>
                      <p className={`mt-1 text-xs ${isDark ? "text-white/60" : "text-neutral-600"}`}>
                        Require a verification code sent to your phone or authenticator app during sign-in.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSecurityData((prev) => ({
                          ...prev,
                          twoFactorEnabled: !prev.twoFactorEnabled,
                        }));
                        showToast(
                          securityData.twoFactorEnabled
                            ? "Two-Factor Authentication disabled."
                            : "Two-Factor Authentication enabled."
                        );
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                        securityData.twoFactorEnabled ? "bg-[#FFB400]" : "bg-neutral-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          securityData.twoFactorEnabled ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Active Sessions */}
                <div className="mt-8 border-t pt-8 border-inherit">
                  <h4 className="font-semibold text-base mb-4">Active Login Sessions</h4>
                  <div className="space-y-3">
                    <div
                      className={`flex items-center justify-between rounded-xl border p-4 ${
                        isDark ? "border-white/5 bg-[#1C1C1C]" : "border-neutral-200 bg-neutral-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Laptop size={18} className="text-[#FFB400]" />
                        <div>
                          <p className="text-xs font-semibold">Chrome on Windows (Current Session)</p>
                          <p className={`text-[11px] ${isDark ? "text-white/50" : "text-neutral-500"}`}>
                            Lagos, Nigeria • IP 102.89.44.12
                          </p>
                        </div>
                      </div>
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                        Active Now
                      </span>
                    </div>

                    <div
                      className={`flex items-center justify-between rounded-xl border p-4 ${
                        isDark ? "border-white/5 bg-[#1C1C1C]" : "border-neutral-200 bg-neutral-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Smartphone size={18} className="text-neutral-400" />
                        <div>
                          <p className="text-xs font-semibold">Safari on iPhone 15 Pro</p>
                          <p className={`text-[11px] ${isDark ? "text-white/50" : "text-neutral-500"}`}>
                            Lagos, Nigeria • Active yesterday
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => showToast("Device logged out.")}
                        className="text-xs text-red-400 hover:underline cursor-pointer"
                      >
                        Revoke
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            )}

            {/* ========================================================= */}
            {/* TAB 5: NOTIFICATIONS & PREFERENCES                         */}
            {/* ========================================================= */}
            {activeTab === "preferences" && (
              <article
                className={`rounded-2xl border p-6 sm:p-8 transition-all ${
                  isDark
                    ? "border-white/10 bg-[#151515]"
                    : "border-neutral-200 bg-white shadow-sm"
                }`}
              >
                <div className="border-b pb-5 border-inherit">
                  <h3
                    className={`font-display text-2xl font-bold ${
                      isDark ? "text-white" : "text-[#0F0F0F]"
                    }`}
                  >
                    Communication &amp; Style Preferences
                  </h3>
                  <p
                    className={`mt-1 text-xs sm:text-sm ${
                      isDark ? "text-white/60" : "text-neutral-600"
                    }`}
                  >
                    Select how Marvelam Atelier sends shipment updates and new fabric drop announcements.
                  </p>
                </div>

                <div className="mt-6 space-y-6">
                  {[
                    {
                      key: "orderUpdatesWhatsapp",
                      title: "WhatsApp Dispatch & Delivery Updates",
                      desc: "Instant real-time notifications when your bespoke order is cut, sewn, and out for courier delivery.",
                    },
                    {
                      key: "orderUpdatesSms",
                      title: "SMS Order Status Alerts",
                      desc: "Receive critical tracking milestones directly to your mobile phone number.",
                    },
                    {
                      key: "exclusiveDrops",
                      title: "VIP Early Access & Haute Couture Drops",
                      desc: "Be the first to browse limited-edition collections 2 hours before general public release.",
                    },
                    {
                      key: "fabricRestockAlerts",
                      title: "Rare Fabric & Silk Restock Alerts",
                      desc: "Alerts when premium imported Swiss Voile, Italian Cashmere, or French Lace arrive.",
                    },
                    {
                      key: "atelierNewsletter",
                      title: "The Marvelam Editorial Journal",
                      desc: "Weekly style essays, cultural insights, and modest luxury tailoring chronicles.",
                    },
                  ].map((pref) => (
                    <div
                      key={pref.key}
                      className="flex items-start justify-between gap-4 pb-4 border-b border-inherit last:border-b-0"
                    >
                      <div className="max-w-xl">
                        <p className="text-sm font-semibold">{pref.title}</p>
                        <p className={`mt-1 text-xs leading-relaxed ${isDark ? "text-white/50" : "text-neutral-500"}`}>
                          {pref.desc}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setNotifications((prev) => ({
                            ...prev,
                            [pref.key]: !prev[pref.key],
                          }));
                          showToast("Preference updated.");
                        }}
                        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
                          notifications[pref.key] ? "bg-[#FFB400]" : "bg-neutral-600"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notifications[pref.key] ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </article>
            )}
          </section>
        </div>
      </main>

      {/* ========================================================= */}
      {/* ADDRESS MODAL (Add / Edit)                                 */}
      {/* ========================================================= */}
      {addressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div
            className={`w-full max-w-lg rounded-2xl border p-6 sm:p-8 shadow-2xl transition-all ${
              isDark ? "border-white/10 bg-[#151515] text-white" : "border-neutral-200 bg-white text-[#0F0F0F]"
            }`}
          >
            <div className="flex items-center justify-between border-b pb-4 border-inherit">
              <h3 className="font-display text-xl font-bold">
                {editingAddressId ? "Edit Delivery Address" : "Add New Delivery Address"}
              </h3>
              <button
                type="button"
                onClick={() => setAddressModalOpen(false)}
                className="rounded-full p-1 text-neutral-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveAddressModal} className="mt-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Address Label</label>
                  <input
                    type="text"
                    required
                    value={newAddressForm.title}
                    onChange={(e) =>
                      setNewAddressForm({ ...newAddressForm, title: e.target.value })
                    }
                    placeholder="e.g. Home, Lekki Penthouse"
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-medium focus:border-[#FFB400] focus:outline-none ${
                      isDark ? "border-white/15 bg-[#1C1C1C] text-white" : "border-neutral-300 bg-white"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Type</label>
                  <select
                    value={newAddressForm.type}
                    onChange={(e) =>
                      setNewAddressForm({ ...newAddressForm, type: e.target.value })
                    }
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-medium focus:border-[#FFB400] focus:outline-none ${
                      isDark ? "border-white/15 bg-[#1C1C1C] text-white" : "border-neutral-300 bg-white"
                    }`}
                  >
                    <option value="HOME">HOME</option>
                    <option value="OFFICE">OFFICE</option>
                    <option value="STUDIO">STUDIO / ATELIER</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Full Recipient Name</label>
                <input
                  type="text"
                  required
                  value={newAddressForm.fullName}
                  onChange={(e) =>
                    setNewAddressForm({ ...newAddressForm, fullName: e.target.value })
                  }
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-medium focus:border-[#FFB400] focus:outline-none ${
                    isDark ? "border-white/15 bg-[#1C1C1C] text-white" : "border-neutral-300 bg-white"
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={newAddressForm.phone}
                    onChange={(e) =>
                      setNewAddressForm({ ...newAddressForm, phone: e.target.value })
                    }
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-medium focus:border-[#FFB400] focus:outline-none ${
                      isDark ? "border-white/15 bg-[#1C1C1C] text-white" : "border-neutral-300 bg-white"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={newAddressForm.city}
                    onChange={(e) =>
                      setNewAddressForm({ ...newAddressForm, city: e.target.value })
                    }
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-medium focus:border-[#FFB400] focus:outline-none ${
                      isDark ? "border-white/15 bg-[#1C1C1C] text-white" : "border-neutral-300 bg-white"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={newAddressForm.address}
                  onChange={(e) =>
                    setNewAddressForm({ ...newAddressForm, address: e.target.value })
                  }
                  placeholder="Street name, building number, apartment"
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-medium focus:border-[#FFB400] focus:outline-none ${
                    isDark ? "border-white/15 bg-[#1C1C1C] text-white" : "border-neutral-300 bg-white"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">
                  Delivery Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  value={newAddressForm.additionalInfo}
                  onChange={(e) =>
                    setNewAddressForm({ ...newAddressForm, additionalInfo: e.target.value })
                  }
                  placeholder="Gate code, landmark, calling instructions"
                  className={`w-full rounded-xl border p-3 text-xs font-medium focus:border-[#FFB400] focus:outline-none ${
                    isDark ? "border-white/15 bg-[#1C1C1C] text-white" : "border-neutral-300 bg-white"
                  }`}
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="modal-default"
                  checked={newAddressForm.isDefault}
                  onChange={(e) =>
                    setNewAddressForm({ ...newAddressForm, isDefault: e.target.checked })
                  }
                  className="rounded text-[#FFB400] focus:ring-[#FFB400]"
                />
                <label htmlFor="modal-default" className="text-xs font-medium cursor-pointer">
                  Set as default shipping address
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-inherit">
                <button
                  type="button"
                  onClick={() => setAddressModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#FFB400] px-5 py-2.5 text-xs font-bold text-[#0F0F0F] hover:bg-[#FFB400]/90 shadow-md shadow-[#FFB400]/20"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Storefront Footer */}
      <Footer />
    </div>
  );
}
