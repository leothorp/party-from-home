import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';
import InfoIcon from '@material-ui/icons/Info';
import { styled, IconButton } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  popOverOverride: {
    '& > div': {
      background: 'transparent',
    },
  },
}));

const PopOverInnerContainer = styled('div')(({ theme }) => ({
  // Adds space for "speechbubble tail"
  position: 'relative',
  background: '#262626',
  borderRadius: '.4em',
  marginLeft: '10px',
}));

const PopOverContentContainer = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
}));

const PopOverLeftTail = styled('div')(({ theme }) => ({
  content: ' ',
  position: 'absolute',
  left: '-20px',
  top: '5px',
  borderBottom: '10px solid transparent',
  borderRight: '10px solid #262626',
  borderLeft: '10px solid transparent',
  borderTop: '10px solid transparent',
}));

const PopOverTitle = styled('div')({
  color: '#F2F2F2',
  fontSize: '20px',
  fontWeight: 600,
  lineHeight: '24px',
});

const PopOverSubtext = styled('div')({
  color: '#BEBEBE',
  fontSize: '16px',
  marginTop: 0,
});

export const BUTTON_TYPE_BUTTON = 'button';
export const BUTTON_TYPE_INFO = 'info';

const BUTTON_TYPES = [BUTTON_TYPE_BUTTON, BUTTON_TYPE_INFO];

interface PopOverProps {
  buttonType?: typeof BUTTON_TYPES[number];
  buttonCta?: string;
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  popOverId: string;
}

export default function PopOverWithButton({
  buttonType,
  buttonCta,
  title,
  subtitle,
  children,
  popOverId,
}: PopOverProps) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? popOverId : undefined;

  let buttonComponent;
  if (buttonType === BUTTON_TYPE_INFO) {
    buttonComponent = (
      <IconButton onClick={handleOpen}>
        <InfoIcon />
      </IconButton>
    );
  } else {
    buttonComponent = (
      <Button aria-describedby={id} variant="contained" color="primary" onClick={handleOpen}>
        {buttonCta || 'Click me!'}
      </Button>
    );
  }

  return (
    <div>
      {buttonComponent}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        className={classes.popOverOverride}
        // The following makes the animation that has the pop-over come out the right of the button
        // Change if we want it to come out another way
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
      >
        <PopOverInnerContainer>
          <PopOverLeftTail />
          <PopOverContentContainer>
            {title && <PopOverTitle>{title}</PopOverTitle>}
            {subtitle && <PopOverSubtext>{subtitle}</PopOverSubtext>}
            {children}
          </PopOverContentContainer>
        </PopOverInnerContainer>
      </Popover>
    </div>
  );
}
