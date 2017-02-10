function AIPlayerController(player, doneNotifierFunction) {
    this.player = player;
    this.acceptsKeyboardInput = false;
    this.notifyTurnDone = doneNotifierFunction;
    this.discoveredEnemyCastles = [];

    this.startTurn = function () {
        var that = this;
        that.moveTimer = setInterval( function () { that.performAMove(); }, 400);
    }
    player.controller = this;

    this.getEnemyCloseBy = function (positionToSearchAround)
    {
        var bestDistance = 1000;
        var position = undefined;
        for (var i = game.players[0].units.length - 1; i >= 0; i--) {
            var unit = game.players[0].units[i];
            var unitPosition = { x: unit.col, y: unit.row };
            var distanceToTest = getDistanceBetweenPositions(unitPosition,positionToSearchAround);
            if (distanceToTest < bestDistance)
            {
                bestDistance = distanceToTest;
                position = unitPosition;
            }
        }
        return position;
    }

    this.getTargetTileForUnit = function (unit)
    {
        var positionOfEnemyCloseBy = this.getEnemyCloseBy({ x: unit.col, y: unit.row });
        if (positionOfEnemyCloseBy === undefined)
        { return { x: 0, y: 0 }; }

        return positionOfEnemyCloseBy;
    }

    this.performBestMoveForUnit = function (unit) {
        var targetTile = this.getTargetTileForUnit(unit);
        var direction = game.mapHelper.getDirection(targetTile, { x: unit.col, y: unit.row });
        game.tryMove(direction.x, direction.y);
    }

    this.performAMove = function ()
    {
        var firstItemWithMovesLeft = this.player.getFirstUnitWithMovesLeft ();
        if(firstItemWithMovesLeft != undefined)
        {
            player.selectedItem = firstItemWithMovesLeft; 
            this.performBestMoveForUnit(firstItemWithMovesLeft);
        }
        else {
            clearInterval(this.moveTimer);
            this.notifyTurnDone();
        }
    }
}