import Character from "./Character";
export default class Dude extends Character {
  constructor(scene, x, y, key, name) {
    super(scene, x, y, key, name);
    this.scene = scene;
  }

  onPointerup(pointer) {
    this.setState("move");
    this.moveTo(pointer.x, pointer.y);
  }
}
