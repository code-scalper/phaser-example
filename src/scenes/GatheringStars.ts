import { Scene } from "phaser";
import { ImageInterface } from "../lib/interfaces";
import { joinGameRoom, updateGameRoom } from "../socket";

const InitialImages: ImageInterface[] = [
  { x: 400, y: 300, name: "sky" },
  //  { x: 400, y: 300, name: "star" },
];
const DIRECTION_SETTING: any = {
  up: { action: "y", val: -250, turn: "" },
  left: { action: "x", val: -160, turn: "left" },
  right: { action: "x", val: 160, turn: "right" },
  down: { action: "y", val: 160, turn: "face" },
};

export class GatheringStars extends Scene {
  joinedUsers: any = [];
  stars: any;
  platforms: any;
  player: any;
  players: any = [];
  cursors: any;
  private jump: number = 0;
  private isReadyJump: boolean = false;
  scoreText: any;
  bombs: any;
  constructor() {
    super({
      key: "gatheringStar",
    });
  }

  create(): void {
    joinGameRoom(this);
    // image
    InitialImages.forEach((image): void => {
      const { x, y, name } = image;
      this.createImage(x, y, name);
    });

    // platform
    this.createPlatforms();
    // stars
    // this.createStars();

    // player
    // this.createPlayers();
    this.createAnims("dude");

    // collider setting
    // this.physics.add.collider(this.player, this.platforms);
    // this.cursors = this.input.keyboard.createCursorKeys();
    // this.jump = 0;

    // // collecting stars
    // this.physics.add.overlap(
    //   this.player,
    //   this.stars,
    //   this.collectStar,
    //   undefined,
    //   this
    // );

    // // score
    // this.data.set("score", 0);
    // this.scoreText = this.add
    //   .text(16, 16, "score: 0", { fontSize: "32px", backgroundColor: "#000" })
    //   .setName("scoreText");

    // // create bomb
    // this.createBomb();
  }

  update(): void {
    // this.handlePlayerMoves();
    // this.checkDirection();
  }

  handlePlayerMoves(): void {
    this.getMove();
  }
  getMove() {
    const { down, left, right, up } = this.cursors;
    let isActive = false;
    for (const [key, value] of Object.entries({ down, left, right, up })) {
      if (value.isDown) {
        if (DIRECTION_SETTING[key].action === "x") {
          this.player.setVelocityX(DIRECTION_SETTING[key].val);
          this.player.anims.play(DIRECTION_SETTING[key].turn, true);
        }
        if (
          this.player.body.touching.down &&
          DIRECTION_SETTING[key].action === "y"
        ) {
          this.jump = 1;
          this.player.setVelocityY(DIRECTION_SETTING[key].val);
          if (this.player.anims && DIRECTION_SETTING[key].turn) {
            this.player.anims.play(DIRECTION_SETTING[key].turn);
          }
          this.isReadyJump = false;
        }
        if (this.jump === 1 && key === "up" && this.isReadyJump) {
          console.log(this.jump, key, this.isReadyJump);
          this.player.setVelocityY(DIRECTION_SETTING[key].val);
          this.jump = 0;
          this.isReadyJump = false;
        }
        isActive = true;
      }
      if (key === "up" && value.isUp) {
        this.isReadyJump = true;
      }
    }
    if (isActive === false) {
      this.player.setVelocityX(0);
      this.player.anims.play("face");
    }
  }

  createBomb(): void {
    this.bombs = this.physics.add.group();

    this.data.set("bombs", this.bombs);

    this.physics.add.collider(this.bombs, this.platforms);

    this.physics.add.collider(
      this.player,
      this.bombs,
      this.hitBomb,
      undefined,
      this
    );
  }
  hitBomb(player: any, bomb: any) {
    this.physics.pause();
    player.setTint(0xff0000);

    player.anims.play("turn");
  }
  collectStar(player: any, star: any) {
    this.data.set("score", this.data.get("score") + 10);
    this.scoreText.setText("Score: " + this.data.get("score"));
    star.disableBody(true, true);

    const stars = this.data.get("stars");

    if (stars.countActive(true) === 0) {
      stars.children.iterate(function (child: any) {
        child.enableBody(true, child.x, 0, true, true);
      });
    }
    const x =
      player.x < 400
        ? Phaser.Math.Between(400, 800)
        : Phaser.Math.Between(0, 400);
    const bombs = this.data.get("bombs");
    const bomb = bombs.create(x, 16, "bomb");
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
  }
  createStars(): void {
    this.stars = this.physics.add.group({
      key: "star",

      repeat: 11,

      setXY: { x: 12, y: 0, stepX: 70 },
    });

    this.data.set("stars", this.stars);

    this.stars.children.iterate(function (child: any) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    this.physics.add.collider(this.stars, this.platforms);
  }
  createImage(centerX: number, centerY: number, name: string): void {
    this.add.image(centerX, centerY, name);
  }
  createPlatforms(): void {
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(400, 568, "ground").setScale(2).refreshBody();
    this.platforms.create(600, 400, "ground");
    this.platforms.create(50, 250, "ground");
    this.platforms.create(750, 220, "ground");
  }
  createPlayers(users: any): void {
    // 그냥 전부 추가
    users.forEach((user, index) => {
      const player = this.physics.add
        .sprite(100 + index * 30, 450, "dude")
        .setName(user.id);
      player.setBounce(0.2);
      player.setCollideWorldBounds(true);
      this.players.push(player);
    });

    // const joinedNames = this.players.map((p) => p.name);
    // console.log(joinedNames, "names");
    // const unjoinedUsers = users.filter((user) => {
    //   return !joinedNames.includes(user.id);
    // });
    // console.log(this.players, unjoinedUsers, "unjoined users");

    // unjoinedUsers.forEach((user, index) => {
    //   const player = this.physics.add
    //     .sprite(100 + index * 10, 450, "dude")
    //     .setName(user.id);
    //   player.setBounce(0.2);
    //   player.setCollideWorldBounds(true);
    //   this.players.push(player);
    // });

    // console.log(this.players, "players");
  }
  createAnims(name: string): void {
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers(name, { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "face",
      frames: [{ key: name, frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers(name, { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });
  }
}
