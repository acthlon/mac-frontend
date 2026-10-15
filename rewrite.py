import re

new_file = open('C:/Users/Ali Akintayo/Downloads/OrderDetailsPage (2).jsx').read()

imports = r'''import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import {
  Search, User, Heart, ShoppingCart, Menu, ChevronDown, ChevronRight, LayoutDashboard,
  Package, MapPin, Settings, LogOut, Truck, CheckCircle2, Clock, Download,
  RotateCcw, XCircle, MessageCircle, CreditCard, Star, ShieldCheck, Headset,
  Instagram, Facebook, Music2
} from "lucide-react";
'''

parts = new_file.split('/* ---------------------------------- Header --------------------------------- */')
top_section = parts[0]
top_section = re.sub(r'(?ms)import React.*?from "lucide-react";', '', top_section)

sidebar_to_end = new_file.split('/* ------------------------------- Account sidebar ------------------------------ */')[1]
page_section = sidebar_to_end.split('/* --------------------------------- Features bar -------------------------------- */')[0]
page_section = re.sub(r'(?ms)/\* -+ Address \+ payment -+ \*/.*?/\* -+ Summary card -+ \*/', '/* --------------------------------- Summary card -------------------------------- */', page_section)

page_def = r'''
export default function OrderDetailsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen font-sans antialiased ${isDark ? "bg-[#0F0F0F] text-white" : "bg-[#FBF9F5] text-[#141414]"}`}>
      <Header />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-8">
        <nav aria-label="Breadcrumb" className={`mb-5 flex flex-wrap items-center gap-2 font-sans text-xs ${isDark ? "text-white/50" : "text-black/50"}`}>
          <Link to="/" className="hover:text-[#FFB400]">Home</Link>
          <ChevronRight size={12} aria-hidden="true" />
          <Link to="/account/orders" className="hover:text-[#FFB400]">My Account</Link>
          <ChevronRight size={12} aria-hidden="true" />
          <Link to="/account/orders" className="hover:text-[#FFB400]">Orders</Link>
          <ChevronRight size={12} aria-hidden="true" />
          <span className="text-[#FFB400]">#{ORDER.id}</span>
        </nav>

        <div className="flex flex-col gap-8 lg:flex-row">
          <AccountSidebar />

          <div className="flex-1">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="font-display text-3xl">Order #{ORDER.id}</h1>
                <p className={`mt-1 font-sans text-sm ${isDark ? "text-white/50" : "text-black/50"}`}>Placed on {ORDER.placedOn}</p>
              </div>
              <StatusBadge status={ORDER.status} />
            </div>

            <div className="mt-6 space-y-6">
              
              {/* Information Container (Combined Address & Payment) */}
              <div className={`rounded-xl border p-6 ${isDark ? "border-white/10 bg-[#151515]" : "border-black/5 bg-white"}`}>
                <h2 className="mb-4 font-display text-2xl font-medium">Information</h2>
                
                <div className="space-y-6">
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <MapPin size={16} className="text-[#FFB400]" />
                      <h3 className="font-sans text-sm font-semibold">Shipping Address</h3>
                    </div>
                    <address className={`font-sans text-xs not-italic leading-relaxed ${isDark ? "text-white/60" : "text-black/60"}`}>
                      {ORDER.shipping.name}<br />
                      {ORDER.shipping.address}<br />
                      {ORDER.shipping.phone}
                    </address>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <CreditCard size={16} className="text-[#FFB400]" />
                      <h3 className="font-sans text-sm font-semibold">Payment Method</h3>
                    </div>
                    <p className={`font-sans text-xs ${isDark ? "text-white/60" : "text-black/60"}`}>
                      {ORDER.paymentMethod}
                    </p>
                  </div>
                </div>
              </div>

              <ItemsCard order={ORDER} />

              <div className="grid gap-6 sm:grid-cols-2">
                <SummaryCard order={ORDER} />
                <HelpCard />
              </div>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
'''

final_content = imports + top_section + '/* ------------------------------- Account sidebar ------------------------------ */' + page_section + page_def

open('src/pages/OrderDetailsPage.jsx', 'w').write(final_content)
