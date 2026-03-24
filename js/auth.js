import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

export async function register(email, pass) {
  return await createUserWithEmailAndPassword(auth, email, pass);
}

export async function login(email, pass) {
  return await signInWithEmailAndPassword(auth, email, pass);
}

export async function logoutUser() {
  return await signOut(auth);
}

export function listenAuth(callback) {
  onAuthStateChanged(auth, callback);
}