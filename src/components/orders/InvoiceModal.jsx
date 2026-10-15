import React, { useState } from "react";
import { createPortal } from "react-dom";
import { X, Printer, Download, CheckCircle2, Loader2 } from "lucide-react";
import formatNaira from "../../utils/formatNaira";
import { generateInvoicePDF } from "../../utils/generateInvoicePDF";

function formatInvoiceDate(dateStr) {
  if (!dateStr) {
    return new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
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

export default function InvoiceModal({ order, isOpen, onClose }) {
  if (!isOpen || !order) return null;

  const [downloading, setDownloading] = useState(false);

  const displayOrderNumber =
    order.order_number || (order.id ? String(order.id) : "N/A");
  const invoiceNumber = `INV-${displayOrderNumber.replace(/^#/, "")}`;

  const address = order.shipping_address_snapshot || {};
  const items = order.orderitems || [];

  const subtotal =
    parseFloat(order.sub_total_amount) ||
    items.reduce((sum, i) => {
      const itemPrice =
        parseFloat(i.total_amount) ||
        (parseFloat(i.unit_price) || 0) * (Number(i.quantity) || 1);
      return sum + itemPrice;
    }, 0);

  const shippingFee = parseFloat(order.shipping_fee) || 0;
  const discount = parseFloat(order.total_discount) || 0;
  const grandTotal =
    parseFloat(order.total_amount) ||
    parseFloat(order.total_price) ||
    subtotal + shippingFee - discount;

  const userEmail =
    order.customer_email ||
    order.email ||
    localStorage.getItem("mac_user_email") ||
    "customer@marvelam.com";

  const customerName =
    order.customer_name ||
    (address.first_name || address.last_name
      ? `${address.first_name || ""} ${address.last_name || ""}`.trim()
      : "Marvelam Valued Client");

  // Fast direct 1-click PDF download
  const handleDirectDownload = () => {
    try {
      setDownloading(true);
      generateInvoicePDF(order);
    } catch (err) {
      console.error("Direct PDF download error, falling back to print:", err);
      handlePrint();
    } finally {
      setTimeout(() => setDownloading(false), 500);
    }
  };

  // Instant 1-page print preview (opens in clean isolated window so preview loads in 0.1s and is strictly 1 page)
  const handlePrint = () => {
    const invoiceEl = document.getElementById("marvelam-invoice-printable");
    if (!invoiceEl) {
      window.print();
      return;
    }

    const printWin = window.open("", "_blank", "width=850,height=900");
    if (!printWin) {
      window.print();
      return;
    }

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${displayOrderNumber}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet">
          <style>
            @page {
              size: A4 portrait;
              margin: 10mm 14mm;
            }
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            body {
              font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              color: #141414;
              background: #ffffff;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .font-display { font-family: 'Cormorant Garamond', Georgia, serif; }
            .font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
            .invoice-no-print { display: none !important; }
            table { width: 100%; border-collapse: collapse; }
          </style>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-white text-[#141414] p-4">
          ${invoiceEl.outerHTML}
          <script>
            window.onload = function() {
              window.focus();
              setTimeout(function() {
                window.print();
                window.onafterprint = function() { window.close(); };
              }, 150);
            };
          <\/script>
        </body>
      </html>
    `);
    printWin.document.close();
  };

  const modalContent = (
    <div
      id="marvelam-invoice-modal-wrapper"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
    >
      {/* Strict 1-Page Print Engine CSS for fallback window.print() */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm 12mm;
          }
          html, body {
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            overflow: hidden !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #root {
            display: none !important;
          }
          #marvelam-invoice-modal-wrapper {
            position: static !important;
            inset: auto !important;
            background: #ffffff !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            height: auto !important;
            display: block !important;
            overflow: visible !important;
          }
          #marvelam-invoice-dialog {
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            max-width: 100% !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            page-break-after: avoid !important;
            break-after: avoid !important;
          }
          #marvelam-invoice-printable {
            padding: 4mm 6mm !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            page-break-after: avoid !important;
            break-after: avoid !important;
          }
          .invoice-no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Modal Dialog Container */}
      <div
        id="marvelam-invoice-dialog"
        className="relative w-full max-w-3xl my-auto rounded-2xl shadow-2xl overflow-hidden bg-white text-neutral-900 border border-neutral-200 flex flex-col max-h-[92vh] sm:max-h-[94vh]"
      >
        {/* On-Screen Top Toolbar (Hidden in Print) */}
        <div className="invoice-no-print shrink-0 flex items-center justify-between px-6 py-3.5 bg-[#0F0F0F] text-white border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-[#FFB400]" />
            <span className="font-sans text-xs uppercase tracking-wider font-semibold text-neutral-300">
              Tax Invoice & Receipt
            </span>
            <span className="hidden sm:inline text-neutral-500 text-xs">&middot;</span>
            <span className="hidden sm:inline font-mono text-xs text-[#FFB400]">
              {invoiceNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDirectDownload}
              disabled={downloading}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#FFB400] px-4 py-1.5 font-sans text-xs font-semibold text-[#0F0F0F] transition-all hover:bg-[#e09e00] hover:scale-105 shadow-sm cursor-pointer disabled:opacity-60"
            >
              {downloading ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
              Download Directly
            </button>
            <button
              type="button"
              onClick={handlePrint}
              title="Print"
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-1.5 font-sans text-xs font-semibold text-neutral-300 transition-all hover:bg-neutral-700 hover:text-white cursor-pointer"
            >
              <Printer size={13} /> Print
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close invoice"
              className="rounded-lg p-1.5 text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable document viewport on screen */}
        <div className="overflow-y-auto">
          {/* Printable Invoice Document Body - EXACT First Design */}
          <div
            id="marvelam-invoice-printable"
            className="p-8 sm:p-10 bg-white font-sans text-[#141414] leading-normal"
          >
            {/* Header & Logo Section */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 pb-6 border-b border-neutral-200">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="font-display text-2xl sm:text-3xl font-bold tracking-[0.2em] text-[#0F0F0F]">
                    MARVELAM
                  </span>
                  <span className="text-[10px] font-sans font-semibold uppercase tracking-widest px-2.5 py-0.5 rounded border border-[#FFB400] text-[#9E6E00] bg-white">
                    BESPOKE
                  </span>
                </div>
                <p className="mt-1 font-sans text-xs text-neutral-600">
                  Luxury Apparel & Fine Tailoring
                </p>
                <p className="mt-0.5 font-sans text-[11px] text-neutral-400">
                  Lagos, Nigeria &middot; support@marvelam.com &middot; www.marvelam.com
                </p>
              </div>

              <div className="text-left sm:text-right">
                <h1 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-wider text-neutral-900">
                  INVOICE
                </h1>
                <p className="font-mono text-xs font-semibold text-neutral-600 mt-0.5">
                  {invoiceNumber}
                </p>
                <div className="mt-2 text-xs text-neutral-500 space-y-0.5">
                  <p>
                    Date Issued:{" "}
                    <strong className="text-neutral-800 font-medium">
                      {formatInvoiceDate(order.ordered_day)}
                    </strong>
                  </p>
                  {order.delivered_day && (
                    <p>
                      Delivered:{" "}
                      <strong className="text-neutral-800 font-medium">
                        {formatInvoiceDate(order.delivered_day)}
                      </strong>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Customer & Order Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-neutral-200 text-xs">
              {/* Billed & Shipped To */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  BILLED & SHIPPED TO
                </p>
                <p className="font-bold text-neutral-900 text-sm">
                  {customerName}
                </p>
                <p className="text-neutral-600 mt-0.5">{userEmail}</p>
                {address.delivery_address && (
                  <p className="text-neutral-600 mt-1 leading-relaxed">
                    {address.delivery_address}
                    <br />
                    {address.city ? `${address.city}, ` : ""}
                    {address.state || "Nigeria"}
                  </p>
                )}
                {address.phone_number && (
                  <p className="text-neutral-500 mt-1">Tel: {address.phone_number}</p>
                )}
              </div>

              {/* Order & Payment Info */}
              <div className="sm:text-right space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  ORDER & PAYMENT INFO
                </p>
                <p className="text-neutral-600">
                  Order Reference:{" "}
                  <strong className="font-['Montserrat',sans-serif] font-bold text-neutral-900">
                    #{displayOrderNumber}
                  </strong>
                </p>
                <p className="text-neutral-600">
                  Payment Status:{" "}
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 border border-emerald-300 bg-white px-2 py-0.5 rounded text-[11px]">
                    <CheckCircle2 size={11} />{" "}
                    {String(order.payment_status || "SUCCESSFUL").toUpperCase()}
                  </span>
                </p>
                <p className="text-neutral-600">
                  Payment Method:{" "}
                  <span className="font-medium text-neutral-800">
                    {String(order.payment_method_name || "PAYSTACK").toUpperCase()}
                  </span>
                </p>
                {order.payment_reference && (
                  <p className="text-neutral-600 font-mono text-[11px]">
                    Ref : {order.payment_reference}
                  </p>
                )}
                {order.tracking_id && (
                  <p className="text-neutral-600">
                    Tracking ID:{" "}
                    <span className="font-mono font-semibold text-neutral-900">
                      {order.tracking_id}
                    </span>
                  </p>
                )}
              </div>
            </div>

            {/* Itemized Table */}
            <div className="mt-6">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-neutral-900 text-[11px] uppercase tracking-wider font-bold text-neutral-700">
                    <th className="py-2.5 pr-2 w-8 text-neutral-400">#</th>
                    <th className="py-2.5 px-2">ITEM DESCRIPTION</th>
                    <th className="py-2.5 px-2 text-center w-16">QTY</th>
                    <th className="py-2.5 px-2 text-right w-28">UNIT PRICE</th>
                    <th className="py-2.5 pl-2 text-right w-28">AMOUNT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-neutral-400">
                        No order items recorded.
                      </td>
                    </tr>
                  ) : (
                    items.map((item, idx) => {
                      const qty = Number(item.quantity) || 1;
                      const uPrice =
                        parseFloat(item.unit_price) ||
                        (parseFloat(item.total_amount)
                          ? parseFloat(item.total_amount) / qty
                          : 0);
                      const rowTotal =
                        parseFloat(item.total_amount) || uPrice * qty;

                      return (
                        <tr key={item.id || idx} className="hover:bg-neutral-50/50">
                          <td className="py-3 pr-2 text-neutral-400 font-mono">
                            {idx + 1}
                          </td>
                          <td className="py-3 px-2">
                            <p className="font-semibold text-neutral-900">
                              {item.name || "Traditional Maxi Dress"}
                            </p>
                            {(item.fabric || item.color || item.size) && (
                              <p className="text-[11px] text-neutral-500 mt-0.5">
                                {[item.color, item.size, item.fabric]
                                  .filter(Boolean)
                                  .join(" &middot; ")}
                              </p>
                            )}
                          </td>
                          <td className="py-3 px-2 text-center font-medium text-neutral-800">
                            {qty}
                          </td>
                          <td className="py-3 px-2 text-right text-neutral-700 font-mono">
                            {formatNaira(uPrice)}
                          </td>
                          <td className="py-3 pl-2 text-right font-semibold text-neutral-900 font-mono">
                            {formatNaira(rowTotal)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Financial Calculation Breakdown */}
            <div className="mt-6 flex justify-end">
              <div className="w-full sm:w-72 space-y-2 text-xs border-t border-neutral-200 pt-4">
                <div className="flex justify-between text-neutral-600">
                  <span>Items Subtotal</span>
                  <span className="font-mono text-neutral-900 font-medium">
                    {formatNaira(subtotal)}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-neutral-600">
                    <span>Discount</span>
                    <span className="font-mono text-emerald-700 font-medium">
                      -{formatNaira(discount)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-neutral-600">
                  <span>Shipping & Delivery</span>
                  <span className="font-mono text-neutral-900 font-medium">
                    {shippingFee === 0 ? "Free" : formatNaira(shippingFee)}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t-2 border-neutral-900 pt-3 text-sm">
                  <span className="font-['Montserrat',sans-serif] font-bold text-neutral-900 uppercase tracking-wide">
                    TOTAL AMOUNT
                  </span>
                  <span className="font-['Montserrat',sans-serif] text-xl font-bold text-neutral-900 font-mono">
                    {formatNaira(grandTotal)}
                  </span>
                </div>
              </div>
            </div>

            {/* Official Footer / Disclaimer */}
            <div className="mt-10 border-t border-neutral-200 pt-6 text-[11px] text-neutral-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-medium text-neutral-700">
                  Thank you for choosing Marvelam Bespoke.
                </p>
                <p className="mt-0.5 text-neutral-400">
                  For customer support, tailoring inquiries, or return requests, reach out at support@marvelam.com.
                </p>
              </div>

              <div className="text-right sm:shrink-0">
                <span className="inline-block px-3 py-1 rounded border border-neutral-300 font-mono text-[10px] uppercase tracking-wider text-neutral-600 bg-white">
                  AUTHORIZED ELECTRONIC RECEIPT
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions Bar (Hidden in Print) */}
        <div className="invoice-no-print shrink-0 flex items-center justify-between px-6 py-3.5 bg-neutral-50 border-t border-neutral-200">
          <p className="text-xs text-neutral-500 hidden sm:block">
            Strictly 1-page A4 format. Click <strong>&quot;Download Directly&quot;</strong> for instant PDF save.
          </p>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-neutral-300 px-4 py-2 font-sans text-xs font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3.5 py-2 font-sans text-xs font-semibold text-neutral-800 hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <Printer size={13} /> Print
            </button>
            <button
              type="button"
              onClick={handleDirectDownload}
              disabled={downloading}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#FFB400] px-5 py-2 font-sans text-xs font-semibold text-[#0F0F0F] hover:bg-[#e09e00] transition-all shadow-sm cursor-pointer disabled:opacity-60"
            >
              {downloading ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
              Download Directly
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
