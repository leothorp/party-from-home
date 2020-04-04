import React, { createContext, useContext, useState } from 'react';
import { TwilioError } from 'twilio-video';
import usePasscodeAuth from './usePasscodeAuth/usePasscodeAuth';

export interface User {
  identity: string;
  displayName: string;
  photoURL: string;
  passcode?: string;
  token?: string;
  admin?: boolean;
}

export interface StateContextType {
  error: TwilioError | null;
  setError(error: TwilioError | null): void;
  user?: User | null;
  setUser?(displayName: string, photoURL?: string): Promise<void>;
  signIn?(passcode?: string): Promise<void>;
  signOut?(): Promise<void>;
  isAuthReady?: boolean;
  authError?: Error | undefined;
}

export const StateContext = createContext<StateContextType>(null!);

/*
  The 'react-hooks/rules-of-hooks' linting rules prevent React Hooks fron being called
  inside of if() statements. This is because hooks must always be called in the same order
  every time a component is rendered. The 'react-hooks/rules-of-hooks' rule is disabled below
  because the "if (process.env.REACT_APP_SET_AUTH === 'firebase')" statements are evaluated
  at build time (not runtime). If the statement evaluates to false, then the code is not
  included in the bundle that is produced (due to tree-shaking). Thus, in this instance, it
  is ok to call hooks inside if() statements.
*/
export default function AppStateProvider(props: React.PropsWithChildren<{}>) {
  const [error, setError] = useState<TwilioError | null>(null);
  let contextValue = {
    error,
    setError,
  } as StateContextType;

  if (process.env.REACT_APP_SET_AUTH === 'passcode') {
    contextValue = {
      ...contextValue,
      ...usePasscodeAuth(), // eslint-disable-line react-hooks/rules-of-hooks
    };
  } else {
    contextValue = {
      ...contextValue,
    };
  }

  return <StateContext.Provider value={{ ...contextValue }}>{props.children}</StateContext.Provider>;
}

export function useAppState() {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useAppState must be used within the AppStateProvider');
  }
  return context;
}
