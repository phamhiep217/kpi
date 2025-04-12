import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const data = {
    Perspective: [
        { ID: 1, PerspectiveName: "Finance", Description: "Tập trung vào giảm chi phí." },
        { ID: 2, PerspectiveName: "Customer", Description: "Nâng cao sự hài lòng của khách hàng." },
    ],
    Objective: [
        { ObjectiveID: 1, ObjectiveName: "Reduce Transportation Costs(Tập trung vào giảm chi phí).", PerspectiveID: 1, ParentObjectiveID: 1 },
        { ObjectiveID: 2, ObjectiveName: "Enhance On-Time Delivery aaaaaa", PerspectiveID: 1, ParentObjectiveID: 0 },
        { ObjectiveID: 3, ObjectiveName: "Enhance On-Time Delivery", PerspectiveID: 2, ParentObjectiveID: 1 },
        { ObjectiveID: 4, ObjectiveName: "Cheap", PerspectiveID: 2, ParentObjectiveID: 1 },
        { ObjectiveID: 5, ObjectiveName: "Exp", PerspectiveID: 2, ParentObjectiveID: 2 },

    ],
};

const width = 800;
const height = 400;

const D3Chart = () => {
    const svgRef = useRef();

    useEffect(() => {
        const rx = 70;
        const ry = 40;

        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height);

        // Remove previous elements before re-rendering
        svg.selectAll("*").remove();

        // Define arrow marker once
        svg.append("defs").append("marker")
            .attr("id", "arrow")
            .attr("viewBox", "0 0 10 10")
            .attr("refX", "9")
            .attr("refY", "5")
            .attr("markerWidth", "6")
            .attr("markerHeight", "6")
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M 0 0 L 10 5 L 0 10 z")
            .attr("fill", "black");

        // Arrange perspectives
        const perspectives = data.Perspective.map((p, i) => ({
            ...p,
            y: i * (height / data.Perspective.length) + 50,
        }));

        // Arrange objectives
        const objectives = data.Objective.map((o, i) => ({
            ...o,
            x: (i + 1) * (width / (data.Objective.length + 1)),
            y: perspectives.find(p => p.ID === o.PerspectiveID)?.y + 80,
        }));

        // Draw arrows before ellipses
        objectives.forEach(obj => {
            if (obj.ParentObjectiveID !== 0) {
                const parent = objectives.find(o => o.ObjectiveID === obj.ParentObjectiveID);
                if (parent) {
                    const angle = Math.atan2(obj.y - parent.y, obj.x - parent.x);
                    const startX = parent.x + rx * Math.cos(angle);
                    const startY = parent.y + ry * Math.sin(angle);
                    const endX = obj.x - rx * Math.cos(angle);
                    const endY = obj.y - ry * Math.sin(angle);

                    svg.append("line")
                        .attr("x1", startX)
                        .attr("y1", startY)
                        .attr("x2", endX)
                        .attr("y2", endY)
                        .attr("stroke", "black")
                        .attr("stroke-width", 2)
                        .attr("marker-end", "url(#arrow)");
                }
            }
        });

        // Draw ellipses
        svg.selectAll("ellipse")
            .data(objectives)
            .enter()
            .append("ellipse")
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("rx", rx)
            .attr("ry", ry)
            .attr("fill", d => (d.ParentObjectiveID ? "steelblue" : "gold"));

        // Add text inside ellipses
        const textGroups = svg.selectAll("text")
            .data(objectives)
            .enter()
            .append("text")
            .attr("x", d => d.x)
            .attr("y", d => d.y)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("fill", "black")
            .attr("font-size", "10px")
            .attr("font-weight", "bold");

        textGroups.each(function (d) {
            const text = d3.select(this);
            const words = d.ObjectiveName.split(/\s+/);
            let line = [];
            let lineNumber = 0;
            const lineHeight = 1.2;
            let tspan = text.append("tspan")
                .attr("x", d.x)
                .attr("dy", "0em");

            words.forEach((word) => {
                line.push(word);
                tspan.text(line.join(" "));

                if (tspan.node().getComputedTextLength() > rx * 1.8) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];

                    tspan = text.append("tspan")
                        .attr("x", d.x)
                        .attr("dy", `${++lineNumber * lineHeight}em`)
                        .text(word);
                }
            });

            // Adjust font size if text overflows ellipse
            if ((lineNumber + 1) * lineHeight * 12 > ry * 2) {
                text.attr("font-size", "8px");
            }
        });

    }, []);

    return <svg ref={svgRef}></svg>;
};

export default D3Chart;
