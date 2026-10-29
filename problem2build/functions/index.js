const { initializeApp } = require('firebase-admin/app');
const { FieldPath, FieldValue, getFirestore, Timestamp } = require('firebase-admin/firestore');
const { HttpsError, onCall } = require('firebase-functions/v2/https');
const { createHash } = require('node:crypto');

initializeApp();
const db = getFirestore();

const CATEGORIES = new Set([
  'Productivity',
  'Developer Tools',
  'Finance & Tax',
  'Health & Fitness',
  'Local & Community',
  'Creative',
  'Audio & Video',
]);
const FREQUENCIES = new Set(['Daily', 'Weekly', 'Monthly', 'Rarely']);
const PRIORITIES = new Set(['Low', 'Medium', 'High']);
const FUNDING_CURRENCIES = new Set(['INR', 'USD', 'GBP', 'EUR']);
const PROBLEM_COOLDOWN_MS = 30_000;
const REPLY_COOLDOWN_MS = 5_000;
const REPORT_COOLDOWN_MS = 10_000;
const REPORT_REASONS = new Set(['spam', 'harassment', 'private-info', 'misleading', 'other']);

function requireUser(request) {
  if (!request.auth?.uid) {
    throw new HttpsError('unauthenticated', 'Sign in to continue.');
  }
  return request.auth.uid;
}

function requiredText(value, field, min, max) {
  if (typeof value !== 'string') {
    throw new HttpsError('invalid-argument', `Invalid ${field}.`);
  }
  const text = value.trim();
  if (text.length < min || text.length > max || /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(text)) {
    throw new HttpsError('invalid-argument', `Invalid ${field}.`);
  }
  return text;
}

function optionalText(value, field, max) {
  if (value === undefined || value === null) return '';
  if (typeof value !== 'string' || value.trim().length > max || /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(value)) {
    throw new HttpsError('invalid-argument', `Invalid ${field}.`);
  }
  return value.trim();
}

function requireChoice(value, options, field) {
  if (typeof value !== 'string' || !options.has(value)) {
    throw new HttpsError('invalid-argument', `Invalid ${field}.`);
  }
  return value;
}

function enforceCooldown(rateData, field, cooldownMs) {
  const previous = rateData?.[field];
  if (previous instanceof Timestamp && Date.now() - previous.toMillis() < cooldownMs) {
    throw new HttpsError('resource-exhausted', 'Please wait before trying again.');
  }
}

function requireModerator(request) {
  if (!request.auth?.uid || request.auth.token.moderator !== true) {
    throw new HttpsError('permission-denied', 'Moderator access is required.');
  }
  return request.auth.uid;
}

function reportDocumentId(uid, targetType, problemId, targetId) {
  return createHash('sha256').update(`${uid}:${targetType}:${problemId}:${targetId}`).digest('hex');
}


const callableOptions = {
  region: 'us-central1',
  enforceAppCheck: true,
  maxInstances: 10,
  memory: '256MiB',
};

exports.createProblem = onCall(callableOptions, async request => {
  const uid = requireUser(request);
  const input = request.data || {};
  const title = requiredText(input.title, 'title', 10, 120);
  const description = requiredText(input.description, 'description', 20, 600);
  const category = requireChoice(input.category, CATEGORIES, 'category');
  const frequency = requireChoice(input.frequency, FREQUENCIES, 'frequency');
  const priority = requireChoice(input.priority, PRIORITIES, 'priority');
  const audience = optionalText(input.audience, 'audience', 200);
  const workaround = optionalText(input.workaround, 'workaround', 400);
  if (input.fundingInterest !== undefined && typeof input.fundingInterest !== 'boolean') {
    throw new HttpsError('invalid-argument', 'Invalid funding interest.');
  }
  const fundingInterest = input.fundingInterest === true;
  const fundingCurrency = requireChoice(input.fundingCurrency || 'INR', FUNDING_CURRENCIES, 'funding currency');
  const fundingAmount = input.fundingAmount === undefined || input.fundingAmount === null || input.fundingAmount === ''
    ? null
    : input.fundingAmount;
  if (fundingAmount !== null && (
    !fundingInterest
    || typeof fundingAmount !== 'number'
    || !Number.isFinite(fundingAmount)
    || fundingAmount < 1
    || fundingAmount > 1_000_000
    || Math.abs(fundingAmount * 100 - Math.round(fundingAmount * 100)) > 1e-7
  )) {
    throw new HttpsError('invalid-argument', 'Invalid potential contribution amount.');
  }

  const userRef = db.doc(`users/${uid}`);
  const rateRef = db.doc(`rateLimits/${uid}`);
  const problemRef = db.collection('problems').doc();

  await db.runTransaction(async transaction => {
    const [userSnapshot, rateSnapshot] = await Promise.all([
      transaction.get(userRef),
      transaction.get(rateRef),
    ]);
    if (!userSnapshot.exists || typeof userSnapshot.data().displayName !== 'string') {
      throw new HttpsError('failed-precondition', 'Finish setting up your Itch profile first.');
    }
    enforceCooldown(rateSnapshot.data(), 'lastProblemAt', PROBLEM_COOLDOWN_MS);

    transaction.set(rateRef, { lastProblemAt: FieldValue.serverTimestamp() }, { merge: true });
    transaction.create(problemRef, {
      title,
      description,
      category,
      frequency,
      priority,
      audience,
      workaround,
      fundingInterest,
      fundingAmount,
      fundingCurrency,
      authorId: uid,
      authorName: userSnapshot.data().displayName,
      status: 'open',
      moderationStatus: 'visible',
      meTooCount: 0,
      wantThisCount: 0,
      devInterestCount: 0,
      createdAt: FieldValue.serverTimestamp(),
    });
  });

  return { id: problemRef.id };
});

