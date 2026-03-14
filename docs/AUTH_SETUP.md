# Auth & Data Setup Guide

After deploying the code changes, run these steps to set up Cognito users,
groups, seed the card data, and configure Amplify rewrites.

All commands use the AWS CLI. Make sure you have credentials configured
(`aws configure`) with access to the Amplify project in **us-east-1**.

---

## 1. Push Amplify Backend Changes

```bash
amplify push --yes
```

This deploys the updated GraphQL schema (Card auth rules, new models).

---

## 2. Disable Self-Signup on Cognito

In the AWS Console → Cognito → User Pool **us-east-1_TVbXakMph** →
**Sign-up experience** → **Self-service sign-up** → **Disable**.

Or via CLI (if using Amplify-managed pool, update via `amplify update auth`):

```bash
aws cognito-idp update-user-pool \
  --user-pool-id us-east-1_TVbXakMph \
  --region us-east-1 \
  --policies '{"PasswordPolicy":{"MinimumLength":8,"RequireUppercase":false,"RequireLowercase":false,"RequireNumbers":false,"RequireSymbols":false}}' \
  --admin-create-user-config '{"AllowAdminCreateUserOnly":true}'
```

---

## 3. Create Cognito Groups

```bash
# Admins group — full access to Card CRUD + admin dashboard
aws cognito-idp create-group \
  --user-pool-id us-east-1_TVbXakMph \
  --group-name Admins \
  --region us-east-1

# Users group — normal authenticated access (read cards, use app)
aws cognito-idp create-group \
  --user-pool-id us-east-1_TVbXakMph \
  --group-name Users \
  --region us-east-1
```

---

## 4. Create Users

```bash
# Admin user (you)
aws cognito-idp admin-create-user \
  --user-pool-id us-east-1_TVbXakMph \
  --username zackaryzbrown@gmail.com \
  --user-attributes Name=email,Value=zackaryzbrown@gmail.com Name=email_verified,Value=true \
  --temporary-password "TempPass123!" \
  --region us-east-1

# Regular user (Caitlyn)
aws cognito-idp admin-create-user \
  --user-pool-id us-east-1_TVbXakMph \
  --username caitlyn.hoffman98@gmail.com \
  --user-attributes Name=email,Value=caitlyn.hoffman98@gmail.com Name=email_verified,Value=true \
  --temporary-password "TempPass123!" \
  --region us-east-1
```

Both users will be forced to set a new password on first login
(the app handles the `NEW_PASSWORD_REQUIRED` challenge).

---

## 5. Add Users to Groups

```bash
# Add you to Admins + Users
aws cognito-idp admin-add-user-to-group \
  --user-pool-id us-east-1_TVbXakMph \
  --username zackaryzbrown@gmail.com \
  --group-name Admins \
  --region us-east-1

aws cognito-idp admin-add-user-to-group \
  --user-pool-id us-east-1_TVbXakMph \
  --username zackaryzbrown@gmail.com \
  --group-name Users \
  --region us-east-1

# Add Caitlyn to Users only
aws cognito-idp admin-add-user-to-group \
  --user-pool-id us-east-1_TVbXakMph \
  --username caitlyn.hoffman98@gmail.com \
  --group-name Users \
  --region us-east-1
```

---

## 6. Set Long-Lived Refresh Tokens

Set refresh token validity to 3650 days (~10 years) so sessions last a long time:

```bash
aws cognito-idp update-user-pool-client \
  --user-pool-id us-east-1_TVbXakMph \
  --client-id 1buke4r1a7g9hb3vrg1j4u0u6e \
  --refresh-token-validity 3650 \
  --token-validity-units '{"RefreshToken":"days","AccessToken":"hours","IdToken":"hours"}' \
  --region us-east-1
```

---

## 7. Seed Card Data to DynamoDB

Install the SDK dependency (already added as devDependency):

```bash
npm install -D @aws-sdk/client-dynamodb
```

Run the seed script:

```bash
node scripts/seed-cards.mjs
```

This reads all card data from `src/data/cards.ts` and writes it to the
DynamoDB `Card` table. Run this **once** before deploying.

Verify in the AWS Console → DynamoDB → Table `Card-334wmsvuvbd7papdiwn6jsfgeq-dev`
that items were created.

---

## 8. Configure Amplify SPA Rewrites

In the **AWS Amplify Console** → Your App → **Rewrites and redirects**, add:

| Source address                                                                                           | Target address | Type            |
| -------------------------------------------------------------------------------------------------------- | -------------- | --------------- |
| `</^[^.]+$\|\.(?!(css\|gif\|ico\|jpg\|js\|png\|txt\|svg\|woff\|woff2\|ttf\|map\|json\|webp)$)([^.]+$)/>` | `/index.html`  | `200 (Rewrite)` |

This ensures all client-side routes (`/login`, `/app`, `/admin`) serve
`index.html` instead of returning 404.

---

## 9. Deploy

```bash
git add -A && git commit -m "feat: add auth, routing, and DynamoDB cards"
git push origin main
```

Amplify will auto-build and deploy from the main branch.

---

## Verification Checklist

- [ ] `/` shows the public landing page (no auth required)
- [ ] `/login` shows the sign-in form
- [ ] After login, redirects to `/app` with the card deck
- [ ] Cards load from DynamoDB (not hardcoded)
- [ ] `/admin` is accessible only to the admin user (Admins group)
- [ ] Caitlyn cannot access `/admin` (redirects to `/app`)
- [ ] Long-press on settings still opens admin dashboard (admin only)
- [ ] Self-signup is disabled in Cognito
- [ ] Card text is NOT in the JavaScript bundle (view source / network tab)
