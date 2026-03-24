// IMPORT FIREBASE
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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
let isRegister = false;
let isRegistering = false;

// TOGGLE MODE
window.toggleMode = function () {
  isRegister = !isRegister;

  const username = document.getElementById("username");
  const submitBtn = document.getElementById("submitBtn");
  const toggleBtn = document.getElementById("toggleBtn");

  if (isRegister) {
    username.style.display = "block";
    submitBtn.innerText = "Register";
    toggleBtn.innerText = "Back to Login";
  } else {
    username.style.display = "none";
    submitBtn.innerText = "Login";
    toggleBtn.innerText = "Register";
  }
};

onAuthStateChanged(auth, (user) => {
  const path = window.location.pathname;
  const justRegistered = localStorage.getItem("justRegistered");

  // 🚫 STOP semua redirect kalau habis register
  if (justRegistered === "true") return;

  if (!user && path !== "/") {
    window.location.href = "/";
  }

  if (user && path === "/") {
    window.location.href = "/dashboard/";
  }
});

// SUBMIT FORM (LOGIN / REGISTER)
window.submitForm = async function () {
  const email = document.getElementById("email").value.trim();
  const pass = document.getElementById("password").value.trim();
  const usernameInput = document.getElementById("username");
  const username = usernameInput ? usernameInput.value.trim() : "";

  // VALIDASI
  if (!email || !pass) {
    alert("Email & Password wajib diisi");
    return;
  }

  if (isRegister && !username) {
    alert("Username wajib diisi");
    return;
  }

  try {
  const btn = document.getElementById("submitBtn");
  btn.disabled = true;

if (isRegister) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);

  await addDoc(collection(db, "users"), {
    uid: userCredential.user.uid,
    email: email,
    username: username,
    createdAt: new Date()
  });

  // 🚫 tahan redirect
  localStorage.setItem("justRegistered", "true");

  await signOut(auth);

  alert("Register berhasil, silakan login");

  localStorage.removeItem("justRegistered"); // 🔥 hapus setelah selesai

  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
  document.getElementById("username").value = "";

  isRegister = false;
  toggleMode();


    } else {
      // ===== LOGIN =====
      await signInWithEmailAndPassword(auth, email, pass);

      // MASUK DASHBOARD
      window.location.href = "/dashboard/";
    }

} catch (e) {
  console.error(e);
  alert(e.message);
} finally {
  const btn = document.getElementById("submitBtn");
  btn.disabled = false;
}
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