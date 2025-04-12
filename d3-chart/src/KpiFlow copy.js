import React, { useCallback } from "react";
import {
  ReactFlow,
  addEdge,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import FloatingEdge from "./FloatingEdge";
import FloatingConnectionLine from "./FloatingConnectionLine";

// Dummy data
const data = {
  perspectives: [
    {
      id: "perspect-1",
      name: "Kết quả Kinh doanh tốt",
      objects: [
        {
          id: "object-1",
          name: "1A. EBIT DICA >10%",
          desc: "tính đến năm 2025",
          kpis: [
            { id: "k1", name: "Mục tiêu doanh thu 2025", desc: "5200 tấn", department: "Sales" },
            { id: "k2", name: "Mục tiêu doanh thu 2026", desc: "5400 tấn", department: "Sales" },
            { id: "k3", name: "Mục tiêu doanh thu 2027", desc: "5600 tấn", department: "Production" },
            { id: "k4", name: "Mục tiêu doanh thu 2028", desc: "5800 tấn", department: "Production" },
            { id: "k5", name: "Mục tiêu doanh thu 2029", desc: "6000 tấn", department: "Production" },
            { id: "k6", name: "Mục tiêu doanh thu 2029", desc: "6200 tấn", department: "Supplychain" },
            { id: "k7", name: "Mục tiêu doanh thu 2029", desc: "6400 tấn", department: "Supplychain" }
          ]
        }
      ]
    }
  ]
};

// ✅ Generate nodes and edges function
const generateNodesAndEdges = (data) => {
  if (!data || !data.perspectives || data.perspectives.length === 0) {
    console.error("Dữ liệu không hợp lệ:", data);
    return { nodes: [], edges: [] };
  }

  let nodes = [];
  let edges = [];

  let perspect = data.perspectives[0];
  let perspectId = perspect.id;
  let object = perspect.objects[0];
  let objectId = object.id;

  nodes.push({
    id: perspectId,
    data: { label: <strong>{perspect.name}</strong> },
    position: { x: 500, y: 0 },
    style: { background: "#039be5", color: "white", padding: 10, width: 180, textAlign: "center" },
    draggable: true,
  });

  nodes.push({
    id: objectId,
    data: { label: <div><strong>{object.name}</strong><br />{object.desc}</div> },
    position: { x: 500, y: 100 },
    style: { background: "#0277bd", color: "white", padding: 10, width: 180, textAlign: "center" },
    draggable: true,
  });

  edges.push({
    id: `e-${perspectId}-${objectId}`,
    source: perspectId,
    target: objectId,
    type: "floating",
    markerEnd: { type: MarkerType.Arrow },
  });

  let groupedKpis = {};
  object.kpis.forEach(kpi => {
    if (!groupedKpis[kpi.department]) {
      groupedKpis[kpi.department] = [];
    }
    groupedKpis[kpi.department].push(kpi);
  });

  let departments = Object.keys(groupedKpis);
  let spacingX = 250;
  let spacingY = 150;
  let startX = 500 - ((departments.length - 1) * spacingX) / 2;

  departments.forEach((department, colIndex) => {
    let departmentKpis = groupedKpis[department];

    departmentKpis.forEach((kpi, rowIndex) => {
      let kpiId = kpi.id;
      let posX = startX + colIndex * spacingX;
      let posY = 320 + rowIndex * spacingY;

      nodes.push({
        id: kpiId,
        data: {
          label: (
            <div style={{ textAlign: "center", wordWrap: "break-word" }}>
              <strong>{kpi.name}</strong><br />{kpi.desc}<br /><i>{kpi.department}</i>
            </div>
          )
        },
        position: { x: posX, y: posY },
        style: { background: "#ffca28", padding: 10, width: 200 },
        draggable: true
      });

      edges.push({
        id: `e-${objectId}-${kpiId}`,
        source: objectId,
        target: kpiId,
        type: "floating",
        markerEnd: { type: MarkerType.Arrow },
      });
    });
  });

  return { nodes, edges };
};

// ✅ Component KpiFlow
const KpiFlow = () => {
  const { nodes: initialNodes, edges: initialEdges } = generateNodesAndEdges(data);
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: "floating",
            markerEnd: { type: MarkerType.Arrow },
          },
          eds
        )
      ),
    [setEdges]
  );

  return (
    <div style={{ height: "600px", width: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        edgeTypes={{ floating: FloatingEdge }}
        connectionLineComponent={FloatingConnectionLine}
        style={{ backgroundColor: "#F7F9FB" }}
      >
        <Background />
      </ReactFlow>
    </div>
  );
};

export default KpiFlow;
