var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
window.update = function () {
    var battleScene = getBattleScene();
    if (battleScene === undefined || battleScene.ui === undefined) {
        return;
    }
    var StarterSelectUiHandler = battleScene.ui.handlers.find(function (handler) { return handler.constructor.name === "StarterSelectUiHandler"; });
    if (StarterSelectUiHandler) {
        window.update = undefined;
        var oldGetValueLimit_1 = StarterSelectUiHandler.getValueLimit;
        var oldTryUpdateValue_1 = StarterSelectUiHandler.tryUpdateValue;
        StarterSelectUiHandler.getValueLimit = function () {
            if (data.getData('InfSelectionPoints', false, true)) {
                return 999999999;
            }
            else {
                return oldGetValueLimit_1.call(StarterSelectUiHandler);
            }
        };
        StarterSelectUiHandler.tryUpdateValue = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var result = oldTryUpdateValue_1.call.apply(oldTryUpdateValue_1, __spreadArray([StarterSelectUiHandler], args, false));
            if (data.getData('InfSelectionPoints', false, true)) {
                StarterSelectUiHandler.valueLimitLabel.setText(StarterSelectUiHandler.value);
            }
            return result;
        };
        window.cleanup = function () {
            StarterSelectUiHandler.getValueLimit = oldGetValueLimit_1;
            StarterSelectUiHandler.tryUpdateValue = oldTryUpdateValue_1;
        };
    }
};
data.addListener('InfSelectionPoints', false, function () {
    var StarterSelectUiHandler = getBattleScene().ui.handlers.find(function (handler) { return handler.constructor.name === "StarterSelectUiHandler"; });
    if (StarterSelectUiHandler) {
        StarterSelectUiHandler.tryUpdateValue();
    }
}, true);
