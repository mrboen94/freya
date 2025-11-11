#!/usr/bin/env node
import { resolve, join } from "path";
import { ThemeDocSchema } from "./schema.js";
import { readYaml, writeJson, writeText } from "./utils/io.js";
import { resolveTheme } from "./utils/resolve.js";
import { generateVSCodeTheme } from "./generators/vscode.js";
import { generateWezTermTheme } from "./generators/wezterm.js";
import { generateNeovimTheme } from "./generators/neovim.js";

const ROOT_DIR = resolve(__dirname, "..");
const THEME_SOURCE = join(ROOT_DIR, "theme", "freya.theme.yaml");
const THEMES_DIR = join(ROOT_DIR, "themes");
const DIST_DIR = join(ROOT_DIR, "dist");

interface BuildOptions {
  validateOnly?: boolean;
  outDir?: string;
  modes?: string[];
}

function parseArgs(): BuildOptions {
  const args = process.argv.slice(2);
  const opts: BuildOptions = {
    validateOnly: false,
    outDir: DIST_DIR,
    modes: ["light", "dark"],
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--validate-only") {
      opts.validateOnly = true;
    } else if (arg === "--outDir" && args[i + 1]) {
      opts.outDir = args[++i];
    } else if (arg === "--modes" && args[i + 1]) {
      opts.modes = args[++i]?.split(",").map((m) => m.trim()) ?? [];
    }
  }

  return opts;
}

function main() {
  const opts = parseArgs();

  console.log("📖 Loading theme source:", THEME_SOURCE);
  const rawTheme = readYaml(THEME_SOURCE);

  console.log("✅ Validating schema...");
  const parseResult = ThemeDocSchema.safeParse(rawTheme);
  if (!parseResult.success) {
    console.error("❌ Schema validation failed:");
    console.error(parseResult.error.format());
    process.exit(1);
  }

  const themeDoc = parseResult.data;
  console.log(`✅ Valid theme: ${themeDoc.name} v${String(themeDoc.version)}`);

  if (opts.validateOnly) {
    console.log("✅ Validation complete. Exiting.");
    return;
  }

  console.log("🔗 Resolving color references...");
  const resolved = resolveTheme(themeDoc);

  const modesAvailable = Object.keys(resolved.modes).filter(
    (m): m is "light" | "dark" => m === "light" || m === "dark"
  );
  const modesToBuild = modesAvailable.filter((m) => opts.modes?.includes(m));

  if (modesToBuild.length === 0) {
    console.error("❌ No modes to build. Check --modes option.");
    process.exit(1);
  }

  for (const mode of modesToBuild) {
    const modeData = resolved.modes[mode];
    if (!modeData) continue;

    console.log(`\n🎨 Generating ${mode} theme...`);

    const vsCodeTheme = generateVSCodeTheme(
      modeData,
      `Freya ${mode.charAt(0).toUpperCase() + mode.slice(1)}`,
      mode
    );
    const vsCodePath = join(
      THEMES_DIR,
      `Freya ${mode.charAt(0).toUpperCase() + mode.slice(1)}-color-theme.json`
    );
    writeJson(vsCodePath, vsCodeTheme);
    console.log(`  ✅ VS Code: ${vsCodePath}`);

    const weztermToml = generateWezTermTheme(
      modeData,
      `Freya ${mode.charAt(0).toUpperCase() + mode.slice(1)}`
    );
    const weztermPath = join(opts.outDir ?? DIST_DIR, "wezterm", `freya-${mode}.toml`);
    writeText(weztermPath, weztermToml);
    console.log(`  ✅ WezTerm: ${weztermPath}`);

    const nvimFiles = generateNeovimTheme(modeData, mode, "freya");
    const nvimBase = join(opts.outDir ?? DIST_DIR, "neovim", "freya");
    const nvimColorPath = join(nvimBase, "colors", `freya-${mode}.lua`);
    writeText(nvimColorPath, nvimFiles.colorscheme);
    console.log(`  ✅ Neovim colorscheme: ${nvimColorPath}`);

    if (mode === "light") {
      const nvimPalettePath = join(nvimBase, "lua", "freya", "palette.lua");
      writeText(nvimPalettePath, nvimFiles.palette);
      console.log(`  ✅ Neovim palette: ${nvimPalettePath}`);

      const nvimHighlightsPath = join(nvimBase, "lua", "freya", "highlights.lua");
      writeText(nvimHighlightsPath, nvimFiles.highlights);
      console.log(`  ✅ Neovim highlights: ${nvimHighlightsPath}`);

      const nvimInitPath = join(nvimBase, "lua", "freya", "init.lua");
      writeText(nvimInitPath, nvimFiles.init);
      console.log(`  ✅ Neovim init: ${nvimInitPath}`);
    }
  }

  console.log("\n🎉 Build complete!");
}

main();

process.on("unhandledRejection", (err: unknown) => {
  console.error("❌ Build failed:", err);
  process.exit(1);
});
