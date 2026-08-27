/*
 * Maly store nad localStorage dla useSyncExternalStore.
 *
 * Powod istnienia: wzorzec "pusty useState + setState w useEffect" laduje bledem
 * react-hooks/set-state-in-effect i powoduje kaskadowe renderowanie. localStorage to
 * zrodlo zewnetrzne, wiec komponent powinien je czytac przez snapshot.
 *
 * Snapshot MUSI byc cache'owany — useSyncExternalStore wpada w nieskonczona petle,
 * jesli getSnapshot zwraca nowa referencje przy kazdym wywolaniu.
 */

const UNSET = Symbol("unset");

export interface LocalStorageStore<T> {
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => T;
  getServerSnapshot: () => T;
  set: (value: T) => void;
}

/**
 * @param key klucz w localStorage
 * @param fallback wartosc dla SSR i dla nieczytelnych/pustych danych.
 *   Musi byc stala modulowa — nowy literal przy kazdym renderze zerwie stabilnosc snapshotu.
 */
export function createLocalStorageStore<T>(key: string, fallback: T): LocalStorageStore<T> {
  let cache: T | typeof UNSET = UNSET;
  const listeners = new Set<() => void>();

  function emit() {
    for (const listener of listeners) listener();
  }

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },

    getSnapshot() {
      if (cache === UNSET) {
        try {
          if (typeof window === "undefined") return fallback;
          const stored = localStorage.getItem(key);
          cache = stored ? (JSON.parse(stored) as T) : fallback;
        } catch {
          cache = fallback;
        }
      }
      return cache as T;
    },

    getServerSnapshot() {
      return fallback;
    },

    set(value) {
      cache = value;
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // localStorage unavailable
      }
      emit();
    },
  };
}
