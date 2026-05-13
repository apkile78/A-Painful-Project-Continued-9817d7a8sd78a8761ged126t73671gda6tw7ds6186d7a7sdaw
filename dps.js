// dps.js
// Full DPS plugin with integrated OCR

(function () {

    let running = false;
    let overlayCanvas = null;
    let ctx = null;

    function startDPSPlugin(doc) {
        if (running) return;
        running = true;

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

    function stopDPSPlugin() {
        running = false;
        if (overlayCanvas && overlayCanvas.parentNode) {
            overlayCanvas.parentNode.removeChild(overlayCanvas);
        }
        overlayCanvas = null;
        ctx = null;
        DPSEngine.reset();
    }

    function resizeCanvas() {
        if (!overlayCanvas) return;
        overlayCanvas.width = window.innerWidth;
        overlayCanvas.height = window.innerHeight;
    }

    function loop() {
        if (!running) return;

        const dmgList = OCR.detectDamageNumbers();
        for (const dmg of dmgList) {
            DPSEngine.registerHit(dmg);
        }

        const enemies = [];
        EnemyTracker.updateEnemies(enemies);

        renderOverlay();

        requestAnimationFrame(loop);
    }

    function renderOverlay() {
        if (!ctx) return;

        ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

        const dps = DPSEngine.getCurrentDPS();
        const total = DPSEngine.getTotalDamage();

        ctx.font = "20px Arial";
        ctx.fillStyle = "yellow";
        ctx.fillText(`DPS: ${Math.round(dps)}`, 20, 40);
        ctx.fillText(`Total: ${Math.round(total)}`, 20, 70);

        const snapshot = EnemyTracker.getEnemySnapshot();
        for (const e of snapshot) {
            const est = e.estimatedHP;
            const dmg = e.totalDamage;

            if (est) {
                ctx.fillStyle = "white";
                ctx.fillText(Math.round(est), e.x, e.y - 20);

                if (dmg > est) {
                    ctx.fillStyle = "cyan";
                    ctx.fillText(`+${Math.round(dmg - est)}`, e.x, e.y - 40);
                }
            } else {
                ctx.fillStyle = "gray";
                ctx.fillText("?", e.x, e.y - 20);
            }
        }
    }

    window.startDPSPlugin = startDPSPlugin;
    window.stopDPSPlugin = stopDPSPlugin;

})();
