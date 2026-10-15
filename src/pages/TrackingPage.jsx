import React, { useState, useEffect, useMemo } from "react";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  ShieldCheck,
  Copy,
  Check,
  ExternalLink,
  Phone,
  Mail,
  MessageCircle,
  HelpCircle,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  Box,
  Share2,
  XCircle,
  RotateCcw,
} from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useTheme } from "../context/ThemeContext";
import apiClient, { ENDPOINTS } from "../api/client";
import formatNaira from "../utils/formatNaira";

// Demo mock tracking records for instant previews & fallback
const SAMPLE_TRACKING_ORDERS = {
  "MAC-82914": {
    orderNumber: "MAC-82914",
    trackingId: "MLM-TRK-82914-NG",
    status: "OUT_FOR_DELIVERY",
    statusLabel: "Out for Delivery",
    carrier: "Marvelam Express Courier",
    service: "Priority Same-Day Dispatch",
    estimatedDelivery: "Today by 5:30 PM",
    destination: {
      recipient: "Amina Yusuf",
      address: "14 Admiralty Way, Lekki Phase 1",
      city: "Lagos",
      state: "Lagos State",
      phone: "+234 803 291 0021",
    },
    items: [
      {
        id: "item-1",
        name: "Royal Gold Embroidered Silk Abaya",
        color: "Black & Gold",
        size: "M",
        qty: 1,
        price: 48000,
        image: "https://picsum.photos/seed/mac-abaya-gold/160/200",
      },
      {
        id: "item-2",
        name: "Champagne Luxury Silk Scarf",
        color: "Champagne",
        size: "One Size",
        qty: 1,
        price: 15000,
        image: "https://picsum.photos/seed/mac-scarf-champagne/160/200",
      },
    ],
    timeline: [
      {
        stage: "Order Confirmed",
        description: "Order placed & verified by Marvelam Atelier",
        timestamp: "Oct 10, 2026 — 10:24 AM",
        location: "Victoria Island Atelier, Lagos",
        completed: true,
      },
      {
        stage: "Quality Checked & Packaged",
        description: "Bespoke inspection, garment steaming & luxury gift boxing",
        timestamp: "Oct 11, 2026 — 02:40 PM",
        location: "Marvelam Central Hub, Lagos",
        completed: true,
      },
      {
        stage: "In Transit",
        description: "Departed sorting facility and transferred to regional hub",
        timestamp: "Oct 12, 2026 — 07:15 AM",
        location: "Lekki Dispatch Center",
        completed: true,
      },
      {
        stage: "Out for Delivery",
        description: "Assigned to courier rider (Kelechi A. - +234 812 345 6789)",
        timestamp: "Oct 12, 2026 — 09:30 AM",
        location: "Lekki Phase 1 Delivery Route",
        completed: true,
        current: true,
      },
      {
        stage: "Delivered",
        description: "Recipient signature upon handover",
        timestamp: "Pending Delivery",
        location: "Destination Address",
        completed: false,
      },
    ],
  },
  "MAC-74019": {
    orderNumber: "MAC-74019",
    trackingId: "MLM-TRK-74019-NG",
    status: "IN_TRANSIT",
    statusLabel: "In Transit",
    carrier: "GIG Logistics Express",
    service: "Interstate Courier",
    estimatedDelivery: "Tomorrow, Oct 13 by 2:00 PM",
    destination: {
      recipient: "Chioma Nwosu",
      address: "28 Gana Street, Maitama",
      city: "Abuja",
      state: "Federal Capital Territory",
      phone: "+234 809 112 3456",
    },
    items: [
      {
        id: "item-3",
        name: "Emerald Green Velvet Kaftan",
        color: "Emerald Green",
        size: "L",
        qty: 1,
        price: 52000,
        image: "https://picsum.photos/seed/mac-velvet-kaftan/160/200",
      },
    ],
    timeline: [
      {
        stage: "Order Confirmed",
        description: "Payment approved and order processed",
        timestamp: "Oct 10, 2026 — 03:15 PM",
        location: "Marvelam Online Store",
        completed: true,
      },
      {
        stage: "Quality Checked & Packaged",
        description: "Packaged in signature Marvelam dust bag",
        timestamp: "Oct 11, 2026 — 11:30 AM",
        location: "Lagos Atelier",
        completed: true,
      },
      {
        stage: "In Transit",
        description: "En route via interstate freight to Abuja Hub",
        timestamp: "Oct 11, 2026 — 06:45 PM",
        location: "Airport Cargo Transit",
        completed: true,
        current: true,
      },
      {
        stage: "Out for Delivery",
        description: "Local distribution center dispatch",
        timestamp: "Pending Arrival in Abuja",
        location: "Abuja Distribution Hub",
        completed: false,
      },
      {
        stage: "Delivered",
        description: "Handover to recipient",
        timestamp: "Pending Delivery",
        location: "Maitama, Abuja",
        completed: false,
      },
    ],
  },
  "MAC-63201": {
    orderNumber: "MAC-63201",
    trackingId: "MLM-TRK-63201-NG",
    status: "PROCESSING",
    statusLabel: "In Atelier Preparation",
    carrier: "Marvelam Atelier Logistics",
    service: "Standard Tailored Dispatch",
    estimatedDelivery: "Oct 15 – Oct 17, 2026",
    destination: {
      recipient: "Zainab Bello",
      address: "5 Ahmadu Bello Way, Nassarawa",
      city: "Kano",
      state: "Kano State",
      phone: "+234 814 556 7890",
    },
    items: [
      {
        id: "item-4",
        name: "Premium Swiss Voile Fabric (5 Yards)",
        color: "Champagne Gold",
        size: "5 Yards",
        qty: 2,
        price: 24000,
        image: "https://picsum.photos/seed/mac-swiss-voile/160/200",
      },
    ],
    timeline: [
      {
        stage: "Order Confirmed",
        description: "Order received & fabric cut scheduled",
        timestamp: "Oct 11, 2026 — 08:12 PM",
        location: "Marvelam Atelier",
        completed: true,
        current: true,
      },
      {
        stage: "Quality Checked & Packaged",
        description: "Fabric inspection and protective seal packing",
        timestamp: "In Progress",
        location: "Marvelam Cutting Studio",
        completed: false,
      },
      {
        stage: "In Transit",
        description: "Dispatch to courier",
        timestamp: "Pending",
        location: "Lagos Dispatch Hub",
        completed: false,
      },
      {
        stage: "Out for Delivery",
        description: "Assigned to final delivery rider",
        timestamp: "Pending",
        location: "Kano Distribution Facility",
        completed: false,
      },
      {
        stage: "Delivered",
        description: "Delivered to doorstep",
        timestamp: "Pending",
        location: "Kano",
        completed: false,
      },
    ],
  },
  "MAC-91204": {
    orderNumber: "MAC-91204",
    trackingId: "MLM-TRK-91204-NG",
    status: "DELIVERED",
    statusLabel: "Delivered Successfully",
    carrier: "Marvelam Express Courier",
    service: "Standard Delivery",
    estimatedDelivery: "Delivered on Oct 09, 2026",
    destination: {
      recipient: "Folashade Adeyemi",
      address: "8 Bourdillon Road, Ikoyi",
      city: "Lagos",
      state: "Lagos State",
      phone: "+234 802 889 1234",
    },
    items: [
      {
        id: "item-5",
        name: "Golden Bloom Pleated Kimono Dress",
        color: "Rich Ochre",
        size: "M",
        qty: 1,
        price: 45000,
        image: "https://picsum.photos/seed/mac-kimono-gold/160/200",
      },
    ],
    timeline: [
      {
        stage: "Order Confirmed",
        description: "Order placed & verified",
        timestamp: "Oct 06, 2026 — 11:00 AM",
        location: "Victoria Island",
        completed: true,
      },
      {
        stage: "Quality Checked & Packaged",
        description: "Inspected & packaged in luxury box",
        timestamp: "Oct 07, 2026 — 03:00 PM",
        location: "Marvelam Hub",
        completed: true,
      },
      {
        stage: "In Transit",
        description: "En route to delivery facility",
        timestamp: "Oct 08, 2026 — 09:15 AM",
        location: "Ikoyi Dispatch Depot",
        completed: true,
      },
      {
        stage: "Out for Delivery",
        description: "Courier en route to address",
        timestamp: "Oct 09, 2026 — 10:45 AM",
        location: "Ikoyi Route",
        completed: true,
      },
      {
        stage: "Delivered",
        description: "Signed and received by Folashade Adeyemi",
        timestamp: "Oct 09, 2026 — 01:20 PM",
        location: "8 Bourdillon Road, Ikoyi",
        completed: true,
        current: true,
      },
    ],
  },
};

