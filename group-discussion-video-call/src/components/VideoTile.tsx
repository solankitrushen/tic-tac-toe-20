import React, { useRef, useEffect } from 'react';
import { UserX, Mic, MicOff, Video, VideoOff, Monitor } from 'lucide-react';
import { Participant } from '../types';
import classNames from 'classnames';

interface VideoTileProps {
  stream: MediaStream;
  isLocal: boolean;
  participant: Participant;
  isHost?: boolean;
  onRemove?: () => void;
}

const VideoTile: React.FC<VideoTileProps> = ({
  stream,
  isLocal,
  participant,
  isHost,
  onRemove,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative rounded-lg overflow-hidden bg-gray-900">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        className={classNames(
          'w-full h-full object-cover',
          !participant.isVideoEnabled && 'hidden'
        )}
      />
      {!participant.isVideoEnabled && (
        <div className="absolute inset-0 flex items-center justify-center bg-blue-900">
          <div className="w-20 h-20 rounded-full bg-blue-700 flex items-center justify-center">
            <span className="text-2xl text-white">
              {participant.name.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
        <div className="flex items-center justify-between">
          <span className="text-white text-sm">
            {participant.name} {participant.isScreenSharing && '(Screen)'}
          </span>
          <div className="flex items-center space-x-2">
            {participant.isScreenSharing && (
              <Monitor className="w-5 h-5 text-blue-400" />
            )}
            {participant.isAudioEnabled ? (
              <Mic className="w-5 h-5 text-green-400" />
            ) : (
              <MicOff className="w-5 h-5 text-red-400" />
            )}
            {participant.isVideoEnabled ? (
              <Video className="w-5 h-5 text-green-400" />
            ) : (
              <VideoOff className="w-5 h-5 text-red-400" />
            )}
            {isHost && !isLocal && onRemove && (
              <button
                onClick={onRemove}
                className="p-1 hover:bg-red-500 rounded-full transition-colors"
              >
                <UserX className="w-5 h-5 text-white" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoTile;