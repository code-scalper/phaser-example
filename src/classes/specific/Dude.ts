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
    const { down, left, right, up } = scene.cursors;

    let isActive = false;
    let option = {
      playerId: scene.playerId,
      velocityX: null,
      velocityY: null,
      play: null,
      active: true,
    };
    for (const [key, value] of Object.entries({ down, left, right, up })) {
      const turn = `${scene.player.name}-${DIRECTION_SETTING[key].turn}`;
      if (value.isDown) {
        if (DIRECTION_SETTING[key].action === "x") {
          this.setVelocityX(DIRECTION_SETTING[key].val);
          option.velocityX = DIRECTION_SETTING[key].val;
        }
        if (this.body.touching.down && DIRECTION_SETTING[key].action === "y") {
          this.jump = 1;
          this.setVelocityY(DIRECTION_SETTING[key].val);
          this.isReadyJump = false;
          option.velocityY = DIRECTION_SETTING[key].val;
        }
        if (this.jump === 1 && key === "up" && this.isReadyJump) {
          this.setVelocityY(DIRECTION_SETTING[key].val);
          option.velocityY = DIRECTION_SETTING[key].val;
          this.jump = 0;
          this.isReadyJump = false;
        }
        if (this.animType !== turn && DIRECTION_SETTING[key].turn !== "") {
          // console.log(turn, this.animType, DIRECTION_SETTING[key].turn, key);
          scene.anims.play(turn, this);
          option.play = turn;
        }

        this.animType = turn;
        isActive = true;
      }
      if (key === "up" && value.isUp) {
        this.isReadyJump = true;
      }
    }
    if (this.count === 0 && isActive) {
      this.count = 1;
    }

    if (isActive === false) {
      this.setVelocityX(0);
      this.anims.play(`${scene.player.name}-face`);
    }
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
