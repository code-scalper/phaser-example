import GatheringStarsScene from "../../scenes/GatheringStars";
import TweenHelper from "../../lib/TweenHelper";
import { hitBombSocket, gameoverSocket } from "../../socket";

export default class Bomb {
  bombs = [];
  constructor(scene, option, targetGroup, staticGroup) {
    const { name, key, x, y } = option;
    if (!scene[name]) {
      scene[name] = scene.physics.add.group();
      scene.data.set(name, scene[name]);
      scene.physics.add.collider(scene[name], GatheringStarsScene.staticGroup);
      scene.physics.add.overlap(
        scene.player,
        scene[name],
        (player, bomb) => this.hitBomb(player, bomb, scene),
        undefined,
        this
      );
    }

    const bomb = scene[name].create(x, y, "bomb");
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
  }
  //   constructor(scene, x, y, key, name) {
  //     super(scene, x, y, key);
  //     scene.add.existing(this, true);
  //     scene.physics.add.existing(this);
  //     this.setName("bomb");
  //     this.body.setOffset(x, 0);
  //     this.setCollideWorldBounds(true);
  //     this.setBounce(1);
  //     this.setTexture("bomb");
  //     this.setVelocity(Phaser.Math.Between(-200, 200), 20);
  //     GatheringStarsScene.group.add(this);
  //     scene.physics.add.collider(this, GatheringStarsScene.staticGroup);

  //     // scene.physics.add.collider(
  //     //   GatheringStarsScene.group,
  //     //   this.bombs,
  //     //   (player, bomb) => this.hitBomb(player, bomb, scene),
  //     //   undefined,
  //     //   this
  //     // );
  //   }
  hitBomb(player, bomb, scene) {
    if (scene.players && scene.players.length === 0) {
      // scene.physics.pause();
      gameoverSocket();
    }
    player.setTint(0xff0000);
    player.anims.play("right");
    player.setAlpha(0.2);
    player.disableBody(true);
    TweenHelper.flashElement(scene, player, 200);
    hitBombSocket(player.name);
  }
}
