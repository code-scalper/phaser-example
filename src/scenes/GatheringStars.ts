import { Scene } from "phaser";
import { ImageInterface } from "../lib/interfaces";
import { createSocket, createStarsSocket } from "../socket";

import { Dude, Platforms, Images, Text, Stars, ScoreText } from "../classes";
const INITIAL_IMAGES: ImageInterface[] = [
  { x: 400, y: 300, key: "sky" },
  //  { x: 400, y: 300, name: "star" },
];
const INITIAL_PLATFORMS = [
  { x: 400, y: 568, key: "ground", scale: 2, refresh: true },
  { x: 600, y: 400, key: "ground" },
  { x: 50, y: 250, key: "ground" },
  { x: 750, y: 220, key: "ground" },
];

export default class GatheringStarsScene extends Scene {
  static group;
  static staticGroup;
  static graphics;
  private playerId;
  private playerIds = [];
  startText;
  stars;
  cursors;
  player;
  players = [];
  bombs;
  constructor() {
    super({
      key: "GatheringStars",
    });
  }

  create(): void {
    this.playerId = this.registry.get("player");
    createSocket("GatheringStars", this.playerId, this);

    // this.cameras.main.setBounds(0, 0, 3200, 600).setName("main");
    GatheringStarsScene.group = this.physics.add.group();
    GatheringStarsScene.staticGroup = this.physics.add.staticGroup();
    GatheringStarsScene.graphics = this.add.graphics();

    // create background
    new Images(this, INITIAL_IMAGES);

    // create ground
    new Platforms(GatheringStarsScene.staticGroup, INITIAL_PLATFORMS);

    // create start text
    const textOption = {
      prop: "startText",
      text: "Press Space to start!",
      x: 400,
      y: 550,
      blink: true,
      origin: 0.5,
    };
    new Text(this, textOption);

    // create player
    this.player = new Dude(
      this,
      200,
      400,
      "GatheringStarsScene",
      `${this.playerId}Dude`
    );

    // score text
    const scoreTextOption = {
      prop: "scoreText",
      text: "Score: 0",
      x: 16,
      y: 16,
      style: { fontSize: "32px", backgroundColor: "#000" },
    };
    new ScoreText(this, scoreTextOption);

    // events
    this.input.keyboard.on("keydown", (e: any, obj: any) =>
      this.handlePress(e, obj)
    );
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update(): void {
    this.player.getMove(this);
  }
  handlePress(e, object) {
    // console.log(e, object);
    if (e.code === "Space") {
      createStarsSocket();
    }
  }

  joinUser(users) {
    users.forEach((user, index) => {
      if (this.playerId !== user.id && !this.playerIds.includes(user.id)) {
        const player = new Dude(
          this,
          200,
          400,
          "GatheringStarsScene",
          `${user.id}Dude`
        );
        this.players.push(player);
        this.playerIds.push(user.id);
      }
    });
  }

  moveCharacter(res) {
    const target = this.players.find((player) => {
      return player.name === `${res.option.playerId}Dude`;
    });
    if (target) {
      target.getUserMove(res.option, target);
    }
    // console.log(target, "move character");
  }

  createStars() {
    const option = {
      name: "stars",
      key: "star",
      repeat: 11,
      x: 12,
      y: 0,
      stepX: 70,
      stepY: 0,
    };
    new Stars(this, option, GatheringStarsScene.staticGroup);
    this.startText.setVisible(false);
  }
  removePlayer(player) {
    const index = this.players.findIndex((p) => {
      return p.name === player;
    });
    if (index > -1) {
      this.players[index].setAlpha(0.2).setTint(0xff0000).disableBody(true);
      this.players.splice(index, 1);
    }
  }
}
