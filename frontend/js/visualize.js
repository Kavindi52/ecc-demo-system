// visualize.js - Elliptic Curve visualization on canvas

const canvas = document.getElementById('eccCanvas');
if (!canvas) {
    console.warn("Canvas not found — visualization disabled");
} else {
    const ctx = canvas.getContext('2d');
    let currentResultPoint = null;  // {x, y} or null

    // Called after any successful operation that produces a single point
    window.updateVisualization = function(resultX, resultY) {
        if (resultX !== null && resultY !== null) {
            currentResultPoint = { x: Number(resultX), y: Number(resultY) };
        } else {
            currentResultPoint = null;
        }
        drawCurve();
    };

    function drawCurve() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const a = Number(document.getElementById('a').value);
        const b = Number(document.getElementById('b').value);
        const p = Number(document.getElementById('p').value);

        if (isNaN(a) || isNaN(b) || isNaN(p) || p <= 0) return;

        const width = canvas.width;
        const height = canvas.height;
        const padding = 40;
        const scaleX = (width - 2 * padding) / (p + 4);   // extra space left/right
        const scaleY = (height - 2 * padding) / (p + 4);
        const offsetX = padding + 2 * scaleX;             // center-ish
        const offsetY = height - padding - 2 * scaleY;

        // Light grid
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= p + 4; i++) {
            const px = offsetX + (i - 2) * scaleX;
            ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, height); ctx.stroke();
            const py = offsetY - (i - 2) * scaleY;
            ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(width, py); ctx.stroke();
        }

        // Draw continuous curve approximation (real numbers)
        ctx.strokeStyle = '#60a5fa';  // blue
        ctx.lineWidth = 2.5;

        // Upper half
        ctx.beginPath();
        let first = true;
        const step = 0.02;
        for (let xReal = -4; xReal <= p + 4; xReal += step) {
            const y2 = xReal**3 + a * xReal + b;
            if (y2 < 0) continue;
            const yReal = Math.sqrt(y2);
            const px = offsetX + xReal * scaleX;
            const py = offsetY - yReal * scaleY;
            if (first) { ctx.moveTo(px, py); first = false; }
            else { ctx.lineTo(px, py); }
        }
        ctx.stroke();

        // Lower half
        ctx.beginPath();
        first = true;
        for (let xReal = -4; xReal <= p + 4; xReal += step) {
            const y2 = xReal**3 + a * xReal + b;
            if (y2 < 0) continue;
            const yReal = Math.sqrt(y2);
            const px = offsetX + xReal * scaleX;
            const py = offsetY + yReal * scaleY;
            if (first) { ctx.moveTo(px, py); first = false; }
            else { ctx.lineTo(px, py); }
        }
        ctx.stroke();

        // All points on the curve mod p (black filled circles)
        ctx.fillStyle = '#0f172a';
        for (let x = 0; x < p; x++) {
            for (let y = 0; y < p; y++) {
                if ((y * y % p) === ((x**3 + a * x + b) % p)) {
                    const px = offsetX + x * scaleX;
                    const py = offsetY - y * scaleY;
                    ctx.beginPath();
                    ctx.arc(px, py, 5, 0, 2 * Math.PI);
                    ctx.fill();
                }
            }
        }

        // Point at infinity marker
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 24px Arial';
        ctx.fillText('∞', offsetX - 15, padding + 10);

        // Highlight the current result point (if any)
        if (currentResultPoint) {
            const rx = currentResultPoint.x % p;  // just in case
            const ry = currentResultPoint.y % p;
            const px = offsetX + rx * scaleX;
            const py = offsetY - ry * scaleY;

            // Bigger red circle
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.arc(px, py, 10, 0, 2 * Math.PI);
            ctx.fill();

            // White border
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(px, py, 10, 0, 2 * Math.PI);
            ctx.stroke();

            // Label
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 14px Arial';
            ctx.fillText(`(${rx}, ${ry})`, px + 14, py - 6);
        }
    }

    // Initial draw
    drawCurve();

    // Redraw when parameters change
    ['a', 'b', 'p'].forEach(id => {
        document.getElementById(id).addEventListener('input', drawCurve);
    });
}