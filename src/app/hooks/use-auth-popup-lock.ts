'use client';

import { useEffect, useState } from 'react';

const AUTH_POPUP_LOCK_KEY = 'auth-popup-lock';
const AUTH_POPUP_LOCK_EVENT = 'auth-popup-lock-change';

function readAuthPopupLock() {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.sessionStorage.getItem(AUTH_POPUP_LOCK_KEY) === 'true';
}

export function setAuthPopupLock(active: boolean) {
  if (typeof window === 'undefined') {
    return;
  }

  if (active) {
    window.sessionStorage.setItem(AUTH_POPUP_LOCK_KEY, 'true');
  } else {
    window.sessionStorage.removeItem(AUTH_POPUP_LOCK_KEY);
  }

  window.dispatchEvent(new Event(AUTH_POPUP_LOCK_EVENT));
}

export function useAuthPopupLock() {
  const [isAuthPopupLocked, setIsAuthPopupLocked] = useState(false);

  useEffect(() => {
    const syncLock = () => {
      setIsAuthPopupLocked(readAuthPopupLock());
    };

    syncLock();
    window.addEventListener(AUTH_POPUP_LOCK_EVENT, syncLock);
    window.addEventListener('storage', syncLock);

    return () => {
      window.removeEventListener(AUTH_POPUP_LOCK_EVENT, syncLock);
      window.removeEventListener('storage', syncLock);
    };
  }, []);

  return isAuthPopupLocked;
}
