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

    const setup = async () => {
      const { token, apiKey, userId } = await videoService.getToken();

      videoClient = new StreamVideoClient({
        apiKey,
        user: { id: userId },
        token,
      });

      const videoCall = videoClient.call('default', callId);
      await videoCall.join({ create: true });

      setClient(videoClient);
      setCall(videoCall);
    };

    setup();

    return () => {
      call?.leave().catch(console.error);
      videoClient?.disconnectUser().catch(console.error);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callId]);

  if (!client || !call) return <p>Connecting...</p>;

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