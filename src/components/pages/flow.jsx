import React, { useEffect, useState, useCallback } from "react";
import {
  Background,
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  Panel,
  isNode,
  isEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "@fontsource/inter";
import CustomCircularNode from "../CircleNode";
import WeightedEdge from "../weightedEdge"; // Import the custom edge component
import ButtonGroup from "@mui/joy/ButtonGroup";
import IconButton from "@mui/joy/IconButton";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

function FlowForm() {
  const nodeTypes = {
    custom: CustomCircularNode,
  };
  const edgeTypes = {
    customEdge: WeightedEdge,
  };

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [rfInstance, setRfInstance] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [elementName, setElementName] = useState("");
  const [nodeCounter, setNodeCounter] = useState(0);

  const getNodeId = () => `randomnode_${+new Date()}`;

  const onConnect = (params) => {
    const newEdge = {
      ...params,
      id: `e-${params.source}-->${params.target}`,
      type: "customEdge",
      data: { label: "1" },
    };
    setEdges((eds) => addEdge(newEdge, eds));
  };

  const onAdd = useCallback(() => {
    const newNode = {
      id: getNodeId(),
      type: "custom",
      data: { label: `Node ${nodeCounter}` },
      position: {
        x: (Math.random() - 0.5) * 400,
        y: (Math.random() - 0.5) * 400,
      },
    };
    setNodeCounter((nodeCounter) => nodeCounter + 1);
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes, setNodeCounter, nodeCounter]);

  const onDelete = (nodeId) => {
    setNodeCounter((nodeCounter) => Math.max(nodes.length - 1, 0));
    setNodes((nodes) => nodes.filter((n) => n.id !== nodeId));
    setEdges((edges) => edges.filter((e) => e.source !== nodeId && e.target !== nodeId));
  };

  const onElementClick = (event, element) => {
    setSelectedElement(element);
    setElementName(element.data?.label || "");
  };

  useEffect(() => {
    if (!selectedElement) return;

    // console.log(nodes, edges);

    if (isNode(selectedElement)) {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === selectedElement.id
            ? {
                ...node,
                data: {
                  ...node.data,
                  label: elementName || "",
                },
              }
            : node
        )
      );
    } else if (isEdge(selectedElement)) {
      setEdges((eds) =>
        eds.map((edge) =>
          edge.id === selectedElement.id
            ? {
                ...edge,
                data: {
                  ...edge.data,
                  label: elementName || " ",
                },
              }
            : edge
        )
      );
    }
  }, [elementName, selectedElement, setNodes, setEdges]);

  return (
    <ReactFlow
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={onElementClick}
      onEdgeClick={onElementClick}
      onInit={setRfInstance}
      fitView
      fitViewOptions={{ padding: 2 }}
      style={{ backgroundColor: "#191724" }}
    >
      <Background />

      {selectedElement && (
        <div
          className="update-element-name"
          style={{
            position: "absolute",
            right: "20px",
            top: "60px",
            zIndex: "4",
            fontSize: "12px",
          }}
        >
          <h3 style={{ color: "white" }}>
            {isNode(selectedElement) ? "Edit Node Name" : "Edit Edge Value"}
          </h3>

          <input
            type="text"
            value={elementName}
            onChange={(evt) => setElementName(evt.target.value)}
            style={{
              padding: "8px",
              fontSize: "12px",
              textAlign: "center",
              borderRadius: "4px",
              border: "none",
              outline: "none",
            }}
          />
        </div>
      )}

      <Panel position="top-center">
        <ButtonGroup
          variant="soft"
          sx={{
            bgcolor: "#31748f",
            "--ButtonGroup-radius": "20px",
          }}
        >
          <IconButton onClick={onAdd}>
            <AddIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              if (isNode(selectedElement)) {
                onDelete(selectedElement.id);
              }
            }}
          >
            <DeleteIcon />
          </IconButton>
        </ButtonGroup>
      </Panel>
    </ReactFlow>
  );
}

export default FlowForm;
