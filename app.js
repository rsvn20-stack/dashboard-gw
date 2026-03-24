// IMPORT FIREBASE
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// CONFIG (GANTI PUNYA LU)
const firebaseConfig = {
  apiKey: "AIzaSyAYml7-V58EnkcHLZs_nM1jik67sla_jbE",
  authDomain: "dashboard-f24f3.firebaseapp.com",
  projectId: "dashboard-f24f3",
  storageBucket: "dashboard-f24f3.firebasestorage.app",
  messagingSenderId: "944792346729",
  appId: "1:944792346729:web:1eddfc128c1bb93cd842f8",
  measurementId: "G-XHGFNJ5Z3P"
};

// INIT
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// AUTH CHECK 
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  const path = window.location.pathname;

  // kalau belum login & bukan di root → paksa ke login (/)
  if (!user && path !== "/" && path !== "/index.html") {
    window.location.href = "/";
  }

  // kalau sudah login tapi masih di login page → masuk dashboard
  if (user && (path === "/" || path === "/index.html")) {
    window.location.href = "/dashboard.html";
  }
});

// REGISTER
window.register = function () {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, pass)
    .then(() => alert("Register berhasil"))
    .catch(e => alert(e.message));
};

// LOGIN
window.login = function () {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, pass)
    .then(() => {
      window.location.href = "/dashboard.html";
    })
    .catch(e => alert(e.message));
};

// LOGOUT
window.logout = function () {
  signOut(auth)
    .then(() => {
      console.log("Logout berhasil");
      window.location.href = "/";
    })
    .catch(err => {
      console.log(err);
    });
};

// TAMBAH DOMAIN
window.addDomain = async function () {
  const input = document.getElementById("domainInput");

  await addDoc(collection(db, "domains"), {
    name: input.value
  });

  input.value = "";
  loadDomains();
};

// LOAD DOMAIN
async function loadDomains() {
  const list = document.getElementById("list");
  if (!list) return;

  list.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "domains"));

  querySnapshot.forEach(doc => {
    list.innerHTML += `<li>${doc.data().name}</li>`;
  });
}

// AUTO LOAD
loadDomains();