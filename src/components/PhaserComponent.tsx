import React, { useEffect } from 'react';
import Phaser from 'phaser';

const PhaserComponent: React.FC = () => {
  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 384,
      height: 224,
      parent: 'phaser-game',
      backgroundColor: '#39d4d4',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 1000 },
          debug: false,
        },
      },
      scene: {
        preload: preload,
        create: create,
        update: update,
      },
    };
    const game = new Phaser.Game(config);

    let player: Phaser.Physics.Arcade.Sprite;
    let cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    let spacebar: Phaser.Input.Keyboard.Key;
    let ground: Phaser.Physics.Arcade.StaticGroup;


    function preload(this: Phaser.Scene) {
      this.load.image('ground', 'assets/ground.png');
      this.load.spritesheet('character', 'assets/trump.png', {
        frameWidth: 32,
        frameHeight: 32,
      });
    }
    

    function create(this: Phaser.Scene) {
      // Create ground
      const groundWidth = 384; // Width of the game screen
      const groundHeight = 32; // Height of the ground
      const groundX = groundWidth / 2; // X position of the ground
      const groundY = this.physics.world.bounds.height - groundHeight / 2; // Y position of the ground
      const groundImage = this.add.image(groundX, groundY, 'ground').setDisplaySize(groundWidth, groundHeight);
      ground = this.physics.add.staticGroup();
      ground.add(groundImage);



      const scaleFactor = 3; // Change this value to the desired scaling factor.
      const canvas = game.canvas;
      canvas.style.width = `${game.scale.width * scaleFactor}px`;
      canvas.style.height = `${game.scale.height * scaleFactor}px`;

    
      player = this.physics.add.sprite(400, 300, 'character');
      player.setBounce(0);
      player.setCollideWorldBounds(true);
    
      // Add collider between player and ground
      this.physics.add.collider(player, ground);
    
      cursors = this.input.keyboard.createCursorKeys();
      spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

      this.anims.create({
        key: 'stand',
        frames: [{ key: 'character', frame: 0 }],
        frameRate: 10,
      });
    
      this.anims.create({
        key: 'jump',
        frames: [{ key: 'character', frame: 1 }],
        frameRate: 10,
      });
    
      this.anims.create({
        key: 'crouch',
        frames: [{ key: 'character', frame: 2 }],
        frameRate: 10,
      });
    }
    
    var crouch_count = 0

    function update(this: Phaser.Scene) {
      if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.flipX = true; // Flip the character sprite when moving left
      } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.flipX = false; // Reset the flip when moving right
      } else {
        player.setVelocityX(0);
      }
    
      if (Phaser.Input.Keyboard.JustDown(spacebar) && player.body.touching.down) {
        player.setVelocityY(-500);
      }

      if (!player.body.touching.down && player.body.velocity.y != 0) {
        player.anims.play('jump', true);
        crouch_count = 50
        // console.log("jump")
        console.log("crowch_count: " + crouch_count)
      } else if (crouch_count > 0) {
        console.log("crowch")
          player.anims.play('crouch', true);
          crouch_count -= 1
      } else {
        // console.log("stand")
        player.anims.play('stand', true);
      }
    }
    

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div
      id="phaser-game"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
      }}
    />
  );
  
};

export default PhaserComponent;
