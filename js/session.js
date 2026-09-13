/* =========================
   START COUNTDOWN
========================= */

let currentLanguage = "english";

const enterMenuButton =
  document.getElementById(
    "enterMenuButton"
  );

function revealLevelMap() {
  const levelMap =
    document.querySelector(
      ".levelMap"
    );

  const levelPrompt =
    document.getElementById(
      "levelPrompt"
    );

  const startSubtitle =
    document.getElementById(
      "startSubtitle"
    );

  const controls =
    document.querySelector(
      ".controls"
    );

  const startScreen =
    document.getElementById("startScreen");

  if (startScreen) {
    startScreen.classList.add("mapOpen");
  }

  if (enterMenuButton) {
    enterMenuButton.classList.add(
      "isHidden"
    );
  }

  if (levelMap) {
    levelMap.classList.remove(
      "isHidden"
    );
  }

  if (levelPrompt) {
    levelPrompt.classList.remove(
      "isHidden"
    );
  }

  if (startSubtitle) {
    startSubtitle.classList.add(
      "isHidden"
    );
  }

  if (controls) {
    controls.classList.add(
      "isHidden"
    );
  }

  updateLevelButtons();
}

if (enterMenuButton) {
  enterMenuButton.onclick =
    revealLevelMap;
}

function updateLevelButtons() {
  STAGES.forEach((stage, stageIndex) => {
    const button =
      document.getElementById(
        `stage${stageIndex + 1}Button`
      );

    if (!button) {
      return;
    }

    const unlocked =
      isStageUnlocked(stageIndex);

    const temporarilyUnlocked =
      TEMPORARY_UNLOCK_ALL &&
      stageIndex > highestUnlockedStageIndex;

    button.disabled =
      !unlocked;

    button.classList.toggle(
      "isTemporarilyUnlocked",
      temporarilyUnlocked
    );

    const status =
      document.getElementById(
        `stage${stageIndex + 1}Status`
      );

    if (temporarilyUnlocked && status) {
      status.textContent = "TEMPORARY ACCESS";
      return;
    }

    if (status) {
      status.textContent =
        unlocked
          ? `${stage.enemies} SIGNALS · ${stage.maxEnemiesOnScreen} ACTIVE`
          : `LOCKED · COMPLETE STAGE ${stageIndex}`;
    }
  });
}

function showLevelMenu(prompt = "SELECT A LEVEL") {
  gameRunning = false;
  gamePaused = false;
  gameCountdown = false;

  stopMusic();

  [
    "pauseMenu",
    "gameOver",
    "victory"
  ].forEach(id => {
    const element =
      document.getElementById(id);

    if (element) {
      element.style.display = "none";
    }
  });

  const startScreen =
    document.getElementById(
      "startScreen"
    );

  if (startScreen) {
    startScreen.classList.add("mapOpen");
  }

  if (startScreen) {
    startScreen.style.display = "flex";
  }

  const levelPrompt =
    document.getElementById(
      "levelPrompt"
    );

  if (levelPrompt) {
    levelPrompt.textContent = prompt;
  }

  revealLevelMap();
  updateLevelButtons();
}

function startSelectedStage(stageIndex) {
  if (
    gameRunning ||
    gameCountdown ||
    !isStageUnlocked(stageIndex)
  ) {
    return;
  }

  unlockAudio();
  setStage(stageIndex);
  setLanguage(currentLanguage);

  const startScreen =
    document.getElementById(
      "startScreen"
    );

  if (startScreen) {
    startScreen.style.display = "none";
  }

  if (musicEnabled) {
    backgroundMusic.currentTime = 0;
    backgroundMusic.volume = 0;
    backgroundMusic.play().catch(() => {});
  }

  startCountdown();
}

[
  ["stage1Button", 0],
  ["stage2Button", 1],
  ["stage3Button", 2],
  ["stage4Button", 3],
  ["stage5Button", 4]
].forEach(([id, stageIndex]) => {
  const button =
    document.getElementById(id);

  if (button) {
    button.onclick =
      () => startSelectedStage(stageIndex);
  }
});

updateLevelButtons();

