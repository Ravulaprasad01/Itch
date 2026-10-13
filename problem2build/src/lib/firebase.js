import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc, getFirestore, runTransaction, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  ...(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? { storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET } : {}),
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId,
);

const app = typeof window !== 'undefined' && isFirebaseConfigured
  ? (getApps().length ? getApp() : initializeApp(firebaseConfig))
  : null;

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export function getPublicDisplayName(user) {
  const accountName = user?.displayName?.trim();
  if (accountName) return accountName;
  const userId = String(user?.uid || '').replace(/[^a-zA-Z0-9]/g, '');
  return userId ? `user-${userId.slice(-6).toLowerCase()}` : 'user-guest';
}

export function normalizeDisplayName(value) {
  return String(value || '').trim().replace(/\s+/g, ' ').toLocaleLowerCase('en-US');
}

function nameKeyFor(value) {
  return normalizeDisplayName(value);
}

export async function isDisplayNameAvailable(displayName, uid) {
  if (!db) throw new Error('Firebase is not configured.');
  const normalized = normalizeDisplayName(displayName);
  if (!normalized) return false;
  const snapshot = await getDoc(doc(db, 'usernames', nameKeyFor(normalized)));
  return !snapshot.exists() || snapshot.data().uid === uid;
}

export async function savePublicDisplayName(user, displayName) {
  if (!db || !user?.uid) throw new Error('Firebase is not configured.');
  const name = String(displayName || '').trim().replace(/\s+/g, ' ');
  if (!/^[\p{L}\p{N}][\p{L}\p{N}._ -]{1,29}$/u.test(name)) {
    throw new Error('Use 2–30 letters, numbers, spaces, dots, underscores, or hyphens.');
  }

  const userRef = doc(db, 'users', user.uid);
  const nextNameKey = nameKeyFor(name);
  const nextUsernameRef = doc(db, 'usernames', nextNameKey);

  return runTransaction(db, async transaction => {
    const [profileSnapshot, nextUsernameSnapshot] = await Promise.all([
      transaction.get(userRef),
      transaction.get(nextUsernameRef),
    ]);
    const previousProfile = profileSnapshot.exists() ? profileSnapshot.data() : null;
    const previousNameKey = previousProfile?.nameKey || (previousProfile?.displayName ? nameKeyFor(previousProfile.displayName) : null);
    const previousUsernameRef = previousNameKey && previousNameKey !== nextNameKey
      ? doc(db, 'usernames', previousNameKey)
      : null;
    const previousUsernameSnapshot = previousUsernameRef ? await transaction.get(previousUsernameRef) : null;

    if (nextUsernameSnapshot.exists() && nextUsernameSnapshot.data().uid !== user.uid) {
      const error = new Error('That name is already in use. Try another one.');
      error.code = 'display-name/taken';
      throw error;
    }

    if (!nextUsernameSnapshot.exists()) {
      transaction.set(nextUsernameRef, { uid: user.uid });
    }
    if (previousUsernameRef && previousUsernameSnapshot?.exists() && previousUsernameSnapshot.data().uid === user.uid) {
      transaction.delete(previousUsernameRef);
    }
    transaction.set(userRef, {
      displayName: name,
      nameKey: nextNameKey,
      ...(previousProfile ? {} : { createdAt: serverTimestamp() }),
    }, { merge: true });

    return { displayName: name, nameKey: nextNameKey };
  });
}

export async function ensurePublicUser(user) {
  if (!db || !user?.uid) throw new Error('Firebase is not configured.');
  const userRef = doc(db, 'users', user.uid);
  const existing = await getDoc(userRef);
  const displayName = existing.exists() && existing.data().displayName
    ? existing.data().displayName
    : getPublicDisplayName(user);
  return savePublicDisplayName(user, displayName);
}
