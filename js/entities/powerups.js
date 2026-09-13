/* =========================
   POWER-UPS
========================= */

function dropPowerUp(x, y) {
  const roll = Math.random();
  const type =
    roll < 0.2
      ? "health"
      : roll < 0.4
        ? "energy"
        : roll < 0.72
          ? "overcharge"
          : "rapid";

  powerUps.push({
    x,
    y,
    type,
    radius: 11,
    life: 12,
    pulse: Math.random() * Math.PI * 2
  });

  showMessage(
    type === "health"
      ? "SECRET CARRIER: HULL CELL DROPPED"
      : type === "energy"
        ? "SECRET CARRIER: ENERGY CELL DROPPED"
        : type === "overcharge"
          ? "SECRET CARRIER: PLASMA AMMO DROPPED"
          : "SECRET CARRIER: RAPID AMMO DROPPED"
  );
}

function dropAmmo(x, y) {
  const type = Math.random() < 0.55 ? "overcharge" : "rapid";

  powerUps.push({
    x,
    y,
    type,
    radius: 11,
    life: 12,
    pulse: Math.random() * Math.PI * 2
  });
}

function dropGem(x, y) {
  powerUps.push({
    x,
    y,
    type: "gem",
    radius: 10,
    life: 14,
    pulse: Math.random() * Math.PI * 2
  });

  showMessage(
    "RARE GEM SIGNAL DETECTED"
  );
}

function updatePowerUps(dt) {
  for (
    let i = powerUps.length - 1;
    i >= 0;
    i--
  ) {
    const powerUp = powerUps[i];

    powerUp.life -= dt;
    powerUp.pulse += dt * 5;

    if (powerUp.life <= 0) {
      powerUps.splice(i, 1);
      continue;
    }

    if (
      distance(player, powerUp) <
      player.radius + powerUp.radius
    ) {
      const isHealth =
        powerUp.type === "health";

      const isGem =
        powerUp.type === "gem";

      const isOvercharge =
        powerUp.type === "overcharge";

      const isRapid =
        powerUp.type === "rapid";

      if (isGem) {
        addResource(
          "gems",
          1
        );
      } else if (isHealth) {
        player.health =
          Math.min(
            player.maxHealth,
            player.health + 35
          );
      } else if (powerUp.type === "energy") {
        player.energy =
          Math.min(
            player.maxEnergy,
            player.energy + 55
          );
      } else if (isOvercharge) {
        player.ammoType = "overcharge";
        player.ammoShots = 12;
        updateAmmoHUD();
      } else if (isRapid) {
        player.ammoType = "rapid";
        player.ammoShots = 20;
        updateAmmoHUD();
      }

      createParticles(
        powerUp.x,
        powerUp.y,
        isGem
          ? "#48a7ff"
          : isHealth
            ? "#65ff9a"
            : isOvercharge
              ? "#ff4fd8"
              : isRapid
                ? "#ffb236"
                : "#18eaff",
        24
      );

      showMessage(
        isGem
          ? "RARE GEM COLLECTED +1"
          : isHealth
            ? "HULL RESTORED +35"
            : isOvercharge
              ? "PLASMA AMMO: +3 DAMAGE / 12 SHOTS"
              : isRapid
                ? "RAPID AMMO: DOUBLE FIRE RATE / 20 SHOTS"
                : "ENERGY RESTORED +55"
      );

      powerUps.splice(i, 1);
    }
  }
}
