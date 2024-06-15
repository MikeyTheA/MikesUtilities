window.update = () => {
    const StarterSelectUiHandler = getHandler('StarterSelectUiHandler');
    if (StarterSelectUiHandler) {
        window.update = undefined;

        const oldGetValueLimit = StarterSelectUiHandler.getValueLimit;
        const oldTryUpdateValue = StarterSelectUiHandler.tryUpdateValue;

        StarterSelectUiHandler.getValueLimit = () => {
            if (data.getData('InfSelectionPoints', false, true)) {
                return 999999999;
            } else {
                return oldGetValueLimit.call(StarterSelectUiHandler);
            }
        };

        StarterSelectUiHandler.tryUpdateValue = (...args) => {
            const result = oldTryUpdateValue.call(StarterSelectUiHandler, ...args);
            if (data.getData('InfSelectionPoints', false, true)) {
                StarterSelectUiHandler.valueLimitLabel.setText(StarterSelectUiHandler.value);
            }
            return result;
        };

        window.cleanup = () => {
            StarterSelectUiHandler.getValueLimit = oldGetValueLimit;
            StarterSelectUiHandler.tryUpdateValue = oldTryUpdateValue;
        };
    }
};

data.addListener(
    'InfSelectionPoints',
    false,
    () => {
        const StarterSelectUiHandler = getHandler('StarterSelectUiHandler');
        if (StarterSelectUiHandler) {
            StarterSelectUiHandler.tryUpdateValue();
        }
    },
    true
);
