// enemyHealthEstimator.js

(function () {
    const STORAGE_KEY = "d1app_enemy_hp_estimates_v1";

    // In‑memory cache of signature → stats
    // stats = { kills: number, totalDamage: number }
    let hpTable = {};

    // ---- Persistence ----
    function loadTable() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === "object") {
                hpTable = parsed;
            }
        } catch (e) {
            console.warn("EnemyHealthEstimator: failed to load table", e);
        }
    }

    function saveTable() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(hpTable));
        } catch (e) {
            console.warn("EnemyHealthEstimator: failed to save table", e);
        }
    }

    loadTable();

    // ---- Core API ----

    // Call this when an enemy dies and you know how much damage it took
    // signature: string (sprite hash / type id)
    // killDamage: number (total damage dealt to kill this instance)
    function recordKill(signature, killDamage) {
        if (!signature || !Number.isFinite(killDamage) || killDamage <= 0) return;

        let stats = hpTable[signature];
        if (!stats) {
            stats = { kills: 0, totalDamage: 0 };
            hpTable[signature] = stats;
        }

        stats.kills += 1;
        stats.totalDamage += killDamage;

        saveTable();
    }

    // Returns estimated HP (average damage to kill) or null if unknown
    function getEstimatedHP(signature) {
        const stats = hpTable[signature];
        if (!stats || stats.kills === 0) return null;
        return stats.totalDamage / stats.kills;
    }

    // Optional: expose raw stats for debugging/overlay
    function getStats(signature) {
        return hpTable[signature] || null;
    }

    // Optional: clear all learned data
    function resetAllEstimates() {
        hpTable = {};
        saveTable();
    }

    // Expose globally for the DPS plugin
    window.EnemyHealthEstimator = {
        recordKill,
        getEstimatedHP,
        getStats,
        resetAllEstimates
    };
})();
