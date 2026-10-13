# Firebase setup

The app uses Firebase Authentication with Google sign-in and Cloud Firestore for public problem posts, public display names, and persistent conversation replies.

For the complete setup, data model, access rules, and troubleshooting guide, see [README.md](./README.md).

## Quick setup

1. Create or select the Firebase project and register a Web app.
2. Enable **Google** under **Authentication → Sign-in method**.
3. Add `localhost` and the deployed host under **Authentication → Settings → Authorized domains**.
4. Create a Cloud Firestore database in that project.
5. Copy `.env.example` to `.env.local` and add the Web app values. The required variables are `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, and `NEXT_PUBLIC_FIREBASE_APP_ID`. `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` is optional.
6. Restart Next.js after changing `.env.local`.
7. From the repository root, sign in to Firebase CLI and deploy the rules to the same project:

   ```powershell
   npx firebase-tools login
   npx firebase-tools deploy --only firestore:rules --project itch-9264a
   ```

   Replace `itch-9264a` if your Firebase project has a different ID. The CLI user needs appropriate project access, Service Usage permission, and permission to publish Firebase Security Rules.

The web SDK config is public client configuration. Firestore rules enforce access: reads of published problems and replies are public, while creating posts and replies requires sign-in. Public user documents contain display names and name keys only, not email addresses.

