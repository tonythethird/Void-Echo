/* =========================
   HUD
========================= */

function updateHUD() {
  const healthBar =
    document.getElementById(
      "healthBar"
    );

  const energyBar =
    document.getElementById(
      "energyBar"
    );

  if (healthBar) {
    healthBar.style.width =
      Math.max(
        0,
        player.health / player.maxHealth * 100
      ) + "%";
  }

  if (energyBar) {
    energyBar.style.width =
      Math.max(
        0,
        player.energy / player.maxEnergy * 100
      ) + "%";
  }
}

function updateAmmoHUD() {
  const ammoStatus = document.getElementById("ammoStatus");
  if (!ammoStatus) return;

  const hasSpecialAmmo = player.ammoShots > 0;
  const names = { overcharge: "PLASMA", rapid: "RAPID" };
  ammoStatus.classList.toggle("isEmpty", !hasSpecialAmmo);
  ammoStatus.dataset.ammo = hasSpecialAmmo ? player.ammoType : "standard";

  const value = ammoStatus.querySelector("strong");
  if (value) {
    value.textContent = hasSpecialAmmo
      ? `${names[player.ammoType]} x${player.ammoShots}`
      : "STANDARD";
  }
}

function updateResourceHUD() {
  const values = [
    ["coinCount", resources.coins],
    ["trophyCount", resources.trophies],
    ["gemCount", resources.gems]
  ];

  values.forEach(([id, value]) => {
    const element =
      document.getElementById(id);

    if (element) {
      element.textContent = value;
    }
  });

  const selectedAircraft =
    AIRCRAFT_CATALOG[resources.selectedAircraft] || AIRCRAFT_CATALOG.echo;

  ["selectedAircraftName", "mapAircraftName"].forEach(id => {
    const element = document.getElementById(id);
    if (element) element.textContent = selectedAircraft.name;
  });
}

function updateAircraftShop() {
  const grid = document.getElementById("aircraftGrid");
  if (!grid) return;

  const balance = document.getElementById("shopBalance");
  if (balance) balance.textContent = `${resources.coins} COINS`;

  const selectedName = document.getElementById("selectedAircraftName");
  const selectedAircraft =
    AIRCRAFT_CATALOG[resources.selectedAircraft] || AIRCRAFT_CATALOG.echo;
  if (selectedName) selectedName.textContent = selectedAircraft.name;

  grid.innerHTML = "";

  Object.entries(AIRCRAFT_CATALOG).forEach(([id, aircraft]) => {
    const owned = resources.ownedAircraft.includes(id);
    const selected = resources.selectedAircraft === id;
    const temporarilyUnlocked = TEMPORARY_UNLOCK_ALL && !owned;
    const card = document.createElement("article");
    card.className = `aircraftCard${selected ? " isSelected" : ""}${temporarilyUnlocked ? " isTemporarilyUnlocked" : ""}`;
    card.style.setProperty("--craft-color", aircraft.color);
    card.innerHTML = `
      <div class="aircraftVisual" style="--craft-color:${aircraft.color}">
        <i class="craftWing craftWingTop"></i><i class="craftBody"></i><i class="craftWing craftWingBottom"></i>
        <span>${selected ? "ACTIVE" : owned ? "OWNED" : "LOCKED"}</span>
      </div>
      <div class="aircraftIdentity"><span>CLASS ${id.toUpperCase()}</span><h3>${aircraft.name}</h3></div>
      <p>${aircraft.description}</p>
      <div class="statList">
        <div><span>HULL</span><i><b style="width:${Math.min(100, aircraft.maxHealth / 1.25)}%"></b></i><em>${aircraft.maxHealth}</em></div>
        <div><span>SPEED</span><i><b style="width:${aircraft.speed / 2.8}%"></b></i><em>${aircraft.speed}</em></div>
        <div><span>POWER</span><i><b style="width:${aircraft.shotDamage / 3 * 100}%"></b></i><em>${aircraft.shotDamage}</em></div>
        <div><span>ENERGY</span><i><b style="width:${aircraft.maxEnergy / 1.15}%"></b></i><em>${aircraft.maxEnergy}</em></div>
      </div>
    `;

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = selected
      ? "EQUIPPED"
      : owned
        ? "EQUIP"
        : temporarilyUnlocked
          ? "TEMP EQUIP"
          : `${aircraft.price} COINS`;
    button.disabled = selected;
    button.onclick = () => buyOrEquipAircraft(id);
    card.appendChild(button);
    grid.appendChild(card);
  });
}

function buyOrEquipAircraft(id) {
  const aircraft = AIRCRAFT_CATALOG[id];
  if (!aircraft) return;

  if (!resources.ownedAircraft.includes(id)) {
    if (TEMPORARY_UNLOCK_ALL) {
      resources.selectedAircraft = id;
      applySelectedAircraft();
      updateResourceHUD();
      updateAircraftShop();
      return;
    }

    const price = Math.max(0, Math.floor(aircraft.price));
    if (resources.coins < price) {
      const balance = document.getElementById("shopBalance");
      if (balance) balance.textContent = `NEED ${price - resources.coins} MORE COINS`;
      return;
    }

    resources.coins -= price;
    resources.ownedAircraft.push(id);
  }

  resources.selectedAircraft = id;
  applySelectedAircraft();
  saveResources();
  updateResourceHUD();
  updateAircraftShop();
}

