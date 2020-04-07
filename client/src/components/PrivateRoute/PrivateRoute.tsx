import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useAppState } from '../../state';

export default function PrivateRoute({ children, ...rest }: RouteProps) {
  const { isAuthReady, user } = useAppState();

  const renderChildren = (user && user.displayName) || !process.env.REACT_APP_SET_AUTH;
  const notLoggedIn = !user;

  if (!renderChildren && !isAuthReady) {
    return null;
  }

  return (
    <Route
      {...rest}
      render={({ location }) =>
        renderChildren ? (
          children
        ) : notLoggedIn ? (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        ) : (
          <Redirect
            to={{
              pathname: '/user_setup',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}
