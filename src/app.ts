import "phaser";
import Boot from "./scenes/boot";
import Preload from "./scenes/preload";
import { Game as GameScene } from "./scenes/game";
import GatheringStarsScene from "./scenes/GatheringStars";
import { SelectCharacter } from "./scenes/SelectCharacter";
import { joinChatRoom } from "./socket";

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
    mode: Phaser.AUTO,
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

const socketText = "hello";

window.addEventListener("load", () => {
  window["game"] = new Phaser.Game(config);
  GAME = window["game"];
  joinChatRoom();
});
