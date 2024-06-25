var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var kill = function (phase) {
    if (!phase.player) {
        var pokemon_1 = phase.getPokemon();
        var oldDamage_1 = pokemon_1.damage;
        pokemon_1.damage = function (damage, ignoreSegments) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            if (data.getData('InstantKill', false, true)) {
                damage = pokemon_1.hp;
            }
            if (data.getData('InstantKill', false, true) && data.getData('IgnoreBossSegments', false, true)) {
                ignoreSegments = true;
            }
            return oldDamage_1.call.apply(oldDamage_1, __spreadArray([pokemon_1, damage, ignoreSegments], args, false));
        };
    }
};
hook('PostSummonPhase', kill);
hook('SummonPhase', kill);
