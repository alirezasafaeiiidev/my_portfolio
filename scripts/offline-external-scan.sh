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

echo ""
echo "📁 Scanning source files for external URLs..."
echo "------------------------------------------"

# Scan src directory for http(s):// patterns
if [ -d "src" ]; then
    SRC_EXTERNALS=$(grep -r "https\?://" src/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null || true)
    if [ -n "$SRC_EXTERNALS" ]; then
        echo -e "${YELLOW}⚠ Found external URLs in src/:${NC}"
        echo "$SRC_EXTERNALS"
        FOUND_EXTERNAL=1
    fi
fi

# Scan public directory
if [ -d "public" ]; then
    PUB_EXTERNALS=$(grep -r "https\?://" public/ 2>/dev/null || true)
    if [ -n "$PUB_EXTERNALS" ]; then
        echo -e "${YELLOW}⚠ Found external URLs in public/:${NC}"
        echo "$PUB_EXTERNALS"
        FOUND_EXTERNAL=1
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

# Check for CDN references
echo ""
echo "🌐 Checking for CDN references..."
echo "------------------------------------------"

CDN_PATTERNS=("googleapis.com" "cdnjs.cloudflare.com" "unpkg.com" "jsdelivr.net" "fonts.googleapis.com")
for pattern in "${CDN_PATTERNS[@]}"; do
    CDN_REFS=$(grep -r "$pattern" . --include="*.html" --include="*.tsx" --include="*.ts" --include="*.js" --include="*.css" 2>/dev/null | grep -v node_modules | grep -v ".git" || true)
    if [ -n "$CDN_REFS" ]; then
        echo -e "${RED}❌ Found CDN reference ($pattern):${NC}"
        echo "$CDN_REFS"
        FOUND_EXTERNAL=1
    fi
done

# Check for analytics/tracking
echo ""
echo "📊 Checking for analytics/tracking..."
echo "------------------------------------------"

ANALYTICS_PATTERNS=("google-analytics" "gtag" "analytics" "tracking" "segment.io" "mixpanel")
for pattern in "${ANALYTICS_PATTERNS[@]}"; do
    ANALYTICS_REFS=$(grep -r "$pattern" . --include="*.ts" --include="*.tsx" --include="*.js" --include="*.html" 2>/dev/null | grep -v node_modules | grep -v ".git" || true)
    if [ -n "$ANALYTICS_REFS" ]; then
        echo -e "${YELLOW}⚠ Found potential analytics reference ($pattern):${NC}"
        echo "$ANALYTICS_REFS"
        WARNINGS+=("Analytics reference found: $pattern")
    fi
done

# Check Google Fonts specifically
echo ""
echo "🔤 Checking for Google Fonts..."
echo "------------------------------------------"

FONT_REFS=$(grep -r "fonts.googleapis.com\|fonts.gstatic.com" . --include="*.ts" --include="*.tsx" --include="*.js" --include="*.html" --include="*.css" 2>/dev/null | grep -v node_modules | grep -v ".git" || true)
if [ -n "$FONT_REFS" ]; then
    echo -e "${RED}❌ Found Google Fonts references (MUST be self-hosted):${NC}"
    echo "$FONT_REFS"
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
