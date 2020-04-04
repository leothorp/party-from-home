import React, { useState, useCallback } from 'react';
import { Modal, styled, TextField, Button } from '@material-ui/core';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

const Container = styled('div')(({ theme }) => ({
  position: 'fixed',
  top: '50%',
  left: '50%',
  backgroundColor: theme.alternateBackgroundColor,
  width: '400px',
  height: '500px',
  marginTop: '-250px',
  marginLeft: '-200px',
  display: 'flex',
  flexDirection: 'column',
  outline: 'none',
  padding: '16px',
}));

const ESCALATE = gql`
  mutation Escalate($adminPasscode: String!) {
    escalateUser(adminPasscode: $adminPasscode) {
      identity
      admin
    }
  }
`;

export interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AdminEscalation(props: Props) {
  const [passcode, setPasscode] = useState('');
  const [escalate, { error }] = useMutation(ESCALATE);

  const changePasscode = useCallback(
    (e: any) => {
      setPasscode(e.target.value);
    },
    [setPasscode]
  );

  const submitPasscode = useCallback(() => {
    escalate({
      variables: { adminPasscode: passcode },
    });
  }, [escalate, passcode]);

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Container>
        <TextField label="Admin Passcode" type="password" value={passcode} onChange={changePasscode} />
        <Button onClick={submitPasscode}>Gain Admin</Button>
        {error && <p>{error}</p>}
      </Container>
    </Modal>
  );
}
