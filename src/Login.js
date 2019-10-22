import React from "react";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: "Mboopi" };
  }

  handleChange = (event) => {
    this.setState({ value: event.target.value });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.handleSubmit(this.state.value);
  }

  render() {
    return (
      <div className="login">
        <form onSubmit={this.handleSubmit}>
          <div className="selection">
            <label>
              Pick a user: <br></br>
              <select className="users" onChange={this.handleChange}>
                <option value="Mboopi">Mboopi</option>
                <option value="Van Dijk">Van Dijk</option>
                <option value="Neymar">Neymar</option>
                <option value="Dybala">Dybala</option>
              </select>
            </label>
            <input type="submit" value="Submit" />
          </div>
        </form>
      </div>
    );
  }
}

export default Login;
