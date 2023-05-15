import GatheringStarsScene from "../../scenes/GatheringStars";
import { EMITTER } from "../../lib/Common";

interface Position {
  x: number;
  y: number;
}
export default class Character extends Phaser.Physics.Arcade.Sprite {
  private moveSpeed: number = 0;
  private previous: Position = { x: 0, y: 0 };
  private degree: number = 0;
  private target: any;
  private characterName: string;
  constructor(scene, x, y, key, name) {
    super(scene, x, y, key);
    scene.add.existing(this, true);
    scene.physics.add.existing(this);
    // this.characterName = name;
    // this.moveSpeed = 200;
    this.setName(name);
    this.setCollideWorldBounds(true);
    this.body.setOffset(0, 15);
    // this.setImmovable(true);
    this.setBounce(0.2);
    this.setTexture("dude");
    GatheringStarsScene.group.add(this);
    scene.physics.add.collider(this, GatheringStarsScene.staticGroup);

    // console.log(GatheringStarsScene.group, "this");
    // scene.physics.add.overlap(
    //   this,
    //   GatheringStarsScene.group,
    //   this.onOverlap,
    //   null,
    //   this
    // );

    // this.previous = { x: this.x, y: this.y };
    // this.degree = 0;
    // // this.state = "idle";
    // this.target = new Phaser.Math.Vector2();

    // this.on(
    //   Phaser.Animations.Events.ANIMATION_UPDATE,
    //   function (animation, frame, gameObject) {
    //     this.degree = this.getAngle(this, this.previous);
    //     if (this.previous.degree != this.degree) {
    //       this.play(this.state + "_" + this.degree);
    //     }
    //     this.body.setSize(this.width, this.height);
    //     this.previous = { x: this.x, y: this.y, degree: this.degree };
    //   }.bind(this),
    //   this
    // );

    // EMITTER.on("pointerUp", this.onPointerup, this);
    // EMITTER.on("pointerDrag", this.onPointerDrag, this);

    // const table_frames = [
    //   ["idle_", [1]],
    //   ["fire_", [19, 28]],
    //   ["move_", [37, 46, 55, 64, 73, 82, 91, 100, 109]],
    // ];
    // this.makeAnimation(table_frames);
    // this.play("idle_0");
  }

  onOverlap(unit) {
    // console.log(unit);
    // const circle = new Phaser.Geom.Circle(unit.x, unit.y, 20);
    // Phaser.Actions.PlaceOnCircle(GameScene.group.getChildren(), circle);
  }

  onPointerup(pointer) {}
  onPointerDrag(pointer) {}

  // makeAnimation(table_frames) {
  //   const angle_chunk = 22.5;
  //   const frames_chunk = 9;
  //   for (var i = 0; i < table_frames.length; i++) {
  //     var start_frame = 0;
  //     for (var j = 0; j <= 360 / 2; j += angle_chunk) {
  //       var frames = new Array();
  //       for (var k = 0; k < table_frames[i][1].length; k++) {
  //         frames.push(table_frames[i][1][k] + start_frame);
  //       }
  //       start_frame += 1;
  //       this.anims.create({
  //         key: table_frames[i][0] + j,
  //         frames: this.anims.generateFrameNumbers("dude", { frames: frames }),
  //         frameRate: 10,
  //         repeat: table_frames[i][1].length == 1 ? 1 : -1,
  //       });
  //     }
  //   }
  // }

  // getAngle(p1: Position, p2: Position) {
  //   if (p1.x === p2.x && p1.y === p2.y) return this.degree;
  //   var angle = Phaser.Math.Angle.Between(p1.x, p1.y, p2.x, p2.y);
  //   var reverseAngle = Phaser.Math.Angle.Reverse(angle + Math.PI / 2);
  //   var degree = Math.round(Phaser.Math.RadToDeg(reverseAngle));
  //   degree = degree - (degree % 22.5);
  //   if (degree > 180) {
  //     this.setFlipX(true);
  //     degree = 180 - (degree - 180);
  //   } else this.setFlipX(false);
  //   return degree;
  // }

  // setState(key: string | number) {
  //   this.state = key;
  //   this.play(key + "_" + this.degree);
  //   return this;
  // }

  // moveTo(x, y) {
  //   console.log("x, y", x, y);
  //   this.target.x = x;
  //   this.target.y = y;
  //   this.scene.physics.moveToObject(this, this.target, this.moveSpeed);
  // }

  // getDirFromAngle() {
  //   var tx = Math.cos(this.degree);
  //   var ty = Math.sin(this.degree);
  //   return { tx, ty };
  // }
}
