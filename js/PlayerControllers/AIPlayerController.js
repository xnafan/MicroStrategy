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

    this.getTargetTileForUnit = function (unit)
    {
        return {x: 0, y:0};
    }

    this.performBestMoveForUnit = function (unit) {

        var targetTile = this.getTargetTileForUnit(unit);
        var direction = game.mapHelper.getDirection(targetTile, { x: unit.col, y: unit.row });
        if (game.tryMove(direction.x, direction.y)) { didMove = true; };
        
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