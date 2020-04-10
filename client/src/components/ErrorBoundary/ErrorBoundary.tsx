import React from 'react';
import { styled } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

interface ErrorState {
  hasError: boolean;
}

interface ErrorProps {}

const Header = styled('h2')({
  color: 'white',
  fontSize: '48px',
  fontWeight: 400,
  lineHeight: '56px',
  alignItems: 'center',
});

export class ErrorBoundary extends React.Component<ErrorProps, ErrorState> {
  constructor(props: ErrorProps) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: any, info: any) {
    // TODO: write error to error service
    console.log(error);
    console.log(info);
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Grid container justify="center" alignItems="flex-start">
          <Header>Oops! We hit an error 😞</Header>
          <h3>Please refresh the page to return to your party. We'll take care of the issue as soon as possible.</h3>
        </Grid>
      );
    }

    return this.props.children;
  }
}
