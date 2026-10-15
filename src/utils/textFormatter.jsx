export default function toTitleCase(str) {
  if (!str) return "";
  return str
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
