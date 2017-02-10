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
		this.load.image('gameTiles', 'gfx/tiles.png' + cacheBuster());
		this.load.image('splash', 'gfx/splash.png' + cacheBuster());
		this.load.image('soldierImage', 'gfx/unit.png' + cacheBuster());
		this.load.spritesheet('castleImage', 'gfx/castles.png' + cacheBuster(), 64,64,2);
		this.load.image('fogofwarmask', 'gfx/fogofwarmask.png' + cacheBuster());
		this.load.spritesheet('selectionImage', "gfx/selection.png" + cacheBuster(), 64, 64, 2);

	},

	create: function () {

	game.gfx = {};
	
		game.gfx.fogOfWarMask = game.make.sprite(0, 0, 'fogofwarmask');
		game.gfx.fogOfWarMask.width += 28;
		game.gfx.fogOfWarMask.height += 28;
		game.gfx.fogOfWarMask.anchor.set(0.5,0.5);
		game.gfx.fogOfWarMixer = game.make.bitmapData(game.width, game.height);
		game.gfx.fogOfWar = game.make.bitmapData(game.width, game.height);
		
		this.game.state.start('SplashState');
	}

};

function cacheBuster() {return "?cb=" + Math.random();}