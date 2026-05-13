// enemyTracker.js

(function () {

    // Represents all currently visible enemies
    // enemyId → { x, y, lastSeen, totalDamage, signature }
    let enemies = {};

    // How long an enemy must be gone before considered dead (ms)
    const DEATH_TIMEOUT = 200;

    // ---- Utility: distance between two points ----
    function dist(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        return Math.sqrt(dx*dx + dy*dy);
    }

    // ---- Called every frame with detected enemies ----
    // detectedEnemies = [{ id, x, y, signature }]
    function updateEnemies(detectedEnemies) {
        const now = performance.now();

        // Mark all detected enemies as seen
        for (const e of detectedEnemies) {
            if (!enemies[e.id]) {
                enemies[e.id] = {
                    x: e.x,
                    y: e.y,
                    signature: e.signature,
                    totalDamage: 0,
                    lastSeen: now
                };
            } else {
                enemies[e.id].x = e.x;
                enemies[e.id].y = e.y;
                enemies[e.id].lastSeen = now;
            }
        }

        // Detect deaths
        for (const id in enemies) {
            const e = enemies[id];
            if (now - e.lastSeen > DEATH_TIMEOUT) {
                // Enemy is dead → record kill
                if (e.totalDamage > 0 && e.signature) {
                    EnemyHealthEstimator.recordKill(e.signature, e.totalDamage);
                }
                delete enemies[id];
            }
        }
    }

    // ---- Assign damage number to nearest enemy ----
    // dmg = { value, x, y }
    function assignDamage(dmg) {
        let bestId = null;
        let bestDist = Infinity;

        for (const id in enemies) {
            const e = enemies[id];
            const d = dist(e, dmg);
            if (d < bestDist) {
                bestDist = d;
                bestId = id;
            }
        }

        if (bestId !== null) {
            enemies[bestId].totalDamage += dmg.value;
        }
    }

    // ---- Get snapshot for overlay rendering ----
    function getEnemySnapshot() {
        const out = [];
        for (const id in enemies) {
            const e = enemies[id];
            out.push({
                id,
                x: e.x,
                y: e.y,
                signature: e.signature,
                totalDamage: e.totalDamage,
                estimatedHP: EnemyHealthEstimator.getEstimatedHP(e.signature)
            });
        }
        return out;
    }

    // Expose globally for DPS plugin
    window.EnemyTracker = {
        updateEnemies,
        assignDamage,
        getEnemySnapshot
    };

})();
