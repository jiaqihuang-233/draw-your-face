import React from "react";
import { observable } from "mobx";
import { saveImg, leaveImg } from "./icons";

const moment = require("moment");

class Drawer extends React.Component {
  constructor(props) {
    super(props);
    this.viewer = React.createRef();
    this.docViewer = null;
    this.annotManager = null;
    this.instance = null;
    this.annoListLength = 0;
    this.timestampText = null;
  }

  async componentDidMount() {
    const instance = await window.WebViewer(
      {
        path: "/lib",
        initialDoc: "/files/bgimg.png"
      },
      this.viewer.current
    );

    this.instance = instance;
    this.docViewer = instance.docViewer;
    this.annotManager = instance.annotManager;

    instance.setAnnotationUser(this.props.user);

    //only enable freehand tool
    instance.disableTools();
    instance.enableTools(["AnnotationCreateFreeHand"]);

    //disable search button and left comment panel
    instance.disableElements(["searchButton", "leftPanel", "leftPanelButton"]);

    //set default annotation style for drawing pen
    this.docViewer.getTool("AnnotationCreateFreeHand").setStyles(() => {
      return {
        StrokeThickness: 5,
        StrokeColor: new instance.Annotations.Color(0, 0, 255)
      };
    });

    this.docViewer.on("documentLoaded", () => {
      //load annotations for this user if it exists
      if (this.props.annos) {
        const { annotations, timestampId } = this.props.annos;
        this.annotManager.importAnnotations(annotations); //won't work if document hasn't loaded yet
        this.timestampText = this.annotManager.getAnnotationById(timestampId);
      }
    });

    //observe on the number of annotations
    this.annoListLength = observable.box(
      this.annotManager.getAnnotationsList().length
    );
    this.annoListLength.observe(change => {
      if (change.newValue === 1) {
        this.createTimeStamp(Date.now());
      } else if (change.newValue > 2 && this.timestampText) {
        this.updateTimeStamp(Date.now());
      }
    });

    //disable other anno tools except for freehand
    this.setHeader();

    //add event listener for annotation added
    this.annotManager.on("annotationChanged", (event, annotations, action) => {
      if (action === "add") {
        this.annoListLength.set(this.annotManager.getAnnotationsList().length);
      }
    });
  }

  setHeader() {
    this.instance.setHeaderItems(header => {
      const items = header.getItems();
      const removed = items.filter(
        item =>
          !(
            item.type === "toolButton" ||
            item.type === "statefulButton" ||
            (item.type === "toolGroupButton" &&
              item.toolGroup !== "freeHandTools")
          )
      );
      const saveButton = {
        type: "actionButton",
        img: saveImg,
        onClick: async () => {
          const xfdfString = this.docViewer
            .getAnnotationManager()
            .exportAnnotations();
          const data = await this.docViewer
            .getDocument()
            .getFileData({ xfdfString });
          // //download
          // const blob = new Blob([new Uint8Array(data)], {
          //   type: "application/pdf"
          // });
          // saveAs(blob, this.props.user + '.pdf');
          //export and save annotations
          this.props.handleFileSave(this.timestampText.Id, xfdfString);
        }
      };

      const leaveButton = {
        type: "actionButton",
        img: leaveImg,
        onClick: () => {
          this.props.handleLogout();
        }
      };

      const updatedButtons = [...removed, saveButton, leaveButton];
      header.update(updatedButtons);
    });
  }

  createTimeStamp(time) {
    const Annotations = this.instance.Annotations;
    const timestamp = new Annotations.FreeTextAnnotation();
    timestamp.setWidth(300);
    timestamp.setHeight(40);
    /**@TODO position the timestamp on the right bottom of the page without magic numbers */
    // viewer coordinates, see - https://www.pdftron.com/documentation/web/guides/coordinates
    const zoom = this.docViewer.getZoom();
    // timestamp.setX(this.docViewer.getPageWidth(0)*zoom - 300);
    // timestamp.setY(this.docViewer.getPageHeight(0)*zoom/2);
    timestamp.setX(330);
    timestamp.setY(420);
    timestamp.MaintainAspectRatio = true;
    timestamp.TextAlign = "center";
    timestamp.ReadOnly = true;
    timestamp.StrokeThickness = 0;
    timestamp.setPadding(new Annotations.Rect(0, 0, 0, 0));
    timestamp.FontSize = "18pt";
    timestamp.TextColor = new Annotations.Color(255, 255, 255, 1);

    //convert timestamp into human readable text
    const timeStr = moment(time).format("YYYY-MM-DD hh:mm:ss");
    timestamp.setContents(timeStr);
    this.annotManager.addAnnotation(timestamp);
    this.annotManager.redrawAnnotation(timestamp);
    this.timestampText = timestamp;
  }

  updateTimeStamp(time) {
    //convert timestamp into human readable text
    const timeStr = moment(time).format("YYYY-MM-DD hh:mm:ss");
    this.timestampText.setContents(timeStr);
    this.annotManager.redrawAnnotation(this.timestampText);
  }

  render() {
    return (
      <div className="App">
        <div className="header">{this.props.user}</div>
        <div className="webviewer" ref={this.viewer}></div>
      </div>
    );
  }
}

export default Drawer;
