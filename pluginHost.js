// pluginHost.js

(function () {

    // Called whenever pluginState changes (menu toggles)
    function updateMainPlugins() {

        // --- DPS Plugin ---
        if (window.pluginState.dps) {
            if (typeof window.startDPSPlugin === "function") {
                window.startDPSPlugin(document);
            }
        } else {
            if (typeof window.stopDPSPlugin === "function") {
                window.stopDPSPlugin();
            }
        }
    }

    window.updateMainPlugins = updateMainPlugins;

})();
