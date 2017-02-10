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

    }

    this.performBestMoveForUnit = function (unit) {

        var targetTile = getTargetTileForUnit(unit);

        var didMove = false;

        while (!didMove) {
            var roll = Math.floor(Math.random() * 4);
            switch (roll)
            {
                case 0: if (game.tryMove(-1, 0)) { didMove = true; }; break;
                case 1: if (game.tryMove(1, 0)) { didMove = true; }; break;
                case 2: if (game.tryMove(0, -1)) { didMove = true; }; break;
                case 3: if (game.tryMove(0, 1)) { didMove = true; }; break;
            }
        }
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