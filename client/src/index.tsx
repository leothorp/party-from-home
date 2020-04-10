import React from 'react';
import ReactDOM from 'react-dom';

import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';

import App from './App';
import AppStateProvider, { useAppState } from './state';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { ConnectOptions } from 'twilio-video';
import ErrorDialog from './components/ErrorDialog/ErrorDialog';
import LoginPage from './components/LoginPage/LoginPage';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import theme from './theme';
import './types';
import { VideoProvider } from './components/VideoProvider';
import UserSetup from './components/UserSetup/UserSetup';
import useMocks from './dev/useMocks';
import { ApolloProvider } from '@apollo/react-hooks';
import apolloClient from './graph';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';

// See: https://media.twiliocdn.com/sdk/js/video/releases/2.0.0/docs/global.html#ConnectOptions
// for available connection options.
const connectionOptions: ConnectOptions = {
  bandwidthProfile: {
    video: {
      dominantSpeakerPriority: 'high',
      mode: 'collaboration',
      renderDimensions: {
        high: { height: 1080, width: 1920 },
        standard: { height: 90, width: 160 },
        low: { height: 56.25, width: 100 },
      },
    },
  },
  dominantSpeaker: true,
  maxAudioBitrate: 12000,
  networkQuality: { local: 1, remote: 1 },
  preferredVideoCodecs: [{ codec: 'VP8', simulcast: true }],
};

const VideoApp = () => {
  const { error, setError } = useAppState();
  useMocks.use();

  return (
    <ErrorBoundary>
      <VideoProvider options={connectionOptions} onError={setError}>
        <ErrorDialog dismissError={() => setError(null)} error={error} />
        <App />
      </VideoProvider>
    </ErrorBoundary>
  );
};

// note(carlos): scrollbars on Windows suck and always show up, so this is a hack to hide them
if (navigator.appVersion.indexOf('Win') !== -1) {
  const style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = `
      div::-webkit-scrollbar {
        display: none;
      }

      /* Hide scrollbar for IE and Edge */
      div {
        -ms-overflow-style: none;
      }
  `;
  document.getElementsByTagName('head')[0].appendChild(style);
}

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <ApolloProvider client={apolloClient}>
      <Router>
        <AppStateProvider>
          <Switch>
            <PrivateRoute exact path="/">
              <VideoApp />
            </PrivateRoute>
            <PrivateRoute path="/room/:URLRoomName">
              <VideoApp />
            </PrivateRoute>
            <Route path="/login">
              <LoginPage />
            </Route>
            <Route path="/user_setup">
              <UserSetup />
            </Route>
            <Redirect to="/" />
          </Switch>
        </AppStateProvider>
      </Router>
    </ApolloProvider>
  </MuiThemeProvider>,
  document.getElementById('root')
);
