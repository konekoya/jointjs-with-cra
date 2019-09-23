import React, { useEffect } from "react";
import * as joint from "jointjs";

const Graph = () => {
  console.log("hey");

  let cells = [];
  let graph = null;
  const renderGraph = () => {
    joint.shapes.devs.Model = joint.shapes.devs.Model.extend({
      markup:
        '<g class="element-node">' +
        '<rect class="body" rx="2px" ry="2px"></rect>' +
        '<text class="label">' +
        "</text>" +
        "</g>",
      portMarkup: `<g class="port"><circle class="port-body" r="6"/></g>`
    });

    const canvas = document.getElementById("canvas");

    console.log(canvas);
    graph = new joint.dia.Graph();

    var paper = new joint.dia.Paper({
      el: canvas,
      model: graph,
      width: canvas.offsetWidth,
      height: canvas.offsetHeight,
      gridSize: 20,
      drawGrid: { name: "fixed-dot", args: { color: "black" } },
      interactive: true
    });

    var headeredRectangle = new joint.shapes.standard.HeaderedRectangle();
    headeredRectangle.resize(150, 100);
    headeredRectangle.position(25, 610);
    headeredRectangle.attr("root/tabindex", 12);
    headeredRectangle.attr(
      "root/title",
      "joint.shapes.standard.HeaderedRectangle"
    );
    headeredRectangle.attr("header/fill", "#000000");
    headeredRectangle.attr("header/fillOpacity", 0.1);
    headeredRectangle.attr("headerText/text", "Header");
    headeredRectangle.attr("body/fill", "#fe854f");
    headeredRectangle.attr("body/fillOpacity", 0.5);
    headeredRectangle.attr("bodyText/text", "Headered\nRectangle");
    headeredRectangle.addTo(graph);

    headeredRectangle.set("inPorts", ["newIn1", "newIn2", "newIn3"]);
  };

  useEffect(() => {
    renderGraph();
  });

  const handleAddCell = () => {
    const cellLength = cells.length;

    if (cellLength === 0) {
      cells[0] = new joint.shapes.devs.Model({
        attrs: {
          ".label": {
            text: "Connector 1"
          }
        },
        inPorts: ["a"],
        outPorts: ["d"]
      });
    } else {
      cells[cellLength] = cells[0].clone();
      cells[cellLength].translate(
        (-140 * cellLength) / 3,
        (-100 * cellLength) / 3
      );

      cells[cellLength].attr(".element-node/data-color", "black");
      cells[cellLength].attr(".label/text", "Connector " + cells.length);
    }

    graph.addCells(cells);
  };

  return (
    <>
      <label id="message" />
      <div id="canvas" />
      <button onClick={handleAddCell}>Add Node</button>
    </>
  );
};

export default Graph;
