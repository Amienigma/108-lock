export const LAW =
  "108 Night is teal weather with a magenta pulse, analog grain, and one true object from the day — nothing added to win the picture.";

export const APP_NAME = "108 LOCK";

export type SubGrade = "DRIVE" | "CLOCK" | "QUIET" | "LAND";

export type SymbolId =
  | "none"
  | "fm"
  | "cattle"
  | "caliche"
  | "hail"
  | "pumpjack"
  | "mesquite"
  | "pear"
  | "tank"
  | "siren"
  | "stadium"
  | "brick";

export const SYMBOLS: { id: SymbolId; label: string }[] = [
  { id: "none", label: "NONE" },
  { id: "fm", label: "FM SHIELD" },
  { id: "cattle", label: "CATTLE GUARD" },
  { id: "caliche", label: "CALICHE" },
  { id: "hail", label: "HAIL BOX" },
  { id: "pumpjack", label: "PUMPJACK" },
  { id: "mesquite", label: "MESQUITE" },
  { id: "pear", label: "PEAR" },
  { id: "tank", label: "TANK+MILL" },
  { id: "siren", label: "SIREN HEAD" },
  { id: "stadium", label: "STADIUM" },
  { id: "brick", label: "BRICK" },
];

export const MAX_BYTES = 20 * 1024 * 1024;
export const THIN_PX = 640;
export const MAGENTA_KNIFE_CAP = 70;
export const SYMBOL_SCALE_MIN = 0.08;
export const SYMBOL_SCALE_MAX = 0.2;
export const SYMBOL_OPACITY_MIN = 10;
export const SYMBOL_OPACITY_MAX = 80;

export type GradeParams = {
  intensity: number;
  tealDepth: number;
  magentaKnife: number;
  grain: number;
  blacks: number;
  sub: SubGrade;
  invert810: boolean;
};

export const DEFAULT_GRADE: GradeParams = {
  intensity: 62,
  tealDepth: 58,
  magentaKnife: 36,
  grain: 25,
  blacks: 52,
  sub: "DRIVE",
  invert810: false,
};

export const NIGHT_INTENSITY = 38;
