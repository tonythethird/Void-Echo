/* =========================
   DRAW BACKGROUND
========================= */

const STAGE_VISUALS = [
  { start: "#020711", middle: "#071526", end: "#02050c", primary: "#18eaff", star: "#bcefff" },
  { start: "#12020c", middle: "#260817", end: "#08020a", primary: "#ff477e", star: "#ffb3d1" },
  { start: "#0d061c", middle: "#221044", end: "#05020d", primary: "#a66bff", star: "#d9c7ff" },
  { start: "#160b02", middle: "#382009", end: "#090401", primary: "#ffb236", star: "#ffe2a8" },
  { start: "#02110a", middle: "#082b1b", end: "#010805", primary: "#65ff9a", star: "#c4ffd8" }
];

function drawBackground() {
  const visual =
    STAGE_VISUALS[currentStageIndex];
  const t = visualTime;

  const gradient =
    ctx.createLinearGradient(
      0,
      0,
      W,
      H
    );

  gradient.addColorStop(0, visual.start);
  gradient.addColorStop(0.52, visual.middle);
  gradient.addColorStop(1, visual.end);

  ctx.fillStyle = gradient;

  ctx.fillRect(
    0,
    0,
    W,
    H
  );

  ctx.fillStyle = visual.star;

  stars.forEach(star => {
    const trail =
      currentStageIndex === 3
        ? 9 + star.speed * 0.25
        : currentStageIndex === 0
          ? 3 + star.speed * 0.08
          : star.size;

    ctx.globalAlpha = 0.35 + star.size * 0.3;
    ctx.fillRect(star.x, star.y, trail, Math.max(1, star.size));
  });

  ctx.globalAlpha = 1;

  ctx.save();
  ctx.globalAlpha = 0.16;

  if (currentStageIndex === 0) {
    ctx.strokeStyle = "#18eaff";
    ctx.lineWidth = 1;

    const gridOffset = (t * 70) % 70;

    for (let x = -H - 70; x < W + 70; x += 70) {
      ctx.beginPath();
      ctx.moveTo(x - gridOffset, H);
      ctx.lineTo(x + H - gridOffset, 0);
      ctx.stroke();
    }

    for (let y = -75; y < H + 75; y += 75) {
      ctx.beginPath();
      ctx.moveTo(0, y + gridOffset);
      ctx.lineTo(W, y + gridOffset);
      ctx.stroke();
    }
  } else if (currentStageIndex === 1) {
    const storm =
      ctx.createRadialGradient(
        W * 0.72,
        H * 0.42,
        10,
        W * 0.72,
        H * 0.42,
        330
      );

    storm.addColorStop(0, "#ff2d75");
    storm.addColorStop(0.35, "rgba(164, 16, 73, 0.55)");
    storm.addColorStop(1, "rgba(20, 0, 10, 0)");
    ctx.fillStyle = storm;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "#ff4b87";
    ctx.lineWidth = 2;
    const waveOffset = (t * 55) % 82;

    for (let y = -82; y < H + 82; y += 82) {
      const movingY = y + waveOffset;
      ctx.beginPath();
      ctx.moveTo(W, movingY);
      ctx.bezierCurveTo(
        W * 0.7,
        movingY - 55 - Math.sin(t * 2 + y) * 18,
        W * 0.35,
        movingY + 55 + Math.sin(t * 2 + y) * 18,
        0,
        movingY - 10
      );
      ctx.stroke();
    }
  } else if (currentStageIndex === 2) {
    ctx.strokeStyle = visual.primary;
    ctx.lineWidth = 3;

    const tunnelPhase = (t * 55) % 70;

    for (let radius = 35; radius < 465; radius += 70) {
      const movingRadius = radius + tunnelPhase;
      ctx.beginPath();
      ctx.arc(
        W * 0.55,
        H * 0.48,
        movingRadius,
        t * 0.45 + movingRadius * 0.006,
        t * 0.45 + movingRadius * 0.006 + Math.PI * 1.55
      );
      ctx.stroke();
    }
  } else if (currentStageIndex === 3) {
    ctx.strokeStyle = visual.primary;
    ctx.lineWidth = 4;

    const laneOffset = (t * 230) % 115;

    for (let x = -430; x < W + 430; x += 115) {
      ctx.beginPath();
      ctx.moveTo(x + laneOffset, -20);
      ctx.lineTo(x - 280 + laneOffset, H + 20);
      ctx.stroke();
    }
  } else {
    ctx.strokeStyle = visual.primary;
    ctx.lineWidth = 2;

    const orbitPhase = (t * 32) % 55;
    const orbitX = W * 0.7 + Math.sin(t * 0.7) * 34;
    const orbitY = H * 0.5 + Math.cos(t * 0.55) * 22;

    for (let radius = 20; radius < 420; radius += 55) {
      const movingRadius = radius + orbitPhase;
      ctx.beginPath();
      ctx.ellipse(
        orbitX,
        orbitY,
        movingRadius * 1.55,
        movingRadius,
        -0.35 + Math.sin(t * 0.35) * 0.08,
        0,
        Math.PI * 2
      );
      ctx.stroke();
    }
  }

  ctx.restore();
}

