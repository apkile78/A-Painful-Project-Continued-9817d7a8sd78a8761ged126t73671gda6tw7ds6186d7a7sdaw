// ===============================
// CORE VIEWER + POPUP LOGIC
// ===============================

const urlInput = document.getElementById("urlInput");
const viewer = document.getElementById("viewer");

let embedMode = "iframe";
let popupMode = "about";
let currentUrl = "";
let coreEl = null;

// EMBED MODE SWITCHING
document.querySelectorAll(".modeBtn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".modeBtn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        embedMode = btn.dataset.mode;
        if (currentUrl) updateViewer(currentUrl);
    });
});

// VIEWER UPDATE
function updateViewer(url) {
    currentUrl = url;

    if (!url) {
        viewer.innerHTML = "";
        coreEl = null;
        return;
    }

    if (!coreEl) {
        coreEl = document.createElement("iframe");
        coreEl.style.width = "100%";
        coreEl.style.height = "100%";
        coreEl.style.border = "none";
        viewer.innerHTML = "";
        viewer.appendChild(coreEl);
    }

    if (embedMode === "iframe" && coreEl.tagName !== "IFRAME") {
        const newEl = document.createElement("iframe");
        copyCoreProps(coreEl, newEl);
        coreEl.replaceWith(newEl);
        coreEl = newEl;
    } else if (embedMode === "object" && coreEl.tagName !== "OBJECT") {
        const newEl = document.createElement("object");
        copyCoreProps(coreEl, newEl);
        newEl.type = "text/html";
        coreEl.replaceWith(newEl);
        coreEl = newEl;
    } else if (embedMode === "embed" && coreEl.tagName !== "EMBED") {
        const newEl = document.createElement("embed");
        copyCoreProps(coreEl, newEl);
        newEl.type = "text/html";
        coreEl.replaceWith(newEl);
        coreEl = newEl;
    }

    if (embedMode === "iframe" || embedMode === "embed") {
        coreEl.src = url;
    } else {
        coreEl.data = url;
    }
}

function copyCoreProps(oldEl, newEl) {
    newEl.style.cssText = oldEl.style.cssText;
    if (oldEl.src) newEl.src = oldEl.src;
    if (oldEl.data) newEl.data = oldEl.data;
}

// LOAD SITE
function loadSite() {
    let url = urlInput.value.trim();
    if (!url) return;

    if (!url.startsWith("http")) url = "https://" + url;
    updateViewer(url);
}

document.getElementById("goBtn").onclick = loadSite;

document.addEventListener("keydown", e => {
    if (e.key === "Enter") loadSite();
});

// POPUP MODE TOGGLE
const abtBtn = document.getElementById("abtBtn");
const blbBtn = document.getElementById("blbBtn");

abtBtn.onclick = () => {
    popupMode = "about";
    abtBtn.classList.add("active");
    blbBtn.classList.remove("active");
};

blbBtn.onclick = () => {
    popupMode = "blob";
    blbBtn.classList.add("active");
    abtBtn.classList.remove("active");
};

// POPUP (popt)
document.getElementById("clckBtn").onclick = () => {
    const navUrl = location.origin + location.pathname;

    const popupHTML = `
<style>
html, body { margin: 0; padding: 0; background: #000; overflow: hidden; }
iframe { width: 100vw; height: 100vh; border: none; }
</style>
<iframe src="${navUrl}"></iframe>
`;

    if (popupMode === "about") {
        const win = window.open("about:blank", "_blank");
        if (win) {
            win.document.write(popupHTML);
            win.document.close();
        }
    } else {
        const blob = new Blob([popupHTML], { type: "text/html" });
        window.open(URL.createObjectURL(blob), "_blank");
    }
};

// VIEW POPUP (vew) — FIXED TO MATCH EMBED MODE
document.getElementById("vtprBtn").onclick = () => {
    let url = currentUrl || urlInput.value.trim();
    if (!url) return;

    if (!url.startsWith("http")) url = "https://" + url;

    let embedHTML = "";

    if (embedMode === "iframe") {
        embedHTML = `<iframe src="${url}"></iframe>`;
    } 
    else if (embedMode === "object") {
        embedHTML = `<object data="${url}" type="text/html"></object>`;
    } 
    else if (embedMode === "embed") {
        embedHTML = `<embed src="${url}" type="text/html"></embed>`;
    }

    const popupHTML = `
<style>
html, body { margin: 0; padding: 0; background: #000; overflow: hidden; }
iframe, object, embed { width: 100vw; height: 100vh; border: none; }
</style>
${embedHTML}
`;

    if (popupMode === "about") {
        const win = window.open("about:blank", "_blank");
        if (win) {
            win.document.write(popupHTML);
            win.document.close();
        }
    } else {
        const blob = new Blob([popupHTML], { type: "text/html" });
        window.open(URL.createObjectURL(blob), "_blank");
    }
};
