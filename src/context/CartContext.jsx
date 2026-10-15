import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import apiClient, { ENDPOINTS, getAuthToken, isAuthenticated } from "../api/client";

const CartContext = createContext();

const COLOR_NAME_MAP = {
  BRN: "Brown",
  BLK: "Black",
  WHT: "White",
  GLD: "Gold",
  CHM: "Champagne",
  EMR: "Emerald",
  RED: "Red",
  BLU: "Blue",
  GRN: "Green",
  PNK: "Pink",
  SLV: "Silver",
  PRP: "Purple",
  NVY: "Navy",
  ORG: "Orange",
  YEL: "Yellow",
  BGE: "Beige",
};

export function formatColorName(code) {
  if (!code) return "";
  const upper = String(code).toUpperCase().trim();
  return COLOR_NAME_MAP[upper] || code;
}

export function CartProvider({ children }) {
  // Purge any stale mock items from old tests
  useEffect(() => {
    try {
      const saved = localStorage.getItem("mac_cart_items");
      if (saved && (saved.includes("Classic Lace") || saved.includes("test-item-"))) {
        localStorage.removeItem("mac_cart_items");
        localStorage.removeItem("mac_cart_code");
      }
    } catch {}
  }, []);

  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("mac_cart_items");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && !saved.includes("Classic Lace") && !saved.includes("test-item-")) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [cartCode, setCartCode] = useState(() => {
    return localStorage.getItem("mac_cart_code") || "";
  });

  const [cartSummary, setCartSummary] = useState({
    totalQuantity: 0,
    totalActualPrice: 0,
    totalDiscount: 0,
    totalDiscountedPrice: 0,
  });

  const [similarItems, setSimilarItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartError, setCartError] = useState(null);

  // Sync current cart items to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("mac_cart_items", JSON.stringify(cartItems));
      if (cartCode) localStorage.setItem("mac_cart_code", cartCode);
      else localStorage.removeItem("mac_cart_code");
    } catch (err) {
      console.error("Failed to save cart to localStorage:", err);
    }
  }, [cartItems, cartCode]);

  // Normalize backend cart items
  const mapBackendItems = useCallback((rawItems) => {
    if (!Array.isArray(rawItems)) return [];
    return rawItems.map((item, index) => {
      const itemId = String(item.id || item.product_id || `item-${index}`);
      const color = item.color || null;
      const size = item.size || null;
      const uniqueId = `${itemId}-${color || "none"}-${size || "none"}`;

      const actualPrice = Number(item.actual_price ?? item.product_price ?? item.price) || 0;
      const discPrice = item.discounted_price ? Number(item.discounted_price) : null;
      const effectivePrice = discPrice && discPrice > 0 ? discPrice : actualPrice;
      const qty = Number(item.quantity) || 1;
      const subtotalPrice = Number(item.item_subtotal_price) || (effectivePrice * qty);
      const percentDiscount = Number(item.percent_discount) || (
        actualPrice > effectivePrice && actualPrice > 0
          ? Math.round(((actualPrice - effectivePrice) / actualPrice) * 100)
          : 0
      );

      const image =
        item.pry_image ||
        item.image ||
        `https://picsum.photos/seed/${itemId}/300/400`;

      return {
        uniqueId,
        id: itemId,
        product_id: item.product_id || itemId,
        name: item.name || item.product_name || "Product",
        model_name: item.model_name || "productvariantsize",
        price: effectivePrice,
        actual_price: actualPrice,
        originalPrice: actualPrice > 0 ? actualPrice : effectivePrice,
        discounted_price: discPrice,
        percent_discount: percentDiscount,
        quantity: qty,
        qty: qty,
        color,
        color_display: formatColorName(color),
        size,
        item_subtotal_price: subtotalPrice,
        total_price: subtotalPrice,
        image,
      };
    });
  }, []);

  // Fetch Cart directly from backend (only when authenticated)
  const fetchBackendCart = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setLoadingCart(false);
      return;
    }

    setLoadingCart(true);
    setCartError(null);
    try {
      const response = await apiClient.get(ENDPOINTS.CART);
      if (response?.data) {
        const data = response.data;

        // 1. Cart Code
        setCartCode(data.cart_code || "");

        // 2. Parse items directly from backend
        const rawItems = data.cart_items || data.items || [];
        const mapped = mapBackendItems(rawItems);
        setCartItems(mapped);

        // 3. Parse cart summary
        if (data.cart_summary) {
          const s = data.cart_summary;
          setCartSummary({
            totalQuantity: Number(s.total_item_quantity) || 0,
            totalActualPrice: Number(s.cart_total_actual_price) || 0,
            totalDiscount: Number(s.cart_total_discount) || 0,
            totalDiscountedPrice: Number(s.cart_total_discounted_price) || 0,
          });
        } else {
          const tActual = Number(data.total_price) || 0;
          const tDiscounted = Number(data.total_discounted_price || data.total_price) || 0;
          setCartSummary({
            totalQuantity: rawItems.reduce((acc, i) => acc + (Number(i.quantity) || 1), 0),
            totalActualPrice: tActual,
            totalDiscount: Math.max(0, tActual - tDiscounted),
            totalDiscountedPrice: tDiscounted,
          });
        }

        // 4. Other similar items
        if (Array.isArray(data.other_similar_items)) {
          setSimilarItems(data.other_similar_items);
        }
      }
    } catch (err) {
      if (err.response?.status === 401) {
        console.info("Cart: Session expired or unauthenticated, falling back to local cart.");
      } else {
        console.warn("Cart fetch notice:", err.message);
        setCartError(err.message);
      }
    } finally {
      setLoadingCart(false);
    }
  }, [mapBackendItems]);

  // Initial load
  useEffect(() => {
    fetchBackendCart();
  }, [fetchBackendCart]);

  // Sync Guest Cart items from localStorage to backend upon login/signup
  const syncGuestCartToBackend = useCallback(async () => {
    const token = getAuthToken();
    if (!token) return;

    let localItems = [];
    try {
      const saved = localStorage.getItem("mac_cart_items");
      if (saved) {
        localItems = JSON.parse(saved);
      }
    } catch {
      localItems = [];
    }

    if (Array.isArray(localItems) && localItems.length > 0) {
      console.info(`Syncing ${localItems.length} guest cart items to backend...`);
      for (const item of localItems) {
        try {
          const varSizeId =
            item.product_var_size_id ||
            (item.model_name === "productvariantsize" && !isNaN(Number(item.id))
              ? Number(item.id)
              : null);
          const matVarId =
            item.material_var_id ||
            (item.model_name === "materialvariant" && !isNaN(Number(item.id))
              ? Number(item.id)
              : null);

          const payload = {
            quantity: Number(item.quantity || item.qty || 1),
          };

          if (varSizeId) {
            payload.product_var_size_id = Number(varSizeId);
          } else if (matVarId) {
            payload.material_var_id = Number(matVarId);
          } else if (item.id && !isNaN(Number(item.id))) {
            payload.product_var_size_id = Number(item.id);
          } else if (item.product_id && !isNaN(Number(item.product_id))) {
            payload.product_var_size_id = Number(item.product_id);
          }

          if (payload.product_var_size_id || payload.material_var_id) {
            await apiClient.post(ENDPOINTS.CART_ADD, payload);
          } else {
            console.warn("Item skipped during sync (no variant ID available):", item.name);
          }
        } catch (err) {
          console.warn("Notice syncing item to backend:", item.name, err.response?.data || err.message);
        }
      }

      // Clear guest items now that they are synced
      try {
        localStorage.removeItem("mac_cart_items");
      } catch {}
    }

    // Refresh official backend cart after syncing
    await fetchBackendCart();
  }, [fetchBackendCart]);

  // Derived totals
  const cartCount =
    cartSummary.totalQuantity > 0
      ? cartSummary.totalQuantity
      : cartItems.reduce((total, item) => total + (item.quantity || item.qty || 1), 0);

  const subtotal =
    cartSummary.totalDiscountedPrice > 0
      ? cartSummary.totalDiscountedPrice
      : cartItems.reduce((total, item) => {
          const itemPrice = Number(item.price) || 0;
          const qty = Number(item.quantity || item.qty) || 1;
          return total + itemPrice * qty;
        }, 0);

  const totalOriginalPrice =
    cartSummary.totalActualPrice > 0
      ? cartSummary.totalActualPrice
      : cartItems.reduce((total, item) => {
          const orig = Number(item.actual_price || item.originalPrice || item.price) || 0;
          const qty = Number(item.quantity || item.qty) || 1;
          return total + orig * qty;
        }, 0);

  const totalDiscount =
    cartSummary.totalDiscount > 0
      ? cartSummary.totalDiscount
      : totalOriginalPrice > subtotal
      ? totalOriginalPrice - subtotal
      : 0;

  // Add item to cart (immediate local update + backend sync if authenticated)
  const addToCart = async (product, options = {}) => {
    const {
      color = null,
      size = null,
      quantity = 1,
      customMeasurements = null,
      addToCartUrl = null,
      product_var_size_id = null,
      material_var_id = null,
    } = options;

    const resolvedProductVarSizeId =
      product_var_size_id ||
      product.product_var_size_id ||
      (product.model_name === "productvariantsize" && !isNaN(Number(product.id))
        ? Number(product.id)
        : null);
    const resolvedMaterialVarId =
      material_var_id ||
      product.material_var_id ||
      (product.model_name === "materialvariant" && !isNaN(Number(product.id))
        ? Number(product.id)
        : null);

    const pId = String(product.id || product.product_id);
    const itemPrice = Number(product.discounted_price || product.price) || 0;
    const actualPrice = Number(product.price) || itemPrice;
    const uniqueId = `${pId}-${color || "none"}-${size || "none"}`;
    const productImage =
      product.pry_image ||
      product.image ||
      product.product_info?.pry_image ||
      `https://picsum.photos/seed/${pId}/300/400`;

    // 1. Instant local state update (works for both guest and authenticated users)
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.uniqueId === uniqueId);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        updated[existingIndex].qty += quantity;
        return updated;
      }
      return [
        ...prevItems,
        {
          uniqueId,
          id: pId,
          product_id: pId,
          product_var_size_id: resolvedProductVarSizeId,
          material_var_id: resolvedMaterialVarId,
          name: product.name || product.product_info?.name || "Product",
          model_name: product.model_name || "productvariantsize",
          price: itemPrice,
          actual_price: actualPrice,
          originalPrice: actualPrice,
          discounted_price: product.discounted_price ? Number(product.discounted_price) : null,
          image: productImage,
          color,
          color_display: formatColorName(color),
          size,
          quantity,
          qty: quantity,
          customMeasurements,
        },
      ];
    });

    // 2. Sync with backend if authenticated
    const token = getAuthToken();
    if (token) {
      const apiEndpoint = addToCartUrl || ENDPOINTS.CART_ADD;
      try {
        const payload = {
          quantity,
        };
        if (resolvedProductVarSizeId) {
          payload.product_var_size_id = Number(resolvedProductVarSizeId);
        } else if (resolvedMaterialVarId) {
          payload.material_var_id = Number(resolvedMaterialVarId);
        } else if (!isNaN(Number(pId))) {
          payload.product_var_size_id = Number(pId);
        }

        if (payload.product_var_size_id || payload.material_var_id) {
          await apiClient.post(apiEndpoint, payload);
          // Re-fetch cart from backend to sync live state
          await fetchBackendCart();
        } else {
          console.warn("Could not determine variant ID for authenticated add to cart");
        }
      } catch (err) {
        console.warn("Cart backend sync notice:", err.message);
      }
    } else {
      console.info("Guest mode: item saved to browser localStorage.");
    }
  };

  // Remove item from cart
  const removeFromCart = async (uniqueId) => {
    const itemToRemove = cartItems.find(
      (item) => item.uniqueId === uniqueId || item.id === uniqueId
    );
    setCartItems((prev) => {
      const next = prev.filter(
        (item) => item.uniqueId !== uniqueId && item.id !== uniqueId
      );
      if (next.length === 0) {
        setCartCode("");
        setCartSummary({
          totalQuantity: 0,
          totalActualPrice: 0,
          totalDiscount: 0,
          totalDiscountedPrice: 0,
        });
      }
      return next;
    });

    const token = getAuthToken();
    if (token && itemToRemove?.id && String(itemToRemove.id).includes("-")) {
      try {
        await apiClient.delete(`cart/${itemToRemove.id}/manage/`);
        await fetchBackendCart();
      } catch (err) {
        console.warn("Notice deleting backend cart item:", err.message);
      }
    }
  };

  // Update quantity (+ / -)
  const updateQuantity = async (uniqueId, newQtyOrDelta) => {
    let targetItem = null;
    let computedQty = 1;

    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.uniqueId === uniqueId || item.id === uniqueId) {
            const nextQty =
              typeof newQtyOrDelta === "number" && newQtyOrDelta > 50
                ? item.quantity + 1
                : typeof newQtyOrDelta === "number" && newQtyOrDelta >= 0
                ? newQtyOrDelta
                : item.quantity + (newQtyOrDelta || 1);
            if (nextQty > 0) {
              targetItem = item;
              computedQty = nextQty;
              return { ...item, quantity: nextQty, qty: nextQty };
            }
            return null;
          }
          return item;
        })
        .filter(Boolean)
    );

    const token = getAuthToken();
    if (token && targetItem?.id && String(targetItem.id).includes("-")) {
      try {
        await apiClient.patch(`cart/${targetItem.id}/manage/`, {
          quantity: computedQty,
        });
        await fetchBackendCart();
      } catch (err) {
        console.warn("Notice updating backend cart item quantity:", err.message);
      }
    }
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    setCartCode("");
    setCartSummary({
      totalQuantity: 0,
      totalActualPrice: 0,
      totalDiscount: 0,
      totalDiscountedPrice: 0,
    });
    try {
      localStorage.removeItem("mac_cart_items");
      localStorage.removeItem("mac_cart_code");
    } catch {}
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const isGuestCart = !isAuthenticated();

  return (
    <CartContext.Provider
      value={{
        cartCode,
        cartItems,
        cartCount,
        subtotal,
        totalOriginalPrice,
        totalDiscount,
        cartSummary,
        similarItems,
        loadingCart,
        cartError,
        isCartOpen,
        isGuestCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        refreshCart: fetchBackendCart,
        syncGuestCartToBackend,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    return {
      cartCode: "",
      cartItems: [],
      cartCount: 0,
      subtotal: 0,
      totalOriginalPrice: 0,
      totalDiscount: 0,
      cartSummary: { totalQuantity: 0, totalActualPrice: 0, totalDiscount: 0, totalDiscountedPrice: 0 },
      similarItems: [],
      loadingCart: false,
      cartError: null,
      isCartOpen: false,
      isGuestCart: true,
      addToCart: () => {},
      removeFromCart: () => {},
      updateQuantity: () => {},
      clearCart: () => {},
      refreshCart: () => {},
      syncGuestCartToBackend: async () => {},
      openCart: () => {},
      closeCart: () => {},
      toggleCart: () => {},
    };
  }
  return context;
}
