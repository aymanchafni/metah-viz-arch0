
from optimizer import Optimizer


class Random(Optimizer):

    def __init__(self, fx, constraints, method, iter_method, nb_iter, nb_iter_1exec, epsilon=0.01) -> None:
        super().__init__(fx, constraints, method, iter_method, nb_iter, nb_iter_1exec, epsilon)

