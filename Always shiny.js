hook('EggHatchPhase', (phase) => {
    const oldDoReveal = phase.doReveal;

    phase.doReveal = (...args) => {
        if (data.getData('AlwaysShinyEggs', false, true)) {
            phase.pokemon.shiny = true;
        }

        return oldDoReveal.call(phase, ...args);
    };
});

const shiny = (phase) => {
    if (!phase.player) {
        const pokemon = phase.getPokemon();
        if (data.getData('AlwaysShinyEncounter', false, true)) {
            pokemon.shiny = true;
        }
    }
};

hook('PostSummonPhase', shiny);
hook('SummonPhase', shiny);
