import React from 'react';
import './App.css';
import Drawer from './Drawer';
import Login from './Login';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      user: null
    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(user) {
    this.setState({
      loggedIn: true,
      user
    })
    console.log(user);
  }

  render() {
    if(this.state.loggedIn) {
      return <Drawer user={this.state.user} />;
    } else {
      return <Login handleSubmit={this.handleSubmit} />;
    }
  }
}



export default App;
