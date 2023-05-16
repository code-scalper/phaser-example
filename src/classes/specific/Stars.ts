import GatheringStarsScene from "../../scenes/GatheringStars";
import { Bomb } from "../index";
import { updateScoreSocket } from "../../socket";
export default class Stars {
  constructor(scene, option, staticGroup) {
    const { name, key, repeat, x, y, stepX, stepY } = option;
    scene[name] = scene.physics.add.group({
      key,
      repeat,
      setXY: { x, y, stepX },
    });

    scene.data.set(name, scene[name]);

    scene[name].children.iterate(function (child: any) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    scene.physics.add.collider(scene[name], staticGroup);

    scene.physics.add.overlap(
      GatheringStarsScene.group,
      scene[name],
      (player, star) => this.collectStar(player, star, scene),
      undefined,
      this
    );
  }
  collectStar(player: any, star: any, scene) {
    if (scene.player.name === player.name) {
      updateScoreSocket(player.name);
    }
    star.disableBody(true, true);
    const x =
      scene.player.x < 400
        ? Phaser.Math.Between(400, 800)
        : Phaser.Math.Between(0, 400);
    const rand = Math.round(Math.random());
    if (rand === 1) {
      new Bomb(
        scene,
        { x, y: 16, name: "bombs", key: "bomb" },
        scene.bombs,
        GatheringStarsScene.staticGroup
      );
    }
  }
}
