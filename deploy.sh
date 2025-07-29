#!/bin/bash

# Blue Belongs Diving School - Deployment Script
# This script builds and deploys the site to Cloudflare Pages

echo "🌊 Blue Belongs Diving School - Deployment Script"
echo "================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the project root directory."
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the project
echo "🔨 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

echo "✅ Build completed successfully!"

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "📦 Installing Wrangler CLI..."
    npm install -g wrangler
fi

# Deploy to Cloudflare Pages
echo "🚀 Deploying to Cloudflare Pages..."
echo "Project name: bluebelong"

# Deploy the static site
npx wrangler pages deploy ./out --project-name=bluebelong

if [ $? -eq 0 ]; then
    echo "✅ Static site deployed successfully!"
    
    # Ask if user wants to deploy the API worker too
    read -p "🔧 Do you want to deploy the API worker as well? (y/n): " deploy_worker
    
    if [ "$deploy_worker" = "y" ] || [ "$deploy_worker" = "Y" ]; then
        echo "🔧 Deploying API worker..."
        
        # Check if D1 database exists
        echo "📊 Setting up D1 database..."
        npx wrangler d1 create bluebelong-bookings
        
        echo "📝 Running database migrations..."
        npx wrangler d1 execute bluebelong-bookings --file=./database/schema.sql
        
        echo "🚀 Deploying worker..."
        npx wrangler deploy workers/booking-api.js
        
        if [ $? -eq 0 ]; then
            echo "✅ API worker deployed successfully!"
        else
            echo "❌ Worker deployment failed. Check the configuration and try again."
        fi
    fi
    
    echo ""
    echo "🎉 Deployment Complete!"
    echo "========================"
    echo "Your Blue Belongs diving school website is now live!"
    echo ""
    echo "📱 Next steps:"
    echo "1. Configure your custom domain in Cloudflare Pages"
    echo "2. Set up email service (SendGrid/Resend) for booking confirmations"
    echo "3. Test the booking functionality"
    echo "4. Add your real contact information"
    echo ""
    echo "🔗 Useful links:"
    echo "- Cloudflare Pages: https://pages.cloudflare.com"
    echo "- D1 Database: https://dash.cloudflare.com"
    echo "- Workers: https://workers.cloudflare.com"
    
else
    echo "❌ Deployment failed. Please check your Cloudflare configuration."
    exit 1
fi