exports.markProblemMeToo = onCall(callableOptions, async request => {
  const uid = requireUser(request);
  const problemId = requiredText(request.data?.problemId, 'problem ID', 1, 128);
  if (!/^[A-Za-z0-9_-]{1,128}$/.test(problemId)) {
    throw new HttpsError('invalid-argument', 'Invalid problem ID.');
  }
  const problemRef = db.doc(`problems/${problemId}`);
  const signalRef = problemRef.collection('affectedSignals').doc(uid);

  return db.runTransaction(async transaction => {
    const [problemSnapshot, signalSnapshot] = await Promise.all([
      transaction.get(problemRef),
      transaction.get(signalRef),
    ]);
    if (!problemSnapshot.exists) {
      throw new HttpsError('not-found', 'This problem is no longer available.');
    }

    const currentCount = Number.isSafeInteger(problemSnapshot.data().meTooCount)
      ? problemSnapshot.data().meTooCount
      : 0;
    if (signalSnapshot.exists) {
      return { alreadyMarked: true, count: currentCount };
    }

    transaction.create(signalRef, { createdAt: FieldValue.serverTimestamp() });
    transaction.update(problemRef, { meTooCount: FieldValue.increment(1) });
    return { alreadyMarked: false, count: currentCount + 1 };
  });
});

exports.createReply = onCall(callableOptions, async request => {
  const uid = requireUser(request);
  const problemId = requiredText(request.data?.problemId, 'problem ID', 1, 128);
  if (!/^[A-Za-z0-9_-]{1,128}$/.test(problemId)) {
    throw new HttpsError('invalid-argument', 'Invalid problem ID.');
  }
  const text = requiredText(request.data?.text, 'reply', 1, 2000);

  const userRef = db.doc(`users/${uid}`);
  const rateRef = db.doc(`rateLimits/${uid}`);
  const problemRef = db.doc(`problems/${problemId}`);
  const replyRef = problemRef.collection('replies').doc();

  await db.runTransaction(async transaction => {
    const [userSnapshot, rateSnapshot, problemSnapshot] = await Promise.all([
      transaction.get(userRef),
      transaction.get(rateRef),
      transaction.get(problemRef),
    ]);
    if (!problemSnapshot.exists) {
      throw new HttpsError('not-found', 'This problem is no longer available.');
    }
    if (!userSnapshot.exists || typeof userSnapshot.data().displayName !== 'string') {
      throw new HttpsError('failed-precondition', 'Finish setting up your Itch display name first.');
    }
    enforceCooldown(rateSnapshot.data(), 'lastReplyAt', REPLY_COOLDOWN_MS);

    transaction.set(rateRef, { lastReplyAt: FieldValue.serverTimestamp() }, { merge: true });
    transaction.create(replyRef, {
      authorId: uid,
      authorName: userSnapshot.data().displayName,
      authorRole: userSnapshot.data().accountType === 'developer' ? 'developer' : 'member',
      text,
      moderationStatus: 'visible',
      createdAt: FieldValue.serverTimestamp(),
    });
  });

  return { id: replyRef.id };
});

