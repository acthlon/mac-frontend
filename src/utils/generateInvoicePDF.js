import { jsPDF } from "jspdf";

function formatCurrency(amount) {
  const num = parseFloat(amount) || 0;
  return "NGN " + num.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDate(dateStr) {
  if (!dateStr) return new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
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

/**
 * Generates and immediately downloads an official 1-page A4 PDF invoice in < 100ms
 * perfectly matching the clean first design from the screenshot.
 */
export function generateInvoicePDF(order) {
  if (!order) return;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

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

  const pageWidth = 210;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // 1. Header (Left): MARVELAM + BESPOKE
  doc.setTextColor(15, 15, 15);
  doc.setFont("times", "bold");
  doc.setFontSize(22);
  doc.text("MARVELAM", margin, 20);

  // BESPOKE Gold Pill Box
  doc.setDrawColor(255, 180, 0); // Gold
  doc.setLineWidth(0.3);
  doc.roundedRect(margin + 52, 14.5, 20, 5.5, 1, 1, "D");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(158, 110, 0);
  doc.text("BESPOKE", margin + 62, 18.5, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(80, 80, 80);
  doc.text("Luxury Apparel & Fine Tailoring", margin, 26);

  doc.setFontSize(7.5);
  doc.setTextColor(115, 115, 115);
  doc.text("Lagos, Nigeria  ·  support@marvelam.com  ·  www.marvelam.com", margin, 31);

  // Header (Right): INVOICE
  doc.setTextColor(15, 15, 15);
  doc.setFont("times", "bold");
  doc.setFontSize(18);
  doc.text("INVOICE", pageWidth - margin, 18, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(30, 64, 175); // Dark blue link tone
  doc.text(invoiceNumber, pageWidth - margin, 23, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(70, 70, 70);
  doc.text(`Date Issued: ${formatDate(order.ordered_day)}`, pageWidth - margin, 28, { align: "right" });
  if (order.delivered_day) {
    doc.text(`Delivered: ${formatDate(order.delivered_day)}`, pageWidth - margin, 33, { align: "right" });
  }

  // Divider Line
  doc.setDrawColor(225, 225, 225);
  doc.setLineWidth(0.3);
  doc.line(margin, 38, pageWidth - margin, 38);

  // 2. Metadata Columns
  const infoY = 46;

  // Left: BILLED & SHIPPED TO
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(120, 120, 120);
  doc.text("BILLED & SHIPPED TO", margin, infoY);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 15, 15);
  doc.text(customerName, margin, infoY + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(80, 80, 80);
  doc.text(userEmail, margin, infoY + 11);

  if (address.delivery_address) {
    doc.text(address.delivery_address, margin, infoY + 16);
    doc.text(`${address.city ? address.city + ", " : ""}${address.state || "Nigeria"}`, margin, infoY + 20.5);
  }

  if (address.phone_number) {
    doc.text(`Tel: ${address.phone_number}`, margin, infoY + 25.5);
  }

  // Right: ORDER & PAYMENT INFO
  const rightColX = pageWidth - margin;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(120, 120, 120);
  doc.text("ORDER & PAYMENT INFO", rightColX, infoY, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(70, 70, 70);
  doc.text("Order Reference: ", rightColX - 35, infoY + 6, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 15, 15);
  doc.text(`#${displayOrderNumber}`, rightColX, infoY + 6, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setTextColor(70, 70, 70);
  doc.text("Payment Status:", rightColX - 32, infoY + 11.5, { align: "right" });

  // Green status pill
  doc.setDrawColor(52, 211, 153);
  doc.setLineWidth(0.3);
  doc.roundedRect(rightColX - 28, infoY + 8.2, 28, 4.5, 1, 1, "D");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(5, 150, 105);
  doc.text(String(order.payment_status || "SUCCESSFUL").toUpperCase(), rightColX - 14, infoY + 11.5, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(70, 70, 70);
  doc.text("Payment Method:", rightColX - 28, infoY + 17, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setTextColor(20, 20, 20);
  doc.text(String(order.payment_method_name || "PAYSTACK").toUpperCase(), rightColX, infoY + 17, { align: "right" });

  if (order.payment_reference) {
    doc.setTextColor(90, 90, 90);
    doc.text(`Ref : ${String(order.payment_reference)}`, rightColX, infoY + 22, { align: "right" });
  }

  if (order.tracking_id) {
    doc.setTextColor(90, 90, 90);
    doc.text("Tracking ID: ", rightColX - 28, infoY + 27, { align: "right" });
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 15, 15);
    doc.text(String(order.tracking_id), rightColX, infoY + 27, { align: "right" });
  }

  // 3. Itemized Table
  let tableY = 82;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(70, 70, 70);
  doc.text("#", margin, tableY);
  doc.text("ITEM DESCRIPTION", margin + 12, tableY);
  doc.text("QTY", margin + 105, tableY, { align: "center" });
  doc.text("UNIT PRICE", margin + 140, tableY, { align: "right" });
  doc.text("AMOUNT", margin + contentWidth, tableY, { align: "right" });

  // Black line under header
  doc.setDrawColor(20, 20, 20);
  doc.setLineWidth(0.6);
  doc.line(margin, tableY + 2.5, margin + contentWidth, tableY + 2.5);

  tableY += 8;

  items.slice(0, 8).forEach((item, idx) => {
    const qty = Number(item.quantity) || 1;
    const uPrice =
      parseFloat(item.unit_price) ||
      (parseFloat(item.total_amount) ? parseFloat(item.total_amount) / qty : 0);
    const rowTotal = parseFloat(item.total_amount) || uPrice * qty;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(70, 70, 70);
    doc.text(String(idx + 1), margin, tableY);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(20, 20, 20);
    doc.text(item.name || "Bespoke Apparel", margin + 12, tableY);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 30, 30);
    doc.text(String(qty), margin + 105, tableY, { align: "center" });

    doc.setTextColor(60, 60, 60);
    doc.text(formatCurrency(uPrice), margin + 140, tableY, { align: "right" });

    doc.setFont("helvetica", "bold");
    doc.setTextColor(20, 20, 20);
    doc.text(formatCurrency(rowTotal), margin + contentWidth, tableY, { align: "right" });

    // Subtle row line
    doc.setDrawColor(235, 235, 235);
    doc.setLineWidth(0.2);
    doc.line(margin, tableY + 3.5, margin + contentWidth, tableY + 3.5);

    tableY += 8.5;
  });

  // 4. Totals Breakdown
  const summaryY = Math.max(tableY + 8, 160);
  const totalBoxX = margin + contentWidth - 75;
  const totalBoxWidth = 75;

  doc.setDrawColor(225, 225, 225);
  doc.setLineWidth(0.3);
  doc.line(totalBoxX, summaryY - 2, margin + contentWidth, summaryY - 2);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(80, 80, 80);
  doc.text("Items Subtotal", totalBoxX, summaryY + 4);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(20, 20, 20);
  doc.text(formatCurrency(subtotal), margin + contentWidth, summaryY + 4, { align: "right" });

  if (discount > 0) {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    doc.text("Discount", totalBoxX, summaryY + 10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(5, 150, 105);
    doc.text(`-${formatCurrency(discount)}`, margin + contentWidth, summaryY + 10, { align: "right" });
  }

  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  doc.text("Shipping & Delivery", totalBoxX, summaryY + 16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(20, 20, 20);
  doc.text(shippingFee === 0 ? "Free" : formatCurrency(shippingFee), margin + contentWidth, summaryY + 16, { align: "right" });

  // Black solid line for Total Amount
  doc.setDrawColor(20, 20, 20);
  doc.setLineWidth(0.6);
  doc.line(totalBoxX, summaryY + 21, margin + contentWidth, summaryY + 21);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 15, 15);
  doc.text("TOTAL AMOUNT", totalBoxX, summaryY + 28);
  doc.setFontSize(12);
  doc.text(formatCurrency(grandTotal), margin + contentWidth, summaryY + 28, { align: "right" });

  // 5. Bottom Section
  const bottomY = 255;
  doc.setDrawColor(225, 225, 225);
  doc.setLineWidth(0.3);
  doc.line(margin, bottomY, margin + contentWidth, bottomY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(50, 50, 50);
  doc.text("Thank you for choosing Marvelam Bespoke.", margin, bottomY + 6);
  doc.setFontSize(7.5);
  doc.setTextColor(110, 110, 110);
  doc.text("For customer support, tailoring inquiries, or return requests, reach out at support@marvelam.com.", margin, bottomY + 10.5);

  // Authorized Electronic Receipt Box
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.roundedRect(pageWidth - margin - 56, bottomY + 4, 56, 7, 1, 1, "D");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(90, 90, 90);
  doc.text("AUTHORIZED ELECTRONIC RECEIPT", pageWidth - margin - 28, bottomY + 8.5, { align: "center" });

  // Save the PDF file directly
  const fileName = `MARVELAM_Invoice_${displayOrderNumber.replace(/[^a-zA-Z0-9-_]/g, "_")}.pdf`;
  doc.save(fileName);
}
