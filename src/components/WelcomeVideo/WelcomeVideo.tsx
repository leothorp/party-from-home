import React, { useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { styled, Button } from '@material-ui/core';
import ReactPlayer from 'react-player';
import { useHistory } from 'react-router-dom';
import Sound from 'react-sound';

import { useAppState } from '../../state';
import useMountEffect from '../../hooks/useMountEffect/useMountEffect';
import useApi from '../../hooks/useApi/useApi';

const useStyles = makeStyles(theme => ({
  reactPlayer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  skipButton: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
  },
}));

const PlayerWrapper = styled('div')({
  position: 'relative',
  paddingTop: '56.25%',
});

export default function WelcomeVideo() {
  const classes = useStyles();
  const [playing, setPlaying] = useState(true);
  const [playedTts, setPlayedTts] = useState(false);
  const [audio, setAudio] = useState('');
  const [playStatus, setPlayStatus] = useState('STOPPED' as any);
  const history = useHistory();
  const { user } = useAppState();
  const { callApi } = useApi();

  useMountEffect(() => {
    callApi('get_tts', {
      text: user ? user.displayName : 'no user name',
    }).then((response) => {
      setAudio('data:audio/mp3;base64,' + response.audio);
    }).catch(e => {
      console.error('Could not fetch TTS:', e);
    });
  });

  const handleProgress = useCallback((args: any) => {
    const seconds = args.playedSeconds;
    if (playedTts || seconds < 14.5) {
      return;
    }

    setPlaying(false);
    setPlayStatus('PLAYING' as any);
  }, [playedTts]);

  const handleAudioFinishedPlaying = useCallback(() => {
    setPlayStatus('STOPPED' as any);
    setPlayedTts(true);
    setPlaying(true);
  }, []);

  const handleEnd = useCallback(() => {
    history.replace({ pathname: '/' });
  }, [history]);

  return (
    <PlayerWrapper>
      <ReactPlayer
        className={classes.reactPlayer}
        url='https://lockdown-party-nitsan.s3.us-east-2.amazonaws.com/nitsan_party_intro.mp4'
        playing={playing}
        width='100%'
        height='100%'
        progressInterval={250}
        onProgress={handleProgress}
        onEnded={handleEnd} />
      <Sound
        url={audio}
	playStatus={playStatus}
        onFinishedPlaying={handleAudioFinishedPlaying} />
      <Button
        className={classes.skipButton}
        onClick={handleEnd}>
        Skip
      </Button>
    </PlayerWrapper>
  );
}