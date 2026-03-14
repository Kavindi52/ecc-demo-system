def egcd(a, b):
    if a == 0:
        return b, 0, 1
    g, y, x = egcd(b % a, a)
    return g, x - (b // a) * y, y

def modinv(a, m):
    g, x, y = egcd(a, m)
    if g != 1:
        raise ValueError("No modular inverse")
    return x % m

class EllipticCurve:
    def __init__(self, a, b, p):
        self.a = a
        self.b = b
        self.p = p

    def is_on_curve(self, x, y):
        if x is None and y is None:
            return True
        return (y * y - x**3 - self.a * x - self.b) % self.p == 0

class Point:
    def __init__(self, x, y, curve):
        self.curve = curve
        self.x = x
        self.y = y
        if not curve.is_on_curve(x, y):
            raise ValueError(f"Point ({x}, {y}) not on curve")

    def __add__(self, other):
        if self.x is None:
            return other
        if other.x is None:
            return self
        p = self.curve.p
        if self.x == other.x and (self.y + other.y) % p == 0:
            return Point(None, None, self.curve)
        if self.x == other.x and self.y == other.y:
            if self.y == 0:
                return Point(None, None, self.curve)
            lam = (3 * self.x**2 + self.curve.a) * modinv(2 * self.y, p) % p
        else:
            lam = (other.y - self.y) * modinv(other.x - self.x, p) % p
        x3 = (lam**2 - self.x - other.x) % p
        y3 = (lam * (self.x - x3) - self.y) % p
        return Point(x3, y3, self.curve)

    def __mul__(self, scalar):
        if not isinstance(scalar, int):
            raise TypeError("Scalar must be integer")
        if scalar == 0:
            return Point(None, None, self.curve)
        result = Point(None, None, self.curve)
        addend = self
        while scalar > 0:
            if scalar % 2 == 1:
                result = result + addend
            addend = addend + addend
            scalar //= 2
        return result

    def __rmul__(self, scalar):
        return self.__mul__(scalar)