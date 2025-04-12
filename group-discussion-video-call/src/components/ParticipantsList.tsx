import React from 'react';
import { X, UserX } from 'lucide-react';
import { Participant } from '../types';

interface ParticipantsListProps {
  participants: Map<string, Participant>;
  onClose: () => void;
  onRemoveParticipant: (id: string) => void;
  isHost: boolean;
}

const ParticipantsList: React.FC<ParticipantsListProps> = ({
  participants,
  onClose,
  onRemoveParticipant,
  isHost,
}) => {
  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Participants ({participants.size})</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="space-y-2">
        {Array.from(participants.values()).map((participant) => (
          <div
            key={participant.id}
            className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
          >
            <span>{participant.name}</span>
            {isHost && (
              <button
                onClick={() => onRemoveParticipant(participant.id)}
                className="p-1 hover:bg-red-100 rounded-full transition-colors"
              >
                <UserX className="w-5 h-5 text-red-500" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParticipantsList;