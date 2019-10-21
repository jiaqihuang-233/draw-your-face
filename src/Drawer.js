import React from "react";
import { observable } from "mobx";
import { saveAs } from 'file-saver';

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
    this.annoListLength = observable.box(0);

    this.annoListLength.observe(change => {
      if (change.newValue === 1) {
        this.createTimeStamp(Date.now());
      } else if (change.newValue > 2) {
        this.updateTimeStamp(Date.now());
      }
    });

    instance.setAdminUser(true);
    instance.setAnnotationUser(this.props.user);

    //disable other anno tools except for freehand
    instance.setHeaderItems(header => {
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
        img:
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>',
        onClick: () => {
          /**@TODO save the annotations */
          const options = {
            xfdfString: this.docViewer.getAnnotationManager().exportAnnotations()
          };
          const data = this.docViewer.getDocument().getFileData(options);
          const blob = new Blob([new Uint8Array(data)], {
            type: "application/pdf"
          });
          saveAs(blob, this.props.user + '.pdf');
        }
      };
      const updatedButtons = [...removed, saveButton];
      header.update(updatedButtons);
    });

    //add event listener for annotation added
    this.annotManager.on("annotationChanged", (event, annotations, action) => {
      if (action === "add") {
        this.annoListLength.set(this.annotManager.getAnnotationsList().length);
      }
    });
  }

  createTimeStamp(time) {
    const Annotations = this.instance.Annotations;
    const timestamp = new Annotations.FreeTextAnnotation();
    /**@TODO position the timestamp on the right bottom of the page */
    timestamp.X = 300;
    timestamp.Y = 300;
    timestamp.Width = 300;
    timestamp.Height = 50;
    timestamp.MaintainAspectRatio = true;
    timestamp.TextAlign = "center";
    timestamp.ReadOnly = true;
    timestamp.StrokeThickness = 0;
    /**@TODO get rid of the border box */
    timestamp.setPadding(new Annotations.Rect(0, 0, 0, 0));
    timestamp.FontSize = "20pt";
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
