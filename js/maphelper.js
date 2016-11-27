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

MapHelper.prototype.createEmptyMap = function (cols, rows) {
    var newMap = [cols];
    for (var x = 0; x < cols; x++) {
        newMap[x] = [rows];
        for (var y = 0; y < rows; y++) {
            newMap[x][y] = 0;
        }
    }
    return newMap;
}

MapHelper.prototype.randomizeMap = function () {
    for (var x = 0; x < MapHelper.prototype.cols; x++) {
        for (var y = 0; y < MapHelper.prototype.rows; y++) {
            MapHelper.prototype.map[x][y] = (Math.floor(Math.random() * 5) == 0 ? 1 : 0);
        }
    }
}

// Helperfunctions

MapHelper.prototype.isOnMap = function (x, y)
{
	return (x >= 0 && y >= 0 && x < MapHelper.prototype.map.length && y < MapHelper.prototype.map[0].length);
}

 MapHelper.prototype.mapDataToCSV = function() {

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

 MapHelper.prototype.get8Neighbors = function (map, col, row,mapTileTypeToCount) {
     var neighbors = [];
     for (var property in MapHelper.prototype.Directions) {
         var dir = MapHelper.prototype.Directions[property];
         var newCoord = { x: col + dir.x, y: row + dir.y };
         if (MapHelper.prototype.isOnMap(newCoord.x, newCoord.y)) {
             var tile = map.getTile(newCoord.x, newCoord.y);
             if (mapTileTypeToCount == undefined || (tile.index == mapTileTypeToCount)) {
                 neighbors.push(tile);
             }
         }
     }
     return neighbors;
 }

