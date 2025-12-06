#!/bin/bash
# Script to analyze bundle size

echo "Building production bundle..."
npm run build

echo ""
echo "Bundle analysis complete! Check dist/stats.html for detailed visualization."
echo ""
echo "Bundle sizes:"
ls -lh dist/assets/*.js | awk '{print $9, $5}'
