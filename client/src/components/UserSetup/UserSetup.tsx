import React, { ChangeEvent, useState, FormEvent, useCallback } from 'react';
import { useAppState } from '../../state';
import { subscriptionClient } from '../../graph';

import Button from '@material-ui/core/Button';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import FacebookLogin, { ReactFacebookLoginInfo } from 'react-facebook-login';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { makeStyles, styled } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles({
  container: {
    height: '100vh',
    background: '#000000',
  },
  button: {
    margin: '0.8em 20px 0.7em',
    textTransform: 'none',
  },
  errorMessage: {
    color: 'red',
    display: 'flex',
    alignItems: 'center',
    margin: '1em 0 0.2em',
    '& svg': {
      marginRight: '0.4em',
    },
  },
  nameField: {
    border: '1px solid #828282',
  },
});

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    secondary: {
      main: '#F2C94C',
    },
  },
});

const HeroContainer = styled('div')({
  marginTop: '100px',
});

const Header = styled('h1')({
  color: 'white',
  fontSize: '72px',
  fontWeight: 600,
  lineHeight: '86px',
  alignItems: 'center',
  letterSpacing: '0.02em',
  maxWidth: '477px',
});

const SeparatorContainer = styled('div')({
  position: 'relative',
  width: '100%',
  marginTop: '27px',
  marginBottom: '27px',
});

const SeparatorText = styled('div')({
  position: 'relative',
  color: '#828282',
  backgroundColor: '#000',
  width: '40px',
  zIndex: 10,
  marginLeft: '10px',
  textAlign: 'center',
  fontSize: '20px',
  fontWeight: 'bold',
  lineHeight: '24px',
  letterSpacing: '0.05em',
  display: 'flex',
  alignItems: 'center',
  paddingLeft: '5px',
});

const Separator = styled('div')({
  position: 'absolute',
  top: '50%',
  width: '100%',
  borderColor: '#333333',
  borderWidth: '1px',
  borderStyle: 'solid',
  zIndex: 5,
});

export default function LoginPage() {
  const classes = useStyles();
  const { setUser, user } = useAppState();
  const [name, setName] = useState('');
  const [error, setError] = useState<Error | null>(null);
  const history = useHistory();

  const setUserInfo = () => {
    if (!name) {
      setError({ name: 'missing_name', message: 'You must set a name!' });
    } else {
      if (setUser) {
        setUser(name).then(() => {
          // subscriptionClient.close(true);
          history.replace({ pathname: '/' });
        });
      }
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setUserInfo();
  };

  const onFBLogin = useCallback(
    (info: ReactFacebookLoginInfo) => {
      if (setUser) {
        setUser(info.name || '', info?.picture?.data?.url || '').then(() => {
          // subscriptionClient.close(true);
          history.replace({ pathname: '/' });
        });
      }
    },
    [history, setUser]
  );

  const currentName = name === '' && user?.displayName ? user.displayName : name;

  return (
    <ThemeProvider theme={theme}>
      <Grid container justify="center" alignItems="flex-start" className={classes.container}>
        <HeroContainer>
          <Header>
            <span role="img" aria-label="confetti">
              🎉
            </span>
            <br />
            Welcome to the party!
          </Header>
          <form onSubmit={handleSubmit}>
            <Grid container alignItems="center" direction="row">
              <TextField
                id="input-name"
                label="Name"
                onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                value={currentName}
                variant="outlined"
                color="secondary"
              />
              <div>
                {error && (
                  <Typography variant="caption" className={classes.errorMessage}>
                    <ErrorOutlineIcon />
                    {error.message}
                  </Typography>
                )}
              </div>
              <Button
                variant="contained"
                color="secondary"
                className={classes.button}
                type="submit"
                disabled={!name.length}
              >
                Set Name
              </Button>
            </Grid>
          </form>
          <SeparatorContainer>
            <SeparatorText>OR</SeparatorText>
            <Separator></Separator>
          </SeparatorContainer>
          <FacebookLogin appId={'2488611224802561'} autoLoad={false} fields="name,picture" callback={onFBLogin} />
        </HeroContainer>
      </Grid>
    </ThemeProvider>
  );
}
