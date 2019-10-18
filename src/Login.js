import React from 'react';

class Login extends React.Component {
    constructor(props) {
      super(props);
      this.state = {value: 'coconut'};
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event) {
      this.setState({value: event.target.value});
    }
  
    handleSubmit(event) {
      event.preventDefault();
      this.props.handleSubmit(this.state.value);
    }
  
    render() {
      return <div className="users">
        <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
        <label>
          Pick a user: <br></br>
          <select>
          <option value="mboopi">Mboopi</option>
            <option value="vvd">Van Dijk</option>
            <option value="neymar">Neymar</option>
            <option value="dybala">Dybala</option>
          </select>
        </label>
        <input type="submit" value="Submit" />
      </form>
    </div>
    }
}

export default Login;