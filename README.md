# ECC Demo System

Interactive Elliptic Curve Cryptography (ECC) demonstration project with visualization.

Shows basic ECC operations (point addition, scalar multiplication) and real ECDH key exchange.  
All math is implemented from scratch in pure Python (no external crypto libraries).  
Frontend uses only HTML + CSS + JavaScript + Canvas (no frameworks, no build step).

## Features

- Custom elliptic curve definition: y² = x³ + ax + b mod p
- Point addition (P + Q)
- Scalar multiplication (k × P)
- ECDH key exchange simulation (Alice ↔ Bob shared secret)
- Visual curve plot:
  - Blue line → continuous approximation over real numbers
  - Dark dots → actual points on the curve over finite field 𝔽ₚ
  - Red highlighted point → current computation result
- Toy example pre-filled (a=0, b=7, p=17)
- Responsive, dark-themed UI

### Project Folder Structure
```bash
ecc-demo-system/
├── backend/
│   ├── app.py                  # Flask API server
│   ├── elliptic_curve.py       # ECC math classes (Curve + Point)
│   └── requirements.txt
├── frontend/
│   ├── index.html              # Main page
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── script.js           # API calls + UI logic
│       └── visualize.js        # Canvas drawing logic
└── README.md                   # ← This file
text## Prerequisites
```
- Python 3.8 or newer
- Modern web browser (Chrome, Edge, Firefox, etc.)
- No Node.js, npm, React, Vite, etc. required

## Installation & Running

### 1. Backend setup

```bash
cd backend
pip install -r requirements.txt

# or
pip3 install -r requirements.txt
```
### 2. Start the backend server
```Bash
 python app.py
# or
python3 app.py
```
You should see:
text* Running on http://127.0.0.1:5000
→ Keep this terminal open the whole time.

### 3. Open the frontend

Go to frontend/ folder
Double-click index.html
or drag it into browser
or right-click → Open with → Chrome/Edge/Firefox

### 4. Quick test

Click Load Toy Example (p=17)
Click any operation button:
Add Points →
k × Point →
Compute Keys & Shared Secret

See result in text box + red point update on the graph

#### Important Notes

"Failed to fetch" error → most common issue

→ Make sure backend terminal is still open and running
→ Open http://127.0.0.1:5000/ in browser → should show "ECC Demo API is running ✓"
→ If port 5000 is blocked, change port in app.py to 5001 and update API_BASE in script.js
Small primes (p=17, 19, 23, 29…) work best for visualization

Large p makes plotting very slow
Infinity point (∞) is mathematically correct — not an error

#### Example Results (toy curve: y² = x³ + 7 mod 17)

(1,5) + (2,7) → (6,3)
3 × (1,5) → (13,1)
ECDH:
G = (1,5)
Alice private = 3 → public = (13,1)
Bob private = 5 → public = (10,6)
Shared secret = (7,11)


ProblemQuick fixButtons do nothingBackend not running → restart python app.pyFailed to fetch / network errorCheck terminal, visit http://127.0.0.1:5000/, try different browserNo red point on canvasResult is ∞ or invalid point → try different inputsCanvas empty / no dotsUse small p (≤ 50), reload after changing parametersCORS errorShould not happen (flask-cors is used) — refresh or restart backend
Tech Stack

Backend: Python 3 + Flask + pure math
Frontend: HTML5 + CSS + JavaScript + Canvas
No dependencies for frontend
No cryptography libraries (learning purpose only)

#### License
MIT License – free to use, modify, share for education.
