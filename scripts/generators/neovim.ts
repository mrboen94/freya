import type { ThemeMode, NeovimHighlight } from "../schema.js";

interface NeovimFiles {
  colorscheme: string;
  palette: string;
  highlights: string;
  init: string;
}

export function generateNeovimTheme(
  mode: ThemeMode,
  modeName: "light" | "dark",
  themeName: string
): NeovimFiles {
  const paletteColors = extractPaletteForNvim(mode);
  const terminal = mode.terminal;
  const customHighlights = mode.targets?.neovim?.highlights ?? {};

  const colorscheme = generateColorschemeFile(themeName, modeName);
  const palette = generatePaletteFile(paletteColors, terminal);
  const highlights = generateHighlightsFile(paletteColors, customHighlights);
  const init = generateInitFile();

  return { colorscheme, palette, highlights, init };
}

function extractPaletteForNvim(mode: ThemeMode): Record<string, string> {
  const flat: Record<string, string> = {};
  for (const [category, colors] of Object.entries(mode.palette)) {
    for (const [key, value] of Object.entries(colors)) {
      flat[`${category}_${key}`] = value;
    }
  }
  return flat;
}

function generateColorschemeFile(themeName: string, modeName: "light" | "dark"): string {
  return `vim.cmd("hi clear")
if vim.fn.exists("syntax_on") then
  vim.cmd("syntax reset")
end

vim.o.background = "${modeName}"
vim.g.colors_name = "${themeName}-${modeName}"

local palette = require("freya.palette").${modeName}
local highlights = require("freya.highlights").get(palette)

for group, attrs in pairs(highlights) do
  vim.api.nvim_set_hl(0, group, attrs)
end

vim.g.terminal_color_0 = palette.terminal_ansi_0
vim.g.terminal_color_1 = palette.terminal_ansi_1
vim.g.terminal_color_2 = palette.terminal_ansi_2
vim.g.terminal_color_3 = palette.terminal_ansi_3
vim.g.terminal_color_4 = palette.terminal_ansi_4
vim.g.terminal_color_5 = palette.terminal_ansi_5
vim.g.terminal_color_6 = palette.terminal_ansi_6
vim.g.terminal_color_7 = palette.terminal_ansi_7
vim.g.terminal_color_8 = palette.terminal_ansi_bright_0
vim.g.terminal_color_9 = palette.terminal_ansi_bright_1
vim.g.terminal_color_10 = palette.terminal_ansi_bright_2
vim.g.terminal_color_11 = palette.terminal_ansi_bright_3
vim.g.terminal_color_12 = palette.terminal_ansi_bright_4
vim.g.terminal_color_13 = palette.terminal_ansi_bright_5
vim.g.terminal_color_14 = palette.terminal_ansi_bright_6
vim.g.terminal_color_15 = palette.terminal_ansi_bright_7
`;
}

function generatePaletteFile(
  paletteColors: Record<string, string>,
  terminal: ThemeMode["terminal"]
): string {
  const entries = Object.entries(paletteColors)
    .map(([key, value]) => `  ${key} = "${value}",`)
    .join("\n");

  const ansiNormal = terminal.ansi.normal
    .map((c, i) => `  terminal_ansi_${String(i)} = "${c}",`)
    .join("\n");
  const ansiBright = terminal.ansi.bright
    .map((c, i) => `  terminal_ansi_bright_${String(i)} = "${c}",`)
    .join("\n");

  return `return {
  light = {
${entries}
${ansiNormal}
${ansiBright}
  },
  dark = {
${entries}
${ansiNormal}
${ansiBright}
  },
}
`;
}