/* =========================
   FORWARD MOTION ILLUSION
========================= */

function drawForwardMotion() {
  const visual = STAGE_VISUALS[currentStageIndex];
  const speed = 520 + currentStageIndex * 55;

  ctx.save();
  ctx.strokeStyle = visual.star;
  ctx.lineWidth = 1.2;

  for (let i = 0; i < 24; i++) {
    const laneY = (i * 83 + 29) % H;
    const laneSpeed = speed + (i % 5) * 85;
    const cycle = W + 260;
    const x = W - ((visualTime * laneSpeed + i * 173) % cycle);
    const length = 28 + (i % 6) * 13;

    ctx.globalAlpha = 0.08 + (i % 4) * 0.035;
    ctx.beginPath();
    ctx.moveTo(x, laneY);
    ctx.lineTo(x + length, laneY);
    ctx.stroke();
  }

  ctx.restore();
}

/* =========================
   DRAW WALLS
========================= */

function drawWalls() {
  const wallColor =
    STAGE_VISUALS[currentStageIndex]
      .primary;

  walls.forEach(wall => {
    ctx.fillStyle =
      "#0a1721";

    ctx.fillRect(
      wall.x,
      wall.y,
      wall.width,
      wall.height
    );

    ctx.strokeStyle =
      wallColor;

    ctx.lineWidth = 1.5;

    ctx.strokeRect(
      wall.x,
      wall.y,
      wall.width,
      wall.height
    );
  });
}

/* =========================
   DRAW CORE
========================= */

function drawCore() {
  const pulse =
    Math.sin(
      core.pulse
    ) * 4;

  ctx.save();

  ctx.shadowBlur = 30;

  const coreUnlocked =
    enemiesKilled >=
    KILLS_TO_UNLOCK_CORE;

  const coreColor =
    coreUnlocked
      ? "#65ff9a"
      : STAGE_VISUALS[currentStageIndex]
        .primary;

  ctx.shadowColor =
    coreColor;

  ctx.fillStyle =
    coreColor;

  ctx.beginPath();

  ctx.arc(
    core.x,
    core.y,
    core.radius +
    pulse,
    0,
    Math.PI * 2
  );

  ctx.fill();

  ctx.strokeStyle = coreColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(
    core.x,
    core.y,
    core.radius + 12 + pulse,
    core.pulse * 0.25,
    core.pulse * 0.25 + Math.PI * 1.35
  );
  ctx.stroke();

  ctx.fillStyle =
    "#04141e";

  ctx.beginPath();

  ctx.arc(
    core.x,
    core.y,
    20,
    0,
    Math.PI * 2
  );

  ctx.fill();

  ctx.fillStyle = coreColor;
  ctx.font = "9px monospace";
  ctx.textAlign = "center";
  ctx.fillText(
    coreUnlocked ? "OPEN" : "SEALED",
    core.x,
    core.y + 4
  );

  ctx.restore();
}

