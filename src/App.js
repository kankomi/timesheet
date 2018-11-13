import React, { Component } from 'react';
import { Provider } from 'react-redux';
import Timesheet from './components/Timesheet';

import store from './store';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="container">
          <Timesheet />
        </div>
      </Provider>
    );
  }
}

export default App;
