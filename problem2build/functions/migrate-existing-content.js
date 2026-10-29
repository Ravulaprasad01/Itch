const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { FieldPath, getFirestore } = require('firebase-admin/firestore');

const projectId = process.env.GCLOUD_PROJECT || process.env.FIREBASE_PROJECT_ID || 'itch-9264a';
const applyChanges = process.argv.includes('--apply');

initializeApp({ credential: applicationDefault(), projectId });
const db = getFirestore();

async function migrateCollection(collectionRef, label) {
  let cursor = null;
  let scanned = 0;
  let pending = [];
  let updated = 0;

  const commit = async () => {
    if (!pending.length || !applyChanges) {
      pending = [];
      return;
    }
    const batch = db.batch();
    pending.forEach(ref => batch.update(ref, { moderationStatus: 'visible' }));
    await batch.commit();
    updated += pending.length;
    pending = [];
  };

  while (true) {
    let pageQuery = collectionRef.orderBy(FieldPath.documentId()).limit(300);
    if (cursor) pageQuery = pageQuery.startAfter(cursor);
    const page = await pageQuery.get();
    if (page.empty) break;

    for (const item of page.docs) {
      scanned += 1;
      // Preserve any explicit hidden or already reviewed state.
      if (item.data().moderationStatus === undefined) pending.push(item.ref);
      if (pending.length >= 300) await commit();
    }
    cursor = page.docs[page.docs.length - 1];
    if (page.size < 300) break;
  }

  const wouldUpdate = updated + pending.length;
  await commit();
  console.log(`${label}: scanned ${scanned}; ${applyChanges ? `marked ${updated} visible` : `${wouldUpdate} need visibility status`}.`);
  return wouldUpdate;
}

async function main() {
  console.log(`Project: ${projectId}`);
  if (!applyChanges) console.log('DRY RUN: no documents will be changed. Add --apply to write.');

  const problems = await migrateCollection(db.collection('problems'), 'Problems');
  let replies = 0;
  const problemPageSize = 300;
  let cursor = null;
  while (true) {
    let pageQuery = db.collection('problems').orderBy(FieldPath.documentId()).limit(problemPageSize);
    if (cursor) pageQuery = pageQuery.startAfter(cursor);
    const page = await pageQuery.get();
    if (page.empty) break;
    for (const problem of page.docs) {
      replies += await migrateCollection(problem.ref.collection('replies'), `Replies for ${problem.id}`);
    }
    cursor = page.docs[page.docs.length - 1];
    if (page.size < problemPageSize) break;
  }
  console.log(`Done. ${problems} problem(s) and ${replies} reply/replies ${applyChanges ? 'updated' : 'need migration'}.`);
}

main().catch(error => {
  console.error('Migration failed. Check your Google Cloud credentials and Firestore access.');
  console.error(error.message);
  process.exitCode = 1;
});
