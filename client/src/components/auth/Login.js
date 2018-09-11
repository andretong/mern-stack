import React from 'react';
import PropTypes from 'prop-types';

class Login extends React.Component {

  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e){
    this.setState({
      [e.target.name] : e.target.value
    });
  }

  onSubmit(e){
    //To avoid default behavior of Form
    e.preventDefault();

    const user = {
      email : this.state.email,
      password : this.state.password
    }

    console.log("Is submiting " + JSON.stringify(user));
  }

  render () {
    const { errors } = this.state;

    return (
      <div className="login">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Log In</h1>
              <p className="lead text-center">Sign in to your DevConnector account</p>
              <form onSubmit={this.onSubmit}>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Email Address"
                  name="email"
                  type="email"
                  value={this.state.email}
                  onChange={this.onChange}
                />

                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Password"
                  name="password"
                  type="password"
                  value={this.state.password}
                  onChange={this.onChange}
                />
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Login;
