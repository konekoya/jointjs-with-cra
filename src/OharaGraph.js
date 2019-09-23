import React, { useEffect } from "react";
import * as joint from "jointjs";

const OharaGraph = props => {
  useEffect(() => {
    renderGraph();
  }, []);

  const renderGraph = () => {
    var graph = new joint.dia.Graph();

    var paper = new joint.dia.Paper({
      el: document.getElementById("ohara"),
      model: graph,
      width: 600,
      height: 300,
      background: {
        color: "rgba(0, 255, 0, 0.3)"
      }
    });

    var rect = new joint.shapes.standard.Rectangle();
    rect.position(100, 30);
    rect.resize(100, 40);
    rect.attr({
      body: {
        fill: "blue"
      },
      label: {
        text: "Hello",
        fill: "white"
      }
    });
    rect.addTo(graph);

    var rect2 = new joint.shapes.standard.Rectangle();
    rect2.position(400, 30);
    rect2.resize(100, 40);
    rect2.attr({
      body: {
        fill: "#2C3E50",
        rx: 5,
        ry: 5,
        strokeWidth: 2
      },
      label: {
        text: "World!",
        fill: "#3498DB",
        fontSize: 18,
        fontWeight: "bold",
        fontVariant: "small-caps"
      }
    });
    rect2.addTo(graph);

    var link = new joint.shapes.standard.Link();
    link.source(rect);
    link.target(rect2);
    link.attr({
      line: {
        stroke: "blue",
        strokeWidth: 1
      }
    });
    link.labels([
      {
        attrs: {
          text: {
            text: "Hello, World!"
          }
        }
      }
    ]);
    link.addTo(graph);
  };

  return <div id="ohara" />;
};

export default OharaGraph;
