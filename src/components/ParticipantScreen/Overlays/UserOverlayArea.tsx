import React from 'react';
import { UserInfoOverlay } from '../../../Overlay';
import { styled } from '@material-ui/core';

const Container = styled('div')({});

export interface Props {
  overlays: UserInfoOverlay[];
}

export default function UserOverlayArea(props: Props) {
  return <Container></Container>;
}
