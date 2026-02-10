#!/bin/bash
# verify.sh - Comprehensive verification script
# This script runs all checks and fails fast with non-zero exit codes

set -euo pipefail

echo "=========================================="
echo "🔍 Verification Script"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASS_COUNT=0
FAIL_COUNT=0

# Function to run a check
run_check() {
    local name=$1
    local command=$2
    
    echo ""
    echo "------------------------------------------"
    echo "Running: $name"
    echo "------------------------------------------"
    
    if eval "$command"; then
        echo -e "${GREEN}✓ $name passed${NC}"
        PASS_COUNT=$((PASS_COUNT + 1))
    else
        echo -e "${RED}✗ $name failed${NC}"
        FAIL_COUNT=$((FAIL_COUNT + 1))
        return 1
    fi
}

# Check 1: Lint
echo ""
echo "🔧 STEP 1: Running linter..."
if ! run_check "ESLint" "bun run lint"; then
    echo -e "${RED}Linting failed!${NC}"
    exit 1
fi

# Check 2: Type Check (if available)
echo ""
echo "📘 STEP 2: Running type check..."
if grep -q "tsc" package.json 2>/dev/null; then
    if ! run_check "TypeScript" "bun run type-check 2>/dev/null || bun tsc --noEmit"; then
        echo -e "${YELLOW}Type check not available or failed${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Type check script not found in package.json${NC}"
fi

# Check 3: Tests with Coverage
echo ""
echo "🧪 STEP 3: Running tests..."
if ! run_check "Tests" "bun run test"; then
    echo -e "${RED}Tests failed!${NC}"
    exit 1
fi

# Check 4: Build
echo ""
echo "🏗️  STEP 4: Running build..."
if ! run_check "Build" "bun run build"; then
    echo -e "${RED}Build failed!${NC}"
    exit 1
fi

# Check 5: External Scan (if exists)
echo ""
echo "🔒 STEP 5: Running external request scan..."
if [ -f "scripts/offline-external-scan.sh" ]; then
    if ! run_check "External Scan" "./scripts/offline-external-scan.sh"; then
        echo -e "${YELLOW}External scan found issues - review manually${NC}"
    fi
else
    echo -e "${YELLOW}⚠ External scan script not found${NC}"
fi

# Summary
echo ""
echo "=========================================="
echo "📊 Verification Summary"
echo "=========================================="
echo -e "Passed: ${GREEN}$PASS_COUNT${NC}"
echo -e "Failed: ${RED}$FAIL_COUNT${NC}"

if [ $FAIL_COUNT -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ Some checks failed!${NC}"
    exit 1
fi
