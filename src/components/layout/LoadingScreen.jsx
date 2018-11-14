import React, { Component } from 'react';

export default class LoadingScreen extends Component {
  render() {
    return (
      <div className="container-fluid">
        <div className="d-flex justify-content-center">
          <div className="lds-ripple" />
        </div>
      </div>
    );
  }
}
