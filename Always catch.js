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

    const oldEnd = phase.end;
    phase.end = () => {
        oldEnd.call(phase);
        pokemon.randSeedInt = oldRandSeedInt;
    };
});

hook('CommandPhase', (phase) => {
    const oldHandleCommand = phase.handleCommand;

    phase.handleCommand = (command, cursor, ...args) => {
        if (command === 1 && data.getData('AlwaysCatch', false, true)) {
            cursor = 4;
        }

        return oldHandleCommand.call(phase, command, cursor, ...args);
    };
});
