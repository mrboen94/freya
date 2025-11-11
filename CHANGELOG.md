# Change Log

## [Unreleased]
### Added
- GitHub Actions CI workflow to validate JSON, package, and upload VSIX artifacts
- GitHub Actions Release workflow to package on tag and attach VSIX; optional Marketplace publish with `VSCE_PAT`
- `.vscodeignore` to trim non-essential files from the published package (and ensured it is tracked by Git)
- README badges: CI, Release, VS Code Marketplace (version and installs), and Latest Release; plus CI/CD documentation

## [0.1.0] - 2024-01-11

### Added
- New **Freya Dark** variant with deep teal background (#0b2530)
- Full semantic highlighting support in dark variant
- Integrated terminal ANSI palette tuned for readability on dark background
- Auto-switch support between light and dark variants based on OS appearance

### Changed
- Extension display name updated to "Freya Theme" (from "Freya Light Theme")
- README updated with variant information, installation instructions, and auto-switch configuration

### Technical
- Theme colors carefully tuned for WCAG AA contrast on #0b2530 background
- Hue shifts applied only where necessary for readability while preserving the signature pastel-blue aesthetic

## [0.0.7]

- Changed color and font styles of = and === operators in typescript.
- Changed color of semicolons in typescript.
- Added color and italicized class functions (public, private etc.)

## [0.0.7]

- Added some typescript semantic highlighting, this is currently just a MVP iteration of this. Colors are not necessarily set in stone.

## [0.0.6]

- Added support for .json with different styling to not be as messy
- Added support for org mode blocks, colors needs to be tweaked over time

## [0.0.5]

- Constant color changes
- Adding some custom operator colors and some customizations for JS/TS

## [0.0.2 - 0.0.4]

- Testing of different ways to theme vscode
- Changed some colors for better readability, needs change of tab colors for github decorations as they are barely readable.

## [0.0.1]

- Initial release
- Initial colors presented and added
