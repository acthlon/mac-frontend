import QuickViewModal from "../components/catalog/QuickViewModal";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import apiClient, { ENDPOINTS } from "../api/client";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Sidebar from "../components/catalog/Sidebar";
import PageHero from "../components/catalog/HeroSection";
import FeaturesBar from "../components/layout/FeaturesBar";
import ToolbarAndGrid from "../components/catalog/ToolbarAndGrid";
import { useTheme } from "../context/ThemeContext";

export default function ProductCatalog({ onSelectProduct }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlCategory = searchParams.get("category") || "all";
  const urlSearch = searchParams.get("search") || "";
  const urlOrdering = searchParams.get("ordering") || searchParams.get("sort") || "";
  const urlPage = Number(searchParams.get("page")) || 1;

  const [catalogData, setCatalogData] = useState({
    count: 0,
    next: null,
    previous: null,
    results: [],
    all_product_categories: [],
  });
  const [currentPage, setCurrentPage] = useState(urlPage);
  const [loading, setLoading] = useState(false);
  const [maxPrice, setMaxPrice] = useState(200000);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [selectedQualityCategory, setSelectedQualityCategory] = useState("all");
  const [ordering, setOrdering] = useState(urlOrdering);
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [selectedRating, setSelectedRating] = useState("all");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [quickViewItem, setQuickViewItem] = useState(null);

  // Sync state if URL search params change externally (e.g. navigation from Header or Sidebar)
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat && cat !== selectedCategory) {
      setSelectedCategory(cat);
      setCurrentPage(1);
    }
  }, [searchParams]);

  useEffect(() => {
    let isMounted = true;
    const getCatalogData = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
        };

        if (maxPrice && maxPrice < 200000) {
          params.max_price = maxPrice;
        }

        if (selectedCategory && selectedCategory !== "all") {
          params.category = selectedCategory;
        }

        if (selectedQualityCategory && selectedQualityCategory !== "all") {
          params.quality_category = selectedQualityCategory;
        }

        if (ordering) {
          params.ordering = ordering;
        }

        if (searchQuery.trim()) {
          params.search = searchQuery.trim();
        }

        if (selectedRating && selectedRating !== "all") {
          params.ratings = selectedRating;
        }

        const response = await apiClient.get(ENDPOINTS.PRODUCTS, { params });

        if (isMounted && response.data) {
          setCatalogData(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch product catalog:", err);
        // If page exceeds available results (e.g. 404 Invalid page), reset to page 1
        if (err.response?.status === 404 && currentPage > 1 && isMounted) {
          setCurrentPage(1);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    getCatalogData();
    return () => {
      isMounted = false;
    };
  }, [
    currentPage,
    maxPrice,
    selectedCategory,
    selectedQualityCategory,
    ordering,
    searchQuery,
    selectedRating,
  ]);

  const handlePriceChange = (price) => {
    setMaxPrice(price);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    if (category === "all") {
      searchParams.delete("category");
      setSearchParams(searchParams);
    } else {
      setSearchParams({ ...Object.fromEntries(searchParams), category });
    }
  };

  const handleQualityCategoryChange = (quality) => {
    setSelectedQualityCategory(quality);
    setCurrentPage(1);
  };

  const handleOrderingChange = (order) => {
    setOrdering(order);
    setCurrentPage(1);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleRatingChange = (rating) => {
    setSelectedRating(rating);
    setCurrentPage(1);
  };

  return (
    <div
      className={`min-h-screen font-sans antialiased transition-colors duration-300 ${
        isDark ? "bg-[#0F0F0F] text-white" : "bg-[#FAF8F5] text-[#1A1A1A]"
      }`}
    >
      <Header searchQuery={searchQuery} setSearchQuery={handleSearchChange} />
      <PageHero />

      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-16 sm:px-8 lg:flex-row">
        <Sidebar
          catalogData={catalogData}
          maxPrice={maxPrice}
          setMaxPrice={handlePriceChange}
          selectedCategory={selectedCategory}
          setSelectedCategory={handleCategoryChange}
          selectedQualityCategory={selectedQualityCategory}
          setSelectedQualityCategory={handleQualityCategoryChange}
          selectedRating={selectedRating}
          setSelectedRating={handleRatingChange}
          isMobileOpen={mobileFilterOpen}
          onCloseMobile={() => setMobileFilterOpen(false)}
        />
        <ToolbarAndGrid
          catalogData={catalogData}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          loading={loading}
          ordering={ordering}
          setOrdering={handleOrderingChange}
          searchQuery={searchQuery}
          setSearchQuery={handleSearchChange}
          selectedCategory={selectedCategory}
          setSelectedCategory={handleCategoryChange}
          selectedQualityCategory={selectedQualityCategory}
          setSelectedQualityCategory={handleQualityCategoryChange}
          maxPrice={maxPrice}
          setMaxPrice={handlePriceChange}
          onOpenMobileFilters={() => setMobileFilterOpen(true)}
          onQuickView={(item) => setQuickViewItem(item)}
        />
      </main>

      <FeaturesBar />
      <Footer />
      <QuickViewModal
        item={quickViewItem}
        onClose={() => setQuickViewItem(null)}
        onViewFullDetails={(item) => {
          if (onSelectProduct) {
            onSelectProduct(item);
          } else {
            const slug =
              item.slug ||
              (item.name
                ? item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
                : "item");
            navigate(`/products/${slug}/${item.id}`);
          }
        }}
      />
    </div>
  );
}
