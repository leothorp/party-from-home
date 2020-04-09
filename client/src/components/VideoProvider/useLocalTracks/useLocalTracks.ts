import { useCallback, useEffect, useState } from 'react';
import Video, { LocalVideoTrack, LocalAudioTrack } from 'twilio-video';
import useMountEffect from '../../../hooks/useMountEffect/useMountEffect';

export function useLocalAudioTrack() {
  const [track, setTrack] = useState<LocalAudioTrack>();
  const [deviceId, setDeviceId] = useState('');

  const setLocalAudioTrack = useCallback(
    (newDeviceId?: string) => {
      return new Promise<LocalAudioTrack>((resolve, reject) => {
        const audioDeviceId = newDeviceId || deviceId;
        const config = audioDeviceId ? { deviceId: { exact: audioDeviceId } } : {};
        Video.createLocalAudioTrack(config).then(newTrack => {
          setTrack(newTrack);
          if (newDeviceId) setDeviceId(newDeviceId);
          resolve(newTrack);
        });
      });
    },
    [setTrack, setDeviceId, deviceId]
  );

  useMountEffect(() => {
    setLocalAudioTrack();
  });

  useEffect(() => {
    const handleStopped = () => setTrack(undefined);
    if (track) {
      track.on('stopped', handleStopped);
      return () => {
        track.off('stopped', handleStopped);
      };
    }
  }, [track]);

  return [track, setLocalAudioTrack] as const;
}

export function useLocalVideoTrack() {
  const [track, setTrack] = useState<LocalVideoTrack>();
  const [deviceId, setDeviceId] = useState('');

  const setLocalVideoTrack = useCallback(
    (newDeviceId?: string) => {
      return new Promise<LocalVideoTrack>((resolve, reject) => {
        let config: Video.CreateLocalTrackOptions = {
          frameRate: 24,
          height: 720,
          width: 1280,
          name: 'camera',
        };
        const videoDeviceId = newDeviceId || deviceId;
        if (videoDeviceId) config.deviceId = { exact: videoDeviceId };
        Video.createLocalVideoTrack(config).then(newTrack => {
          setTrack(newTrack);
          if (newDeviceId) setDeviceId(newDeviceId);
          resolve(newTrack);
        });
      });
    },
    [setTrack, deviceId, setDeviceId]
  );

  useMountEffect(() => {
    setLocalVideoTrack();
  });

  useEffect(() => {
    const handleStopped = () => setTrack(undefined);
    if (track) {
      track.on('stopped', handleStopped);
      return () => {
        track.off('stopped', handleStopped);
      };
    }
  }, [track]);

  return [track, setLocalVideoTrack] as const;
}

export default function useLocalTracks() {
  const [audioTrack, setLocalAudioTrack] = useLocalAudioTrack();
  const [videoTrack, setLocalVideoTrack] = useLocalVideoTrack();

  const localTracks = [audioTrack, videoTrack].filter(track => track !== undefined) as (
    | LocalAudioTrack
    | LocalVideoTrack
  )[];

  return { localTracks, setLocalVideoTrack, setLocalAudioTrack };
}
