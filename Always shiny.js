hook('EggHatchPhase', (phase) => {
    const oldDoReveal = phase.doReveal;

    phase.doReveal = (...args) => {
        if (data.getData('AlwaysShinyEggs', false, true)) {
            phase.pokemon.shiny = true;
            phase.pokemon.variant = data.getData('ShinyVariant', false, true);
            phase.pokemon.initShinySparkle();
            phase.pokemonSprite.setPipelineData('shiny', phase.pokemon.shiny);
            phase.pokemonSprite.setPipelineData('variant', phase.pokemon.variant);
        }

        return oldDoReveal.call(phase, ...args);
    };
});

const shiny = (phase) => {
    if (!phase.player) {
        const pokemon = phase.getPokemon();
        if (data.getData('AlwaysShinyEncounter', false, true)) {
            pokemon.shiny = true;
            pokemon.variant = data.getData('ShinyVariant', false, true);
            pokemon.initShinySparkle();
            pokemon.sparkle();
            pokemon.updateFusionPalette();
        }
    }
};

hook('PostSummonPhase', shiny);
hook('SummonPhase', shiny);
