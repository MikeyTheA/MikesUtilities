const god = (phase: PokeRogue.SummonPhase) => {
    if (phase.player) {
        const pokemon = phase.getPokemon();
        const oldDamage = pokemon.damage;
        pokemon.damage = (damage: number, ...args: any) => {
            if (data.getData('GodMode', false, true)) {
                damage = 0;
            }
            return oldDamage.call(pokemon, damage, ...args);
        };
    }
};

hook('PostSummonPhase', god);
hook('SummonPhase', god);
