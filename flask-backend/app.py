
from flask import Flask, request, jsonify
from flask_cors import CORS

from data import SignalFlowGraphSolverMarshaller
from sfg import SignalFlowGraphSolver
from routh import routh_stability_analysis ,solve_polynomial

app = Flask(__name__)
CORS(app)


@app.route('/sfg', methods=['POST'])
def solve_sfg():
    try:
        if not request.is_json:
            return jsonify({"error": "Request must be JSON"}), 400

        data = request.get_json()

        sfg_input = SignalFlowGraphSolverMarshaller.marshall_input(data)
        sfg_solver = SignalFlowGraphSolver(**sfg_input)
        sfg_solver.solve()
        output = SignalFlowGraphSolverMarshaller.marshall_output(sfg_solver.result())
        return jsonify(output), 200

    except Exception as e:
        return jsonify({"error": e}), 500


@app.route('/routh', methods=['POST'])
def solve_routh():
    polynomial = request.json['polynomial'].replace(" ", "")
    stable, sign_changes, routh, aux_poly_num = routh_stability_analysis(polynomial)
    positive_real, negative_real, zero_real = solve_polynomial(polynomial)
    routh = [[round(value, 2) for value in row] for row in routh]
    Jw_axis_coeffs = aux_poly_num
    RHS_coeffs = sign_changes
    LHS_coeffs = len(routh) - Jw_axis_coeffs - RHS_coeffs - 1
    if Jw_axis_coeffs != 0:
        stable = 'Marginally Stable'
    else:
        stable = 'Stable' if RHS_coeffs == 0 else 'Unstable'
    return jsonify(
        {
        'LHS_roots': negative_real,
        'RHS_roots': positive_real,
        'Jw_axis_roots': zero_real,
        'stable': stable,
        'RHS_roots_num': RHS_coeffs,
        'LHS_roots_num': LHS_coeffs,
        'Jw_axis_roots_num': Jw_axis_coeffs,
        'routh': routh
     }
    )


if __name__ == '__main__':
    app.run(debug=True, port=5000)