/* =========================
   MUSIC
========================= */

const backgroundMusic = new Audio("./assets/audio/void_echo_intense_loop.wav");

backgroundMusic.loop = true;
backgroundMusic.volume = 0.55;
backgroundMusic.preload = "auto";

backgroundMusic.addEventListener("error", () => {
  console.log("Could not load void_echo_intense_loop.wav");
});

function unlockAudio() {
  try {
    if (!audioContext) {
      const AC =
        window.AudioContext ||
        window.webkitAudioContext;

      if (AC) {
        audioContext = new AC();
      }
    }

    if (
      audioContext &&
      audioContext.state === "suspended"
    ) {
      audioContext.resume();
    }
  } catch (err) {
    console.log(err);
  }
}

function startMusic() {
  if (
    !musicEnabled ||
    gamePaused
  ) {
    return;
  }

  backgroundMusic.volume = 0.55;

  backgroundMusic.play().catch(err => {
    console.log("Music play error:", err);
  });
}

function stopMusic() {
  backgroundMusic.pause();
}

/* =========================
   SOUND EFFECTS
========================= */

function playShootSound() {
  if (
    !soundEnabled ||
    !audioContext
  ) {
    return;
  }

  try {
    const now = audioContext.currentTime;

    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.type = "sawtooth";

    osc.frequency.setValueAtTime(
      650,
      now
    );

    osc.frequency.exponentialRampToValueAtTime(
      120,
      now + 0.1
    );

    gain.gain.setValueAtTime(
      0.12,
      now
    );

    gain.gain.exponentialRampToValueAtTime(
      0.001,
      now + 0.1
    );

    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.start(now);
    osc.stop(now + 0.1);

  } catch (err) {}
}
