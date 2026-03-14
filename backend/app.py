from flask import Flask, request, jsonify
from flask_cors import CORS
from elliptic_curve import EllipticCurve, Point

app = Flask(__name__)
CORS(app)

@app.route('/api/point_add', methods=['POST'])
def point_add():
    try:
        data = request.get_json()
        curve = EllipticCurve(
            int(data['a']),
            int(data['b']),
            int(data['p'])
        )
        p1 = Point(
            int(data['x1']) if data['x1'] not in [None, "", "null"] else None,
            int(data['y1']) if data['y1'] not in [None, "", "null"] else None,
            curve
        )
        p2 = Point(
            int(data['x2']) if data['x2'] not in [None, "", "null"] else None,
            int(data['y2']) if data['y2'] not in [None, "", "null"] else None,
            curve
        )
        result = p1 + p2
        return jsonify({
            "status": "success",
            "x": result.x,
            "y": result.y,
            "is_infinity": result.x is None
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})


@app.route('/api/point_multiply', methods=['POST'])
def point_multiply():
    try:
        data = request.get_json()
        curve = EllipticCurve(
            int(data['a']),
            int(data['b']),
            int(data['p'])
        )
        point = Point(
            int(data['x']),
            int(data['y']),
            curve
        )
        scalar = int(data['k'])
        result = point * scalar
        return jsonify({
            "status": "success",
            "x": result.x,
            "y": result.y,
            "is_infinity": result.x is None
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})


@app.route('/api/ecdh', methods=['POST'])
def ecdh():
    try:
        data = request.get_json()
        curve = EllipticCurve(
            int(data['a']),
            int(data['b']),
            int(data['p'])
        )
        G = Point(
            int(data['gx']),
            int(data['gy']),
            curve
        )
        priv_a = int(data['private_a'])
        priv_b = int(data['private_b'])

        pub_a = priv_a * G
        pub_b = priv_b * G
        shared = priv_a * pub_b   # = priv_b * pub_a

        return jsonify({
            "status": "success",
            "public_alice":  {"x": pub_a.x,  "y": pub_a.y},
            "public_bob":    {"x": pub_b.x,  "y": pub_b.y},
            "shared_secret": {"x": shared.x, "y": shared.y}
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)