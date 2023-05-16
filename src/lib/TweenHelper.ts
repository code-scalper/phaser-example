export default class TweenHelper {
  static flashElement(scene, targets, duration) {
    targets.setAlpha(0);
    if (scene && targets) {
      scene.tweens.add({
        targets,
        alpha: 1,
        ease: "Cubic.easeOut",
        duration,
        repeat: -1,
        yoyo: true,
      });
    }
  }
}
