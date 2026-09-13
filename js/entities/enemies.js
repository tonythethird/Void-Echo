/* =========================
   ENEMY SPAWN
========================= */

function spawnEnemy() {
  if (
    enemiesSpawned >=
    ENEMIES_PER_ROUND
  ) {
    return;
  }

  enemiesSpawned++;

  let x = W - 30;
  let y = H / 2;
  const spawnRadius = 13;
  const isCarrier =
    enemiesSpawned % 18 === 0 ||
    Math.random() < 0.055;

  // Some edge positions overlap the vertical walls. Only accept a
  // clear point so an enemy can never begin trapped inside a wall.
  for (let attempt = 0; attempt < 30; attempt++) {
    const edge =
      Math.floor(
        Math.random() * 3
      );

    if (edge === 0) {
      x = W - 30;
      y =
        35 +
        Math.random() *
        (H - 70);
    } else {
      x =
        500 +
        Math.random() *
        330;
      y = edge === 1 ? 30 : H - 30;
    }

    const spawnPoint = {
      x,
      y,
      radius: spawnRadius
    };

    if (
      insideScreen(spawnPoint) &&
      !hitsWall(spawnPoint)
    ) {
      break;
    }

    // This right-edge point is guaranteed to be clear if all retries fail.
    x = W - 30;
    y = H / 2;
  }

  enemies.push({
    x,
    y,

    radius: spawnRadius,

    speed:
      65 +
      Math.random() *
      40,

    health: isCarrier ? 5 : 2,

    isCarrier,

    stunned: 0,

    direction: null,
    directionTimer: 0
  });
}

/* =========================
   ENEMY MOVEMENT
========================= */

function updateEnemies(dt) {
  for (
    let i =
      enemies.length - 1;
    i >= 0;
    i--
  ) {
    const enemy =
      enemies[i];

    if (
      enemy.health <= 0
    ) {
      createParticles(
        enemy.x,
        enemy.y,
        enemy.isCarrier
          ? "#ffd166"
          : "#ff2d75",
        enemy.isCarrier
          ? 26
          : 14
      );

      if (enemy.isCarrier) {
        dropPowerUp(
          enemy.x,
          enemy.y
        );
      } else if (Math.random() < 0.06) {
        dropAmmo(
          enemy.x,
          enemy.y
        );
      }

      const rewardingKillsLeft =
        Math.max(
          1,
          KILLS_TO_UNLOCK_CORE - enemiesKilled
        );

      const coinsLeft =
        roundCoinTarget - roundCoinsAwarded;

      if (
        coinsLeft > 0 &&
        Math.random() < coinsLeft / rewardingKillsLeft
      ) {
        addResource("coins", 1);
        roundCoinsAwarded++;
      }

      if (
        roundGemAvailable &&
        !roundGemDropped &&
        Math.random() < 1 / rewardingKillsLeft
      ) {
        dropGem(
          enemy.x,
          enemy.y
        );

        roundGemDropped = true;
      }

      enemies.splice(
        i,
        1
      );

      enemiesKilled++;

      updateEnemyCounter();

      // Keep the active wave full by replacing each defeated enemy.
      if (
        enemiesSpawned <
        ENEMIES_PER_ROUND
      ) {
        spawnEnemy();
      }

      if (
        enemiesKilled >=
        KILLS_TO_UNLOCK_CORE
      ) {
        showMessage(
          "CORE UNLOCKED - REACH THE CORE"
        );
      }

      continue;
    }

    if (
      enemy.stunned > 0
    ) {
      enemy.stunned -= dt;
      continue;
    }

    const direct =
      Math.atan2(
        player.y -
        enemy.y,

        player.x -
        enemy.x
      );

    const step =
      enemy.speed *
      dt;

    function tryMove(
      angle
    ) {
      const test = {
        x:
          enemy.x +
          Math.cos(angle) *
          step,

        y:
          enemy.y +
          Math.sin(angle) *
          step,

        radius:
          enemy.radius
      };

      if (
        insideScreen(test) &&
        !hitsWall(test)
      ) {
        enemy.x = test.x;
        enemy.y = test.y;

        return true;
      }

      return false;
    }

    let moved = false;

    if (
      enemy.directionTimer > 0 &&
      enemy.direction !== null
    ) {
      moved =
        tryMove(
          enemy.direction
        );

      enemy.directionTimer -=
        dt;
    }

    if (!moved) {
      moved =
        tryMove(
          direct
        );
    }

    if (!moved) {
      const routes = [
        Math.PI / 6,
        -Math.PI / 6,

        Math.PI / 4,
        -Math.PI / 4,

        Math.PI / 2,
        -Math.PI / 2,

        Math.PI * 0.75,
        -Math.PI * 0.75,

        Math.PI
      ];

      for (
        const offset
        of routes
      ) {
        const angle =
          direct +
          offset;

        if (
          tryMove(angle)
        ) {
          enemy.direction =
            angle;

          enemy.directionTimer =
            0.45;

          moved = true;

          break;
        }
      }
    }

    if (!moved) {
      // Last-resort escape: search every direction for a clear step.
      for (let route = 0; route < 16; route++) {
        const angle =
          route *
          Math.PI /
          8;

        if (tryMove(angle)) {
          enemy.direction = angle;
          enemy.directionTimer = 0.6;
          moved = true;
          break;
        }
      }
    }

    if (
      distance(
        player,
        enemy
      ) <
      player.radius +
      enemy.radius
    ) {
      if (
        player.invincible <= 0
      ) {
        player.health -= 15;

        player.invincible = 1;

        createParticles(
          player.x,
          player.y,
          "#ff3864",
          12
        );

        if (
          player.health <= 0
        ) {
          endGame();
        }
      }
    }
  }
}
