export default class Platforms {
  constructor(staticGroup, items) {
    if (items.length > 0 && staticGroup) {
      items.forEach((item) => {
        const { x, y, key, scale, refresh } = item;
        const platform = staticGroup.create(x, y, key);
        if (scale) {
          platform.setScale(scale);
        }
        if (refresh) {
          platform.refreshBody();
        }
      });
    }
  }
}
