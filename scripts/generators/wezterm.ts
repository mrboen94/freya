import type { ThemeMode } from "../schema.js";

export function generateWezTermTheme(mode: ThemeMode, themeName: string): string {
  const terminal = mode.terminal;
  const colors = [
    `[metadata]`,
    `name = "${themeName}"`,
    ``,
    `[colors]`,
    `foreground = "${terminal.foreground ?? terminal.ansi.normal[7] ?? "#d7e6ed"}"`,
    `background = "${terminal.background ?? terminal.ansi.normal[0] ?? "#0b2530"}"`,
    `cursor_bg = "${terminal.cursor_bg ?? terminal.foreground ?? "#a7e3ff"}"`,
    `cursor_fg = "${terminal.cursor_fg ?? terminal.background ?? "#0b2530"}"`,
    `cursor_border = "${terminal.cursor_border ?? terminal.cursor_bg ?? "#a7e3ff"}"`,
    `selection_bg = "${terminal.selection_bg ?? "#1a3a49"}"`,
    `selection_fg = "${terminal.selection_fg ?? terminal.foreground ?? "#d7e6ed"}"`,
    ``,
    `ansi = [`,
    ...terminal.ansi.normal.map((c) => `  "${c}",`),
    `]`,
    ``,
    `brights = [`,
    ...terminal.ansi.bright.map((c) => `  "${c}",`),
    `]`,
  ];

  return colors.join("\n") + "\n";
}
