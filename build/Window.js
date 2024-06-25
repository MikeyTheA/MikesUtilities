var ShinyVariant = ['Common (Yellow Stars)', 'Rare (Blue Stars)', 'Epic (Red Stars)'];
var EGG_SEED = PokeRogue.data.EGG_SEED;
var updateEggList = function (scene) {
    var handler = scene.ui.getHandler();
    if (handler instanceof PokeRogue.ui.EggListUiHandler) {
        scene.gameData.eggs.forEach(function (egg) {
            handler.setEggDetails(egg);
        });
        var cursor = handler.getCursor();
        handler.eggListIconContainer.removeAll(true);
        handler.show([]);
        handler.setCursor(cursor);
        handler.iconAnimHandler.addOrUpdate(handler.eggListIconContainer.getAt(cursor), 2);
    }
};
addWindow("Mike's utilities", function () {
    var battleScene = getBattleScene();
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
        ImGui.InputText('Edit money', function (value) {
            if (value === void 0) { value = battleScene.money; }
            var modified = false;
            if (battleScene.money !== value) {
                modified = true;
            }
            battleScene.money = parseInt(value) || 0;
            if (modified) {
                battleScene.updateMoneyText();
            }
            return String(value || 0);
        }, 256, ImGui.InputTextFlags.CharsDecimal);
    }
    if (battleScene && battleScene.gameData && battleScene.gameData.voucherCounts && ImGui.CollapsingHeader('Edit vouchers')) {
        var VoucherType = Object.keys(PokeRogue.system.VoucherType).filter(function (v) { return isNaN(Number(v)); });
        VoucherType.forEach(function (Voucher, VoucherId) {
            ImGui.InputText(Voucher, function (value) {
                if (value === void 0) { value = battleScene.gameData.voucherCounts[VoucherId]; }
                battleScene.gameData.voucherCounts[VoucherId] = parseInt(value) || 0;
                var handler = battleScene.ui.getHandler();
                if (handler instanceof PokeRogue.ui.EggGachaUiHandler) {
                    if (handler && handler.updateVoucherCounts) {
                        handler.updateVoucherCounts();
                    }
                }
                return String(value || 0);
            }, 256, ImGui.InputTextFlags.CharsDecimal);
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
        var EggTier = Object.keys(PokeRogue.enums.EggTier).filter(function (v) { return isNaN(Number(v)); });
        EggTier.forEach(function (Tier, TierId) {
            if (ImGui.Button("Set all eggs Tier to ".concat(Tier))) {
                battleScene.gameData.eggs.forEach(function (egg) {
                    var random_remainder = Math.floor(Math.random() * EGG_SEED);
                    var new_id = TierId * EGG_SEED + random_remainder;
                    egg._id = new_id;
                    egg._tier = TierId;
                });
                updateEggList(battleScene);
            }
        });
        var EggSourceType = Object.keys(PokeRogue.enums.EggSourceType).filter(function (v) { return isNaN(Number(v)); });
        EggSourceType.forEach(function (Gacha, GachaId) {
            if (ImGui.Button("Set all eggs GachaType to ".concat(Gacha))) {
                battleScene.gameData.eggs.forEach(function (egg) {
                    egg._sourceType = GachaId;
                });
                updateEggList(battleScene);
            }
        });
        if (ImGui.Button('Set all eggs to hatch next wave')) {
            battleScene.gameData.eggs.forEach(function (egg) {
                egg.hatchWaves = 0;
            });
        }
    }
    if (battleScene && battleScene.gameData && battleScene.gameData.saveSystem && ImGui.Button('Save Data')) {
        battleScene.gameData.saveSystem();
    }
}, {
    persistentOpen: true,
});
