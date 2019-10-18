import React from 'react';

class Drawer extends React.Component {
    constructor(props) {
      super(props);
      this.viewer = React.createRef();
      this.docViewer = null;
      this.annotManager = null;
      this.instance = null;
    }
  
      componentDidMount() {
        
      }
  
      render() {
          return (
            <div>
                <h1>{this.props.user}</h1>
            </div>
          );
      }  
}

export default Drawer;
  