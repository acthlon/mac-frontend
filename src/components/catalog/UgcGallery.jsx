import React, { useState } from "react";
import { Star, Eye, X, BadgeCheck, Heart, Sparkles } from "lucide-react";
import formatNaira from "../../utils/formatNaira";

function InstagramIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

const UGC_POSTS = [
  {
    id: "ugc-1",
    username: "@aisha_modest",
    name: "Aisha M.",
    location: "Lagos, Nigeria",
    occasion: "Aso-Ebi Wedding Guest",
    image: "https://picsum.photos/seed/mac-ugc-1/600/800",
    likes: 342,
    caption: "Felt like royalty in my bespoke Marvelam Velvet Boubou! The gold embroidery detail is even more stunning in person. Received endless compliments all night.",
    taggedProduct: {
      id: 201,
      name: "Royal Gold Embroidery Velvet Boubou",
      price: 60000,
      discounted_price: 48000,
      percent_discount: 20,
      pry_image: "https://picsum.photos/seed/mac-look1-item1/400/500",
      avg_rating: 5,
      review_count: 18,
    },
  },
  {
    id: "ugc-2",
    username: "@lagos_bride_2026",
    name: "Fatimah R.",
    location: "Abuja, Nigeria",
    occasion: "Bridal Henna Night",
    image: "https://picsum.photos/seed/mac-ugc-2/600/800",
    likes: 512,
    caption: "The quality of Marvelam French Lace is unmatched. My tailor said it was one of the softest, richest fabrics she's worked with.",
    taggedProduct: {
      id: 202,
      name: "Hand-Beaded French Velvet Lace (5 Yds)",
      price: 95000,
      discounted_price: 85500,
      percent_discount: 10,
      pry_image: "https://picsum.photos/seed/mac-look3-item1/400/500",
      avg_rating: 5,
      review_count: 31,
    },
  },
  {
    id: "ugc-3",
    username: "@modest_glam_ng",
    name: "Khadijah Y.",
    location: "Kano, Nigeria",
    occasion: "Eid Celebration",
    image: "https://picsum.photos/seed/mac-ugc-3/600/800",
    likes: 289,
    caption: "Minimalist, classy, and extremely comfortable. This Silk Abaya set is my absolute favorite piece in my wardrobe right now!",
    taggedProduct: {
      id: 203,
      name: "Emerald Green Chiffon Layered Abaya",
      price: 52000,
      discounted_price: 46800,
      percent_discount: 10,
      pry_image: "https://picsum.photos/seed/mac-look2-item1/400/500",
      avg_rating: 4.8,
      review_count: 24,
    },
  },
  {
    id: "ugc-4",
    username: "@zainab_k",
    name: "Zainab K.",
    location: "London, UK",
    occasion: "Dinner Gala",
    image: "https://picsum.photos/seed/mac-ugc-4/600/800",
    likes: 418,
    caption: "International shipping was super fast! Ordered from London and received my dress in perfect condition in just 4 days.",
    taggedProduct: {
      id: 204,
      name: "Royal Gold Kaftan",
      price: 55000,
      discounted_price: 46750,
      percent_discount: 15,
      pry_image: "https://picsum.photos/seed/flash-3/400/500",
      avg_rating: 5,
      review_count: 22,
    },
  },
  {
    id: "ugc-5",
    username: "@habiba_vogue",
    name: "Habiba A.",
    location: "Port Harcourt, Nigeria",
    occasion: "Birthday Glam",
    image: "https://picsum.photos/seed/mac-ugc-5/600/800",
    likes: 376,
    caption: "The drape and texture of Marvelam satin is elite. 10/10 recommendation for any woman who loves modest luxury.",
    taggedProduct: {
      id: 205,
      name: "Elegance Satin Abaya",
      price: 42000,
      pry_image: "https://picsum.photos/seed/new-1/400/500",
      avg_rating: 4.9,
      review_count: 14,
    },
  },
  {
    id: "ugc-6",
    username: "@maryam_couture",
    name: "Maryam B.",
    location: "Accra, Ghana",
    occasion: "High-Tea Party",
    image: "https://picsum.photos/seed/mac-ugc-6/600/800",
    likes: 295,
    caption: "Obsessed with the cut and color! Paired it with my favorite silk headwrap for an effortless high-fashion look.",
    taggedProduct: {
      id: 206,
      name: "Prestige Organza Boubou",
      price: 58000,
      pry_image: "https://picsum.photos/seed/new-2/400/500",
      avg_rating: 5,
      review_count: 11,
    },
  },
];

