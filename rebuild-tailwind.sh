#!/usr/bin/env bash
# Rebuild the bundled Tailwind CSS file from tw-build/tailwind.css +
# tw-build/tailwind.config.js → /assets/tailwind.css (minified).
#
# Run this whenever you add/remove/change a Tailwind utility class in
# index.html / embed.html / 404.html — the build only ships the
# utility classes that actually appear in those three files, so a
# new utility class won't render until you rebuild.
#
# Requirements: Node 18+ and `npm install` run once in tw-build/.
#
# Usage:
#   ./rebuild-tailwind.sh
#
# Or directly:
#   cd tw-build && npx tailwindcss -i ./tailwind.css -o ../assets/tailwind.css --minify

set -e

cd "$(dirname "$0")/tw-build"

if [ ! -d node_modules ]; then
  echo "First run: installing Tailwind CSS CLI…"
  npm init -y >/dev/null
  npm install --no-audit --no-fund --loglevel=error -D tailwindcss@3.4.17
fi

echo "Building Tailwind CSS → ../assets/tailwind.css (minified)…"
./node_modules/.bin/tailwindcss \
  -i ./tailwind.css \
  -o ../assets/tailwind.css \
  --minify

echo "Done. $(wc -c < ../assets/tailwind.css) bytes."
