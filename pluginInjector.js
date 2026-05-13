// pluginInjector.js
// Injects plugins into ANY about:blank or blob popup window

(function () {

    // Injects plugin scripts into a target window
    function injectPlugins(win) {
        if (!win || !win.document) return;

        // Ensure document is writable
        try {
            win.document.open();
        } catch (e) {
            // Some blob windows need a delay
        }

        // ---- DPS Plugin ----
        if (window.pluginState.dps) {
            win.document.write(`<script src="dps.js"></script>`);
        }

        // ---- Secret Finder (future) ----
        if (window.pluginState.secrets) {
            win.document.write(`<script src="secrets.js"></script>`);
        }

        try {
            win.document.close();
        } catch (e) {
            // Some windows auto-close the stream; safe to ignore
        }
    }

    // Inject into blob windows (requires delay)
    function injectIntoBlobWindow(win) {
        if (!win) return;
        setTimeout(() => injectPlugins(win), 50);
    }

    // Expose globally so all popup creation paths can use it
    window.PluginInjector = {
        injectPlugins,
        injectIntoBlobWindow
    };

})();
