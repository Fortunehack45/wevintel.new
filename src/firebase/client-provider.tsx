'use client';

import { app } from './config';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { FirebaseProvider as CoreFirebaseProvider } from './provider';

const firebaseApp = app;
const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  return (
    <CoreFirebaseProvider
      firebaseApp={firebaseApp}
      auth={auth}
      firestore={firestore}
    >
      {children}
    </CoreFirebaseProvider>
  );
}
