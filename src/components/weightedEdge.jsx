import {
    BaseEdge,
    EdgeLabelRenderer,
    getBezierPath,
  } from '@xyflow/react';
  import React from 'react';
  import './WeightedEdge.css'
  
  function WeightedEdge(edgeData) {
    const{
      id,
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourcePosition,
      targetPosition,
      data,
    } = edgeData;
  
    // const isSameNode = sourceX === targetX && sourceY === targetY;

    const [edgePath, labelX, labelY] = getBezierPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourcePosition,
      targetPosition,
    });

    return (
      <>
        <svg style={{ position: "absolute", top: 0, left: 0 }}>
          <defs>
            <marker
              id={`marker-${id}`}
              markerWidth="30"
              markerHeight="30"
              viewBox="-5 -5 20 20"
              markerUnits="strokeWidth"
              orient="auto-start-reverse"
              refX="0"
              refY="0"
            >
              <polyline
                style={{
                  stroke: "#ccc",
                  fill: "#ccc",
                  strokeWidth: 1,
                  zIndex: 1,
                }}
                strokeLinecap="round"
                strokeLinejoin="round"
                points="-5,-4 0,0 -5,4 -5,-4"
              />
            </marker>
          </defs>
        </svg>
        <BaseEdge
           id={id}
           path={edgePath}
           style={{ strokeWidth: 1, stroke: '#ccc', zIndex: 1 }}
           markerEnd={`url('#marker-${id}')`}
        />
        <EdgeLabelRenderer>
          <div
            style={{
                position: 'absolute',
                transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
                background: '#ccc',
                padding: '4px',
                border: '1px solid #ccc',
                borderRadius: '30%',
                zIndex: 3,
              }}
          >
            <div>{data?.label ?? ''}</div>
          </div>
        </EdgeLabelRenderer>
        
      </>
    );
  }
  
  export default WeightedEdge;
  