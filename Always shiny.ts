let oldAddEnemyPokemon: any;

(<any>window).update = () => {
    const battleScene = getBattleScene()
    if (battleScene === undefined) {
        return
    }

    (<any>window).update = undefined
    oldAddEnemyPokemon = battleScene.addEnemyPokemon

    battleScene.addEnemyPokemon = (species: PokeRogue.data.PokemonSpecies, level: number, trainerSlot: PokeRogue.data.TrainerSlot, boss: boolean = false, dataSource?: PokeRogue.system.PokemonData, postProcess?: (enemyPokemon: PokeRogue.field.EnemyPokemon) => void): PokeRogue.field.EnemyPokemon => {
        const pokemon: PokeRogue.field.EnemyPokemon = oldAddEnemyPokemon.call(battleScene, species, level, trainerSlot, boss, dataSource, postProcess)
        if (data.getData("AlwaysShinyEncounter", false, true)) {
            pokemon.shiny = true
            //pokemon.variant = data.getData('ShinyVariant', 0, true);
        }
        return pokemon
    }
}

(<any>window).cleanup = () => {
    const battleScene = getBattleScene()
    if (battleScene === undefined) {
        return
    }

    battleScene.addEnemyPokemon = oldAddEnemyPokemon ?? battleScene.addEnemyPokemon
}