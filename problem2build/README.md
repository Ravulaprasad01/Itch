# Itch

Itch is a community app for sharing everyday problems, finding people with similar experiences, and discussing useful ways forward. Members sign in with Google, publish a problem under a unique public display name, and reply to community conversations. Problem posts and replies are stored in Cloud Firestore and appear live in the app.

## Contents

- [Features](#features)
- [Technology](#technology)
- [Requirements](#requirements)
- [Run locally](#run-locally)
- [Configure Firebase](#configure-firebase)
- [Authentication and public names](#authentication-and-public-names)
- [Firestore data model](#firestore-data-model)
- [Security rules](#security-rules)
- [Pages](#pages)
- [Project structure](#project-structure)
- [Commands](#commands)
- [Production deployment](#production-deployment)
- [Current limitations](#current-limitations)
- [Troubleshooting](#troubleshooting)
- [Demo and existing data](#demo-and-existing-data)

## Features

- **Google sign-in:** Firebase Authentication handles account sign-in.
- **Unique public display names:** members choose a name between 2 and 30 characters during initial account setup. Names are case-insensitively unique. The current UI does not include a profile-editing route for changing an existing name.
- **Publish problems:** signed-in members can post a title, description, category, frequency, priority, audience, and current workaround.
- **Explore live posts:** Explore, Community, and the Developer feed subscribe to Firestore and update as posts are added.
- **Persistent conversations:** signed-in members can reply to a problem. Replies are saved in that problem’s Firestore subcollection and shown to everyone.
- **Private email:** the app does not write an email address to its public Firestore records. Posts and replies display the member’s Itch name.
- **Topic filters:** Community topics and search filter published problems. Topic follows are stored in the current browser only; they do not notify other members.
- **Responsive interface:** the app includes animated transitions, loading states, problem forms, and informational pages.

The current post and conversation flows are live Firestore features. There are no built-in sample problem records in the app code. The “review” step in the composer is a final check before publishing, not a saved public post.

## Technology

- Next.js 15 App Router
- React 18
- Firebase JavaScript SDK
  - Firebase Authentication (Google provider)
  - Cloud Firestore
- Tailwind CSS and project-specific CSS
- Lucide React icons

Firebase is the active authentication and database integration. Supabase and PostHog packages are listed in `package.json`, but are not currently wired into the app source.

## Requirements

- Node.js 20 LTS recommended
- npm (included with Node.js)
- A Firebase project with Google Authentication and Cloud Firestore enabled
- A Google account with permission to deploy Firestore rules if you need to deploy them

## Run locally

From PowerShell, in the repository folder:

```powershell
cd C:\projects\problem2build
npm install
if (-not (Test-Path .env.local)) { Copy-Item .env.example .env.local }
```

The conditional copy creates `.env.local` only if it does not already exist, so it preserves existing Firebase configuration. Edit `.env.local` with the Firebase web app values described in [Configure Firebase](#configure-firebase), then start Next.js:

```powershell
npm run dev -- --port 3002
```

Open [http://localhost:3002](http://localhost:3002). If port 3002 is already in use, choose another port, for example:

```powershell
npm run dev -- --port 3003
```

Environment variables are read when Next.js starts. Stop and restart the development server after changing `.env.local`.

## Configure Firebase

### 1. Create or select the Firebase project

Use the Firebase project intended for this app. The current project ID used in the deployment examples below is `itch-9264a`; replace it if your Firebase project has a different ID.

### 2. Register a web app and configure environment values

In Firebase Console, open **Project settings → General → Your apps**, register a Web app if needed, and copy its Firebase configuration into `.env.local`:

```dotenv
NEXT_PUBLIC_FIREBASE_API_KEY=your-web-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-web-app-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
```

`NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` is optional and unused by the current problem and reply flows. The other four values are required for Firebase initialization. The corresponding variable names are listed in `.env.example`.

Firebase web configuration values are used by the browser and are not server secrets. Do not put service-account JSON, private keys, or other privileged credentials in `NEXT_PUBLIC_*` variables. Firestore security rules—not hiding the web config—protect database writes.

### 3. Enable Google sign-in

In Firebase Console:

1. Open **Authentication → Sign-in method**.
2. Enable **Google** and select a support email.
3. Open **Authentication → Settings → Authorized domains** and ensure `localhost` and your deployed site’s domain are listed.

### 4. Create Cloud Firestore

Create a Cloud Firestore database in the same Firebase project used by `.env.local`. Keep the app’s Firestore database ID as the default database unless the app code is deliberately updated to select a different database.

### 5. Deploy the security rules

The repository root contains `firebase.json`, which points Firebase CLI to `firestore.rules`. Sign in to the CLI and deploy the rules from the repository root:

```powershell
npx firebase-tools login
npx firebase-tools deploy --only firestore:rules --project itch-9264a
```

Use the project ID from your Firebase project if it differs. The signed-in CLI account must have access to the project and permission to use Service Usage and publish Firebase Security Rules. An owner or administrator may need to grant the appropriate IAM permissions. If you recently changed IAM roles, allow time for them to propagate before deploying again.

> Deploying rules replaces the currently deployed Firestore rules for the selected project. Review `firestore.rules` and the target project before deploying.

For an overview of the Firebase steps, see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md).

## Authentication and public names

The sign-in page uses Firebase’s Google provider. After the first sign-in, the member chooses a public name. The app checks availability and saves the name with a transaction that reserves its normalized form. Members with a saved name are routed to Explore; there is no separate profile-editing screen in the current UI.

- Public names are 2–30 characters and allow letters, numbers, spaces, periods, underscores, and hyphens.
- Name comparison is case-insensitive; whitespace is normalized.
- The public name is displayed on posts and replies.
- The Firebase UID is used to associate records with their owner.
- Email addresses are not written to the app’s Firestore profile, problem, or reply documents.
- Signing in with an existing saved name routes the member to Explore.
- An unfinished post form is temporarily kept in browser storage only when the member needs to sign in before publishing. This is an auth handoff, not a published post or a cross-device draft system.

The implementation is in `src/lib/firebase.js` and `src/components/auth/GoogleSignInPanel.jsx`.

## Firestore data model

All timestamps are Firestore server timestamps. Public reads are intentional for published problems and replies; writes require authentication and are checked by `firestore.rules`.

### `users/{uid}`

Public display-name record. It does not contain the member’s email.

| Field | Purpose |
| --- | --- |
| `displayName` | Name displayed on posts and replies |
| `nameKey` | Normalized name used to enforce uniqueness |
| `createdAt` | Profile creation timestamp |

### `usernames/{normalizedName}`

Unique-name reservation used by the name transaction.

| Field | Purpose |
| --- | --- |
| `uid` | Firebase UID that owns the name |

### `problems/{problemId}`

Published community problem.

| Field | Purpose |
| --- | --- |
| `title` | Short problem title (10–120 characters) |
| `description` | Problem context (20–600 characters) |
| `category` | Category name |
| `frequency` | How often it occurs: Daily, Weekly, Monthly, or Rarely |
| `priority` | Low, Medium, or High |
| `audience` | People affected |
| `workaround` | Current workaround, if any |
| `authorId` | Firebase UID of the author |
| `authorName` | Public display name at the time of posting |
| `status` | New posts use `open` |
| `meTooCount`, `wantThisCount`, `devInterestCount` | Initial counters currently set to zero; persisted reaction flows are not currently exposed |
| `createdAt` | Publication timestamp |

### `problems/{problemId}/replies/{replyId}`

Persistent public conversation reply.

| Field | Purpose |
| --- | --- |
| `authorId` | Firebase UID of the reply author |
| `authorName` | Public display name |
| `text` | Reply text, up to 2,000 characters |
| `createdAt` | Reply timestamp |

## Security rules

`firestore.rules` applies these access patterns:

- Problem documents and their replies can be read publicly.
- Signed-in users can create a problem only with their own UID and the matching saved display name.
- Signed-in users can create replies only as themselves, with the matching display name and a valid length.
- Members can reserve a unique name and update their own public name through the username transaction.
- Problem owners can update or delete their own problem; reply authors can update or delete their own reply.
- Emails are not part of the public Firestore schemas.

Review the rules before modifying them. In particular, avoid broad rules such as `allow read, write: if true` or rules that allow unauthenticated writes.

## Pages

| Path | Description |
| --- | --- |
| `/` | Landing page and product walkthrough |
| `/auth`, `/auth/login`, `/auth/signup` | Google sign-in and public display-name selection |
| `/explore` | Live problem board with search, topic filters, and sorting |
| `/problems` | Alias for the Explore page |
| `/problems/new` | Problem composer and publishing flow |
| `/problems/[slug]` | Problem details and persistent replies |
| `/community` | Live community problem list, topic filters, and search |
| `/discover` | Developer opportunity feed backed by published problems |
| `/about` | About Itch |
| `/how-it-works` | Product walkthrough |
| `/community-guidelines` | Community participation guidance |
| `/privacy` | Privacy information |
| `/terms` | Terms and community expectations |
| `/contact` | Contact information (optional `NEXT_PUBLIC_CONTACT_EMAIL`) |
| `/thanks` | Signed-out thank-you page |

## Project structure

```text
src/
  app/                     Next.js routes and global styles
    auth/                  Google sign-in and name setup routes
    community/             Firestore-backed community feed
    discover/              Firestore-backed developer feed
    explore/               Firestore-backed problem board
    problems/new/          Problem composer
    problems/[slug]/       Problem and reply conversation
  components/
    auth/                  Authentication UI
    itch/                  Shared Itch header, cards, lists, and pages
    layout/                Route transitions and loading UI
  lib/
    firebase.js            Firebase initialization and public-name helpers
    mock-data.js           Static category metadata only
firestore.rules            Firestore security rules
firebase.json              Firebase CLI rules configuration
.env.example               Environment variable template
FIREBASE_SETUP.md          Firebase Console setup notes
```

## Commands

| Command | Purpose |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Start the development server on Next.js’s default port |
| `npm run dev -- --port 3002` | Start development server on port 3002 |
| `npm run build` | Create a production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run the configured Next.js lint command |
| `npx firebase-tools login` | Sign in to Firebase CLI |
| `npx firebase-tools deploy --only firestore:rules --project itch-9264a` | Deploy Firestore rules |

## Production deployment

The repository does not include a hosting-provider deployment configuration. For a Next.js host that supports a Node.js server:

1. Configure the required `NEXT_PUBLIC_FIREBASE_*` environment variables in the hosting project.
2. Build and serve the app with `npm run build` and `npm start`, or connect the repository to a Next.js-aware host that runs those commands.
3. Add the production hostname to Firebase Authentication’s authorized domains.
4. Confirm Firestore rules are deployed to the same Firebase project referenced by the hosting environment variables.

The Firestore web client rules are independent from the app hosting deployment; deploy them with Firebase CLI when the rules change.

## Current limitations

- Community topic follows are local browser preferences; they are not stored in Firestore or synced between devices.
- There is no profile page or profile-editing route in the current UI.
- Persisted “Me Too”, “Want this”, and builder-interest actions are not currently available.
- Published problems and replies are public. Do not store secrets, emails, or other private information in these documents.
- No admin moderation dashboard is included in this repository.

## Troubleshooting

### Port 3002 is already in use

The app may already be running. Open `http://localhost:3002` instead of starting a second server, or run another instance on another port:

```powershell
npm run dev -- --port 3003
```

### Firebase CLI reports a 403 for `serviceusage.services.use`

Check the account used by Firebase CLI:

```powershell
npx firebase-tools login:list
```

Confirm that account has access to the intended project. A project owner or IAM administrator may need to grant **Service Usage Consumer** (`roles/serviceusage.serviceUsageConsumer`) and the permissions required to publish Firebase Security Rules. Retry after the IAM change has propagated.

### The app reports “Missing or insufficient permissions”

1. Confirm `.env.local` points to the intended Firebase project.
2. Confirm the user is signed in and has completed display-name setup.
3. Confirm the latest `firestore.rules` has been deployed to that same project.
4. Review the browser console and Firebase rules if the error remains.

### Google sign-in is unavailable

- Confirm all required Firebase web config values exist in `.env.local`.
- Confirm Google is enabled in **Authentication → Sign-in method**.
- Confirm `localhost` or the deployed host is an authorized domain.
- Restart the Next.js server after editing `.env.local`.

### Explore is empty

Explore contains Firestore problem documents only. Publish a problem while signed in, then check that it appears in the same Firebase project configured in `.env.local`. An empty Explore page is expected before the first post.

## Demo and existing data

The hardcoded sample problem list and sample conversation replies have been removed from the application. The app does not automatically delete documents already present in Firestore. Review existing `problems` documents in the Firebase Console and delete only records you have positively identified as seed/demo content; this avoids deleting real member posts.

