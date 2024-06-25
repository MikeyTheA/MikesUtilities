const ShinyVariant = ['Common (Yellow Stars)', 'Rare (Blue Stars)', 'Epic (Red Stars)'];

const EGG_SEED = PokeRogue.data.EGG_SEED;

const updateEggList = (scene: PokeRogue.BattleScene) => {
    const handler = scene.ui.getHandler();
    if (handler instanceof PokeRogue.ui.EggListUiHandler) {
        scene.gameData.eggs.forEach((egg: any) => {
            handler.setEggDetails(egg);
        });

        const cursor = handler.getCursor();
        handler.eggListIconContainer.removeAll(true);
        handler.show([]);
        handler.setCursor(cursor);
        handler.iconAnimHandler.addOrUpdate(handler.eggListIconContainer.getAt(cursor), 2);
    }
};

addWindow(
    "Mike's utilities",
    () => {
        const battleScene = getBattleScene();
        ImGui.Checkbox('Free rerolls', data.getAccess('FreeRerolls', false, true));
        ImGui.Checkbox('No friendly damage', data.getAccess('GodMode', false, true));
        ImGui.Checkbox('One hit kill', data.getAccess('InstantKill', false, true));
        if (data.getData('InstantKill', false, true)) {
            ImGui.Text('  ');
            ImGui.SameLine();
            ImGui.Checkbox('Ignore boss segments', data.getAccess('IgnoreBossSegments', false, true));
        }
        ImGui.Checkbox('Always catch', data.getAccess('AlwaysCatch', false, true));
        /*
        ImGui.Checkbox('Always shiny (encounter) (sometimes works)', data.getAccess('AlwaysShinyEncounter', false, true));
        if (data.getData('AlwaysShinyEncounter', false, true)) {
            ImGui.Text('  ');
            ImGui.SameLine();
            const currentShiny = data.getData('ShinyVariant', 0, true);
            if (ImGui.BeginCombo('Shiny variant', ShinyVariant[currentShiny])) {
                ShinyVariant.forEach((shinyVariant, n) => {
                    const is_selected = currentShiny === n;
                    if (ImGui.Selectable(shinyVariant, is_selected)) data.setData('ShinyVariant', n, true);
                    if (is_selected) ImGui.SetItemDefaultFocus();
                });
                ImGui.EndCombo();
            }
        }*/
        ImGui.Checkbox('Infinite starter pokemon selection points', data.getAccess('InfSelectionPoints', false, true));

        if (battleScene && battleScene.money !== undefined) {
            ImGui.InputText(
                'Edit money',
                (value = battleScene.money) => {
                    let modified = false;
                    if (battleScene.money !== value) {
                        modified = true;
                    }

                    battleScene.money = parseInt(value) || 0;
                    if (modified) {
                        battleScene.updateMoneyText();
                    }

                    return String(value || 0);
                },
                256,
                ImGui.InputTextFlags.CharsDecimal
            );
        }

        if (battleScene && battleScene.gameData && battleScene.gameData.voucherCounts && ImGui.CollapsingHeader('Edit vouchers')) {
            const VoucherType = Object.keys(PokeRogue.system.VoucherType).filter((v) => isNaN(Number(v)));
            VoucherType.forEach((Voucher, VoucherId) => {
                ImGui.InputText(
                    Voucher,
                    (value = battleScene.gameData.voucherCounts[VoucherId]) => {
                        battleScene.gameData.voucherCounts[VoucherId] = parseInt(value) || 0;
                        const handler = battleScene.ui.getHandler();
                        if (handler instanceof PokeRogue.ui.EggGachaUiHandler) {
                            if (handler && handler.updateVoucherCounts) {
                                handler.updateVoucherCounts();
                            }
                        }
                        return String(value || 0);
                    },
                    256,
                    ImGui.InputTextFlags.CharsDecimal
                );
            });
        }

        if (battleScene && battleScene.gameData && battleScene.gameData.eggs && ImGui.CollapsingHeader('Edit eggs')) {
            /*ImGui.Checkbox('Always shiny (eggs)', data.getAccess('AlwaysShinyEggs', false, true));
            if (data.getData('AlwaysShinyEggs', false, true)) {
                ImGui.Text('  ');
                ImGui.SameLine();
                const currentShiny = data.getData('ShinyVariant', 0, true);
                if (ImGui.BeginCombo('Shiny variant##eggs', ShinyVariant[currentShiny])) {
                    ShinyVariant.forEach((shinyVariant, n) => {
                        const is_selected = currentShiny === n;
                        if (ImGui.Selectable(shinyVariant, is_selected)) data.setData('ShinyVariant', n, true);
                        if (is_selected) ImGui.SetItemDefaultFocus();
                    });
                    ImGui.EndCombo();
                }
            }*/
            const EggTier = Object.keys(PokeRogue.enums.EggTier).filter((v) => isNaN(Number(v)));
            EggTier.forEach((Tier, TierId) => {
                if (ImGui.Button(`Set all eggs Tier to ${Tier}`)) {
                    battleScene.gameData.eggs.forEach((egg) => {
                        const random_remainder = Math.floor(Math.random() * EGG_SEED);
                        const new_id = TierId * EGG_SEED + random_remainder;
                        egg._id = new_id;
                        egg._tier = TierId;
                    });

                    updateEggList(battleScene);
                }
            });
            const EggSourceType = Object.keys(PokeRogue.enums.EggSourceType).filter((v) => isNaN(Number(v)));
            EggSourceType.forEach((Gacha, GachaId) => {
                if (ImGui.Button(`Set all eggs GachaType to ${Gacha}`)) {
                    battleScene.gameData.eggs.forEach((egg: PokeRogue.data.Egg) => {
                        egg._sourceType = GachaId;
                    });

                    updateEggList(battleScene);
                }
            });

            if (ImGui.Button('Set all eggs to hatch next wave')) {
                battleScene.gameData.eggs.forEach((egg: any) => {
                    egg.hatchWaves = 0;
                });
            }
        }

        if (battleScene && battleScene.gameData && battleScene.gameData.saveSystem && ImGui.Button('Save Data')) {
            battleScene.gameData.saveSystem();
        }
    },
    {
        persistentOpen: true,
    }
);