// Builds the canonical tracking timeline based on backend delivery status and dates
function buildDynamicTimeline(orderStatus, deliveryStatus, orderedDay, deliveredDay, rawTimeline, destCity = "Abuja") {
  const s = String(orderStatus || "").toUpperCase().trim();
  const d = String(deliveryStatus || "").toUpperCase().trim().replace(/_/g, " ");

  const isCancelled = s === "CANCELED" || s === "CANCELLED" || d === "CANCELED" || d === "CANCELLED";
  const isFailed = s === "FAILED" || d === "FAILED" || d === "FAILED DELIVERY";
  const isReturned = s === "RETURNED" || d === "RETURNED";

  const orderDateStr = orderedDay
    ? new Date(orderedDay).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : (rawTimeline?.[0]?.date || "Oct 10, 2026");
  const deliveryDateStr = deliveredDay
    ? new Date(deliveredDay).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "Delivered";

  if (isCancelled) {
    return [
      {
        stage: "Order Confirmed",
        description: "Order registered on Marvelam",
        timestamp: orderDateStr,
        location: "Marvelam Online Atelier",
        completed: true,
      },
      {
        stage: "Order Cancelled",
        description: "Order was cancelled and processing halted",
        timestamp: "Cancelled",
        location: "Marvelam Atelier",
        completed: true,
        current: true,
      },
    ];
  }

  if (isReturned) {
    return [
      {
        stage: "Order Delivered",
        description: "Order was delivered to address",
        timestamp: deliveryDateStr,
        location: "Customer Destination",
        completed: true,
      },
      {
        stage: "Return Processed",
        description: "Return request processed and parcel returned to atelier",
        timestamp: "Returned",
        location: "Marvelam Logistics Hub",
        completed: true,
        current: true,
      },
    ];
  }

  // Extract dates if available from backend rawTimeline array
  const findDate = (keywords) => {
    if (!Array.isArray(rawTimeline)) return null;
    const item = rawTimeline.find((it) => {
      const title = String(it.title || it.stage || it.step_key || "").toLowerCase();
      return keywords.some((kw) => title.includes(kw.toLowerCase()));
    });
    return item?.date || item?.timestamp || null;
  };

  const confirmedDate = findDate(["order", "confirmed", "placed"]) || orderDateStr;
  const packagedDate = findDate(["pack", "quality", "waiting"]) || orderDateStr;
  const shippedDate = findDate(["ship", "transit"]) || orderDateStr;
  const outForDeliveryDate = findDate(["out"]) || shippedDate;
  const deliveredDate = findDate(["deliver"]) || deliveryDateStr;

  // If failed delivery attempt occurred, show 6-milestone progression
  if (isFailed) {
    return [
      {
        stage: "Order Confirmed",
        description: "Order placed & verified",
        timestamp: confirmedDate,
        location: "Marvelam Atelier",
        completed: true,
      },
      {
        stage: "Quality Checked & Packaged",
        description: "Packaged in signature Marvelam dust bag",
        timestamp: packagedDate,
        location: "Lagos Atelier",
        completed: true,
      },
      {
        stage: "In Transit",
        description: `En route via interstate freight to ${destCity} Hub`,
        timestamp: shippedDate,
        location: "Airport Cargo Transit",
        completed: true,
      },
      {
        stage: "Out for Delivery",
        description: "Local distribution center dispatch",
        timestamp: outForDeliveryDate,
        location: `${destCity} Distribution Hub`,
        completed: true,
      },
      {
        stage: "Failed Delivery Attempt",
        description: "Delivery attempt failed. Courier unable to reach recipient.",
        timestamp: "Failed Attempt",
        location: `${destCity} Route`,
        completed: true,
        current: true,
      },
      {
        stage: "Delivered",
        description: "Handover to recipient",
        timestamp: "Pending Delivery",
        location: `${destCity} Destination`,
        completed: false,
      },
    ];
  }

  // Standard 5-milestone progression
  // 0: Order Confirmed
  // 1: Quality Checked & Packaged
  // 2: In Transit
  // 3: Out for Delivery
  // 4: Delivered
  let currentStageIndex = 0;
  if (d === "DELIVERED" || s === "COMPLETED") {
    currentStageIndex = 4;
  } else if (d === "OUT FOR DELIVERY" || d === "OUT_FOR_DELIVERY") {
    currentStageIndex = 3;
  } else if (d === "SHIPPED" || d === "IN TRANSIT" || d === "IN_TRANSIT") {
    currentStageIndex = 2;
  } else if (d === "WAITING TO BE SHIPPED" || d === "WAITING_TO_BE_SHIPPED" || d === "PROCESSING") {
    currentStageIndex = 1;
  } else {
    currentStageIndex = 0;
  }

  return [
    {
      stage: "Order Confirmed",
      description: "Payment approved and order processed",
      timestamp: confirmedDate,
      location: "Marvelam Online Store",
      completed: true,
      current: currentStageIndex === 0,
    },
    {
      stage: "Quality Checked & Packaged",
      description: "Packaged in signature Marvelam dust bag",
      timestamp: currentStageIndex >= 1 ? packagedDate : "Pending",
      location: "Lagos Atelier",
      completed: currentStageIndex >= 1,
      current: currentStageIndex === 1,
    },
    {
      stage: "In Transit",
      description: `En route via interstate freight to ${destCity} Hub`,
      timestamp: currentStageIndex >= 2 ? shippedDate : `Pending Arrival in ${destCity}`,
      location: "Airport Cargo Transit",
      completed: currentStageIndex >= 2,
      current: currentStageIndex === 2,
    },
    {
      stage: "Out for Delivery",
      description: "Local distribution center dispatch",
      timestamp: currentStageIndex >= 3 ? outForDeliveryDate : `Pending Arrival in ${destCity}`,
      location: `${destCity} Distribution Hub`,
      completed: currentStageIndex >= 3,
      current: currentStageIndex === 3,
    },
    {
      stage: "Delivered",
      description: "Handover to recipient",
      timestamp: currentStageIndex >= 4 ? deliveredDate : "Pending Delivery",
      location: `${destCity} Destination`,
      completed: currentStageIndex >= 4,
      current: currentStageIndex === 4,
    },
  ];
}

