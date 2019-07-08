import React, { useEffect } from "react";
import joint from "joinjs";

const Hello = props => {
  useEffect(() => {
    var graph = new joint.dia.Graph();
    var paper = new joint.dia.Paper({
      el: document.getElementById("myholder"),
      model: graph,
      width: 600,
      height: 300,
      gridSize: 10,
      drawGrid: true,
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
  });

  return <div id="myholder">Hi, I'm Mr.Dump</div>;
};

export default Hello;
