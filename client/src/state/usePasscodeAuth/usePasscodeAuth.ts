import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { User } from '../../state';
import gql from 'graphql-tag';
import { useMutation, useApolloClient } from '@apollo/react-hooks';

const REGISTER = gql`
  mutation Register($passcode: String!, $displayName: String!, $photoURL: String) {
    register(passcode: $passcode, displayName: $displayName, photoURL: $photoURL) {
      identity
      displayName
      photoURL
      websocketToken
      admin
    }
  }
`;

const VERIFY_PASSCODE = gql`
  mutation VerifyPasscode($passcode: String!) {
    verifyPasscode(passcode: $passcode)
  }
`;

export function getStoredUser() {
  const match = window.location.search.match(/passcode=(.*)&?/);
  const storedUser = JSON.parse(window.sessionStorage.getItem('user') || '{}');
  const passcode = match ? { passcode: match[1] } : storedUser;
  return passcode;
}

export function fetchToken(name: string, room: string, passcode: string) {
  return fetch(`/api/token`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ identity: name, roomName: room, passcode }),
  });
}

export function getErrorMessage(message: string) {
  switch (message) {
    case 'passcode incorrect':
      return 'Passcode is incorrect';
    case 'passcode expired':
      return 'Passcode has expired';
    default:
      return message;
  }
}

export default function usePasscodeAuth() {
  const history = useHistory();

  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [authError, setAuthError] = useState<Error | undefined>(undefined);
  const graphClient = useApolloClient();

  const onRegistered = useCallback(
    data => {
      const newUser = {
        ...user,
        ...data.register,
      };
      setUser(newUser);
      window.sessionStorage.setItem('user', JSON.stringify(newUser));
      setIsAuthReady(true);
      //@ts-ignore
      graphClient.restartWebsocketConnection();
    },
    [user]
  );
  const onVerified = useCallback((data: any) => {
    if (data.verifyPasscode) {
      setUser({ passcode: data.verifyPasscode } as any);
      window.sessionStorage.setItem('passcode', data.verifyPasscode);
    } else {
      setAuthError(Error(getErrorMessage('Passode invalid')));
    }
  }, []);
  const onInvalidPasscode = useCallback(() => {
    setAuthError(Error(getErrorMessage('Passode invalid')));
  }, []);
  const [register] = useMutation(REGISTER, {
    onCompleted: onRegistered,
  });
  const [verifyPasscode] = useMutation(VERIFY_PASSCODE, {
    onCompleted: onVerified,
    onError: onInvalidPasscode,
  });

  const getToken = useCallback(
    (name: string, room: string) => {
      return fetchToken(name, room, user?.passcode || '')
        .then(res => res.json())
        .then(res => res.token as string);
    },
    [user]
  );

  useEffect(() => {
    const storedUser = getStoredUser();
    const passcode = window.sessionStorage.getItem('passcode');

    if (passcode) {
      register({
        variables: {
          displayName: storedUser.displayName,
          photoURL: storedUser.photoURL,
          passcode,
        },
      });
    } else {
      setIsAuthReady(true);
    }
  }, [history, register]);

  const signIn = useCallback(
    (passcode: string) => {
      verifyPasscode({ variables: { passcode } });

      return Promise.resolve();
    },
    [verifyPasscode]
  );

  const signOut = useCallback(() => {
    setUser(null);
    window.sessionStorage.removeItem('user');
    window.sessionStorage.removeItem('passcode');
    return Promise.resolve();
  }, []);

  const setUserNameAvatar = (displayName: string, photoURL?: string) => {
    console.log('setting');
    const identity = user?.identity ? user.identity : new Date().getTime().toString();
    const newUser = { ...user, identity, displayName, photoURL };
    setUser(newUser as any);
    window.sessionStorage.setItem('user', JSON.stringify(newUser));
    register({
      variables: newUser,
    });
    return Promise.resolve();
  };

  return { user, setUser: setUserNameAvatar, isAuthReady, getToken, signIn, signOut, authError };
}
