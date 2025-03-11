import { useState } from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  Background,
  Panel,
  Controls,
  MiniMap
} from 'reactflow';
import 'reactflow/dist/style.css';

function App() {

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);


  const handleInteractiveChange = (interactive) => {
    console.log("Interactive Mode:", interactive);
  };

  return (
    <div style={{ height: '90vh', border: '1px solid #ddd' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Background />
        <Panel className="panel">
          <div>Toolbar:</div>
        </Panel>

        <Controls 
          showInteractive={true} 
          onInteractiveChange={handleInteractiveChange}
        />
        
        <MiniMap />
      </ReactFlow>
    </div>
  );
}

export default App;
