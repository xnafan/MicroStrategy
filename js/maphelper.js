var MapHelper = function (cols, rows) {
    MapHelper.prototype.cols = cols;
    MapHelper.prototype.rows = rows;
    MapHelper.prototype.map = {};
    MapHelper.prototype.makeNewMap();
};

MapHelper.prototype.Directions = {
    North: { x: 0, y: -1 }, NorthEast: { x: 1, y: -1 }, East: { x: 1, y: 0 },
    SouthEast: { x: 1, y: 1 }, South: { x: 0, y: 1 }, SouthWest: { x: -1, y: 1 }, West: { x: -1, y: 0 },
    NorthWest: { x: -1, y: -1 }
};

MapHelper.prototype.makeNewMap = function () {
    MapHelper.prototype.map = MapHelper.prototype.createEmptyMap(MapHelper.prototype.cols, MapHelper.prototype.rows);
    MapHelper.prototype.randomizeMap(MapHelper.prototype.map);
}

MapHelper.prototype.createEmptyMap = function (cols, rows, defaultItemType) {

    var itemTypeToFillWith = TileTypes.Grass;
    if (defaultItemType != undefined) { itemTypeToFillWith = defaultItemType; }
    var newMap = [cols];
    for (var x = 0; x < cols; x++) {
        newMap[x] = [rows];
        for (var y = 0; y < rows; y++) {
            newMap[x][y] = itemTypeToFillWith;
        }
    }
    return newMap;
}

MapHelper.prototype.randomizeMap = function () {
    for (var x = 0; x < MapHelper.prototype.cols; x++) {
        for (var y = 0; y < MapHelper.prototype.rows; y++) {
            MapHelper.prototype.map[x][y] = (Math.floor(Math.random() * 5) == 0 ? TileTypes.Forest : TileTypes.Grass);
        }
    }
}

// Helperfunctions

MapHelper.prototype.isOnMap = function (x, y) {
    return (x >= 0 && y >= 0 && x < MapHelper.prototype.map.length && y < MapHelper.prototype.map[0].length);
}

MapHelper.prototype.mapDataToCSV = function () {

    var csvMapString = "";
    var valueSplitter = "";
    var lineSplitter = "";

    for (var y = 0; y < MapHelper.prototype.rows; y++) {
        csvMapString += lineSplitter;
        valueSplitter = "";
        for (var x = 0; x < MapHelper.prototype.cols; x++) {
            csvMapString += valueSplitter + MapHelper.prototype.map[x][y];
            valueSplitter = ",";
        }
        lineSplitter = "\n";
    }
    return csvMapString;
}

MapHelper.prototype.getDirection = function (destination, startingPoint)
{

    var deltaX = destination.x - startingPoint.x;
    var deltaY = destination.y - startingPoint.y;
    return {x: Math.sign(deltaX), y: Math.sign(deltaY)};
}


MapHelper.prototype.changeGrassToFarmlandAroundTile = function (map, col, row)
{
    var fields = game.mapHelper.get8Neighbors(map, col, row, TileTypes.Grass);
    for (var i = 0; i < fields.length; i++) {
        game.map.getTile(fields[i].x, fields[i].y).index = 4;
    }
    game.map.layer.dirty = true;
}


MapHelper.prototype.addWoodIconToForestsAroundTile = function (map, col, row) {
    var fields = game.mapHelper.get8Neighbors(map, col, row, TileTypes.Forest);
    for (var i = 0; i < fields.length; i++) {
        game.map.getTile(fields[i].x, fields[i].y).index = 5;
    }
    game.map.layer.dirty = true;
}

MapHelper.prototype.get8Neighbors = function (map, col, row, mapTileTypeToGet) {
    var neighbors = [];
    for (var property in MapHelper.prototype.Directions) {
        var dir = MapHelper.prototype.Directions[property];
        var newCoord = { x: col + dir.x, y: row + dir.y };
        if (MapHelper.prototype.isOnMap(newCoord.x, newCoord.y)) {
            var tile = map.getTile(newCoord.x, newCoord.y);
            if (mapTileTypeToGet == undefined || (tile.index == mapTileTypeToGet)) {
                neighbors.push(tile);
            }
        }
    }
    return neighbors;
}


