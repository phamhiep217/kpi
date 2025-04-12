import React from "react";
import { getBezierPath } from "@xyflow/react";

const FloatingConnectionLine = ({ fromX, fromY, toX, toY }) => {
  const [path] = getBezierPath({ sourceX: fromX, sourceY: fromY, targetX: toX, targetY: toY });

  return <path fill="none" stroke="#222" strokeWidth={2} className="animated" d={path} />;
};

export default FloatingConnectionLine;
