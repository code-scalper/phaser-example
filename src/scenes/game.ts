import { Scene } from "phaser";
import TweenHelper from "../lib/TweenHelper";
export class Game extends Scene {
  constructor() {
    super({
      key: "GameScene",
    });
  }

  create(): void {
    const image = this.add.image(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      "phaser_logo"
    );
    image.setOrigin(0.5);
    this.input.on("pointerdown", () => this.setGames());

    const screenText = this.add
      .text(400, 550, "Press any button to play...")
      .setOrigin(0.5);
    TweenHelper.flashElement(this, screenText);
  }

  setGames(): void {
    this.scene.start("GatheringStarsScene");
  }
}
