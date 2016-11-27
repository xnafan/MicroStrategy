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
        game.debugText = game.add.text(10, 0, "Currentplayers");
        game.debugText.fill = '#ffffaa';
        game.debugText.fontSize = 24;
        game.debugText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);

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
	    game.debugText.text = "Player: '" + currentPlayer.name + "' has " + game.getCurrentPlayer().wood + " wood ";
	    game.debugText.text += "\nSelectedItem is a " + item.type + " at (x:" + item.col + ",y:" + item.row + ") ";
	    switch (item.type)
	    {
	        case UnitTypes.UNIT :
	            game.debugText.text += "It has " + item.movesLeft + " moves left";
	            break;

	        case UnitTypes.BUILDING:
	            game.debugText.text += "the building contains " + item.grain + " units of grain";
	            break;
	    }
	    
	    game.selectorMarker.x = currentPlayer.getSelectedItem().x;
	    game.selectorMarker.y = currentPlayer.getSelectedItem().y;
	},
    
	preload: function () {
	    game.input.onDown.add(function (pointer, event) {
	        var clickedTile = game.map.getTileWorldXY(pointer.x, pointer.y);
	        game.trySelect(clickedTile.x, clickedTile.y);
	    }, this);
         game.mapHelper = new MapHelper(MapColumns, MapRows);
         game.load.tilemap('theMap', null, game.mapHelper.mapDataToCSV(), Phaser.Tilemap.CSV);
         game.map = game.add.tilemap('theMap', 64, 64, 16, 16);
         game.map.addTilesetImage('gameTiles');
         game.map.backgroundLayer = game.map.createLayer(0);

        //preparing for fog-of-war... Can't figure out multiple layers in map... ? :-/
         //game.map.playingPieceLayer = game.add.group();
         //game.map.fogOfWarLayer = game.map.createLayer(1);
         //for (var x = 0; x < 16; x++) {
         //    for (var y = 0; y < 16; y++) {
         //        game.map.fogOfWarLayer.getTile(x, y).index = 2;
         //    }
         //}
         game.trySelect = function (col, row)
         {
             //alert("col:" + col + ",row:" + row);
             game.getCurrentPlayer().trySelect(col, row);
         }

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