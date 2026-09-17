/* =========================
   SHOOTING
========================= */

function shoot() {
  if (
    !gameRunning ||
    gamePaused ||
    player.cooldown > 0 ||
    player.energy < player.shotEnergy
  ) {
    return;
  }

  player.energy -= player.shotEnergy;
  const usingRapidAmmo = player.ammoType === "rapid" && player.ammoShots > 0;
  const usingOverchargeAmmo = player.ammoType === "overcharge" && player.ammoShots > 0;
  player.cooldown = player.shotCooldown * (usingRapidAmmo ? 0.55 : 1);

  bullets.push({
    x:
      player.x +
      player.facingX * 22,

    y:
      player.y +
      player.facingY * 22,

    vx:
      player.facingX * 650,

    vy:
      player.facingY * 650,

    radius: 4,
    life: 1.5,
    damage: player.shotDamage + (usingOverchargeAmmo ? 3 : 0),
    color: usingOverchargeAmmo
      ? "#ff4fd8"
      : usingRapidAmmo
        ? "#ffb236"
        : "#ffffff"
  });

  if (player.ammoShots > 0) {
    player.ammoShots--;
    if (player.ammoShots === 0) player.ammoType = "standard";
    updateAmmoHUD();
  }

  playShootSound();
}

/* =========================
   ECHO
========================= */

function activateEcho() {
  if (
    !gameRunning ||
    gamePaused ||
    echoTimer > 0 ||
    player.energy < 30
  ) {
    return;
  }

  player.energy -= 30;
  echoTimer = 4;

  enemies.forEach(enemy => {
    if (
      distance(player, enemy) < 190
    ) {
      enemy.health -= 3;
      enemy.stunned = 2;
    }
  });

  createParticles(
    player.x,
    player.y,
    "#18eaff",
    25
  );

  showMessage(
    "ECHO FIELD ACTIVATED"
  );
}

/* =========================
   PARTICLES
========================= */

function createParticles(
  x,
  y,
  color,
  amount
) {
  for (
    let i = 0;
    i < amount;
    i++
  ) {
    const angle =
      Math.random() *
      Math.PI *
      2;

    const speed =
      30 +
      Math.random() *
      120;

    particles.push({
      x,
      y,

      vx:
        Math.cos(angle) *
        speed,

      vy:
        Math.sin(angle) *
        speed,

      life:
        0.4 +
        Math.random() *
        0.5,

      color,

      size:
        1 +
        Math.random() *
        3
    });
  }
}

/* =========================
   PLAYER UPDATE
========================= */

function updatePlayer(dt) {
  let dx = 0;
  let dy = 0;

  /* WASD / ARROW KEY STEERING */

  if (keys["w"] || keys["arrowup"]) {
    dy--;
  }

  if (keys["s"] || keys["arrowdown"]) {
    dy++;
  }

  if (keys["a"] || keys["arrowleft"]) {
    dx--;
  }

  if (keys["d"] || keys["arrowright"]) {
    dx++;
  }

  if (dx || dy) {
    const length =
      Math.hypot(dx, dy);

    dx /= length;
    dy /= length;

    /* X movement */

    const oldX =
      player.x;

    player.x +=
      dx *
      player.speed *
      dt;

    if (
      !insideScreen(player) ||
      hitsWall(player)
    ) {
      player.x = oldX;
    }

    /* Y movement */

    const oldY =
      player.y;

    player.y +=
      dy *
      player.speed *
      dt;

    if (
      !insideScreen(player) ||
      hitsWall(player)
    ) {
      player.y = oldY;
    }
  }

  if (keys[" "]) {
    shoot();
  }

  if (player.cooldown > 0) {
    player.cooldown -= dt;
  }

  if (player.invincible > 0) {
    player.invincible -= dt;
  }

  if (echoTimer > 0) {
    echoTimer -= dt;
  }

  player.energy =
    Math.min(
      player.maxEnergy,
      player.energy +
      player.energyRegen * dt
    );
}
