var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
hook('AttemptCapturePhase', function (phase) {
    if (!data.getData('AlwaysCatch', false, true)) {
        return;
    }
    var pokemon = phase.getPokemon();
    var oldRandSeedInt = pokemon.randSeedInt;
    pokemon.randSeedInt = function () {
        return 0;
    };
    phase.getPokemon = function () {
        return pokemon;
    };
    var oldEnd = phase.end;
    phase.end = function () {
        oldEnd.call(phase);
        pokemon.randSeedInt = oldRandSeedInt;
    };
});
hook('CommandPhase', function (phase) {
    var oldHandleCommand = phase.handleCommand;
    phase.handleCommand = function (command, cursor) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var pokemon = getBattleScene()
            .getEnemyField()
            .find(function (p) { return p.isActive(true); });
        var oldIsBoss = pokemon.isBoss;
        if (command === 1 && data.getData('AlwaysCatch', false, true)) {
            pokemon.isBoss = function () {
                return false;
            };
        }
        var result = oldHandleCommand.call.apply(oldHandleCommand, __spreadArray([phase, command, cursor], args, false));
        pokemon.isBoss = oldIsBoss;
        return result;
    };
});
