import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  setDoc,
  type Firestore,
} from 'firebase/firestore';
import { db } from '@/app/firebase/config';
import { LESSON_DEFAULT_FIELDS } from '@/lib/lesson-progress';

function normalizeUsername(raw: string): string {
  return raw.trim().toLowerCase();
}

export function defaultUsernameFromEmail(email: string | null | undefined): string {
  const safeEmail = (email || '').trim();
  const [prefix] = safeEmail.split('@');
  const normalizedPrefix = (prefix || '').trim();
  return normalizedPrefix || 'Guest';
}

export function validateUsername(raw: string): string | null {
  const username = raw.trim();
  if (username.length < 3 || username.length > 20) {
    return 'Username must be 3-20 characters.';
  }
  if (!/^[a-zA-Z0-9._-]+$/.test(username)) {
    return 'Only letters, numbers, dot, underscore, and dash are allowed.';
  }
  return null;
}

export async function setStatsDisplayName(params: {
  uid: string;
  displayName: string;
  firestore?: Firestore;
}) {
  const { uid, displayName, firestore = db } = params;
  const trimmed = displayName.trim();
  if (!trimmed) {
    throw new Error('Missing username.');
  }

  const statsRef = doc(firestore, 'stats', uid);
  await setDoc(
    statsRef,
    {
      displayName: trimmed,
      codeFixerStars: 0,
      timeAttackStars: 0,
      totalStars: 0,
      codeFixerBestTimeMs: 0,
      timeAttackBestTimeMs: 0,
      ...LESSON_DEFAULT_FIELDS,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function getProfileUsername(uid: string, firestore: Firestore = db): Promise<string | null> {
  const statsRef = doc(firestore, 'stats', uid);
  const snap = await getDoc(statsRef);
  if (!snap.exists()) {
    return null;
  }
  const data = snap.data() as { displayName?: string };
  const displayName = (data.displayName || '').trim();
  return displayName.length > 0 ? displayName : null;
}

export async function claimUsername(params: {
  uid: string;
  username: string;
  firestore?: Firestore;
}) {
  const { uid, username, firestore = db } = params;
  const trimmed = username.trim();
  const normalized = normalizeUsername(trimmed);
  const validationError = validateUsername(trimmed);
  if (validationError) {
    throw new Error(validationError);
  }

  const usernameRef = doc(firestore, 'usernames', normalized);
  const statsRef = doc(firestore, 'stats', uid);

  await runTransaction(firestore, async (tx) => {
    const usernameSnap = await tx.get(usernameRef);
    const statsSnap = await tx.get(statsRef);

    if (usernameSnap.exists()) {
      const data = usernameSnap.data() as { uid?: string };
      if (data.uid !== uid) {
        throw new Error('Username already taken.');
      }
    }

    tx.set(
      usernameRef,
      {
        uid,
        username: trimmed,
        usernameLower: normalized,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );

    if (statsSnap.exists()) {
      tx.update(statsRef, {
        displayName: trimmed,
        updatedAt: serverTimestamp(),
      });
    } else {
      tx.set(statsRef, {
        displayName: trimmed,
        codeFixerStars: 0,
        timeAttackStars: 0,
        totalStars: 0,
        codeFixerBestTimeMs: 0,
        timeAttackBestTimeMs: 0,
        ...LESSON_DEFAULT_FIELDS,
        updatedAt: serverTimestamp(),
      });
    }
  });
}
