// ===============================
// CORE VIEWER + POPUP SYSTEM
// ===============================

let currentUrl = "";
const viewer = document.getElementById("viewer");
const urlInput = document.getElementById("urlInput");

// ===============================
// MAIN GO BUTTON
// ===============================
document.getElementById("goBtn").onclick = () => {
    const url = urlInput.value.trim();
    if (!url) return;
    loadURL(url);
};

// ===============================
// LOAD URL INTO VIEWER
// ===============================
function loadURL(url) {
    currentUrl = url;

    const mode = document.querySelector(".modeBtn.active").dataset.mode;

    if (mode === "iframe") {
        viewer.innerHTML = `<iframe src="${url}" style="width:100%; height:100%; border:none;"></iframe>`;
    } else if (mode === "object") {
        viewer.innerHTML = `<object data="${url}" style="width:100%; height:100%; border:none;"></object>`;
    } else if (mode === "embed") {
        viewer.innerHTML = `<embed src="${url}" style="width:100%; height:100%; border:none;"></embed>`;
    }
}

// ===============================
// MODE SWITCHING
// ===============================
document.querySelectorAll(".modeBtn").forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll(".modeBtn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        if (currentUrl) loadURL(currentUrl);
    };
});

// ===============================
// POPUP BUTTON (POPT)
// ===============================
document.getElementById("clckBtn").onclick = () => {
    const url = currentUrl || urlInput.value.trim();
    if (!url) return;

    const win = window.open("about:blank", "_blank");
    if (!win) return;

    win.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Popup</title>
        </head>
        <body style="margin:0; padding:0; background:black;">
            <iframe src="${url}" style="width:100vw; height:100vh; border:none;"></iframe>
        </body>
        </html>
    `);
    win.document.close();

    PluginInjector.injectIntoBlobWindow(win);
};

// ===============================
// VIEW POPUP (VEW) — FULLY FIXED
// ===============================
document.getElementById("vtprBtn").onclick = () => {
    // ⭐ REAL FIX: Always use a valid URL
    const url = currentUrl || urlInput.value.trim();
    if (!url) return;

    const win = window.open("about:blank", "_blank");
    if (!win) return;

    win.document.open();
    win.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Viewer</title>
        </head>
        <body style="margin:0; padding:0; background:black;">
            <iframe src="${url}" style="width:100vw; height:100vh; border:none;"></iframe>
        </body>
        </html>
    `);
    win.document.close();

    // ⭐ Inject AFTER the iframe is fully written
    setTimeout(() => {
        PluginInjector.injectPlugins(win);
    }, 50);
};

// ===============================
// ABOUT:BLANK POPUP
// ===============================
document.getElementById("abtBtn").onclick = () => {
    const win = window.open("about:blank", "_blank");
    if (!win) return;

    PluginInjector.injectPlugins(win);
};

// ===============================
// BLOB POPUP
// ===============================
document.getElementById("blbBtn").onclick = () => {
    const blob = new Blob([
        "<!DOCTYPE html><html><body style='background:black;'></body></html>"
    ], { type: "text/html" });

    const url = URL.createObjectURL(blob);

    const win = window.open(url, "_blank");
    if (!win) return;

    PluginInjector.injectIntoBlobWindow(win);
};

// ===============================
// EXPORT GLOBAL
// ===============================
window.loadURL = loadURL;
