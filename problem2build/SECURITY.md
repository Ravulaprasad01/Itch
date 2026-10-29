# Security checklist and verification

## Implemented in this repository

- Firebase web configuration comes from `NEXT_PUBLIC_FIREBASE_*`. Those browser values are not privileged credentials. Never put service-account keys or private credentials in `NEXT_PUBLIC_*` variables.
- `.env*` files are ignored by Git except the safe `.env.example` templates. Environment files must stay out of `public/`.
- Firestore rules expose only records with `moderationStatus: "visible"` to the public. Authors can still inspect their own hidden content; moderators can inspect all content.
- Legacy `problems/{problemId}/solutions/{developerId}` records are denied to all client reads and writes because no current screen uses them and the old record shape has no reviewed public-data contract.
- User profile documents are owner-readable and owner-updatable only. Public names copied onto posts and replies never include email.
- The Firestore rules validate client writes and tie authorship, roles, public fields, participation counts, and cooldown timestamps to the signed-in account. The rules are the active source of enforcement for direct client writes.
- `functions/index.js` contains callable handlers with Authentication and App Check checks, but `firebase.json` does not currently register a Functions codebase. Do not assume these handlers protect production until a Functions deployment is configured and confirmed.
- Posts/replies cannot be edited or deleted by browser clients. Moderation visibility changes and report review run through moderator-claim-protected Admin SDK functions.
- Reports are private to accounts with the Firebase Auth `moderator: true` custom claim. Each member can report a given item once; a server-side cooldown limits repeated reports.
- `storage.rules` denies every file read/write until an upload feature and access model are added.
- `src/lib/firebase.js` initializes App Check with reCAPTCHA Enterprise when configured. The callable write functions enforce App Check.
- Next.js sends `nosniff`, frame denial, a restrictive referrer policy, a permissions policy, and popup-compatible opener policy. HSTS is sent only in production.
- Problem/reply text is rendered through React text nodes, which escape HTML. There are no `dangerouslySetInnerHTML` or `innerHTML` uses in `src/`.
- Firestore reads use SDK document/collection APIs; no SQL or string-built database queries are used. Trusted writes validate data on the backend.

## Firebase Console and deployment steps

1. **Configure App Check before deploying Functions.** Register reCAPTCHA Enterprise keys for production and localhost separately. Never include `localhost` in the production key. Set `NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY` in the corresponding build environment. Rebuild/restart the app after changing it.

2. **Deploy backend, rules, and query indexes** from PowerShell in the repository:

   ```powershell
   npx firebase-tools login
   npx firebase-tools deploy --only functions,firestore:rules,firestore:indexes,storage --project itch-9264a
   ```

   Functions deployment requires Firebase Blaze billing. Review pricing, set budget alerts, and confirm the project has the Storage bucket before deployment. If there is no Storage bucket, use `--only functions,firestore:rules`.

3. **Restrict the Firebase web API key.** It is expected to be visible in browser code. In Google Cloud Console restrict it to the app’s HTTP referrers (localhost for development and the production domain) and only the APIs the app uses. The Firebase key previously pasted in this conversation should be reviewed and restricted; rotate it if Google Cloud Console allows this without disrupting Firebase, then update local/hosting environment values. Never paste replacement keys into chat or commit them.

4. **Enable App Check enforcement for Firestore and Authentication.** Review App Check metrics in Firebase Console before enabling enforcement for these services. The callable write functions enforce App Check already. This app currently uses Google sign-in only and has no email/password reset flow. Firebase/Google apply their own OAuth quotas and abuse controls; monitor Authentication quotas. If password sign-in is added later, enable email-enumeration protection and test password resets from the deployed domain.

5. **Production configuration.** Store environment values in the hosting provider’s environment settings, use HTTPS, authorize only trusted domains in Firebase Authentication, and ensure Functions, Firestore, App Check, and the frontend target the same Firebase project.

6. **Moderation role and existing posts.** Follow [MODERATION_SETUP.md](./MODERATION_SETUP.md) to grant a trusted account the moderator claim and run the one-time visibility migration. Do not grant moderator claims from client code. Cloud Functions deployment requires Blaze billing; report submission, review, and content hiding depend on these protected functions.

7. **Secrets in Git history.** A repository history scan was run for common Firebase/API key, private-key, GitHub token, and cloud access-key patterns; it found no matches in reachable Git history. This pattern scan cannot detect every secret format. Use a dedicated secret scanner in CI and before publishing. If a real secret is found, rotate/revoke it first; deleting it from the latest version does not remove it from Git history.

## Two-account and signed-out verification

Use two separate browser profiles (or one normal and one private window). Run this only after deploying Functions and Firestore rules and configuring App Check.

1. Sign in as **Account A**, choose a unique display name, and publish a problem. Check that Explore shows the display name and never the email.
2. Open the post as **Account B**. Confirm public content is readable and B can reply under B’s display name.
3. While signed in as B, try reading `users/{A_UID}` and `rateLimits/{A_UID}` using the Firebase client. Both must return `permission-denied`. Direct client writes to A’s problem or replies must also be denied. Submit a callable request with a forged author UID/name and confirm the backend uses the real authenticated caller and saved display name.
4. Immediately try a second post and reply as B. They should receive a rate-limit response. Retry after 30 seconds for a post and 5 seconds for a reply; both should succeed.
5. Sign out and confirm Explore/problem/reply reads still work. Callable writes and private profile reads must fail.
6. Test Google sign-in and sign-out for both accounts. Password reset does not apply while Google is the only provider; test it if email/password is added later.

The two-account production check was not run here because it requires your Firebase accounts, Console configuration, and deployed Functions. The app server at `localhost:3002` was not responding during this turn.
