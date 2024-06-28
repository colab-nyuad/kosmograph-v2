//@ts-nocheck


// utils/localStorageAtom.ts
import { atom } from 'jotai';

export const atomWithLocalStorage = (key, initialValue) => {
  const baseAtom = atom(
    (get) => {
      if (typeof window !== 'undefined') {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      }
      return initialValue;
    },
    (get, set, newValue) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(newValue));
      }
      set(baseAtom, newValue);
    }
  );
  return baseAtom;
};