/* =========================
   DRAW PLAYER
========================= */
function drawPlayer() {
  ctx.save();

  if (
    player.invincible > 0 &&
    Math.floor(
      Date.now() / 80
    ) % 2 === 0
  ) {
    ctx.globalAlpha =
      0.3;
  }

  ctx.translate(
    player.x,
    player.y
  );

  ctx.rotate(
    Math.atan2(
      player.facingY,
      player.facingX
    )
  );

  const flame =
    8 +
    Math.sin(Date.now() / 45) * 4;

  const thrustPulse =
    (visualTime * 420) % 34;

  ctx.strokeStyle = player.aircraftColor;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.42;

  for (let i = 0; i < 4; i++) {
    const trailStart = -24 - i * 18 - thrustPulse;

    ctx.beginPath();
    ctx.moveTo(trailStart, i % 2 === 0 ? -6 : 6);
    ctx.lineTo(trailStart - 12 - i * 5, i % 2 === 0 ? -6 : 6);
    ctx.stroke();
  }

  ctx.globalAlpha = 1;

  ctx.fillStyle = "#ff9f43";
  ctx.shadowColor = "#ff9f43";
  ctx.shadowBlur = 14;
  ctx.beginPath();
  ctx.moveTo(-10, -5);
  ctx.lineTo(-20 - flame, 0);
  ctx.lineTo(-10, 5);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle =
    "#092630";

  ctx.strokeStyle =
    player.aircraftColor;

  ctx.lineWidth = 2;

  ctx.shadowBlur = 15;

  ctx.shadowColor =
    player.aircraftColor;

  ctx.beginPath();

  ctx.moveTo(
    21,
    0
  );

  ctx.lineTo(
    -13,
    -12
  );

  ctx.lineTo(
    -7,
    0
  );

  ctx.lineTo(
    -13,
    12
  );

  ctx.closePath();

  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#071018";
  ctx.strokeStyle = "#79f4ff";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(8, -6);
  ctx.lineTo(-7, -17);
  ctx.lineTo(-4, -5);
  ctx.lineTo(-15, -2);
  ctx.lineTo(-4, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(8, 6);
  ctx.lineTo(-7, 17);
  ctx.lineTo(-4, 5);
  ctx.lineTo(-15, 2);
  ctx.lineTo(-4, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#b9fbff";
  ctx.beginPath();
  ctx.ellipse(7, 0, 7, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/* =========================
   DRAW ENEMIES
========================= */

function drawEnemies() {
  enemies.forEach(enemy => {
    ctx.save();

    ctx.translate(enemy.x, enemy.y);
    ctx.rotate(
      Math.atan2(
        player.y - enemy.y,
        player.x - enemy.x
      )
    );

    const enemyColor =
      enemy.isCarrier
        ? "#ffd166"
        : STAGE_VISUALS[currentStageIndex]
          .primary;

    ctx.shadowBlur =
      12;

    ctx.shadowColor =
      enemyColor;

    ctx.fillStyle =
      enemy.stunned > 0
      ? "#713a56"
      : enemyColor;

    ctx.beginPath();

    ctx.moveTo(enemy.radius + 5, 0);
    ctx.lineTo(-5, -enemy.radius);
    ctx.lineTo(-2, -5);
    ctx.lineTo(-enemy.radius - 5, -9);
    ctx.lineTo(-9, 0);
    ctx.lineTo(-enemy.radius - 5, 9);
    ctx.lineTo(-2, 5);
    ctx.lineTo(-5, enemy.radius);
    ctx.closePath();

    ctx.fill();

    ctx.strokeStyle = "#240712";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#fff4f8";
    ctx.beginPath();
    ctx.arc(4, 0, 3, 0, Math.PI * 2);
    ctx.fill();

    if (enemy.isCarrier) {
      ctx.strokeStyle = "#fff1a8";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, enemy.radius + 7, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = "#ffd166";
      ctx.font = "bold 9px monospace";
      ctx.textAlign = "center";
      ctx.fillText("?", 0, 3);
    }

    ctx.restore();
  });
}

/* =========================
   DRAW BULLETS
========================= */

function drawBullets() {
  bullets.forEach(
    bullet => {
      ctx.fillStyle = bullet.color || "#ffffff";
      ctx.shadowColor = bullet.color || "#ffffff";
      ctx.shadowBlur = bullet.color && bullet.color !== "#ffffff" ? 12 : 0;
      ctx.beginPath();

      ctx.arc(
        bullet.x,
        bullet.y,
        bullet.radius,
        0,
        Math.PI * 2
      );

      ctx.fill();
    }
  );

  ctx.shadowBlur = 0;
}

/* =========================
   DRAW PARTICLES
========================= */

function drawParticles() {
  particles.forEach(p => {
    ctx.globalAlpha =
      Math.max(
        0,
        p.life
      );

    ctx.fillStyle =
      p.color;

    ctx.beginPath();

    ctx.arc(
      p.x,
      p.y,
      p.size,
      0,
      Math.PI * 2
    );

    ctx.fill();
  });

  ctx.globalAlpha = 1;
}

function drawPowerUps() {
  powerUps.forEach(powerUp => {
    const color =
      powerUp.type === "gem"
        ? "#48a7ff"
        : powerUp.type === "health"
          ? "#65ff9a"
          : powerUp.type === "overcharge"
            ? "#ff4fd8"
            : powerUp.type === "rapid"
              ? "#ffb236"
              : "#18eaff";

    const pulse =
      Math.sin(powerUp.pulse) * 2;

    ctx.save();
    ctx.translate(powerUp.x, powerUp.y);
    ctx.rotate(powerUp.pulse * 0.35);
    ctx.shadowBlur = 22;
    ctx.shadowColor = color;
    ctx.strokeStyle = color;
    ctx.fillStyle = "rgba(4, 18, 24, 0.9)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(
      -8 - pulse,
      -8 - pulse,
      16 + pulse * 2,
      16 + pulse * 2
    );
    ctx.fill();
    ctx.stroke();
    ctx.rotate(-powerUp.pulse * 0.35);
    ctx.fillStyle = color;
    ctx.font = "bold 13px monospace";
    ctx.textAlign = "center";
    ctx.fillText(
      powerUp.type === "gem"
        ? "◆"
        : powerUp.type === "health"
          ? "+"
          : powerUp.type === "overcharge"
            ? "P"
            : powerUp.type === "rapid"
              ? "R"
              : "E",
      0,
      5
    );
    ctx.restore();
  });
}

/* =========================
   DRAW EVERYTHING
========================= */

function draw() {
  drawBackground();

  drawForwardMotion();

  drawWalls();

  drawCore();

  drawBullets();

  drawEnemies();

  drawPowerUps();

  drawPlayer();

  drawParticles();
}
