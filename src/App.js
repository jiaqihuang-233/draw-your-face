import React from "react";
import "./App.css";
import Drawer from "./Drawer";
import Login from "./Login";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      user: null,
      userAnnotations: {}
    };
  }

  handleSubmit = (user) => {
    this.setState({
      loggedIn: true,
      user
    });
  }

  handleFileSave = (timestampId, annotations) => {
    this.setState((state, props) => {
      const userAnno = {};
      userAnno[this.state.user] = {
        timestampId,
        annotations
      };
      const userAnnotations = {
        ...state.userAnnotations,
        ...userAnno
      }
      return {
        ...state,
        userAnnotations
      }
    });
  }

  handleLogout = () => {
    this.setState({
      loggedIn: false
    });
  }

  render() {
    if (this.state.loggedIn) {
      return (
        <Drawer
          user={this.state.user}
          handleFileSave={this.handleFileSave}
          handleLogout={this.handleLogout}
          annos={this.state.userAnnotations[this.state.user]}
        />
      );
    } else {
      return <Login handleSubmit={this.handleSubmit} />;
    }
  }
}

export default App;
