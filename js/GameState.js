var MapRows = 16;
var MapColumns = 16;
var TileSize = 64;
var MapCenter = { x: MapColumns / 2, y: MapRows / 2 };
var keyInputDelayInMs = 200;
var startingPosition = { x: MapCenter.x, y: MapCenter.y };
var CityPriceInWood = 25;
var ItemTypes = { UNIT: "UNIT", BUILDING: "BUILDING" };
var TileTypes = { Grass: 0, Forest: 1 };

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
        game.input.keyboard.addKey(Phaser.Keyboard.C).onDown.add(function () {addNewCityIfPossible();}, this);
        game.input.keyboard.addKey(Phaser.Keyboard.TAB).onDown.add(function () { game.getCurrentPlayer().selectNextItem(); }, this);
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
	    game.debugText.text = "Player: '" + currentPlayer.name + "' has " + currentPlayer.wood + " wood and gets " + currentPlayer.getWoodPerTurn() + " more each turn.";
	    game.debugText.text += "\nSelectedItem is a " + item.type + " at (x:" + item.col + ",y:" + item.row + ") ";
	    switch (item.type)
	    {
	        case ItemTypes.UNIT :
	            game.debugText.text += "It has " + item.movesLeft + " moves left";
	            break;

	        case ItemTypes.BUILDING:
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

             controlSurroundingForests(1, 1, 3);
             var city1 = player1.addCity(1, 1);
             
             controlSurroundingForests(14, 14, 3);
             var city2 = player2.addCity(14, 14);
             

             player1.addUnit(2, 2, 1, 1, 2);
             player2.addUnit(13, 13, 1, 1, 2);

             game.players.push(player1);
             game.players.push(player2);   
         };

         game.tryMove = function (deltaX, deltaY) {
             var piece = game.getCurrentPlayer().getSelectedItem();
             if (piece.type === ItemTypes.UNIT && piece.movesLeft > 0) {

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
    }
}

//WHY can't this be added as a method on the GameState like Create, Load, etc.
function addNewCityIfPossible() {
    var currentPlayer = game.getCurrentPlayer();
    var currentItem = currentPlayer.getSelectedItem();
    if (currentPlayer.wood > CityPriceInWood && currentPlayer.cities.length < 3 && currentItem.type == ItemTypes.UNIT) {
        if (currentItem != undefined) {
            removeUnitFromPlayer(currentPlayer, currentItem);
            currentPlayer.selectedItem = currentPlayer.addCity(currentItem.col, currentItem.row);
            currentPlayer.wood -= CityPriceInWood;
        }
    }
}

function controlSurroundingForests(col, row, maxForests)
{
    var neighbors = game.mapHelper.get8Neighbors(game.map, col, row);
    for (var i = 0; i < neighbors.length; i++) {
        neighbors[i].index = TileTypes.Grass;
    }
    var randomForesTileIndexesAlreadyUsed = [];
    while (randomForesTileIndexesAlreadyUsed.length < maxForests)
    {
        var randomIndex = Math.floor(Math.random() * neighbors.length);
        if (randomForesTileIndexesAlreadyUsed.indexOf(randomIndex) == -1)
        {
            randomForesTileIndexesAlreadyUsed.push(randomIndex);
            neighbors[randomIndex].index = TileTypes.Forest;
        }
    }
}