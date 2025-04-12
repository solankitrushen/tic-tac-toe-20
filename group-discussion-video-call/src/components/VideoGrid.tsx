import React from 'react';
import { Participant } from '../types';
import VideoTile from './VideoTile';

interface VideoGridProps {
  participants: Map<string, Participant>;
  localStream: MediaStream | null;
  isHost: boolean;
  onRemoveParticipant: (id: string) => void;
}

const VideoGrid: React.FC<VideoGridProps> = ({
  participants,
  localStream,
  isHost,
  onRemoveParticipant,
}) => {
  const participantsArray = Array.from(participants.values());

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {localStream && (
        <VideoTile
          stream={localStream}
          isLocal={true}
          participant={{
            id: 'local',
            stream: localStream,
            isAudioEnabled: true,
            isVideoEnabled: true,
            isScreenSharing: false,
            name: 'You'
          }}
        />
      )}
      {participantsArray.map((participant) => (
        <VideoTile
          key={participant.id}
          stream={participant.stream}
          isLocal={false}
          participant={participant}
          isHost={isHost}
          onRemove={() => onRemoveParticipant(participant.id)}
        />
      ))}
    </div>
  );
};

export default VideoGrid;