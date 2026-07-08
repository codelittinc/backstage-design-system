/**
 * Deterministic categorical color tokens. Colors are never stored or sent
 * over the wire — they are derived from a numeric id at render time.
 * All palette colors have ≥4.5:1 contrast with white text.
 */

export const CATEGORICAL_PALETTE: readonly string[] = [
  "#2563eb", // blue-600
  "#0f766e", // teal-700
  "#7c3aed", // violet-600
  "#e11d48", // rose-600
  "#b45309", // amber-700
  "#047857", // emerald-700
  "#4f46e5", // indigo-600
  "#a21caf", // fuchsia-700
  "#c2410c", // orange-700
  "#0369a1", // sky-700
  "#0e7490", // cyan-700
];

/** Neutral color when an item has no category (slate-500). */
export const NEUTRAL_CATEGORICAL_COLOR = "#64748b";

/** Color of the capped "+N more" overflow segment (slate-700). */
export const OVERFLOW_SEGMENT_COLOR = "#334155";

/** Maximum number of color segments rendered on a SegmentedChip. */
export const MAX_CHIP_SEGMENTS = 4;

/** Deterministic palette color for a non-negative integer id (safe modulo, handles any int). */
export function getCategoricalColor(id: number): string {
  const len = CATEGORICAL_PALETTE.length;
  const index = ((id % len) + len) % len;
  return CATEGORICAL_PALETTE[index];
}

export interface CategoricalSegment {
  color: string;
  /** Present only on the capped overflow segment: how many ids it stands for. */
  overflowCount?: number;
}

/**
 * Equal-width color segments for a SegmentedChip from PRE-ORDERED ids.
 * - 0 ids → single neutral segment
 * - 1..MAX_CHIP_SEGMENTS ids → one segment per id
 * - more → first MAX_CHIP_SEGMENTS − 1 + an overflow segment
 *   (OVERFLOW_SEGMENT_COLOR, overflowCount = rest)
 */
export function getCategoricalSegments(ids: number[]): CategoricalSegment[] {
  if (ids.length === 0) {
    return [{ color: NEUTRAL_CATEGORICAL_COLOR }];
  }
  if (ids.length <= MAX_CHIP_SEGMENTS) {
    return ids.map((id) => ({ color: getCategoricalColor(id) }));
  }
  const visible = ids.slice(0, MAX_CHIP_SEGMENTS - 1);
  return [
    ...visible.map((id) => ({ color: getCategoricalColor(id) })),
    { color: OVERFLOW_SEGMENT_COLOR, overflowCount: ids.length - visible.length },
  ];
}
