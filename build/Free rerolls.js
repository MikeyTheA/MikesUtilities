var currentPhase = undefined;
var lastArgs = [];
function SelectModifierPhaseHook(phase) {
    var oldGetRerollCost = phase.getRerollCost;
    phase.getRerollCost = function (t, i) {
        log(data.getData('FreeRerolls', false, true));
        lastArgs[0] = t;
        lastArgs[1] = i;
        if (data.getData('FreeRerolls', false, true)) {
            return 0;
        }
        return oldGetRerollCost.call(phase, t, i);
    };
    currentPhase = phase;
}
hook('SelectModifierPhase', SelectModifierPhaseHook);
data.addListener('FreeRerolls', false, function () {
    var battleScene = getBattleScene();
    if (battleScene) {
        var handler = getBattleScene().ui.handlers.find(function (handler) { return handler.constructor.name === "ModifierSelectUiHandler"; });
        if (handler && currentPhase && currentPhase.getRerollCost) {
            handler.setRerollCost(currentPhase.getRerollCost(lastArgs[0], lastArgs[1]));
            handler.updateRerollCostText();
        }
    }
}, true);
