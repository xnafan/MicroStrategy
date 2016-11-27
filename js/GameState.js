var MapRows = 16;
var MapColumns = 16;
var TileSize = 64;
var MapCenter = { x: MapColumns / 2, y: MapRows / 2 };
var keyInputDelayInMs = 200;
var startingPosition = { x: MapCenter.x, y: MapCenter.y };

var GameState = {

    create: function () {
        
        game.restartGame = function () { game.state.start('GameState', true, false); };
        game.stage.backgroundColor = '#2d2d2d';
        game.cursors = game.input.keyboard.createCursorKeys();
        game.map = game.add.tilemap('theMap', 64, 64, 16, 16);
        game.map.addTilesetImage('gameTiles');
        game.map.backgroundLayer = game.map.createLayer(0);
        game.map.backgroundLayer.dirty = true;
        game.debugText = game.add.text(0, 0, "Currentplayer: ");
        game.world.setBounds(0, 0, MapColumns * TileSize, MapRows * TileSize);

        game.input.keyboard.addKey(Phaser.Keyboard.P).onDown.add(function () { game.toggleCurrentPlayer(); }, this);
        game.input.keyboard.addKey(Phaser.Keyboard.N).onDown.add(function () { game.getCurrentPlayer().selectNextItem(); }, this);
        game.input.keyboard.addKey(Phaser.Keyboard.UP).onDown.add(function () { game.tryMove(0, -1); }, this);
        game.input.keyboard.addKey(Phaser.Keyboard.DOWN).onDown.add(function () { game.tryMove(0, 1); }, this);
        game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.add(function () { game.tryMove(-1, 0); }, this);
        game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(function () { game.tryMove(1,0); }, this);

        game.currentPlayerIndex = 0;
        game.toggleCurrentPlayer = function () {
            game.currentPlayerIndex = 1 - game.currentPlayerIndex;
            game.getCurrentPlayer().newTurn();
        }
        game.getCurrentPlayer = function () { return game.players[game.currentPlayerIndex]; }
        game.createPlayers(2);
        
        game.selectorMarker = game.add.sprite(200, 200, 'selectionImage');
        game.selectorMarker.animations.add('blink', [0, 1]);
        game.selectorMarker.animations.play('blink', 6, true);

        game.getCurrentPlayer().newTurn();

    },
    	
	
	update: function ()
	{
	    var currentPlayer = game.getCurrentPlayer();
	    var item = currentPlayer.getSelectedItem();
	    game.debugText.text = "Current player: " + currentPlayer.name + "  wood " + game.getCurrentPlayer().wood;
	    game.debugText.text += "\n selectedItem: (x:" + item.col + ",y:" + item.row + ")";
	    switch (item.type)
	    {
	        case UnitTypes.UNIT :
	            game.debugText.text += "moves left: " + item.movesLeft;
	            break;

	        case UnitTypes.BUILDING:
	            game.debugText.text += ", grain: " + item.grain;
	            break;
	    }
	    
	    game.selectorMarker.x = currentPlayer.getSelectedItem().x;
	    game.selectorMarker.y = currentPlayer.getSelectedItem().y;
	},
    
     preload: function () {
         game.mapHelper = new MapHelper(MapColumns, MapRows);
         game.load.tilemap('theMap', null, game.mapHelper.mapDataToCSV(), Phaser.Tilemap.CSV);
         game.createPlayers = function (numberOfPlayers)
         {
             game.players = [];
             var player1 = new Player("player 1");
             var player2 = new Player("player 2");

             player1.addCity(1, 1);
             player2.addCity(14, 14);

             player1.addUnit(2, 2, 1, 1, 2);
             player2.addUnit(13, 13, 1, 1, 2);

             game.players.push(player1);
             game.players.push(player2);   
         };

         game.tryMove = function (deltaX, deltaY) {
             var piece = game.getCurrentPlayer().getSelectedItem();
             if (piece.type === UnitTypes.UNIT && piece.movesLeft > 0) {

                 var newCol = piece.col + deltaX;
                 var newRow = piece.row + deltaY;
                 if (game.mapHelper.isOnMap(newCol, newRow)) {
                     piece.col = newCol;
                     piece.row = newRow;
                     piece.x = newCol * TileSize;
                     piece.y = newRow * TileSize;
                     piece.movesLeft--;
                 }
             }
         }

    },
}  