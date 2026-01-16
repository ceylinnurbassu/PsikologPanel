import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Firebase yapılandırman (Sadece bir kez tanımlanmalı)
const firebaseConfig = {
  apiKey: "AIzaSyC52gKdsJlIbXN3RpeHgCFYQmRIVAX-13o",
  authDomain: "addictiontracker-aba95.firebaseapp.com",
  projectId: "addictiontracker-aba95",
  storageBucket: "addictiontracker-aba95.firebasestorage.app",
  messagingSenderId: "980460748209",
  appId: "1:980460748209:web:f873bde3ec3c867b62d190",
  measurementId: "G-R7VWD59P3V"
};

// Firebase Uygulamasını Başlat
const app = initializeApp(firebaseConfig);

// Servisleri dışa aktar (Export et)
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
export default app;