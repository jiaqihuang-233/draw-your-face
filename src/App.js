import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.viewer = React.createRef();
    this.docViewer = null;
    this.annotManager = null;
    this.instance = null;
  }

  componentDidMount() {
    console.log(window.WebViewer);
  }

  render() {
    return (
      <div className="App">
        <div className="header">React sample</div>
        <div className="webviewer" ref={this.viewer}></div>
      </div>
    );
  }
}

export default App;
