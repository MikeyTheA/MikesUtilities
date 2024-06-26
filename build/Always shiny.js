var oldAddEnemyPokemon;
window.update = function () {
    var battleScene = getBattleScene();
    if (battleScene === undefined) {
        return;
    }
    window.update = undefined;
    oldAddEnemyPokemon = battleScene.addEnemyPokemon;
    battleScene.addEnemyPokemon = function (species, level, trainerSlot, boss, dataSource, postProcess) {
        if (boss === void 0) { boss = false; }
        var pokemon = oldAddEnemyPokemon.call(battleScene, species, level, trainerSlot, boss, dataSource, postProcess);
        if (data.getData("AlwaysShinyEncounter", false, true)) {
            pokemon.shiny = true;
            //pokemon.variant = data.getData('ShinyVariant', 0, true);
        }
        return pokemon;
    };
};
window.cleanup = function () {
    var battleScene = getBattleScene();
    if (battleScene === undefined) {
        return;
    }
    battleScene.addEnemyPokemon = oldAddEnemyPokemon !== null && oldAddEnemyPokemon !== void 0 ? oldAddEnemyPokemon : battleScene.addEnemyPokemon;
};
