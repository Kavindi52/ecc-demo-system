const API = "http://127.0.0.1:5000";

async function fetchAPI(endpoint, body) {
    try {
        const res = await fetch(API + endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        return await res.json();
    } catch (err) {
        return { status: "error", message: err.message };
    }
}

function showResult(elementId, data) {
    const el = document.getElementById(elementId);
    if (data.status === "error") {
        el.innerHTML = `<strong style="color:#f87171">Error:</strong> ${data.message}`;
        el.style.color = "#f87171";
        return;
    }

    let html = `<strong style="color:#86efac">Result:</strong><br>`;
    let resultX = null;
    let resultY = null;

    if (data.is_infinity !== undefined) {
        html += data.is_infinity 
            ? "∞ (Point at Infinity)" 
            : `(${data.x}, ${data.y})`;
        resultX = data.is_infinity ? null : data.x;
        resultY = data.is_infinity ? null : data.y;
    } else if (data.shared_secret) {
        html += `Alice Public: (${data.public_alice.x}, ${data.public_alice.y})<br>`;
        html += `Bob Public: (${data.public_bob.x}, ${data.public_bob.y})<br>`;
        html += `Shared Secret: (${data.shared_secret.x}, ${data.shared_secret.y})`;
        // Show shared secret on the graph
        resultX = data.shared_secret.x;
        resultY = data.shared_secret.y;
    } else {
        html += data.x === null ? "∞" : `(${data.x}, ${data.y})`;
        resultX = data.x;
        resultY = data.y;
    }

    el.innerHTML = html;
    el.style.color = "#e2e8f0";

    // Update visualization if function exists
    if (window.updateVisualization) {
        window.updateVisualization(resultX, resultY);
    }
}

async function addPoints() {
    const body = {
        a: document.getElementById("a").value,
        b: document.getElementById("b").value,
        p: document.getElementById("p").value,
        x1: document.getElementById("x1").value || null,
        y1: document.getElementById("y1").value || null,
        x2: document.getElementById("x2").value || null,
        y2: document.getElementById("y2").value || null
    };
    const data = await fetchAPI("/api/point_add", body);
    showResult("addResult", data);
}

async function multiplyPoint() {
    const body = {
        a: document.getElementById("a").value,
        b: document.getElementById("b").value,
        p: document.getElementById("p").value,
        x: document.getElementById("mx").value,
        y: document.getElementById("my").value,
        k: document.getElementById("k").value
    };
    const data = await fetchAPI("/api/point_multiply", body);
    showResult("mulResult", data);
}

async function runECDH() {
    const body = {
        a: document.getElementById("a").value,
        b: document.getElementById("b").value,
        p: document.getElementById("p").value,
        gx: document.getElementById("gx").value,
        gy: document.getElementById("gy").value,
        private_a: document.getElementById("priv_a").value,
        private_b: document.getElementById("priv_b").value
    };
    const data = await fetchAPI("/api/ecdh", body);
    showResult("ecdhResult", data);
}

function loadExample() {
    document.getElementById("a").value = 0;
    document.getElementById("b").value = 7;
    document.getElementById("p").value = 17;
    document.getElementById("x1").value = 1;
    document.getElementById("y1").value = 5;
    document.getElementById("x2").value = 2;
    document.getElementById("y2").value = 7;
    document.getElementById("mx").value = 1;
    document.getElementById("my").value = 5;
    document.getElementById("k").value = 3;
    document.getElementById("gx").value = 1;
    document.getElementById("gy").value = 5;
    document.getElementById("priv_a").value = 3;
    document.getElementById("priv_b").value = 5;

    // Trigger redraw of curve with new parameters
    if (window.drawCurve) {
        window.drawCurve();
    }

    alert("Toy example loaded! You can now click any operation button.");
}