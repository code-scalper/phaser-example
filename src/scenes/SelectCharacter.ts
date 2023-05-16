import { Scene } from "phaser";
import TweenHelper from "../lib/TweenHelper";
import { ImageInterface } from "../lib/interfaces";
import { checkUserSocket } from "../socket";

const InitialImages: ImageInterface[] = [
  { x: 200, y: 200, key: "pic_player1", player: "player1" },
  { x: 400, y: 200, key: "pic_player2", player: "player2" },
  { x: 600, y: 200, key: "pic_player3", player: "player3" },
  { x: 300, y: 400, key: "pic_player4", player: "player4" },
  { x: 500, y: 400, key: "pic_player5", player: "player5" },
];

export class SelectCharacter extends Scene {
  // private characters: ImageInterface[];
  private images: any = [];
  private selectedIds = [];
  constructor() {
    super({
      key: "SelectCharacter",
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
    TweenHelper.flashElement(this, screenText, 1000);

    checkUserSocket(this);
    // image
    InitialImages.forEach((image): void => {
      const { x, y, key, player } = image;
      this.createImage(x, y, key, player);
    });

    this.input.on("gameobjectdown", (e: any, obj: any) =>
      this.startGame(e, obj)
    );
  }
  displayUser(users) {
    const userIds = users.map((user) => user.id);
    this.images.forEach((image) => {
      if (userIds.includes(image.name)) {
        image.setAlpha(0.5).setTint(0xff0000);
        this.selectedIds.push(image.name);
      }
    });
  }

  startGame(e: any, object: any): void {
    if (this.selectedIds.includes(object.name)) return;

    this.registry.set("player", object.name);
    this.scene.start("GatheringStars");
  }

  createImage(
    centerX: number,
    centerY: number,
    name: string,
    player: string
  ): void {
    const image = this.add
      .image(centerX, centerY, name)
      .setScale(3)
      .setName(player);
    image.setInteractive();
    this.images.push(image);
  }
}
