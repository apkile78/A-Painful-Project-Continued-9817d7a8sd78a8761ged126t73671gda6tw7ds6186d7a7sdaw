// enemyHealthEstimator.js

(function () {

    // Basic HP lookup table.
    // You can expand this later when you add real enemy detection.
    const HP_TABLE = {
        "grunt": 100,
        "elite": 300,
        "boss": 5000
    };

    // Estimate remaining HP based on signature + total damage dealt.
    function estimate(signature, dmg) {
        const base = HP_TABLE[signature] || null;
        if (!base) return null;
        return base - dmg;
    }

    window.EnemyHealthEstimator = { estimate };

})();
