// collect stars, no enemies
class level1 extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'level1' });
        // Put global variable here
        this.pencilCount = 3;
        this.bookCount = 0;
        this.isDead = false;
        
    }
    
    preload() {

        // map made with Tiled in JSON format
        this.load.tilemapTiledJSON('map1', 'assets/level1_final.json');
        this.load.spritesheet('tiles', 'assets/platform64x64_new.png', {frameWidth: 64, frameHeight: 64});
        this.load.image('collectibles', 'assets/collectibles_new.png');
        this.load.atlas('player', 'assets/abu.png', 'assets/abu.json');
        this.load.atlas('monkey', 'assets/monkey_new.png', 'assets/monkey_new.json');
        this.load.image('book', 'assets/book.png');
        this.load.audio('paper', 'assets/paper.mp3');
        this.load.audio('monkey_cry', 'assets/monkey_cry.mp3');
        this.load.image('classroom_bg', 'assets/classroom_bg.png');
        this.load.image('classroom_fg', 'assets/classroom_fg.png');
        this.load.image('pencil', 'assets/pencil.png');


    }
    
    create() { 
    
            ////////////////
        //background
        this.classroom_bg=this.add.tileSprite(0, 0, 800, game.config.height, "classroom_bg");
        this.classroom_bg.setOrigin(0, 0);
        this.classroom_bg.setScrollFactor(0);
    
        this.classroom_fg=this.add.tileSprite(0, 0, 800, game.config.height, "classroom_fg");
        this.classroom_fg.setOrigin(0, 0);
        this.classroom_fg.setScrollFactor(0);
    
    
    
        // tilemap variable called map
        this.map = this.make.tilemap({key: 'map1'});
        
        
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
    
        this.monkey_crySnd=this.sound.add('monkey_cry');
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



        this.add.text(50,550, 'Level 1', { font: '50px Courier', fill: '#ffffff' }).setScrollFactor(0);

        // this text will show the score
        this.bookText = this.add.text(750, 550, '0', {
            fontSize: '50px Courier',
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
    
         // Add animation for monkey
         this.anims.create({
            key: 'monkeywalk',
            frames: this.anims.generateFrameNames('monkey', {prefix: 'monkey_run_', start: 1, end: 8}),
            frameRate: 10,
            repeat: -1,
           
        });

         // create monkey physics group
     this.monkeys = this.physics.add.group({defaultKey: 'monkey'});
    this.physics.add.overlap(this.player, this.monkeys, this.hitMonkey, null, this);
     // Add members to mummies group
     this.monkeys.create(800, 300, 'monkey').setScale(1);
     this.monkeys.create(1600, 300, 'monkey').setScale(1);
     this.monkeys.create(2400, 300, 'monkey').setScale(1);

     
     // Iterate all the children and play the 'walk' animation
     this.monkeys.children.iterate(monkey=> {
     monkey.play('monkeywalk')
     })
     

     // Check for end of screen at right , reset to left
     this.monkeys.children.iterate(monkey=> {
         if ( monkey.x>this.physics.world.bounds.width ) {
             monkey.x=-10;
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
	this.physics.add.overlap(this.player, this.monkeys, this.hitMonkey, null, this );
    
        // What will collider with what layers
        this.physics.add.collider(this.platform, this.player);
        this.physics.add.collider(this.platform, this.monkeys);
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


        hitMonkey(player,monkeys) {
      monkeys.disableBody(true, true);
        this.pencilCount -= 1;
        console.log('Hit element, deduct lives, balance is',this.pencilCount);
    
        // Default is 3 lives
        if ( this.pencilCount === 2) {
            this.monkey_crySnd.play();
            this.cameras.main.shake(100);
            this.pencil3.setVisible(false);
        } else if ( this.pencilCount === 1) {
            this.monkey_crySnd.play();
            this.cameras.main.shake(100);
            this.pencil2.setVisible(false);
        } else if ( this.pencilCount === 0) {
            this.monkey_crySnd.play();
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
            this.scene.stop("level1");
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
            //this.monkey_crySnd.play();
        }
        else if (this.cursors.right.isDown)

        {
            this.player.body.setVelocityX(200);
            this.player.anims.play('walk', true);
            this.player.flipX = false; // use the original sprite looking to the right
            //this.monkey_crySnd.play();
    
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
        this.monkeys.setVelocityX(-50);
    
    
        ////////////////
        //background
        this.classroom_bg.tilePositionX=this.cameras.main.scrollX*.2;
        this.classroom_fg.tilePositionX=this.cameras.main.scrollX*.7;

   	// end point
	let distX = this.endPoint.x - this.player.x;
    let distY = this.endPoint.y - this.player.y;
    // Check for reaching endPoint object
    if ( this.player.x >= this.endPoint.x) {
        console.log('Reached endPoint, loading next level');
        this.scene.stop("level1");
        this.scene.start("level2");
    }

    
    } // end of update()
    
    


}