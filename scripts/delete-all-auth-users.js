/* eslint-disable no-console */
/**
 * Deletes all Firebase Authentication users in batches.
 *
 * Usage:
 *   node scripts/delete-all-auth-users.js --dry-run
 *   node scripts/delete-all-auth-users.js --yes
 *
 * Credentials:
 *   Uses FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY if provided,
 *   otherwise falls back to Google Application Default Credentials.
 */

const PAGE_SIZE = 1000;

function hasFlag(flag) {
  return process.argv.includes(flag);
}

function ensureAdminInstalled() {
  try {
    // eslint-disable-next-line global-require, import/no-extraneous-dependencies
    return require('firebase-admin');
  } catch (_err) {
    console.error('Missing dependency: firebase-admin');
    console.error('Install it with: npm install firebase-admin');
    process.exit(1);
  }
}

function initAdmin(admin) {
  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;

  if (admin.apps.length > 0) {
    return admin.app();
  }

  if (FIREBASE_PROJECT_ID && FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY) {
    return admin.initializeApp({
      credential: admin.credential.cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
  }

  return admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

async function collectAllUids(adminAuth) {
  const uids = [];
  let nextPageToken = undefined;

  do {
    const page = await adminAuth.listUsers(PAGE_SIZE, nextPageToken);
    for (const user of page.users) {
      uids.push(user.uid);
    }
    nextPageToken = page.pageToken;
  } while (nextPageToken);

  return uids;
}

async function main() {
  const dryRun = hasFlag('--dry-run') || !hasFlag('--yes');
  const admin = ensureAdminInstalled();
  initAdmin(admin);
  const adminAuth = admin.auth();

  const uids = await collectAllUids(adminAuth);
  console.log(`Found ${uids.length} auth user(s).`);

  if (uids.length === 0) {
    return;
  }

  if (dryRun) {
    console.log('Dry run only. No users were deleted.');
    console.log('Run with --yes to actually delete all users.');
    return;
  }

  let successCount = 0;
  let failureCount = 0;

  for (let i = 0; i < uids.length; i += PAGE_SIZE) {
    const chunk = uids.slice(i, i + PAGE_SIZE);
    // deleteUsers supports up to 1000 UIDs per call.
    // eslint-disable-next-line no-await-in-loop
    const result = await adminAuth.deleteUsers(chunk);
    successCount += result.successCount;
    failureCount += result.failureCount;
    console.log(
      `Processed ${Math.min(i + PAGE_SIZE, uids.length)}/${uids.length} | deleted=${successCount} failed=${failureCount}`
    );
  }

  console.log(`Done. Deleted ${successCount} user(s). Failed: ${failureCount}.`);
}

main().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});

