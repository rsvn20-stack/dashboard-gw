export function setLoading(btn, state) {
  if (!btn) return;
  btn.disabled = state;
  btn.innerText = state ? "Loading..." : "Submit";
}

export function showMessage(msg) {
  alert(msg);
}