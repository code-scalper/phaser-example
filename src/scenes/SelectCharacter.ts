import { Scene } from "phaser";
import TweenHelper from "../lib/TweenHelper";
import { ImageInterface } from "../lib/interfaces";
import { createSocket } from "../socket";

const InitialImages: ImageInterface[] = [
  { x: 200, y: 200, key: "character1" },
  { x: 400, y: 200, key: "character2" },
  { x: 600, y: 200, key: "character3" },
  { x: 300, y: 400, key: "character4" },
  { x: 500, y: 400, key: "character5" },
];

export class SelectCharacter extends Scene {
  // private characters: ImageInterface[];
  private images: any = [];
  constructor() {
    super({
      key: "selectCharacter",
    });
  }

  create(): void {
    const image = this.add.image(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      "phaser_logo"
    );
    image.setOrigin(0.5);
    // this.input.on('pointerdown', () => this.setGames());
    // this.input.on('pointerdown', (e)=>this.startGame(e))
    const screenText = this.add
      .text(400, 550, "Select Character")
      .setOrigin(0.5);
    TweenHelper.flashElement(this, screenText);

    // image
    InitialImages.forEach((image): void => {
      const { x, y, key } = image;
      this.createImage(x, y, key);
    });
    console.log(this.images, "images");
    this.input.on("gameobjectdown", (e: any, obj: any) =>
      this.startGame(e, obj)
    );
  }

  startGame(e: any, object: any): void {
    const { key } = object.texture;
    if (key) {
      createSocket("gatheringStar", key, key, this);
    }
  }

  createImage(centerX: number, centerY: number, name: string): void {
    const image = this.add.image(centerX, centerY, name);
    image.setInteractive();
    this.images.push(image);
  }
}
