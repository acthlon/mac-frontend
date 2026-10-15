export default function formatNaira(amount) {
  if (amount === null || amount === undefined || amount === "") {
    return "\u20A60.00";
  }
  const num = typeof amount === "number" ? amount : parseFloat(amount);
  if (isNaN(num)) {
    return "\u20A60.00";
  }
  return `\u20A6${num.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