function setShopOpen(isOpen) {
  const shop = document.getElementById("aircraftShop");
  if (!shop || gameRunning || gameCountdown) return;
  shop.classList.toggle("isHidden", !isOpen);
  if (isOpen) updateAircraftShop();
}

const shopButton = document.getElementById("shopButton");
const closeShopButton = document.getElementById("closeShopButton");
if (shopButton) shopButton.onclick = () => setShopOpen(true);
if (closeShopButton) closeShopButton.onclick = () => setShopOpen(false);

/* =========================
   MESSAGE
========================= */

function showMessage(text) {
  const message =
    document.getElementById(
      "message"
    );

  if (message) {
    message.textContent =
      text;
  }

  messageTimer = 3;
}

/* =========================
   ENEMY COUNTER
========================= */

function createEnemyBar() {
  if (
    document.getElementById(
      "enemyCounter"
    )
  ) {
    return;
  }

  const box =
    document.createElement(
      "div"
    );

  box.id =
    "enemyCounter";

  Object.assign(
    box.style,
    {
      position:
        "fixed",

      top:
        "8px",

      left:
        "50%",

      transform:
        "translateX(-50%)",

      width:
        "380px",

      maxWidth:
        "80vw",

      zIndex:
        "100",

      fontFamily:
        "Courier New, monospace",

      color:
        "#ff2d75",

      textAlign:
        "center",

      fontSize:
        "14px",

      fontWeight:
        "bold",

      pointerEvents:
        "none"
    }
  );

  box.innerHTML = `
    <div id="enemyText">
      ENEMIES LEFT: 900
    </div>

    <div style="
      width:100%;
      height:10px;
      border:1px solid #ff2d75;
      margin-top:4px;
      background:#15050b;
    ">
      <div
        id="enemyBar"
        style="
          height:100%;
          width:100%;
          background:#ff2d75;
          transition:width .15s;
        ">
      </div>
    </div>
  `;

  document.body.appendChild(
    box
  );
}

function updateEnemyCounter() {
  enemiesLeft =
    Math.max(
      0,
      ENEMIES_PER_ROUND -
      enemiesKilled
    );

  const text =
    document.getElementById(
      "enemyText"
    );

  const bar =
    document.getElementById(
      "enemyBar"
    );

  if (text) {
    text.textContent =
      "ENEMIES LEFT: " +
      enemiesLeft;
  }

  if (bar) {
    bar.style.width =
      (
        enemiesLeft /
        ENEMIES_PER_ROUND *
        100
      ) + "%";
  }
}

createEnemyBar();

/* =========================
   RESET
========================= */

function prepareGame() {
  visualTime = 0;

  applySelectedAircraft();
  player.x =
    100;

  player.y =
    H / 2;

  player.health =
    player.maxHealth;

  player.energy =
    player.maxEnergy;

  player.cooldown =
    0;

  player.invincible =
    0;

  player.ammoType = "standard";
  player.ammoShots = 0;
  updateAmmoHUD();

  setFacing(
    1,
    0
  );

  bullets.length =
    0;

  enemies.length =
    0;

  particles.length =
    0;

  powerUps.length =
    0;

  enemiesSpawned =
    0;

  enemiesKilled =
    0;

  enemiesLeft =
    ENEMIES_PER_ROUND;

  roundCoinTarget =
    3 + Math.floor(Math.random() * 4);

  roundCoinsAwarded =
    0;

  roundGemAvailable =
    Math.random() < 0.5;

  roundGemDropped =
    false;

  echoTimer =
    0;

  gameWon =
    false;

  gamePaused =
    false;

  Object.keys(
    keys
  ).forEach(key => {
    keys[key] = false;
  });

  updateEnemyCounter();

  updateHUD();
}

/* =========================
   COUNTDOWN DISPLAY
========================= */

function showCountdown(text) {
  let display =
    document.getElementById(
      "countdown"
    );

  if (!display) {
    display =
      document.createElement(
        "div"
      );

    display.id =
      "countdown";

    Object.assign(
      display.style,
      {
        position:
          "fixed",

        inset:
          "0",

        display:
          "flex",

        alignItems:
          "center",

        justifyContent:
          "center",

        fontFamily:
          "Courier New, monospace",

        fontSize:
          "90px",

        fontWeight:
          "bold",

        color:
          "#18eaff",

        background:
          "rgba(0,0,0,.4)",

        textShadow:
          "0 0 25px #18eaff",

        zIndex:
          "9999",

        pointerEvents:
          "none"
      }
    );

    document.body.appendChild(
      display
    );
  }

  display.textContent =
    text;

  display.style.display =
    "flex";
}

function hideCountdown() {
  const display =
    document.getElementById(
      "countdown"
    );

  if (display) {
    display.style.display =
      "none";
  }
}
