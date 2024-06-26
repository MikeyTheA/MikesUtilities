var ShinyVariant = Object.keys(PokeRogue.enums.VariantTier).filter(function (v) { return isNaN(Number(v)); });
var EggTier = Object.keys(PokeRogue.enums.EggTier).filter(function (v) { return isNaN(Number(v)); });
var EggSourceType = Object.keys(PokeRogue.enums.EggSourceType).filter(function (v) { return isNaN(Number(v)); });
var Species = Object.keys(PokeRogue.enums.Species).filter(function (v) { return isNaN(Number(v)); });
var EGG_SEED = PokeRogue.data.EGG_SEED;
var updateEggList = function (scene) {
    var _a, _b;
    var handler = scene.ui.getHandler();
    if (handler instanceof PokeRogue.ui.EggListUiHandler) {
        var cursor = handler.getCursor();
        handler.setEggDetails((_b = (_a = getBattleScene()) === null || _a === void 0 ? void 0 : _a.gameData) === null || _b === void 0 ? void 0 : _b.eggs[cursor]);
        handler.eggListIconContainer.removeAll(true);
        handler.show([]);
        handler.setCursor(cursor);
        handler.iconAnimHandler.addOrUpdate(handler.eggListIconContainer.getAt(cursor), 2);
    }
};
addWindow("Egg Selector", function () {
    var battleScene = getBattleScene();
    if (battleScene === undefined || battleScene.gameData === undefined) {
        ImGui.Text("Loading");
        return;
    }
    var selectedEgg = data.getData("selectedEgg", 0);
    if (ImGui.Selectable("All eggs", selectedEgg === 0, 0, new ImGui.Vec2(100, 13))) {
        data.setData("selectedEgg", 0);
        getWindowOpenAccess("Egg Editor")(true);
    }
    var current = 1;
    battleScene.gameData.eggs.forEach(function (egg, eggindex) {
        if ((current + 1) * 100 < ImGui.GetWindowContentRegionMax().x) {
            current += 1;
            ImGui.SameLine();
        }
        else {
            current = 1;
        }
        if (ImGui.Selectable("".concat(eggindex + 1, " ").concat(PokeRogue.enums.Species[egg._species]), selectedEgg === eggindex + 1, 0, new ImGui.Vec2(100, 13))) {
            data.setData("selectedEgg", eggindex + 1);
            getWindowOpenAccess("Egg Editor")(true);
        }
    });
}, {
    open: false,
    persistentOpen: true,
    hidden: true
});
addWindow("Egg Editor", function () {
    var battleScene = getBattleScene();
    if (battleScene === undefined || battleScene.gameData === undefined) {
        ImGui.Text("Loading");
        return;
    }
    var selectedEgg = data.getData("selectedEgg", 0);
    if (selectedEgg === 0) {
        ImGui.Text("Currently editing all eggs.");
        ImGui.Combo("Tier", data.getAccess("GlobalEggsTier", 0), EggTier, ImGui.ARRAYSIZE(EggTier));
        ImGui.SameLine();
        if (ImGui.Button("Set##TierGlobal")) {
            battleScene.gameData.eggs.forEach(function (egg) {
                egg._tier = data.getData("GlobalEggsTier", 0);
                updateEggList(battleScene);
                egg._id = PokeRogue.randInt(EGG_SEED, EGG_SEED * egg._tier);
                egg._species = egg.rollSpecies(battleScene);
            });
        }
        ImGui.Combo("Source Type", data.getAccess("GlobalEggsSourceType", 0), EggSourceType, ImGui.ARRAYSIZE(EggSourceType));
        ImGui.SameLine();
        if (ImGui.Button("Set##SourceGlobal")) {
            battleScene.gameData.eggs.forEach(function (egg) {
                egg._sourceType = data.getData("GlobalEggsSourceType", 0);
                updateEggList(battleScene);
                egg._species = egg.rollSpecies(battleScene);
                egg._eggMoveIndex = egg.rollEggMoveIndex();
            });
        }
        ImGui.Checkbox("Shiny", data.getAccess("GlobalEggsShiny", false));
        ImGui.SameLine();
        if (ImGui.Button("Set##Shiny")) {
            battleScene.gameData.eggs.forEach(function (egg) {
                egg._isShiny = data.getData("GlobalEggsShiny", false);
                egg._variantTier = egg.rollVariant();
            });
        }
        ImGui.Combo("Shiny variant", data.getAccess("GlobalEggsShinyVariant", false), ShinyVariant, ImGui.ARRAYSIZE(ShinyVariant));
        ImGui.SameLine();
        if (ImGui.Button("Set##ShinyVariant")) {
            battleScene.gameData.eggs.forEach(function (egg) {
                egg._variantTier = data.getData("GlobalEggsShinyVariant", false);
            });
        }
        if (ImGui.Button("Set hatching to 0 waves")) {
            battleScene.gameData.eggs.forEach(function (egg) {
                egg._hatchWaves = 0;
            });
        }
        return;
    }
    var egg = battleScene.gameData.eggs[selectedEgg - 1];
    if (egg === undefined) {
        ImGui.Text("Egg not found, select another one.");
        return;
    }
    ImGui.Text("Currently editing egg ".concat(selectedEgg));
    ImGui.Text("Species: ".concat(PokeRogue.enums.Species[egg._species]));
    ImGui.SameLine();
    if (ImGui.Button("Reroll")) {
        egg._species = egg.rollSpecies(battleScene);
    }
    ImGui.SameLine();
    ImGui.PushItemWidth(-15);
    ImGui.InputText("##EditSpecies".concat(egg._id), function (value) {
        if (value === void 0) { value = data.getData("editSpecies".concat(egg._id), ""); }
        value = value.toUpperCase();
        data.setData("editSpecies".concat(egg._id), value);
        if (Species.includes(value)) {
            egg._species = PokeRogue.enums.Species[value];
            egg._tier = egg.getEggTierFromSpeciesStarterValue();
        }
        return value;
    });
    ImGui.PopItemWidth();
    ImGui.SameLine();
    if (Species.includes(data.getData("editSpecies".concat(egg._id), ""))) {
        ImGui.PushStyleColor(ImGui.Col.Text, ImGui.IM_COL32(20, 255, 20, 255));
        ImGui.Text("v");
        ImGui.PopStyleColor();
    }
    else {
        ImGui.PushStyleColor(ImGui.Col.Text, ImGui.IM_COL32(255, 20, 20, 255));
        ImGui.Text("x");
        ImGui.PopStyleColor();
    }
    ImGui.Combo("Tier", function (value) {
        if (value === void 0) { value = egg._tier; }
        var modified = value !== egg._tier;
        egg._tier = value;
        if (modified) {
            updateEggList(battleScene);
            egg._id = PokeRogue.randInt(EGG_SEED, EGG_SEED * egg._tier);
            egg._species = egg.rollSpecies(battleScene);
        }
        return egg._tier;
    }, EggTier, ImGui.ARRAYSIZE(EggTier));
    ImGui.Combo("Source Type", function (value) {
        if (value === void 0) { value = egg._sourceType; }
        var modified = value !== egg._sourceType;
        egg._sourceType = value;
        if (modified) {
            updateEggList(battleScene);
            egg._tier = egg.rollEggTier();
            egg._species = egg.rollSpecies(battleScene);
            egg._eggMoveIndex = egg.rollEggMoveIndex();
        }
        return egg._sourceType;
    }, EggSourceType, ImGui.ARRAYSIZE(EggSourceType));
    ImGui.Checkbox("Shiny", function (value) {
        if (value === void 0) { value = egg._isShiny; }
        var modified = value !== egg._isShiny;
        egg._isShiny = value;
        if (modified)
            egg._variantTier = egg.rollVariant();
        return value;
    });
    ImGui.Combo("Shiny variant", function (value) {
        if (value === void 0) { value = egg._variantTier; }
        egg._variantTier = value;
        return egg._variantTier;
    }, ShinyVariant, ImGui.ARRAYSIZE(ShinyVariant));
    ImGui.InputText("Waves remaining", function (value) {
        if (value === void 0) { value = egg._hatchWaves; }
        var modified = egg._hatchWaves !== value;
        egg._hatchWaves = parseInt(value) || 0;
        return String(egg._hatchWaves || 0);
    }, 256, ImGui.InputTextFlags.CharsDecimal);
    if (ImGui.Button("Set to 0 waves")) {
        egg._hatchWaves = 0;
    }
}, {
    open: false,
    persistentOpen: false,
    hidden: true
});
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
    ImGui.Checkbox('Always shiny (encounter)', data.getAccess('AlwaysShinyEncounter', false, true));
    /*if (data.getData('AlwaysShinyEncounter', false, true)) {
        ImGui.Text('  ');
        ImGui.SameLine();
        ImGui.Combo("Shiny variant", data.getAccess("ShinyVariant", 0, true), ShinyVariant, ImGui.ARRAYSIZE(ShinyVariant));
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
    ImGui.Checkbox("Egg editor", getWindowOpenAccess("Egg Selector"));
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
    if (battleScene && battleScene.gameData && battleScene.gameData.saveSystem && ImGui.Button('Save Data')) {
        battleScene.gameData.saveSystem();
    }
}, {
    persistentOpen: true,
});
