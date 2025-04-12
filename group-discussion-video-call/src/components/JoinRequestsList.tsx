import React from 'react';
import { UserPlus, X, Check } from 'lucide-react';
import { JoinRequest } from '../types';

interface JoinRequestsListProps {
  requests: JoinRequest[];
  onAccept: (request: JoinRequest) => void;
  onReject: (requestId: string) => void;
}

const JoinRequestsList: React.FC<JoinRequestsListProps> = ({
  requests,
  onAccept,
  onReject,
}) => {
  if (requests.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 w-80 bg-white rounded-lg shadow-lg p-4 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <UserPlus className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Join Requests</h3>
      </div>
      {requests.map((request) => (
        <div
          key={request.id}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
        >
          <span className="font-medium">{request.name}</span>
          <div className="flex gap-2">
            <button
              onClick={() => onAccept(request)}
              className="p-1 text-green-600 hover:bg-green-100 rounded-full transition-colors"
            >
              <Check className="w-5 h-5" />
            </button>
            <button
              onClick={() => onReject(request.id)}
              className="p-1 text-red-600 hover:bg-red-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JoinRequestsList;