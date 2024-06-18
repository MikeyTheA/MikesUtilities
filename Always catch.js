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
        const pokemon = getBattleScene()
            .getEnemyField()
            .find((p) => p.isActive(true));
        let oldIsBoss = pokemon.isBoss;
        if (command === 1 && data.getData('AlwaysCatch', false, true)) {
            pokemon.isBoss = () => {
                return false;
            };
        }

        const result = oldHandleCommand.call(phase, command, cursor, ...args);
        pokemon.isBoss = oldIsBoss;
        return result;
    };
});
