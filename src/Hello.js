import React, { useEffect } from "react";
import * as joint from "jointjs";

const Hello = props => {
  useEffect(() => {
    renderGraph();
  }, []);

  const renderGraph = () => {
    var graph = new joint.dia.Graph();

    var paper = new joint.dia.Paper({
      el: document.getElementById("myholder"),
      model: graph,
      width: 600,
      height: 300,
      gridSize: 10,
      drawGrid: { name: "mesh", args: { color: "black" } },
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
        strokeWidth: 1,
        sourceMarker: {
          type: "path",
          stroke: "black",
          fill: "red",
          d: "M 10 -5 0 0 10 5 Z"
        },
        targetMarker: {
          type: "path",
          stroke: "black",
          fill: "yellow",
          d: "M 10 -5 0 0 10 5 Z"
        }
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

    var rect3 = new joint.shapes.standard.Rectangle();
    rect3.position(100, 130);
    rect3.resize(100, 40);
    rect3.attr({
      body: {
        fill: "#E74C3C",
        rx: 20,
        ry: 20,
        strokeWidth: 0
      },
      label: {
        text: "Hello",
        fill: "#ECF0F1",
        fontSize: 11,
        fontVariant: "small-caps"
      }
    });
    rect3.addTo(graph);

    var rect4 = new joint.shapes.standard.Rectangle();
    rect4.position(400, 130);
    rect4.resize(100, 40);
    rect4.attr({
      body: {
        fill: "#8E44AD",
        strokeWidth: 0
      },
      label: {
        text: "World!",
        fill: "white",
        fontSize: 13
      }
    });
    rect4.addTo(graph);

    var link2 = new joint.shapes.standard.Link();
    link2.source(rect3);
    link2.target(rect4);
    link2.router("metro", { maxAllowedDirectionChange: 100 });
    link2.connector("jumpover");
    link2.attr({
      line: {
        stroke: "gray",
        strokeWidth: 4
      }
    });
    link2.addTo(graph);

    var link3 = new joint.shapes.standard.Link();
    link3.source(rect3);
    link3.target(rect4);
    link3.connector("jumpover", { size: 10 });
    link3.addTo(graph);
  };

  return <div id="myholder" />;
};

export default Hello;
