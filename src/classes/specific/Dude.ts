import Character from "../common/Character";
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
  count;
  animType: string = "face";
  constructor(scene, x, y, key, name) {
    super(scene, x, y, key, name);
    this.scene = scene;
    this.name = name;
    this.createAnims(scene, name);
  }

  getMove(scene) {
    if (!scene || !scene.cursors || !scene.anims) return;
    const { down, left, right, up } = scene.cursors;

    let isActive = false;
    for (const [key, value] of Object.entries({ down, left, right, up })) {
      if (value.isDown) {
        if (DIRECTION_SETTING[key].action === "x") {
          this.setVelocityX(DIRECTION_SETTING[key].val);
        }
        if (this.body.touching.down && DIRECTION_SETTING[key].action === "y") {
          this.jump = 1;
          this.setVelocityY(DIRECTION_SETTING[key].val);
          this.isReadyJump = false;
        }
        if (this.jump === 1 && key === "up" && this.isReadyJump) {
          this.setVelocityY(DIRECTION_SETTING[key].val);
          this.jump = 0;
          this.isReadyJump = false;
        }
        if (
          this.animType !== DIRECTION_SETTING[key].turn &&
          DIRECTION_SETTING[key].turn !== ""
        ) {
          scene.anims.play(DIRECTION_SETTING[key].turn, this);
        }

        this.animType = DIRECTION_SETTING[key].turn;
        isActive = true;
      }
      if (key === "up" && value.isUp) {
        this.isReadyJump = true;
      }
    }
    if (isActive === false) {
      if (this.count < 3) {
        console.log(this.anims);
        this.count = this.count + 1;
      }

      this.setVelocityX(0);
      this.anims.play("face");
    }
  }

  createAnims(scene, name: string): void {
    scene.anims.create({
      key: "left",
      frames: scene.anims.generateFrameNumbers(name, { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    scene.anims.create({
      key: "face",
      frames: [{ key: name, frame: 4 }],
      frameRate: 20,
    });

    scene.anims.create({
      key: "right",
      frames: scene.anims.generateFrameNumbers(name, { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });
  }
  onPointerup(pointer) {
    // this.setState("move");
    // this.moveTo(pointer.x, pointer.y);
  }
}
