# Itch moderation setup

The moderation flow uses App Check protected Cloud Functions and Firestore rules. Users can report a problem or reply; only accounts with the Firebase Auth `moderator: true` custom claim can read reports or hide/restore content. Reports contain reporter UIDs and are not public.

## Grant moderator access

Use a trusted machine with Google Cloud CLI installed and an account that has permission to update Firebase Authentication custom claims:

```powershell
gcloud auth application-default login
$env:FIREBASE_PROJECT_ID = "itch-9264a"
node .\functions\set-moderator.js YOUR_FIREBASE_AUTH_UID grant
```

Replace `YOUR_FIREBASE_AUTH_UID` with the UID shown for your signed-in account in Firebase Authentication. To remove moderator access, use `revoke` instead of `grant`. Sign out and back in after changing the claim.

Do not grant the claim to an account controlled by a regular user. The custom claim is the authorization boundary for private reports and moderation actions.

## Deploy and migrate

From the repository root:

```powershell
npx firebase-tools deploy --only firestore:rules,firestore:indexes,functions --project itch-9264a
```

Cloud Functions deployment requires the Firebase Blaze plan. If this project stays on Spark, the secure report submission and moderation actions cannot run: they intentionally use server-side validation and App Check rather than allowing clients to write reports or change visibility directly.

## Prepare existing content

After deployment and after the moderator claim has been granted, sign in as that moderator and open `/moderation`. Select **Prepare existing posts** once. This trusted function adds `moderationStatus: "visible"` to older problems and replies so they continue to appear after the public read rules require visibility. New problems and replies created by the deployed functions receive this field automatically. If the updated site/rules are deployed first, existing posts may temporarily disappear from public feeds until this migration finishes.

If the project remains on Spark, use the trusted local migration script for old posts instead of deploying a Cloud Function. On a machine where you have owner-level Firestore access, install Google Cloud CLI, run `gcloud auth application-default login`, then from the repository root run:

```powershell
npm install --prefix .\functions
node .\functions\migrate-existing-content.js
node .\functions\migrate-existing-content.js --apply
```

The first command is a dry run. The second only adds `moderationStatus: "visible"` where the field is missing; it preserves documents already marked hidden. The script uses Application Default Credentials locally and does not add service-account keys to the repository. This restores legacy public posts under the current visibility rules. It does not enable new posting, replies, or reports: those secure callable endpoints still require Cloud Functions and the Blaze plan.

## Review reports

Open `/moderation` while signed in as a moderator. Review each item against [Community Guidelines](/community-guidelines). Choose **Hide content** to remove it from public reads while retaining it for review, **Restore content** to make it public again, or **Dismiss report** when no action is needed. A hidden item is readable only by its author and moderators.
