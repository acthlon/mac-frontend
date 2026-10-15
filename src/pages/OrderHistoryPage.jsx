import { useEffect, useMemo, useState } from "react";
import {
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  Package,
  MapPin,
  Settings,
  LogOut,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Heart,
  Star,
  Search,
  AlertCircle,
  RefreshCw,
  ShoppingBag,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useTheme } from "../context/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import apiClient, { ENDPOINTS, isAuthenticated, logout } from "../api/client";
import formatNaira from "../utils/formatNaira";
import InvoiceModal from "../components/orders/InvoiceModal";

const ACCOUNT_NAV = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/account" },
  { label: "Orders", icon: Package, active: true, path: "/account/orders" },
  { label: "Wishlist", icon: Heart, path: "/catalog" },
  { label: "Addresses", icon: MapPin, path: "/account?tab=addresses" },
  { label: "Account Details", icon: Settings, path: "/account/profile" },
];

// Order category filters specified by business logic
export const STATUS_FILTERS = [
  "All Orders",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
  "Failed",
  "Returned",
];

export const STATUS_STYLES = {
  Processing: {
    icon: Clock,
    className: "border-[#FFB400]/40 bg-[#FFB400]/10 text-[#FFB400]",
    label: "Processing",
  },
  Shipped: {
    icon: Truck,
    className: "border-blue-400/40 bg-blue-400/10 text-blue-400",
    label: "Shipped",
  },
  Delivered: {
    icon: CheckCircle2,
    className: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
    label: "Delivered",
  },
  Cancelled: {
    icon: XCircle,
    className: "border-neutral-500/40 bg-neutral-500/10 text-neutral-400",
    label: "Cancelled",
  },
  Failed: {
    icon: AlertCircle,
    className: "border-red-500/40 bg-red-500/10 text-red-400",
    label: "Failed",
  },
  Returned: {
    icon: RotateCcw,
    className: "border-purple-400/40 bg-purple-400/10 text-purple-400",
    label: "Returned",
  },
};

/**
 * Categorize order based on order.status and order.delivery_status:
 * - failed: order whose status is failed
 * - cancelled: order whose status is cancelled
 * - processing: order whose status is confirmed (or created) but delivery status is pending or waiting to be shipped
 * - shipped: order whose delivery status is shipped
 * - delivered: order whose delivery status is delivered
 * - returned: order whose status is returned
 */
/**
 * Categorize order based on order.order_status, order.status and order.delivery_status:
 * - failed: order whose status is failed
 * - cancelled: order whose status is cancelled
 * - processing: order whose status is confirmed (or created) but delivery status is pending or waiting to be shipped
 * - shipped: order whose delivery status is shipped
 * - delivered: order whose delivery status is delivered
 * - returned: order whose status is returned
 */
