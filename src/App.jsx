///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
import React, { useState, useCallback } from 'react';
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
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [rfInstance, setRfInstance] = useState(null);
  const { setViewport } = useReactFlow();
 
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
      data: { label: 'Added node' },
      position: {
        x: (Math.random() - 0.5) * 400,
        y: (Math.random() - 0.5) * 400,
      },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);
 
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
return (
  <ReactFlow
    nodeTypes={nodeTypes}
    nodes={nodes}
    edges={edges}
    onNodesChange={onNodesChange}
    onEdgesChange={onEdgesChange}
    onConnect={onConnect}
    onInit={setRfInstance}
    fitView
    fitViewOptions={{ padding: 2 }}
    style={{ backgroundColor: "#191724" }}
    >
      <Background />

    <Panel position="top-right">
      <button onClick={onSave}>save</button>
      <button onClick={onRestore}>restore</button>
      {/* <button onClick={onAdd}>add node</button> */}
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