from marshmallow import Schema


class SignalFlowGraphSchema(Schema):
    pass


class Marshaller:
    schema = SignalFlowGraphSchema()

    @staticmethod
    def marshall_input(data):
        pass

    @staticmethod
    def marshall_output(result):
        pass