function generateDynamicTracking(query) {
  const cleanId = String(query).trim().toUpperCase();
  return {
    orderNumber: cleanId,
    trackingId: `MLM-TRK-${cleanId.replace(/[^A-Z0-9]/g, "") || "88219"}-NG`,
    status: "IN_TRANSIT",
    deliveryStatus: "SHIPPED",
    statusLabel: "In Transit",
    carrier: "Marvelam Express Courier",
    service: "Express Tracked Delivery",
    estimatedDelivery: "Within 2 - 3 business days",
    destination: {
      recipient: "Valued Marvelam Client",
      address: "Client Shipping Destination",
      city: "Lagos",
      state: "Nigeria",
      phone: "Contact on file",
    },
    items: [
      {
        id: "item-custom",
        name: "Marvelam Bespoke Fashion Piece",
        color: "Custom Finish",
        size: "Custom",
        qty: 1,
        price: 45000,
        image: "https://picsum.photos/seed/mac-apparel/160/200",
      },
    ],
    timeline: buildDynamicTimeline("CONFIRMED", "SHIPPED", null, null),
  };
}

export default function TrackingPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();

  // Support reading from path param or query string
  const { orderNumber: paramOrderNumber } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam =
    searchParams.get("orderNumber") ||
    searchParams.get("order") ||
    searchParams.get("tracking") ||
    searchParams.get("id");

  const initialQuery = paramOrderNumber || queryParam || "";

  const [inputOrderNumber, setInputOrderNumber] = useState(initialQuery);
  const [inputEmail, setInputEmail] = useState("");
  const [activeTracking, setActiveTracking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [shareFeedback, setShareFeedback] = useState(false);

  // Performs tracking lookup
  const performLookup = async (targetId) => {
    const trimmed = String(targetId || "").trim();
    if (!trimmed) {
      setError("Please enter your Order Number or Tracking ID.");
      return;
    }

    setLoading(true);
    setError(null);

    // 1. Check built-in mock samples first ONLY if explicitly matching sample keys and not in live session
    const upperId = trimmed.toUpperCase();

    // 2. Query live backend API endpoint first
    try {
      // First try tracking endpoint and order details in parallel
      const [trackRes, initialDetailsRes] = await Promise.all([
        apiClient.get(ENDPOINTS.ORDER_TRACK(trimmed)).catch(() => null),
        apiClient.get(ENDPOINTS.ORDER_DETAILS(trimmed)).catch(() => null),
      ]);

      let detailsRes = initialDetailsRes;
      if (!detailsRes?.data) {
        detailsRes = await apiClient.get(`orders/details/${trimmed}/`).catch(() => null);
      }

      const trackData = trackRes?.data;
      const detailsData = detailsRes?.data;

      if (trackData || detailsData) {
        const orderNum = trackData?.order_number || detailsData?.order_number || trimmed;
        const trkId = trackData?.tracking_id || detailsData?.tracking_id || `MLM-TRK-${orderNum}`;
        const ordStatus = (trackData?.status || detailsData?.order_status || detailsData?.status || "CONFIRMED").toUpperCase();
        const delivStatus = (trackData?.delivery_status || detailsData?.delivery_status || "PENDING").toUpperCase();

        const snap = detailsData?.shipping_address_snapshot;
        const destinationData = snap
          ? {
              recipient: `${snap.first_name || ""} ${snap.last_name || ""}`.trim() || "Customer",
              address: snap.delivery_address || "Delivery address on record",
              city: snap.city || "Lagos",
              state: snap.state || "Lagos State",
              phone: snap.phone_number || "",
            }
          : {
              recipient: "Customer",
              address: "Address registered on order",
              city: "Lagos",
              state: "Nigeria",
              phone: "",
            };

        let timelineData = null;
        let rawTimeline = null;
        if (Array.isArray(trackData?.timeline) && trackData.timeline.length > 0) {
          rawTimeline = trackData.timeline;
        } else if (typeof trackData?.timeline === "string" && trackData.timeline.startsWith("[")) {
          try {
            rawTimeline = JSON.parse(trackData.timeline);
          } catch {
            rawTimeline = null;
          }
        }

        const isCancelled =
          ordStatus === "CANCELED" ||
          ordStatus === "CANCELLED" ||
          delivStatus === "CANCELED" ||
          delivStatus === "CANCELLED";

        const isDelivered = delivStatus === "DELIVERED" || ordStatus === "COMPLETED";
        const destCity = destinationData?.city || destinationData?.state || "Abuja";

        // Display timeline according to what was responded from backend
        if (Array.isArray(rawTimeline) && rawTimeline.length > 0) {
          timelineData = rawTimeline.map((item, idx) => ({
            stage: item.title || item.stage || item.step_key || `Milestone ${idx + 1}`,
            title: item.title || item.stage || item.step_key || `Milestone ${idx + 1}`,
            step_key: item.step_key || item.key || "",
            description: item.description || "",
            timestamp: item.date || item.timestamp || "",
            date: item.date || item.timestamp || "",
            completed: Boolean(item.is_completed !== undefined ? item.is_completed : item.completed),
            is_completed: Boolean(item.is_completed !== undefined ? item.is_completed : item.completed),
            current: Boolean(item.is_current !== undefined ? item.is_current : item.current),
            is_current: Boolean(item.is_current !== undefined ? item.is_current : item.current),
            location: item.location || "",
          }));

          // If the order is NOT cancelled and NOT yet delivered:
          // Ensure the remaining stages (Out for Delivery and Delivered) are present and faint
          if (!isCancelled && !isDelivered) {
            const hasOutForDelivery = timelineData.some(
              (s) =>
                s.step_key === "OUT_FOR_DELIVERY" ||
                s.title?.toLowerCase().includes("out for delivery")
            );
            const hasDelivered = timelineData.some(
              (s) =>
                s.step_key === "DELIVERED" ||
                s.title?.toLowerCase().includes("delivered")
            );

            // If current status is before Out for Delivery, Out for Delivery must be present and faint
            if (!hasOutForDelivery && delivStatus !== "OUT_FOR_DELIVERY") {
              timelineData.push({
                stage: "Out for Delivery",
                title: "Out for Delivery",
                step_key: "OUT_FOR_DELIVERY",
                description: "Local distribution center dispatch",
                timestamp: `Pending Arrival in ${destCity}`,
                date: null,
                completed: false,
                is_completed: false,
                current: false,
                is_current: false,
                location: `${destCity} Distribution Hub`,
              });
            }

            // Delivered must always be present and faint if not delivered
            if (!hasDelivered) {
              timelineData.push({
                stage: "Delivered",
                title: "Delivered",
                step_key: "DELIVERED",
                description: "Handover to recipient",
                timestamp: "Pending Delivery",
                date: null,
                completed: false,
                is_completed: false,
                current: false,
                is_current: false,
                location: `${destCity} Destination`,
              });
            }

            // Ensure every stage up to the active status is completed (yellow checkmark)
            // and every stage AFTER the active status is marked uncompleted and faint
            let reachedCurrent = false;
            timelineData = timelineData.map((step) => {
              const isCurrentStep =
                step.current ||
                step.is_current ||
                step.step_key === delivStatus ||
                (delivStatus === "SHIPPED" && (step.step_key === "SHIPPED" || step.title?.toLowerCase().includes("ship"))) ||
                (delivStatus === "OUT_FOR_DELIVERY" && (step.step_key === "OUT_FOR_DELIVERY" || step.title?.toLowerCase().includes("out for delivery"))) ||
                (delivStatus === "FAILED_DELIVERY" && (step.step_key === "FAILED_DELIVERY" || step.title?.toLowerCase().includes("failed")));

              if (isCurrentStep) {
                reachedCurrent = true;
                return {
                  ...step,
                  completed: true,
                  is_completed: true,
                  current: true,
                  is_current: true,
                };
              }

              if (reachedCurrent) {
                return {
                  ...step,
                  completed: false,
                  is_completed: false,
                  current: false,
                  is_current: false,
                  date: null,
                  timestamp: step.timestamp || (step.title?.toLowerCase().includes("deliver") ? "Pending Delivery" : `Pending Arrival in ${destCity}`),
                };
              }

              return {
                ...step,
                completed: true,
                is_completed: true,
                current: false,
                is_current: false,
              };
            });
          }
        } else {
          timelineData = buildDynamicTimeline(
            ordStatus,
            delivStatus,
            detailsData?.ordered_day || trackData?.created_at,
            detailsData?.delivered_day || trackData?.delivered_at,
            rawTimeline,
            destCity
          );
        }

        const itemsData = (detailsData?.orderitems || trackData?.orderitems || []).map((it) => ({
          id: it.id,
          name: it.name || it.product_name || "Marvelam Item",
          color: it.color || "Standard",
          size: it.size || "Standard",
          qty: it.quantity || 1,
          price: it.unit_price || it.price || 0,
          image: it.image || it.image_url || `https://picsum.photos/seed/${it.id || it.name || "item"}/160/200`,
        }));

        // Determine estimated/actual delivery string
        const deliveredStep = timelineData?.find(
          (s) => s.step_key === "DELIVERED" || s.stage === "Delivered" || s.title === "Delivered"
        );
        const estimatedDelivery = delivStatus === "DELIVERED"
          ? (deliveredStep?.date || deliveredStep?.timestamp ? `Delivered on ${deliveredStep.date || deliveredStep.timestamp}` : "Delivered")
          : detailsData?.delivered_day
          ? `Delivered on ${new Date(detailsData.delivered_day).toLocaleDateString()}`
          : "Estimated 2 – 4 days";

        const normalized = {
          orderNumber: orderNum,
          trackingId: trkId,
          status: ordStatus,
          deliveryStatus: delivStatus,
          statusLabel: delivStatus.replace(/_/g, " "),
          carrier: trackData?.carrier || detailsData?.carrier || "Marvelam Express Logistics",
          service: detailsData?.delivery_method_name || "Express Doorstep Delivery",
          estimatedDelivery,
          destination: destinationData,
          items: itemsData,
          timeline: timelineData,
        };

        setActiveTracking(normalized);
        setLoading(false);
        return;
      }

      // Check sample orders if live backend returns nothing
      if (SAMPLE_TRACKING_ORDERS[upperId]) {
        setActiveTracking(SAMPLE_TRACKING_ORDERS[upperId]);
        setLoading(false);
        return;
      }

      // 3. Fallback or notify
      setError(`Could not locate order #${trimmed}. Please verify the order number.`);
    } catch {
      if (SAMPLE_TRACKING_ORDERS[upperId]) {
        setActiveTracking(SAMPLE_TRACKING_ORDERS[upperId]);
      } else {
        setError(`Failed to fetch tracking details for #${trimmed}.`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Trigger search on mount if URL parameter was supplied
  useEffect(() => {
    if (initialQuery) {
      performLookup(initialQuery);
    } else {
      // Default to sample order so the user sees a rich page right away
      performLookup("MAC-82914");
    }
  }, [paramOrderNumber, queryParam]);

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!inputOrderNumber.trim()) {
      setError("Please enter your Order Number or Tracking ID.");
      return;
    }
    setSearchParams({ orderNumber: inputOrderNumber.trim() });
    performLookup(inputOrderNumber.trim());
  };

  const handleSelectSample = (sampleId) => {
    setInputOrderNumber(sampleId);
    setSearchParams({ orderNumber: sampleId });
    performLookup(sampleId);
  };

  const handleCopyTracking = () => {
    if (!activeTracking?.trackingId) return;
    navigator.clipboard.writeText(activeTracking.trackingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: `Track Order ${activeTracking?.orderNumber} | Marvelam`,
        url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      setShareFeedback(true);
      setTimeout(() => setShareFeedback(false), 2000);
    }
  };

  // Status badge config
  const getStatusBadge = (status, deliveryStatus) => {
    const s = String(status || "").toUpperCase();
    const d = String(deliveryStatus || "").toUpperCase().replace(/_/g, " ");

    if (d === "DELIVERED" || s === "DELIVERED" || s === "COMPLETED") {
      return {
        icon: CheckCircle2,
        color: "border-emerald-500/40 bg-emerald-500/15 text-emerald-400",
        label: "Delivered",
      };
    }
    if (d === "OUT FOR DELIVERY" || s === "OUT_FOR_DELIVERY") {
      return {
        icon: Truck,
        color: "border-[#FFB400]/40 bg-[#FFB400]/15 text-[#FFB400]",
        label: "Out for Delivery",
      };
    }
    if (d === "SHIPPED" || s === "SHIPPED" || s === "IN_TRANSIT") {
      return {
        icon: Box,
        color: "border-blue-400/40 bg-blue-400/15 text-blue-300",
        label: "Shipped",
      };
    }
    if (s === "FAILED" || d === "FAILED" || d === "FAILED DELIVERY") {
      return {
        icon: AlertCircle,
        color: "border-red-500/40 bg-red-500/15 text-red-400",
        label: "Failed Delivery",
      };
    }
    if (s === "CANCELED" || s === "CANCELLED" || d === "CANCELED" || d === "CANCELLED") {
      return {
        icon: XCircle,
        color: "border-neutral-500/40 bg-neutral-500/15 text-neutral-400",
        label: "Cancelled",
      };
    }
    if (s === "RETURNED" || d === "RETURNED") {
      return {
        icon: RotateCcw,
        color: "border-purple-400/40 bg-purple-400/15 text-purple-400",
        label: "Returned",
      };
    }
    return {
      icon: Clock,
      color: "border-amber-400/40 bg-amber-400/15 text-amber-300",
      label: d || "Processing in Atelier",
    };
  };

  const badgeConfig = activeTracking
    ? getStatusBadge(activeTracking.status, activeTracking.deliveryStatus)
    : null;
  const BadgeIcon =
    badgeConfig?.icon && (typeof badgeConfig.icon === "function" || typeof badgeConfig.icon === "object")
      ? badgeConfig.icon
      : Clock;

  // Compute completed timeline count
  const completedTimelineCount = useMemo(() => {
    if (!activeTracking?.timeline) return 0;
    return activeTracking.timeline.filter((step) => Boolean(step.completed || step.is_completed)).length;
  }, [activeTracking]);

  const timelinePercent = useMemo(() => {
    if (!activeTracking?.timeline || activeTracking.timeline.length === 0) return 0;
    const total = activeTracking.timeline.length;
    return Math.min(100, Math.round((completedTimelineCount / total) * 100));
  }, [activeTracking, completedTimelineCount]);

  return (
    <div
      className={`min-h-screen font-sans antialiased transition-colors duration-300 ${
        isDark ? "bg-[#0F0F0F] text-white" : "bg-[#FBF9F5] text-[#141414]"
      }`}
    >
      <Header />

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-8">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className={`mb-6 flex items-center gap-2 font-sans text-xs ${
            isDark ? "text-white/50" : "text-[#5A5247]"
          }`}
        >
          <Link to="/" className="hover:text-[#FFB400] transition-colors">
            Home
          </Link>
          <ChevronRight size={12} aria-hidden="true" />
          <Link to="/catalog" className="hover:text-[#FFB400] transition-colors">
            Shop
          </Link>
          <ChevronRight size={12} aria-hidden="true" />
          <span className="text-[#FFB400]">Track Order</span>
          {activeTracking && (
            <>
              <ChevronRight size={12} aria-hidden="true" />
              <span className={isDark ? "text-white/80" : "text-[#141414]/80"}>
                #{activeTracking.orderNumber}
              </span>
            </>
          )}
        </nav>

        {/* Page Hero Header */}
        <section className="mb-10 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FFB400]/40 bg-[#FFB400]/10 px-4 py-1 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#FFB400] mb-3">
            <Truck size={14} /> Real-Time Package Dispatch
          </span>
          <h1
            className={`font-display text-3xl sm:text-5xl font-medium tracking-tight ${
              isDark ? "text-[#F9FAFB]" : "text-[#141414]"
            }`}
          >
            Track Your Marvelam Shipment
          </h1>
          <p
            className={`mx-auto mt-3 max-w-xl font-sans text-sm sm:text-base leading-relaxed ${
              isDark ? "text-white/60" : "text-[#5A5247]"
            }`}
          >
            Enter your order number or waybill tracking ID below to check live logistics progress,
            delivery rider updates, and expected arrival window.
          </p>

          {/* Search Card */}
          <div
            className={`mx-auto mt-8 max-w-3xl rounded-2xl border p-5 sm:p-6 shadow-xl transition-all duration-200 ${
              isDark
                ? "border-white/10 bg-[#161616] shadow-black/40"
                : "border-[#EAE6DF] bg-white shadow-stone-200/50"
            }`}
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                    isDark ? "text-white/40" : "text-[#8C8375]"
                  }`}
                />
                <input
                  type="text"
                  value={inputOrderNumber}
                  onChange={(e) => {
                    setInputOrderNumber(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="e.g. MAC-82914 or MLM-TRK-82914-NG"
                  className={`w-full rounded-xl border py-3.5 pl-11 pr-4 font-sans text-sm focus:border-[#FFB400] focus:outline-none transition-colors ${
                    isDark
                      ? "border-white/15 bg-[#202020] text-white placeholder:text-white/35"
                      : "border-[#DCD7CD] bg-[#FAF8F5] text-[#141414] placeholder:text-[#9E978C]"
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFB400] px-7 py-3.5 font-sans text-sm font-semibold text-[#0F0F0F] transition-all duration-200 hover:bg-[#FFB400]/90 hover:scale-[1.01] active:scale-[0.99] shadow-md shadow-[#FFB400]/20 disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Tracking...
                  </>
                ) : (
                  <>
                    Track Package
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {error && (
              <div className="mt-3 flex items-center gap-2 text-xs text-red-400">
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}

            {/* Quick Demo Preview Pills */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 pt-3 border-t border-dashed border-white/10 sm:justify-start">
              <span className={`text-[11px] font-medium ${isDark ? "text-white/45" : "text-[#8C8375]"}`}>
                Try Sample Orders:
              </span>
              {Object.keys(SAMPLE_TRACKING_ORDERS).map((sampleKey) => {
                const sample = SAMPLE_TRACKING_ORDERS[sampleKey];
                const isSelected = activeTracking?.orderNumber === sampleKey;
                return (
                  <button
                    key={sampleKey}
                    type="button"
                    onClick={() => handleSelectSample(sampleKey)}
                    className={`rounded-full border px-3 py-1 font-sans text-[11px] font-semibold transition-all duration-150 ${
                      isSelected
                        ? "border-[#FFB400] bg-[#FFB400] text-[#0F0F0F]"
                        : isDark
                        ? "border-white/15 bg-[#1F1F1F] text-white/70 hover:border-[#FFB400]/60 hover:text-[#FFB400]"
                        : "border-[#DCD7CD] bg-[#F4EFE6] text-[#4A453E] hover:border-[#FFB400] hover:text-[#B37E00]"
                    }`}
                  >
                    {sampleKey} &middot; {sample.statusLabel}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Loading Spinner */}
        {loading && (
          <div
            className={`my-12 rounded-2xl border p-16 text-center ${
              isDark ? "border-white/10 bg-[#161616]" : "border-[#EAE6DF] bg-white"
            }`}
          >
            <RefreshCw size={36} className="mx-auto animate-spin text-[#FFB400]" />
            <p className="mt-4 font-sans text-base font-semibold text-[#FFB400]">
              Connecting to Marvelam Logistics Network...
            </p>
            <p className={`mt-1 font-sans text-xs ${isDark ? "text-white/50" : "text-[#5A5247]"}`}>
              Retrieving live waybill checkpoint updates
            </p>
          </div>
        )}

        {/* Active Tracking Content */}
        {!loading && activeTracking && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Top Overview Banner Card */}
            <div
              className={`rounded-2xl border p-6 sm:p-8 transition-all ${
                isDark
                  ? "border-white/10 bg-[#161616] shadow-xl shadow-black/30"
                  : "border-[#EAE6DF] bg-white shadow-sm"
              }`}
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                {/* Left Column: Order Identity & Structured Meta Chips */}
                <div className="space-y-4 max-w-2xl">
                  {/* Eyebrow & Live Pulse */}
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span
                        className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                          activeTracking.deliveryStatus === "DELIVERED" || activeTracking.status === "COMPLETED"
                            ? "bg-emerald-400"
                            : activeTracking.deliveryStatus === "FAILED_DELIVERY"
                            ? "bg-red-400"
                            : "bg-[#FFB400]"
                        }`}
                      />
                      <span
                        className={`relative inline-flex h-2 w-2 rounded-full ${
                          activeTracking.deliveryStatus === "DELIVERED" || activeTracking.status === "COMPLETED"
                            ? "bg-emerald-500"
                            : activeTracking.deliveryStatus === "FAILED_DELIVERY"
                            ? "bg-red-500"
                            : "bg-[#FFB400]"
                        }`}
                      />
                    </span>
                    <span
                      className={`font-mono text-[11px] font-semibold tracking-wider uppercase ${
                        isDark ? "text-white/45" : "text-[#8C8375]"
                      }`}
                    >
                      Shipment Checkpoint &bull; Live Updates
                    </span>
                  </div>

                  {/* Order Heading and Status Badge */}
                  <div className="flex flex-wrap items-center gap-3">
                    <h1
                      className={`font-display text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight ${
                        isDark ? "text-white" : "text-[#141414]"
                      }`}
                    >
                      Order #{activeTracking.orderNumber}
                    </h1>
                    {badgeConfig && (
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 font-sans text-xs font-semibold ${badgeConfig.color}`}
                      >
                        <BadgeIcon size={14} />
                        {activeTracking.statusLabel || badgeConfig.label}
                      </span>
                    )}
                  </div>

                  {/* Structured Meta Badges */}
                  <div className="flex flex-wrap items-center gap-2.5 pt-1">
                    {/* Tracking ID Chip */}
                    <div
                      className={`group flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                        isDark
                          ? "border-white/10 bg-[#1C1C1C] hover:border-[#FFB400]/50"
                          : "border-[#EAE6DF] bg-[#FAF8F5] hover:border-[#FFB400]"
                      }`}
                    >
                      <span className={isDark ? "text-white/45 font-medium" : "text-[#8C8375] font-medium"}>
                        Tracking ID:
                      </span>
                      <span className="font-mono font-bold text-[#FFB400] tracking-wide">
                        {activeTracking.trackingId}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyTracking}
                        title="Copy Tracking ID"
                        className={`ml-0.5 rounded p-0.5 transition-colors cursor-pointer ${
                          isDark ? "text-white/40 hover:text-white" : "text-[#8C8375] hover:text-[#141414]"
                        }`}
                      >
                        {copied ? (
                          <Check size={13} className="text-emerald-400" />
                        ) : (
                          <Copy size={13} className="transition-transform group-hover:scale-110" />
                        )}
                      </button>
                    </div>

                    {/* Carrier Chip */}
                    {activeTracking.carrier && (
                      <div
                        className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs ${
                          isDark
                            ? "border-white/10 bg-[#1C1C1C] text-white/75"
                            : "border-[#EAE6DF] bg-[#FAF8F5] text-[#4A453E]"
                        }`}
                      >
                        <Truck size={14} className="text-[#FFB400] shrink-0" />
                        <span>
                          Carrier:{" "}
                          <strong className={isDark ? "text-white font-semibold" : "text-[#141414] font-semibold"}>
                            {activeTracking.carrier}
                          </strong>
                        </span>
                      </div>
                    )}

                    {/* Service Type Chip */}
                    {activeTracking.service && (
                      <div
                        className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs ${
                          isDark
                            ? "border-white/10 bg-[#1C1C1C] text-white/75"
                            : "border-[#EAE6DF] bg-[#FAF8F5] text-[#4A453E]"
                        }`}
                      >
                        <Box size={14} className="text-[#FFB400] shrink-0" />
                        <span>
                          Service:{" "}
                          <strong className={isDark ? "text-white font-semibold" : "text-[#141414] font-semibold"}>
                            {activeTracking.service}
                          </strong>
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Refined Delivery Status & Share Showcase (Image 1 Style) */}
                {(() => {
                  const isDelivered =
                    activeTracking.deliveryStatus === "DELIVERED" ||
                    activeTracking.status === "COMPLETED";

                  const isCancelled =
                    activeTracking.status === "CANCELED" ||
                    activeTracking.status === "CANCELLED" ||
                    activeTracking.deliveryStatus === "CANCELED" ||
                    activeTracking.deliveryStatus === "CANCELLED";

                  const isFailed = activeTracking.deliveryStatus === "FAILED_DELIVERY";

                  const isOutForDelivery =
                    activeTracking.deliveryStatus === "OUT_FOR_DELIVERY" ||
                    activeTracking.deliveryStatus === "OUT FOR DELIVERY";

                  // Try to find the delivered timestamp if completed
                  const deliveredStep = activeTracking.timeline?.find(
                    (s) =>
                      (s.step_key === "DELIVERED" ||
                        s.stage?.toLowerCase()?.includes("deliver") ||
                        s.title?.toLowerCase()?.includes("deliver")) &&
                      s.completed
                  );
                  const deliveredDate =
                    deliveredStep?.timestamp && !deliveredStep.timestamp.toLowerCase().includes("pending")
                      ? deliveredStep.timestamp
                      : deliveredStep?.date || null;

                  let bannerBg = "bg-[#0B7A1F]";
                  let bannerTextColor = "text-white";
                  let BannerIcon = Check;
                  let bannerTitle = "Delivered";
                  let bannerDetail = `Delivered to ${activeTracking.destination?.city || "destination"}`;

                  if (isDelivered) {
                    bannerBg = "bg-[#0B7A1F]"; // Image 1 signature vibrant green
                    bannerTextColor = "text-white";
                    BannerIcon = Check;
                    if (deliveredDate) {
                      bannerTitle = `Delivered on ${deliveredDate}`;
                    } else if (activeTracking.estimatedDelivery?.toLowerCase().startsWith("delivered")) {
                      bannerTitle = activeTracking.estimatedDelivery;
                    } else {
                      bannerTitle = "Delivered Successfully";
                    }
                    bannerDetail = `Handed over to ${activeTracking.destination?.recipient || "recipient"} in ${activeTracking.destination?.city || "destination"}`;
                  } else if (isCancelled) {
                    bannerBg = "bg-[#4B5563]";
                    bannerTextColor = "text-white";
                    BannerIcon = XCircle;
                    bannerTitle = "Order Cancelled";
                    bannerDetail = "This order was cancelled and will not be dispatched.";
                  } else if (isFailed) {
                    bannerBg = "bg-[#DC2626]";
                    bannerTextColor = "text-white";
                    BannerIcon = AlertCircle;
                    bannerTitle = "Delivery Attempt Failed";
                    bannerDetail = "Courier was unable to reach recipient. Reattempt will be scheduled.";
                  } else if (isOutForDelivery) {
                    bannerBg = "bg-[#1D4ED8]";
                    bannerTextColor = "text-white";
                    BannerIcon = Truck;
                    bannerTitle = "Out for Delivery";
                    bannerDetail = `Courier is en route to ${activeTracking.destination?.city || "your doorstep"}`;
                  } else {
                    bannerBg = "bg-[#B45309]";
                    bannerTextColor = "text-white";
                    BannerIcon = Calendar;
                    const est = activeTracking.estimatedDelivery?.replace(/^Estimated\s*/i, "") || "2 – 4 days";
                    bannerTitle = `Estimated Arrival: ${est}`;
                    bannerDetail = `Carrier: ${activeTracking.carrier || "Marvelam Express Courier"}`;
                  }

                  return (
                    <div
                      className={`overflow-hidden rounded-xl border transition-all shadow-md lg:min-w-[320px] shrink-0 ${
                        isDark
                          ? "border-white/10 bg-[#171717]"
                          : "border-[#E5E0D8] bg-white shadow-sm"
                      }`}
                    >
                      {/* Top Banner Header (Style stolen like an artist from Image 1) */}
                      <div
                        className={`px-4 py-3 sm:px-4.5 sm:py-3.5 flex items-center gap-2.5 font-sans font-bold text-sm sm:text-[15px] tracking-tight ${bannerBg} ${bannerTextColor}`}
                      >
                        <BannerIcon size={18} className="stroke-[3] shrink-0" />
                        <span className="truncate">{bannerTitle}</span>
                      </div>

                      {/* Card Body */}
                      <div className="p-4 sm:p-5 flex flex-col justify-between gap-3.5">
                        <div>
                          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider mb-1">
                            <span className={isDark ? "text-white/50" : "text-[#7B7266]"}>
                              Status Overview
                            </span>
                            <span
                              className={
                                isDelivered
                                  ? "text-emerald-500 font-bold"
                                  : isCancelled
                                  ? "text-stone-400 font-bold"
                                  : isFailed
                                  ? "text-red-400 font-bold"
                                  : "text-[#FFB400] font-bold"
                              }
                            >
                              {activeTracking.statusLabel || activeTracking.deliveryStatus}
                            </span>
                          </div>
                          <p className={`text-xs leading-relaxed ${isDark ? "text-white/70" : "text-[#5A5247]"}`}>
                            {bannerDetail}
                          </p>
                        </div>

                        {/* Share Tracking Button */}
                        <div
                          className={`pt-3 border-t flex items-center justify-between gap-2 ${
                            isDark ? "border-white/10" : "border-[#EAE5D9]"
                          }`}
                        >
                          <span className={`text-[11px] ${isDark ? "text-white/45" : "text-[#8C8375]"}`}>
                            Recipient copy:
                          </span>
                          <button
                            type="button"
                            onClick={handleShare}
                            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-sans text-xs font-semibold transition-all cursor-pointer ${
                              shareFeedback
                                ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-400"
                                : isDark
                                ? "border-white/15 bg-white/5 text-white/85 hover:border-[#FFB400] hover:text-[#FFB400] hover:bg-[#FFB400]/10"
                                : "border-[#DCD7CD] bg-white text-[#5A5247] hover:border-[#FFB400] hover:text-[#B37E00]"
                            }`}
                          >
                            {shareFeedback ? (
                              <>
                                <Check size={13} className="text-emerald-400" />
                                <span>Link Copied</span>
                              </>
                            ) : (
                              <>
                                <Share2 size={13} />
                                <span>Share Tracking</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Progress Bar & Stage Indicator */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className={`font-medium ${isDark ? "text-white/60" : "text-[#5A5247]"}`}>
                    Shipment Progress
                  </span>
                  <span className="font-semibold text-[#FFB400]">
                    {completedTimelineCount} of {activeTracking.timeline.length} Milestones ({timelinePercent}%)
                  </span>
                </div>
                <div className={`h-2.5 w-full overflow-hidden rounded-full ${isDark ? "bg-[#252525]" : "bg-[#EAE5D9]"}`}>
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#FFB400] to-[#E5A100] transition-all duration-700 ease-out"
                    style={{ width: `${timelinePercent}%` }}
                  />
                </div>

                {/* Horizontal Stepper on Desktop */}
                <div
                  className="mt-6 hidden gap-2 sm:grid"
                  style={{
                    gridTemplateColumns: `repeat(${activeTracking.timeline?.length || 5}, minmax(0, 1fr))`,
                  }}
                >
                  {activeTracking.timeline.map((step, idx) => {
                    const isDone = Boolean(step.completed || step.is_completed);
                    const isCurrent = Boolean(step.current || step.is_current);
                    const stepTitle = step.title || step.stage || step.step_key || `Milestone ${idx + 1}`;
                    const stepDate = step.date || step.timestamp || "";
                    const isFailedStep = step.step_key === "FAILED_DELIVERY" || stepTitle.toLowerCase().includes("failed");
                    const isCancelStep = step.step_key === "CANCELED" || stepTitle.toLowerCase().includes("cancel");

                    return (
                      <div key={idx} className="flex flex-col items-center text-center">
                        <div
                          className={`mb-2.5 flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200 ${
                            isFailedStep
                              ? "border-red-500 bg-red-500/20 text-red-400 shadow-sm shadow-red-500/20"
                              : isCancelStep
                              ? "border-neutral-500 bg-neutral-600/30 text-neutral-300"
                              : isDone
                              ? "border-[#FFB400] bg-[#FFB400] text-[#0F0F0F] shadow-sm shadow-[#FFB400]/25"
                              : isDark
                              ? "border-white/15 bg-transparent text-white/30"
                              : "border-[#DCD7CD] bg-transparent text-[#8C8375]"
                          }`}
                        >
                          {isFailedStep ? (
                            <AlertCircle size={16} className="stroke-[2.5] text-red-400" />
                          ) : isCancelStep ? (
                            <XCircle size={16} className="stroke-[2.5] text-neutral-300" />
                          ) : isDone ? (
                            <Check size={16} className="stroke-[3] text-[#0F0F0F]" />
                          ) : (
                            <span className="text-xs font-semibold">{idx + 1}</span>
                          )}
                        </div>
                        <p
                          className={`font-sans text-xs font-semibold ${
                            isFailedStep
                              ? "text-red-400"
                              : isCancelStep
                              ? "text-neutral-400"
                              : isDone
                              ? isDark ? "text-white" : "text-[#141414]"
                              : isDark ? "text-white/35" : "text-[#8C8375]/70"
                          }`}
                        >
                          {stepTitle}
                        </p>
                        {stepDate ? (
                          <p
                            className={`mt-1 text-[11px] font-normal ${
                              isFailedStep
                                ? "text-red-400/80"
                                : isCancelStep
                                ? "text-neutral-400/80"
                                : isDone
                                ? isDark ? "text-white/55" : "text-[#6E665A]"
                                : isDark ? "text-white/25" : "text-[#8C8375]/50"
                            }`}
                          >
                            {typeof stepDate === "string" ? stepDate.split("—")[0].trim() : stepDate}
                          </p>
                        ) : !isDone && (
                          <p className={`mt-1 text-[11px] font-normal italic ${isDark ? "text-white/25" : "text-[#8C8375]/50"}`}>
                            Pending
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Two-Column Layout: Timeline Activity & Shipment Details */}
            <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
              {/* Left Column: Live Activity Checkpoint Log */}
              <div
                className={`rounded-2xl border p-6 sm:p-8 transition-colors ${
                  isDark ? "border-white/10 bg-[#161616]" : "border-[#EAE6DF] bg-white shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between pb-5 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <Clock size={18} className="text-[#FFB400]" />
                    <h2 className="font-display text-xl font-semibold">Checkpoint Activity Log</h2>
                  </div>
                  <span className={`text-xs ${isDark ? "text-white/45" : "text-[#8C8375]"}`}>
                    Live updates
                  </span>
                </div>

                <div className="mt-6 space-y-6">
                  {activeTracking.timeline.map((step, idx) => {
                    const isLast = idx === activeTracking.timeline.length - 1;
                    const isDone = Boolean(step.completed || step.is_completed);
                    const isCurrent = Boolean(step.current || step.is_current);
                    const stepTitle = step.title || step.stage || step.step_key || `Milestone ${idx + 1}`;
                    const stepDate = step.date || step.timestamp || "";

                    const isFailedStep = step.step_key === "FAILED_DELIVERY" || stepTitle.toLowerCase().includes("failed");
                    const isCancelStep = step.step_key === "CANCELED" || stepTitle.toLowerCase().includes("cancel");

                    return (
                      <div key={idx} className="relative flex gap-4">
                        {/* Vertical line connecting stages */}
                        {!isLast && (
                          <div
                            className={`absolute left-4 top-8 -bottom-6 w-0.5 ${
                              isDone ? "bg-[#FFB400]/70" : isDark ? "bg-white/10" : "bg-[#EAE5D9]"
                            }`}
                          />
                        )}

                        {/* Node circle */}
                        <div
                          className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                            isFailedStep
                              ? "border-red-500 bg-red-500/20 text-red-400"
                              : isCancelStep
                              ? "border-neutral-500 bg-neutral-600/30 text-neutral-300"
                              : isDone
                              ? "border-[#FFB400] bg-[#FFB400] text-[#0F0F0F]"
                              : isDark
                              ? "border-white/15 bg-[#202020] text-white/30"
                              : "border-[#DCD7CD] bg-[#FAF8F5] text-[#8C8375]"
                          }`}
                        >
                          {isFailedStep ? (
                            <AlertCircle size={14} className="stroke-[2.5]" />
                          ) : isCancelStep ? (
                            <XCircle size={14} className="stroke-[2.5]" />
                          ) : isDone ? (
                            <Check size={14} className="stroke-[3]" />
                          ) : (
                            <span className="text-xs font-bold">{idx + 1}</span>
                          )}
                        </div>

                        {/* Event Details */}
                        <div className="flex-1 pb-2">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                            <h3
                              className={`font-sans text-sm font-semibold ${
                                isFailedStep
                                  ? "text-red-400"
                                  : isCancelStep
                                  ? "text-neutral-400"
                                  : isDone || isCurrent
                                  ? isDark ? "text-white" : "text-[#141414]"
                                  : isDark ? "text-white/40" : "text-[#8C8375]"
                              }`}
                            >
                              {stepTitle}
                              {isFailedStep ? (
                                <span className="ml-2 inline-flex items-center rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-bold text-red-400">
                                  Delivery Failed
                                </span>
                              ) : isCancelStep ? (
                                <span className="ml-2 inline-flex items-center rounded-full bg-neutral-500/20 px-2 py-0.5 text-[10px] font-bold text-neutral-300">
                                  Order Canceled
                                </span>
                              ) : isCurrent && (
                                <span className="ml-2 inline-flex items-center rounded-full bg-[#FFB400]/20 px-2 py-0.5 text-[10px] font-bold text-[#FFB400]">
                                  Active Stage
                                </span>
                              )}
                            </h3>
                            <span
                              className={`font-sans text-xs ${
                                isFailedStep
                                  ? "text-red-400/80 font-medium"
                                  : isCancelStep
                                  ? "text-neutral-400/80 font-medium"
                                  : isDone
                                  ? "text-[#FFB400] font-medium"
                                  : isDark ? "text-white/40" : "text-[#8C8375]"
                              }`}
                            >
                              {stepDate || (isCurrent ? "In Progress" : "Pending")}
                            </span>
                          </div>

                          {step.description && (
                            <p
                              className={`mt-1 font-sans text-xs leading-relaxed ${
                                isDark ? "text-white/70" : "text-[#5A5247]"
                              }`}
                            >
                              {step.description}
                            </p>
                          )}

                          {step.location && (
                            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#FFB400]/90">
                              <MapPin size={12} />
                              <span>{step.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Destination, Package Items, & Support */}
              <div className="space-y-6">
                {/* Delivery Snapshot */}
                <div
                  className={`rounded-2xl border p-6 transition-colors ${
                    isDark ? "border-white/10 bg-[#161616]" : "border-[#EAE6DF] bg-white shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                    <MapPin size={16} className="text-[#FFB400]" />
                    <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-[#FFB400]">
                      Shipping Destination
                    </h3>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <p className="font-semibold text-sm">
                      {activeTracking.destination.recipient}
                    </p>
                    <p className={isDark ? "text-white/70" : "text-[#5A5247]"}>
                      {activeTracking.destination.address}
                    </p>
                    <p className={isDark ? "text-white/70" : "text-[#5A5247]"}>
                      {activeTracking.destination.city}, {activeTracking.destination.state}
                    </p>
                    {activeTracking.destination.phone && (
                      <p className={`pt-1 ${isDark ? "text-white/60" : "text-[#8C8375]"}`}>
                        Contact: {activeTracking.destination.phone}
                      </p>
                    )}
                  </div>
                </div>



                {/* Support & Courier Contact Card */}
                <div
                  className={`rounded-2xl border p-6 transition-colors ${
                    isDark ? "border-white/10 bg-[#161616]" : "border-[#EAE6DF] bg-white shadow-sm"
                  }`}
                >
                  <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-[#FFB400]">
                    Need Help with Delivery?
                  </h3>
                  <p className={`mt-1.5 text-xs leading-relaxed ${isDark ? "text-white/60" : "text-[#5A5247]"}`}>
                    Need to reschedule your delivery, update delivery instructions, or change address?
                    Contact our dedicated logistics concierge team.
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-2.5">
                    <a
                      href="https://wa.me/2348000000000"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-green-500/30 bg-green-500/10 py-2.5 px-3 font-sans text-xs font-semibold text-green-400 transition-colors hover:bg-green-500/20"
                    >
                      <MessageCircle size={14} /> WhatsApp
                    </a>
                    <a
                      href="mailto:concierge@marvelam.com"
                      className={`inline-flex items-center justify-center gap-1.5 rounded-lg border py-2.5 px-3 font-sans text-xs font-semibold transition-colors ${
                        isDark
                          ? "border-white/15 bg-white/5 text-white/80 hover:bg-white/10"
                          : "border-[#DCD7CD] bg-[#FAF8F5] text-[#5A5247] hover:bg-[#F2ECE1]"
                      }`}
                    >
                      <Mail size={14} /> Email Us
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <section className="mt-16 border-t border-white/10 pt-12">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold">
              Frequently Asked Questions
            </h2>
            <p className={`mt-2 font-sans text-xs sm:text-sm ${isDark ? "text-white/60" : "text-[#5A5247]"}`}>
              Everything you need to know about delivery times, shipping partners, and tracking.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 max-w-5xl mx-auto">
            <div
              className={`rounded-xl border p-5 ${
                isDark ? "border-white/10 bg-[#161616]" : "border-[#EAE6DF] bg-white"
              }`}
            >
              <h4 className="font-sans text-sm font-semibold text-[#FFB400]">
                How long does delivery take?
              </h4>
              <p className={`mt-2 font-sans text-xs leading-relaxed ${isDark ? "text-white/60" : "text-[#5A5247]"}`}>
                Standard Lagos orders take 1 – 2 business days. Nationwide deliveries (Abuja, Port Harcourt, Kano, etc.)
                take 3 – 5 business days from completion of tailoring.
              </p>
            </div>

            <div
              className={`rounded-xl border p-5 ${
                isDark ? "border-white/10 bg-[#161616]" : "border-[#EAE6DF] bg-white"
              }`}
            >
              <h4 className="font-sans text-sm font-semibold text-[#FFB400]">
                Where can I find my tracking ID?
              </h4>
              <p className={`mt-2 font-sans text-xs leading-relaxed ${isDark ? "text-white/60" : "text-[#5A5247]"}`}>
                Your tracking ID was sent to your email and SMS right after order confirmation. You can also view it in
                your Marvelam account under Order History.
              </p>
            </div>

            <div
              className={`rounded-xl border p-5 ${
                isDark ? "border-white/10 bg-[#161616]" : "border-[#EAE6DF] bg-white"
              }`}
            >
              <h4 className="font-sans text-sm font-semibold text-[#FFB400]">
                What if I am unavailable for delivery?
              </h4>
              <p className={`mt-2 font-sans text-xs leading-relaxed ${isDark ? "text-white/60" : "text-[#5A5247]"}`}>
                Our courier will attempt contact up to three times. You can also reach our dispatch desk to arrange for a
                neighbor or receptionist handover.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
