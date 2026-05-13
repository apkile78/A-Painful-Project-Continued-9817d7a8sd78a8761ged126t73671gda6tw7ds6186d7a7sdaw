// ocr.js
// Complete pixel-pattern OCR with multi-digit grouping

(function () {

    let capCanvas = null;
    let capCtx = null;

    const DIGIT_SIZE = 20;
    const SCAN_STEP = 4;

    function init() {
        if (!capCanvas) {
            capCanvas = document.createElement("canvas");
            capCtx = capCanvas.getContext("2d");
        }
    }

    function capture() {
        init();
        const w = window.innerWidth;
        const h = window.innerHeight;
        capCanvas.width = w;
        capCanvas.height = h;
        capCtx.drawImage(document.body, 0, 0, w, h);
        return capCtx.getImageData(0, 0, w, h);
    }

    function isBright(r, g, b) {
        return (r + g + b) / 3 > 180;
    }

    function extractGlyph(img, gx, gy) {
        const w = img.width;
        const h = img.height;
        const data = img.data;

        const glyph = [];

        for (let y = 0; y < DIGIT_SIZE; y++) {
            let row = "";
            for (let x = 0; x < DIGIT_SIZE; x++) {
                const px = gx + x;
                const py = gy + y;
                if (px < 0 || py < 0 || px >= w || py >= h) {
                    row += "0";
                    continue;
                }
                const idx = (py * w + px) * 4;
                const r = data[idx], g = data[idx+1], b = data[idx+2];
                row += isBright(r, g, b) ? "1" : "0";
            }
            glyph.push(row);
        }

        return glyph;
    }

    const TEMPLATES = {
        "0": ["01110","10001","10001","10001","01110"],
        "1": ["00100","01100","00100","00100","01110"],
        "2": ["01110","10001","00010","00100","11111"],
        "3": ["11110","00001","01110","00001","11110"],
        "4": ["10010","10010","11111","00010","00010"],
        "5": ["11111","10000","11110","00001","11110"],
        "6": ["01110","10000","11110","10001","01110"],
        "7": ["11111","00010","00100","01000","01000"],
        "8": ["01110","10001","01110","10001","01110"],
        "9": ["01110","10001","01111","00001","01110"]
    };

    function matchDigit(glyph) {
        let best = null;
        let bestScore = Infinity;

        for (const d in TEMPLATES) {
            const tmpl = TEMPLATES[d];
            let score = 0;

            for (let y = 0; y < tmpl.length; y++) {
                for (let x = 0; x < tmpl[y].length; x++) {
                    if (glyph[y][x] !== tmpl[y][x]) score++;
                }
            }

            if (score < bestScore) {
                bestScore = score;
                best = d;
            }
        }

        return best;
    }

    function detectDigits() {
        const img = capture();
        const w = img.width;
        const h = img.height;
        const data = img.data;

        const digits = [];

        for (let y = 0; y < h; y += SCAN_STEP) {
            for (let x = 0; x < w; x += SCAN_STEP) {
                const idx = (y * w + x) * 4;
                const r = data[idx], g = data[idx+1], b = data[idx+2];

                if (isBright(r, g, b)) {
                    const glyph = extractGlyph(img, x, y);
                    const d = matchDigit(glyph);
                    if (d !== null) {
                        digits.push({ digit: d, x, y });
                    }
                }
            }
        }

        return digits;
    }

    function groupDigits(digits) {
        digits.sort((a, b) => a.x - b.x);

        const groups = [];
        let current = [];

        for (let i = 0; i < digits.length; i++) {
            const d = digits[i];

            if (current.length === 0) {
                current.push(d);
                continue;
            }

            const prev = current[current.length - 1];

            if (Math.abs(d.x - prev.x) < 25 && Math.abs(d.y - prev.y) < 20) {
                current.push(d);
            } else {
                groups.push(current);
                current = [d];
            }
        }

        if (current.length > 0) groups.push(current);

        const results = [];

        for (const g of groups) {
            const value = parseInt(g.map(d => d.digit).join(""));
            const avgX = g.reduce((s, d) => s + d.x, 0) / g.length;
            const avgY = g.reduce((s, d) => s + d.y, 0) / g.length;

            results.push({ value, x: avgX, y: avgY });
        }

        return results;
    }

    function detectDamageNumbers() {
        const digits = detectDigits();
        return groupDigits(digits);
    }

    window.OCR = { detectDamageNumbers };

})();
