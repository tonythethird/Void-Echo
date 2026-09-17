/* =========================
   AIMING
========================= */

function setFacing(x, y) {
  const length = Math.hypot(x, y);

  if (!length) return;

  player.facingX = x / length;
  player.facingY = y / length;
}

/* =========================
   KEYBOARD
========================= */

window.addEventListener("keydown", e => {
  const key = e.key.toLowerCase();

  const preventKeys = [
    "arrowup",
    "arrowdown",
    "arrowleft",
    "arrowright",
    " ",
    "home",
    "end",
    "pageup",
    "pagedown"
  ];

  if (preventKeys.includes(key)) {
    e.preventDefault();
  }

  if (!gameRunning) {
    return;
  }

  keys[key] = true;

  /* AIMING */

  if (key === "home") {
    setFacing(-1, -1);
  }

  if (key === "pageup") {
    setFacing(1, -1);
  }

  if (key === "end") {
    setFacing(-1, 1);
  }

  if (key === "pagedown") {
    setFacing(1, 1);
  }

  if (
    key === "e" &&
    !e.repeat &&
    !gamePaused
  ) {
    activateEcho();
  }

  if (key === "escape") {
    togglePause();
  }
});

window.addEventListener("keyup", e => {
  keys[e.key.toLowerCase()] = false;
});
