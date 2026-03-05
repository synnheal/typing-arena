export interface KeyPosition {
  row: number;
  col: number;
  width?: number;
}

export interface KeyLayout {
  name: string;
  rows: string[][];
}

export const QWERTY: KeyLayout = {
  name: "QWERTY",
  rows: [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["z", "x", "c", "v", "b", "n", "m"],
  ],
};

export const AZERTY: KeyLayout = {
  name: "AZERTY",
  rows: [
    ["a", "z", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["q", "s", "d", "f", "g", "h", "j", "k", "l", "m"],
    ["w", "x", "c", "v", "b", "n"],
  ],
};

export type LayoutName = "QWERTY" | "AZERTY";

export function getLayout(name: LayoutName): KeyLayout {
  return name === "AZERTY" ? AZERTY : QWERTY;
}

export function getKeyPosition(layout: KeyLayout, key: string): KeyPosition | null {
  const lower = key.toLowerCase();
  for (let row = 0; row < layout.rows.length; row++) {
    const col = layout.rows[row].indexOf(lower);
    if (col !== -1) return { row, col };
  }
  return null;
}

export const ALL_LETTERS = "abcdefghijklmnopqrstuvwxyz".split("");
