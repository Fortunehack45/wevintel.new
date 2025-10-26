'use client';
import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  type User,
} from 'firebase/auth';
import { app } from './config';

const auth = getAuth(app);

// Sign in a user anonymously
const signInPromise = signInAnonymously(auth);

export function useAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in.
      callback(user);
    } else {
      // User is signed out.
      signInPromise.then(() => callback(auth.currentUser));
    }
  });
}
