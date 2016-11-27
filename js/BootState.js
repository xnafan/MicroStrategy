var BootState = {

    preload: function() {
        this.load.image('preloaderBackground', 'gfx/background.png');
        this.load.image('preloaderBar', 'gfx/screw.png');
    },
    create: function() {
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
		this.game.state.start('PreloadState');
	}
};