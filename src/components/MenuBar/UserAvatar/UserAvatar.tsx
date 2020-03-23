import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import makeStyles from '@material-ui/styles/makeStyles';
import Person from '@material-ui/icons/Person';
import { StateContextType } from '../../../state';

const useStyles = makeStyles({
  red: {
    color: 'white',
    backgroundColor: '#F22F46',
  },
  purple: {
    color: 'white',
    backgroundColor: '#9C27B0',
  },
  blue: {
    color: 'white',
    backgroundColor: '#2196F3',
  },
  cyan: {
    color: 'white',
    backgroundColor: '#00BCD4',
  },
  green: {
    color: 'white',
    backgroundColor: '#4CAF50',
  },
  amber: {
    color: 'white',
    backgroundColor: '#FFC107',
  },
  orange: {
    color: 'white',
    backgroundColor: '#FF9800',
  },
  darkorange: {
    color: 'white',
    backgroundColor: '#FF5722',
  },
  brown: {
    color: 'white',
    backgroundColor: '#795548',
  },
});

export function getInitials(name: string) {
  return name
    .split(' ')
    .map(text => text[0])
    .join('')
    .toUpperCase();
}

export default function UserAvatar({ user }: { user: StateContextType['user'] }) {
  const classes = useStyles();
  const { uid, displayName, photoURL } = user!;
  const colors = Object.keys(classes);
  //@ts-ignore
  const className = classes[colors[uid % colors.length]];

  return photoURL ? (
    <Avatar src={photoURL} />
  ) : (
    <Avatar className={className}>{displayName ? getInitials(displayName) : <Person />}</Avatar>
  );
}
