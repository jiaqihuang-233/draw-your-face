import React from 'react';

class Login extends React.Component {
    constructor(props) {
      super(props);
      this.state = {value: 'Mboopi'};
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event) {
      console.log(event.target.value)
      this.setState({value: event.target.value});
    }
  
    handleSubmit(event) {
      event.preventDefault();
      this.props.handleSubmit(this.state.value);
    }
  
    render() {
      return <div className="users">
        <form onSubmit={this.handleSubmit} >
        <label>
          Pick a user: <br></br>
          <select onChange={this.handleChange}>
          <option value="Mboopi">Mboopi</option>
            <option value="Van Dijk">Van Dijk</option>
            <option value="Neymar">Neymar</option>
            <option value="Dybala">Dybala</option>
          </select>
        </label>
        <input type="submit" value="Submit" />
      </form>
    </div>
    }
}

export default Login;