import "phaser";
import Boot from "./scenes/boot";
import Preload from "./scenes/preload";
import { Game as GameScene } from './scenes/game';
import { GatheringStars } from "./scenes/GatheringStars";
import { SelectCharacter } from "./scenes/SelectCharacter";


// let socketConnectionOpts = {
//   forceNew: true
// }

// console.log(socket)
// let socket1 = socket.connect('http://localhost:3000', socketConnectionOpts)



const config: Phaser.Types.Core.GameConfig = {
  title: "Demo Game",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
    },
  },
  scene: [Boot, Preload, GameScene, GatheringStars,SelectCharacter],
  backgroundColor: "#333",
  scale: {
    mode: Phaser.Scale.FIT,
    parent: "game-container",
    autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
    width: 800,
    height: 600,
    max: {
      width: 800,
      height: 600,
    },
  },
};



window.addEventListener("load", () => {
  window["game"] = new Phaser.Game(config);
});
