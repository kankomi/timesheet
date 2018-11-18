import React, { Component } from 'react';
import { firebaseConnect, isEmpty } from 'react-redux-firebase';

class NavBar extends Component {
  logout = () => {
    this.props.firebase.logout();
  };

  print = () => {
    window.print();
  };

  render() {
    return (
      <nav className="navbar navbar-light bg-light">
        <span className="navbar-brand h1 mb-0">Zeiterfassung</span>
        {!isEmpty(this.props.firebase.auth) ? (
          <div>
            <button
              className="btn btn-primary btn-sm mr-3"
              onClick={this.print}
            >
              Drucken
            </button>

            <button className="btn btn-light-sm btn-sm" onClick={this.logout}>
              Ausloggen
            </button>
          </div>
        ) : (
          ''
        )}
      </nav>
    );
  }
}

export default firebaseConnect()(NavBar);
