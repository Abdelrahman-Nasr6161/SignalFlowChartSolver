///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
import React, { useState, useCallback, useEffect } from 'react';
import {
  Background,
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import '@fontsource/inter';
import { Typography } from "@mui/joy";
import CustomCircularNode from './components/CircleNode';
import Button from '@mui/joy/Button';
import ButtonGroup from '@mui/joy/ButtonGroup';
import IconButton from '@mui/joy/IconButton';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
// import { 
//   Add, 
//   Delete 
// } from '@mui/icons-material';

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const flowKey = 'example-flow';

const nodeTypes = {
  custom: CustomCircularNode,
};
const getNodeId = () => `randomnode_${+new Date()}`;
 
const initialNodes = [
  { id: '1', type: 'custom', data: { label: 'Node 1' }, position: { x: 0, y: -50 } },
  { id: '2', type: 'custom', data: { label: 'Node 2' }, position: { x: 0, y: 50 } },
];
 
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];
 
const SaveRestore = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [rfInstance, setRfInstance] = useState(null);
  const { setViewport } = useReactFlow();

  const [selectedElement, setSelectedElement] = useState(null);
  const [elementName, setElementName] = useState('');
  const [nodeCounter, setNodeCounter] = useState(0);
 
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );
  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      localStorage.setItem(flowKey, JSON.stringify(flow));
    }
  }, [rfInstance]);
 
  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const flow = JSON.parse(localStorage.getItem(flowKey));
 
      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom });
      }
    };
 
    restoreFlow();
  }, [setNodes, setViewport]);
 
  const onAdd = useCallback(() => {
    const newNode = {
      id: getNodeId(),
      type: 'custom',
      data: { label: `Node ${nodeCounter}` },
      position: {
        x: (Math.random() - 0.5) * 400,
        y: (Math.random() - 0.5) * 400,
      },
    };
    setNodeCounter((nodeCounter) => nodeCounter+1)
    setNodes((nds) => nds.concat(newNode));
    
  }, [setNodes, setNodeCounter, nodeCounter]);

  const onElementClick = (event, elemet) => {
    console.log("Selected element: ", elemet);
    setSelectedElement(elemet);
    setElementName(elemet.data.label || elemet.data);
  }
  useEffect(() => {
    console.log("Updated nodeCounter:", nodeCounter);
  }, [nodeCounter]);
  
  useEffect(() => {

    // Need to make an if-else (node or edge)
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedElement.id) {
          return {
            ...node,
            data: {
              ...node.data,
              label: elementName || " ",
            },
          };
        }
 
        return node;
      }),
    );
  }, [elementName, setNodes]);
 
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
return (
  <ReactFlow
    nodeTypes={nodeTypes}
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

    <Panel position="top-right">
      <button onClick={onSave}>Save</button>
      <button onClick={onRestore}>Restore</button>
      {/* <button onClick={onAdd}>add node</button> */}
    </Panel>

    {/* Section to input node/edge name/value */}
    
    {selectedElement && (
      <div
        className='update-element-name'
        style={{
            position: "absolute",
            right: "20px",
            top: "60px",
            zIndex: "4",
            fontSize: "12px",   
        }}
      >

        <h3 style={{color: "white", }}>
          Edit Name
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
      <IconButton>
        <DeleteIcon />
      </IconButton>
    </ButtonGroup>
    </Panel>

  </ReactFlow>
);
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function App() {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <ReactFlowProvider>
        <SaveRestore />
      </ReactFlowProvider>
    </div>
  );
}

export default App;