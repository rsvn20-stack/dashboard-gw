import { auth } from "./firebase.js";
import { register, login, logoutUser, listenAuth } from "./auth.js";
import { addDomainToDB, getDomains, addUser } from "./firestore.js";
import { setLoading, showMessage } from "./ui.js";

// AUTH LISTENER
listenAuth((user) => {
  const path = window.location.pathname;

  if (!user && path.includes("dashboard")) {
    window.location.href = "/";
  }
});

// TOGGLE
let isRegister = false;

window.toggleMode = function () {
  isRegister = !isRegister;

  document.getElementById("username").style.display = isRegister ? "block" : "none";
};

// SUBMIT
window.submitForm = async function () {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  const username = document.getElementById("username").value;

  const btn = document.getElementById("submitBtn");

  try {
    setLoading(btn, true);

    if (isRegister) {
      const user = await register(email, pass);

      await addUser({
        uid: user.user.uid,
        email,
        username
      });

      await logoutUser();

      showMessage("Register berhasil");
      return;
    }

    await login(email, pass);
    window.location.href = "/dashboard/";

  } catch (e) {
    showMessage(e.message);
  } finally {
    setLoading(btn, false);
  }
};

// LOGOUT (BIAR BISA DIPAKE DI HTML)
window.logout = async function () {
  try {
    await logoutUser();
    window.location.href = "/";
  } catch (err) {
    console.error(err);
    alert("Logout gagal");
  }
};