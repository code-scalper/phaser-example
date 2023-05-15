import { Text } from "../index";

export default class ScoreText extends Text {
  constructor(scene, option) {
    super(scene, option);
    scene.data.set("score", 0);
  }

  onPointerup(pointer) {
    // this.setState("move");
    // this.moveTo(pointer.x, pointer.y);
  }
}
