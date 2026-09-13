/* =========================
   BULLETS
========================= */

function updateBullets(dt) {
  for (
    let i =
      bullets.length - 1;
    i >= 0;
    i--
  ) {
    const bullet =
      bullets[i];

    bullet.x +=
      bullet.vx *
      dt;

    bullet.y +=
      bullet.vy *
      dt;

    bullet.life -= dt;

    if (
      bullet.life <= 0 ||
      bullet.x < 0 ||
      bullet.x > W ||
      bullet.y < 0 ||
      bullet.y > H ||
      hitsWall(bullet)
    ) {
      bullets.splice(i, 1);
      continue;
    }

    let hit = false;

    for (
      const enemy
      of enemies
    ) {
      if (
        distance(
          bullet,
          enemy
        ) <
        bullet.radius +
        enemy.radius
      ) {
        enemy.health -= bullet.damage || 1;

        createParticles(
          enemy.x,
          enemy.y,
          "#ff2d75",
          8
        );

        hit = true;
        break;
      }
    }

    if (hit) {
      bullets.splice(
        i,
        1
      );
    }
  }
}
