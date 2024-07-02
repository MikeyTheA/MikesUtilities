var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var oldAddEnemyPokemon;
window.update = function () {
    var battleScene = getBattleScene();
    if (battleScene === undefined) {
        return;
    }
    window.update = undefined;
    oldAddEnemyPokemon = battleScene.addEnemyPokemon;
    battleScene.addEnemyPokemon = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var pokemon = oldAddEnemyPokemon.call.apply(oldAddEnemyPokemon, __spreadArray([battleScene], args, false));
        if (data.getData("AlwaysShinyEncounter", false, true)) {
            pokemon.shiny = true;
            //pokemon.variant = data.getData('ShinyVariant', 0, true);
        }
        log("Made shiny ".concat(pokemon.name));
        return pokemon;
    };
};
window.cleanup = function () {
    var battleScene = getBattleScene();
    if (battleScene === undefined) {
        return;
    }
    battleScene.addEnemyPokemon = oldAddEnemyPokemon !== null && oldAddEnemyPokemon !== void 0 ? oldAddEnemyPokemon : battleScene.addEnemyPokemon;
};
