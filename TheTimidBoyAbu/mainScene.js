class mainScene extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'mainScene' });
    }

    preload() {
        this.load.image('main','assets/mainScene.png');

    }

    create () {

        this.add.image(0, 0, 'main').setOrigin(0, 0);
        
        //this.add.text(50,580, 'Press Spacebar to continue', { font: '24px Courier', fill: '#ffffff' });

        console.log("This is mainScene");

        //this.input.once('pointerdown', function(){
        var spaceDown = this.input.keyboard.addKey('SPACE');
        
        spaceDown.on('down', function(){
        console.log("Spacebar pressed, goto main2Scene");
        this.scene.stop("mainScene");
        this.scene.start("main2Scene");
        }, this );

        var key1 = this.input.keyboard.addKey(49);
        var key2 = this.input.keyboard.addKey(50);
        var key3 = this.input.keyboard.addKey(51);

        key1.on('down', function(){
        this.scene.start("level1");
        }, this );

        key2.on('down', function(){
        this.scene.start("level2");
        }, this );

        key3.on('down', function(){
        this.scene.start("level3");
        }, this );


    }

}
