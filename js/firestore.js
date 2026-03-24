import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export async function addDomainToDB(data) {
  return await addDoc(collection(db, "domains"), data);
}

export async function getDomains() {
  return await getDocs(collection(db, "domains"));
}

export async function addUser(data) {
  return await addDoc(collection(db, "users"), data);
}