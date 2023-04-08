import { initializeApp, type FirebaseOptions } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAuth } from "firebase/auth";

const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'orders-app-baas.firebaseapp.com',
  projectId: 'orders-app-baas',
  storageBucket: 'orders-app-baas.appspot.com',
  messagingSenderId: '937830232499',
  appId: '1:937830232499:web:886711530abc42e2e8dbc6',
  measurementId: 'G-XMK7075KBY',
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// export const auth = getAuth(app);
export const auth = {};
