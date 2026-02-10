#!/bin/bash
# offline-external-scan.sh - Detect runtime outbound requests
# This script scans for external URLs in source code, configs, and public assets

set -euo pipefail

echo "=========================================="
echo "🔒 External Dependencies Scan"
echo "=========================================="

# Colors
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m'

FOUND_EXTERNAL=0
WARNINGS=()

# Allowed exceptions (documented and intentional)
ALLOWED_EXTERNALS=(
    # Add documented exceptions here, e.g.:
    # "example.com/api"  # External API with local fallback
)

# Directories to skip from repository-wide scans
SCAN_EXCLUDES=(
    ".git"
    "node_modules"
    ".next"
    "dist"
    "coverage"
)

build_exclude_args() {
    local args=()
    for path in "${SCAN_EXCLUDES[@]}"; do
        args+=(--glob "!${path}/**")
    done
    printf '%s\n' "${args[@]}"
}

is_allowed_external() {
    local line="$1"
    for allowed in "${ALLOWED_EXTERNALS[@]}"; do
        if [[ "$line" == *"$allowed"* ]]; then
            return 0
        fi
    done
    return 1
}

print_filtered_matches() {
    local matches="$1"
    local filtered=""
    while IFS= read -r line; do
        [ -z "$line" ] && continue
        if ! is_allowed_external "$line"; then
            filtered+="${line}"$'\n'
        fi
    done <<< "$matches"
    printf '%s' "$filtered"
}

echo ""
echo "📁 Scanning source files for external URLs..."
echo "------------------------------------------"

# Scan for runtime outbound requests (high signal, low false positives)
if [ -d "src" ]; then
    echo "Checking runtime request patterns in src/..."
    RUNTIME_FETCH=$(rg -n "fetch\\s*\\(\\s*['\\\"]https?://" src --glob "*.{ts,tsx,js,jsx}" || true)
    RUNTIME_AXIOS=$(rg -n "axios\\.(get|post|put|patch|delete)\\s*\\(\\s*['\\\"]https?://" src --glob "*.{ts,tsx,js,jsx}" || true)
    RUNTIME_WS=$(rg -n "(WebSocket|EventSource)\\s*\\(\\s*['\\\"](wss?|https?)://" src --glob "*.{ts,tsx,js,jsx}" || true)

    if [ -n "$RUNTIME_FETCH" ] || [ -n "$RUNTIME_AXIOS" ] || [ -n "$RUNTIME_WS" ]; then
        echo -e "${RED}❌ Found runtime external requests in src/:${NC}"
        [ -n "$RUNTIME_FETCH" ] && echo "$RUNTIME_FETCH"
        [ -n "$RUNTIME_AXIOS" ] && echo "$RUNTIME_AXIOS"
        [ -n "$RUNTIME_WS" ] && echo "$RUNTIME_WS"
        FOUND_EXTERNAL=1
    else
        echo -e "${GREEN}✓ No runtime external requests found in src/${NC}"
    fi
fi

# Scan public text files only (-I ignores binary files)
if [ -d "public" ]; then
    echo "Checking public/ text assets for external URLs..."
    PUB_EXTERNALS=$(grep -rInI "https\\?://" public/ --exclude="*.png" --exclude="*.jpg" --exclude="*.jpeg" --exclude="*.webp" --exclude="*.ico" --exclude="*.woff" --exclude="*.woff2" --exclude="*.ttf" --exclude="*.otf" 2>/dev/null || true)
    if [ -n "$PUB_EXTERNALS" ]; then
        echo -e "${YELLOW}⚠ Found external URLs in public/ text assets:${NC}"
        echo "$PUB_EXTERNALS"
        WARNINGS+=("External URLs in public text assets")
    fi
fi

# Scan config files
echo ""
echo "🔧 Scanning configuration files..."
echo "------------------------------------------"

CONFIG_FILES=("next.config.ts" "next.config.js" "tailwind.config.ts" "tailwind.config.js")
for file in "${CONFIG_FILES[@]}"; do
    if [ -f "$file" ]; then
        CONFIG_EXTERNALS=$(grep -n "https\?://" "$file" 2>/dev/null || true)
        if [ -n "$CONFIG_EXTERNALS" ]; then
            echo -e "${YELLOW}⚠ Found external URLs in $file:${NC}"
            echo "$CONFIG_EXTERNALS"
            FOUND_EXTERNAL=1
        fi
    fi
