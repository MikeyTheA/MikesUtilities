hook('AttemptCapturePhase', (phase) => {
    if (!data.getData('AlwaysCatch', false, true)) {
        return;
    }
    const pokemon = phase.getPokemon();
    print('test');
    const oldRandSeedInt = pokemon.randSeedInt;
    pokemon.randSeedInt = () => {
        print('working');
        return 0;
    };

    phase.getPokemon = () => {
        return pokemon;
    };

    const oldEnd = phase.end;
    phase.end = () => {
        oldEnd.call(phase);
        pokemon.randSeedInt = oldRandSeedInt;
    };
});
