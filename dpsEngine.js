// dpsEngine.js

(function () {

    // Rolling damage events for the last 1000ms
    // Each entry: { value, time }
    let recentHits = [];

    // Total damage for the entire session
    let totalDamage = 0;

    // DPS window size
    const WINDOW = 1000; // 1 second

    // ---- Add a damage event ----
    // dmg = { value, x, y }
    function registerHit(dmg) {
        const now = performance.now();

        // Add to rolling list
        recentHits.push({ value: dmg.value, time: now });

        // Add to total session damage
        totalDamage += dmg.value;

        // Pass to EnemyTracker
        EnemyTracker.assignDamage(dmg);
    }

    // ---- Compute current DPS ----
    function getCurrentDPS() {
        const now = performance.now();

        // Remove hits older than 1 second
        while (recentHits.length > 0 && now - recentHits[0].time > WINDOW) {
            recentHits.shift();
        }

        // Sum remaining hits
        let sum = 0;
        for (const h of recentHits) {
            sum += h.value;
        }

        return sum;
    }

    // ---- Get total session damage ----
    function getTotalDamage() {
        return totalDamage;
    }

    // ---- Reset everything ----
    function reset() {
        recentHits = [];
        totalDamage = 0;
    }

    // Expose globally for DPS plugin
    window.DPSEngine = {
        registerHit,
        getCurrentDPS,
        getTotalDamage,
        reset
    };

})();
