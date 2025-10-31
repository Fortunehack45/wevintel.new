'use client';
import {
  getAuth,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { app } from './config';

const auth = getAuth(app);

export function useAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
}
