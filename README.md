# Freya Theme

[![CI](https://github.com/mrboen94/freya/actions/workflows/ci.yml/badge.svg)](https://github.com/mrboen94/freya/actions/workflows/ci.yml)
[![Release](https://github.com/mrboen94/freya/actions/workflows/release.yml/badge.svg)](https://github.com/mrboen94/freya/actions/workflows/release.yml)
[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/bivrost.mrboen94)](https://marketplace.visualstudio.com/items?itemName=bivrost.mrboen94)
[![Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/bivrost.mrboen94)](https://marketplace.visualstudio.com/items?itemName=bivrost.mrboen94)
[![Latest Release](https://img.shields.io/github/v/release/mrboen94/freya?sort=semver)](https://github.com/mrboen94/freya/releases)

## Blue pastel colors for your comfort

A calm, relaxing blue theme with hints of vibrant colors, available in both light and dark variants.

**Note:** This theme is probably not suitable for users with colorblindness.

## Variants

- **Freya Light** — Light theme with blue pastel colors on a soft background
- **Freya Dark** — Dark theme with the same pastel-blue aesthetic on a deep teal background (#0b2530)

## Features

- Full semantic highlighting support for TypeScript, JavaScript, JSON, Markdown, and more
- Custom integrated terminal ANSI palette aligned with theme colors
- Carefully tuned for comfortable readability while maintaining the theme's signature vibe

## Installation

1. Install the extension from the VS Code Marketplace
2. Open Command Palette (`Cmd+Shift+P` on macOS, `Ctrl+Shift+P` on Windows/Linux)
3. Type "Color Theme" and select "Preferences: Color Theme"
4. Choose **Freya Light** or **Freya Dark**

## Auto-switch with OS Appearance

To automatically switch between light and dark variants based on your operating system's appearance settings, add this to your `settings.json`:

```json
{
  "window.autoDetectColorScheme": true,
  "workbench.preferredLightColorTheme": "Freya Light",
  "workbench.preferredDarkColorTheme": "Freya Dark"
}
```

## Development & Testing

To preview theme changes in an Extension Development Host:

1. Clone the repository
2. Open in VS Code
3. Press `F5` (or use Run and Debug → "Launch Extension")
4. In the Extension Development Host window, select the theme from the Command Palette

## CI/CD

- CI runs on pushes and PRs:
  - Validates JSON for `package.json` and both theme files
  - Packages a `.vsix` with `vsce` and uploads it as a build artifact
- Releases run when you push a tag like `v0.1.0`:
  - Verifies the tag matches `package.json` version
  - Packages `.vsix` and attaches to the GitHub Release
  - Optionally publishes to Marketplace if the `VSCE_PAT` secret is configured

### Tagging a release

```bash
# Bump version in package.json, commit, then tag
# Ensure the tag matches the package.json version

git tag v0.1.0
git push origin v0.1.0
```

### Publish to VS Code Marketplace

- Create a Personal Access Token (PAT) for VS Code Marketplace
- Add it as a repository secret named `VSCE_PAT`
- Pushing a version tag will publish automatically

## Package contents

This extension ships only necessary files. Non-essential and development files are excluded during packaging via `.vscodeignore`.

- Repo keeps legacy assets for reference (e.g., `themes/syntaxHighlighting.json`, `themes/freya.tmTheme`), but they are excluded from the packaged extension.

## Color Philosophy

- **Light variant:** Blue pastel tones on a soft, near-white background
- **Dark variant:** Same pastel-blue aesthetic adapted for a deep teal background (#0b2530), with hue shifts only where necessary for readability and contrast
