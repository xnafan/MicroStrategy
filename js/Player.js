var Player = function (name) {
    this.name = name;
    this.cities = [];
    this.units = [];
    this.wood = 0;
    this.selectedItem = undefined;
    this.getSelectedItem = function () {
        if (this.selectedItem != undefined) { return this.selectedItem; }
        else {
            this.selectNextItem();
            return this.selectedItem;
        }
    };

    this.getWoodPerTurn = function () {
        var woodPerTurn = 0;
        for (var i = 0; i < this.cities.length; i++) {
            woodPerTurn += this.cities[i].woodPerTurn;
        }
        return woodPerTurn;
    };

    this.trySelect = function (col, row) {
        var itemInTile = this.getPlayersItemAt(col, row);
        if (itemInTile != undefined) { this.selectedItem = itemInTile;}
    };

    this.getPlayersItemAt = function (col, row) {
        var allItems = this.getAllPlayersItems();
        for (var i = 0; i < allItems.length; i++) {
            if (allItems[i].col == col && allItems[i].row == row) {
                return allItems[i];
            }
        }
        return undefined;
    };

    this.selectNextItem = function () {
        if (this.selectedItem == undefined) {
            this.selectedItem = this.cities[0];
        }
        var items = this.getAllPlayersItems();
        for (var i = 0; i < items.length; i++) {
            if (items[i] == this.selectedItem) {
                var index = i + 1;
                index = index % items.length;
                this.selectedItem = items[index];
                break;
            }
        }
    };

    this.getAllPlayersItems = function () {
        return this.units.concat(this.cities);
    };

    this.addCity = function (col, row) {
        var city = addSpriteToMap(col, row, 'castleImage');
        game.map.getTile(col, row).index = 0;
        city.woodPerTurn = game.mapHelper.get8Neighbors(game.map, col, row, TileTypes.Forest).length;
        city.grainPerTurn = 8 - city.woodPerTurn;
        city.grain = 0;
        city.player = this;
        city.type = ItemTypes.BUILDING;
        city.newTurn = function () {
            city.player.wood += city.woodPerTurn;
            city.grain += city.grainPerTurn;
            var costOfNewUnits = 15;   //to be changed based on what units are created
            if (city.grain >= costOfNewUnits)
            {
               var freeTile = getFreeTileAroundCityForNewUnit(city.col, city.row);
               if (freeTile != undefined)
               {
                   city.player.addUnit(freeTile.x, freeTile.y, 1, 1, 2);
                   city.grain -= costOfNewUnits;
               }
            }
        }
        this.cities.push(city);
        return city;
    };


    this.addUnit = function (col, row, attack, defense, movement) {
        var unit = addSpriteToMap(col, row, 'soldierImage');
        unit.type = ItemTypes.UNIT;
        unit.attack = attack;
        unit.defense = defense;
        unit.movesPerTurn = movement;

        var style = { align: "center", fontSize: 18, fill: "white", stroke: "black", strokeThickness: 2 };

        var statText = unit.attack + "/" + unit.defense + "/" + unit.movesPerTurn;
        var stats = game.add.text(TileSize/2, 0 -25, statText, style);
        stats.setShadow(3, 3, 'rgba(0,0,0,1)', 5);
        stats.anchor.set(.5, 0);
        unit.addChild(stats);
            
        unit.movesLeftText = game.add.text(TileSize / 2, TileSize+3, statText, style);
        unit.movesLeftText.setShadow(3, 3, 'rgba(0,0,0,1)', 5);
        unit.movesLeftText.anchor.set(.5, 0);
        unit.addChild(unit.movesLeftText);

        unit.update = function ()
        {
            this.movesLeftText.text = this.movesLeft + " moves";
        }
        
        unit.movesLeft = unit.movesPerTurn;
        unit.newTurn = function () {
            this.movesLeft = this.movesPerTurn;
        }

        this.units.push(unit);

        return unit;
    };

    this.newTurn = function () {
        for (var i = 0; i < this.units.length; i++) {
            this.units[i].newTurn();
        }
        for (var i = 0; i < this.cities.length; i++) {
            this.cities[i].newTurn();
        }
    };
}

function addSpriteToMap(col, row, imageResourceName) {
    var sprite = game.add.sprite(col * TileSize, row * TileSize, imageResourceName);
    sprite.col = col;
    sprite.row = row;
    return sprite;
}

//WHY can't this be added inside the definition of Player?
function removeUnitFromPlayer(player, unitToRemove) {
    player.selectNextItem();
    var indexOfItem = player.units.indexOf(unitToRemove);
    player.units.splice(indexOfItem, 1);
};