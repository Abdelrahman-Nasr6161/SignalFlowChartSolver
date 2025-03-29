from flask import Flask, request, jsonify
from flask_cors import CORS

from sfg import SignalFlowGraphSolver, Marshaller

app = Flask(__name__)
CORS(app)


@app.route('/sfg', methods=['POST'])
def solve():
    try:
        if not request.is_json:
            return jsonify({"error": "Request must be JSON"}), 400

        data = request.get_json()

        sfg_input = Marshaller.marshall_input(data)
        sfg_solver = SignalFlowGraphSolver(**sfg_input)
        output = Marshaller.marshall_output(sfg_solver.result())
        return jsonify(output), 200

    except Exception as e:
        return jsonify({"error": e}), 500


if __name__ == '__main__':
    app.run(debug=True, port=8080)