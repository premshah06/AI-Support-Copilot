#!/bin/bash

# Performance Testing Script for UI Modernization
# This script helps verify animation performance meets requirements

echo "🎯 UI Modernization Performance Testing"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running in development mode
if [ ! -f "package.json" ]; then
    echo "${RED}❌ Error: package.json not found. Run this script from the frontend directory.${NC}"
    exit 1
fi

echo "📋 Pre-flight Checks"
echo "-------------------"

# Check Node version
NODE_VERSION=$(node -v)
echo "✓ Node version: $NODE_VERSION"

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "${YELLOW}⚠️  node_modules not found. Installing dependencies...${NC}"
    npm install
fi

echo ""
echo "🔍 Analyzing Animation Implementation"
echo "------------------------------------"

# Check for GPU-accelerated properties
echo "Checking for non-optimized CSS properties in animations..."
NON_OPTIMIZED=$(grep -r "animate.*\(width\|height\|top\|left\|right\|bottom\|margin\|padding\)" src/ --include="*.tsx" --include="*.ts" | grep -v "node_modules" | wc -l)

if [ "$NON_OPTIMIZED" -eq 0 ]; then
    echo "${GREEN}✅ All animations use GPU-accelerated properties${NC}"
else
    echo "${YELLOW}⚠️  Found $NON_OPTIMIZED potential non-optimized animations${NC}"
    echo "   Review these files:"
    grep -r "animate.*\(width\|height\|top\|left\|right\|bottom\|margin\|padding\)" src/ --include="*.tsx" --include="*.ts" | grep -v "node_modules"
fi

# Check for reduced motion support
echo ""
echo "Checking for reduced motion support..."
REDUCED_MOTION=$(grep -r "useReducedMotion\|prefers-reduced-motion" src/ --include="*.tsx" --include="*.ts" | wc -l)

if [ "$REDUCED_MOTION" -gt 0 ]; then
    echo "${GREEN}✅ Reduced motion preferences are respected${NC}"
else
    echo "${RED}❌ No reduced motion support found${NC}"
fi

# Check for intersection observer usage
echo ""
echo "Checking for intersection observer (lazy animations)..."
INTERSECTION_OBSERVER=$(grep -r "useIntersectionObserver\|IntersectionObserver" src/ --include="*.tsx" --include="*.ts" | wc -l)

if [ "$INTERSECTION_OBSERVER" -gt 0 ]; then
    echo "${GREEN}✅ Intersection observer available for lazy animations${NC}"
else
    echo "${YELLOW}⚠️  Consider using intersection observer for better performance${NC}"
fi

echo ""
echo "📊 Performance Recommendations"
echo "-----------------------------"

# Check bundle size (if built)
if [ -d "dist" ]; then
    BUNDLE_SIZE=$(du -sh dist | cut -f1)
    echo "Bundle size: $BUNDLE_SIZE"
else
    echo "Run 'npm run build' to check bundle size"
fi

echo ""
echo "🧪 Running Tests"
echo "---------------"

# Run tests
npm run test -- --run --reporter=verbose

echo ""
echo "📱 Mobile Testing Checklist"
echo "--------------------------"
echo "Manual testing required on actual devices:"
echo ""
echo "iOS Safari:"
echo "  [ ] Test on iPhone 12+ with iOS 15+"
echo "  [ ] Verify 60fps during animations"
echo "  [ ] Check page transitions (<300ms)"
echo "  [ ] Test touch interactions"
echo ""
echo "Android Chrome:"
echo "  [ ] Test on Pixel 5 or Galaxy S21"
echo "  [ ] Verify smooth scrolling"
echo "  [ ] Check animation performance"
echo "  [ ] Test on slower devices"
echo ""
echo "See MOBILE_TESTING_GUIDE.md for detailed instructions"
echo ""

echo "✨ Performance Testing Complete"
echo ""
echo "Next Steps:"
echo "1. Review any warnings above"
echo "2. Run 'npm run dev' and test manually"
echo "3. Use browser DevTools Performance tab"
echo "4. Test on actual mobile devices"
echo "5. Check MOBILE_TESTING_GUIDE.md for details"
