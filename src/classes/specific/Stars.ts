import GatheringStarsScene from "../../scenes/GatheringStars";
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
  collectStar(group: any, star: any, scene) {
    const score = scene.data.get("score");
    scene.data.set("score", score + 10);
    scene.scoreText.setText("Score: " + score);
    star.disableBody(true, true);

    // const stars = scene.data.get("stars");
    // if (stars.countActive(true) === 0) {
    //   stars.children.iterate(function (child: any) {
    //     child.enableBody(true, child.x, 0, true, true);
    //   });
    // }

    // const x =
    //   player.x < 400
    //     ? Phaser.Math.Between(400, 800)
    //     : Phaser.Math.Between(0, 400);
    // const bombs = this.data.get("bombs");
    // const bomb = bombs.create(x, 16, "bomb");
    // bomb.setBounce(1);
    // bomb.setCollideWorldBounds(true);
    // bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
  }
}
