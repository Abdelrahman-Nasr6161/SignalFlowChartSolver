// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// import React, { useState, useCallback, useEffect } from 'react';
// import {
//   Background,
//   ReactFlow,
//   ReactFlowProvider,
//   useNodesState,
//   useEdgesState,
//   addEdge,
//   useReactFlow,
//   Panel,
//   isNode,
//   isEdge,
// } from '@xyflow/react';
// import '@xyflow/react/dist/style.css';
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
// import '@fontsource/inter';
// import { Typography } from "@mui/joy";
// import CustomCircularNode from './components/CircleNode';
// import WeightedEdge from './components/weightedEdge'; // Import the custom edge component
// import Button from '@mui/joy/Button';
// import ButtonGroup from '@mui/joy/ButtonGroup';
// import IconButton from '@mui/joy/IconButton';
// import AddIcon from '@mui/icons-material/Add';
// import DeleteIcon from '@mui/icons-material/Delete';

// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// const flowKey = 'example-flow';

// const nodeTypes = {
//   custom: CustomCircularNode,
// };
// const getNodeId = () => `randomnode_${+new Date()}`;

// const edgeTypes = {
//   customEdge: WeightedEdge, 
// };
 
// const initialNodes = [
//   { id: '1', type: 'custom', data: { label: 'Node 1' }, position: { x: 0, y: -50 } },
//   { id: '2', type: 'custom', data: { label: 'Node 2' }, position: { x: 0, y: 50 } },
// ];
 
// const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];
 
// const SaveRestore = () => {
//   const [nodes, setNodes, onNodesChange] = useNodesState([]);
//   const [edges, setEdges, onEdgesChange] = useEdgesState([]);
//   const [rfInstance, setRfInstance] = useState(null);
//   const { setViewport } = useReactFlow();

//   const [selectedElement, setSelectedElement] = useState(null);
//   const [elementName, setElementName] = useState('');
//   const [nodeCounter, setNodeCounter] = useState(0);
 
//   const onConnect = (params) => {
//        const newEdge = {
//       ...params,
//       id: `e-${params.source}-->${params.target}`,
//       type: 'customEdge', 
//       data: { label: '1',},
//     };
//     setEdges((eds) => addEdge(newEdge, eds));
//   };

//   const onSave = useCallback(() => {
//     if (rfInstance) {
//       const flow = rfInstance.toObject();
//       localStorage.setItem(flowKey, JSON.stringify(flow));
//     }
//   }, [rfInstance]);
 
//   const onRestore = useCallback(() => {
//     const restoreFlow = async () => {
//       const flow = JSON.parse(localStorage.getItem(flowKey));
 
//       if (flow) {
//         const { x = 0, y = 0, zoom = 1 } = flow.viewport;
//         setNodes(flow.nodes || []);
//         setEdges(flow.edges || []);
//         setViewport({ x, y, zoom });
//         setNodeCounter(flow.nodes.length);
//       }
//     };
 
//     restoreFlow();
//   }, [setNodes, setViewport]);
 
//   const onAdd = useCallback(() => {
//     const newNode = {
//       id: getNodeId(),
//       type: 'custom',
//       data: { label: `Node ${nodeCounter}` },
//       position: {
//         x: (Math.random() - 0.5) * 400,
//         y: (Math.random() - 0.5) * 400,
//       },
//     };
//     setNodeCounter((nodeCounter) => nodeCounter+1)
//     setNodes((nds) => nds.concat(newNode));
    
//   }, [setNodes, setNodeCounter, nodeCounter]);

//   const onDelete = (nodeId) => {
    
//     setNodeCounter((nodeCounter) => Math.max(nodes.length - 1, 0));
//     console.log("Updated nodeCounter:", nodeCounter);
//     setNodes((nodes) => nodes.filter((n) => n.id !== nodeId));
//     setEdges((edges) => edges.filter((e) => e.source !== nodeId && e.target !== nodeId));
//   };


//   const onElementClick = (event, elemet) => {
//     console.log("Selected element: ", elemet);
//     setSelectedElement(elemet);
//     setElementName(elemet.data.label || elemet.data);
//   }
//   useEffect(() => {
//     console.log("Updated nodeCounter:", nodeCounter);
//   }, [nodeCounter]);
  
//   useEffect(() => {
//     if (!selectedElement) return;
  
//     if (isNode(selectedElement)) {
//       setNodes((nds) =>
//         nds.map((node) =>
//           node.id === selectedElement.id
//             ? {
//                 ...node,
//                 data: {
//                   ...node.data,
//                   label: elementName || " ",
//                 },
//               }
//             : node
//         )
//       );
//     } else if (isEdge(selectedElement)) {
//       setEdges((eds) =>
//         eds.map((edge) =>
//           edge.id === selectedElement.id
//             ? {
//                 ...edge,
//                 data: {
//                   ...edge.data,
//                   label: elementName || " ",
//                 },
//               }
//             : edge
//         )
//       );
//     }
//   }, [elementName, selectedElement, setNodes, setEdges]);
  
 
// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// return (
//   <ReactFlow
//     nodeTypes={nodeTypes}
//     edgeTypes={edgeTypes}
//     nodes={nodes}
//     edges={edges}
//     onNodesChange={onNodesChange}
//     onEdgesChange={onEdgesChange}
//     onConnect={onConnect}
//     onNodeClick={onElementClick}
//     onEdgeClick={onElementClick}
//     onInit={setRfInstance}
//     fitView
//     fitViewOptions={{ padding: 2 }}
//     style={{ backgroundColor: "#191724" }}
//     >
//       <Background />

//     <Panel position="top-right">
//       <button onClick={onSave}>Save</button>
//       <button onClick={onRestore}>Restore</button>
//       {/* <button onClick={onAdd}>add node</button> */}
//     </Panel>

//     {/* Section to input node/edge name/value */}
    
//     {selectedElement && (
//       <div
//         className='update-element-name'
//         style={{
//             position: "absolute",
//             right: "20px",
//             top: "60px",
//             zIndex: "4",
//             fontSize: "12px",   
//         }}
//       >

//         <h3 style={{color: "white", }}>
//           {isNode(selectedElement) ? "Edit Node Name" : "Edit Edge Value"}
//         </h3>

//         <input        
//           type="text"
//           value={elementName}
//           onChange={(evt) => setElementName(evt.target.value)}
//           style={{
//             padding: "8px",
//             fontSize: "12px",
//             textAlign: "center",
//             borderRadius: "4px",
//             border: "none",
//             outline: "none",
//           }}
//         />
//       </div>
      
//     )}

//     <Panel position="top-center">
//     <ButtonGroup  
//       variant="soft"
//       sx={{
//         bgcolor: "#31748f",
//         "--ButtonGroup-radius": "20px",
//       }}
//     >
//       <IconButton onClick={onAdd}>
//         <AddIcon />
//       </IconButton>
//       <IconButton onClick={() => {
//     if (isNode(selectedElement)) {
//       onDelete(selectedElement.id);
//     }
//   }}>
//         <DeleteIcon />
//       </IconButton>
//     </ButtonGroup>
//     </Panel>

//   </ReactFlow>
// );
// };

// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// function App() {
  // return (
  //   <div style={{ height: '100vh', width: '100vw' }}>
      // <ReactFlowProvider>
      //   <SaveRestore />
      // </ReactFlowProvider>
  //   </div>
  // );
// }

// export default App;







import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Initial from "./components/pages/initial";

const App = () => {
 return(
  
    <Router>
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#191724' }}>
      <Initial />
    </div>
    </Router>
 );
}
export default App;