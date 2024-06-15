addWindow(
    "Mike's utilities",
    () => {
        ImGui.Checkbox('Free rerolls', data.getAccess('FreeRerolls', false, true));
        ImGui.Checkbox('No friendly damage', data.getAccess('GodMode', false, true));
        ImGui.Checkbox('One hit kill', data.getAccess('InstantKill', false, true));
        ImGui.Checkbox('Infinite starter pokemon selection points', data.getAccess('InfSelectionPoints', false, true));
    },
    {
        persistentOpen: true,
    }
);
