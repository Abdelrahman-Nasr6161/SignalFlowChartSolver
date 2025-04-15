import networkx as nx
import sympy as sp
from marshmallow import ValidationError
from data.schema import SignalFlowGraphSolverSchema

class SignalFlowGraphSolverMarshaller:
    schema = SignalFlowGraphSolverSchema()

    @staticmethod
    def marshall_input(data):
        try:
            validated_data = SignalFlowGraphSolverMarshaller.schema.load(data)
        except ValidationError as e:
            raise ValueError(f'Invalid input data: {e.messages}')

        G = nx.MultiDiGraph()
        G.add_edges_from([(e['source'], e['target'], {'key': e['id'], 'gain': sp.sympify(e['label'])}) for e in
                          validated_data['edges']])
        return {
            'G': G,
            'input_node': validated_data['inputNode'],
            'output_node': validated_data['outputNode']
        }

    @staticmethod
    def marshall_output(result):
        return {
            'forward_paths': [forward_path.nodes for forward_path in result['forward_paths']],
            'loops': [loop.nodes for loop in result['loops']],
            'non_touching_loops': {k: [[loop.nodes for loop in k_non_touching_loops_combination]
                                       for k_non_touching_loops_combination in k_non_touching_loops_combinations]
                                   for k, k_non_touching_loops_combinations in result['non_touching_loops'].items()},
            'determinants': [sp.latex(determinant) for determinant in result['determinants']],
            'transfer_function': sp.latex(result['transfer_function'])
        }