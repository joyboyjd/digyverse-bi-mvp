// Shared data-parsing helpers for the ingested Excel/CSV sheet.
// The numeric coercion here runs during the mapping phase (right after
// XLSX.sheet_to_json) so every downstream consumer — Overview charts and
// Custom KPIs — reads clean JS `number` values instead of raw cell strings.

/** Columns that must always be treated as numeric across the app. */
export const NUMERIC_COLUMNS = [
  // Revenue
  "Pharmacy_Revenue",
  "Lab_Revenue",
  "Procedure_Revenue",
  "Revenue_Consultation",
  "Billing_Amount_INR",
  // TAT (turnaround time)
  "Discharge_TAT_Mins",
  // Stay Days
  "Length_Of_Stay_Days",
  // Wait Times
  "OPD_Wait_Time_Mins",
] as const;

export type NumericColumn = (typeof NUMERIC_COLUMNS)[number];

/** A single parsed sheet row. Keys are dynamic, values may be anything. */
export type SheetRow = Record<string, unknown>;

// Tokens that represent an empty/absent cell and must NOT become NaN.
const BLANK_TOKENS = new Set(["", "nan", "n/a", "na", "null", "undefined", "-"]);

/**
 * Strictly convert a raw cell value into a JS `number`.
 * Blank / missing / non-numeric cells fall back to `fallback` (default 0)
 * rather than producing `NaN` or the string "nan".
 */
export function toNumber(value: unknown, fallback = 0): number {
  if (value === null || value === undefined) return fallback;

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : fallback;
  }

  const str = String(value).trim();
  if (BLANK_TOKENS.has(str.toLowerCase())) return fallback;

  // Strip currency symbols, thousands separators and stray spaces before parsing.
  const cleaned = str.replace(/[₹$,\s]/g, "");
  const parsed = parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : fallback;
}

/**
 * Like {@link toNumber} but returns `null` for blank/missing/non-numeric cells.
 * Use this at the mapping phase so empty cells are preserved as `null`
 * (never `NaN`) and can be rendered gracefully as "N/A".
 */
export function toNullableNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  const str = String(value).trim();
  if (BLANK_TOKENS.has(str.toLowerCase())) return null;

  const cleaned = str.replace(/[₹$,\s]/g, "");
  const parsed = parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

/** Human-friendly display for a possibly-null numeric cell. */
export function formatNumericCell(
  value: number | null,
  fallback = "N/A"
): string {
  return value === null ? fallback : value.toLocaleString("en-IN");
}

/**
 * Normalize the raw `sheet_to_json` output: coerce every known numeric column
 * to a `number | null`. Non-numeric columns are passed through untouched.
 */
export function normalizeSheetData(rows: SheetRow[]): SheetRow[] {
  if (!Array.isArray(rows)) return [];
  return rows.map((row) => {
    const normalized: SheetRow = { ...row };
    for (const col of NUMERIC_COLUMNS) {
      if (col in normalized) {
        normalized[col] = toNullableNumber(normalized[col]);
      }
    }
    return normalized;
  });
}

// --- Recharts data-shape interfaces -----------------------------------------
// These give the chart `data` arrays real types (instead of `any[]` / `as any`)
// so Recharts renders cleanly and dataKey typos surface at compile time.

/** Overview "Volume Intake" area chart. Static + dynamic keys are optional. */
export interface TimelineDatum {
  name: string;
  // Dynamic (from uploaded sheet)
  TotalVolume?: number;
  CampaignAcquired?: number;
  // Static healthcare fallback
  OPD?: number;
  Referrals?: number;
  // Static retail fallback
  Orders?: number;
  Direct?: number;
}

/** Overview "Revenue by Channel / ROI" bar chart. */
export interface ChannelYieldDatum {
  name: string;
  dynamicValue?: number;
  roi?: number;
}

/** Custom KPI builder bar chart. */
export interface CustomKpiDatum {
  name: string;
  value: number;
}

/**
 * The value type Recharts hands to Tooltip/tick `formatter` callbacks
 * (mirrors Recharts' internal `ValueType | undefined`). Typing the
 * callback parameter with this avoids `any` while staying assignable.
 */
export type RechartsFormatterValue =
  | number
  | string
  | ReadonlyArray<number | string>
  | undefined;
