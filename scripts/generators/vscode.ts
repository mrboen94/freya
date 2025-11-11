import type { ThemeMode } from "../schema.js";

interface VSCodeTheme {
  $schema?: string;
  name: string;
  type: "light" | "dark";
  semanticHighlighting: boolean;
  semanticTokenColors: Record<string, { foreground?: string; fontStyle?: string }>;
  tokenColors: Array<{
    name: string;
    scope: string | string[];
    settings: {
      foreground?: string;
      background?: string;
      fontStyle?: string;
    };
  }>;
  colors: Record<string, string>;
}

export function generateVSCodeTheme(
  mode: ThemeMode,
  themeName: string,
  themeType: "light" | "dark"
): VSCodeTheme {
  return {
    $schema: "vscode://schemas/color-theme",
    name: themeName,
    type: themeType,
    semanticHighlighting: true,
    semanticTokenColors: mode.tokens.semantic,
    tokenColors: mode.tokens.textMate,
    colors: mode.workbench,
  };
}