function generateHighlightsFile(
  palette: Record<string, string>,
  custom: Record<string, NeovimHighlight>
): string {
  return `local M = {}

function M.get(p)
  return vim.tbl_extend("force", {
    Normal = { fg = p.base_fg or "#d7e6ed", bg = p.base_bg or "#0b2530" },
    Comment = { fg = p.gray_500 or "#6b8591", italic = true },
    Constant = { fg = p.accent_primary or "#ffbe7d" },
    String = { fg = p.accent_secondary or "#a8e5c8" },
    Character = { fg = p.accent_secondary or "#a8e5c8" },
    Number = { fg = p.accent_primary or "#ffbe7d" },
    Boolean = { fg = p.accent_primary or "#ffbe7d", italic = true },
    Float = { fg = p.accent_primary or "#ffbe7d" },
    Identifier = { fg = p.base_fg or "#e3f1f7" },
    Function = { fg = p.function_fg or "#8fd3ff", bold = true },
    Statement = { fg = p.keyword_fg or "#7fb7ff", bold = true },
    Conditional = { fg = p.keyword_fg or "#7fb7ff", bold = true },
    Repeat = { fg = p.keyword_fg or "#7fb7ff", bold = true },
    Label = { fg = p.keyword_fg or "#7fb7ff" },
    Operator = { fg = p.operator_fg or "#93bac8" },
    Keyword = { fg = p.keyword_fg or "#7fb7ff", bold = true },
    Exception = { fg = p.keyword_fg or "#7fb7ff", bold = true },
    PreProc = { fg = p.accent_primary or "#b9cfff" },
    Include = { fg = p.keyword_fg or "#7fb7ff", bold = true },
    Define = { fg = p.accent_primary or "#b9cfff" },
    Macro = { fg = p.accent_primary or "#b9cfff" },
    PreCondit = { fg = p.accent_primary or "#b9cfff" },
    Type = { fg = p.type_fg or "#b9cfff", bold = true },
    StorageClass = { fg = p.keyword_fg or "#7fb7ff" },
    Structure = { fg = p.type_fg or "#b9cfff" },
    Typedef = { fg = p.type_fg or "#b9cfff" },
    Special = { fg = p.accent_primary or "#8ae7de" },
    SpecialChar = { fg = p.accent_primary or "#8ae7de" },
    Tag = { fg = p.function_fg or "#8fd3ff", bold = true },
    Delimiter = { fg = p.operator_fg or "#93bac8" },
    SpecialComment = { fg = p.gray_500 or "#6b8591", italic = true },
    Debug = { fg = p.error_fg or "#ff7a90" },
    Underlined = { underline = true },
    Ignore = { fg = p.gray_300 or "#6b8591" },
    Error = { fg = p.error_fg or "#ff7a90" },
    Todo = { fg = p.warning_fg or "#f7c56a", bold = true },
    CursorLine = { bg = p.cursor_line_bg or "#0f2b39" },
    CursorColumn = { bg = p.cursor_line_bg or "#0f2b39" },
    LineNr = { fg = p.line_number_fg or "#496879" },
    CursorLineNr = { fg = p.line_number_active_fg or "#a6c4d0", bold = true },
    Visual = { bg = p.selection_bg or "#1a3a49" },
    VisualNOS = { bg = p.selection_bg or "#163240" },
    Search = { bg = p.search_bg or "#59b5ff33", fg = p.search_fg or "#59b5ff" },
    IncSearch = { bg = p.search_bg or "#59b5ff", fg = p.base_bg or "#0b2530" },
    StatusLine = { fg = p.statusline_fg or "#d7e6ed", bg = p.statusline_bg or "#09202b" },
    StatusLineNC = { fg = p.statusline_inactive_fg or "#9fb5bf", bg = p.statusline_bg or "#09202b" },
    VertSplit = { fg = p.border_fg or "#143543" },
    TabLine = { fg = p.tab_fg or "#9fb5bf", bg = p.tab_bg or "#0f2b39" },
    TabLineFill = { bg = p.tab_bg or "#0f2b39" },
    TabLineSel = { fg = p.tab_active_fg or "#d7e6ed", bg = p.base_bg or "#0b2530", bold = true },
    Pmenu = { fg = p.popup_fg or "#d7e6ed", bg = p.popup_bg or "#0e2c38" },
    PmenuSel = { fg = p.popup_sel_fg or "#e6f2f7", bg = p.popup_sel_bg or "#133746" },
    PmenuSbar = { bg = p.popup_bg or "#0e2c38" },
    PmenuThumb = { bg = p.popup_thumb_bg or "#2a6b83" },
    DiagnosticError = { fg = p.error_fg or "#ff7a90" },
    DiagnosticWarn = { fg = p.warning_fg or "#f7c56a" },
    DiagnosticInfo = { fg = p.info_fg or "#59b5ff" },
    DiagnosticHint = { fg = p.hint_fg or "#6b8591" },
    DiffAdd = { bg = p.diff_add_bg or "#2aa88928" },
    DiffChange = { bg = p.diff_change_bg or "#3ea4ff28" },
    DiffDelete = { bg = p.diff_delete_bg or "#ff6f6826" },
    DiffText = { bg = p.diff_text_bg or "#59b5ff33" },
    GitSignsAdd = { fg = p.git_add_fg or "#2aa889" },
    GitSignsChange = { fg = p.git_change_fg or "#3ea4ff" },
    GitSignsDelete = { fg = p.git_delete_fg or "#ff6f68" },
  }, ${JSON.stringify(custom, null, 2)})
end

return M
`;
}

function generateInitFile(): string {
  return `local M = {}

M.setup = function(opts)
  opts = opts or {}
  local style = opts.style or "auto"

  if style == "auto" then
    style = vim.o.background == "dark" and "dark" or "light"
  end

  vim.cmd("colorscheme freya-" .. style)
end

return M
`;
}
