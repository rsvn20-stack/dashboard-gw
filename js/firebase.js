import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAYml7-V58EnkcHLZs_nM1jik67sla_jbE",
  authDomain: "dashboard-f24f3.firebaseapp.com",
  projectId: "dashboard-f24f3",
  storageBucket: "dashboard-f24f3.firebasestorage.app",
  messagingSenderId: "944792346729",
  appId: "1:944792346729:web:1eddfc128c1bb93cd842f8",
  measurementId: "G-XHGFNJ5Z3P"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);