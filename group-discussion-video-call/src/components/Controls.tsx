import React from 'react';
import { Mic, MicOff, Video, VideoOff, Monitor, Phone, Link, Users, MessageCircle } from 'lucide-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

interface ControlsProps {
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
  onEndCall: () => void;
  roomId: string;
  isHost: boolean;
  onShowParticipants: () => void;
  onShowChat: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  isAudioEnabled,
  isVideoEnabled,
  isScreenSharing,
  onToggleAudio,
  onToggleVideo,
  onToggleScreenShare,
  onEndCall,
  roomId,
  isHost,
  onShowParticipants,
  onShowChat,
}) => {
  const roomUrl = `${window.location.origin}?room=${roomId}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleAudio}
            className={`p-4 rounded-full ${
              isAudioEnabled ? 'bg-blue-600' : 'bg-red-500'
            } hover:opacity-90 transition-all transform hover:scale-105 shadow-lg`}
          >
            {isAudioEnabled ? (
              <Mic className="w-6 h-6 text-white" />
            ) : (
              <MicOff className="w-6 h-6 text-white" />
            )}
          </button>
          <button
            onClick={onToggleVideo}
            className={`p-4 rounded-full ${
              isVideoEnabled ? 'bg-blue-600' : 'bg-red-500'
            } hover:opacity-90 transition-all transform hover:scale-105 shadow-lg`}
          >
            {isVideoEnabled ? (
              <Video className="w-6 h-6 text-white" />
            ) : (
              <VideoOff className="w-6 h-6 text-white" />
            )}
          </button>
          <button
            onClick={onToggleScreenShare}
            className={`p-4 rounded-full ${
              isScreenSharing ? 'bg-blue-600' : 'bg-blue-700'
            } hover:opacity-90 transition-all transform hover:scale-105 shadow-lg`}
          >
            <Monitor className="w-6 h-6 text-white" />
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <CopyToClipboard text={roomUrl}>
            <button className="p-4 rounded-full bg-blue-700 hover:opacity-90 transition-all transform hover:scale-105 shadow-lg">
              <Link className="w-6 h-6 text-white" />
            </button>
          </CopyToClipboard>
          <button
            onClick={onShowChat}
            className="p-4 rounded-full bg-blue-700 hover:opacity-90 transition-all transform hover:scale-105 shadow-lg"
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </button>
          {isHost && (
            <button
              onClick={onShowParticipants}
              className="p-4 rounded-full bg-blue-700 hover:opacity-90 transition-all transform hover:scale-105 shadow-lg"
            >
              <Users className="w-6 h-6 text-white" />
            </button>
          )}
          <button
            onClick={onEndCall}
            className="p-4 rounded-full bg-red-500 hover:opacity-90 transition-all transform hover:scale-105 shadow-lg"
          >
            <Phone className="w-6 h-6 text-white transform rotate-225" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Controls;