export function getOrderCategory(order) {
  if (!order) return "Processing";

  const orderStatus = String(
    order.order_status || order.status || ""
  ).toUpperCase().trim();

  const deliveryStatus = String(
    order.delivery_status || ""
  ).toUpperCase().trim().replace(/_/g, " ");

  // 1. Failed — order whose status is failed
  if (
    orderStatus === "FAILED" ||
    deliveryStatus === "FAILED" ||
    deliveryStatus === "FAILED DELIVERY"
  ) {
    return "Failed";
  }

  // 2. Cancelled — order whose status is cancelled
  if (
    orderStatus === "CANCELED" ||
    orderStatus === "CANCELLED" ||
    deliveryStatus === "CANCELED" ||
    deliveryStatus === "CANCELLED"
  ) {
    return "Cancelled";
  }

  // 3. Returned — order whose status is returned
  if (
    orderStatus === "RETURNED" ||
    deliveryStatus === "RETURNED"
  ) {
    return "Returned";
  }

  // 4. Delivered — order whose delivery status is delivered
  if (
    deliveryStatus === "DELIVERED" ||
    orderStatus === "COMPLETED" ||
    Boolean(order.delivered_day)
  ) {
    return "Delivered";
  }

  // 5. Shipped — order whose delivery status is shipped
  if (
    deliveryStatus === "SHIPPED" ||
    deliveryStatus === "OUT FOR DELIVERY"
  ) {
    return "Shipped";
  }

  // 6. Processing — order whose status is confirmed (or created) but delivery status is pending or waiting to be shipped
  if (
    (orderStatus === "CONFIRMED" || orderStatus === "CREATED" || orderStatus === "PAID" || !orderStatus) &&
    (deliveryStatus === "PENDING" || deliveryStatus === "WAITING TO BE SHIPPED" || !deliveryStatus)
  ) {
    return "Processing";
  }

  // Safe fallback
  if (order.delivered_day) return "Delivered";
  return "Processing";
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
          {ACCOUNT_NAV.map(({ label, icon: Icon, active, path }) => (
            <li key={label}>
              <Link
                to={path || "#"}
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

/* --------------------------------- Status badge -------------------------------- */

function StatusBadge({ category }) {
  const config = STATUS_STYLES[category] || STATUS_STYLES.Processing;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-sans text-[11px] font-semibold ${config.className}`}
    >
      <Icon size={12} />
      {config.label}
    </span>
  );
}

/* ---------------------------------- Order card ---------------------------------- */

function OrderCard({ order, isDark }) {
  const [expanded, setExpanded] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const items = order.orderitems || [];

  const category = getOrderCategory(order);

  // Calculate total item quantity
  const totalItemCount = items.reduce(
    (sum, i) => sum + (Number(i.quantity) || 1),
    0
  );

  // Compute total price: prioritize order-level totals if present, else sum of items
  const totalAmount =
    parseFloat(order.total_amount) ||
    parseFloat(order.total_price) ||
    parseFloat(order.grand_total) ||
    items.reduce((sum, i) => {
      const itemTotal =
        parseFloat(i.total_amount) ||
        parseFloat(i.unit_price) * (Number(i.quantity) || 1) ||
        0;
      return sum + itemTotal;
    }, 0);

  const displayOrderNumber =
    order.order_number || (order.id ? String(order.id).slice(0, 8) : "N/A");

  // Raw status descriptions for subtitle
  const rawOrderStatus = order.status || order.order_status || null;
  const rawDeliveryStatus = order.delivery_status || null;

  return (
    <article
      className={`rounded-xl border transition-colors duration-200 ${
        isDark
          ? "border-white/10 bg-[#151515] hover:border-white/20"
          : "border-[#EAE6DF] bg-white hover:border-[#FFB400]/60 shadow-sm"
      }`}
    >
      {/* Top Header Row */}
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {/* Thumbnails preview */}
          <div className="flex -space-x-3 shrink-0">
            {items.slice(0, 3).map((item, idx) => (
              <img
                key={item.id || idx}
                src={
                  item.image ||
                  `https://picsum.photos/seed/${item.id || idx}/80/100`
                }
                alt={item.name || "Order Item"}
                onError={(e) => {
                  e.target.src = "https://picsum.photos/seed/marvelam/80/100";
                }}
                className={`h-12 w-10 rounded-md border-2 object-cover ${
                  isDark
                    ? "border-[#151515] bg-neutral-900"
                    : "border-white bg-neutral-100"
                }`}
              />
            ))}
            {items.length === 0 && (
              <div
                className={`flex h-12 w-10 items-center justify-center rounded-md border-2 ${
                  isDark
                    ? "border-[#151515] bg-[#222] text-white/40"
                    : "border-white bg-neutral-100 text-neutral-400"
                }`}
              >
                <Package size={16} />
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <p
                className={`font-['Montserrat',sans-serif] text-sm font-bold ${
                  isDark ? "text-white" : "text-[#141414]"
                }`}
              >
                Order #{displayOrderNumber}
              </p>
              {items.length > 0 && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    isDark
                      ? "bg-white/10 text-white/70"
                      : "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  {totalItemCount} {totalItemCount === 1 ? "item" : "items"}
                </span>
              )}
            </div>

            <p
              className={`mt-0.5 font-sans text-xs ${
                isDark ? "text-white/50" : "text-neutral-500"
              }`}
            >
              Placed on {formatOrderDate(order.ordered_day)}
              {order.delivered_day && (
                <span> &middot; Delivered on {formatOrderDate(order.delivered_day)}</span>
              )}
            </p>

            {/* Dynamic Status Badges from Backend */}
            {/* <div className="mt-2 flex flex-wrap items-center gap-2 font-sans text-xs">
              {rawOrderStatus && (
                <span
                  className={`inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-[11px] font-medium border ${
                    isDark
                      ? "border-white/10 bg-white/5 text-white/80"
                      : "border-neutral-200 bg-neutral-100 text-neutral-700"
                  }`}
                >
                  Order Status:{" "}
                  <strong
                    className={
                      rawOrderStatus.toUpperCase() === "FAILED"
                        ? "text-red-400 font-semibold"
                        : rawOrderStatus.toUpperCase() === "CANCELED" || rawOrderStatus.toUpperCase() === "CANCELLED"
                        ? "text-neutral-400 font-semibold"
                        : "text-[#FFB400] font-semibold"
                    }
                  >
                    {rawOrderStatus}
                  </strong>
                </span>
              )}
              {rawDeliveryStatus && (
                <span
                  className={`inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-[11px] font-medium border ${
                    isDark
                      ? "border-white/10 bg-white/5 text-white/80"
                      : "border-neutral-200 bg-neutral-100 text-neutral-700"
                  }`}
                >
                  Delivery Status:{" "}
                  <strong
                    className={
                      rawDeliveryStatus.toUpperCase().includes("DELIVERED")
                        ? "text-emerald-400 font-semibold"
                        : rawDeliveryStatus.toUpperCase().includes("SHIPPED")
                        ? "text-blue-400 font-semibold"
                        : rawDeliveryStatus.toUpperCase().includes("FAILED")
                        ? "text-red-400 font-semibold"
                        : rawDeliveryStatus.toUpperCase().includes("CANCEL")
                        ? "text-neutral-400 font-semibold"
                        : "text-[#FFB400] font-semibold"
                    }
                  >
                    {rawDeliveryStatus}
                  </strong>
                </span>
              )}
            </div> */}
          </div>
        </div>

        {/* Status Badge & Total Price */}
        <div className="flex flex-wrap items-center gap-3 sm:flex-col sm:items-end sm:gap-1.5">
          <StatusBadge category={category} />
          <div className="text-right">
            <p className="font-['Montserrat',sans-serif] text-xl font-bold text-[#FFB400]">
              {formatNaira(totalAmount)}
            </p>
            <p
              className={`font-sans text-[11px] ${
                isDark ? "text-white/40" : "text-neutral-400"
              }`}
            >
              Total Price
            </p>
          </div>
        </div>
      </div>

      {/* Expandable Items Breakdown Table */}
      {items.length > 0 && (
        <div
          className={`border-t px-5 py-3 ${
            isDark ? "border-white/5 bg-[#121212]" : "border-[#F0EDE6] bg-[#FAF8F5]"
          }`}
        >
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className={`flex items-center gap-1.5 font-sans text-xs font-medium hover:text-[#FFB400] transition-colors ${
              isDark ? "text-white/60" : "text-neutral-600"
            }`}
          >
            <span>{expanded ? "Hide" : "View"} Item Breakdown ({items.length})</span>
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {expanded && (
            <div className="mt-3 space-y-3 pt-2">
              {items.map((item, idx) => {
                const qty = Number(item.quantity) || 1;
                const uPrice = parseFloat(item.unit_price) || 0;
                const itemTotal = parseFloat(item.total_amount) || uPrice * qty;

                return (
                  <div
                    key={item.id || idx}
                    className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 rounded-lg border ${
                      isDark
                        ? "border-white/5 bg-[#181818]"
                        : "border-[#EAE6DF] bg-white shadow-2xs"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          item.image ||
                          `https://picsum.photos/seed/${item.id || idx}/80/100`
                        }
                        alt={item.name || "Item"}
                        onError={(e) => {
                          e.target.src =
                            "https://picsum.photos/seed/marvelam/80/100";
                        }}
                        className="h-12 w-10 rounded-md object-cover border border-white/10 shrink-0"
                      />
                      <div>
                        <p
                          className={`font-sans text-xs font-semibold ${
                            isDark ? "text-white/90" : "text-neutral-800"
                          }`}
                        >
                          {item.name || "Custom Item"}
                        </p>
                        <p
                          className={`font-sans text-[11px] ${
                            isDark ? "text-white/50" : "text-neutral-500"
                          }`}
                        >
                          Qty: {qty} &times; {formatNaira(uPrice)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      {/* Review Link if provided by backend (per-item track button removed as requested) */}
                      <div className="flex items-center gap-2 font-sans text-[11px]">
                        {item.item_create_review_url && (
                          <a
                            href={item.item_create_review_url}
                            className="text-white/60 hover:text-[#FFB400] flex items-center gap-0.5"
                          >
                            <Star size={11} /> Review
                          </a>
                        )}
                      </div>

                      <p className="font-sans text-xs font-bold text-[#FFB400]">
                        {formatNaira(itemTotal)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Bottom Footer Actions */}
      <div
        className={`flex flex-wrap items-center justify-between gap-3 border-t px-5 py-3 ${
          isDark ? "border-white/10" : "border-[#EAE6DF]"
        }`}
      >
        <Link
          to={`/account/orders/${order.order_number || order.id}`}
          className="font-sans text-xs font-semibold text-[#FFB400] hover:underline flex items-center gap-1"
        >
          View Full Details <ChevronRight size={13} />
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          {/* Functional Track Order button linking to tracking page with tracking ID */}
          <Link
            to={`/track/${order.tracking_id || order.order_number || order.id}`}
            state={{ trackingId: order.tracking_id, orderNumber: order.order_number }}
            className="inline-flex items-center gap-1.5 rounded-md border border-[#FFB400] bg-[#FFB400]/10 px-3.5 py-1.5 font-sans text-xs font-semibold text-[#FFB400] transition-colors duration-200 hover:bg-[#FFB400] hover:text-[#0F0F0F]"
          >
            <Truck size={13} /> Track Order
          </Link>

          {category !== "Cancelled" && category !== "Failed" && (
            <button
              type="button"
              onClick={() => setShowInvoice(true)}
              className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 font-sans text-xs transition-colors duration-200 cursor-pointer ${
                isDark
                  ? "border-white/15 text-white/75 hover:border-[#FFB400] hover:text-[#FFB400]"
                  : "border-neutral-300 text-neutral-700 hover:border-[#FFB400] hover:text-[#FFB400]"
              }`}
            >
              <Download size={12} /> Invoice
            </button>
          )}

          {category !== "Cancelled" && category !== "Failed" && (
            <Link
              to="/products"
              className="rounded-md bg-[#FFB400] px-3.5 py-1.5 font-sans text-xs font-semibold text-[#0F0F0F] transition-transform duration-200 hover:scale-105"
            >
              Reorder
            </Link>
          )}
        </div>
      </div>

      {/* Interactive Printable Invoice Modal */}
      <InvoiceModal
        order={order}
        isOpen={showInvoice}
        onClose={() => setShowInvoice(false)}
      />
    </article>
  );
}

/* -------------------------------- Orders list panel ------------------------------ */

function OrdersPanel({ isDark }) {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState("All Orders");
  const [query, setQuery] = useState("");

  const authenticated = isAuthenticated();

  const fetchOrders = async (page = 1) => {
    if (!authenticated) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get(ENDPOINTS.ORDERS, { params: { page } });
      if (res?.data) {
        if (Array.isArray(res.data.results)) {
          setOrders(res.data.results);
          setTotalCount(res.data.count ?? res.data.results.length);
        } else if (Array.isArray(res.data)) {
          setOrders(res.data);
          setTotalCount(res.data.length);
        } else {
          setOrders([]);
          setTotalCount(0);
        }
      }
    } catch (err) {
      console.error("Failed to fetch order history:", err);
      if (err.response?.status === 401) {
        logout();
        setError("Your session has expired. Please sign in again.");
      } else {
        setError(
          err.response?.data?.detail ||
            err.message ||
            "Could not retrieve orders from your backend."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage, authenticated]);

  // Compute category counts for tab badges
  const categoryCounts = useMemo(() => {
    const counts = {
      "All Orders": orders.length,
      Processing: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0,
      Failed: 0,
      Returned: 0,
    };

    orders.forEach((o) => {
      const cat = getOrderCategory(o);
      if (counts[cat] !== undefined) {
        counts[cat]++;
      }
    });

    return counts;
  }, [orders]);

  // Filter orders according to active category tab and search query
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const orderNumber = String(
        order.order_number || order.id || ""
      ).toLowerCase();
      const items = order.orderitems || [];
      const category = getOrderCategory(order);

      const matchesCategory =
        activeFilter === "All Orders" || category === activeFilter;

      const matchesQuery =
        query.trim() === "" ||
        orderNumber.includes(query.toLowerCase()) ||
        items.some((i) =>
          String(i.name || "").toLowerCase().includes(query.toLowerCase())
        );

      return matchesCategory && matchesQuery;
    });
  }, [orders, activeFilter, query]);

  const pageSize = 10;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  if (!authenticated) {
    return (
      <section className="flex-1">
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
            Sign in to view your orders
          </h2>
          <p
            className={`mt-2 font-sans text-sm max-w-md mx-auto ${
              isDark ? "text-white/50" : "text-neutral-500"
            }`}
          >
            Please log in to your account to view past orders, track deliveries,
            and view price breakdowns.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <button
              type="button"
              onClick={() =>
                navigate("/login", {
                  state: { from: { pathname: "/account/orders" } },
                })
              }
              className="rounded-lg bg-[#FFB400] px-6 py-2.5 font-sans text-sm font-semibold text-[#0F0F0F] hover:bg-[#e09e00] transition-colors"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => navigate("/products")}
              className={`rounded-lg border px-6 py-2.5 font-sans text-sm transition-colors ${
                isDark
                  ? "border-white/20 text-white hover:border-[#FFB400]"
                  : "border-neutral-300 text-neutral-800 hover:border-[#FFB400]"
              }`}
            >
              Browse Products
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex-1">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            className={`font-display text-3xl ${
              isDark ? "text-[#F9FAFB]" : "text-[#141414]"
            }`}
          >
            Order History
          </h1>
          <p
            className={`mt-1 font-sans text-sm ${
              isDark ? "text-white/50" : "text-neutral-500"
            }`}
          >
            Track past orders, view invoices, and manage purchases ({totalCount}{" "}
            recorded)
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by order or item..."
            className={`w-full rounded-full border py-2.5 pl-4 pr-10 font-sans text-sm focus:border-[#FFB400] focus:outline-none ${
              isDark
                ? "border-white/15 bg-[#1A1A1A] text-white placeholder:text-white/40"
                : "border-[#D6D0C4] bg-white text-neutral-800 placeholder:text-neutral-400 shadow-2xs"
            }`}
          />
          <Search
            size={15}
            className={`absolute right-3.5 top-1/2 -translate-y-1/2 ${
              isDark ? "text-white/40" : "text-neutral-400"
            }`}
          />
        </div>
      </div>

      {/* Filter Tabs matching the requested status columns */}
      <div
        className={`mt-5 flex flex-wrap gap-2 border-b pb-4 ${
          isDark ? "border-white/10" : "border-[#EAE6DF]"
        }`}
      >
        {STATUS_FILTERS.map((status) => {
          const count = categoryCounts[status] ?? 0;
          const isActive = activeFilter === status;

          return (
            <button
              key={status}
              type="button"
              onClick={() => setActiveFilter(status)}
              aria-pressed={isActive}
              className={`flex items-center gap-1.5 rounded-full border px-4 py-1.5 font-sans text-xs font-semibold transition-colors duration-150 ${
                isActive
                  ? "border-[#FFB400] bg-[#FFB400] text-[#0F0F0F]"
                  : isDark
                  ? "border-white/15 text-white/65 hover:border-white/30"
                  : "border-neutral-300 text-neutral-600 hover:border-neutral-400"
              }`}
            >
              <span>{status}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                  isActive
                    ? "bg-[#0F0F0F]/20 text-[#0F0F0F]"
                    : isDark
                    ? "bg-white/10 text-white/60"
                    : "bg-neutral-100 text-neutral-600"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Order List / States */}
      {loading ? (
        <div className="mt-10 py-16 text-center">
          <RefreshCw
            size={30}
            className="mx-auto animate-spin text-[#FFB400]"
          />
          <p
            className={`mt-3 font-sans text-sm ${
              isDark ? "text-white/60" : "text-neutral-600"
            }`}
          >
            Fetching orders from backend...
          </p>
        </div>
      ) : error ? (
        <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-8 text-center">
          <AlertCircle size={32} className="mx-auto text-red-400" />
          <p className="mt-2 font-sans text-sm text-red-300">{error}</p>
          {error.includes("expired") || error.includes("sign in") ? (
            <button
              type="button"
              onClick={() =>
                navigate("/login", {
                  state: { from: { pathname: "/account/orders" } },
                })
              }
              className="mt-4 rounded-md bg-[#FFB400] px-5 py-2 font-sans text-xs font-semibold text-[#0F0F0F] hover:bg-[#e09e00]"
            >
              Sign In Again
            </button>
          ) : (
            <button
              type="button"
              onClick={() => fetchOrders(currentPage)}
              className="mt-4 rounded-md bg-red-500/20 px-4 py-2 font-sans text-xs font-semibold text-red-200 hover:bg-red-500/30"
            >
              Try Again
            </button>
          )}
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <OrderCard
                key={order.id || order.order_number}
                order={order}
                isDark={isDark}
              />
            ))
          ) : (
            <div
              className={`rounded-xl border p-12 text-center ${
                isDark
                  ? "border-white/10 bg-[#151515]"
                  : "border-[#EAE6DF] bg-white shadow-sm"
              }`}
            >
              <ShoppingBag
                size={38}
                className={isDark ? "mx-auto text-white/25" : "mx-auto text-neutral-400"}
              />
              <p
                className={`mt-3 font-display text-xl ${
                  isDark ? "text-white" : "text-[#141414]"
                }`}
              >
                No {activeFilter !== "All Orders" ? activeFilter.toLowerCase() : ""} orders found
              </p>
              <p
                className={`mt-1 font-sans text-sm max-w-sm mx-auto ${
                  isDark ? "text-white/50" : "text-neutral-500"
                }`}
              >
                {query || activeFilter !== "All Orders"
                  ? `There are currently no orders under the "${activeFilter}" filter.`
                  : "You have not placed any orders yet. Discover our exclusive bespoke clothing and fabrics."}
              </p>
              <div className="mt-6 flex justify-center gap-3">
                {activeFilter !== "All Orders" && (
                  <button
                    type="button"
                    onClick={() => setActiveFilter("All Orders")}
                    className="rounded-lg border border-neutral-300 px-4 py-2 font-sans text-xs font-semibold hover:border-[#FFB400]"
                  >
                    View All Orders
                  </button>
                )}
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#FFB400] px-5 py-2.5 font-sans text-sm font-semibold text-[#0F0F0F] hover:bg-[#e09e00]"
                >
                  Explore Catalog
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <nav
          aria-label="Pagination"
          className="mt-8 flex items-center justify-center gap-2 font-sans text-sm"
        >
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className={`flex h-9 w-9 items-center justify-center rounded-md border transition-colors disabled:opacity-30 disabled:pointer-events-none ${
              isDark
                ? "border-white/15 text-white/70 hover:border-[#FFB400] hover:text-[#FFB400]"
                : "border-neutral-300 text-neutral-700 hover:border-[#FFB400] hover:text-[#FFB400]"
            }`}
          >
            <ChevronLeft size={15} />
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i + 1}
              type="button"
              onClick={() => setCurrentPage(i + 1)}
              className={`flex h-9 w-9 items-center justify-center rounded-md border font-semibold ${
                currentPage === i + 1
                  ? "border-[#FFB400] bg-[#FFB400] text-[#0F0F0F]"
                  : isDark
                  ? "border-white/15 text-white/70 hover:border-[#FFB400] hover:text-[#FFB400]"
                  : "border-neutral-300 text-neutral-700 hover:border-[#FFB400] hover:text-[#FFB400]"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            aria-label="Next page"
            className={`flex h-9 w-9 items-center justify-center rounded-md border transition-colors disabled:opacity-30 disabled:pointer-events-none ${
              isDark
                ? "border-white/15 text-white/70 hover:border-[#FFB400] hover:text-[#FFB400]"
                : "border-neutral-300 text-neutral-700 hover:border-[#FFB400] hover:text-[#FFB400]"
            }`}
          >
            <ChevronRight size={15} />
          </button>
        </nav>
      )}
    </section>
  );
}

/* --------------------------------------- Page ---------------------------------------- */

export default function OrderHistoryPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen font-sans antialiased transition-colors duration-300 ${
        isDark ? "bg-[#0F0F0F] text-white" : "bg-[#FBF9F5] text-[#141414]"
      }`}
    >
      <Header />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-8">
        <nav
          aria-label="Breadcrumb"
          className={`mb-5 flex items-center gap-2 font-sans text-xs ${
            isDark ? "text-white/50" : "text-[#141414]/50"
          }`}
        >
          <Link to="/" className="hover:text-[#FFB400]">
            Home
          </Link>
          <ChevronRight size={12} aria-hidden="true" />
          <Link to="/account/orders" className="hover:text-[#FFB400]">
            My Account
          </Link>
          <ChevronRight size={12} aria-hidden="true" />
          <span className="text-[#FFB400]">Order History</span>
        </nav>

        <div className="flex flex-col gap-8 lg:flex-row">
          <AccountSidebar isDark={isDark} />
          <OrdersPanel isDark={isDark} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
