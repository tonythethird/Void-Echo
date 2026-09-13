# VOID//ECHO

> The machine remembers.

VOID//ECHO is a neon sci-fi arena shooter built with vanilla HTML, CSS, and JavaScript. Pilot an experimental aircraft through five increasingly hostile sectors, destroy the alien signals guarding each core, and collect resources to expand your fleet.

## Features

- Five progressively harder stages, from **The Breach** to **Null Crown**
- Fast, energy-based shooting and a close-range **Echo Field** ability
- Four aircraft with distinct speed, hull, energy, and damage trade-offs
- Collectible coins, gems, trophies, hull cells, energy cells, and special ammunition
- Persistent stage progress, resources, owned aircraft, and aircraft selection through browser storage
- Animated canvas graphics, particle effects, synthesized sound effects, and a looping background soundtrack
- Pause-menu controls for music, sound, and English, Chinese, Spanish, or French interface text
- No frameworks, package manager, build step, or external runtime dependencies

## Play locally

Clone the repository:

```bash
git clone https://github.com/tonythethird/Void-Echo.git
cd Void-Echo
```

You can open `index.html` directly in a modern desktop browser. For the most consistent browser behavior, serve the folder locally:

```bash
python -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000).

## Controls

| Input | Action |
| --- | --- |
| `W` `A` `S` `D` | Move |
| `Space` | Fire in the current direction |
| `Home` / `Page Up` / `End` / `Page Down` | Aim diagonally |
| `E` | Activate the Echo Field |
| `Esc` | Pause or resume |

The Echo Field costs energy, damages and briefly stuns nearby enemies, and has a short cooldown. Standard shots also consume energy, which regenerates over time.

## How to play

1. Enter the void and choose an unlocked stage.
2. Eliminate hostile signals until the alien core opens.
3. Reach the open core to complete the stage and unlock the next sector.
4. Collect coins and rare gems during missions; completed stages award trophies.
5. Spend coins in the aircraft shop to unlock new craft and choose a loadout that suits your play style.

Progress is saved automatically in your browser's `localStorage`. Clearing site data will reset saved resources, aircraft, and stage unlocks.

## Power-ups

| Power-up | Effect |
| --- | --- |
| Hull cell | Restores hull integrity |
| Energy cell | Restores weapon and ability energy |
| Plasma ammo | Adds bonus damage for 12 shots |
| Rapid ammo | Increases fire rate for 20 shots |
| Gem | Adds one rare gem to your persistent inventory |

## Aircraft

| Craft | Role |
| --- | --- |
| **ECHO MK-I** | Balanced starter craft |
| **WRAITH** | Faster movement with a more fragile hull |
| **BULWARK** | Heavy hull and damage at the cost of speed and fire rate |
| **PULSE** | High-speed glass cannon with rapid plasma fire |

## Project structure

```text
Void-Echo/
|-- assets/
|   |-- audio/              # Background music
|   `-- ui/                 # Resource and interface artwork
|-- js/
|   |-- core/               # State, input, audio, and world setup
|   |-- engine/             # Frame update logic
|   |-- entities/           # Player, enemies, projectiles, and power-ups
|   |-- rendering/          # Canvas rendering and visual effects
|   |-- ui/                 # HUD, menus, shop, and rewards
|   |-- main.js             # Initial state and animation loop
|   `-- session.js          # Game sessions, progression, and localization
|-- index.html              # Game markup and script loading
|-- style.css               # Interface and layout styles
`-- LICENSE
```

## Technology

- HTML5 Canvas
- CSS3
- Vanilla JavaScript
- Web Audio API
- Web Storage API

## License

This project is available under the [MIT License](LICENSE).
