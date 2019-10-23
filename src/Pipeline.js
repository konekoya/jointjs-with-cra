import React, { useEffect } from "react";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import * as joint from "jointjs";
import * as $ from "jquery";

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
      width: 600,
      height: 400,
      gridSize: 10,
      drawGrid: { name: "dot", args: { color: "black" } },
      defaultConnectionPoint: { name: "boundary" },
      background: {
        color: "rgb(245, 245, 245, .1)"
      },
      linkPinning: false,
      validateConnection: function(...rest) {
        return true;
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
      // Need to add graphScale to get the correct position
      console.log(graphScale);
      console.log(paper.scale());

      dragStartPosition = { x: x * graphScale, y: y * graphScale };
    });

    paper.on("cell:pointerup blank:pointerup", (cellView, x, y) => {
      if (dragStartPosition) {
        delete dragStartPosition.x;
        delete dragStartPosition.y;
      }
    });
  };

  const renderToolbar = () => {
    // Canvas from which you take shapes
    const toolbarGraph = new joint.dia.Graph(),
      toolbar = new joint.dia.Paper({
        el: $("#toolbar"),
        height: 80,
        model: toolbarGraph,
        interactive: false
      });

    const connector = new joint.shapes.basic.Rect({
      position: { x: 10, y: 10 },
      size: { width: 100, height: 40 },
      attrs: { text: { text: "Connector" }, rect: { magnet: true } }
    });

    const topic = new joint.shapes.basic.Circle({
      position: { x: 120, y: 10 },
      size: { width: 60, height: 60 },
      attrs: { text: { text: "Topic" }, circle: { magnet: true } }
    });

    toolbarGraph.addCells([connector, topic]);

    toolbar.on("cell:pointerdown", function(cellView, e, x, y) {
      $("body").append('<div id="flyPaper"></div>');

      const flyGraph = new joint.dia.Graph();

      new joint.dia.Paper({
        el: $("#flyPaper"),
        width: 200,
        height: 200,
        model: flyGraph,
        interactive: false
      });

      const flyShape = cellView.model.clone();
      const pos = cellView.model.position();
      const offset = {
        x: x - pos.x,
        y: y - pos.y
      };

      flyShape.position(0, 0);
      flyGraph.addCell(flyShape);

      $("#flyPaper").offset({
        left: e.pageX - offset.x,
        top: e.pageY - offset.y
      });

      $("body").on("mousemove.fly", e => {
        $("#flyPaper").offset({
          left: e.pageX - offset.x,
          top: e.pageY - offset.y
        });
      });

      $("body").on("mouseup.fly", e => {
        const x = e.pageX;
        const y = e.pageY;
        const target = paper.$el.offset();

        // Dropped over paper ?
        if (
          x > target.left &&
          x < target.left + paper.$el.width() &&
          y > target.top &&
          y < target.top + paper.$el.height()
        ) {
          const s = flyShape.clone();
          s.position(x - target.left - offset.x, y - target.top - offset.y);
          graph.addCell(s);
        }

        $("body")
          .off("mousemove.fly")
          .off("mouseup.fly");
        flyShape.remove();

        $("#flyPaper").remove();
      });
    });
  };

  useEffect(() => {
    renderGraph();
  });

  useEffect(() => {
    renderToolbar();
  });

  useEffect(() => {
    document.getElementById("canvas").addEventListener("mousemove", event => {
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

    graph.addCells(r);
  };

  const handleZoomIn = () => {
    graphScale += 0.2;
    paper.scale(graphScale, graphScale);
  };

  const handleZoomOut = () => {
    graphScale -= 0.2;
    paper.scale(graphScale, graphScale);
  };

  const handleFit = () => {
    paper.scaleContentToFit({ padding: 30 });

    console.log(paper.scale());

    graphScale = paper.scale().sx;
  };

  const handleReset = () => {
    paper.setOrigin(0, 0);
    paper.scale(1, 1);
    graphScale = 1;
  };

  const handleToJson = () => {
    const json = graph.toJSON();
    console.log(json);
  };

  return (
    <>
      <Paper id="canvas" className={classes.root}></Paper>
      <div id="toolbar"></div>

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
    </>
  );
};

export default Pipeline;
