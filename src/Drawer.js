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
            const saveButton = {
                type: 'actionButton',
                img: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>',
                onClick: function() {
                  /**@TODO save the annotations */
                }
            };
            const updatedButtons = [...removed, saveButton];
            console.log(updatedButtons);
            header.update(updatedButtons);
          });

      }

      //listener for drawing

      //update timstamp whenever drawing is done. can use Moment.js to display time stamp

  
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
  