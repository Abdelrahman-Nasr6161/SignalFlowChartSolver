import { BaseEdge, EdgeLabelRenderer, getBezierPath, MarkerType } from '@xyflow/react';

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  // markerEnd,
  style,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      {/* The following svg is the marker / arrow icon, i couldnt get the simple MarkerType.ArrowClosed to work in a custom edge */}
      <svg style={{ position: "absolute", top: 0, left: 0 }}>
        <defs>
          <marker
            id={`${id}-marker`}
            markerWidth="14"
            markerHeight="14"
            viewBox="-5 -5 10 10"
            markerUnits="strokeWidth"
            orient="auto-start-reverse"
            refX="3" //To adjust the arrow head position relative to end path
            refY="0"
          >
            <polyline
              points="-3,-3 0,0 -3,3 -3,-3"
              style={{
                fill: "blue",
                stroke: "blue",
                strokeWidth: 1,
              }}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </marker>
        </defs>
      </svg>
      <BaseEdge id={id} path={edgePath} markerEnd={`url(#${id}-marker)`} style={style}/>
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -100%) translate(${labelX}px, ${labelY}px)`,
            background: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          {data?.label || 'Edge'}
        </div>
      </EdgeLabelRenderer>
      
    </>
  );
};

export default CustomEdge;
