const kill = (phase: PokeRogue.PostSummonPhase) => {
    if (!phase.player) {
        const pokemon = phase.getPokemon();
        const oldDamage = pokemon.damage;
        pokemon.damage = (damage: any, ignoreSegments: boolean, ...args: any) => {
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
