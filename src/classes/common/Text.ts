import TweenHelper from "../../lib/TweenHelper";

export default class Text {
  constructor(scene, option) {
    const { prop, x, y, text, isBlink, style = {}, origin = 0 } = option;
    scene[prop] = scene.add.text(x, y, text, { ...style }).setOrigin(origin);
    if (isBlink) {
      TweenHelper.flashElement(scene, scene[prop]);
    }
  }
}
