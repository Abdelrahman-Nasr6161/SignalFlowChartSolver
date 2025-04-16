import React, { useEffect, useState, useCallback, useRef } from "react";
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
import {v4 as uuid4} from "uuid";
import "@xyflow/react/dist/style.css";
import "@fontsource/inter";
import CustomCircularNode from "../CircleNode";
import WeightedEdge from "../weightedEdge"; 
import ButtonGroup from "@mui/joy/ButtonGroup";
import IconButton from "@mui/joy/IconButton";
import Button from "@mui/joy/Button";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CalculateIcon from "@mui/icons-material/Calculate";
import CloseIcon from "@mui/icons-material/Close";
import InputIcon from "@mui/icons-material/Input";
import OutputIcon from "@mui/icons-material/Output";
import Alert from "@mui/joy/Alert";
import CircularProgress from "@mui/joy/CircularProgress";
import { MathJax } from "better-react-mathjax";

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
  const [nodeCounter, setNodeCounter] = useState(1);
  const [showSolution, setShowSolution] = useState(false);
  const [solution, setSolution] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getNodeById = (id) => {
    const node = nodes.find((node) => node.id === id)
    return node
  };

  // Input and output node selection
  const [inputNode, setInputNode] = useState(null);
  const [outputNode, setOutputNode] = useState(null);
  
  // Refs for detecting clicks outside panels
  const editPanelRef = useRef(null);
  const solutionPanelRef = useRef(null);

  const getNodeId = () => uuid4();

  const onConnect = (params) => {
    const newEdge = {
      ...params,
      id: uuid4(),
      type: "customEdge",
      data: { label: "1" },
    };
    setEdges((eds) => addEdge(newEdge, eds));
  };

  const onAdd = useCallback(() => {
    const newNode = {
      id: getNodeId(),
      type: "custom",
      data: { label: `x_${nodeCounter}` },
      position: {
        x: (Math.random() - 0.5) * 400,
        y: (Math.random() - 0.5) * 400,
      },
    };
    setNodeCounter((nodeCounter) => nodeCounter + 1);
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes, setNodeCounter, nodeCounter]);

  const onDelete = (nodeId) => {
    // Reset input/output node selections if the deleted node was selected
    if (inputNode === nodeId) {
      setInputNode(null);
    }
    if (outputNode === nodeId) {
      setOutputNode(null);
    }
    
    setNodeCounter((nodeCounter) => Math.max(nodes.length - 1, 0));
    setNodes((nodes) => nodes.filter((n) => n.id !== nodeId));
    setEdges((edges) => edges.filter((e) => e.source !== nodeId && e.target !== nodeId));
  };

  const onElementClick = (event, element) => {
    // Prevent deselection when clicking on already selected element
    event.stopPropagation();
    setSelectedElement(element);
    setElementName(element.data?.label || "");
  };

  // Update node styling based on input/output selection
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        let nodeStyle = {};
        
        if (node.id === inputNode && node.id === outputNode) {
          // Both input and output
          nodeStyle = { 
            border: '4px double #e5c07b',
            boxShadow: '0 0 10px #e5c07b'
          };
        } else if (node.id === inputNode) {
          // Input node
          nodeStyle = { 
            border: '3px solid #98c379',
            boxShadow: '0 0 8px #98c379'
          };
        } else if (node.id === outputNode) {
          // Output node
          nodeStyle = { 
            border: '3px solid #e06c75',
            boxShadow: '0 0 8px #e06c75'
          };
        }
        
        return {
          ...node,
          data: {
            ...node.data,
            style: nodeStyle
          },
        };
      })
    );
  }, [inputNode, outputNode, setNodes]);

  // Function to handle the solve action with backend integration
  const handleSolve = async () => {
    // Validate that both input and output nodes are selected
    if (!inputNode || !outputNode) {
      setError("Please select both input and output nodes before solving");
      setShowSolution(true);
      return;
    }
    
    // Reset any previous errors
    setError(null);
    setIsLoading(true);

    // Format the data for the backend
    // Converting the graph to a format that works with SignalFlowGraphSolverMarshaller
    const graphData = {
      edges: edges.map(edge => ({
        id: edge.id,
        source: getNodeById(edge.source).data.label,
        target: getNodeById(edge.target).data.label,
        label: edge.data.label
      })),
      inputNode: getNodeById(inputNode).data.label,
      outputNode: getNodeById(outputNode).data.label
    };

    try {
      console.log("Sending to backend:", graphData);
      
      // Make the API call to the backend
      const response = await fetch("http://127.0.0.1:5000/sfg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(graphData),
      });
      
      console.log("Response status:", response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log("Solution received:", result);
        setSolution(result);
        setShowSolution(true);
      } else {
        // Handle error responses
        const errorData = await response.json();
        console.error("Error from backend:", errorData);
        setError(`Error: ${errorData.error || response.statusText}`);
        // Still show the solution panel but with error message
        setShowSolution(true);
      }
    } catch (err) {
      // Handle network errors or other exceptions
      console.error("Failed to connect to backend:", err);
      setError(`Failed to connect to backend: ${err.message}`);
      setShowSolution(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Close solution panel
  const closeSolution = () => {
    setShowSolution(false);
    setError(null);
  };

  // Close element edit panel
  const closeElementEdit = () => {
    setSelectedElement(null);
  };

  // Handle clicks on the ReactFlow pane to dismiss panels
  const onPaneClick = () => {
    closeElementEdit();
  };

  useEffect(() => {
    if (!selectedElement) return;

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

  // Effect for handling clicks outside panels
  useEffect(() => {
    function handleClickOutside(event) {
      // For the edit panel
      if (editPanelRef.current && !editPanelRef.current.contains(event.target)) {
        // Check if the click is on a node or edge (those events are handled separately)
        const clickedOnFlowElement = event.target.closest('.react-flow__node') || 
                                    event.target.closest('.react-flow__edge');
        if (!clickedOnFlowElement && selectedElement) {
          closeElementEdit();
        }
      }
    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedElement]);

  // Check for solve readiness
  const canSolve = nodes.length > 0 && inputNode && outputNode;

  return (
    <div className="flow-container" style={{ 
      display: "flex", 
      flexDirection: "column", 
      height: "100vh", 
      transition: "all 0.3s ease" 
    }}>
      <div className="flow-area" style={{ 
        flex: showSolution ? "1" : "1", 
        transition: "all 0.3s ease",
        minHeight: showSolution ? "50%" : "100%"
      }}>
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
          onPaneClick={onPaneClick}
          onInit={setRfInstance}
          fitView
          fitViewOptions={{ padding: 2 }}
          style={{ backgroundColor: "#191724", height: "100%" }}
        >
          <Background />

          {selectedElement && (
            <div
              ref={editPanelRef}
              className="update-element-name"
              style={{
                position: "absolute",
                right: "20px",
                top: "60px",
                zIndex: "4",
                fontSize: "12px",
                backgroundColor: "#2a273f",
                padding: "15px",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                marginBottom: "10px"
              }}>
                <h3 style={{ color: "white", margin: 0 }}>
                  {isNode(selectedElement) ? "Edit Node Name" : "Edit Edge Value"}
                </h3>
                <IconButton 
                  size="sm" 
                  onClick={closeElementEdit}
                  sx={{ color: "white" }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </div>

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
                  width: "100%"
                }}
              />
            </div>
          )}

          <Panel position="top-left" style={{ width: "220px" }}>
            <div style={{ 
              backgroundColor: "#2a273f", 
              padding: "15px", 
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}>
              <h3 style={{ margin: "0 0 10px 0", color: "white", fontSize: "14px" }}>
                Signal Flow Graph Settings
              </h3>
              
              <FormControl size="sm" sx={{ mb: 1 }}>
                <FormLabel sx={{ color: "#e5c07b" }}>
                  <InputIcon sx={{ fontSize: 14, mr: 0.5 }} />
                  Input Node
                </FormLabel>
                <Select
                  value={inputNode || ""}
                  onChange={(_, value) => setInputNode(value)}
                  sx={{ 
                    bgcolor: "#1f1d2e",
                    color: "white",
                    '&:hover': { bgcolor: "#2d2b3d" }
                  }}
                  placeholder="Select input node"
                  renderValue={(selected) => {
                    console.log(selected.label)
                    return <MathJax>{`\\(${selected.label}\\)`}</MathJax>
                  }}
                >
                  {nodes.map((node) => (
                    <Option key={node.id} value={node.id}>
                      <MathJax>{`\\(${node.data.label}\\)`}</MathJax>
                    </Option>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl size="sm">
                <FormLabel sx={{ color: "#e06c75" }}>
                  <OutputIcon sx={{ fontSize: 14, mr: 0.5 }} />
                  Output Node
                </FormLabel>
                <Select
                  value={outputNode || ""}
                  onChange={(_, value) => setOutputNode(value)}
                  sx={{ 
                    bgcolor: "#1f1d2e",
                    color: "white",
                    '&:hover': { bgcolor: "#2d2b3d" }
                  }}
                  placeholder="Select output node"
                  renderValue={(selected) => {
                    return <MathJax>{`\\(${selected.label}\\)`}</MathJax>
                  }}
                >
                  {nodes.map((node) => (
                    <Option key={node.id} value={node.id}>
                      <MathJax>{`\\(${node.data.label}\\)`}</MathJax>
                    </Option>
                  ))}
                </Select>
              </FormControl>
            </div>
          </Panel>

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
            </ButtonGroup>
          </Panel>
          
          <Panel position="bottom-center">
            <Button
              variant="solid"
              color="primary"
              startDecorator={isLoading ? <CircularProgress size="sm" /> : <CalculateIcon />}
              onClick={handleSolve}
              disabled={isLoading || !canSolve}
              sx={{
                bgcolor: canSolve ? "#31748f" : "#555",
                borderRadius: "20px",
                mb: 2,
              }}
            >
              {isLoading ? "Solving..." : "Solve"}
            </Button>
            
            {nodes.length > 0 && (!inputNode || !outputNode) && (
              <Alert
                size="sm"
                variant="soft"
                color="warning"
                sx={{
                  position: "absolute",
                  bottom: "60px",
                  width: "300px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontSize: "12px",
                  bgcolor: "rgba(229, 192, 123, 0.2)"
                }}
              >
                Select both input and output nodes to solve graph
              </Alert>
            )}
          </Panel>
        </ReactFlow>
      </div>
      
      {showSolution && (
        <div 
          ref={solutionPanelRef}
          className="solution-area" 
          style={{ 
            flex: "1", 
            backgroundColor: "#26233a", 
            padding: "20px",
            color: "white",
            overflowY: "auto",
            transition: "all 0.5s ease",
            animation: "slideIn 0.5s ease",
            position: "relative"
          }}
        >
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            marginBottom: "15px"
          }}>
            <h2 style={{ margin: 0 }}>Solution</h2>
            <IconButton 
              onClick={closeSolution}
              sx={{ 
                color: "white",
                bgcolor: "rgba(255,255,255,0.1)",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.2)"
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </div>
          
          {isLoading ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <CircularProgress size="lg" />
              <p>Processing your signal flow graph...</p>
            </div>
          ) : error ? (
            <div style={{ 
              padding: "15px", 
              backgroundColor: "rgba(255,87,87,0.1)", 
              borderRadius: "8px",
              borderLeft: "4px solid #ff5757"
            }}>
              <h3 style={{ color: "#ff5757" }}>Error</h3>
              <p>{error}</p>
              <p>Please check your graph structure and try again.</p>
            </div>
          ) : solution ? (
            <div>
              {/* Display solution data with better formatting */}
              <div className="solution-section">
                <h3>Graph Analysis</h3>
                <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                  <div className="solution-card">
                    <h4>Input Node</h4>
                    <p>
                      <MathJax>
                        {`\\(${getNodeById(inputNode).data.label}\\)`}
                      </MathJax>
                    </p>
                  </div>
                  <div className="solution-card">
                    <h4>Output Node</h4>
                    <p>
                      <MathJax>
                        {`\\(${getNodeById(outputNode).data.label}\\)`}
                      </MathJax>
                    </p>
                  </div>
                </div>
              </div>

              <div className={"transfer-function"} style={{ marginBottom: "20px" }}>
                <h3 style={{
                  borderBottom: "1px solid rgba(255,255,255,0.2)",
                  paddingBottom: "5px"
                }}>
                  Transfer Function
                </h3>
                <p style={{ fontSize: "16px" }}>
                  <MathJax>{`\\[${solution.transferFunction}\\]`}</MathJax>
                </p>
              </div>

              <div className={"determinants"} style={{ marginBottom: "20px" }}>
                <h3 style={{
                  borderBottom: "1px solid rgba(255,255,255,0.2)",
                  paddingBottom: "5px"
                }}>
                  Determinants
                </h3>
                <p style={{ fontSize: "16px" }}>
                  {
                    solution.determinants.map((delta, i) => {

                      return i === 0? <MathJax>{`\\[\\Delta = ${delta}\\]`}</MathJax> :
                                     <MathJax>{`\\[\\Delta_${i} = ${delta}\\]`}</MathJax>
                    })
                  }
                </p>
              </div>

              <div className={"forward-paths"} style={{ marginBottom: "20px" }}>
                <h3 style={{
                  borderBottom: "1px solid rgba(255,255,255,0.2)",
                  paddingBottom: "5px"
                }}>
                  Forward Paths
                </h3>
                <p style={{ fontSize: "16px" }}>
                  {
                    solution.forwardPaths.map((forwardPath, i) => {
                      return <ul style={{display: 'flex', justifyContent: 'center'}}>
                        <li key={i}>
                          <MathJax>{`\\[P_${i + 1}: ${forwardPath.join("\\text{, }")}\\]`}</MathJax>
                        </li>
                      </ul>
                    })
                  }
                </p>
              </div>


              <div className={"loops"} style={{ marginBottom: "20px" }}>
                <h3 style={{
                  borderBottom: "1px solid rgba(255,255,255,0.2)",
                  paddingBottom: "5px"
                }}>
                  Loops
                </h3>
                <p style={{ fontSize: "16px" }}>
                  {
                    solution.loops.map((loop, i) => {
                      return <ul style={{display: 'flex', justifyContent: 'center'}}>
                        <li key={i}>
                          <MathJax>{`\\(L_${i + 1}: ${loop.join("\\text{, }")}\\)`}</MathJax>
                        </li>
                      </ul>
                    })
                  }
                </p>
              </div>

              <div className={"non-touching-loops"} style={{ marginBottom: "20px" }}>
                <h3 style={{
                  borderBottom: "1px solid rgba(255,255,255,0.2)",
                  paddingBottom: "5px"
                }}>
                  Non Touching Loops
                </h3>
                <p style={{ fontSize: "18px" }}>
                  {
                    Object.entries(solution.nonTouchingLoops).map(([k, k_non_touching_loops_combinations]) => {
                      return <ul>
                        <li key={k}>
                          {`Combinations of ${k} non-touching loops:`}
                          <ul>
                            {k_non_touching_loops_combinations.map((k_non_touching_loops_combination, i) => {
                              return <li key={i}>
                                <MathJax>
                                  {
                                    `\\(${
                                        k_non_touching_loops_combination
                                            .map(loop => `\\text{(}${loop.join('\\text{, }')})`)
                                            .join('\\text{, }')
                                    }\\)`
                                  }
                                </MathJax>
                              </li>
                            })}
                          </ul>
                        </li>
                      </ul>
                    })
                  }
                </p>
              </div>
            </div>
          ) : (
            <p>No solution data available. Please try solving again.</p>
          )}
        </div>
      )}
      
      <style>
        {`
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .solution-card {
            background-color: rgba(255,255,255,0.05);
            padding: 15px;
            border-radius: 8px;
            min-width: 150px;
          }
          
          .solution-card h4 {
            margin: 0 0 5px 0;
            color: #c4a7e7;
            font-size: 14px;
          }
          
          .solution-card p {
            margin: 0;
            font-size: 16px;
          }
        `}
      </style>
    </div>
  );
}

export default FlowForm;