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
		this.load.image('background', 'gfx/background.png' + cacheBuster());
		this.load.image('gameTiles', 'gfx/tiles.png' + cacheBuster() );
		this.load.image('soldierImage', 'gfx/unit.png' + cacheBuster());
		this.load.image('castleImage', 'gfx/castle.png' + cacheBuster());
		this.load.spritesheet('selectionImage', "gfx/selection.png" + cacheBuster() , 64, 64, 2);
	},

	create: function () { 
	    this.game.state.start('GameState');
	}
	
};

function cacheBuster ()
{
    return "?cb=" + Math.random();
}

