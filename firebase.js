// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth/react-native";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFOyStae0OZ0y-AEANYdV6ErzT8532Q0M",
  authDomain: "refashion-47877.firebaseapp.com",
  projectId: "refashion-47877",
  storageBucket: "refashion-47877.appspot.com",
  messagingSenderId: "985897056012",
  appId: "1:985897056012:web:fba7fc788537786d0afb29",
  storageBucket: "gs://refashion-47877.appspot.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const storage = getStorage(app);
const db = getFirestore(app);
export { app, auth, storage, db };
