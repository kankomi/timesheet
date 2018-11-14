import React from 'react';
import { isEmpty } from 'react-redux-firebase';
import { Redirect, Route } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={(props, auth) =>
      isEmpty(auth) ? <Redirect to="/login" /> : <Component {...props} />
    }
  />
);

export default ProtectedRoute;
