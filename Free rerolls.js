let currentPhase = undefined;
let lastArgs = [];

function SelectModifierPhaseHook(phase) {
    const oldGetRerollCost = phase.getRerollCost;
    phase.getRerollCost = (t, i) => {
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
    (v) => {
        const handler = getHandler('ModifierSelectUiHandler');
        if (handler && currentPhase && currentPhase.getRerollCost) {
            handler.setRerollCost(currentPhase.getRerollCost(lastArgs[0], lastArgs[1]));
            handler.updateRerollCostText();
        }
    },
    true
);

print('crazyyyyy');
