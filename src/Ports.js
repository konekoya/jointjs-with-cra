import React, { useEffect } from "react";
import * as joint from "jointjs";

const Ports = props => {
  useEffect(() => renderGraph());

  const renderGraph = () => {
    var graph = new joint.dia.Graph();
    new joint.dia.Paper({
      el: document.getElementById("paper-create"),
      width: 650,
      height: 200,
      gridSize: 1,
      model: graph
    });

    var m1 = new joint.shapes.devs.Model({
      position: { x: 50, y: 50 },
      size: { width: 90, height: 90 },
      inPorts: ["in1", "in2"],
      outPorts: ["out"],
      ports: {
        groups: {
          in: {
            attrs: {
              ".port-body": {
                fill: "#16A085"
              }
            }
          },
          out: {
            attrs: {
              ".port-body": {
                fill: "#E74C3C"
              }
            }
          }
        }
      },
      attrs: {
        ".label": { text: "Model", "ref-x": 0.5, "ref-y": 0.2 },
        rect: { fill: "#2ECC71" }
      }
    });
    graph.addCell(m1);
  };

  return <div id="paper-create">Hi, I'm Mr.Dump</div>;
};

export default Ports;
