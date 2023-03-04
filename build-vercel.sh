# Build the app
yarn build

# Read package.json version
VERSION=$(node -p "require('./package.json').version")

# Upload sourcemaps to highlight.io
# Add --appVersion "..." if you provide a version value in your H.init call.
npx --yes @highlight-run/sourcemap-uploader upload --apiKey ${HIGHLIGHT_SOURCEMAP_UPLOAD_API_KEY} --path ./build --appVersion ${VERSION}

# Delete sourcemaps to prevent them from being deployed
find build -name '*.js.map' -type f -delete
