import { X, Star } from "lucide-react";
import { useState, useEffect } from "react";
import FilterGroup from "./FilterGroup";
import formatNaira from "../../utils/formatNaira";
import toTitleCase from "../../utils/textFormatter";
import formatMaterialName from "../../utils/materialNames";
import { useTheme } from "../../context/ThemeContext";

export default function Sidebar({
  catalogData,
  maxPrice,
  setMaxPrice,
  selectedCategory,
  setSelectedCategory,
  selectedQualityCategory,
  setSelectedQualityCategory,
  isMobileOpen = false,
  onCloseMobile,
  selectedRating,
  setSelectedRating,
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const isMaterialCatalog = Boolean(catalogData?.all_material_categories);
  const categories =
    catalogData?.all_product_categories ||
    catalogData?.all_material_categories ||
    [];
  const categoryGroupTitle = isMaterialCatalog
    ? "Fabric Categories"
    : "Product Categories";
  const QUALITY_CATEGORIES = ["LUXURY", "PREMIUM", "REGULAR"];
  const RATINGS = [5, 4, 3, 2, 1];

  // Local state for smooth slider dragging
  const [localPrice, setLocalPrice] = useState(maxPrice);

  useEffect(() => {
    setLocalPrice(maxPrice);
  }, [maxPrice]);

  const textColorClass = isDark
    ? "text-white/70 hover:text-[#FFB400]"
    : "text-[#4A453E] hover:text-[#D4AF37]";

  return (
    <>
      <aside className="hidden w-64 shrink-0 lg:block">
        <div
          className={`rounded-2xl border p-6 transition-all duration-300 ${
            isDark
              ? "border-white/10 bg-[#151515]"
              : "border-[#EAE6DF] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
          }`}
        >
          {/* Main Categories */}
          <FilterGroup title={categoryGroupTitle}>
            <ul className="space-y-2.5 font-sans text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => setSelectedCategory("all")}
                  className={`transition-colors duration-150 ${
                    selectedCategory === "all"
                      ? "font-semibold text-[#FFB400]"
                      : textColorClass
                  }`}
                >
                  All Categories
                </button>
              </li>

              {categories.map((cat) => {
                const catName = cat?.name || cat || "";
                const displayName = isMaterialCatalog
                  ? formatMaterialName(catName)
                  : catName;
                const safeSelected = String(selectedCategory || "").toLowerCase();
                const safeCatName = String(catName || "").toLowerCase();
                const safeSlug = String(cat?.slug || "").toLowerCase();
                const isSelected =
                  Boolean(safeSelected) &&
                  (safeSelected === safeCatName ||
                    (Boolean(safeSlug) && safeSelected === safeSlug));
                return (
                  <li key={cat?.id || catName}>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory(catName)}
                      className={`transition-colors duration-150 ${
                        isSelected
                          ? "font-semibold text-[#FFB400]"
                          : textColorClass
                      }`}
                    >
                      {toTitleCase(displayName)}
                    </button>
                  </li>
                );
              })}
            </ul>
          </FilterGroup>

          {/* Quality Categories */}
          {QUALITY_CATEGORIES.length > 0 && (
            <FilterGroup title="Quality Categories">
              <ul className="space-y-2.5 font-sans text-sm">
                <li>
                  <button
                    type="button"
                    onClick={() => setSelectedQualityCategory("all")}
                    className={`transition-colors duration-150 ${
                      selectedQualityCategory === "all"
                        ? "font-semibold text-[#FFB400]"
                        : textColorClass
                    }`}
                  >
                    All Quality Categories
                  </button>
                </li>

                {QUALITY_CATEGORIES.map((qualityName) => (
                  <li key={qualityName}>
                    <button
                      type="button"
                      onClick={() => setSelectedQualityCategory(qualityName)}
                      className={`transition-colors duration-150 ${
                        selectedQualityCategory.toLowerCase() ===
                        qualityName.toLowerCase()
                          ? "font-semibold text-[#FFB400]"
                          : textColorClass
                      }`}
                    >
                      {toTitleCase(qualityName)}
                    </button>
                  </li>
                ))}
              </ul>
            </FilterGroup>
          )}

          {/* Product Ratings Filter */}
          <FilterGroup title="Product Rating">
            <ul className="space-y-2.5 font-sans text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => setSelectedRating("all")}
                  className={`transition-colors duration-150 ${
                    selectedRating === "all"
                      ? "font-semibold text-[#FFB400]"
                      : textColorClass
                  }`}
                >
                  All Ratings
                </button>
              </li>

              {RATINGS.map((stars) => (
                <li key={stars}>
                  <button
                    type="button"
                    onClick={() => setSelectedRating(stars)}
                    className={`flex items-center gap-1.5 transition-colors duration-150 ${
                      String(selectedRating) === String(stars)
                        ? "font-semibold text-[#FFB400]"
                        : textColorClass
                    }`}
                  >
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={
                            i < stars
                              ? "fill-[#FFB400] text-[#FFB400]"
                              : isDark
                              ? "fill-transparent text-white/20"
                              : "fill-transparent text-neutral-300"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-xs">
                      {stars}.0 {stars === 5 ? "" : "& Up"}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </FilterGroup>

          {/* Price Range Slider */}
          <FilterGroup title="Price Range">
            <input
              type="range"
              min="10000"
              max="200000"
              step="5000"
              value={localPrice}
              onChange={(e) => setLocalPrice(Number(e.target.value))}
              onMouseUp={() => setMaxPrice(localPrice)}
              onTouchEnd={() => setMaxPrice(localPrice)}
              className="w-full accent-[#FFB400]"
            />
            <div
              className={`mt-2 flex justify-between font-sans text-xs ${
                isDark ? "text-white/60" : "text-[#777065]"
              }`}
            >
              <span>₦10,000</span>
              <span className="font-semibold text-[#FFB400]">
                Max: {formatNaira(localPrice)}
              </span>
            </div>
          </FilterGroup>
        </div>

        {/* Tailoring Card */}
        <div className="relative mt-6 overflow-hidden rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
          <img
            src="https://picsum.photos/seed/mac-tailoring/400/500"
            alt="Tailoring service"
            className="h-56 w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/60 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5">
            <p className="font-display text-lg leading-tight text-[#F9FAFB]">
              Need a perfect fit?
            </p>
            <p className="mt-1 font-sans text-xs text-white/70">
              We offer professional tailoring services to make it just for you.
            </p>
            <button
              type="button"
              className="mt-3 rounded-md border border-[#FFB400] px-4 py-2 font-sans text-xs font-semibold text-[#FFB400] transition-colors duration-200 hover:bg-[#FFB400] hover:text-[#0F0F0F]"
            >
              Book Tailoring
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            onClick={onCloseMobile}
          />

          <div
            className={`relative z-10 ml-auto flex h-full w-full max-w-xs flex-col p-6 shadow-2xl overflow-y-auto ${
              isDark ? "bg-[#151515] text-white" : "bg-[#FBF9F5] text-[#141414]"
            }`}
          >
            <div
              className={`flex items-center justify-between border-b pb-4 mb-4 ${
                isDark ? "border-white/10" : "border-[#EAE6DF]"
              }`}
            >
              <h2 className="font-display text-lg font-semibold">
                Filter {isMaterialCatalog ? "Fabrics" : "Products"}
              </h2>
              <button
                type="button"
                onClick={onCloseMobile}
                className="rounded-md p-1 opacity-70 hover:opacity-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Product / Material Categories */}
            <FilterGroup title={categoryGroupTitle}>
              <ul className="space-y-2.5 font-sans text-sm">
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory("all");
                      onCloseMobile && onCloseMobile();
                    }}
                    className={`transition-colors ${
                      selectedCategory === "all"
                        ? "font-semibold text-[#FFB400]"
                        : textColorClass
                    }`}
                  >
                    All Categories
                  </button>
                </li>
                {categories.map((cat) => {
                  const catName = cat?.name || cat || "";
                  const displayName = isMaterialCatalog
                    ? formatMaterialName(catName)
                    : catName;
                  const safeSelected = String(selectedCategory || "").toLowerCase();
                  const safeCatName = String(catName || "").toLowerCase();
                  const safeSlug = String(cat?.slug || "").toLowerCase();
                  const isSelected =
                    Boolean(safeSelected) &&
                    (safeSelected === safeCatName ||
                      (Boolean(safeSlug) && safeSelected === safeSlug));
                  return (
                    <li key={cat?.id || catName}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCategory(catName);
                          onCloseMobile && onCloseMobile();
                        }}
                        className={`transition-colors ${
                          isSelected
                            ? "font-semibold text-[#FFB400]"
                            : textColorClass
                        }`}
                      >
                        {toTitleCase(displayName)}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </FilterGroup>

            {/* Product Ratings Filter */}
            <FilterGroup title="Product Rating">
              <ul className="space-y-2.5 font-sans text-sm">
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRating("all");
                      onCloseMobile && onCloseMobile();
                    }}
                    className={`transition-colors ${
                      selectedRating === "all"
                        ? "font-semibold text-[#FFB400]"
                        : textColorClass
                    }`}
                  >
                    All Ratings
                  </button>
                </li>
                {RATINGS.map((stars) => (
                  <li key={stars}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRating(stars);
                        onCloseMobile && onCloseMobile();
                      }}
                      className={`flex items-center gap-1.5 transition-colors ${
                        String(selectedRating) === String(stars)
                          ? "font-semibold text-[#FFB400]"
                          : textColorClass
                      }`}
                    >
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={
                              i < stars
                                ? "fill-[#FFB400] text-[#FFB400]"
                                : isDark
                                ? "fill-transparent text-white/20"
                                : "fill-transparent text-neutral-300"
                            }
                          />
                        ))}
                      </div>
                      <span className="text-xs">
                        {stars}.0 {stars === 5 ? "" : "& Up"}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </FilterGroup>

            {/* Price Slider */}
            <FilterGroup title="Price Range">
              <input
                type="range"
                min="10000"
                max="200000"
                step="5000"
                value={localPrice}
                onChange={(e) => setLocalPrice(Number(e.target.value))}
                onMouseUp={() => setMaxPrice(localPrice)}
                onTouchEnd={() => setMaxPrice(localPrice)}
                className="w-full accent-[#FFB400]"
              />
              <div
                className={`mt-2 flex justify-between font-sans text-xs ${
                  isDark ? "text-white/60" : "text-[#777065]"
                }`}
              >
                <span>₦10,000</span>
                <span className="font-semibold text-[#FFB400]">
                  Max: {formatNaira(localPrice)}
                </span>
              </div>
            </FilterGroup>

            <button
              type="button"
              onClick={onCloseMobile}
              className="mt-6 w-full rounded-md bg-[#FFB400] py-2.5 font-sans text-sm font-semibold text-[#0F0F0F]"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}
