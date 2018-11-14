import React, { Component } from 'react';
import { firebaseConnect, isEmpty } from 'react-redux-firebase';

class NavBar extends Component {
  logout = () => {
    this.props.firebase.logout();
  };
  render() {
    return (
      <nav className="navbar navbar-light bg-light">
        <span className="navbar-brand h1 mb-0">Zeiterfassung</span>
        {!isEmpty(this.props.firebase.auth) ? (
          <button
            className="btn btn-light-sm btn-sm"
            value="Ausloggen"
            onClick={this.logout}
          >
            Ausloggen
          </button>
        ) : (
          ''
        )}
      </nav>
    );
  }
}

export default firebaseConnect()(NavBar);
