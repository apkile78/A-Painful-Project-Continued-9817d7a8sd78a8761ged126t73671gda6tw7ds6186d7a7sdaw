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
        <iframe src="${url}" style="width:100vw; height:100vh; border:none;"></iframe>
    `);
    win.document.close();
};

// ===============================
// VIEW POPUP (VEW)
// ===============================
document.getElementById("vtprBtn").onclick = () => {
    const url = currentUrl || urlInput.value.trim();
    if (!url) return;

    const win = window.open("about:blank", "_blank");
    if (!win) return;

    win.document.write(`
        <iframe src="${url}" style="width:100vw; height:100vh; border:none;"></iframe>
    `);
    win.document.close();
};

// ===============================
// ABOUT:BLANK POPUP
// ===============================
document.getElementById("abtBtn").onclick = () => {
    window.open("about:blank", "_blank");
};

// ===============================
// BLOB POPUP
// ===============================
document.getElementById("blbBtn").onclick = () => {
    const blob = new Blob([
        "<html><body style='background:black;'></body></html>"
    ], { type: "text/html" });

    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
};

// ===============================
// EXPORT GLOBAL
// ===============================
window.loadURL = loadURL;
