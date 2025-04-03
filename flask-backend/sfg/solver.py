import itertools as it
import math as m

import networkx as nx
import sympy as sp

from sfg.classes import Edge, Path, ForwardPath


class SignalFlowGraphSolver:
    def __init__(self, G: nx.MultiDiGraph, input_node: str, output_node: str) -> None:
        self.__input_node = input_node
        self.__output_node = output_node
        self.__forward_paths: list[ForwardPath] = []
        self.__loops: set[Path] = set()
        self.__non_touching_loops: dict[int, list[list[Path]]] = {}
        self.__system_determinant: sp.Expr | None = None
        self.__transfer_function: sp.Expr | None = None
        self.__G = G

    @staticmethod
    def __unique(l: list[list]) -> list[list]:
        return [list(x) for x in set(tuple(x) for x in l)]

    @staticmethod
    def __are_non_touching(*paths_nodes: list[str]) -> bool:
        return all(set(path_nodes1).isdisjoint(set(path_nodes2)) for path_nodes1, path_nodes2 in
                   it.combinations(paths_nodes, 2))

    @staticmethod
    def __get_path_gain(path: Path) -> sp.Expr:
        return sp.Mul(*(edge.gain for edge in path.edges))

    def __generate_edge_paths(self, node_path):
        keys_list = []
        for u, v in zip(node_path[:-1], node_path[1:]):
            keys_list.append(list(self.__G[u][v].keys()))

        for keys in it.product(*keys_list):
            edge_path = [Edge(u, v, self.__G[u][v][k]['gain'], k)
                         for u, v, k in zip(node_path[:-1], node_path[1:], keys)]
            yield edge_path

    def __generate_simple_paths_list(self) -> list[list]:
        return self.__unique(list(nx.all_simple_paths(self.__G, self.__input_node, self.__output_node)))

    def __generate_simple_cycles_list(self) -> list[list]:
        return self.__unique(list(nx.simple_cycles(self.__G)))

    def __get__forward_paths(self) -> None:
        forward_paths_nodes = self.__generate_simple_paths_list()
        for forward_path_nodes in forward_paths_nodes:
            for edge_path in self.__generate_edge_paths(forward_path_nodes):
                self.__forward_paths.append(ForwardPath(forward_path_nodes, edge_path))

    def __get_loops(self) -> None:
        simple_cycles_nodes = self.__generate_simple_cycles_list()
        for simple_cycle_nodes in simple_cycles_nodes:
            simple_cycle_nodes.append(simple_cycle_nodes[0])
            for edge_path in self.__generate_edge_paths(simple_cycle_nodes):
                self.__loops.add(Path(simple_cycle_nodes, edge_path))

    def __get_all_non_touching_loops(self) -> None:
        for k in range(2, len(self.__forward_paths) + 1):
            self.__get_all_k_non_touching_loops(k)

    def __get_all_k_non_touching_loops(self, k: int) -> None:
        k_non_touching_loops = [list(combination) for combination in it.combinations(self.__loops, k)
                                if self.__are_non_touching(*(c.nodes for c in combination))]
        if k_non_touching_loops:
            self.__non_touching_loops[k] = k_non_touching_loops

    def __get_gains(self) -> None:
        self.__get_paths_gains(self.__forward_paths)
        self.__get_paths_gains(self.__loops)

    def __get_paths_gains(self, paths: list[Path] | set[Path]) -> None:
        for path in paths:
            path.gain = self.__get_path_gain(path)

    def __get_determinant(self, exclude_nodes: list[str]) -> sp.Expr:
        sign = 1
        determinant = 1 - sum(loop.gain for loop in self.__loops
                              if self.__are_non_touching(loop.nodes, exclude_nodes))

        for k_non_touching_loops_combinations in self.__non_touching_loops.values():
            for k_non_touching_loops_combination in k_non_touching_loops_combinations:
                if all(self.__are_non_touching(exclude_nodes, loop.nodes)
                       for loop in k_non_touching_loops_combination):
                    determinant += sign * m.prod(loop.gain for loop in k_non_touching_loops_combination)
            sign *= -1

        return determinant

    def __get_system_determinant(self) -> None:
        self.__system_determinant = self.__get_determinant([])

    def __get_forward_paths_determinants(self) -> None:
        for forward_path in self.__forward_paths:
            forward_path.determinant = self.__get_determinant(forward_path.nodes)

    def __get__determinants(self) -> None:
        self.__get_system_determinant()
        self.__get_forward_paths_determinants()

    def __get_transfer_function(self) -> None:
        self.__transfer_function = sp.S(1) / self.__system_determinant * sum(
            forward_path.gain * forward_path.determinant for forward_path
            in self.__forward_paths)

    def result(self) -> dict:
        return {
            'forward_paths': self.__forward_paths.copy(),
            'loops': self.__loops.copy(),
            'non_touching_loops': self.__non_touching_loops.copy(),
            'system_determinant': self.__system_determinant.copy(),
            'determinant': [forward_path.determinant for forward_path in self.__forward_paths.copy()],
            'transfer_function': self.__transfer_function.copy()
        }

    def solve(self) -> None:
        self.__get__forward_paths()
        self.__get_loops()
        self.__get_all_non_touching_loops()
        self.__get_gains()
        self.__get__determinants()
        self.__get_transfer_function()