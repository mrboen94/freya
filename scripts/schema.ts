import { z } from "zod";

const HexColorSchema = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/, "Invalid hex color format");

const ColorOrRefSchema = z.union([
  HexColorSchema,
  z.string().regex(/^\{[\w.]+\}$/, "Invalid color reference format"),
]);

const TokenSettingsSchema = z.object({
  foreground: ColorOrRefSchema.optional(),
  background: ColorOrRefSchema.optional(),
  fontStyle: z.string().optional(),
});

const TextMateTokenSchema = z.object({
  name: z.string(),
  scope: z.union([z.string(), z.array(z.string())]),
  settings: TokenSettingsSchema,
});

const SemanticTokenSchema = z.record(z.string(), TokenSettingsSchema);

const AnsiColorsSchema = z.object({
  normal: z.array(HexColorSchema).length(8),
  bright: z.array(HexColorSchema).length(8),
});

const TerminalColorsSchema = z.object({
  ansi: AnsiColorsSchema,
  cursor_bg: ColorOrRefSchema.optional(),
  cursor_fg: ColorOrRefSchema.optional(),
  cursor_border: ColorOrRefSchema.optional(),
  selection_bg: ColorOrRefSchema.optional(),
  selection_fg: ColorOrRefSchema.optional(),
  foreground: ColorOrRefSchema.optional(),
  background: ColorOrRefSchema.optional(),
});

const NeovimHighlightSchema = z.object({
  fg: ColorOrRefSchema.optional(),
  bg: ColorOrRefSchema.optional(),
  sp: ColorOrRefSchema.optional(),
  bold: z.boolean().optional(),
  italic: z.boolean().optional(),
  underline: z.boolean().optional(),
  undercurl: z.boolean().optional(),
  strikethrough: z.boolean().optional(),
});

const TargetsSchema = z.object({
  vscode: z.record(z.string(), z.unknown()).optional(),
  wezterm: z.record(z.string(), z.unknown()).optional(),
  neovim: z
    .object({
      highlights: z.record(z.string(), NeovimHighlightSchema).optional(),
    })
    .optional(),
});

const ThemeModeSchema = z.object({
  palette: z.record(z.string(), z.record(z.string(), z.string())),
  workbench: z.record(z.string(), ColorOrRefSchema),
  terminal: TerminalColorsSchema,
  tokens: z.object({
    textMate: z.array(TextMateTokenSchema),
    semantic: SemanticTokenSchema,
  }),
  targets: TargetsSchema.optional(),
});

export const ThemeDocSchema = z.object({
  version: z.number(),
  name: z.string(),
  meta: z
    .object({
      author: z.string().optional(),
      license: z.string().optional(),
      description: z.string().optional(),
    })
    .optional(),
  modes: z.object({
    light: ThemeModeSchema.optional(),
    dark: ThemeModeSchema.optional(),
  }),
});

export type ThemeDoc = z.infer<typeof ThemeDocSchema>;
export type ThemeMode = z.infer<typeof ThemeModeSchema>;
export type TextMateToken = z.infer<typeof TextMateTokenSchema>;
export type TokenSettings = z.infer<typeof TokenSettingsSchema>;
export type NeovimHighlight = z.infer<typeof NeovimHighlightSchema>;
