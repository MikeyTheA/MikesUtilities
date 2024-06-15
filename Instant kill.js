const kill = (phase) => {
    if (!phase.player) {
        const pokemon = phase.getPokemon();
        const oldDamage = pokemon.damage;
        pokemon.damage = (damage, ...args) => {
            if (data.getData('InstantKill', false, true)) {
                damage = pokemon.hp;
            }
            oldDamage.call(pokemon, damage, ...args);
        };
    }
};

hook('PostSummonPhase', kill);
hook('SummonPhase', kill);
