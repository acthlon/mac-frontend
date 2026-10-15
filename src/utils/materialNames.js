const MATERIAL_NAME_MAP = {
  ANK: "Ankara",
  SLK: "Silk",
  LAC: "Lace",
  CHF: "Chiffon",
  COT: "Cotton",
  LIN: "Linen",
  JCQ: "Jacquard",
  VLV: "Velvet",
  BRC: "Brocade",
  ADR: "Adire",
  KMP: "Kampala",
  ASO: "Aso Oke",
  GRG: "Georgette",
  AOC: "Organza Crepe",
  SEN: "Senator Fabric",
};

export function formatMaterialName(code) {
  if (!code) return "";
  const upper = String(code).toUpperCase().trim();
  return MATERIAL_NAME_MAP[upper] || code;
}

export default formatMaterialName;
