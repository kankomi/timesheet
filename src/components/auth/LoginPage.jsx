import React, { Component } from 'react';
import { firebaseConnect } from 'react-redux-firebase';

class LoginPage extends Component {
  state = { email: '', password: '', errorMessage: null };

  onSubmit = async e => {
    e.preventDefault();
    const { firebase } = this.props;
    const { email, password } = this.state;
    try {
      await firebase.login({ email, password });
      this.props.history.push('/');
    } catch (err) {
      console.log(err.message);
      this.setState({ ...this.state, errorMessage: 'Ungültiger Login' });
    }
  };

  render() {
    return (
      <div className="row">
        <div className="col-md-3 mx-auto mt-3">
          <div className="card">
            <div className="card-body">
              <h1 className="text-center pb-4 pt-3">
                <span className="text-primary">
                  <i className="fas fa-lock" />
                  Login
                </span>
              </h1>
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="text"
                    className="form-control"
                    name="email"
                    id="email"
                    required
                    value={this.state.email}
                    onChange={e =>
                      this.setState({ ...this.state, email: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Passwort</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    id="password"
                    required
                    value={this.state.password}
                    onChange={e =>
                      this.setState({ ...this.state, password: e.target.value })
                    }
                  />
                </div>
                <div className="invalid-feedback d-block mb-3">
                  {this.state.errorMessage}
                </div>
                <input
                  type="submit"
                  value="Einloggen"
                  className="btn btn-primary btn-block"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default firebaseConnect()(LoginPage);
