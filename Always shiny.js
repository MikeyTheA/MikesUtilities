hook('EggHatchPhase', (phase) => {
    const oldDoReveal = phase.doReveal;

    phase.doReveal = (...args) => {
        if (data.getData('AlwaysShinyEggs', false, true)) {
            phase.pokemon.shiny = true;
        }

        return oldDoReveal.call(phase, ...args);
    };
});
