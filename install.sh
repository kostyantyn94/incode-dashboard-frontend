#!/bin/bash
set -e

# Clean install to avoid npm optional dependencies bug
rm -rf node_modules package-lock.json

# Install dependencies without optional packages
npm install --no-optional

# Manually install platform-specific optional dependencies
npm install --no-save --force \
  @rollup/rollup-linux-x64-gnu@latest \
  lightningcss-linux-x64-gnu@latest \
  @tailwindcss/oxide-linux-x64-gnu@4.1.16 || echo "Warning: Some optional packages failed to install"

echo "Installation complete"
