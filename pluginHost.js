// pluginHost.js
// Runs plugins on the MAIN PAGE based on global pluginState

(function () {

    // Called whenever a toggle changes
    function updateMainPlugins() {

        // ---- DPS Plugin ----
        if (window.pluginState.dps) {
            // Start on main page
            if (typeof window.startDPSPlugin === "function") {
                window.startDPSPlugin(document);
            }
        } else {
            // Stop on main page
            if (typeof window.stopDPSPlugin === "function") {
                window.stopDPSPlugin();
            }
        }

        // ---- Secret Finder (placeholder for later) ----
        if (window.pluginState.secrets) {
            if (typeof window.startSecretsPlugin === "function") {
                window.startSecretsPlugin(document);
            }
        } else {
            if (typeof window.stopSecretsPlugin === "function") {
                window.stopSecretsPlugin();
            }
        }
    }

    // Expose globally so mnu toggles can call it
    window.updateMainPlugins = updateMainPlugins;

})();
