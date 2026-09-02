import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
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
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);

  useEffect(() => {
    let videoClient;
    let videoCall;

    const setup = async () => {
      const toastId = toast.loading('Connecting to call...');

      try {
        const { token, apiKey, userId } = await videoService.getToken();

        videoClient = new StreamVideoClient({
          apiKey,
          user: { id: userId },
          token,
        });

        videoCall = videoClient.call('default', callId);
        await videoCall.join({ create: true });

        videoCall.on('call.session_participant_joined', (event) => {
          toast(`${event.participant.user.name || 'Someone'} joined the call`);
        });

        videoCall.on('call.session_participant_left', (event) => {
          toast(`${event.participant.user.name || 'Someone'} left the call`);
        });

        videoCall.on('call.ended', () => {
          toast('Call ended');
          navigate(-1);
        });

        setClient(videoClient);
        setCall(videoCall);
        toast.success('Connected!', { id: toastId });
      } catch (err) {
        toast.error('Could not join the call', { id: toastId });
        console.log(err);
      }
    };

    setup();

    return () => {
      videoCall?.leave().catch(() => {});
      videoClient?.disconnectUser().catch(console.log);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callId]);

  const handleLeave = () => {
    toast('You left the call');
    navigate(-1);
  };

  if (!client || !call) return <p>Connecting...</p>;

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <StreamTheme>
          <SpeakerLayout participantBarPosition="right" />
          <CallControls onLeave={handleLeave} />
        </StreamTheme>
      </StreamCall>
    </StreamVideo>
  );
};

export default VideoCall;