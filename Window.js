const requiredVersion = '1.0.2';

const VoucherType = ['REGULAR', 'PLUS', 'PREMIUM', 'GOLDEN'];
const GachaType = ['MOVE', 'LEGENDARY', 'SHINY'];
const EggTier = ['COMMON', 'GREAT', 'ULTRA', 'MASTER'];
const ShinyVariant = ['Common (Yellow Stars)', 'Rare (Blue Stars)', 'Epic (Red Stars)'];

const EGG_SEED = 1073741824;

const updateEggList = (battleScene) => {
    const eggListUiHandler = getHandler('EggListUiHandler');
    if (eggListUiHandler && eggListUiHandler.active) {
        battleScene.gameData.eggs.forEach((egg) => {
            eggListUiHandler.setEggDetails(egg);
        });

        const cursor = eggListUiHandler.getCursor();
        eggListUiHandler.eggListIconContainer.removeAll(true);
        eggListUiHandler.show();
        eggListUiHandler.setCursor(cursor);
        eggListUiHandler.iconAnimHandler.addOrUpdate(eggListUiHandler.eggListIconContainer.getAt(cursor), 2);
    }
};

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
        if (data.getData('InstantKill', false, true)) {
            ImGui.Text('  ');
            ImGui.SameLine();
            ImGui.Checkbox('Ignore boss segments', data.getAccess('IgnoreBossSegments', false, true));
        }
        ImGui.Checkbox('Always catch', data.getAccess('AlwaysCatch', false, true));
        ImGui.Checkbox('Always shiny (encounter) (sometimes works)', data.getAccess('AlwaysShinyEncounter', false, true));
        if (data.getData('AlwaysShinyEncounter', false, true)) {
            ImGui.Text('  ');
            ImGui.SameLine();
            const currentShiny = data.getData('ShinyVariant', false, true);
            if (ImGui.BeginCombo('Shiny variant', ShinyVariant[currentShiny])) {
                ShinyVariant.forEach((shinyVariant, n) => {
                    const is_selected = currentShiny === n;
                    if (ImGui.Selectable(shinyVariant, is_selected)) data.setData('ShinyVariant', n, true);
                    if (is_selected) ImGui.SetItemDefaultFocus();
                });
                ImGui.EndCombo();
            }
        }
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

        if (battleScene && battleScene.gameData && battleScene.gameData.voucherCounts && ImGui.CollapsingHeader('Edit vouchers')) {
            VoucherType.forEach((Voucher, VoucherId) => {
                ImGui.InputText(
                    Voucher,
                    (value = battleScene.gameData.voucherCounts[VoucherId]) => {
                        battleScene.gameData.voucherCounts[VoucherId] = parseInt(value);
                        const eggGachaUiHandler = getHandler('EggGachaUiHandler');
                        if (eggGachaUiHandler && eggGachaUiHandler.updateVoucherCounts) {
                            eggGachaUiHandler.updateVoucherCounts();
                        }
                        return String(value);
                    },
                    256,
                    ImGui.InputTextFlags.CharsDecimal
                );
            });
        }

        if (battleScene && battleScene.gameData && battleScene.gameData.eggs && ImGui.CollapsingHeader('Edit eggs')) {
            ImGui.Checkbox('Always shiny (eggs)', data.getAccess('AlwaysShinyEggs', false, true));
            if (data.getData('AlwaysShinyEggs', false, true)) {
                ImGui.Text('  ');
                ImGui.SameLine();
                const currentShiny = data.getData('ShinyVariant', false, true);
                if (ImGui.BeginCombo('Shiny variant##eggs', ShinyVariant[currentShiny])) {
                    ShinyVariant.forEach((shinyVariant, n) => {
                        const is_selected = currentShiny === n;
                        if (ImGui.Selectable(shinyVariant, is_selected)) data.setData('ShinyVariant', n, true);
                        if (is_selected) ImGui.SetItemDefaultFocus();
                    });
                    ImGui.EndCombo();
                }
            }
            EggTier.forEach((Tier, TierId) => {
                if (ImGui.Button(`Set all eggs Tier to ${Tier}`)) {
                    battleScene.gameData.eggs.forEach((egg) => {
                        const random_remainder = Math.floor(Math.random() * EGG_SEED);
                        const new_id = TierId * EGG_SEED + random_remainder;
                        egg.id = new_id;
                        egg.tier = TierId;
                    });

                    updateEggList(battleScene);
                }
            });
            GachaType.forEach((Gacha, GachaId) => {
                if (ImGui.Button(`Set all eggs GachaType to ${Gacha}`)) {
                    battleScene.gameData.eggs.forEach((egg) => {
                        egg.gachaType = GachaId;
                    });

                    updateEggList(battleScene);
                }
            });

            if (ImGui.Button('Set all eggs to hatch next wave')) {
                battleScene.gameData.eggs.forEach((egg) => {
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
