import { Text } from "../index";

export default class ScoreText extends Text {
  scoreText = "";
  constructor(scene, option) {
    super(scene, option);
    this.scoreText = option.prop;
  }

  onPointerup(pointer) {
    // this.setState("move");
    // this.moveTo(pointer.x, pointer.y);
  }
}
