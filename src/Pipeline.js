import React, { useEffect } from "react";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import * as joint from "jointjs";

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  },
  input: {
    display: "none"
  }
}));

const Pipeline = () => {
  let graph = null;
  let paper = null;
  let graphScale = 1;
  let dragStartPosition = null;

  const classes = useStyles();

  const renderGraph = () => {
    graph = new joint.dia.Graph();

    paper = new joint.dia.Paper({
      el: document.getElementById("canvas"),
      model: graph,
      width: 500,
      height: 300,
      gridSize: 10,
      drawGrid: { name: "dot", args: { color: "black" } },
      defaultConnectionPoint: { name: "boundary" },
      background: {
        color: "rgb(245, 245, 245, .1)"
      },
      linkPinning: false,
      validateConnection: function(...rest) {
        console.log(rest);
        return true;
        // if (magnetS && magnetS.getAttribute("port-group") === "in")
        //   return false;
        // // Prevent linking from output ports to input ports within one element.
        // if (cellViewS === cellViewT) return false;
        // // Prevent linking to input ports.
        // return magnetT && magnetT.getAttribute("port-group") === "in";
      },
      defaultAnchor: {
        name: "modelCenter",
        args: {
          rotate: true,
          padding: 20
        }
      },
      defaultLink: new joint.dia.Link({
        attrs: {
          ".connection": { "stroke-width": 2 },
          ".marker-source": {
            d: "M 0 0 a 5 5 0 1 0 0 1",
            "stroke-width": 0,
            fill: "#232E78"
          },
          ".marker-target": {
            d: "M 10 -5 10 5 0 0 z",
            "stroke-width": 0,
            fill: "#232E78"
          }
        },
        labels: [
          {
            position: 0.5,
            attrs: { text: { text: "link", "font-weight": "bold" } }
          }
        ]
      })
    });

    graph.on("change:source change:target", link => {
      if (link.get("source").id && link.get("target").id) {
        // both ends of the link are connected.
        console.log("connected");
      }
    });

    paper.on("cell:pointerclick", (...args) => {
      console.log("clicked");
      console.log(args);
    });

    paper.on("blank:pointerdown", (event, x, y) => {
      const scale = joint.V(paper.viewport).scale();
      console.log(scale);

      dragStartPosition = { x: x * scale.sx, y: y * scale.sy };
      // dragStartPosition = { x: x, y: y };
    });

    paper.on("cell:pointerup blank:pointerup", (cellView, x, y) => {
      if (dragStartPosition) {
        delete dragStartPosition.x;
        delete dragStartPosition.y;
      }
    });
  };

  useEffect(() => {
    renderGraph();
  });

  useEffect(() => {
    document.getElementById("diagram").addEventListener("mousemove", event => {
      if (
        dragStartPosition &&
        typeof dragStartPosition.x !== "undefined" &&
        typeof dragStartPosition.y !== "undefined"
      )
        paper.translate(
          event.offsetX - dragStartPosition.x,
          event.offsetY - dragStartPosition.y
        );
    });
  });

  const handleAddConnector = () => {
    var r = new joint.shapes.basic.Rect({
      position: { x: 50, y: 50 },
      size: { width: 100, height: 40 },
      attrs: { text: { text: "Connector" }, rect: { magnet: true } }
    });

    graph.addCells(r);
  };

  const handleAddTopic = () => {
    var r = new joint.shapes.basic.Circle({
      position: { x: 30, y: 30 },
      size: { width: 80, height: 80 },
      attrs: { text: { text: "Topic" }, circle: { magnet: true } }
    });

    // var Circle = joint.dia.Element.define("i.Circle", {
    //   markup: "<g><circle/><text/></g>>",
    //   attrs: {
    //     circle: {
    //       magnet: "passive",
    //       r: 20
    //     },
    //     text: {
    //       fill: "white",
    //       fontSize: 8,
    //       xAlignment: "middle",
    //       yAlignment: "middle"
    //     }
    //   }
    // });

    // var r = new Circle()
    //   .position(337, 50)
    //   .attr("circle/fill", "#a6a6a6")
    //   .attr("circle/r", 30)
    //   .attr("circle/magnet", true)
    //   .attr("text/text", "MAGNET");

    graph.addCells(r);
  };

  const handleZoomIn = () => {
    graphScale += 0.1;
    paper.scale(graphScale, graphScale);
  };

  const handleZoomOut = () => {
    graphScale -= 0.1;
    paper.scale(graphScale, graphScale);
  };

  const handleFit = () => {
    paper.scaleContentToFit({ padding: 30 });
  };

  const handleReset = () => {
    paper.setOrigin(0, 0);
    paper.scale(graphScale, graphScale);
  };

  const handleToJson = () => {
    const json = graph.toJSON();
    console.log(json);
  };
  return (
    <div id="diagram">
      <Paper id="canvas" className={classes.root}></Paper>

      <Button
        onClick={handleAddConnector}
        variant="contained"
        color="primary"
        className={classes.button}
      >
        Add Connector
      </Button>

      <Button
        onClick={handleAddTopic}
        variant="contained"
        color="primary"
        className={classes.button}
      >
        Add Topic
      </Button>
      <button onClick={handleZoomIn}>Zoom In</button>
      <button onClick={handleZoomOut}>Zoom Out</button>
      <button onClick={handleReset}>Reset</button>
      <button onClick={handleFit}>Fit to content</button>
      <button onClick={handleToJson}>Convert to JSON</button>
    </div>
  );
};

export default Pipeline;
