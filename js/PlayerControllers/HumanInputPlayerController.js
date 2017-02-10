function HumanInputPlayerController(player, doneNotifierFunction) {
    HumanInputPlayerController.prototype.player = player;
    HumanInputPlayerController.prototype.acceptsKeyboardInput = false;
    HumanInputPlayerController.prototype.doneNotifier = doneNotifierFunction;
    HumanInputPlayerController.prototype.notifyTurnDone = function () {
        HumanInputPlayerController.prototype.acceptsKeyboardInput = false;
        HumanInputPlayerController.prototype.doneNotifier();
    };
    player.controller = this;
    HumanInputPlayerController.prototype.startTurn = function () {
        HumanInputPlayerController.prototype.acceptsKeyboardInput = true;
    }
}