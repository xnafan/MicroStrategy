var UnitTypes = { UNIT: "UNIT", BUILDING: "BUILDING" };

var Player = function (name) {
    this.name = name;
    this.cities = [];
    this.units = [];
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
        var city = game.add.sprite(col * TileSize, row * TileSize, 'castleImage');
        city.col = col;
        city.row = row;
        game.map.getTile(col, row).index = 0;
        city.wood = game.mapHelper.get8Neighbors(game.map, city.col, city.row, 1).length;
        city.unitType = UnitTypes.BUILDING;
        this.cities.push(city);
        return city;
    };

    this.addUnit = function (col, row, attack, defense, movement) {

        var unit = game.add.sprite(col * TileSize, row * TileSize, 'soldierImage');
        unit.col = col;
        unit.row = row;
        unit.attack = attack;
        unit.defense = defense;
        unit.movement = movement;
        unit.unitType = UnitTypes.UNIT;
        this.units.push(unit);

        return unit;
    };
}