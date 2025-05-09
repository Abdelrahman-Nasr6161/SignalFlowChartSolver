import { Handle, Position } from "@xyflow/react";
import './CircleNode.css';
import { MathJax } from 'better-react-mathjax'
function CostumCircularNode({ data, isConnectable }) {

  return (
  <>
    <div
      className="circular-node"
      style={{
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        border: "2px solid #ccc",
        color: "#ccc",
        backgroundColor: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // position: "relative",
            }}
          >
        <Handle
          type="target"
          position={Position.Top}
          id="top"
          isConnectable={isConnectable}
          style={{ background: "#e06c75", transform: "translateY(-60%), translateX(60%)" }}
        />
        <Handle
          type="source"
          position={Position.Top}
          id="top"
          isConnectable={isConnectable}
          style={{ background: "#e06c75", transform: "translateY(-60%), translateX(60%)" }}
        />
        <MathJax>{`\\(${data?.label || "Node (Null)"}\\)`}</MathJax>

        <Handle
          type="target"
          position={Position.Bottom}
          id="bottom"
          isConnectable={isConnectable}
          style={{ background: "#e06c75", transform: "translateY(-60%), translateX(60%)" }}
        />

        <Handle
          type="source"
          position={Position.Bottom}
          id="bottom"
          isConnectable={isConnectable}
          style={{ background: "#e06c75", transform: "translateY(-60%), translateX(60%)" }}
        />
        
        <Handle
          type="target"
          position={Position.Left}
          id="left"
          isConnectable={isConnectable}
          style={{ background: "#e06c75", transform: "translateY(-60%), translateX(60%)" }}
        />
        <Handle
          type="source"
          position={Position.Left}
          id="left"
          isConnectable={isConnectable}
          style={{ background: "#e06c75", transform: "translateY(-60%), translateX(60%)" }}
        />

        <Handle
          type="target"
          position={Position.Right}
          id="right"
          isConnectable={isConnectable}
          style={{ background: "#e06c75", transform: "translateY(-60%), translateX(60%)" }}
        />
        <Handle
          type="source"
          position={Position.Right}
          id="right"
          isConnectable={isConnectable}
          style={{ background: "#e06c75", transform: "translateY(-60%), translateX(60%)" }}
        />
      </div>
  </>
  );
}

export default CostumCircularNode;
