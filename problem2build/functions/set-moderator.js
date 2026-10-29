const { applicationDefault, initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

const uid = process.argv[2];
const action = process.argv[3] || 'grant';
const projectId = process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT;

if (!uid || !projectId || !['grant', 'revoke'].includes(action)) {
  process.stderr.write('Usage: node set-moderator.js <firebase-auth-uid> [grant|revoke]\nSet FIREBASE_PROJECT_ID and authenticate with Google Application Default Credentials first.\n');
  process.exit(1);
}

initializeApp({ credential: applicationDefault(), projectId });

async function main() {
  const auth = getAuth();
  const user = await auth.getUser(uid);
  const claims = { ...user.customClaims };
  if (action === 'grant') claims.moderator = true;
  else delete claims.moderator;
  await auth.setCustomUserClaims(uid, claims);
  process.stdout.write(`Moderator access ${action === 'grant' ? 'granted to' : 'revoked from'} ${uid} in ${projectId}. Sign out and back in to refresh the account token.\n`);
}

main().catch(error => {
  process.stderr.write(`Could not update moderator access: ${error.message}\n`);
  process.exitCode = 1;
});
