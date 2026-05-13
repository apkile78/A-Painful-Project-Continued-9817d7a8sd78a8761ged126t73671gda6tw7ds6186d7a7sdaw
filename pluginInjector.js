// pluginInjector.js

(function () {

    // Inject plugins into a newly opened window (about:blank, blob, etc.)
    function injectPlugins(win) {
        if (!win || !win.document) return;

        // Ensure document is writable
        try { win.document.open(); } catch (e) {}

        // DPS Plugin
        if (window.pluginState.dps) {
            win.document.write(`<script src="dps.js"></script>`);
            win.document.write(`<script src="dpsEngine.js"></script>`);
            win.document.write(`<script src="ocr.js"></script>`);
            win.document.write(`<script src="enemyTracker.js"></script>`);
            win.document.write(`<script src="enemyHealthEstimator.js"></script>`);
        }

        // Close document
        try { win.document.close(); } catch (e) {}
    }

    // Blob windows sometimes need a delay before injection
    function injectIntoBlobWindow(win) {
        if (!win) return;
        setTimeout(() => injectPlugins(win), 50);
    }

    window.PluginInjector = {
        injectPlugins,
        injectIntoBlobWindow
    };

})();
