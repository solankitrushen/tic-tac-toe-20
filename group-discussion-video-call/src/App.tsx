import React, { useEffect, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Peer from 'peerjs';
import VideoGrid from './components/VideoGrid';
import Controls from './components/Controls';
import ParticipantsList from './components/ParticipantsList';
import JoinRequestModal from './components/JoinRequestModal';
import JoinRequestsList from './components/JoinRequestsList';
import Chat from './components/Chat';
import ReviewForm from './components/ReviewForm';
import { RoomState, Participant, JoinRequest, ChatMessage } from './types';

function App() {
  const [state, setState] = useState<RoomState>({
    roomId: '',
    isHost: false,
    participants: new Map(),
    localStream: null,
    screenStream: null,
    joinRequests: [],
    messages: [],
  });
  const [peer, setPeer] = useState<Peer | null>(null);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userName, setUserName] = useState('');
  const [connections] = useState(new Map());

  useEffect(() => {
    const initializeCall = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const roomParam = params.get('room');
        
        if (roomParam && !userName) {
          setShowJoinModal(true);
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        const peerId = !roomParam ? uuidv4() : uuidv4();
        const newPeer = new Peer(peerId, {
          debug: 3,
        });

        setPeer(newPeer);
        
        newPeer.on('open', (id) => {
          console.log('My peer ID is:', id);
          setState(prev => ({
            ...prev,
            roomId: roomParam || id,
            isHost: !roomParam,
            localStream: stream,
          }));

          if (roomParam && userName) {
            const conn = newPeer.connect(roomParam, {
              metadata: { name: userName }
            });

            conn.on('open', () => {
              console.log('Connected to host');
              conn.send({
                type: 'JOIN_REQUEST',
                name: userName,
                peerId: id,
              });
            });

            conn.on('data', (data) => {
              if (data.type === 'CHAT_MESSAGE') {
                setState(prev => ({
                  ...prev,
                  messages: [...prev.messages, data.message],
                }));
              }
            });

            conn.on('error', (error) => {
              console.error('Connection error:', error);
            });

            connections.set(roomParam, conn);
          }
        });

        newPeer.on('connection', (conn) => {
          console.log('Incoming connection from:', conn.peer);
          
          conn.on('data', (data) => {
            console.log('Received data:', data);
            
            if (data.type === 'JOIN_REQUEST') {
              setState(prev => ({
                ...prev,
                joinRequests: [...prev.joinRequests, {
                  id: data.peerId,
                  name: data.name,
                  timestamp: Date.now(),
                }],
              }));
            } else if (data.type === 'CHAT_MESSAGE') {
              setState(prev => ({
                ...prev,
                messages: [...prev.messages, data.message],
              }));
            }
          });

          connections.set(conn.peer, conn);
        });

        newPeer.on('call', (call) => {
          console.log('Incoming call from:', call.peer);
          
          call.answer(stream);
          
          call.on('stream', (remoteStream) => {
            console.log('Received stream from:', call.peer);
            const metadata = JSON.parse(call.metadata || '{}');
            
            setState(prev => {
              const newParticipants = new Map(prev.participants);
              newParticipants.set(call.peer, {
                id: call.peer,
                stream: remoteStream,
                isAudioEnabled: true,
                isVideoEnabled: true,
                isScreenSharing: false,
                name: metadata.name || `User ${newParticipants.size + 1}`,
              });
              return { ...prev, participants: newParticipants };
            });
          });
        });

        newPeer.on('error', (error) => {
          console.error('PeerJS error:', error);
        });

      } catch (error) {
        console.error('Failed to initialize call:', error);
      }
    };

    initializeCall();

    return () => {
      state.localStream?.getTracks().forEach(track => track.stop());
      state.screenStream?.getTracks().forEach(track => track.stop());
      connections.forEach(conn => conn.close());
      peer?.destroy();
    };
  }, [userName]);

  const handleJoinRequest = useCallback((name: string) => {
    setUserName(name);
    setShowJoinModal(false);
  }, []);

  const sendChatMessage = useCallback((message: string) => {
    const newMessage: ChatMessage = {
      id: uuidv4(),
      senderId: peer?.id || 'local',
      senderName: userName || 'Host',
      message,
      timestamp: Date.now(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }));

    connections.forEach((conn) => {
      conn.send({
        type: 'CHAT_MESSAGE',
        message: newMessage,
      });
    });
  }, [peer, userName, connections]);

  const acceptJoinRequest = useCallback((request: JoinRequest) => {
    console.log('Accepting join request:', request);
    
    if (state.localStream && peer) {
      const call = peer.call(request.id, state.localStream, {
        metadata: JSON.stringify({ name: 'Host' })
      });

      call.on('stream', (remoteStream) => {
        console.log('Received stream from accepted participant:', request.id);
        
        setState(prev => {
          const newParticipants = new Map(prev.participants);
          newParticipants.set(request.id, {
            id: request.id,
            stream: remoteStream,
            isAudioEnabled: true,
            isVideoEnabled: true,
            isScreenSharing: false,
            name: request.name,
          });
          return {
            ...prev,
            participants: newParticipants,
            joinRequests: prev.joinRequests.filter(r => r.id !== request.id),
          };
        });
      });

      connections.forEach((conn) => {
        if (conn.peer !== request.id) {
          conn.send({
            type: 'PARTICIPANT_JOINED',
            participant: {
              id: request.id,
              name: request.name,
            },
          });
        }
      });
    }
  }, [peer, state.localStream, connections]);

  const rejectJoinRequest = useCallback((requestId: string) => {
    setState(prev => ({
      ...prev,
      joinRequests: prev.joinRequests.filter(r => r.id !== requestId),
    }));
    
    const conn = connections.get(requestId);
    if (conn) {
      conn.send({ type: 'JOIN_REJECTED' });
      conn.close();
      connections.delete(requestId);
    }
  }, [connections]);

  const toggleAudio = useCallback(() => {
    if (state.localStream) {
      const audioTrack = state.localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsAudioEnabled(audioTrack.enabled);
      
      connections.forEach((conn) => {
        conn.send({
          type: 'AUDIO_STATE',
          enabled: audioTrack.enabled,
          peerId: peer?.id,
        });
      });
    }
  }, [state.localStream, peer, connections]);

  const toggleVideo = useCallback(() => {
    if (state.localStream) {
      const videoTrack = state.localStream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoEnabled(videoTrack.enabled);
      
      connections.forEach((conn) => {
        conn.send({
          type: 'VIDEO_STATE',
          enabled: videoTrack.enabled,
          peerId: peer?.id,
        });
      });
    }
  }, [state.localStream, peer, connections]);

  const toggleScreenShare = useCallback(async () => {
    try {
      if (isScreenSharing) {
        if (state.screenStream) {
          state.screenStream.getTracks().forEach(track => track.stop());
          setState(prev => ({ ...prev, screenStream: null }));
        }
      } else {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        setState(prev => ({ ...prev, screenStream }));

        state.participants.forEach((_, peerId) => {
          if (peer) {
            const call = peer.call(peerId, screenStream, {
              metadata: JSON.stringify({ 
                type: 'SCREEN_SHARE',
                name: userName || 'Host',
              }),
            });

            call.on('error', (error) => {
              console.error('Screen sharing call error:', error);
            });
          }
        });

        screenStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          setState(prev => ({ ...prev, screenStream: null }));
          
          connections.forEach((conn) => {
            conn.send({
              type: 'SCREEN_SHARE_ENDED',
              peerId: peer?.id,
            });
          });
        };
      }
      setIsScreenSharing(!isScreenSharing);
    } catch (error) {
      console.error('Error sharing screen:', error);
    }
  }, [isScreenSharing, peer, state.participants, state.screenStream, userName, connections]);

  const handleReviewSubmit = async (rating: number, feedback: string) => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/gd/rating', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gdRating: rating,
          gdFeedback: feedback,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      setShowReviewForm(false);
      window.location.href = '/';
    } catch (error) {
      console.error('Error submitting review:', error);
      // Still redirect even if review submission fails
      window.location.href = '/';
    }
  };

  const endCall = useCallback(() => {
    state.localStream?.getTracks().forEach(track => track.stop());
    state.screenStream?.getTracks().forEach(track => track.stop());
    
    connections.forEach((conn) => {
      conn.send({ type: 'CALL_ENDED' });
      conn.close();
    });
    
    peer?.destroy();
    
    setShowReviewForm(true);
  }, [peer, state.localStream, state.screenStream, connections]);

  const removeParticipant = useCallback((participantId: string) => {
    setState(prev => {
      const newParticipants = new Map(prev.participants);
      newParticipants.delete(participantId);
      return { ...prev, participants: newParticipants };
    });
    
    const conn = connections.get(participantId);
    if (conn) {
      conn.send({ type: 'REMOVED_FROM_CALL' });
      conn.close();
      connections.delete(participantId);
    }
  }, [connections]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      {showJoinModal && <JoinRequestModal onSubmit={handleJoinRequest} />}
      {showReviewForm && (
        <ReviewForm
          onSubmit={handleReviewSubmit}
          onClose={() => {
            setShowReviewForm(false);
            window.location.href = '/';
          }}
        />
      )}
      {state.isHost && (
        <JoinRequestsList
          requests={state.joinRequests}
          onAccept={acceptJoinRequest}
          onReject={rejectJoinRequest}
        />
      )}
      <VideoGrid
        participants={state.participants}
        localStream={state.localStream}
        isHost={state.isHost}
        onRemoveParticipant={removeParticipant}
      />
      <Controls
        isAudioEnabled={isAudioEnabled}
        isVideoEnabled={isVideoEnabled}
        isScreenSharing={isScreenSharing}
        onToggleAudio={toggleAudio}
        onToggleVideo={toggleVideo}
        onToggleScreenShare={toggleScreenShare}
        onEndCall={endCall}
        roomId={state.roomId}
        isHost={state.isHost}
        onShowParticipants={() => setShowParticipants(true)}
        onShowChat={() => setShowChat(true)}
      />
      {showParticipants && (
        <ParticipantsList
          participants={state.participants}
          onClose={() => setShowParticipants(false)}
          onRemoveParticipant={removeParticipant}
          isHost={state.isHost}
        />
      )}
      {showChat && (
        <Chat
          messages={state.messages}
          onSendMessage={sendChatMessage}
          onClose={() => setShowChat(false)}
          userName={userName || 'Host'}
        />
      )}
    </div>
  );
}

export default App;