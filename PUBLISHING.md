# Publishing mcp-gen to npm

This document provides instructions for publishing mcp-gen to npm, both manually and automatically via GitHub Actions.

## Prerequisites

- Node.js (v20 or later recommended)
- npm account
- GitHub account (for automated publishing)

## Manual Publishing

### 1. Prepare for Publishing

1. Make sure all your changes are committed and pushed to your repository.
2. Update the version in package.json using one of the following commands:
   ```bash
   # Patch version (1.0.0 -> 1.0.1)
   npm version patch

   # Minor version (1.0.0 -> 1.1.0)
   npm version minor

   # Major version (1.0.0 -> 2.0.0)
   npm version major
   ```

3. This will create a new git tag and commit.

### 2. Log in to npm

```bash
npm login
```

Enter your npm username, password, and email when prompted.

### 3. Build and Publish

```bash
npm run build
npm publish --access public
```

## Automated Publishing via GitHub Actions

This repository is configured to automatically publish to npm when a new tag is pushed.

### 1. Set up NPM_TOKEN in GitHub Secrets

1. Go to your npm account settings and create a new access token:
   - Navigate to npmjs.com
   - Go to your profile → Access Tokens
   - Create a new Automation token
   - Copy the token

2. Add the token to your GitHub repository secrets:
   - Go to your GitHub repository
   - Navigate to Settings → Secrets and variables → Actions
   - Create a new repository secret named `NPM_TOKEN`
   - Paste the npm token value
   - Click "Add secret"

### 2. Publishing a New Version

1. Update the version in package.json:
   ```bash
   npm version patch  # or minor/major
   ```

2. Push the new tag to GitHub:
   ```bash
   git push origin main
   git push origin --tags
   ```

3. The GitHub Action will automatically:
   - Check out the code
   - Set up Node.js
   - Install dependencies
   - Run tests
   - Publish the package to npm

## Troubleshooting

### Common Issues

1. **Authentication Error**: Make sure your NPM_TOKEN is correct and has the necessary permissions.
2. **Version Conflict**: Make sure you're not trying to publish a version that already exists on npm.
3. **Build Issues**: Run `npm test` locally to verify that the package builds correctly.

### GitHub Actions Logs

If the automated publishing fails:
1. Go to your GitHub repository
2. Click on the "Actions" tab
3. Find the failed workflow run
4. Examine the logs for error messages 