function startCountdown() {
  gameRunning =
    false;

  gameCountdown =
    true;

  prepareGame();

  let count =
    3;

  showCountdown(
    count
  );

  const timer =
    setInterval(() => {
      count--;

      if (
        count > 0
      ) {
        showCountdown(
          count
        );

        return;
      }

      clearInterval(
        timer
      );

      showCountdown(
        "BEGIN"
      );

      setTimeout(() => {
        hideCountdown();

        gameCountdown =
          false;

        gameRunning =
          true;

        // Start with a full wave. Further enemies appear only after a kill.
        const initialEnemyCount =
          Math.min(
            MAX_ENEMIES_ON_SCREEN,
            ENEMIES_PER_ROUND
          );

        for (
          let i = 0;
          i < initialEnemyCount;
          i++
        ) {
          spawnEnemy();
        }

        if (
          musicEnabled
        ) {
          backgroundMusic.volume =
            0.55;
        }

        showMessage(
          `STAGE ${currentStageIndex + 1}: ELIMINATE ${KILLS_TO_UNLOCK_CORE} HOSTILES`
        );

      }, 600);

    }, 1000);
}

/* =========================
   START BUTTON
========================= */

const startButton =
  document.getElementById(
    "startButton"
  );

if (startButton) {
  startButton.onclick =
    () => {
      if (
        gameRunning ||
        gameCountdown
      ) {
        return;
      }

      unlockAudio();

      setStage(0);

      setLanguage(
        currentLanguage
      );

      /*
       Music begins silently
       during the actual user click.
       This helps prevent autoplay
       blocking by the browser.
      */

      if (
        musicEnabled
      ) {
        backgroundMusic.currentTime =
          0;

        backgroundMusic.volume =
          0;

        backgroundMusic
          .play()
          .catch(err => {
            console.log(
              "Music blocked:",
              err
            );
          });
      }

      const startScreen =
        document.getElementById(
          "startScreen"
        );

      if (
        startScreen
      ) {
        startScreen.style.display =
          "none";
      }

      startCountdown();
    };
}

/* =========================
   PAUSE
========================= */

function togglePause() {
  if (
    !gameRunning ||
    gameCountdown
  ) {
    return;
  }

  gamePaused =
    !gamePaused;

  const pauseMenu =
    document.getElementById(
      "pauseMenu"
    );

  if (pauseMenu) {
    pauseMenu.style.display =
      gamePaused
      ? "flex"
      : "none";
  }

  if (
    gamePaused
  ) {
    stopMusic();
  } else {
    startMusic();
  }
}

const pauseButton =
  document.getElementById(
    "pauseButton"
  );

if (
  pauseButton
) {
  pauseButton.onclick =
    togglePause;
}

const resumeButton =
  document.getElementById(
    "resumeButton"
  );

if (
  resumeButton
) {
  resumeButton.onclick =
    () => {
      gamePaused =
        false;

      const pauseMenu =
        document.getElementById(
          "pauseMenu"
        );

      if (
        pauseMenu
      ) {
        pauseMenu.style.display =
          "none";
      }

      startMusic();
    };
}

/* =========================
   MUSIC BUTTON
========================= */

const musicButton =
  document.getElementById(
    "musicButton"
  );

if (
  musicButton
) {
  musicButton.onclick =
    () => {
      musicEnabled =
        !musicEnabled;

      setLanguage(
        currentLanguage
      );

      if (
        musicEnabled
      ) {
        startMusic();
      } else {
        stopMusic();
      }
    };
}

/* =========================
   SOUND BUTTON
========================= */

const soundButton =
  document.getElementById(
    "soundButton"
  );

if (
  soundButton
) {
  soundButton.onclick =
    () => {
      soundEnabled =
        !soundEnabled;

      setLanguage(
        currentLanguage
      );
    };
}

/* =========================
   QUIT
========================= */

const quitButton =
  document.getElementById(
    "quitButton"
  );

