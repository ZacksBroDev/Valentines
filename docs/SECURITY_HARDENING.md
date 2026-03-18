# Security Hardening

Implemented in-repo:

- AppSync client calls for notes, voucher requests, and voucher templates now use Cognito user-pool auth only.
- Amplify backend config in this repo has been updated toward Cognito-only GraphQL access.
- The committed `src/aws-exports.js` no longer exposes a live AppSync API key.
- Voucher requests now use a single request path instead of duplicate cloud writes.
- Login now applies a client-side cooldown after repeated failures and avoids leaking raw auth errors.
- Hosting headers now include CSP, `nosniff`, `no-referrer`, and a restrictive permissions policy.
- The tracked `src/data/cards.ts` file is now a public-safe sample, while the seed script defaults to `private/cards.private.ts`.

Still required outside the repo:

- Attach AWS WAF to the Amplify/CloudFront distribution and add a rate-based rule for abusive IPs.
- Rotate any previously exposed AppSync API keys after the Cognito-only backend changes are deployed.
- Run `amplify push` so the backend auth changes actually reach AWS.
- Run `amplify pull` afterward so generated files match the deployed backend.
- Consider MFA for admin accounts after adding MFA challenge handling to the login flow.
- Keep real card source content in `private/cards.private.ts` (gitignored) or another private location outside the repo.
