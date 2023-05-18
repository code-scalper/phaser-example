import Character from "../common/Character";
import { moveCharacterSocket } from "../../socket";
const DIRECTION_SETTING: any = {
  up: { action: "y", val: -250, turn: "" },
  left: { action: "x", val: -160, turn: "left" },
  right: { action: "x", val: 160, turn: "right" },
  down: { action: "y", val: 160, turn: "face" },
};
export default class Dude extends Character {
  jump: number;
  isReadyJump: boolean;
  name: string;
  count = 0;
  animType: string = "face";
  constructor(scene, x, y, key, name) {
    super(scene, x, y, key, name);
    this.scene = scene;
    this.name = name;
    this.createAnims(scene, name);
  }

  getUserMove(option, character) {
    const { playerId, velocityX, velocityY, play, active } = option;

    if (velocityX) {
      character.setVelocityX(velocityX);
    }

    if (velocityY) {
      character.setVelocityY(velocityY);
    }
    if (!active) {
      character.setVelocityX(0);
      this.anims.play(`${playerId}-face`);
    }
  }

  getMove(scene) {
    if (!scene || !scene.cursors || !scene.anims) return;

    const touchingGround = this.body.touching.down;
    let jumpCount = 0;
    let isActive = false;
    let option = {
      playerId: scene.playerId,
      velocityX: null,
      velocityY: null,
      play: null,
      active: true,
    };

    console.log(touchingGround, this.body);

    if (touchingGround) {
      alert("touchingGround");
      jumpCount = 0;
    }

    // let keyStatus = {
    //   left: false,
    //   right: false,
    //   up: false,
    //   down: false,
    // };

    // this.anims.play(`${scene.player.name}-face`);

    // scene.input.keyboard.on("keydown-LEFT", () => {
    //   this.setVelocityX(-160);
    //   this.moveState = "left";

    //   this.anims.play("left", true);
    // });

    // scene.input.keyboard.on("keydown-RIGHT", () => {
    //   this.setVelocityX(160);
    //   this.moveState = "right";
    //   this.anims.play("right", true);
    // });

    // scene.input.keyboard.on("keyup-LEFT", () => {
    //   if (this.moveState === "left") {
    //     this.setVelocityX(0);
    //     this.moveState = "idle_left";
    //     this.anims.play("turn_left", true);
    //   }
    // });

    // scene.input.keyboard.on("keyup-RIGHT", () => {
    //   if (this.moveState === "right") {
    //     this.setVelocityX(0);
    //     this.moveState = "idle";
    //     this.anims.play("turn", true);
    //   }
    // });

    scene.input.keyboard.on("keydown-LEFT", () => {
      this.setVelocityX(-160);
      option.velocityX = 160;
      this.anims.play(`${option.playerId}-left`, true);
      option.play = "left";
    });

    scene.input.keyboard.on("keydown-RIGHT", () => {
      this.setVelocityX(160);
      option.velocityX = -160;
      this.anims.play(`${option.playerId}-right`, true);
      option.play = "right";
    });

    scene.input.keyboard.on("keyup-LEFT", () => {
      this.setVelocityX(0);
      option.velocityX = 0;
      this.anims.play(`${scene.player.name}-face`);
    });

    scene.input.keyboard.on("keyup-RIGHT", () => {
      this.setVelocityX(0);
      option.velocityX = 0;
      this.anims.play(`${scene.player.name}-face`);
    });

    scene.input.keyboard.on("keydown-UP", () => {
      console.log(jumpCount, "jumpCount");
      if (jumpCount === 2 && this.body.touching.down) {
        jumpCount = 0;
      }
      if (jumpCount < 2) {
        this.setVelocityY(-250);

        option.velocityY = -250;
        jumpCount++;
      }
    });

    option.active = isActive;
    moveCharacterSocket(option, this);
  }

  createAnims(scene, name: string): void {
    scene.anims.create({
      key: `${name}-left`,
      frames: scene.anims.generateFrameNumbers(name, { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    scene.anims.create({
      key: `${name}-face`,
      frames: [{ key: name, frame: 4 }],
      frameRate: 20,
    });

    scene.anims.create({
      key: `${name}-right`,
      frames: scene.anims.generateFrameNumbers(name, { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.play(`${this.name}-face`);
  }
  onPointerup(pointer) {
    // this.setState("move");
    // this.moveTo(pointer.x, pointer.y);
  }
}
