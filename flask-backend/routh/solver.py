import numpy as np
import sympy as sp


def routh_stability(polynomial):
    s = sp.Symbol('s')
    polynomial = polynomial.replace('^', '**')  # Allow ^ as power
    poly = sp.sympify(polynomial)
    coeffs = sp.Poly(sp.expand(poly), s).all_coeffs()
    coeffs = [float(c) for c in coeffs]
    coeffs = np.array(coeffs)
    coeffs /= coeffs[0]
    return coeffs


def routh_array(coeffs):
    n = len(coeffs) - 1  # Degree of polynomial
    rows = n + 1
    cols = int(np.ceil((n + 1) / 2))
    routh = np.zeros((rows, cols))
    aux_poly_num = 0
    # Fill first two rows
    routh[0, :len(coeffs[::2])] = coeffs[::2]
    routh[1, :len(coeffs[1::2])] = coeffs[1::2]

    for i in range(2, rows):
        if np.allclose(routh[i - 1], 0):  # Check if entire row is zero
            order = rows - 1
            print(f"Row {i} is all zeros, using auxiliary polynomial.")
            aux_poly_num += order - i + 2
            print(f"aux_poly_num: {aux_poly_num}")
            row_above = routh[i - 2]
            row_above = np.array(row_above)
            order = n - i + 2
            s = sp.Symbol('s')
            terms = []
            for j in range(len(row_above)):
                if row_above[j] != 0:
                    power = order - 2 * j
                    if power >= 0:
                        terms.append(row_above[j] * s ** power)

            aux_poly = sum(terms)
            derivative = sp.diff(aux_poly, s)
            derived_coeffs = sp.Poly(derivative, s).all_coeffs()
            derived_coeffs = np.array(derived_coeffs)
            derived_coeffs = derived_coeffs[np.abs(derived_coeffs) != 0.0]
            while len(derived_coeffs) < cols:
                derived_coeffs = np.append(derived_coeffs, 0)
            routh[i - 1] = derived_coeffs

        for j in range(cols - 1):
            a = routh[i - 2, 0]
            b = routh[i - 2, j + 1] if j + 1 < cols else 0
            c = routh[i - 1, 0]
            d = routh[i - 1, j + 1] if j + 1 < cols else 0

            if c == 0:
                c = 1e-6  # Avoid division by zero
                routh[i - 1, 0] = 1e-6

            routh[i, j] = ((c * b) - (a * d)) / c
    return routh, aux_poly_num


def routh_stability_analysis(polynomial):
    coeffs = routh_stability(polynomial)
    routh, aux_poly_num = routh_array(coeffs)
    filtered = [x for x in routh[:, 0] if not np.isclose(x, 0)]
    sign_changes = 0
    for i in range(1, len(filtered)):
        if np.sign(filtered[i]) != np.sign(filtered[i - 1]):
            sign_changes += 1
    if sign_changes > 0:
        return False, sign_changes, routh, aux_poly_num
    else:
        return True, sign_changes, routh, aux_poly_num