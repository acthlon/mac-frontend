import {
  ChevronRight,
  ChevronLeft,
  Search,
  X,
  SlidersHorizontal,
  LayoutGrid,
  List,
} from "lucide-react";
import ItemCard from "./ItemCard";
import React, { useState } from "react";
import formatNaira from "../../utils/formatNaira";
import toTitleCase from "../../utils/textFormatter";
import { useTheme } from "../../context/ThemeContext";

export default function ToolbarAndGrid({
  catalogData,
  currentPage,
  setCurrentPage,
  loading,
  ordering,
  setOrdering,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedQualityCategory,
  setSelectedQualityCategory,
  maxPrice,
  setMaxPrice,
  onOpenMobileFilters,
  onQuickView,
}) {
  const [view, setView] = useState("grid");
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const itemLists = catalogData?.results || [];
  const totalCount = catalogData?.count || 0;
  const pageSize = 12;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  return (
    <section className="mt-8 flex-1">
      {/* Top Header */}
      <div
        className={`flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-center sm:justify-between ${
          isDark ? "border-white/10" : "border-neutral-200"
        }`}
      >
        <p
          className={`font-sans text-sm ${
            isDark ? "text-white/55" : "text-neutral-600"
          }`}
        >
          Showing {startItem} – {endItem} of {totalCount} products
        </p>

        {/* Search Input & Sort Dropdown */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Mobile Filter Trigger Button */}
          <button
            type="button"
            onClick={onOpenMobileFilters}
            className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 font-sans text-sm hover:border-[#FFB400] lg:hidden ${
              isDark
                ? "border-white/15 bg-[#1A1A1A] text-white"
                : "border-neutral-300 bg-white text-neutral-800 shadow-sm"
            }`}
          >
            <SlidersHorizontal size={14} className="text-[#FFB400]" />
            <span>Filters</span>
          </button>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search catalog..."
              className={`w-44 rounded-md border py-1.5 pl-3 pr-8 font-sans text-sm focus:border-[#FFB400] focus:outline-none ${
                isDark
                  ? "border-white/15 bg-[#1A1A1A] text-white placeholder:text-white/40"
                  : "border-neutral-300 bg-white text-neutral-800 placeholder:text-neutral-400 shadow-sm"
              }`}
            />

            <Search
              size={14}
              className={`absolute right-2.5 top-1/2 -translate-y-1/2 ${
                isDark ? "text-white/40" : "text-neutral-400"
              }`}
            />
          </div>

          <label
            className={`flex items-center gap-2 font-sans text-sm ${
              isDark ? "text-white/70" : "text-neutral-600"
            }`}
          >
            Sort by:
            <select
              value={ordering}
              onChange={(e) => setOrdering(e.target.value)}
              className={`rounded-md border px-3 py-1.5 font-sans text-sm focus:border-[#FFB400] focus:outline-none ${
                isDark
                  ? "border-white/15 bg-[#1A1A1A] text-white"
                  : "border-neutral-300 bg-white text-neutral-800 shadow-sm"
              }`}
            >
              <option value="">Default Order</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="quality_category">Quality: A to Z</option>
              <option value="-quality_category">Quality: Z to A</option>
            </select>
          </label>

          {/* Grid / List View Toggle Switcher */}
          <div
            className={`flex items-center gap-1 rounded-md border p-1 ${
              isDark
                ? "border-white/15 bg-[#1A1A1A]"
                : "border-neutral-300 bg-white shadow-sm"
            }`}
          >
            <button
              type="button"
              onClick={() => setView("grid")}
              title="Grid View"
              className={`rounded p-1 transition-colors ${
                view === "grid"
                  ? "bg-[#FFB400] text-[#0F0F0F]"
                  : isDark
                  ? "text-white/50 hover:text-white"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              type="button"
              onClick={() => setView("list")}
              title="List View"
              className={`rounded p-1 transition-colors ${
                view === "list"
                  ? "bg-[#FFB400] text-[#0F0F0F]"
                  : isDark
                  ? "text-white/50 hover:text-white"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Pills Bar */}
      {(selectedCategory !== "all" ||
        selectedQualityCategory !== "all" ||
        maxPrice < 200000 ||
        searchQuery.trim() !== "") && (
        <div
          className={`mt-4 flex flex-wrap items-center gap-2 border-b pb-4 ${
            isDark ? "border-white/10" : "border-neutral-200"
          }`}
        >
          <span
            className={`font-sans text-xs font-semibold uppercase tracking-wider mr-1 ${
              isDark ? "text-white/50" : "text-neutral-500"
            }`}
          >
            Active Filters:
          </span>

          {/* Category Pill */}
          {selectedCategory !== "all" && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FFB400]/40 bg-[#FFB400]/10 px-3 py-1 font-sans text-xs text-[#FFB400]">
              Category: {toTitleCase(selectedCategory)}
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className="hover:opacity-80"
                aria-label="Remove category filter"
              >
                <X size={12} />
              </button>
            </span>
          )}

          {/* Quality Category Pill */}
          {selectedQualityCategory !== "all" && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FFB400]/40 bg-[#FFB400]/10 px-3 py-1 font-sans text-xs text-[#FFB400]">
              Quality: {toTitleCase(selectedQualityCategory)}
              <button
                type="button"
                onClick={() => setSelectedQualityCategory("all")}
                className="hover:opacity-80"
                aria-label="Remove quality filter"
              >
                <X size={12} />
              </button>
            </span>
          )}

          {/* Max Price Pill */}
          {maxPrice < 200000 && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FFB400]/40 bg-[#FFB400]/10 px-3 py-1 font-sans text-xs text-[#FFB400]">
              Max Price: {formatNaira(maxPrice)}
              <button
                type="button"
                onClick={() => setMaxPrice(200000)}
                className="hover:opacity-80"
                aria-label="Remove max price filter"
              >
                <X size={12} />
              </button>
            </span>
          )}

          {/* Search Query Pill */}
          {searchQuery.trim() !== "" && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FFB400]/40 bg-[#FFB400]/10 px-3 py-1 font-sans text-xs text-[#FFB400]">
              Search: "{searchQuery}"
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="hover:opacity-80"
                aria-label="Remove search query"
              >
                <X size={12} />
              </button>
            </span>
          )}

          {/* Clear All Button */}
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("all");
              setSelectedQualityCategory("all");
              setMaxPrice(200000);
              setSearchQuery("");
            }}
            className={`ml-auto font-sans text-xs underline hover:text-[#FFB400] ${
              isDark ? "text-white/50" : "text-neutral-500"
            }`}
          >
            Clear All
          </button>
        </div>
      )}

      {/* Product Grid / Loading / Empty State */}
      {loading ? (
        <div
          className={`mt-12 text-center ${
            isDark ? "text-white/60" : "text-neutral-500"
          }`}
        >
          Loading products...
        </div>
      ) : itemLists.length === 0 ? (
        <div className="mt-12 py-12 text-center">
          <p
            className={`text-lg font-medium ${
              isDark ? "text-white/80" : "text-neutral-800"
            }`}
          >
            No products found
          </p>
          <p
            className={`mt-1 text-sm ${
              isDark ? "text-white/50" : "text-neutral-500"
            }`}
          >
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <div
          className={
            view === "list"
              ? "mt-6 flex flex-col gap-4"
              : "mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 xl:grid-cols-4"
          }
        >
          {itemLists.map((item, index) => (
            <ItemCard
              key={item.id || index}
              item={item}
              view={view}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      )}

      {/* Dynamic Pagination Bar */}
      <nav
        aria-label="Pagination"
        className="mt-10 flex items-center justify-center gap-2 font-sans text-sm"
      >
        <button
          type="button"
          disabled={!catalogData?.previous || currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          aria-label="Previous page"
          className={`flex h-9 w-9 items-center justify-center rounded-md border transition-colors duration-150 ${
            catalogData?.previous
              ? isDark
                ? "border-white/15 text-white/70 hover:border-[#FFB400] hover:text-[#FFB400]"
                : "border-neutral-300 text-neutral-700 hover:border-[#FFB400] hover:text-[#FFB400]"
              : isDark
              ? "cursor-not-allowed border-white/10 text-white/20"
              : "cursor-not-allowed border-neutral-200 text-neutral-300"
          }`}
        >
          <ChevronLeft size={15} />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => setCurrentPage(page)}
            className={`flex h-9 w-9 items-center justify-center rounded-md border transition-colors duration-150 ${
              page === currentPage
                ? "border-[#FFB400] bg-[#FFB400] font-semibold text-[#0F0F0F]"
                : isDark
                ? "border-white/15 text-white/70 hover:border-[#FFB400] hover:text-[#FFB400]"
                : "border-neutral-300 text-neutral-700 hover:border-[#FFB400] hover:text-[#FFB400]"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          disabled={!catalogData?.next}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          aria-label="Next page"
          className={`flex h-9 w-9 items-center justify-center rounded-md border transition-colors duration-150 ${
            catalogData?.next
              ? "border-[#FFB400] text-[#FFB400] hover:bg-[#FFB400] hover:text-[#0F0F0F]"
              : isDark
              ? "cursor-not-allowed border-white/10 text-white/20"
              : "cursor-not-allowed border-neutral-200 text-neutral-300"
          }`}
        >
          <ChevronRight size={15} />
        </button>
      </nav>
    </section>
  );
}
