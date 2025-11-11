import type { ThemeDoc, ThemeMode } from "../schema.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ValueType = any; // Required for recursive structure resolution

export function resolveTheme(doc: ThemeDoc): ThemeDoc {
  const resolved: ThemeDoc = { ...doc, modes: {} };

  if (doc.modes.light) {
    resolved.modes.light = resolveMode(doc.modes.light);
  }
  if (doc.modes.dark) {
    resolved.modes.dark = resolveMode(doc.modes.dark);
  }

  return resolved;
}

function resolveMode(mode: ThemeMode): ThemeMode {
  const palette = mode.palette;
  const flatPalette = flattenPalette(palette);

  return {
    palette: mode.palette,
    workbench: resolveObject(mode.workbench, flatPalette) as Record<string, string>,
    terminal: resolveObject(mode.terminal, flatPalette) as typeof mode.terminal,
    tokens: {
      textMate: mode.tokens.textMate.map((token) => ({
        ...token,
        settings: resolveObject(token.settings, flatPalette) as typeof token.settings,
      })),
      semantic: resolveObject(mode.tokens.semantic, flatPalette) as typeof mode.tokens.semantic,
    },
    targets: mode.targets
      ? (resolveObject(mode.targets, flatPalette) as typeof mode.targets)
      : undefined,
  };
}

function flattenPalette(palette: Record<string, Record<string, string>>): Record<string, string> {
  const flat: Record<string, string> = {};
  for (const [category, colors] of Object.entries(palette)) {
    for (const [key, value] of Object.entries(colors)) {
      flat[`palette.${category}.${key}`] = value;
    }
  }
  return flat;
}

function resolveObject(obj: ValueType, palette: Record<string, string>): ValueType {
  if (typeof obj === "string") {
    return resolveColorRef(obj, palette);
  }
  if (Array.isArray(obj)) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return obj.map((item) => resolveObject(item, palette));
  }
  if (obj !== null && typeof obj === "object") {
    const resolved: Record<string, ValueType> = {};
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    for (const [key, value] of Object.entries(obj)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      resolved[key] = resolveObject(value, palette);
    }
    return resolved;
  }
  return obj;
}

function resolveColorRef(value: string, palette: Record<string, string>): string {
  const match = /^\{([\w.]+)\}$/.exec(value);
  if (!match) {
    return value;
  }
  const ref = match[1];
  if (!ref) {
    throw new Error(`Invalid color reference: ${value}`);
  }
  const resolved = palette[ref];
  if (resolved === undefined) {
    throw new Error(`Undefined color reference: {${ref}}`);
  }
  return resolved;
}
