class BaseScene extends Phaser.Scene {
    map;
    player;
    cursors;
    camera;
    exitLayer;
    score;

    constructor(key) {
        super(key);
    }

    create() {
        //Create tilemap and attach tilesets

        this.map.landscape = this.map.addTilesetImage('landscape-tileset', 'landscape-image');
        this.map.props = this.map.addTilesetImage('props-tileset', 'props-image');

        //Set world bounds
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        //Create background and platform layers
        this.map.createStaticLayer('background', [this.map.landscape, this.map.props], 0, 0);
        this.map.createStaticLayer('background2', [this.map.landscape, this.map.props], 0, 0);
        this.map.createStaticLayer('platforms', [this.map.landscape, this.map.props], 0, 0);
        this.exitLayer = this.map.createStaticLayer('exit', [this.map.landscape, this.map.props], 0, 0);

        //Create from object layer(s)
        this.map.getObjectLayer("objects").objects.forEach(function(object){
            if(object.type === "playerSpawner"){
                
            }
        })

        //Create player
        this.createPlayer();

        //Create foreground layers
        this.map.createStaticLayer('foreground', [this.map.landscape, this.map.props], 0, 0);

        //Set up camera (can be in a createCamera() function)
        this.camera = this.cameras.getCamera("");
        this.camera.startFollow(this.player);
        this.camera.setBounds(0, 0, this.map.widthInPixels, this.map.height * this.map.tileHeight);
        this.camera.zoom = 2;

        //Create collision
        this.createCollision();

        //Enable cursors
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        //Check arrow keys
        if (this.cursors.right.isDown) {
            this.player.setVelocityX(100);
            this.player.flipX = false;
        } else if (this.cursors.left.isDown) {
            this.player.setVelocityX(-100);
            this.player.flipX = true;
        } else {
            this.player.setVelocityX(0);
        }

        //Check for space bar press
        if (Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
            this.player.setVelocityY(-200);
        }


    }

    createPlayer() {
        //Add sprite to world
        this.player = this.physics.add.sprite(16, 16, 'player', 1);
        this.player.setCollideWorldBounds(true);
    }

    createCollision() {
        //Set collision for all tiles in the "platforms" layer
        let collisionLayer = this.map.getLayer('platforms').tilemapLayer;
        collisionLayer.setCollisionBetween(0, 1000);

        //Enable collision between player and "platforms" layer
        this.physics.add.collider(this.player, collisionLayer);

    }
}
class SceneA extends BaseScene {
    constructor() {
        super('sceneA');
    }
    preload() {
        //Load assets
        this.load.image('landscape-image', '../assets/landscape-tileset.png');
        this.load.image('props-image', '../assets/props-tileset.png');
        this.load.spritesheet('player', '../assets/player.png', {
            frameWidth: 24,
            frameHeight: 24
        });
        //Load Tiled JSON
        this.load.tilemapTiledJSON('level1', '../assets/level1.json');
    }
    create(){
        this.score = 25;
        this.map = this.make.tilemap({
            key: 'level1'
        });
        super.create();
    }
    update(){
        super.update();
        let tile = this.exitLayer.getTileAtWorldXY(this.player.x, this.player.y);
        if (tile) {
            switch (tile.index) {
                case 200:
                case 201:
                case 206:
                case 207:
                    this.processExit();
                    break;
            }
        }
    }
    processExit() {
        console.log('player reached exit');
        this.scene.start('sceneB',{score:this.score});
    }
}
class SceneB extends BaseScene {
    constructor() {
        super('sceneB');
    }
    init(data){
        this.score = data.score;
    }
    preload() {
        //Load assets
        this.load.image('landscape-image', '../assets/landscape-tileset.png');
        this.load.image('props-image', '../assets/props-tileset.png');
        this.load.spritesheet('player', '../assets/player.png', {
            frameWidth: 24,
            frameHeight: 24
        });
        //Load Tiled JSON
        this.load.tilemapTiledJSON('level2', '../assets/level2.json');
    }
    create(){
        console.log('this.score = '+this.score);
        this.map = this.make.tilemap({
            key: 'level2'
        });
        super.create();
    }
}