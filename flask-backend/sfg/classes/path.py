from typing import Any

from sympy import Expr
from sfg.classes import Edge


class Path:
    def __init__(self, nodes: list[str], edges: list[Edge]):
        self.nodes = nodes
        self.edges = edges
        self.gain: Expr | None = None

    def __eq__(self, other: Any) -> bool:
        return isinstance(other, Path) and self.edges == other.edges

    def __hash__(self) -> int:
        return hash(tuple(self.edges))


class ForwardPath(Path):
    def __init__(self, nodes: list[str], edges: list[Edge]):
        super().__init__(nodes, edges)
        self.determinant: Expr | None = None