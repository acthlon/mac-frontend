import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Truck, Search, ArrowRight } from "lucide-react";

export default function HomeOrderTrackingTeaser({ isDark }) {
  const [trackingInput, setTrackingInput] = useState("");
  const navigate = useNavigate();

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    const query = trackingInput.trim();
    if (query) {
      navigate(`/track/${query}`);
    } else {
      navigate("/track");
    }
  };

  return (
    <section className="mx-auto mt-14 max-w-7xl px-4 sm:px-8">
      <div
        className={`relative overflow-hidden rounded-3xl border p-6 sm:p-10 transition-all duration-300 shadow-xl ${
          isDark
            ? "border-white/10 bg-[#161616] text-white"
            : "border-[#EAE6DF] bg-white text-[#141414] shadow-sm"
        }`}
      >
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FFB400]/40 bg-[#FFB400]/10 px-3.5 py-1 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#FFB400] mb-3">
              <Truck size={14} /> Live Dispatch Tracker
            </span>
            <h2
              className={`font-display text-2xl sm:text-4xl font-semibold leading-tight ${
                isDark ? "text-white" : "text-[#141414]"
              }`}
            >
              Track Your <span className="text-[#FFB400]">Marvelam Order</span> in Real Time
            </h2>
            <p
              className={`mt-2 font-sans text-xs sm:text-sm leading-relaxed max-w-xl ${
                isDark ? "text-white/65" : "text-[#5A5247]"
              }`}
            >
              Have an active order? Enter your Order Number or Tracking ID to check tailoring
              progress, dispatch hub updates, and courier arrival status.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span
                className={`text-[11px] font-medium self-center ${
                  isDark ? "text-white/50" : "text-[#8C8375]"
                }`}
              >
                Sample Orders:
              </span>
              {["MAC-82914", "MAC-74019", "MAC-63201"].map((sample) => (
                <button
                  key={sample}
                  type="button"
                  onClick={() => navigate(`/track/${sample}`)}
                  className={`rounded-full border px-3 py-1 font-mono text-[11px] font-semibold transition-colors cursor-pointer ${
                    isDark
                      ? "border-white/15 bg-white/5 text-[#FFB400] hover:bg-white/10"
                      : "border-[#DCD7CD] bg-[#FAF8F5] text-[#B37E00] hover:bg-[#F2ECE1]"
                  }`}
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>

          <div
            className={`rounded-2xl border p-5 sm:p-6 ${
              isDark ? "border-white/15 bg-[#1F1F1F]" : "border-[#E2DDCF] bg-[#FAF8F5]"
            }`}
          >
            <form onSubmit={handleTrackSubmit} className="flex flex-col gap-3">
              <label
                htmlFor="home-tracking-input"
                className="font-sans text-xs font-semibold uppercase tracking-wider text-[#FFB400]"
              >
                Enter Order Number or Tracking ID
              </label>
              <div className="relative">
                <Search
                  size={16}
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${
                    isDark ? "text-white/40" : "text-[#8C8375]"
                  }`}
                />
                <input
                  id="home-tracking-input"
                  type="text"
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  placeholder="e.g. MAC-82914"
                  className={`w-full rounded-xl border py-3 pl-10 pr-4 font-sans text-xs sm:text-sm focus:border-[#FFB400] focus:outline-none transition-colors ${
                    isDark
                      ? "border-white/15 bg-[#151515] text-white placeholder:text-white/35"
                      : "border-[#DCD7CD] bg-white text-[#141414] placeholder:text-[#9E978C]"
                  }`}
                />
              </div>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#FFB400] py-3 px-5 font-sans text-xs sm:text-sm font-semibold text-[#0F0F0F] transition-all hover:bg-[#FFB400]/90 hover:scale-[1.01] shadow-md shadow-[#FFB400]/20 cursor-pointer"
              >
                <Truck size={16} /> Track Shipment Now <ArrowRight size={15} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
