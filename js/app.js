import { auth } from "./firebase.js";
import { register, login, logoutUser, listenAuth } from "./auth.js";
import { addDomainToDB, addUser } from "./firestore.js";
import { setLoading, showMessage } from "./ui.js";
import { getUserByUsername } from "./firestore.js";

// ======================
// AUTH LISTENER
// ======================
listenAuth((user) => {
  const path = window.location.pathname;

  // proteksi dashboard
  if (!user && path.includes("dashboard")) {
    window.location.href = "/";
  }
});

// ======================
// TOGGLE LOGIN / REGISTER
// ======================
let isRegister = false;

window.toggleMode = function () {
  isRegister = !isRegister;

  const emailInput = document.getElementById("email");
  const btn = document.getElementById("submitBtn");
  const toggleBtn = document.getElementById("toggleBtn");

  if (username) {
    username.style.display = isRegister ? "block" : "none";
  }

  // tombol utama
  btn.innerText = isRegister ? "Register" : "Login";

  // 🔥 tombol bawah (ini fix utama)
  toggleBtn.innerText = isRegister
    ? "Sudah punya akun? Login"
    : "Belum punya akun? Register";

    emailInput.placeholder = isRegister
  ? "Email"
  : "Email / Username";
};

// ======================
// SUBMIT LOGIN / REGISTER
// ======================
window.submitForm = async function () {

  let email = document.getElementById("email").value.toLowerCase();
  const pass = document.getElementById("password").value;
  const username = document.getElementById("username").value.toLowerCase().trim();

  // ✅ VALIDASI TARUH DISINI
  if (!email || !pass || (isRegister && !username)) {
    showMessage("Isi semua field dulu");
    return;
  }

  const btn = document.getElementById("submitBtn");

  try {
    setLoading(btn, true, isRegister);

    // REGISTER
    if (isRegister) {
      const user = await register(email, pass);

await addUser({
  uid: user.user.uid,
  email: email.toLowerCase(),
  username: username.toLowerCase()
});

      await logoutUser();

      document.getElementById("email").value = "";
      document.getElementById("password").value = "";
      document.getElementById("username").value = "";

      showMessage("Register berhasil, silakan login");
      toggleMode();
      return;
    }

// LOGIN (email / username)
let loginEmail = email;

// kalau input bukan email → anggap username
if (!email.includes("@")) {
  const userData = await getUserByUsername(email);

  if (!userData) {
    showMessage("Username tidak ditemukan");
    return;
  }

  loginEmail = userData.email;
}

// login pakai email hasil convert
await login(loginEmail, pass);
window.location.href = "/dashboard/";

  } catch (e) {
    console.error(e);
    showMessage(e.message);
  } finally {
    setLoading(btn, false, isRegister);
  }
};

// ======================
// EVENT LISTENER (FIX UTAMA)
// ======================

// LOGOUT
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      await logoutUser();
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Logout gagal");
    }
  });
}

// ADD DOMAIN
const addBtn = document.getElementById("addBtn");

if (addBtn) {
  addBtn.addEventListener("click", async () => {
    const input = document.getElementById("domainInput");

    if (!input.value) {
      alert("Isi dulu domain");
      return;
    }

    try {
      await addDomainToDB({
        name: input.value,
        uid: auth.currentUser.uid
      });

      input.value = "";
      alert("Domain berhasil ditambahkan");

    } catch (err) {
      console.error(err);
      alert("Gagal tambah domain");
    }
  });
}