exports.reportContent = onCall(callableOptions, async request => {
  const uid = requireUser(request);
  const targetType = requireChoice(request.data?.targetType, new Set(['problem', 'reply']), 'content type');
  const problemId = requiredText(request.data?.problemId, 'problem ID', 1, 128);
  const targetId = requiredText(request.data?.targetId, 'content ID', 1, 128);
  const reason = requireChoice(request.data?.reason, REPORT_REASONS, 'report reason');
  if (!/^[A-Za-z0-9_-]{1,128}$/.test(problemId) || !/^[A-Za-z0-9_-]{1,128}$/.test(targetId)) {
    throw new HttpsError('invalid-argument', 'Invalid content reference.');
  }
  if (targetType === 'problem' && targetId !== problemId) {
    throw new HttpsError('invalid-argument', 'Invalid problem reference.');
  }

  const targetRef = targetType === 'problem'
    ? db.doc(`problems/${problemId}`)
    : db.doc(`problems/${problemId}/replies/${targetId}`);
  const reportRef = db.doc(`reports/${reportDocumentId(uid, targetType, problemId, targetId)}`);
  const rateRef = db.doc(`rateLimits/${uid}`);
  return db.runTransaction(async transaction => {
    const [targetSnapshot, reportSnapshot, rateSnapshot] = await Promise.all([
      transaction.get(targetRef), transaction.get(reportRef), transaction.get(rateRef),
    ]);
    if (!targetSnapshot.exists || targetSnapshot.data().moderationStatus === 'hidden') {
      throw new HttpsError('not-found', 'This content is no longer available.');
    }
    if (reportSnapshot.exists) return { alreadyReported: true };
    enforceCooldown(rateSnapshot.data(), 'lastReportAt', REPORT_COOLDOWN_MS);
    transaction.set(rateRef, { lastReportAt: FieldValue.serverTimestamp() }, { merge: true });
    transaction.create(reportRef, {
      targetType, problemId, targetId, reason,
      reporterId: uid,
      status: 'open',
      createdAt: FieldValue.serverTimestamp(),
    });
    return { alreadyReported: false };
  });
});

exports.reviewReport = onCall(callableOptions, async request => {
  const moderatorId = requireModerator(request);
  const reportId = requiredText(request.data?.reportId, 'report ID', 64, 64);
  const action = requireChoice(request.data?.action, new Set(['hide', 'restore', 'dismiss']), 'moderation action');
  if (!/^[a-f0-9]{64}$/.test(reportId)) throw new HttpsError('invalid-argument', 'Invalid report ID.');
  const reportRef = db.doc(`reports/${reportId}`);

  return db.runTransaction(async transaction => {
    const reportSnapshot = await transaction.get(reportRef);
    if (!reportSnapshot.exists) throw new HttpsError('not-found', 'This report no longer exists.');
    const report = reportSnapshot.data();
    if (!['problem', 'reply'].includes(report.targetType)
      || typeof report.problemId !== 'string'
      || typeof report.targetId !== 'string'
      || !/^[A-Za-z0-9_-]{1,128}$/.test(report.problemId)
      || !/^[A-Za-z0-9_-]{1,128}$/.test(report.targetId)) {
      throw new HttpsError('failed-precondition', 'This report has an invalid content reference.');
    }
    const targetRef = report.targetType === 'problem'
      ? db.doc(`problems/${report.problemId}`)
      : db.doc(`problems/${report.problemId}/replies/${report.targetId}`);
    const targetSnapshot = action === 'dismiss' ? null : await transaction.get(targetRef);
    if (action === 'hide' && !targetSnapshot.exists) {
      throw new HttpsError('not-found', 'The reported content no longer exists.');
    }
    if (action === 'hide') transaction.update(targetRef, { moderationStatus: 'hidden' });
    if (action === 'restore') {
      if (!targetSnapshot?.exists) throw new HttpsError('not-found', 'The reported content no longer exists.');
      transaction.update(targetRef, { moderationStatus: 'visible' });
    }
    transaction.update(reportRef, {
      status: action === 'dismiss' ? 'dismissed' : action === 'hide' ? 'actioned' : 'restored',
      reviewedBy: moderatorId,
      reviewedAt: FieldValue.serverTimestamp(),
    });
    return { status: action === 'dismiss' ? 'dismissed' : action === 'hide' ? 'actioned' : 'restored' };
  });
});

exports.initializeModerationStatus = onCall(callableOptions, async request => {
  requireModerator(request);
  let migratedProblems = 0;
  let migratedReplies = 0;
  let batch = db.batch();
  let pendingWrites = 0;
  const commitIfFull = async () => {
    if (pendingWrites >= 400) {
      await batch.commit();
      batch = db.batch();
      pendingWrites = 0;
    }
  };

  for (const [collectionRef, kind] of [[db.collection('problems'), 'problem'], [db.collectionGroup('replies'), 'reply']]) {
    let cursor = null;
    while (true) {
      let pageQuery = collectionRef.orderBy(FieldPath.documentId()).limit(400);
      if (cursor) pageQuery = pageQuery.startAfter(cursor);
      const page = await pageQuery.get();
      if (page.empty) break;
      for (const item of page.docs) {
        if (item.data().moderationStatus === undefined) {
          batch.update(item.ref, { moderationStatus: 'visible' });
          pendingWrites += 1;
          if (kind === 'problem') migratedProblems += 1;
          else migratedReplies += 1;
          await commitIfFull();
        }
      }
      cursor = page.docs[page.docs.length - 1];
      if (page.size < 400) break;
    }
  }
  if (pendingWrites) await batch.commit();
  return { migratedProblems, migratedReplies };
});
