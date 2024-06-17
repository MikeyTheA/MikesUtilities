const kill = (phase) => {
    if (!phase.player) {
        const pokemon = phase.getPokemon();
        const oldDamage = pokemon.damage;
        pokemon.damage = (damage, ignoreSegments, ...args) => {
            if (data.getData('InstantKill', false, true)) {
                damage = pokemon.hp;
            }
            if (data.getData('InstantKill', false, true) && data.getData('IgnoreBossSegments', false, true)) {
                ignoreSegments = true;
            }
            return oldDamage.call(pokemon, damage, ignoreSegments, ...args);
        };
    }
};

hook('PostSummonPhase', kill);
hook('SummonPhase', kill);
