#!/usr/bin/env bash
set -euo pipefail

# Blue Belongs Diving School - Deployment Script (robust D1 deploy)

echo "🌊 Blue Belongs Diving School - Deployment Script"
echo "================================================="

# Check if we're in the project root
if [[ ! -f "package.json" ]]; then
    echo "❌ Error: package.json not found. Run this from the project root."
    exit 1
fi

WRANGLER_CONFIG="wrangler.worker.toml"
PAGES_PROJECT="bluebelongs"

# Try to derive DB name from wrangler config; fallback to known default
if [[ -f "$WRANGLER_CONFIG" ]]; then
    DB_NAME=$(awk -F'=' '/database_name/ {gsub(/ /,"",$2); gsub(/"/,"",$2); print $2; exit}' "$WRANGLER_CONFIG" || true)
fi
DB_NAME=${DB_NAME:-bluebelong-bookings}

echo "🗄️  Using D1 database: $DB_NAME"

# Install deps if needed
if [[ ! -d node_modules ]]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🔨 Building the project..."
npm run build
echo "✅ Build completed successfully!"

# Ensure wrangler available (we'll use npx, so this is optional)
if ! command -v wrangler >/dev/null 2>&1; then
    echo "ℹ️  Using npx to run Wrangler (CLI not found globally)."
fi

echo "🚀 Deploying static site to Cloudflare Pages (project: $PAGES_PROJECT)"
npx wrangler pages deploy ./out --project-name="$PAGES_PROJECT"
echo "✅ Static site deployed successfully!"

read -r -p "🔧 Deploy API worker and D1 schema? (y/n): " deploy_worker
if [[ "${deploy_worker}" =~ ^[yY]$ ]]; then
    echo "🔧 Deploying API worker and preparing D1..."

    echo "📊 Ensuring D1 database exists..."
    # Create DB if missing; ignore error if it already exists
    npx wrangler d1 create "$DB_NAME" --config="$WRANGLER_CONFIG" >/dev/null 2>&1 || true

    echo "📝 Applying schema to REMOTE D1 database..."
    # Try non-interactive; if the CLI doesn't support --yes, fall back to piping confirmation
    if ! npx wrangler d1 execute "$DB_NAME" \
            --config="$WRANGLER_CONFIG" \
            --file=./database/schema.sql \
            --remote \
            --yes >/dev/null 2>&1; then
        printf 'yes\n' | npx wrangler d1 execute "$DB_NAME" \
            --config="$WRANGLER_CONFIG" \
            --file=./database/schema.sql \
            --remote
    fi

    echo "🚀 Deploying Worker..."
    npx wrangler deploy --config="$WRANGLER_CONFIG"
    echo "✅ API worker deployed successfully!"
fi

echo ""
echo "🎉 Deployment Complete!"
echo "========================"
echo "Your Blue Belongs website and API are up to date."
echo ""
echo "🔗 Helpful links:"
echo "- Pages:   https://pages.cloudflare.com"
echo "- D1:      https://dash.cloudflare.com"
echo "- Workers: https://workers.cloudflare.com"
