// const CustomCircularNodeStyle = {
//     width: 80,  // Adjust size as needed
//     height: 80, // Adjust size as needed
//     borderRadius: "50%",  // Circular shape
//     border: "2px solid black",
//     background: "transparent",  // No background
//     boxShadow: "none", // Removes default shadow
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     textAlign: "center",
//   };
  
//   // const CustomCircularNode = ({ data }) => {
//   //   return (
//   //     <div style={CustomCircularNodeStyle}>
//   //       {data.label}
//   //     </div>
//   //   );
//   // };
  
//   const CustomCircularNode = ({ data }) => {
//     return (
//       <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
//         {/* Label Above */}
//         <span style={{ marginBottom: 5 }}>{data.label}</span>  
  
//         {/* Circular Node */}
//         <div style={CustomCircularNodeStyle}></div>
  
//         {/* Label Below */}
//         {/* <span style={{ marginTop: 5 }}>{data.label}</span>  */}
//       </div>
//     );
//   };
  
//   export default CustomCircularNode;
  
import { Handle, Position } from "@xyflow/react";

const handleStyle = { left: "50%", transform: "translateX(-50%)" };

function CostumCircularNode({ data, isConnectable }) {

  return (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center", 
    }}  
  >
  
    <div
      className="circular-node"
      style={{
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        border: "2px solid black",
        backgroundColor: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="b"
        isConnectable={isConnectable}
      />
    </div>

    <span 
      style={{ 
        marginTop: "5px",
        fontSize: "14px", 
        color: "black" 
      }}>

      {data?.label || "Node (Null)"}
    </span>

  </div>
  );
}

export default CostumCircularNode;
