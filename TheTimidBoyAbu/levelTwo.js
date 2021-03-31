// collect stars, no enemies
class level2 extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'level2' });
        // Put global variable here
        this.pencilCount = 3;
        this.bookCount = 0;
        this.isDead = false;
        
    }
    
    preload() {

        // map made with Tiled in JSON format
        this.load.tilemapTiledJSON('map2', 'assets/level2_final.json');
        this.load.spritesheet('tiles', 'assets/platform64x64_new.png', {frameWidth: 64, frameHeight: 64});
        this.load.image('collectibles', 'assets/collectibles_new.png');
        this.load.atlas('player', 'assets/abu.png', 'assets/abu.json');
        this.load.atlas('flower', 'assets/flower.png', 'assets/flower.json');
        this.load.image('book', 'assets/book.png');
        this.load.audio('paper', 'assets/paper.mp3');
        this.load.audio('whip', 'assets/whip.mp3');
        this.load.image('cafe_bg', 'assets/cafeteria_bg.png');
        this.load.image('cafe_fg', 'assets/cafeteria_fg.png');
        this.load.image('pencil', 'assets/pencil.png');


    }
    
    create() { 
    
            ////////////////
        //background
        this.cafe_bg=this.add.tileSprite(0, 0, 800, game.config.height, "cafe_bg");
        this.cafe_bg.setOrigin(0, 0);
        this.cafe_bg.setScrollFactor(0);
    
        this.cafe_fg=this.add.tileSprite(0, 0, 800, game.config.height, "cafe_fg");
        this.cafe_fg.setOrigin(0, 0);
        this.cafe_fg.setScrollFactor(0);
    
    
    
        // tilemap variable called map
        this.map = this.make.tilemap({key: 'map2'});
        
        
        ////////////////
        // Add tilesets
    
        // Must match tileSets name in Tiles
        // Must match tileSets name and filename
        var Tiles = this.map.addTilesetImage('platform64x64_new', 'tiles');
        var Cb = this.map.addTilesetImage('collectibles', 'collectibles');
    
        /////////////////
        // Create layers
    
        // CREATE the ground layer & platform layers
        this.platform = this.map.createDynamicLayer('platform', Tiles, 0, 0);


            // Set starting and ending position using object names in tiles
    this.startPoint = this.map.findObject("start_end_point", obj => obj.name === "startPoint");
    this.endPoint = this.map.findObject("start_end_point", obj => obj.name === "endPoint");

    // Make it global variable for troubleshooting
    window.startPoint = this.startPoint;
    window.endPoint = this.endPoint;

        /////////////////////
        // CREATE the this.player 
    
        // bounce, setSize, limit movement inside the map
        this.player = this.physics.add.sprite(150, 200, 'player');
        this.player.setCollideWorldBounds(true); // don't go out of the map    
        this.player.body.setSize(this.player.width*.6, this.player.height);
        this.player.setScale(.7);
    
        window.player = this.player;
        
    
        ////create audio
    
        this.whipSnd=this.sound.add('whip');
        this.paperSnd=this.sound.add('paper');
    
        //////////////////
        // Physics Section
    
        // Everything will collide with this layer
        // ground.setCollisionByExclusion([-1]);
        // platform.setCollisionByExclusion([-1]);
        this.platform.setCollisionByProperty({grass: true});
        // ground.setCollisionByProperty({danger: true});
        // ground.setCollisionByProperty({platform: true});
        // platform.setCollisionByProperty({grass: true});
    
        // set the boundaries of our game world
        this.physics.world.bounds.width = this.platform.width;
        this.physics.world.bounds.height = this.platform.height;



        this.add.text(50,550, 'Level 2', { font: '50px Courier', fill: '#ffffff' }).setScrollFactor(0);

        // this text will show the score
        this.bookText = this.add.text(750, 550, '0', {
            fontSize: '50px Comic Sans',
            fill: '#ffffff'
        });
    // fix the text to the camera
    this.bookText.setScrollFactor(0);
    this.bookText.visible = true;
        
    
    
        ////////////////////
        // ANIMATION section
        // this.player walk animation
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('player', {prefix: 'abu_', start: 1, end: 9}),
            frameRate: 10,
            repeat: -1
        });
    
        // idle with only one frame, so repeat is not neaded
        this.anims.create({
            key: 'idle',
            frames: [{key: 'player', frame: 'abu_1'}],
            frameRate: 10,
        });
    
         // Add animation for flower
         this.anims.create({
            key: 'flowerwalk',
            frames: this.anims.generateFrameNames('flower', {prefix: 'whip_', start: 1, end: 9}),
            frameRate: 10,
            repeat: -1,
           
        });

         // create flower physics group
     this.flowers = this.physics.add.group({defaultKey: 'flower'});
    this.physics.add.overlap(this.player, this.flowers, this.hitflower, null, this);
     // Add members to mummies group
     this.flowers.create(800, 300, 'flower').setScale(.3);
     this.flowers.create(1600, 300, 'flower').setScale(.3);
     this.flowers.create(2400, 300, 'flower').setScale(.3);

     
     // Iterate all the children and play the 'walk' animation
     this.flowers.children.iterate(flower=> {
     flower.play('flowerwalk')
     })
     

     // Check for end of screen at right , reset to left
     this.flowers.children.iterate(flower=> {
         if ( flower.x>this.physics.world.bounds.width ) {
             flower.x=-10;
           }
         });
    

        // Add random stars
        this.book = this.physics.add.group({
            key: 'book',
            repeat: 10,
            setXY: { x: 300, y: 0, stepX: Phaser.Math.Between(100, 2000) }
        });     
         
    //////////////////////
        // Collider Section

    // Collide platform with stars
        this.physics.add.collider(this.platform, this.book);

        this.physics.add.overlap(this.player, this.book,this.collectBook, null, this );

        	// collide bomb
	
	// call hit bomb function
	this.physics.add.overlap(this.player, this.flowers, this.hitflower, null, this );
    
        // What will collider with what layers
        this.physics.add.collider(this.platform, this.player);
        this.physics.add.collider(this.platform, this.flowers);
        this.physics.add.collider(this.platform, this.book);
    

        ///////////////////
        // Keyboard section
        this.cursors = this.input.keyboard.createCursorKeys();
    
        /////////////////
        // CAMERA SECTION
        // set bounds so the camera won't go outside the game world
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    
        // make the camera follow the this.player
        this.cameras.main.startFollow(this.player);
    
        // set background color, so the sky is not black    
        this.cameras.main.setBackgroundColor('#ccccff');

                // Add pencil image at the end 
    this.pencil1 = this.add.image(60,50, 'pencil').setScrollFactor(0);
    this.pencil2 = this.add.image(120,50,'pencil').setScrollFactor(0);
    this.pencil3 = this.add.image(180,50,'pencil').setScrollFactor(0);
    
        
    } // end of create()


     //////////////////
        // Score Section


        hitflower(player,flowers) {
      flowers.disableBody(true, true);
        this.pencilCount -= 1;
        console.log('Hit element, deduct lives, balance is',this.pencilCount);
    
        // Default is 3 lives
        if ( this.pencilCount === 2) {
            this.whipSnd.play();
            this.cameras.main.shake(100);
            this.pencil3.setVisible(false);
        } else if ( this.pencilCount === 1) {
            this.whipSnd.play();
            this.cameras.main.shake(100);
            this.pencil2.setVisible(false);
        } else if ( this.pencilCount === 0) {
            this.whipSnd.play();
            this.cameras.main.shake(500);
            this.pencil1.setVisible(false);
            this.isDead = true;
        }

           // No more lives, shake screen and restart the game
    if ( this.isDead ) {
        console.log("Player is dead!!!")
        // delay 1 sec
        this.time.delayedCall(1000,function() {
            // Reset counter before a restart
            this.isDead = false;
            this.pencilCount = 3;
            this.scene.stop("level2");
            this.scene.start("gameoverScene");
        },[], this);
        }

        return false;
        }


    collectBook(player, book) {
        book.disableBody(true, true);
        this.paperSnd.play();
        this.bookCount += 1; 
        console.log(this.bookCount);
        this.bookText.setText(this.bookCount); // set the text to show the current score
        return false;
    }

    update() {
    
        if (this.cursors.left.isDown)
        {
            this.player.body.setVelocityX(-200);
            this.player.anims.play('walk', true); // walk left
            this.player.flipX = true; // flip the sprite to the left
            //this.whipSnd.play();
        }
        else if (this.cursors.right.isDown)

        {
            this.player.body.setVelocityX(200);
            this.player.anims.play('walk', true);
            this.player.flipX = false; // use the original sprite looking to the right
            //this.whipSnd.play();
    
        } else {
            this.player.body.setVelocityX(0);
            this.player.anims.play('idle', true);
        }
        // jump 
        if (this.cursors.up.isDown && this.player.body.onFloor())
        {
            this.player.body.setVelocityY(-400);        
        }
    
        // Make mummies walk at speed
        this.flowers.setVelocityX(-50);
    
    
        ////////////////
        //background
        this.cafe_bg.tilePositionX=this.cameras.main.scrollX*.2;
        this.cafe_fg.tilePositionX=this.cameras.main.scrollX*.7;

   	// end point
	let distX = this.endPoint.x - this.player.x;
    let distY = this.endPoint.y - this.player.y;
    // Check for reaching endPoint object
    if ( this.player.x >= this.endPoint.x) {
        console.log('Reached endPoint, loading next level');
        this.scene.stop("level2");
        this.scene.start("level3");
    }

    
    } // end of update()
    
    


}