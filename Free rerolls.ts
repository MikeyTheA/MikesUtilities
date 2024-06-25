let currentPhase: PokeRogue.SelectModifierPhase | undefined = undefined;
let lastArgs: any = [];

function SelectModifierPhaseHook(phase: PokeRogue.SelectModifierPhase) {
    const oldGetRerollCost = phase.getRerollCost;
    phase.getRerollCost = (t: any, i: any) => {
        log(data.getData('FreeRerolls', false, true))
        lastArgs[0] = t;
        lastArgs[1] = i;
        if (data.getData('FreeRerolls', false, true)) {
            return 0;
        }
        return oldGetRerollCost.call(phase, t, i);
    };
    currentPhase = phase;
}

hook('SelectModifierPhase', SelectModifierPhaseHook);

data.addListener(
    'FreeRerolls',
    false,
    () => {
        const battleScene = getBattleScene()
        if (battleScene) {
            const handler = getBattleScene().ui.handlers.find(handler => handler.constructor.name === "ModifierSelectUiHandler") as undefined | PokeRogue.ui.ModifierSelectUiHandler;
            if (handler && currentPhase && currentPhase.getRerollCost) {
                handler.setRerollCost(currentPhase.getRerollCost(lastArgs[0], lastArgs[1]));
                handler.updateRerollCostText();
            }
        }
    },
    true
);
