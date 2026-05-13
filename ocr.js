// ocr.js
// Lightweight pixel-pattern OCR for floating damage numbers

(function () {

    // Canvas used for screen capture
    let capCanvas = null;
    let capCtx = null;

    // Canvas used for glyph extraction
    let glyphCanvas = null;
    let glyphCtx = null;

    // Damage number color thresholds (tunable)
    const COLOR_THRESHOLDS = {
        minBrightness: 180,   // bright text
        minSaturation: 40,    // avoid gray UI
        maxBackground: 80     // avoid dark backgrounds
    };

    // Predefined glyph templates (0–9)
    // Each template is a tiny binary matrix representing the digit shape
    // You can refine these later for your game's font
    const DIGIT_TEMPLATES = {
        "0": [
            "01110",
            "10001",
            "10001",
            "10001",
            "01110"
        ],
        "1": [
            "00100",
            "01100",
            "00100",
            "00100",
            "01110"
        ],
        "2": [
            "01110",
            "10001",
            "00010",
            "00100",
            "11111"
        ],
        "3": [
            "11110",
            "00001",
            "01110",
            "00001",
            "11110"
        ],
        "4": [
            "10010",
            "10010",
            "11111",
            "00010",
            "00010"
        ],
        "5": [
            "11111",
            "10000",
            "11110",
            "00001",
            "11110"
        ],
        "6": [
            "01110",
            "10000",
            "11110",
            "10001",
            "01110"
        ],
        "7": [
            "11111",
            "00010",
            "00100",
            "01000",
            "01000"
        ],
        "8": [
            "01110",
            "10001",
            "01110",
            "10001",
            "01110"
        ],
        "9": [
            "01110",
            "10001",
            "01111",
            "00001",
            "01110"
        ]
    };

    // ---- Initialize canvases ----
    function init() {
        if (!capCanvas) {
            capCanvas = document.createElement("canvas");
            capCtx = capCanvas.getContext("2d");
        }
        if (!glyphCanvas) {
            glyphCanvas = document.createElement("canvas");
            glyphCanvas.width = 20;
            glyphCanvas.height = 20;
            glyphCtx = glyphCanvas.getContext("2d");
        }
    }

    // ---- Capture screen region ----
    function captureRegion(x, y, w, h) {
        init();
        capCanvas.width = w;
        capCanvas.height = h;
        capCtx.drawImage(document.body, x, y, w, h, 0, 0, w, h);
        return capCtx.getImageData(0, 0, w, h);
    }

    // ---- Check if pixel is likely a damage number ----
    function isDamagePixel(r, g, b) {
        const brightness = (r + g + b) / 3;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const saturation = max - min;

        return (
            brightness > COLOR_THRESHOLDS.minBrightness &&
            saturation > COLOR_THRESHOLDS.minSaturation
        );
    }

    // ---- Extract glyph from region ----
    function extractGlyph(imgData, x, y) {
        glyphCtx.clearRect(0, 0, 20, 20);
        glyphCtx.putImageData(imgData, -x, -y);
        const data = glyphCtx.getImageData(0, 0, 20, 20).data;

        // Convert to binary matrix
        const matrix = [];
        for (let row = 0; row < 20; row++) {
            let line = "";
            for (let col = 0; col < 20; col++) {
                const idx = (row * 20 + col) * 4;
                const r = data[idx], g = data[idx+1], b = data[idx+2];
                line += isDamagePixel(r, g, b) ? "1" : "0";
            }
            matrix.push(line);
        }
        return matrix;
    }

    // ---- Match glyph to digit template ----
    function matchDigit(matrix) {
        let bestDigit = null;
        let bestScore = Infinity;

        for (const digit in DIGIT_TEMPLATES) {
            const template = DIGIT_TEMPLATES[digit];
            let score = 0;

            for (let r = 0; r < template.length; r++) {
                for (let c = 0; c < template[r].length; c++) {
                    const expected = template[r][c];
                    const actual = matrix[r][c];
                    if (expected !== actual) score++;
                }
            }

            if (score < bestScore) {
                bestScore = score;
                bestDigit = digit;
            }
        }

        return bestDigit;
    }

    // ---- Detect damage numbers ----
    function detectDamageNumbers() {
        init();

        const w = window.innerWidth;
        const h = window.innerHeight;

        const img = captureRegion(0, 0, w, h);
        const data = img.data;

        const results = [];

        // Scan for bright clusters (damage numbers)
        for (let y = 0; y < h; y += 4) {
            for (let x = 0; x < w; x += 4) {
                const idx = (y * w + x) * 4;
                const r = data[idx], g = data[idx+1], b = data[idx+2];

                if (isDamagePixel(r, g, b)) {
                    // Extract glyph
                    const glyph = extractGlyph(img, x, y);
                    const digit = matchDigit(glyph);

                    if (digit !== null) {
                        results.push({
                            value: parseInt(digit),
                            x,
                            y
                        });
                    }
                }
            }
        }

        return results;
    }

    // Expose globally
    window.OCR = {
        detectDamageNumbers
    };

})();
