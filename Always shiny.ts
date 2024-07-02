let oldAddEnemyPokemon: any;

(<any>window).update = () => {
    const battleScene = getBattleScene()
    if (battleScene === undefined) {
        return
    }

    (<any>window).update = undefined
    oldAddEnemyPokemon = battleScene.addEnemyPokemon

    battleScene.addEnemyPokemon = (...args) => {
        const pokemon: PokeRogue.field.EnemyPokemon = oldAddEnemyPokemon.call(battleScene, ...args)
        if (data.getData("AlwaysShinyEncounter", false, true)) {
            pokemon.shiny = true

            //pokemon.variant = data.getData('ShinyVariant', 0, true);
        }
        log(`Made shiny ${pokemon.name}`)
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