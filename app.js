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

  // cuma proteksi halaman dashboard
  if (!user && path.includes("/dashboard")) {
    window.location.href = "/";
  }
});

// SUBMIT FORM (LOGIN / REGISTER)
window.submitForm = async function () {
  const email = document.getElementById("email").value.trim();
  const pass = document.getElementById("password").value.trim();
  const usernameInput = document.getElementById("username");
  const username = usernameInput ? usernameInput.value.trim() : "";

  const btn = document.getElementById("submitBtn");

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
    btn.disabled = true;

    // =========================
    // REGISTER
    // =========================
    if (isRegister) {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);

      await addDoc(collection(db, "users"), {
        uid: userCredential.user.uid,
        email: email,
        username: username,
        createdAt: new Date()
      });

      // 🔥 WAJIB: logout biar gak auto masuk dashboard
      await signOut(auth);

      alert("Register berhasil, silakan login");

      // reset form
      document.getElementById("email").value = "";
      document.getElementById("password").value = "";
      document.getElementById("username").value = "";

      // balik ke mode login
      isRegister = false;
      toggleMode();

      return; // ⛔ stop disini
    }

    // =========================
    // LOGIN
    // =========================
    await signInWithEmailAndPassword(auth, email, pass);

    // redirect manual
    window.location.href = "/dashboard/";

  } catch (e) {
    console.error("AUTH ERROR:", e);
    alert(e.message);
  } finally {
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
  try {
    const input = document.getElementById("domainInput");

    if (!input.value) {
      alert("Isi dulu domain");
      return;
    }

    await addDoc(collection(db, "domains"), {
      name: input.value
    });

    console.log("✅ BERHASIL TAMBAH:", input.value);

    input.value = "";

    await loadDomains();

  } catch (err) {
    console.error("❌ ERROR ADD:", err);
    alert(err.message);
  }
};


// LOAD DOMAIN
async function loadDomains() {
  const list = document.getElementById("list");
  if (!list) return;

  list.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "domains"));

  querySnapshot.forEach(doc => {
    const data = doc.data();
    console.log("DATA:", data);

    list.innerHTML += `<li>${data.name}</li>`;
  });
}

// AUTO LOAD
loadDomains();