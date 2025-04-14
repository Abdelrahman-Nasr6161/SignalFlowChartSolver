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
import { Handle, Position } from '@xyflow/react';

function CostumCircularNode({ data, isConnectable }) {
  return (
    <div style={{ position: 'relative', width: 60, height: 60 }}>
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          border: '2px solid black',
          backgroundColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {data.label}
      </div>
      
      {/* Top right */}
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        style={{ top: '20%', background: 'green'  }}
        isConnectable={isConnectable}
      />
      {/* Bottom right */}
      <Handle
        type="target"
        position={Position.Right}
        id="b"
        style={{ top: '80%', background: 'red'  }}
        isConnectable={isConnectable}
      />
      
      {/* Top left */}
      <Handle
        type="target"
        position={Position.Left}
        id="a"
        style={{ top: '20%', background: 'red' }}
        isConnectable={isConnectable}
      />
      {/* Bottom left */}
      <Handle
        type="source"
        position={Position.Left}
        id="b"
        style={{ top: '80%', background: 'green'  }}
        isConnectable={isConnectable}
      />
    </div>
  );
}

export default CostumCircularNode;