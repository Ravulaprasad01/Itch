export function problemFeedErrorMessage(error) {
  if (error?.code === 'permission-denied') {
    return 'Firestore denied the public feed. Deploy the current firestore.rules and migrate older posts; see MODERATION_SETUP.md.';
  }
  if (error?.code === 'failed-precondition') {
    return 'The Firestore feed index is missing. Deploy firestore.indexes.json, then refresh.';
  }
  if (error?.code === 'unavailable' || error?.code === 'network-request-failed') {
    return 'Could not reach Firebase. Check your connection and try again.';
  }
  return 'Could not load problems. Check Firebase setup and try again.';
}
