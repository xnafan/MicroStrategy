var PreloadState = {

	preload: function () {

	    //var newText = game.add.text(-1000, -1000, "_preloadFont!_");
	    //newText.font = 'pixantiquamedium';
	    //newText.visible = false;
	    //newText.update();
		
		//load and position preloadBar
		this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloaderBar');
		this.preloadBar.anchor.setTo(0.5, 0.5); 
		this.load.setPreloadSprite(this.preloadBar);
	
		//gfx
		this.load.image('background', 'gfx/background.png');
		this.load.image('gameTiles', 'gfx/tiles.png');
		this.load.image('soldierImage', 'gfx/unit.png');
		this.load.image('castleImage', 'gfx/castle.png');
		this.load.spritesheet('selectionImage', 'gfx/selection.png', 64, 64, 2);
	},

	create: function () { 
	    this.game.state.start('GameState');
	}
};