if (
  quitButton
) {
  quitButton.onclick =
    () => {
      gameRunning =
        false;

      gamePaused =
        false;

      stopMusic();

      const pauseMenu =
        document.getElementById(
          "pauseMenu"
        );

      const startScreen =
        document.getElementById(
          "startScreen"
        );

      if (
        pauseMenu
      ) {
        pauseMenu.style.display =
          "none";
      }

      if (
        startScreen
      ) {
        startScreen.style.display =
          "flex";
      }
    };
}

/* =========================
   GAME OVER
========================= */

function endGame() {
  if (
    !gameRunning
  ) {
    return;
  }

  gameRunning =
    false;

  stopMusic();

  const gameOver =
    document.getElementById(
      "gameOver"
    );

  if (
    gameOver
  ) {
    gameOver.style.display =
      "flex";
  }
}

const restartButton =
  document.getElementById(
    "restartButton"
  );

if (
  restartButton
) {
  restartButton.onclick =
    () => {
      const gameOver =
        document.getElementById(
          "gameOver"
        );

      if (
        gameOver
      ) {
        gameOver.style.display =
          "none";
      }

      if (
        musicEnabled
      ) {
        backgroundMusic.currentTime =
          0;

        backgroundMusic.volume =
          0;

        backgroundMusic
          .play()
          .catch(() => {});
      }

      startCountdown();
    };
}

const gameOverMenuButton =
  document.getElementById(
    "gameOverMenuButton"
  );

if (gameOverMenuButton) {
  gameOverMenuButton.onclick =
    () => showLevelMenu();
}

/* =========================
   VICTORY
========================= */

function winGame() {
  if (
    gameWon ||
    !gameRunning
  ) {
    return;
  }

  rewardLevelCompletion(
    currentStageIndex
  );

  if (
    currentStageIndex <
    STAGES.length - 1
  ) {
    unlockStage(
      currentStageIndex + 1
    );

    showLevelMenu(
      `STAGE ${currentStageIndex + 2} UNLOCKED - SELECT A LEVEL`
    );
    return;
  }

  gameWon =
    true;

  gameRunning =
    false;

  stopMusic();

  const victory =
    document.getElementById(
      "victory"
    );

  if (
    victory
  ) {
    victory.style.display =
      "flex";
  }
}

const victoryButton =
  document.getElementById(
    "victoryButton"
  );

if (
  victoryButton
) {
  victoryButton.onclick =
    () => {
      const victory =
        document.getElementById(
          "victory"
        );

      if (
        victory
      ) {
        victory.style.display =
          "none";
      }

      gameWon =
        false;

      showLevelMenu();
    };
}

/* =========================
   LANGUAGE
========================= */

const translations = {
  english: {
    objective: `OBJECTIVE: ELIMINATE ${ENEMIES_PER_ROUND} ENEMIES, THEN REACH THE CORE`,
    pause: "PAUSED",
    quit: "QUIT",
    resume: "RESUME",
    sound: "SOUND",
    music: "MUSIC",
    on: "ON",
    off: "OFF",
    hull: "HULL",
    energy: "ENERGY",
    subtitle: "THE MACHINE REMEMBERS.",
    start: "ENTER THE VOID"
  },
  chinese: {
    objective: `\u4efb\u52a1\uff1a\u6d88\u706d ${ENEMIES_PER_ROUND} \u4e2a\u654c\u4eba\uff0c\u7136\u540e\u5230\u8fbe\u6838\u5fc3`,
    pause: "\u5df2\u6682\u505c",
    quit: "\u9000\u51fa",
    resume: "\u7ee7\u7eed",
    sound: "\u97f3\u6548",
    music: "\u97f3\u4e50",
    on: "\u5f00",
    off: "\u5173",
    hull: "\u8230\u4f53",
    energy: "\u80fd\u91cf",
    subtitle: "\u673a\u5668\u4ecd\u7136\u8bb0\u5f97\u3002",
    start: "\u8fdb\u5165\u865a\u7a7a"
  },
  spanish: {
    objective: `OBJETIVO: ELIMINA ${ENEMIES_PER_ROUND} ENEMIGOS Y LLEGA AL N\u00daCLEO`,
    pause: "PAUSA",
    quit: "SALIR",
    resume: "CONTINUAR",
    sound: "SONIDO",
    music: "M\u00daSICA",
    on: "S\u00cd",
    off: "NO",
    hull: "CASCO",
    energy: "ENERG\u00cdA",
    subtitle: "LA M\u00c1QUINA RECUERDA.",
    start: "ENTRAR AL VAC\u00cdO"
  },
  french: {
    objective: `OBJECTIF : \u00c9LIMINEZ ${ENEMIES_PER_ROUND} ENNEMIS PUIS ATTEIGNEZ LE NOYAU`,
    pause: "PAUSE",
    quit: "QUITTER",
    resume: "REPRENDRE",
    sound: "SON",
    music: "MUSIQUE",
    on: "OUI",
    off: "NON",
    hull: "COQUE",
    energy: "\u00c9NERGIE",
    subtitle: "LA MACHINE SE SOUVIENT.",
    start: "ENTRER DANS LE VIDE"
  }
};

