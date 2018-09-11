import React from 'react';
import axios from 'axios';
import classnames from 'classnames';

class Register extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      password: '',
      password2: '',
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

    const newUser = {
      name : this.state.name,
      email : this.state.email,
      password : this.state.password,
      password2 : this.state.password2,
    }

    console.log("Is submiting " + JSON.stringify(newUser));

    axios.post('/api/users/register', newUser)
      .then(res => console.log(res.data))
      .catch(err => this.setState({errors: err.response.data}));

  }

  render () {
    const { errors } = this.state;

    return (
      <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Sign Up</h1>
              <p className="lead text-center">Create your DevConnector account</p>
              <form noValidate onSubmit={this.onSubmit}>
                <input
                  type="text"
                  className={
                    classnames('form-control form-control-lg',
                      {
                        'is-invalid' : errors.name
                      }
                    )
                  }
                  placeholder="Name"
                  name="name"
                  value={this.state.name}
                  onChange={this.onChange}
                />
                {errors.name && (<div className="invalid-feedback">{errors.name}</div>)}
                <input
                  type="text"
                  className={
                    classnames('form-control form-control-lg',
                      {
                        'is-invalid' : errors.email
                      }
                    )
                  }
                  placeholder="Email"
                  name="email"
                  type="email"
                  value={this.state.email}
                  onChange={this.onChange}
                />
                {errors.email && (<div className="invalid-feedback">{errors.email}</div>)}
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder={
                    classnames('form-control form-control-lg',
                      {
                        'is-invalid' : errors.password
                      }
                    )
                  }
                  name="password"
                  type="password"
                  value={this.state.password}
                  onChange={this.onChange}
                />
                {errors.password && (<div className="invalid-feedback">{errors.password}</div>)}
                <input
                  type="text"
                  className={
                    classnames('form-control form-control-lg',
                      {
                        'is-invalid' : errors.password2
                      }
                    )
                  }
                  placeholder="Confirm Password"
                  name="password2"
                  type="password"
                  value={this.state.password2}
                  onChange={this.onChange}
                />
              {errors.password2 && (<div className="invalid-feedback">{errors.password2}</div>)}
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Register;
