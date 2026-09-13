const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const W = canvas.width;
const H = canvas.height;

/* =========================
   GAME STATE
========================= */

let gameRunning = false;
let gamePaused = false;
let gameCountdown = false;
let gameWon = false;

let lastTime = 0;
let echoTimer = 0;
let messageTimer = 0;
let visualTime = 0;

let musicEnabled = true;
let soundEnabled = true;
let audioContext = null;

const STAGES = [
  {
    enemies: 100,
    killsToUnlockCore: 99,
    maxEnemiesOnScreen: 3
  },
  {
    enemies: 150,
    killsToUnlockCore: 149,
    maxEnemiesOnScreen: 4
  },
  {
    enemies: 200,
    killsToUnlockCore: 199,
    maxEnemiesOnScreen: 4
  },
  {
    enemies: 250,
    killsToUnlockCore: 249,
    maxEnemiesOnScreen: 5
  },
  {
    enemies: 300,
    killsToUnlockCore: 299,
    maxEnemiesOnScreen: 6
  }
];

let currentStageIndex = 0;
const STAGE_UNLOCK_KEY = "voidEchoHighestUnlockedStage";
const RESOURCE_SAVE_KEY = "voidEchoResources";
const AIRCRAFT_SHOP_VERSION = 2;

const AIRCRAFT_CATALOG = Object.freeze({
  echo: Object.freeze({
    name: "ECHO MK-I",
    price: 0,
    description: "Balanced starter craft.",
    color: "#18eaff",
    speed: 250,
    maxHealth: 100,
    maxEnergy: 100,
    energyRegen: 7,
    shotCooldown: 0.18,
    shotEnergy: 5,
    shotDamage: 2
  }),
  wraith: Object.freeze({
    name: "WRAITH",
    price: 350,
    description: "Faster, but has a fragile hull.",
    color: "#a66bff",
    speed: 278,
    maxHealth: 82,
    maxEnergy: 95,
    energyRegen: 7,
    shotCooldown: 0.17,
    shotEnergy: 5,
    shotDamage: 2
  }),
  bulwark: Object.freeze({
    name: "BULWARK",
    price: 600,
    description: "Extra hull at the cost of speed and fire rate.",
    color: "#ffb236",
    speed: 215,
    maxHealth: 125,
    maxEnergy: 100,
    energyRegen: 6.5,
    shotCooldown: 0.21,
    shotEnergy: 5,
    shotDamage: 3
  }),
  pulse: Object.freeze({
    name: "PULSE",
    price: 850,
    description: "High-speed glass cannon with rapid plasma fire.",
    color: "#65ff9a",
    speed: 260,
    maxHealth: 90,
    maxEnergy: 115,
    energyRegen: 9,
    shotCooldown: 0.16,
    shotEnergy: 5,
    shotDamage: 3
  })
});

const resources = {
  coins: 0,
  trophies: 0,
  gems: 0,
  completedStages: [],
  ownedAircraft: ["echo"],
  selectedAircraft: "echo",
  aircraftShopVersion: AIRCRAFT_SHOP_VERSION
};

try {
  const savedResources =
    JSON.parse(
      localStorage.getItem(
        RESOURCE_SAVE_KEY
      ) || "null"
    );

  if (savedResources) {
    resources.coins =
      Number(savedResources.coins) || 0;
    resources.trophies =
      Number(savedResources.trophies) || 0;
    resources.gems =
      Number(savedResources.gems) || 0;
    resources.completedStages =
      Array.isArray(savedResources.completedStages)
        ? savedResources.completedStages
        : [];

    const savedOwned =
      savedResources.aircraftShopVersion === AIRCRAFT_SHOP_VERSION &&
      Array.isArray(savedResources.ownedAircraft)
        ? savedResources.ownedAircraft
        : [];

    resources.ownedAircraft = [
      "echo",
      ...savedOwned.filter(
        (id, index) =>
          id !== "echo" &&
          AIRCRAFT_CATALOG[id] &&
          savedOwned.indexOf(id) === index
      )
    ];

    resources.selectedAircraft =
      resources.ownedAircraft.includes(savedResources.selectedAircraft)
        ? savedResources.selectedAircraft
        : "echo";

    resources.aircraftShopVersion = AIRCRAFT_SHOP_VERSION;
  }
} catch (err) {}

resources.coins = Math.max(0, Math.floor(resources.coins));

function saveResources() {
  try {
    localStorage.setItem(
      RESOURCE_SAVE_KEY,
      JSON.stringify(resources)
    );
  } catch (err) {}
}

function addResource(type, amount) {
  if (!(type in resources)) {
    return;
  }

  resources[type] += amount;
  saveResources();
  updateResourceHUD();
}

function rewardLevelCompletion(stageIndex) {
  if (
    !resources.completedStages
      .includes(stageIndex)
  ) {
    resources.completedStages.push(
      stageIndex
    );
  }

  resources.trophies++;
  saveResources();
  updateResourceHUD();
}

let highestUnlockedStageIndex = 0;

try {
  highestUnlockedStageIndex =
    Math.max(
      0,
      Math.min(
        Number(
          localStorage.getItem(
            STAGE_UNLOCK_KEY
          )
        ) || 0,
        STAGES.length - 1
      )
    );
} catch (err) {}

// Repair saves created by the old U shortcut, which permanently stored Stage 5.
// A legitimate Stage 5 unlock requires Stage 4 to have been completed.
if (
  highestUnlockedStageIndex === STAGES.length - 1 &&
  !resources.completedStages.includes(STAGES.length - 2)
) {
  const highestCompletedStage =
    resources.completedStages.reduce(
      (highest, stageIndex) =>
        Math.max(highest, Number(stageIndex) || 0),
      -1
    );

  highestUnlockedStageIndex = Math.min(
    highestCompletedStage + 1,
    STAGES.length - 1
  );

  try {
    localStorage.setItem(
      STAGE_UNLOCK_KEY,
      highestUnlockedStageIndex
    );
  } catch (err) {}
}

function isStageUnlocked(stageIndex) {
  return (
    stageIndex >= 0 &&
    stageIndex <= highestUnlockedStageIndex
  );
}

function unlockStage(stageIndex) {
  highestUnlockedStageIndex =
    Math.max(
      highestUnlockedStageIndex,
      Math.min(
        stageIndex,
        STAGES.length - 1
      )
    );

  try {
    localStorage.setItem(
      STAGE_UNLOCK_KEY,
      highestUnlockedStageIndex
    );
  } catch (err) {}
}

let ENEMIES_PER_ROUND = STAGES[0].enemies;
let KILLS_TO_UNLOCK_CORE = STAGES[0].killsToUnlockCore;
let MAX_ENEMIES_ON_SCREEN = STAGES[0].maxEnemiesOnScreen;

function setStage(stageIndex) {
  currentStageIndex =
    Math.max(
      0,
      Math.min(
        stageIndex,
        STAGES.length - 1
      )
    );

  const stage =
    STAGES[currentStageIndex];

  ENEMIES_PER_ROUND =
    stage.enemies;

  KILLS_TO_UNLOCK_CORE =
    stage.killsToUnlockCore;

  MAX_ENEMIES_ON_SCREEN =
    stage.maxEnemiesOnScreen;
}

let enemiesSpawned = 0;
let enemiesKilled = 0;
let enemiesLeft = ENEMIES_PER_ROUND;
let roundCoinTarget = 0;
let roundCoinsAwarded = 0;
let roundGemAvailable = false;
let roundGemDropped = false;

const keys = {};

const bullets = [];
const enemies = [];
const particles = [];
const powerUps = [];
const stars = [];
