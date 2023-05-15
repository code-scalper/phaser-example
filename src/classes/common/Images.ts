export default class Images {
  constructor(scene, items) {
    if (items.length > 0 && scene) {
      items.forEach((item) => {
        const { x, y, key } = item;
        scene.add.image(x, y, key);
      });
    }
  }
}
