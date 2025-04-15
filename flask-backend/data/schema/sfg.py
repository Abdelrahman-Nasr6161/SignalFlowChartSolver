from marshmallow import Schema, fields


class EdgeSchema(Schema):
    source = fields.String(required=True)
    target = fields.String(required=True)
    label = fields.String(required=True)
    id = fields.String(required=True)


class SignalFlowGraphSolverSchema(Schema):
    edges = fields.List(fields.Nested(EdgeSchema()), required=True)
    inputNode = fields.String(required=True)
    outputNode = fields.String(required=True)