'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type LoadingMap = Record<string, boolean>;

type GlobalLoadingContextValue = {
  isLoading: boolean;
  setLoading: (key: string, active: boolean) => void;
  withLoading: <T>(key: string, task: () => Promise<T>) => Promise<T>;
};

const GlobalLoadingContext = createContext<GlobalLoadingContextValue | null>(null);

export function GlobalLoadingProvider({ children }: { children: ReactNode }) {
  const [loadingMap, setLoadingMap] = useState<LoadingMap>({});

  const setLoading = useCallback((key: string, active: boolean) => {
    setLoadingMap((prev) => {
      if (active) {
        return { ...prev, [key]: true };
      }

      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const withLoading = useCallback(
    async <T,>(key: string, task: () => Promise<T>) => {
      setLoading(key, true);
      try {
        return await task();
      } finally {
        setLoading(key, false);
      }
    },
    [setLoading]
  );

  const isLoading = Object.keys(loadingMap).length > 0;

  const value = useMemo(
    () => ({
      isLoading,
      setLoading,
      withLoading,
    }),
    [isLoading, setLoading, withLoading]
  );

  return (
    <GlobalLoadingContext.Provider value={value}>
      {children}
      {isLoading ? (
        <div className="fixed inset-0 z-[999] flex items-center justify-center">
          <div className="border-4 border-t-4 border-white border-t-transparent rounded-full w-16 h-16 animate-spin"></div>
        </div>
      ) : null}
    </GlobalLoadingContext.Provider>
  );
}

export function useGlobalLoading() {
  const context = useContext(GlobalLoadingContext);
  if (!context) {
    throw new Error('useGlobalLoading must be used within GlobalLoadingProvider');
  }
  return context;
}

