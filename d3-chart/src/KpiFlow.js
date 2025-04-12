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

// ✅ Dummy Data
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
            { id: "1", name: "1.Mục tiêu doanh thu năm 2025 DICA: 278 tỷ TMT: 268 tỷ WW: 62 tỷ", desc: "Tỷ trọng: DICA: 45% - TOMOTO 45% - WW: 10% Vượt doanh thu: theo tam suất Mục tiêu & Doanh thu thực tế Đạt doanh thu: 100% Không đạt doanh thu: theo tam suất. Tuy nhiên mục tiêu = 0% nếu doanh thu thực tế < 80% so với Mục tiêu", department: "Sales", bgColor:'#FFF0F5' },
            { id: "2", name: "2.Xây dựng  Báo cáo Kinh Doanh hàng tháng(Dựa trên báo cáo doanh thu-chi phí phòng kế toán gửi hàng tháng, PKD sẽ phân tích hiệu quả kinh doanh/bán hàng của từng khách hàng hoặc từng nhóm khách hàng mình phụ trách và đưa ra giải pháp/ đề xuất phù hợp với khách hàng đó)", desc: "Triển khai trước 30/04/2025: 120% Triển khai trước 31/05/2025: 100% Mục tiêu chưa triển khai được trước tháng 06/2025: 0%", department: "Sales",bgColor:'#FFF0F5' },
            { id: "3", name: "3.Năng suất: Tỉ lệ sản lượng in thực tế >= 100% so với sản lượng kế hoạch.", desc: "Số bán thành phẩm in mỗi LSX tối đa <= số max theo từng lệnh sản xuất (tránh in dư). Sản lượng in thực tế >100%: đạt 120% Sản lượng in thực tế =100% : đạt 100% 90% <= Sản lượng in thực tế < 100%: 80%80% <= Sản lượng in thực tế < 90%: 40% Sản lượng in thực tế < 80%: 0%", department: "Production",bgColor:'#FFE1FF' },
            { id: "4", name: "4.Phế phẩm: Tỉ lệ phế liệu (màng) sản xuất trong tháng không vượt định mức kế hoạch. Phế liệu được tính bao gồm: Số lượng hàng sản xuất bù trong tháng (hàng lỗi lọt qua khâu chia-kiểm phẩm => thiếu số min đơn hàng). Số lượng hàng lỗi tồn kho 9001 trên 6 tháng. Số lượng hàng lỗi Khách trả về, khiếu nại yêu cầu Dica đền bù chi phí (có chứng cứ xác minh rõ đúng lỗi in).", desc: "Phế liệu thực tế < Định mức: đạt 150% Phế liệu thực tế = định mức : đạt 100% Phế liệu thực tế > (định mức + 0.2%): 80% Phế liệu thực tế > (định mức + 0.4%): 40% Phế liệu thực tế > (định mức + 0.6%): 0%", department: "Production",bgColor:'#FFE1FF' },
            { id: "5", name: "5.Xây dựng được Hệ thống báo cáo OEE tại Nhà máy DICA trong năm 2025", desc: "Hoàn thành trước tháng 09/2025: đạt 120% Hoàn thành trước tháng 12/2025:  100% Hoàn thành sau 30/12/2025:  0%", department: "Production",bgColor:'#FFE1FF' },
            { id: "6", name: "6.Đáp ứng tiến độ vật tư (Nguyên vật liệu và Nguyên phụ liệu) theo Báo cáo theo dõi tiến độ giao hàng đã thỏa thuận với Kế hoạch", desc: "NVL + CCDC: Đáp ứng đúng tiến độ <70% = 0%Từ 70% đến dưới 80% = 80% Từ 80% đến dưới 90% = 90% Từ 90% = 100%", department: "Supplychain",bgColor:'#FAEBD7' },
            { id: "7", name: "7.Lập tiêu chuẩn kiểm tra chất lượng NVL cho QC", desc: "Không có tiêu chuẩn mới = 0%  Ban hành 1 tiêu chuẩn = 80% Ban hành 3 tiêu chuẩn = 90% Ban hành 5 tiêu chuẩn = 100%", department: "Supplychain",bgColor:'#FAEBD7' }
          ]
        }
      ]
    }
  ]
};
// ✅ Edge Links (Nguồn & Đích giữa KPI)
const edgeLinks = {
  nodekpi: [
    { NodeKpiSource: "2", NodeKpiTarget: "3" },
    { NodeKpiSource: "3", NodeKpiTarget: "4" },
    { NodeKpiSource: "4", NodeKpiTarget: "7" },
    { NodeKpiSource: "6", NodeKpiTarget: "1" },
    { NodeKpiSource: "6", NodeKpiTarget: "5" },
    { NodeKpiSource: "7", NodeKpiTarget: "6" },
  ]
};

// ✅ Generate nodes & edges function
const generateNodesAndEdges = (data, edgeLinks) => {
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

  // Perspective Node
  nodes.push({
    id: perspectId,
    data: { label: <strong>{perspect.name}</strong> },
    position: { x: 500, y: 0 },
    style: { background: "#039be5", color: "white", padding: 10, width: 180, textAlign: "center" },
    draggable: true,
  });

  // Objective Node
  nodes.push({
    id: objectId,
    data: { label: <div><strong>{object.name}</strong><br />{object.desc}</div> },
    position: { x: 500, y: 100 },
    style: { background: "#0277bd", color: "white", padding: 10, width: 180, textAlign: "center" },
    draggable: true,
  });

  // Perspective → Objective Edge
  edges.push({
    id: `e-${perspectId}-${objectId}`,
    source: perspectId,
    target: objectId,
    type: "floating",
    markerEnd: { type: MarkerType.Arrow },
  });

  // ✅ Nhóm KPI theo department
  let groupedKpis = {};
  object.kpis.forEach(kpi => {
    if (!groupedKpis[kpi.department]) {
      groupedKpis[kpi.department] = [];
    }
    groupedKpis[kpi.department].push(kpi);
  });

  let departments = Object.keys(groupedKpis);
  let spacingX = 300;
  let spacingY = 350;
  let startX = 500 - ((departments.length - 1) * spacingX) / 2;

  // ✅ Tạo KPI nodes
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
            <div style={{ textAlign: "justify", wordWrap: "break-word" }}>
              <strong>{kpi.name}</strong><br />{kpi.desc}<br /><i>{kpi.department}</i>
            </div>
          )
        },
        position: { x: posX, y: posY },
        style: { background: kpi.bgColor, padding: 10, width: 250 },
        draggable: true
      });
      // Trường hợp link từ object tới kpi
      // edges.push({
      //   id: `e-${objectId}-${kpiId}`,
      //   source: objectId,
      //   target: kpiId,
      //   type: "floating",
      //   markerEnd: { type: MarkerType.Arrow },
      // });
    });
  });

  // ✅ Thêm edges từ edgeLinks
  if (edgeLinks && edgeLinks.nodekpi && Array.isArray(edgeLinks.nodekpi)) {
    edgeLinks.nodekpi.forEach((link) => {
      edges.push({
        id: `e-${link.NodeKpiSource}-${link.NodeKpiTarget}`,
        source: link.NodeKpiSource,
        target: link.NodeKpiTarget,
        type: "floating",
        markerEnd: { type: MarkerType.Arrow },
      });
    });
  } else {
    console.error("edgeLinks.nodekpi không tồn tại hoặc không hợp lệ", edgeLinks);
  }

  return { nodes, edges };
};

// ✅ Component KpiFlow
const KpiFlow = () => {
  const { nodes: initialNodes, edges: initialEdges } = generateNodesAndEdges(data, edgeLinks);
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
