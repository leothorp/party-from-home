import { useCallback, useEffect, useState } from 'react';
import Video, { LocalVideoTrack, LocalAudioTrack } from 'twilio-video';

export function useLocalAudioTrack() {
  const [track, setTrack] = useState<LocalAudioTrack>();
  const [deviceId, setDeviceId] = useState('');

  const setLocalAudioTrack = useCallback(() => {
    let audioTrackOptions: any = {};
    if (deviceId) {
      audioTrackOptions['deviceId'] = { exact: deviceId };
    }
    return new Promise<LocalAudioTrack>(resolve => {
      Video.createLocalAudioTrack(audioTrackOptions).then(newTrack => {
        setTrack(newTrack);
        resolve(newTrack);
      });
    });
  }, [setTrack, deviceId]);

  const setMicId = useCallback(
    (newDeviceId: string) => {
      setDeviceId(newDeviceId);
    },
    [setDeviceId]
  );

  useEffect(() => {
    setLocalAudioTrack();
  }, [setLocalAudioTrack]);

  useEffect(() => {
    const handleStopped = () => setTrack(undefined);
    if (track) {
      track.on('stopped', handleStopped);
      return () => {
        track.off('stopped', handleStopped);
      };
    }
  }, [track]);

  return [track, setLocalAudioTrack, setMicId] as const;
}

export function useLocalVideoTrack() {
  const [track, setTrack] = useState<LocalVideoTrack>();
  const [deviceId, setDeviceId] = useState('');

  const setLocalVideoTrack = useCallback(() => {
    let videoTrackOptions: any = {
      frameRate: 24,
      height: 720,
      width: 1280,
      name: 'camera',
    };
    if (deviceId) {
      videoTrackOptions['deviceId'] = { exact: deviceId };
    }
    return new Promise<LocalVideoTrack>(resolve => {
      Video.createLocalVideoTrack(videoTrackOptions).then(newTrack => {
        setTrack(newTrack);
        resolve(newTrack);
      });
    });
  }, [setTrack, deviceId]);

  const setCameraId = useCallback(
    (newDeviceId: string) => {
      setDeviceId(newDeviceId);
    },
    [setDeviceId]
  );

  useEffect(() => {
    // We get a new local video track when the app loads.
    setLocalVideoTrack();
  }, [setLocalVideoTrack]);

  useEffect(() => {
    const handleStopped = () => setTrack(undefined);
    if (track) {
      track.on('stopped', handleStopped);
      return () => {
        track.off('stopped', handleStopped);
      };
    }
  }, [track]);

  return [track, setLocalVideoTrack, setCameraId] as const;
}

export default function useLocalTracks() {
  const [audioTrack, setLocalAudioTrack, setMicId] = useLocalAudioTrack();
  const [videoTrack, setLocalVideoTrack, setCameraId] = useLocalVideoTrack();

  const localTracks = [audioTrack, videoTrack].filter(track => track !== undefined) as (
    | LocalAudioTrack
    | LocalVideoTrack
  )[];

  return { localTracks, setLocalVideoTrack, setCameraId, setLocalAudioTrack, setMicId };
}
