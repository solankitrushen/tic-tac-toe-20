export interface Participant {
  id: string;
  stream: MediaStream;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  name: string;
}

export interface JoinRequest {
  id: string;
  name: string;
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: number;
}

export interface RoomState {
  roomId: string;
  isHost: boolean;
  participants: Map<string, Participant>;
  localStream: MediaStream | null;
  screenStream: MediaStream | null;
  joinRequests: JoinRequest[];
  messages: ChatMessage[];
}