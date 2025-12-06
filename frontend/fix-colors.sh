#!/bin/bash

# Script to fix hardcoded colors in components
# This replaces common patterns with theme-aware classes

echo "Fixing color inconsistencies..."

# Function to replace colors in a file
fix_file() {
    local file=$1
    echo "Processing: $file"
    
    # Background colors
    sed -i '' 's/bg-white dark:bg-gray-800/bg-card/g' "$file"
    sed -i '' 's/bg-gray-50 dark:bg-gray-900/bg-background/g' "$file"
    sed -i '' 's/bg-gray-50 dark:bg-gray-800\/50/bg-muted/g' "$file"
    sed -i '' 's/bg-gray-100 dark:bg-gray-700/bg-muted/g' "$file"
    
    # Text colors
    sed -i '' 's/text-gray-900 dark:text-white/text-foreground/g' "$file"
    sed -i '' 's/text-gray-900 dark:text-gray-100/text-foreground/g' "$file"
    sed -i '' 's/text-gray-600 dark:text-gray-400/text-muted-foreground/g' "$file"
    sed -i '' 's/text-gray-700 dark:text-gray-300/text-foreground/g' "$file"
    sed -i '' 's/text-gray-400 dark:text-gray-600/text-muted-foreground/g' "$file"
    
    # Border colors
    sed -i '' 's/border-gray-200 dark:border-gray-700/border-border/g' "$file"
    sed -i '' 's/border-gray-300 dark:border-gray-700/border-border/g' "$file"
    
    # Hover states
    sed -i '' 's/hover:bg-gray-50 dark:hover:bg-gray-700/hover:bg-muted/g' "$file"
    sed -i '' 's/hover:bg-gray-100 dark:hover:bg-gray-700/hover:bg-muted/g' "$file"
}

# Find and fix all TSX files in components
find src/components -name "*.tsx" -type f | while read file; do
    fix_file "$file"
done

# Fix pages
find src/pages -name "*.tsx" -type f | while read file; do
    fix_file "$file"
done

echo "Color fixes applied! Please review the changes."
