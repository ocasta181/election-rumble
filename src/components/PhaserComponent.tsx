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

    let player1: Phaser.Physics.Arcade.Sprite;
    let player2: Phaser.Physics.Arcade.Sprite;
    let cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    let jumpKey: Phaser.Input.Keyboard.Key;
    let punchKey: Phaser.Input.Keyboard.Key;
    let ground: Phaser.Physics.Arcade.StaticGroup;

    // Health properties
    const maxHealth = 100;
    let playerHealth = maxHealth;
    let player2Health = maxHealth;

    // Punch properties
    let isPunching = false;
    const punchRange = 5;
    const punchDamage = 5;


    function preload(this: Phaser.Scene) {
      this.load.image('ground', 'assets/ground.png');
      this.load.spritesheet('character', 'assets/trump.png', {
        frameWidth: 32,
        frameHeight: 32,
      });
      // Load the second character's sprite sheet (assuming it's a different image)
      this.load.spritesheet('character2', 'assets/character2.png', {
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

      // Add the first character to the scene
      player1 = this.physics.add.sprite(400, 300, 'character');
      player1.setBounce(0);
      player1.setCollideWorldBounds(true);

      // Add the second character to the scene
      player2 = this.physics.add.sprite(200, 100, 'character2');
      player2.setBounce(0);
      player2.setCollideWorldBounds(true);
    
      // Add colliders
      this.physics.add.collider(player1, ground);
      this.physics.add.collider(player2, ground);
      // this.physics.add.collider(player1, player2);

    
      cursors = this.input.keyboard.createCursorKeys();
      jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      punchKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

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

      this.physics.world.overlap(player1, player2, function() {
        if (player1.x < player2.x) {
          player1.x = player2.x - player1.width;
        } else {
          player1.x = player2.x + player2.width;
        }
      });

      if (cursors.left.isDown) {
        player1.setVelocityX(-160);
        player1.flipX = true; // Flip the character sprite when moving left
      } else if (cursors.right.isDown) {
        player1.setVelocityX(160);
        player1.flipX = false; // Reset the flip when moving right
      } else {
        player1.setVelocityX(0);
      }
    
      if (Phaser.Input.Keyboard.JustDown(jumpKey) && player1.body.touching.down) {
        player1.setVelocityY(-500);
      }

      if (!player1.body.touching.down && player1.body.velocity.y != 0) {
        player1.anims.play('jump', true);
        crouch_count = 50
        // console.log("jump")
        console.log("crowch_count: " + crouch_count)
      } else if (crouch_count > 0) {
        console.log("crowch")
          player1.anims.play('crouch', true);
          crouch_count -= 1
      } else {
        // console.log("stand")
        player1.anims.play('stand', true);
      }

      if (Phaser.Input.Keyboard.JustDown(punchKey) && !isPunching) {
        isPunching = true;
        setTimeout(() => {
          isPunching = false;
        }, 500); // 500ms cooldown for punching

        const punchX = player1.x + (player1.flipX ? -32 : 32);
        const punchY = player1.y;
        const distance = Phaser.Math.Distance.Between(punchX, punchY, player2.x, player2.y);
        
        if (distance <= punchRange) {
          player2Health -= punchDamage;
          console.log(`Player 2 health: ${player2Health}`);

          if (player2Health <= 0) {
            console.log('Player 2 has been defeated!');
            game.scene.pause('default');
            // Handle game over logic here
          }
        }
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
