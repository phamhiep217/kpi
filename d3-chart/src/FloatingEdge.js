import React from "react";
import { BaseEdge, getBezierPath } from "@xyflow/react";

const FloatingEdge = ({ id, sourceX, sourceY, targetX, targetY, markerEnd }) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} />;
};

export default FloatingEdge;
