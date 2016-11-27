var UnitTypes = { UNIT: "UNIT", BUILDING: "BUILDING" };

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

    this.selectNextItem = function () {
        if (this.selectedItem == undefined) { this.selectedItem = this.cities[0]; }
        var items = [];

        items = this.units.concat(this.cities);

        for (var i = 0; i < items.length; i++) {
            if (items[i] == this.selectedItem) {
                var index = i + 1;
                index = index % items.length;
                this.selectedItem = items[index];
                break;
            }
        };
    };

    this.addCity = function (col, row) {
        var city= addSpriteToMap(col, row, 'castleImage');
        game.map.getTile(col, row).index = 0;
        city.woodPerTurn = game.mapHelper.get8Neighbors(game.map, city.col, city.row, 1).length;
        city.grainPerTurn = 8 - city.woodPerTurn;
        city.grain = 0;
        city.player = this;
        city.type = UnitTypes.BUILDING;
        city.newTurn = function ()
        {
            city.player.wood += city.woodPerTurn;
            city.grain += city.grainPerTurn;
        }
        this.cities.push(city);
        return city;
    };

    this.addUnit = function (col, row, attack, defense, movement) {
        var unit = addSpriteToMap(col, row, 'soldierImage');
        unit.type = UnitTypes.UNIT;
        unit.attack = attack;
        unit.defense = defense;
        unit.movesPerTurn = movement;
        unit.movesLeft = unit.movesPerTurn;
        unit.newTurn = function ()
        {
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

function addSpriteToMap(col, row, imageResourceName)
{ 
    var sprite = game.add.sprite(col * TileSize, row * TileSize, imageResourceName );
    sprite.col = col;
    sprite.row = row;
    return sprite;
}