function setLanguage(lang) {
  currentLanguage = lang;

  const text =
    translations[lang] ||
    translations.english;

  const setText = (id, value) => {
    const element =
      document.getElementById(id);

    if (element) {
      element.textContent = value;
    }
  };

  setText(
    "objective",
    `STAGE ${currentStageIndex + 1} - ${text.objective.replace(/\d+/, ENEMIES_PER_ROUND)}`
  );
  setText("pauseTitle", text.pause);
  setText("quitButton", text.quit);
  setText("resumeButton", text.resume);
  setText("hullText", text.hull);
  setText("energyText", text.energy);
  setText("startSubtitle", text.subtitle);
  setText("enterMenuButton", text.start);
  setText(
    "soundButton",
    `${text.sound}: ${soundEnabled ? text.on : text.off}`
  );
  setText(
    "musicButton",
    `${text.music}: ${musicEnabled ? text.on : text.off}`
  );

  return;

  const objective =
    document.getElementById(
      "objective"
    );

  if (
    !objective
  ) {
    return;
  }

  const languages = {
    english:
      "OBJECTIVE: ELIMINATE 900 ENEMIES, THEN REACH THE CORE",

    chinese:
      "ä»»åŠ¡ï¼šæ¶ˆç­900ä¸ªæ•Œäººï¼Œç„¶åŽåˆ°è¾¾æ ¸å¿ƒ",

    spanish:
      "OBJETIVO: ELIMINA 900 ENEMIGOS Y LLEGA AL NÃšCLEO",

    french:
      "OBJECTIF : Ã‰LIMINEZ 900 ENNEMIS PUIS ATTEIGNEZ LE NOYAU"
  };

  // Unicode escapes keep translated UI text stable across file encodings.
  languages.english =
    `OBJECTIVE: ELIMINATE ${ENEMIES_PER_ROUND} ENEMIES, THEN REACH THE CORE`;

  languages.chinese =
    `\u4efb\u52a1\uff1a\u6d88\u706d${ENEMIES_PER_ROUND}\u4e2a\u654c\u4eba\uff0c\u7136\u540e\u5230\u8fbe\u6838\u5fc3`;

  languages.spanish =
    `OBJETIVO: ELIMINA ${ENEMIES_PER_ROUND} ENEMIGOS Y LLEGA AL N\u00daCLEO`;

  languages.french =
    `OBJECTIF : \u00c9LIMINEZ ${ENEMIES_PER_ROUND} ENNEMIS PUIS ATTEIGNEZ LE NOYAU`;

  objective.textContent =
    (
      languages[lang] ||
      languages.english
    ).replace(
      "900",
      ENEMIES_PER_ROUND
    );
}

const languageButtons = [
  [
    "englishButton",
    "english"
  ],

  [
    "chineseButton",
    "chinese"
  ],

  [
    "spanishButton",
    "spanish"
  ],

  [
    "frenchButton",
    "french"
  ]
];

languageButtons.forEach(
  ([id, lang]) => {
    const button =
      document.getElementById(
        id
      );

    if (
      button
    ) {
      button.onclick =
        () => {
          setLanguage(
            lang
          );
        };
    }
  }
);
