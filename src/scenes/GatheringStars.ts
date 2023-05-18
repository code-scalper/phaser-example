import { Scene } from "phaser";
import { ImageInterface } from "../lib/interfaces";
import { joinUserSocket, createStarsSocket, gameoverSocket } from "../socket";

import { Dude, Platforms, Images, Text, Stars, ScoreText } from "../classes";
const INITIAL_IMAGES: ImageInterface[] = [
  { x: 400, y: 300, key: "sky", player: "" },
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
  scoreTexts = [];
  constructor() {
    super({
      key: "GatheringStars",
    });
  }

  create(): void {
    this.playerId = this.registry.get("player");
    joinUserSocket("GatheringStars", this.playerId, this);

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
      `${this.playerId}`
    );

    // events
    this.input.keyboard.on("keydown", (e: any, obj: any) =>
      this.handlePress(e, obj)
    );
    this.cursors = this.input.keyboard.createCursorKeys();
    this.player.getMove(this);
  }

  update(): void {}
  handlePress(e, object) {
    // console.log(e, object);
    if (e.code === "Space") {
      createStarsSocket();
    }
  }

  updateScore(usersScore) {
    usersScore.forEach((s, index) => {
      const { key, label, score } = s;
      const textName = `${key}ScoreText`;
      const target = this.scoreTexts.find((text) => {
        return text.name === textName;
      });
      if (target) {
        target.setText(`${label}: ${score}`);
      } else {
        const option = {
          prop: textName,
          text: `${label}: ${score}`,
          x: 16 + 150 * index,
          y: 16,
          style: { fontSize: "20px", backgroundColor: "#000" },
        };
        const text = new ScoreText(this, option);
        this.scoreTexts.push(text);
      }
    });
  }

  joinUser(users) {
    users.forEach((user, index) => {
      if (this.playerId !== user.id && !this.playerIds.includes(user.id)) {
        const player = new Dude(
          this,
          200,
          400,
          "GatheringStarsScene",
          `${user.id}`
        );
        this.players.push(player);
        this.playerIds.push(user.id);
      }
    });
  }

  moveCharacter(res) {
    const target = this.players.find((player) => {
      return player.name === `${res.option.playerId}`;
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
  gameover(usersScore) {
    const winner = usersScore.reduce(
      (acc, cur) => {
        if (acc.score < cur.score) {
          acc = { ...cur };
        }
        return acc;
      },
      { score: 0, key: "", label: "" }
    );
    if (winner.key !== "") {
      const winnerDude = new Dude(
        this,
        400,
        200,
        "GatheringStarsScene",
        winner.key
      );
      winnerDude.setScale(3).setVelocity(0, 0);
      const textOption = {
        prop: "resultText",
        text: `Winner 👏👏👏 ${winner.label}`,
        x: 400,
        y: 300,
        blink: true,
        origin: 0.5,
      };
      new Text(this, textOption);
    }
  }
  displayUser(users) {}
}
