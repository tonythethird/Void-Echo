/* =========================
   INITIAL STATE
========================= */

gameRunning =
  false;

gamePaused =
  false;

gameCountdown =
  false;

gameWon =
  false;

updateResourceHUD();

[
  "pauseMenu",
  "gameOver",
  "victory"
].forEach(id => {
  const element =
    document.getElementById(
      id
    );

  if (
    element
  ) {
    element.style.display =
      "none";
  }
});

const startScreen =
  document.getElementById(
    "startScreen"
  );

if (
  startScreen
) {
  startScreen.style.display =
    "flex";
}

updateHUD();

updateEnemyCounter();

/* =========================
   GAME LOOP
========================= */

function gameLoop(time) {
  if (
    !lastTime
  ) {
    lastTime =
      time;
  }

  const dt =
    Math.min(
      (
        time -
        lastTime
      ) / 1000,
      0.033
    );

  lastTime =
    time;

  if (
    gameRunning &&
    !gamePaused &&
    !gameCountdown
  ) {
    update(
      dt
    );
  }

  draw();

  requestAnimationFrame(
    gameLoop
  );
}

requestAnimationFrame(
  gameLoop
);
