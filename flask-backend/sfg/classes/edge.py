from typing import Hashable

from sympy import Expr


class Edge:
    def __init__(self, start: str, end: str, gain: Expr, key: Hashable) -> None:
        self.start = start
        self.end = end
        self.gain = gain
        self.key = key

    def __eq__(self, other) -> bool:
        return self.start == other.start and self.end == other.end and self.gain == other.gain and self.key == other.key

    def __hash__(self) -> int:
        return hash((self.start, self.end, self.gain, self.key))

    def __iter__(self):
        yield self.start
        yield self.end
        yield self.gain
        yield self.key