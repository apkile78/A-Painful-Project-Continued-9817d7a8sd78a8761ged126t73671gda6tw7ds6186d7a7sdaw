// dps.js
// Full DPS plugin: OCR → Damage → Enemy Tracker → Health Estimator → Overlay

(function () {

    let running = false;
    let overlayCanvas = null;
    let ctx = null;

    // OCR capture region (default: whole screen)
    // You can refine this later
    let captureX = 0, captureY = 0, captureW = window.innerWidth, captureH = window.innerHeight;

    // ---- Start the plugin ----
    function startDPSPlugin(doc) {
        if (running) return;
        running = true;

        // Create overlay canvas
        overlayCanvas = doc.createElement("canvas");
        overlayCanvas.style.position = "fixed";
        overlayCanvas.style.left = "0";
        overlayCanvas.style.top = "0";
        overlayCanvas.style.width = "100%";
        overlayCanvas.style.height = "100%";
        overlayCanvas.style.pointerEvents = "none";
        overlayCanvas.style.zIndex = "999999";
        doc.body.appendChild(overlayCanvas);

        ctx = overlayCanvas.getContext("2d");

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        loop();
    }

    // ---- Stop the plugin ----
    function stopDPSPlugin() {
        running = false;
        if (overlayCanvas && overlayCanvas.parentNode) {
            overlayCanvas.parentNode.removeChild(overlayCanvas);
        }
        overlayCanvas = null;
        ctx = null;
        DPSEngine.reset();
    }

    // ---- Resize overlay ----
    function resizeCanvas() {
        if (!overlayCanvas) return;
        overlayCanvas.width = window.innerWidth;
        overlayCanvas.height = window.innerHeight;
    }

    // ---- Fake OCR (placeholder) ----
    // Replace with real OCR later
    function detectDamageNumbers() {
        // Return array of:
        // { value, x, y }
        return [];
    }

    // ---- Fake enemy detection (placeholder) ----
    // Replace with real enemy detection later
    function detectEnemies() {
        // Return array of:
        // { id, x, y, signature }
        return [];
    }

    // ---- Main loop ----
    function loop() {
        if (!running) return;

        // 1. Detect damage numbers
        const dmgList = detectDamageNumbers();
        for (const dmg of dmgList) {
            DPSEngine.registerHit(dmg);
        }

        // 2. Detect enemies
        const enemies = detectEnemies();
        EnemyTracker.updateEnemies(enemies);

        // 3. Render overlay
        renderOverlay();

        requestAnimationFrame(loop);
    }

    // ---- Render overlay ----
    function renderOverlay() {
        if (!ctx) return;

        ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

        // Draw DPS
        const dps = DPSEngine.getCurrentDPS();
        const total = DPSEngine.getTotalDamage();

        ctx.font = "20px Arial";
        ctx.fillStyle = "yellow";
        ctx.fillText(`DPS: ${Math.round(dps)}`, 20, 40);
        ctx.fillText(`Total: ${Math.round(total)}`, 20, 70);

        // Draw enemy HP overlays
        const snapshot = EnemyTracker.getEnemySnapshot();
        for (const e of snapshot) {
            const est = e.estimatedHP;
            const dmg = e.totalDamage;

            if (est) {
                // White = estimated HP
                ctx.fillStyle = "white";
                ctx.fillText(Math.round(est), e.x, e.y - 20);

                // Blue = overkill
                if (dmg > est) {
                    ctx.fillStyle = "cyan";
                    ctx.fillText(`+${Math.round(dmg - est)}`, e.x, e.y - 40);
                }
            } else {
                // Unknown HP yet
                ctx.fillStyle = "gray";
                ctx.fillText("?", e.x, e.y - 20);
            }
        }
    }

    // Expose globally for pluginHost + pluginInjector
    window.startDPSPlugin = startDPSPlugin;
    window.stopDPSPlugin = stopDPSPlugin;

})();
