import "phaser";
import Boot from "./scenes/boot";
import Preload from "./scenes/preload";
import { Game as GameScene } from "./scenes/game";
import GatheringStarsScene from "./scenes/GatheringStars";
import { SelectCharacter } from "./scenes/SelectCharacter";

const config: Phaser.Types.Core.GameConfig = {
  title: "Demo Game",
  type: Phaser.AUTO,
  scene: [Boot, Preload, GameScene, GatheringStarsScene, SelectCharacter],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
    },
  },
  backgroundColor: "#333",
  scale: {
    mode: Phaser.Scale.FIT,
    parent: "game-container",
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 600,
    max: {
      width: 800,
      height: 600,
    },
  },
  pixelArt: true,
};

let GAME = null;
window.addEventListener("load", () => {
  window["game"] = new Phaser.Game(config);
  GAME = window["game"];
});
