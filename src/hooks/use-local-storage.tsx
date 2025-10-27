
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

// Custom hook to handle local storage with SSR safety
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const readValue = useCallback((): T => {
    if (!isClient) {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  }, [isClient, key, initialValue]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    if (!isClient) {
      console.warn(`Tried setting localStorage key “${key}” even though environment is not a client`);
      return;
    }

    try {
      const valueToStore = value instanceof Function ? value(readValue()) : value;
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      setStoredValue(valueToStore);
      window.dispatchEvent(new CustomEvent('local-storage-change', { detail: { key } }));
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error);
    }
  }, [isClient, key, readValue]);

  useEffect(() => {
    if (isClient) {
      setStoredValue(readValue());
    }
  }, [isClient, readValue]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
        if (event.key === key) {
            setStoredValue(readValue());
        }
    };
    const handleCustomEvent = (event: Event) => {
        const customEvent = event as CustomEvent;
        if (customEvent.detail.key === key) {
            setStoredValue(readValue());
        }
    }
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('local-storage-change', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage-change', handleCustomEvent);
    };
  }, [key, readValue]);

  return [storedValue, setValue];
}