export default function UgcGallery({ isDark, onQuickView }) {
  const [activePost, setActivePost] = useState(null);

  return (
    <section className="mx-auto mt-14 max-w-7xl px-4 sm:px-8">
      {/* Section Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#FFB400]">
            <InstagramIcon size={14} /> Real Style, Real People
          </span>
          <h2 className={`font-display text-3xl font-semibold mt-1 ${isDark ? "text-white" : "text-[#141414]"}`}>
            #StyledInMarvelam
          </h2>
        </div>
        <p className={`font-sans text-xs max-w-md ${isDark ? "text-white/55" : "text-neutral-600"}`}>
          See how our clients, brides, and style icons wear Marvelam fashion &amp; fabrics across the globe. Click any photo to shop the item!
        </p>
      </div>

      {/* UGC Image Grid */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {UGC_POSTS.map((post) => (
          <div
            key={post.id}
            onClick={() => setActivePost(post)}
            className={`group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-2xl border transition-all duration-300 ${
              isDark
                ? "border-white/10 bg-[#151515] hover:border-[#FFB400]/60 hover:shadow-lg"
                : "border-[#EAE6DF] bg-white shadow-sm hover:border-[#FFB400] hover:shadow-md"
            }`}
          >
            {/* Customer Photo */}
            <img
              src={post.image}
              alt={post.username}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 transition-opacity group-hover:opacity-95" />

            {/* Top Badge */}
            <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
              <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 font-sans text-[9px] font-semibold text-white backdrop-blur-md border border-white/20">
                <BadgeCheck size={10} className="text-[#FFB400]" /> Verified
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 font-sans text-[9px] font-semibold text-white/90 backdrop-blur-md">
                <Heart size={10} className="fill-red-500 text-red-500" /> {post.likes}
              </span>
            </div>

            {/* Bottom Content Overlay */}
            <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-col gap-1 text-white">
              <p className="font-sans text-[11px] font-bold text-[#FFB400] tracking-wide">
                {post.username}
              </p>
              <p className="font-sans text-[10px] text-white/80 line-clamp-1">
                {post.occasion}
              </p>
              <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-[#FFB400] group-hover:underline">
                <Eye size={11} /> Tap to View Look
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Social CTA Banner */}
      <div
        className={`mt-6 rounded-2xl border p-5 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-300 ${
          isDark
            ? "border-white/10 bg-[#151515]"
            : "border-[#EAE6DF] bg-white shadow-sm"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFB400]/15 text-[#FFB400]">
            <Sparkles size={20} />
          </div>
          <div>
            <h4 className={`font-sans text-xs font-bold uppercase tracking-wider ${isDark ? "text-white" : "text-[#141414]"}`}>
              Want to be featured in our gallery?
            </h4>
            <p className={`font-sans text-xs ${isDark ? "text-white/60" : "text-neutral-500"}`}>
              Tag <span className="font-semibold text-[#FFB400]">@marvelam.apparel</span> or use hashtag <span className="font-semibold text-[#FFB400]">#StyledInMarvelam</span> on Instagram to get featured.
            </p>
          </div>
        </div>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noreferrer"
          className="flex shrink-0 items-center gap-2 rounded-xl bg-[#FFB400] px-4 py-2.5 font-sans text-xs font-bold text-[#0F0F0F] transition-transform hover:scale-105 shadow-md"
        >
          <InstagramIcon size={15} /> Tag Us On Instagram
        </a>
      </div>

      {/* Lightbox Showcase Modal */}
      {activePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
            onClick={() => setActivePost(null)}
          />

          {/* Modal Card */}
          <div
            className={`relative z-10 flex w-full max-w-3xl max-h-[90vh] flex-col overflow-hidden rounded-2xl border shadow-2xl sm:flex-row transition-colors ${
              isDark
                ? "border-white/15 bg-[#151515] text-white"
                : "border-neutral-200 bg-white text-[#141414]"
            }`}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActivePost(null)}
              className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-md transition-colors hover:bg-[#FFB400] hover:text-[#0F0F0F]"
              aria-label="Close lightbox"
            >
              <X size={18} />
            </button>

            {/* Left Side: Large Customer Photo */}
            <div className="relative h-64 w-full shrink-0 overflow-hidden bg-black sm:h-auto sm:w-1/2">
              <img
                src={activePost.image}
                alt={activePost.username}
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-3 left-3 z-10 rounded-lg bg-black/70 px-3 py-1.5 backdrop-blur-md">
                <p className="font-sans text-xs font-bold text-[#FFB400]">
                  {activePost.username}
                </p>
                <p className="font-sans text-[10px] text-white/70">
                  {activePost.location}
                </p>
              </div>
            </div>

            {/* Right Side: Customer Review & Tagged Product */}
            <div className="flex flex-1 flex-col justify-between p-6 overflow-y-auto">
              <div>
                <div className="flex items-center justify-between border-b pb-3 border-white/10">
                  <div>
                    <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#FFB400]">
                      {activePost.occasion}
                    </span>
                    <h3 className="font-sans text-sm font-bold flex items-center gap-1.5 mt-0.5">
                      {activePost.name} <BadgeCheck size={15} className="text-[#FFB400]" />
                    </h3>
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-400 border border-red-500/20">
                    <Heart size={13} className="fill-current" /> {activePost.likes} Likes
                  </span>
                </div>

                {/* Customer Testimonial Caption */}
                <div className="mt-4 rounded-xl border p-4 border-white/10 bg-white/5">
                  <p className={`font-sans text-xs leading-relaxed italic ${isDark ? "text-white/80" : "text-neutral-700"}`}>
                    "{activePost.caption}"
                  </p>
                </div>

                {/* Tagged Product Box */}
                <div className="mt-5">
                  <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#FFB400]">
                    Tagged Product in Photo
                  </span>
                  <div className="mt-2 flex items-center justify-between rounded-xl border p-3 border-white/15 bg-white/5">
                    <div className="flex items-center gap-3">
                      <img
                        src={activePost.taggedProduct.pry_image}
                        alt={activePost.taggedProduct.name}
                        className="h-14 w-14 rounded-lg object-cover bg-neutral-800"
                      />
                      <div>
                        <h4 className="font-sans text-xs font-semibold line-clamp-1">
                          {activePost.taggedProduct.name}
                        </h4>
                        <div className="mt-1 flex items-baseline gap-2">
                          <span className="font-sans text-xs font-bold text-[#FFB400]">
                            {formatNaira(activePost.taggedProduct.discounted_price || activePost.taggedProduct.price)}
                          </span>
                          {activePost.taggedProduct.discounted_price && (
                            <span className="font-sans text-[10px] line-through opacity-40">
                              {formatNaira(activePost.taggedProduct.price)}
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={10}
                              className={
                                i < activePost.taggedProduct.avg_rating
                                  ? "fill-[#FFB400] text-[#FFB400]"
                                  : "text-white/20"
                              }
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick View Trigger Button */}
              <button
                type="button"
                onClick={() => {
                  const productToView = activePost.taggedProduct;
                  setActivePost(null);
                  if (onQuickView) onQuickView(productToView);
                }}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FFB400] py-3 font-sans text-xs font-bold text-[#0F0F0F] transition-transform hover:scale-[1.01] shadow-lg shadow-[#FFB400]/20"
              >
                <Eye size={15} /> Quick View Tagged Outfit
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
