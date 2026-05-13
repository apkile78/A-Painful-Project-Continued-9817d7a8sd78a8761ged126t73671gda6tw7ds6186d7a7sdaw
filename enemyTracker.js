// enemyTracker.js

(function () {

    let enemies = {};

    function updateEnemies(list) {
        const now = performance.now();

        // Update or create enemies
        for (const e of list) {
            if (!enemies[e.id]) {
                enemies[e.id] = {
                    id: e.id,
                    x: e.x,
                    y: e.y,
                    signature: e.signature,
                    totalDamage: 0,
                    estimatedHP: null,
                    lastSeen: now
                };
            } else {
                enemies[e.id].x = e.x;
                enemies[e.id].y = e.y;
                enemies[e.id].lastSeen = now;
            }
        }

        // Remove stale enemies
        for (const id in enemies) {
            if (now - enemies[id].lastSeen > 2000) {
                delete enemies[id];
            }
        }
    }

    function assignDamage(dmg) {
        for (const id in enemies) {
            const e = enemies[id];
            const dx = Math.abs(dmg.x - e.x);
            const dy = Math.abs(dmg.y - e.y);

            // Damage belongs to the nearest enemy
            if (dx < 50 && dy < 50) {
                e.totalDamage += dmg.value;
                e.estimatedHP = EnemyHealthEstimator.estimate(e.signature, e.totalDamage);
                return;
            }
        }
    }

    function getEnemySnapshot() {
        return Object.values(enemies);
    }

    window.EnemyTracker = {
        updateEnemies,
        assignDamage,
        getEnemySnapshot
    };

})();
