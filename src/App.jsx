import React from "react";
import { BrowserRouter, Routes, Route, useNavigate, useParams } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductCatalog from "./pages/ProductCatalog";
import ProductDetails from "./pages/ProductDetails";
import FabricCatalog from "./pages/FabricCatalog";
import CheckoutPage from "./pages/CheckoutPage";
import StyleFinderPage from "./pages/StyleFinderPage";
import LookbookPage from "./pages/LookbookPage";
import CommunityPage from "./pages/CommunityPage";
import ShoppingCartPage from "./pages/ShoppingCartPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import AboutPage from "./pages/AboutPage";
import TrackingPage from "./pages/TrackingPage";
import AccountProfilePage from "./pages/AccountProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import { ThemeProvider } from "./context/ThemeContext";
import { CartProvider } from "./context/CartContext";
import CartDrawer from "./components/cart/CartDrawer";

// Route wrapper for ProductDetails page
function ProductDetailsRouteWrapper() {
  const { id, slug } = useParams();
  const navigate = useNavigate();

  return (
    <ProductDetails
      product={{ id, slug }}
      onBackToCatalog={() => navigate("/products")}
      onSelectProduct={(item) =>
        navigate(`/products/${item.slug || "item"}/${item.id}`)
      }
    />
  );
}

// Route wrapper for ProductCatalog page
function ProductCatalogRouteWrapper() {
  const navigate = useNavigate();

  return (
    <ProductCatalog
      onSelectProduct={(item) =>
        navigate(`/products/${item.slug || "item"}/${item.id}`)
      }
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <CartProvider>
          <Routes>
            {/* Standard Storefront Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductCatalogRouteWrapper />} />
            <Route path="/catalog" element={<ProductCatalogRouteWrapper />} />
            
            {/* Standard Product Details Routes */}
            <Route path="/products/:id" element={<ProductDetailsRouteWrapper />} />
            <Route path="/products/:slug/:id" element={<ProductDetailsRouteWrapper />} />
            <Route path="/product/:id" element={<ProductDetailsRouteWrapper />} />
            <Route path="/product/:slug/:id" element={<ProductDetailsRouteWrapper />} />

            {/* Fabrics / Materials Catalog & Detail Routes */}
            <Route path="/fabrics" element={<FabricCatalog />} />
            <Route path="/materials" element={<FabricCatalog />} />
            <Route path="/fabrics/:id" element={<ProductDetailsRouteWrapper />} />
            <Route path="/fabrics/:slug/:id" element={<ProductDetailsRouteWrapper />} />
            <Route path="/materials/:id" element={<ProductDetailsRouteWrapper />} />
            <Route path="/materials/:slug/:id" element={<ProductDetailsRouteWrapper />} />

            {/* Cart & Checkout */}
            <Route path="/cart" element={<ShoppingCartPage />} />
            <Route path="/cart/" element={<ShoppingCartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />

            {/* Auth */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signin" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/register" element={<SignUpPage />} />

            {/* Account & Orders */}
            <Route path="/account" element={<AccountProfilePage />} />
            <Route path="/account/profile" element={<AccountProfilePage />} />
            <Route path="/account/details" element={<AccountProfilePage />} />
            <Route path="/profile" element={<AccountProfilePage />} />
            <Route path="/account/orders" element={<OrderHistoryPage />} />
            <Route path="/account/orders/:orderId" element={<OrderDetailsPage />} />
            <Route path="/orders" element={<OrderHistoryPage />} />
            <Route path="/orders/:orderId" element={<OrderDetailsPage />} />
            <Route path="/order/:orderId" element={<OrderDetailsPage />} />

            {/* Tracking Routes */}
            <Route path="/track" element={<TrackingPage />} />
            <Route path="/track/:orderNumber" element={<TrackingPage />} />
            <Route path="/track-order" element={<TrackingPage />} />
            <Route path="/order-tracking" element={<TrackingPage />} />

            {/* Brand & Editorial */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/how-it-works" element={<AboutPage />} />
            <Route path="/style-finder" element={<StyleFinderPage />} />
            <Route path="/lookbook" element={<LookbookPage />} />
            <Route path="/community" element={<CommunityPage />} />

            {/* 404 Catch-All */}
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <CartDrawer />
        </CartProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
