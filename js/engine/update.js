/* =========================
   PARTICLE UPDATE
========================= */

function updateParticles(dt) {
  for (
    let i =
      particles.length - 1;
    i >= 0;
    i--
  ) {
    const p =
      particles[i];

    p.x +=
      p.vx * dt;

    p.y +=
      p.vy * dt;

    p.vx *= 0.96;
    p.vy *= 0.96;

    p.life -= dt;

    if (
      p.life <= 0
    ) {
      particles.splice(
        i,
        1
      );
    }
  }
}

/* =========================
   STAR UPDATE
========================= */

function updateStars(dt) {
  stars.forEach(star => {
    star.x -=
      star.speed *
      dt;

    if (
      star.x < 0
    ) {
      star.x = W;

      star.y =
        Math.random() *
        H;
    }
  });
}

/* =========================
   MAIN UPDATE
========================= */

function update(dt) {
  visualTime += dt;

  updateStars(dt);

  updatePlayer(dt);

  updateBullets(dt);

  updateEnemies(dt);

  updateParticles(dt);

  updatePowerUps(dt);

  core.pulse +=
    dt * 3;

  if (
    enemiesKilled >=
    KILLS_TO_UNLOCK_CORE &&
    distance(
      player,
      core
    ) < 60
  ) {
    winGame();
  }

  if (
    messageTimer > 0
  ) {
    messageTimer -= dt;
  } else {
    const message =
      document.getElementById(
        "message"
      );

    if (message) {
      message.textContent =
        "";
    }
  }

  updateHUD();
}
