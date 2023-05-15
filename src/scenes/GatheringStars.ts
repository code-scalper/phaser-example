import { Scene } from "phaser";
import { ImageInterface } from "../lib/interfaces";
// import { joinGameRoom, updateGameRoom } from "../socket";

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
  startText;
  stars;
  cursors;
  player;
  constructor() {
    super({
      key: "GatheringStarsScene",
    });
  }

  create(): void {
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
      "character1Dude"
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

    // // score
    // this.data.set("score", 0);
    // this.scoreText = this.add
    //   .text(16, 16, "score: 0", { fontSize: "32px", backgroundColor: "#000" })
    //   .setName("scoreText");

    // // create bomb
    // this.createBomb();

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
  }

  // createBomb(): void {
  //   this.bombs = this.physics.add.group();

  //   this.data.set("bombs", this.bombs);

  //   this.physics.add.collider(this.bombs, this.platforms);

  //   this.physics.add.collider(
  //     this.player,
  //     this.bombs,
  //     this.hitBomb,
  //     undefined,
  //     this
  //   );
  // }
  // hitBomb(player: any, bomb: any) {
  //   this.physics.pause();
  //   player.setTint(0xff0000);

  //   player.anims.play("turn");
  // }
  // collectStar(player: any, star: any) {
  //   this.data.set("score", this.data.get("score") + 10);
  //   this.scoreText.setText("Score: " + this.data.get("score"));

  //   console.log(star, "star!!!!");
  //   star.disableBody(true, true);

  //   const stars = this.data.get("stars");

  //   if (stars.countActive(true) === 0) {
  //     stars.children.iterate(function (child: any) {
  //       child.enableBody(true, child.x, 0, true, true);
  //     });
  //   }
  //   const x =
  //     player.x < 400
  //       ? Phaser.Math.Between(400, 800)
  //       : Phaser.Math.Between(0, 400);
  //   const bombs = this.data.get("bombs");
  //   const bomb = bombs.create(x, 16, "bomb");
  //   bomb.setBounce(1);
  //   bomb.setCollideWorldBounds(true);
  //   bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
  // }
  // createStars(): void {
  //   this.stars = this.physics.add.group({
  //     key: "star",

  //     repeat: 11,

  //     setXY: { x: 12, y: 0, stepX: 70 },
  //   });

  //   this.data.set("stars", this.stars);

  //   this.stars.children.iterate(function (child: any) {
  //     child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  //   });

  //   this.physics.add.collider(this.stars, this.platforms);

  //   this.physics.add.overlap(
  //     this.player,
  //     this.stars,
  //     this.collectStar,
  //     undefined,
  //     this
  //   );

  //   console.log(this.stars, "stars");
  // }
  // setColliderStars() {
  //   // star 는 그냥 socket으로 처리
  // }

  // createPlayers(users: any): void {
  //   // 그냥 전부 추가
  //   // this.players.forEach((player) => {
  //   //   player.destroy();
  //   // });
  //   this.player.destroy();
  //   this.players = [];
  //   users.forEach((user, index) => {
  //     const player = this.physics.add
  //       .sprite(100 + index * 30, 450, `${user.character}Dude`)
  //       .setName(user.id);
  //     player.setBounce(0.2);
  //     player.setCollideWorldBounds(true);
  //     this.physics.add.collider(player, this.platforms);

  //     this.players.push(player);
  //   });

  //   if (this.playerId === "") {
  //     this.playerId = this.players[users.length - 1].name;
  //   }

  //   if (this.player === null) {
  //     this.player = this.players.find((p) => p.name === this.playerId);
  //     this.createAnims(`${this.player.name}Dude`);
  //   }

  //   this.cursors = this.input.keyboard.createCursorKeys();
  //   // const joinedNames = this.players.map((p) => p.name);
  //   // console.log(joinedNames, "names");
  //   // const unjoinedUsers = users.filter((user) => {
  //   //   return !joinedNames.includes(user.id);
  //   // });
  //   // console.log(this.players, unjoinedUsers, "unjoined users");

  //   // unjoinedUsers.forEach((user, index) => {
  //   //   const player = this.physics.add
  //   //     .sprite(100 + index * 10, 450, "dude")
  //   //     .setName(user.id);
  //   //   player.setBounce(0.2);
  //   //   player.setCollideWorldBounds(true);
  //   //   this.players.push(player);
  //   // });

  //   // console.log(this.players, "players");
  // }
}
