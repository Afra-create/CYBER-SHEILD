import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD74w-5-Dm4nZcbZBtNnXD_w6TR7fBhjNY",
  authDomain: "cyberangle.firebaseapp.com",
  projectId: "cyberangle",
  storageBucket: "cyberangle.firebasestorage.app",
  messagingSenderId: "112246049641",
  appId: "1:112246049641:web:c94541b0f8273aed7c4bf8",
  measurementId: "G-QYGDYV7B6M"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Analytics conditionally to avoid errors during SSR or if not supported
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
