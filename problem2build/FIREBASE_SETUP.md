# Firebase Google sign-in setup

The app uses Firebase Authentication for Google sign-in and Cloud Firestore for public problems and author display names. It stores only a Firebase UID and a display name for attribution; it does not store or publish the user's email. Users can change their public display name from the sign-in flow.

## Firebase Console

1. Create or choose a Firebase project and register a Web app.
2. In **Authentication → Sign-in method**, enable **Google** and choose a support email.
3. In **Authentication → Settings → Authorized domains**, make sure `localhost` and the production domain are listed.
4. Create a **Cloud Firestore** database.
5. Copy the Web app config values into `.env.local` using the names in `.env.example`.
6. Deploy the included Firestore rules from this project root after selecting the Firebase project:

   ```powershell
   npx firebase-tools login
   npx firebase-tools use --add
   npx firebase-tools deploy --only firestore:rules
   ```

7. Restart the Next.js dev server after editing `.env.local`.

The rules allow public reads of published problem documents and their public display names. Signed-in users can reserve a unique display name in `usernames/{normalizedName}` and update their own `users/{uid}` record. Name reservation and profile updates happen in one Firestore transaction so two users cannot claim the same normalized name at once. Email addresses are never written to Firestore.

## What happens in the app

- The sign-in button opens Google sign-in through Firebase Authentication.
- After Google sign-in, the user can edit the display name. Saving reserves the name, updates `users/{uid}`, and redirects to `/explore`.
- Display names are case-insensitive unique names between 2 and 30 characters. A name already claimed by another account is rejected.
- Drafts remain in browser storage until the user signs in and submits.
- Submitted problems are written to `problems/{id}` with `authorId` and `authorName`, then appear in Explore.
- No profile editing is provided. The public display name is fixed when the user record is created.
