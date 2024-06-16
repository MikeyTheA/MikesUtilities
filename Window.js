const requiredVersion = '1.0.2';

addWindow(
    "Mike's utilities",
    () => {
        if (compareVersions(currentVersion, requiredVersion) < 0) {
            ImGui.Text('Outdated PokeRogueModLoader!');
            ImGui.Text(`Update to ${requiredVersion}`);
            ImGui.Text(`You are using ${currentVersion}`);
            return;
        }

        const battleScene = getBattleScene();
        ImGui.Checkbox('Free rerolls', data.getAccess('FreeRerolls', false, true));
        ImGui.Checkbox('No friendly damage', data.getAccess('GodMode', false, true));
        ImGui.Checkbox('One hit kill', data.getAccess('InstantKill', false, true));
        ImGui.Checkbox('Always catch', data.getAccess('AlwaysCatch', false, true));
        ImGui.Checkbox('Infinite starter pokemon selection points', data.getAccess('InfSelectionPoints', false, true));

        if (battleScene && battleScene.money) {
            ImGui.InputText(
                'Edit money',
                (value = battleScene.money) => {
                    let modified = false;
                    if (battleScene.money !== value) {
                        modified = true;
                    }

                    battleScene.money = parseInt(value) || battleScene.money;
                    if (modified) {
                        battleScene.updateMoneyText();
                    }

                    return String(value);
                },
                256,
                ImGui.InputTextFlags.CharsDecimal
            );
        }
    },
    {
        persistentOpen: true,
    }
);
