import React, { Component } from 'react';
import { Provider } from 'react-redux';
import Timesheet from './components/Timesheet';
import LoginPage from './components/auth/LoginPage';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { UserIsAuthenticated } from './utils/auth';

import store from './store';
import NavBar from './components/layout/NavBar';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <React.Fragment>
          <NavBar />
          <Router>
            <Switch>
              <Route exact path="/login" component={LoginPage} />
              <Route
                exact
                path="/"
                component={UserIsAuthenticated(Timesheet)}
              />
            </Switch>
          </Router>
        </React.Fragment>
      </Provider>
    );
  }
}

export default App;
