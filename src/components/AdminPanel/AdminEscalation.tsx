import React, { useState, useCallback } from 'react';
import { Modal, styled, TextField, Button } from '@material-ui/core';
import useApi from '../../hooks/useApi/useApi';
import { useAppState } from '../../state';

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

export interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AdminEscalation(props: Props) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { callApi } = useApi();
  const { user } = useAppState();

  const changePasscode = useCallback(
    (e: any) => {
      setPasscode(e.target.value);
    },
    [setPasscode]
  );

  const submitPasscode = useCallback(() => {
    callApi('set_admin', {
      adminPasscode: passcode,
      newAdminIdentity: user?.identity,
      admin: true,
    })
      .then(() => {
        window.location.reload();
      })
      .catch(e => {
        setError(e);
      });
  }, [callApi, passcode, user]);

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
