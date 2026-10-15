import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import {
  ChevronRight,
  LayoutDashboard,
  Package,
  MapPin,
  Settings,
  LogOut,
  Truck,
  CheckCircle2,
  Clock,
  Download,
  RotateCcw,
  XCircle,
  MessageCircle,
  CreditCard,
  Star,
  RefreshCw,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import apiClient, { ENDPOINTS, isAuthenticated, logout } from "../api/client";
import formatNaira from "../utils/formatNaira";
import { getOrderCategory, STATUS_STYLES } from "./OrderHistoryPage";
import InvoiceModal from "../components/orders/InvoiceModal";

const ACCOUNT_NAV = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Orders", icon: Package, active: true },
  { label: "Wishlist", icon: Heart },
  { label: "Addresses", icon: MapPin },
  { label: "Account Details", icon: Settings },
];

function Heart(props) {
  return (
    <svg
      width={props.size || 16}
      height={props.size || 16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function formatOrderDate(dateStr) {
  if (!dateStr) return "N/A";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

/* ------------------------------- Account sidebar ------------------------------ */

function AccountSidebar({ isDark }) {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("mac_user_email") || "customer@marvelam.com";
  const userInitial = userEmail.slice(0, 2).toUpperCase();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate("/login");
  };

  return (
    <aside className="hidden w-64 shrink-0 lg:block">
      <div
        className={`rounded-xl border p-5 ${
          isDark
            ? "border-white/10 bg-[#151515]"
            : "border-[#EAE6DF] bg-white shadow-sm"
        }`}
      >
        <div
          className={`flex items-center gap-3 border-b pb-4 ${
            isDark ? "border-white/10" : "border-[#EAE6DF]"
          }`}
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FFB400]/15 font-sans text-sm font-semibold text-[#FFB400]">
            {userInitial}
          </span>
          <div className="min-w-0">
            <p className={`font-sans text-sm font-semibold truncate ${isDark ? "text-white" : "text-[#141414]"}`}>
              Marvelam Customer
            </p>
            <p className={`font-sans text-xs truncate ${isDark ? "text-white/45" : "text-[#141414]/50"}`}>
              {userEmail}
            </p>
          </div>
        </div>

        <ul className="mt-3 space-y-1 font-sans text-sm">
          {ACCOUNT_NAV.map(({ label, icon: Icon, active }) => (
            <li key={label}>
              <Link
                to={label === "Orders" ? "/account/orders" : "#"}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors duration-150 ${
                  active
                    ? isDark
                      ? "bg-[#FFB400]/10 font-semibold text-[#FFB400]"
                      : "bg-[#FFB400]/15 font-semibold text-[#B37D00]"
                    : isDark
                    ? "text-white/70 hover:bg-white/5 hover:text-[#FFB400]"
                    : "text-[#141414]/70 hover:bg-[#F5F2EB] hover:text-[#B37D00]"
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            </li>
          ))}
          <li className="pt-2">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-red-500 transition-colors duration-150 hover:bg-red-500/10 cursor-pointer text-left"
            >
              <LogOut size={16} />
              Logout
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
}

function StatusBadge({ category }) {
  const config = STATUS_STYLES[category] || STATUS_STYLES.Processing;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-sans text-[11px] font-semibold ${config.className}`}>
      <Icon size={12} />
      {config.label}
    </span>
  );
}

/* --------------------------------- Item row -------------------------------- */

function getItemDetailsPath(item) {
  if (item?.item_details_url) {
    const match = item.item_details_url.match(/\/(products|materials|fabrics)\/([^/]+)\/([^/]+)/);
    if (match) {
      return `/${match[1]}/${match[2]}/${match[3]}`;
    }
    const single = item.item_details_url.match(/\/(products|materials|fabrics)\/([^/]+)/);
    if (single) {
      return `/${single[1]}/${single[2]}`;
    }
  }
  if (item?.slug && item?.id) {
    return `/products/${item.slug}/${item.id}`;
  }
  if (item?.slug) {
    return `/products/${item.slug}`;
  }
  if (item?.product_id) {
    return `/products/${item.product_id}`;
  }
  if (item?.id) {
    return `/products/${item.id}`;
  }
  return null;
}

function ItemRow({ item, isDark }) {
  const navigate = useNavigate();
  const quantity = Number(item.quantity) || 1;
  const unitPrice = parseFloat(item.unit_price) || 0;
  const totalAmount = parseFloat(item.total_amount) || unitPrice * quantity;
  const itemPath = getItemDetailsPath(item);

  const handleSelectItem = () => {
    if (itemPath) {
      navigate(itemPath);
    } else if (item.item_details_url) {
      window.location.href = item.item_details_url;
    }
  };

  return (
    <li className="py-5 first:pt-0 last:pb-0">
      <div
        onClick={handleSelectItem}
        className={`flex gap-4 p-2 -m-2 rounded-lg transition-colors cursor-pointer group ${
          isDark ? "hover:bg-white/5" : "hover:bg-neutral-50"
        }`}
      >
        <div className="relative shrink-0 overflow-hidden rounded-md">
          <img
            src={item.image || `https://picsum.photos/seed/${item.id || item.name}/120/150`}
            alt={item.name || "Item"}
            onError={(e) => {
              e.target.src = "https://picsum.photos/seed/marvelam/120/150";
            }}
            className={`h-20 w-16 object-cover border transition-transform duration-200 group-hover:scale-105 ${
              isDark ? "bg-neutral-900 border-white/10" : "bg-neutral-100 border-[#EAE6DF]"
            }`}
          />
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className={`font-sans text-sm font-medium transition-colors group-hover:text-[#FFB400] ${
                isDark ? "text-white/90" : "text-[#141414]"
              }`}>
                {item.name || "Custom Apparel"}
              </p>
              <p className={`mt-0.5 font-sans text-xs ${isDark ? "text-white/45" : "text-neutral-500"}`}>
                Qty: {quantity} &middot; {formatNaira(unitPrice)} each
              </p>
              {itemPath && (
                <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-[#FFB400] mt-1 group-hover:underline">
                  View Item Details <ChevronRight size={11} />
                </span>
              )}
            </div>
            <div className="shrink-0 text-right">
              <p className="font-sans text-sm font-semibold text-[#FFB400]">
                {formatNaira(totalAmount)}
              </p>
            </div>
          </div>

          <div
            className="mt-3 flex flex-wrap gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {(item.return_request_url || item.refund_request_url) && (
              <a
                href={item.return_request_url || item.refund_request_url}
                className="flex items-center gap-1.5 font-sans text-xs font-medium text-red-400 transition-colors duration-200 hover:underline"
              >
                <RotateCcw size={12} /> Return Request
              </a>
            )}
            {item.item_create_review_url && (
              <a
                href={item.item_create_review_url}
                className={`flex items-center gap-1.5 font-sans text-xs font-medium transition-colors duration-200 hover:text-[#FFB400] ${
                  isDark ? "text-white/70" : "text-neutral-600"
                }`}
              >
                <Star size={12} /> Leave Review
              </a>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}

function ItemsCard({ order, isDark }) {
  const items = order.orderitems || [];
  return (
    <div
      className={`rounded-xl border p-6 ${
        isDark
          ? "border-white/10 bg-[#151515]"
          : "border-[#EAE6DF] bg-white shadow-sm"
      }`}
    >
      <h2 className={`font-sans text-xs font-semibold uppercase tracking-wide ${isDark ? "text-white/50" : "text-neutral-500"}`}>
        Items in this Order ({items.length})
      </h2>

      {items.length === 0 ? (
        <p className={`mt-4 font-sans text-sm ${isDark ? "text-white/40" : "text-neutral-400"}`}>
          No items registered for this order.
        </p>
      ) : (
        <ul className={`mt-4 divide-y ${isDark ? "divide-white/10" : "divide-[#EAE6DF]"}`}>
          {items.map((item, idx) => (
            <ItemRow key={item.id || idx} item={item} isDark={isDark} />
          ))}
        </ul>
      )}
    </div>
  );
}

/* --------------------------------- Summary card -------------------------------- */

function SummaryCard({ order, category, isDark, onOpenInvoice }) {
  const subtotal = parseFloat(order.sub_total_amount) || parseFloat(order.total_amount) || 0;
  const shippingFee = parseFloat(order.shipping_fee) || 0;
  const discount = parseFloat(order.total_discount) || 0;
  const grandTotal = parseFloat(order.total_amount) || subtotal + shippingFee - discount;

  return (
    <div
      className={`rounded-xl border p-6 ${
        isDark
          ? "border-white/10 bg-[#151515]"
          : "border-[#EAE6DF] bg-white shadow-sm"
      }`}
    >
      <div className={`flex items-center justify-between pb-3 border-b ${isDark ? "border-white/10" : "border-[#EAE6DF]"}`}>
        <h2 className="font-display text-lg text-[#FFB400]">Order Summary</h2>

      </div>

      <div className="mt-4 space-y-3 font-sans text-sm">
        <div className={`flex items-center justify-between ${isDark ? "text-white/70" : "text-neutral-600"}`}>
          <span>Items Subtotal</span>
          <span className={isDark ? "text-white/90" : "text-neutral-900"}>{formatNaira(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className={`flex items-center justify-between ${isDark ? "text-white/70" : "text-neutral-600"}`}>
            <span>Discount</span>
            <span className="text-[#FFB400]">-{formatNaira(discount)}</span>
          </div>
        )}
        <div className={`flex items-center justify-between ${isDark ? "text-white/70" : "text-neutral-600"}`}>
          <span>Shipping Fee</span>
          <span className={isDark ? "text-white/90" : "text-neutral-900"}>{shippingFee === 0 ? "Free" : formatNaira(shippingFee)}</span>
        </div>
      </div>

      <div className={`mt-4 flex items-center justify-between border-t pt-4 ${isDark ? "border-white/10" : "border-[#EAE6DF]"}`}>
        <span className={`font-['Montserrat',sans-serif] text-sm font-semibold ${isDark ? "text-white" : "text-[#141414]"}`}>Total Amount</span>
        <span className="font-['Montserrat',sans-serif] text-2xl font-bold text-[#FFB400]">{formatNaira(grandTotal)}</span>
      </div>

      <div className="mt-5 flex flex-col gap-2">
        {order.initialize_payment_url && order.payment_status !== "PAID" && (
          <a
            href={order.initialize_payment_url}
            className="flex items-center justify-center gap-2 rounded-md bg-[#FFB400] py-3 font-sans text-sm font-semibold text-[#0F0F0F] transition-transform duration-200 hover:scale-[1.01]"
          >
            Complete Payment
          </a>
        )}
        {onOpenInvoice && (
          <button
            type="button"
            onClick={onOpenInvoice}
            className="flex items-center justify-center gap-2 rounded-md bg-[#FFB400]/15 border border-[#FFB400]/40 py-2.5 font-sans text-xs font-semibold text-[#FFB400] transition-colors duration-200 hover:bg-[#FFB400] hover:text-[#0F0F0F] cursor-pointer"
          >
            <Download size={13} /> Official Invoice & Receipt
          </button>
        )}
        <Link
          to="/products"
          className={`flex items-center justify-center gap-2 rounded-md border py-3 font-sans text-sm transition-colors duration-200 ${
            isDark
              ? "border-white/15 text-white/80 hover:border-[#FFB400] hover:text-[#FFB400]"
              : "border-neutral-300 text-neutral-800 hover:border-[#FFB400] hover:text-[#FFB400]"
          }`}
        >
          <RotateCcw size={15} /> Continue Shopping
        </Link>
      </div>
    </div>
  );
}

function HelpCard({ isDark }) {
  return (
    <div
      className={`rounded-xl border p-6 ${
        isDark
          ? "border-white/10 bg-[#151515]"
          : "border-[#EAE6DF] bg-white shadow-sm"
      }`}
    >
      <p className={`font-sans text-xs font-semibold uppercase tracking-wide ${isDark ? "text-white/50" : "text-neutral-500"}`}>
        Need Help?
      </p>
      <p className={`mt-2 font-sans text-sm leading-relaxed ${isDark ? "text-white/60" : "text-neutral-600"}`}>
        Have questions about tracking, alterations, or delivery times for this order? Our support team is here to help.
      </p>
      <a
        href="mailto:support@marvelam.com"
        className={`mt-4 flex w-full items-center justify-center gap-2 rounded-md border py-2.5 font-sans text-xs font-semibold transition-colors duration-200 ${
          isDark
            ? "border-white/15 text-white/75 hover:border-[#FFB400] hover:text-[#FFB400]"
            : "border-neutral-300 text-neutral-700 hover:border-[#FFB400] hover:text-[#FFB400]"
        }`}
      >
        <MessageCircle size={14} /> Contact Support
      </a>
    </div>
  );
}

/* --------------------------------- Main Details Page -------------------------------- */

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      setError("AUTH_REQUIRED");
      setLoading(false);
      return;
    }

    let isMounted = true;
    const fetchOrderDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const endpoint = ENDPOINTS.ORDER_DETAILS(orderId);
        let res = null;
        try {
          res = await apiClient.get(endpoint);
        } catch (initialErr) {
          // Fallback patterns: orders/details/:id/ or orders/:id/
          if (initialErr.response?.status === 404) {
            try {
              res = await apiClient.get(`orders/details/${orderId}/`);
            } catch (secondErr) {
              if (secondErr.response?.status === 404) {
                res = await apiClient.get(`orders/${orderId}/`);
              } else {
                throw secondErr;
              }
            }
          } else {
            throw initialErr;
          }
        }
        if (isMounted && res?.data) {
          const raw = res.data.order || res.data.data || res.data;
          setOrder(raw);
        }
      } catch (err) {
        console.error("Failed to fetch order details:", err);
        if (isMounted) {
          if (err.response?.status === 401) {
            logout();
            setError("AUTH_EXPIRED");
          } else if (err.response?.status === 404) {
            setError(`Order #${orderId} was not found on your account.`);
          } else {
            setError(
              err.response?.data?.detail ||
                err.message ||
                "Could not retrieve order details."
            );
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchOrderDetails();
    return () => {
      isMounted = false;
    };
  }, [orderId]);

  const displayOrderNumber = order?.order_number || orderId;
  const address = order?.shipping_address_snapshot || {};
  const category = getOrderCategory(order);

  return (
    <div className={`min-h-screen font-sans antialiased transition-colors duration-300 ${isDark ? "bg-[#0F0F0F] text-white" : "bg-[#FBF9F5] text-[#141414]"}`}>
      <Header />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-8">
        <nav aria-label="Breadcrumb" className={`mb-5 flex flex-wrap items-center gap-2 font-sans text-xs ${isDark ? "text-white/50" : "text-black/50"}`}>
          <Link to="/" className="hover:text-[#FFB400]">Home</Link>
          <ChevronRight size={12} aria-hidden="true" />
          <Link to="/account/orders" className="hover:text-[#FFB400]">My Account</Link>
          <ChevronRight size={12} aria-hidden="true" />
          <Link to="/account/orders" className="hover:text-[#FFB400]">Orders</Link>
          <ChevronRight size={12} aria-hidden="true" />
          <span className="text-[#FFB400] font-['Montserrat',sans-serif] font-bold">#{displayOrderNumber}</span>
        </nav>

        <div className="flex flex-col gap-8 lg:flex-row">
          <AccountSidebar isDark={isDark} />

          <div className="flex-1">
            <div className="mb-4">
              <Link
                to="/account/orders"
                className={`inline-flex items-center gap-1.5 font-sans text-xs hover:text-[#FFB400] transition-colors ${
                  isDark ? "text-white/60" : "text-neutral-600"
                }`}
              >
                <ArrowLeft size={14} /> Back to All Orders
              </Link>
            </div>

            {loading ? (
              <div
                className={`rounded-xl border p-16 text-center ${
                  isDark
                    ? "border-white/10 bg-[#151515]"
                    : "border-[#EAE6DF] bg-white shadow-sm"
                }`}
              >
                <RefreshCw size={32} className="mx-auto animate-spin text-[#FFB400]" />
                <p className={`mt-3 font-sans text-sm ${isDark ? "text-white/60" : "text-neutral-600"}`}>
                  Loading order #{orderId} details...
                </p>
              </div>
            ) : error === "AUTH_REQUIRED" || error === "AUTH_EXPIRED" ? (
              <div
                className={`rounded-xl border p-12 text-center ${
                  isDark
                    ? "border-white/10 bg-[#151515]"
                    : "border-[#EAE6DF] bg-white shadow-sm"
                }`}
              >
                <Package size={44} className="mx-auto text-[#FFB400]" />
                <h2
                  className={`mt-4 font-display text-2xl ${
                    isDark ? "text-white" : "text-[#141414]"
                  }`}
                >
                  {error === "AUTH_EXPIRED"
                    ? "Session Expired"
                    : `Sign in to view Order #${orderId}`}
                </h2>
                <p
                  className={`mt-2 font-sans text-sm max-w-md mx-auto ${
                    isDark ? "text-white/50" : "text-neutral-500"
                  }`}
                >
                  {error === "AUTH_EXPIRED"
                    ? "Your session has expired. Please log in again to securely view your order details, tracking information, and receipt."
                    : "This order is protected. Please log in to your Marvelam account to access its details, items breakdown, and tracking."}
                </p>
                <div className="mt-6 flex justify-center gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      navigate("/login", {
                        state: { from: { pathname: `/account/orders/${orderId}` } },
                      })
                    }
                    className="rounded-lg bg-[#FFB400] px-6 py-2.5 font-sans text-sm font-semibold text-[#0F0F0F] hover:bg-[#e09e00] transition-colors"
                  >
                    Sign In
                  </button>
                  <Link
                    to="/account/orders"
                    className={`rounded-lg border px-6 py-2.5 font-sans text-sm transition-colors ${
                      isDark
                        ? "border-white/20 text-white hover:border-[#FFB400]"
                        : "border-neutral-300 text-neutral-800 hover:border-[#FFB400]"
                    }`}
                  >
                    All Orders
                  </Link>
                </div>
              </div>
            ) : error ? (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-10 text-center">
                <AlertCircle size={36} className="mx-auto text-red-400" />
                <p className="mt-3 font-sans text-base text-red-300">{error}</p>
                <div className="mt-6 flex justify-center gap-4">
                  <Link
                    to="/account/orders"
                    className="rounded-lg bg-[#FFB400] px-5 py-2 font-sans text-sm font-semibold text-[#0F0F0F]"
                  >
                    Return to Order History
                  </Link>
                </div>
              </div>
            ) : order ? (
              <div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h1 className="font-['Montserrat',sans-serif] text-2xl sm:text-2xl font-semibold tracking-tight">
                        Order #{displayOrderNumber}
                      </h1>
                      <StatusBadge category={category} />
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 font-sans text-xs sm:text-sm">
                      <span className={isDark ? "text-white/60" : "text-neutral-600"}>
                        Ordered Day: <strong className={isDark ? "text-white" : "text-neutral-900"}>{order.ordered_day || formatOrderDate(order.ordered_day) || "N/A"}</strong>
                      </span>
                      {order.delivered_day && (
                        <span className={isDark ? "text-white/60" : "text-neutral-600"}>
                          &middot; Delivery Day: <strong className="text-white font-semibold">{order.delivered_day || formatOrderDate(order.delivered_day)}</strong>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setShowInvoice(true)}
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-1.5 font-sans text-xs font-semibold transition-all cursor-pointer ${
                        isDark
                          ? "border-white/15 text-white/80 hover:border-[#FFB400] hover:text-[#FFB400]"
                          : "border-neutral-300 text-neutral-800 hover:border-[#FFB400] hover:text-[#FFB400]"
                      }`}
                    >
                      <Download size={13} /> Invoice
                    </button>
                    <Link
                      to={`/track/${order.tracking_id || order.order_number || displayOrderNumber}`}
                      state={{ trackingId: order.tracking_id, orderNumber: order.order_number }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#FFB400] bg-[#FFB400]/10 px-3.5 py-1.5 font-sans text-xs font-semibold text-[#FFB400] hover:bg-[#FFB400] hover:text-[#0F0F0F] transition-all"
                    >
                      <Truck size={14} /> Track Order
                    </Link>
                  </div>
                </div>

                <div className="mt-6 space-y-6">
                  {/* Delivery & Payment Information */}
                  <div
                    className={`rounded-xl border p-6 ${
                      isDark ? "border-white/10 bg-[#151515]" : "border-[#EAE6DF] bg-white shadow-sm"
                    }`}
                  >
                    <h2 className="mb-4 font-display text-2xl font-medium">Delivery & Payment</h2>
                    
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <div className="mb-2 flex items-center gap-2">
                          <MapPin size={16} className="text-[#FFB400]" />
                          <h3 className="font-sans text-sm font-semibold">Delivery Address</h3>
                        </div>
                        {address.delivery_address || address.first_name ? (
                          <address className={`font-sans text-xs not-italic leading-relaxed ${isDark ? "text-white/60" : "text-neutral-600"}`}>
                            {address.first_name} {address.last_name}<br />
                            {address.delivery_address}<br />
                            {address.city ? `${address.city}, ` : ""}{address.state || ""}<br />
                            {address.phone_number || ""}
                          </address>
                        ) : (
                          <p className={`font-sans text-xs ${isDark ? "text-white/50" : "text-neutral-500"}`}>
                            Standard customer delivery address.
                          </p>
                        )}
                      </div>

                      <div>
                        <div className="mb-2 flex items-center gap-2">
                          <CreditCard size={16} className="text-[#FFB400]" />
                          <h3 className="font-sans text-sm font-semibold">Payment & Method</h3>
                        </div>
                        <p className={`font-sans text-xs leading-relaxed ${isDark ? "text-white/60" : "text-neutral-600"}`}>
                          Method: {order.payment_method_name || "Online Card Payment (Paystack)"}<br />
                          Delivery Option: {order.delivery_method_name || "Standard Shipping"}<br />
                          {order.payment_reference && (
                            <span>Ref: {order.payment_reference}<br /></span>
                          )}
                          {order.tracking_id && (
                            <span className="block mt-1">
                              Tracking ID: <strong className="text-[#FFB400] font-mono">{order.tracking_id}</strong>
                            </span>
                          )}

                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                      <ItemsCard order={order} isDark={isDark} />
                    </div>

                    <div className="space-y-6">
                      <SummaryCard
                        order={order}
                        category={category}
                        isDark={isDark}
                        onOpenInvoice={() => setShowInvoice(true)}
                      />
                      <HelpCard isDark={isDark} />
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Interactive Printable Invoice Modal */}
        <InvoiceModal
          order={order}
          isOpen={showInvoice}
          onClose={() => setShowInvoice(false)}
        />
      </main>

      <Footer />
    </div>
  );
}