done

# Check for placeholder production domain
echo ""
echo "🏷️ Checking for placeholder domain..."
echo "------------------------------------------"

PLACEHOLDER_REFS=$(rg -n "yourportfolio\\.com" src --glob "*.{ts,tsx,js,jsx}" --glob "!src/**/__tests__/**" || true)
if [ -n "$PLACEHOLDER_REFS" ]; then
    echo -e "${RED}❌ Found placeholder domain references (yourportfolio.com):${NC}"
    echo "$PLACEHOLDER_REFS"
    FOUND_EXTERNAL=1
fi

# Check for CDN references
echo ""
echo "🌐 Checking for CDN references..."
echo "------------------------------------------"

CDN_PATTERNS=("googleapis.com" "cdnjs.cloudflare.com" "unpkg.com" "jsdelivr.net" "fonts.googleapis.com")
mapfile -t RG_EXCLUDES < <(build_exclude_args)
for pattern in "${CDN_PATTERNS[@]}"; do
    CDN_REFS=$(rg -n "$pattern" . \
        --glob "*.html" \
        --glob "*.tsx" \
        --glob "*.ts" \
        --glob "*.js" \
        --glob "*.css" \
        "${RG_EXCLUDES[@]}" || true)
    FILTERED_CDN_REFS=$(print_filtered_matches "$CDN_REFS")
    if [ -n "$FILTERED_CDN_REFS" ]; then
        echo -e "${RED}❌ Found CDN reference ($pattern):${NC}"
        echo "$FILTERED_CDN_REFS"
        FOUND_EXTERNAL=1
    fi
done

# Check for analytics/tracking
echo ""
echo "📊 Checking for analytics/tracking..."
echo "------------------------------------------"

ANALYTICS_PATTERNS=("google-analytics" "gtag" "analytics" "tracking" "segment.io" "mixpanel")
for pattern in "${ANALYTICS_PATTERNS[@]}"; do
    ANALYTICS_REFS=$(rg -n "$pattern" . \
        --glob "*.ts" \
        --glob "*.tsx" \
        --glob "*.js" \
        --glob "*.html" \
        "${RG_EXCLUDES[@]}" || true)
    FILTERED_ANALYTICS_REFS=$(print_filtered_matches "$ANALYTICS_REFS")
    if [ -n "$FILTERED_ANALYTICS_REFS" ]; then
        echo -e "${YELLOW}⚠ Found potential analytics reference ($pattern):${NC}"
        echo "$FILTERED_ANALYTICS_REFS"
        WARNINGS+=("Analytics reference found: $pattern")
    fi
done

# Check Google Fonts specifically
echo ""
echo "🔤 Checking for Google Fonts..."
echo "------------------------------------------"

FONT_REFS=$(rg -n "fonts.googleapis.com|fonts.gstatic.com" . \
    --glob "*.ts" \
    --glob "*.tsx" \
    --glob "*.js" \
    --glob "*.html" \
    --glob "*.css" \
    "${RG_EXCLUDES[@]}" || true)
FILTERED_FONT_REFS=$(print_filtered_matches "$FONT_REFS")
if [ -n "$FILTERED_FONT_REFS" ]; then
    echo -e "${RED}❌ Found Google Fonts references (MUST be self-hosted):${NC}"
    echo "$FILTERED_FONT_REFS"
    FOUND_EXTERNAL=1
fi

# Summary
echo ""
echo "=========================================="
echo "📊 Scan Summary"
echo "=========================================="

if [ $FOUND_EXTERNAL -eq 0 ]; then
    echo -e "${GREEN}✅ No external runtime dependencies found!${NC}"
    if [ ${#WARNINGS[@]} -gt 0 ]; then
        echo ""
        echo -e "${YELLOW}Warnings (non-blocking):${NC}"
        for warning in "${WARNINGS[@]}"; do
            echo "  - $warning"
        done
    fi
    exit 0
else
    echo -e "${RED}❌ External dependencies found!${NC}"
    echo ""
    echo "Action required:"
    echo "1. Self-host all fonts and assets"
    echo "2. Remove or make optional all external API calls"
    echo "3. Document any intentional external dependencies"
    exit 1
fi
