/* =========================
   PLAYER
========================= */

const player = {
  x: 100,
  y: H / 2,

  radius: 16,
  speed: 250,

  maxHealth: 100,
  maxEnergy: 100,
  energyRegen: 7,
  shotCooldown: 0.18,
  shotEnergy: 5,
  shotDamage: 2,
  aircraftColor: "#18eaff",

  health: 100,
  energy: 100,

  cooldown: 0,
  invincible: 0,

  ammoType: "standard",
  ammoShots: 0,

  facingX: 1,
  facingY: 0
};

function applySelectedAircraft() {
  const aircraft =
    AIRCRAFT_CATALOG[resources.selectedAircraft] ||
    AIRCRAFT_CATALOG.echo;

  player.speed = aircraft.speed;
  player.maxHealth = aircraft.maxHealth;
  player.maxEnergy = aircraft.maxEnergy;
  player.energyRegen = aircraft.energyRegen;
  player.shotCooldown = aircraft.shotCooldown;
  player.shotEnergy = aircraft.shotEnergy;
  player.shotDamage = aircraft.shotDamage;
  player.aircraftColor = aircraft.color;
}

applySelectedAircraft();

/* =========================
   CORE
========================= */

const core = {
  x: 870,
  y: H / 2,

  radius: 35,
  pulse: 0
};

/* =========================
   WALLS
========================= */

const walls = [
  {
    x: 230,
    y: 0,
    width: 25,
    height: 170
  },

  {
    x: 230,
    y: 370,
    width: 25,
    height: 170
  },

  {
    x: 670,
    y: 0,
    width: 25,
    height: 200
  },

  {
    x: 670,
    y: 400,
    width: 25,
    height: 140
  }
];

/* =========================
   STARS
========================= */

for (let i = 0; i < 140; i++) {
  stars.push({
    x: Math.random() * W,
    y: Math.random() * H,
    size: Math.random() * 2,
    speed: 10 + Math.random() * 25
  });
}

/* =========================
   COLLISION HELPERS
========================= */

function distance(a, b) {
  return Math.hypot(
    a.x - b.x,
    a.y - b.y
  );
}

function circleWall(circle, wall) {
  const closestX = Math.max(
    wall.x,
    Math.min(
      circle.x,
      wall.x + wall.width
    )
  );

  const closestY = Math.max(
    wall.y,
    Math.min(
      circle.y,
      wall.y + wall.height
    )
  );

  return (
    Math.hypot(
      circle.x - closestX,
      circle.y - closestY
    ) < circle.radius
  );
}

function hitsWall(object) {
  return walls.some(
    wall => circleWall(object, wall)
  );
}

function insideScreen(object) {
  return (
    object.x >= object.radius &&
    object.x <= W - object.radius &&
    object.y >= object.radius &&
    object.y <= H - object.radius
  );
}
