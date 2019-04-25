import {Scene} from 'phaser';
// const manifest = require('./manifest.json');
import * as manifest from '../manifest.json';

export class Preload extends Scene {
  constructor() {
    super({
      key: 'PreloadScene',
    });
  }

  preload() {
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        fill: '#ffffff',
      },
    });
    loadingText.setOrigin(0.5, 0.5);

    const percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: '0%',
      style: {
        font: '18px monospace',
        fill: '#ffffff',
      },
    });
    percentText.setOrigin(0.5, 0.5);

    const assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: '',
      style: {
        font: '18px monospace',
        fill: '#ffffff',
      },
    });

    assetText.setOrigin(0.5, 0.5);

    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);

    this.load.on('progress', function(value) {
      percentText.setText(parseInt(value) * 100 + '%');
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });

    this.load.on('fileprogress', function(file) {
      assetText.setText('Loading asset: ' + file.key);
    });

    this.load.on('complete', function() {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
    });

    // use manifest.json to load all assets
    Object.keys(manifest).forEach((fileType: string) => {
      for (const asset in manifest[fileType]) {
        if (manifest.hasOwnProperty(asset)) {
          const assetVars = manifest[fileType][asset];
          const url = 'assets/' + fileType + '/' + assetVars['file'];

          this.load[fileType](asset, url);
        }
      }
    });
  }
}
