var SplashState = {

	preload: function () {

		this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'splash');
		this.preloadBar.anchor.setTo(0.5, 0.5);
	},

	create: function () {
	    setTimeout("this.game.state.start('GameState');", 2000);
	}

};