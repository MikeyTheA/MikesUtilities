var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var god = function (phase) {
    if (phase.player) {
        var pokemon_1 = phase.getPokemon();
        var oldDamage_1 = pokemon_1.damage;
        pokemon_1.damage = function (damage) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (data.getData('GodMode', false, true)) {
                damage = 0;
            }
            return oldDamage_1.call.apply(oldDamage_1, __spreadArray([pokemon_1, damage], args, false));
        };
    }
};
hook('PostSummonPhase', god);
hook('SummonPhase', god);
