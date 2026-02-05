# Compliment Deck - Amplify Backend Setup

## Prerequisites
- AWS CLI configured with appropriate credentials
- Node.js 18+ installed
- Amplify CLI: `npm install -g @aws-amplify/cli`

## Initialize Amplify

```bash
# Navigate to project root
cd /path/to/valentines

# Initialize Amplify (if not already done)
amplify init

# Follow prompts:
# - Name: complimentdeck
# - Environment: dev
# - Default editor: VS Code
# - App type: javascript
# - Framework: react
# - Source directory: src
# - Distribution directory: dist
# - Build command: npm run build
# - Start command: npm run dev
```

## Add Authentication

```bash
amplify add auth

# Choose:
# - Default configuration with Social Provider (optional)
# - Username (or Email)
# - No advanced settings needed for MVP
```

## Add API (GraphQL)

```bash
amplify add api

# Choose:
# - GraphQL
# - API name: complimentdeckapi
# - Authorization: Amazon Cognito User Pool
# - Additional auth: API Key (for public reads on VoucherTemplate)
# - Conflict detection: Auto Merge
# - Schema template: Blank
```

## Copy Schema

After running `amplify add api`, copy the schema from `amplify/backend/api/complimentdeckapi/schema.graphql` in this project.

## Add Lambda Functions

```bash
# Monthly voucher reset
amplify add function
# - Name: monthlyVoucherReset
# - Runtime: Node.js
# - Template: Hello World
# - Schedule: rate(1 month) or cron(0 0 1 * ? *)

# Lazy voucher minting
amplify add function
# - Name: lazyVoucherMint
# - Runtime: Node.js
# - Template: Hello World
# - API access: Yes (GraphQL)

# Secure voucher redemption
amplify add function
# - Name: redeemVoucher
# - Runtime: Node.js
# - Template: Hello World
# - API access: Yes (GraphQL)
```

## Push to AWS

```bash
amplify push

# This will:
# 1. Create Cognito User Pool
# 2. Create AppSync GraphQL API
# 3. Create DynamoDB tables
# 4. Create Lambda functions
# 5. Generate TypeScript types in src/API.ts
```

## Configure Frontend

After push, Amplify generates `src/amplifyconfiguration.json`. The app will use this automatically.

## Environment Variables

For local development, create `.env.local`:

```env
VITE_AMPLIFY_ENV=dev
```

## Useful Commands

```bash
# Check status
amplify status

# View in Amplify console
amplify console

# Pull latest backend changes
amplify pull

# View GraphQL schema
amplify api gql-compile

# Generate types
amplify codegen

# Delete environment (careful!)
amplify delete
```
