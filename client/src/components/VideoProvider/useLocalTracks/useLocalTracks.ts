import { useCallback, useEffect, useState } from 'react';
import Video, { LocalVideoTrack, LocalAudioTrack } from 'twilio-video';
import useMountEffect from '../../../hooks/useMountEffect/useMountEffect';

export function useLocalAudioTrack() {
  const [track, setTrack] = useState<LocalAudioTrack>();
  const [deviceId, setDeviceId] = useState('');

  const setLocalAudioTrack = useCallback(
    (newDeviceId?: string) => {
      return new Promise<LocalAudioTrack>((resolve, reject) => {
        const deviceId = newDeviceId ? { exact: newDeviceId } : undefined;
        Video.createLocalAudioTrack({ deviceId }).then(newTrack => {
          setTrack(newTrack);
          resolve(newTrack);
        });
      });
    },
    [setTrack, deviceId]
  );

  const setMicId = useCallback(
    (newDeviceId: string) => {
      setDeviceId(newDeviceId);
    },
    [setDeviceId]
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

  return [track, setLocalAudioTrack, setMicId] as const;
}

export function useLocalVideoTrack() {
  const [track, setTrack] = useState<LocalVideoTrack>();
  const [deviceId, setDeviceId] = useState('');

  const setLocalVideoTrack = useCallback(
    (newDeviceId?: string) => {
      return new Promise<LocalVideoTrack>((resolve, reject) => {
        let deviceId = newDeviceId ? { exact: newDeviceId } : undefined;
        Video.createLocalVideoTrack({
          frameRate: 24,
          height: 720,
          width: 1280,
          name: 'camera',
          deviceId,
        }).then(newTrack => {
          setTrack(newTrack);
          resolve(newTrack);
        });
      });
    },
    [setTrack, deviceId]
  );

  const setCameraId = useCallback(
    (newDeviceId: string) => {
      setDeviceId(newDeviceId);
    },
    [setDeviceId]
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
