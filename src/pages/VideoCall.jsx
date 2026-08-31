import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  StreamTheme,
  SpeakerLayout,
  CallControls,
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import * as videoService from '../services/video';

const VideoCall = () => {
  const { callId } = useParams();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);

  useEffect(() => {
    let videoClient;
    let videoCall;
    let cancelled = false;

    const setup = async () => {
      try {
        const { token, apiKey, userId } = await videoService.getToken();

        videoClient = new StreamVideoClient({
          apiKey,
          user: { id: userId },
          token,
        });

        videoCall = videoClient.call('default', callId);

        await videoCall.join({ create: true });

        if (cancelled) {
          await videoCall.leave();
          await videoClient.disconnectUser();
          return;
        }

        setClient(videoClient);
        setCall(videoCall);
      } catch (error) {
        console.error('Failed to join video call:', error);
      }
    };

    setup();

    return () => {
      cancelled = true;

      if (videoCall) {
        videoCall.leave().catch(console.error);
      }

      if (videoClient) {
        videoClient.disconnectUser().catch(console.error);
      }
    };
  }, [callId]);

  if (!client || !call) {
    return <p>Connecting...</p>;
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <StreamTheme>
          <SpeakerLayout participantBarPosition="right" />
          <CallControls />
        </StreamTheme>
      </StreamCall>
    </StreamVideo>
  );
};

export default VideoCall;