function controlSurroundingForests(col, row, maxForests) {
    var neighbors = game.mapHelper.get8Neighbors(game.map, col, row);
    for (var i = 0; i < neighbors.length; i++) {
        neighbors[i].index = TileTypes.Grass;
    }
    var randomForestTileIndexesAlreadyUsed = [];
    while (randomForestTileIndexesAlreadyUsed.length < maxForests) {
        var randomIndex = Math.floor(Math.random() * neighbors.length);
        if (randomForestTileIndexesAlreadyUsed.indexOf(randomIndex) == -1) {
            randomForestTileIndexesAlreadyUsed.push(randomIndex);
            neighbors[randomIndex].index = TileTypes.Forest;
        }
    }
}

function getFreeTileAroundCityForNewUnit(cityCol, cityRow) {
    var allItemsInPlay = getAllItemsCurrentlyInPlay();
    var tilesAroundCity = game.mapHelper.get8Neighbors(game.map, cityCol, cityRow);
    var freeTilesAroundCity = [];
    for (var tileCounter = 0; tileCounter < tilesAroundCity.length; tileCounter++) {
        var tileIsFree = true;
        var tileToTest = tilesAroundCity[tileCounter];
        for (var itemCounter = 0; itemCounter < allItemsInPlay.length; itemCounter++) {
            var itemToTest = allItemsInPlay[itemCounter];
            if (itemToTest.col == tileToTest.x && itemToTest.row == tileToTest.y) {
                tileIsFree = false;
                break;
            }
        }
        if (tileIsFree) { freeTilesAroundCity.push(tileToTest); }
    }

    if (freeTilesAroundCity.length == 0) { return undefined; }
    return freeTilesAroundCity[Math.floor(Math.random() * freeTilesAroundCity.length)];
}

function updateMapAccordingToFogOfWar() {
    var fogOfWar = game.getCurrentPlayer().fogOfWar;
    for (var x = 0; x < game.map.width; x++) {
        for (var y = 0; y < game.map.height; y++) {
            var tile = game.map.getTile(x, y);
            if (fogOfWar[x][y] == TileTypes.FogOfWar) {
                if (tile.originalIndex == undefined) {
                    tile.originalIndex = tile.index;
                }
                tile.index = TileTypes.FogOfWar;
            }
            else {
                if (tile.originalIndex != undefined) {
                    tile.index = tile.originalIndex;
                }
            }
        }
    }
}

function revealMapAroundTile(col, row) {
    var playersFogOfWar = game.getCurrentPlayer().fogOfWar;
    var tilesToReveal = game.mapHelper.get8Neighbors(game.map, col, row);
    tilesToReveal.push(game.map.getTile(col, row));
    for (var i = 0; i < tilesToReveal.length; i++) {
        var tile = tilesToReveal[i];
        game.gfx.fogOfWarMask.x = tile.x * TileSize + TileSize / 2;
        game.gfx.fogOfWarMask.y = tile.y * TileSize + TileSize / 2;
        game.gfx.fogOfWarMixer.clear();
        game.gfx.fogOfWarMixer.draw(game.gfx.fogOfWarMask).blendSourceOut().draw(playersFogOfWar).blendReset();
        game.gfx.fogOfWar.clear();
        playersFogOfWar.clear();
        playersFogOfWar.draw(game.gfx.fogOfWarMixer);
        game.gfx.fogOfWar.draw(game.gfx.fogOfWarMixer);
    }
}

function updateFogOfWar() {
    clearFogOfWarAroundCurrentPlayersItems();
}

function clearFogOfWarAroundCurrentPlayersItems() {
    var itemsToRevealMapFor = game.getCurrentPlayer().getAllPlayersItems();

    for (var itemCounter = 0; itemCounter < itemsToRevealMapFor.length; itemCounter++) {
        var tile = itemsToRevealMapFor[itemCounter];
        revealMapAroundTile(tile.col, tile.row);
    }
}

function hideOrShowItemsAccordingToFogOfWar() {
    var fogOfWar = game.getCurrentPlayer().fogOfWar;
    var allItems = getAllItemsCurrentlyInPlay();
    for (var itemCounter = 0; itemCounter < allItems.length; itemCounter++) {
        var item = allItems[itemCounter];
        item.visible = (fogOfWar[item.col][item.row] != TileTypes.FogOfWar);
    }

}

function getItemInTile(col, row) {
    for (var i = 0; i < game.players.length; i++) {
        var item = game.players[i].getPlayersItemAt(col, row);
        if (item != undefined) {
            return item;
        }
    }
}

function getDistanceBetweenPositions(firstTile, secondTile)
{
    return Math.sqrt(Math.pow(firstTile.x - secondTile.x, 2) + Math.pow(firstTile.y - secondTile.y, 2));
}