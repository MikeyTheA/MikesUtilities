(<any>window).update = () => {
    const battleScene = getBattleScene()

    if (battleScene === undefined || battleScene.ui === undefined) {
        return
    }

    const StarterSelectUiHandler = battleScene.ui.handlers.find(handler => handler.constructor.name === "StarterSelectUiHandler") as undefined | PokeRogue.ui.StarterSelectUiHandler;
    if (StarterSelectUiHandler) {

        (window as any).update = undefined;

        const oldGetValueLimit = StarterSelectUiHandler.getValueLimit;
        const oldTryUpdateValue = StarterSelectUiHandler.tryUpdateValue;

        StarterSelectUiHandler.getValueLimit = () => {
            if (data.getData('InfSelectionPoints', false, true)) {
                return 999999999;
            } else {
                return oldGetValueLimit.call(StarterSelectUiHandler);
            }
        };

        StarterSelectUiHandler.tryUpdateValue = (...args: any) => {
            const result = oldTryUpdateValue.call(StarterSelectUiHandler, ...args);
            if (data.getData('InfSelectionPoints', false, true)) {
                StarterSelectUiHandler.valueLimitLabel.setText(StarterSelectUiHandler.value);
            }
            return result;
        };

        (window as any).cleanup = () => {
            StarterSelectUiHandler.getValueLimit = oldGetValueLimit;
            StarterSelectUiHandler.tryUpdateValue = oldTryUpdateValue;
        };
    }
};

data.addListener(
    'InfSelectionPoints',
    false,
    () => {
        const StarterSelectUiHandler = getBattleScene().ui.handlers.find(handler => handler.constructor.name === "StarterSelectUiHandler") as undefined | PokeRogue.ui.StarterSelectUiHandler;
        if (StarterSelectUiHandler) {
            StarterSelectUiHandler.tryUpdateValue();
        }
    },
    true
);