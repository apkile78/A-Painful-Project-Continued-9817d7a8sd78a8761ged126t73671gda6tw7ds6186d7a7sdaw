// dpsEngine.js

(function () {

    let recentHits = [];
    let totalDamage = 0;

    // DPS window (1 second)
    const WINDOW = 1000;

    function registerHit(dmg) {
        const now = performance.now();

        // Add hit to rolling window
        recentHits.push({ value: dmg.value, time: now });

        // Add to total damage
        totalDamage += dmg.value;

        // Assign damage to nearest enemy
        EnemyTracker.assignDamage(dmg);
    }

    function getCurrentDPS() {
        const now = performance.now();

        // Remove hits older than 1 second
        while (recentHits.length > 0 && now - recentHits[0].time > WINDOW) {
            recentHits.shift();
        }

        // Sum remaining hits
        return recentHits.reduce((sum, hit) => sum + hit.value, 0);
    }

    function getTotalDamage() {
        return totalDamage;
    }

    function reset() {
        recentHits = [];
        totalDamage = 0;
    }

    window.DPSEngine = {
        registerHit,
        getCurrentDPS,
        getTotalDamage,
        reset
    };

})();
