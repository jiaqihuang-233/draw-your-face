import React from 'react';

class Drawer extends React.Component {
    constructor(props) {
      super(props);
      this.viewer = React.createRef();
      this.docViewer = null;
      this.annotManager = null;
      this.instance = null;
    }
  
      async componentDidMount() {
        const instance = await window.WebViewer({
            path: '/lib',
            initialDoc: '/files/bgimg.png'
        }, this.viewer.current);

        this.instance = instance;
        this.docViewer = instance.docViewer;
        this.annotManager = instance.annotManager;
        instance.setAdminUser(true);
        instance.setAnnotationUser(this.props.user);

        //disable other anno tools except for freehand
        instance.setHeaderItems( header => {
            const items = header.getItems();
            const removed = items.filter(item => !(item.type === 'toolButton' 
                                                    || item.type === 'statefulButton'
                                                    || (item.type === 'toolGroupButton' && item.toolGroup !== 'freeHandTools')));
            console.log(removed);
            header.update(removed);
          });

      }

      //listener for drawing

      //update timstamp whenever drawing is done.

      //add a save button, see https://www.pdftron.com/documentation/web/guides/customizing-header?searchTerm=disable#toolbutton
  
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
  