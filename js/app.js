import { auth } from "./firebase.js";
import { register, login, logoutUser, listenAuth } from "./auth.js";
import { addDomainToDB, addUser } from "./firestore.js";
import { setLoading, showMessage } from "./ui.js";

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

  const username = document.getElementById("username");
  if (username) {
    username.style.display = isRegister ? "block" : "none";
  }
};

// ======================
// SUBMIT LOGIN / REGISTER
// ======================
window.submitForm = async function () {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  const username = document.getElementById("username").value;

  const btn = document.getElementById("submitBtn");

  try {
    setLoading(btn, true);

    // REGISTER
    if (isRegister) {
      const user = await register(email, pass);

      await addUser({
        uid: user.user.uid,
        email,
        username
      });

      await logoutUser();

      showMessage("Register berhasil, silakan login");
      return;
    }

    // LOGIN
    await login(email, pass);
    window.location.href = "/dashboard/";

  } catch (e) {
    console.error(e);
    showMessage(e.message);
  } finally {
    setLoading(btn, false);
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