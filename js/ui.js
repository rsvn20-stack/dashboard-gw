export function setLoading(btn, state, isRegister) {
  if (!btn) return;
  btn.disabled = state;

  if (state) {
    btn.innerText = "Loading...";
  } else {
    btn.innerText = isRegister ? "Register" : "Login";
  }
}

export function showMessage(msg) {
  alert(msg);
}