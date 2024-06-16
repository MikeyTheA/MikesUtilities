hook('AttemptCapturePhase', (phase) => {
    if (!data.getData('AlwaysCatch', false, true)) {
        return;
    }
    const pokemon = phase.getPokemon();

    const oldRandSeedInt = pokemon.randSeedInt;
    pokemon.randSeedInt = () => {
        return 0;
    };

    phase.getPokemon = () => {
        return pokemon;
    };

    const oldStart = phase.start;
    phase.start = () => {
        oldStart.call(phase);
        pokemon.randSeedInt = oldRandSeedInt;
    };
});
