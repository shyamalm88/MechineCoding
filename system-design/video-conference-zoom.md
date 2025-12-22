# Video Conference (Zoom) - Frontend System Design

## Table of Contents

1. [Requirements Overview](#1-requirements-overview)
2. [High-Level Architecture](#2-high-level-architecture)
3. [Core Data Types](#3-core-data-types)
4. [Meeting Store (Zustand)](#4-meeting-store-zustand)
5. [WebRTC Connection Manager](#5-webrtc-connection-manager)
6. [Video Grid Component](#6-video-grid-component)
7. [Video Tile Component](#7-video-tile-component)
8. [Controls Bar](#8-controls-bar)
9. [Control Button Component](#9-control-button-component)
10. [Chat Panel](#10-chat-panel)
11. [Participants Panel](#11-participants-panel)
12. [Screen Share View](#12-screen-share-view)
13. [Reactions System](#13-reactions-system)
14. [Audio Level Detection](#14-audio-level-detection)
15. [Signaling Service (WebSocket)](#15-signaling-service-websocket)
16. [Device Settings Dialog](#16-device-settings-dialog)
17. [Pre-Join Screen](#17-pre-join-screen)
18. [Keyboard Shortcuts](#18-keyboard-shortcuts)
19. [Connection Quality Indicator](#19-connection-quality-indicator)

---

## 1. Requirements Overview

### Functional Requirements
- **Video Grid**: Display multiple participants in grid/speaker view
- **Screen Sharing**: Share screen, window, or tab
- **Chat**: In-meeting text chat with reactions
- **Controls**: Mute/unmute, camera on/off, leave meeting
- **Participants Panel**: View and manage participants
- **Reactions**: Raise hand, emoji reactions
- **Recording**: Cloud/local recording indicator
- **Virtual Backgrounds**: Apply background effects
- **Breakout Rooms**: Split into smaller groups

### Non-Functional Requirements
- **Latency**: < 150ms end-to-end video latency
- **Quality**: Adaptive bitrate for network conditions
- **Scalability**: Support 100+ participants
- **Accessibility**: Keyboard navigation, screen reader support
- **Cross-browser**: Chrome, Firefox, Safari, Edge support

---

## 2. High-Level Architecture

```
+------------------------------------------------------------------+
|                     Video Conference App                          |
+------------------------------------------------------------------+
|  +------------------+  +-------------------+  +----------------+  |
|  |   Video Grid     |  |   Controls Bar    |  |  Side Panels   |  |
|  |   - Gallery      |  |   - Mute/Video    |  |  - Chat        |  |
|  |   - Speaker      |  |   - Share Screen  |  |  - Participants|  |
|  |   - Screen Share |  |   - Reactions     |  |  - Settings    |  |
|  +------------------+  +-------------------+  +----------------+  |
+------------------------------------------------------------------+
|                     WebRTC Layer                                  |
|  - PeerConnection   - MediaStream   - DataChannel                |
+------------------------------------------------------------------+
|                     Signaling (WebSocket)                         |
|  - Join/Leave   - Offer/Answer   - ICE Candidates                |
+------------------------------------------------------------------+
```

---

## 3. Core Data Types

```typescript
// types/conference.ts
interface Participant {
  id: string;
  name: string;
  avatar?: string;
  isHost: boolean;
  isMuted: boolean;
  isVideoOn: boolean;
  isScreenSharing: boolean;
  isHandRaised: boolean;
  isSpeaking: boolean;
  connectionQuality: 'excellent' | 'good' | 'poor' | 'disconnected';
  stream?: MediaStream;
}

interface Meeting {
  id: string;
  title: string;
  hostId: string;
  participants: Participant[];
  startTime: string;
  isRecording: boolean;
  settings: MeetingSettings;
}

interface MeetingSettings {
  allowScreenShare: boolean;
  allowChat: boolean;
  muteOnEntry: boolean;
  waitingRoom: boolean;
  maxParticipants: number;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  type: 'text' | 'reaction' | 'system';
  replyTo?: string;
}

interface Reaction {
  type: 'thumbsUp' | 'clap' | 'heart' | 'laugh' | 'surprised';
  participantId: string;
  timestamp: number;
}

interface MediaConstraints {
  video: boolean | MediaTrackConstraints;
  audio: boolean | MediaTrackConstraints;
}

interface VideoLayout {
  mode: 'gallery' | 'speaker' | 'spotlight';
  pinnedParticipantId?: string;
  gridSize: number;
}
```

---

## 4. Meeting Store (Zustand)

```typescript
// stores/meetingStore.ts
import { create } from 'zustand';

interface MeetingState {
  meeting: Meeting | null;
  localParticipant: Participant | null;
  remoteParticipants: Map<string, Participant>;
  layout: VideoLayout;
  activeSpeakerId: string | null;

  // Local media state
  localStream: MediaStream | null;
  screenStream: MediaStream | null;
  isMuted: boolean;
  isVideoOn: boolean;
  isScreenSharing: boolean;

  // Actions
  setMeeting: (meeting: Meeting) => void;
  addParticipant: (participant: Participant) => void;
  removeParticipant: (participantId: string) => void;
  updateParticipant: (participantId: string, updates: Partial<Participant>) => void;
  setLocalStream: (stream: MediaStream | null) => void;
  toggleMute: () => void;
  toggleVideo: () => void;
  setLayout: (layout: Partial<VideoLayout>) => void;
  setActiveSpeaker: (participantId: string | null) => void;
}

export const useMeetingStore = create<MeetingState>((set, get) => ({
  meeting: null,
  localParticipant: null,
  remoteParticipants: new Map(),
  layout: { mode: 'gallery', gridSize: 9 },
  activeSpeakerId: null,

  localStream: null,
  screenStream: null,
  isMuted: false,
  isVideoOn: true,
  isScreenSharing: false,

  setMeeting: (meeting) => set({ meeting }),

  addParticipant: (participant) => {
    set((state) => {
      const updated = new Map(state.remoteParticipants);
      updated.set(participant.id, participant);
      return { remoteParticipants: updated };
    });
  },

  removeParticipant: (participantId) => {
    set((state) => {
      const updated = new Map(state.remoteParticipants);
      updated.delete(participantId);
      return { remoteParticipants: updated };
    });
  },

  updateParticipant: (participantId, updates) => {
    set((state) => {
      const updated = new Map(state.remoteParticipants);
      const participant = updated.get(participantId);
      if (participant) {
        updated.set(participantId, { ...participant, ...updates });
      }
      return { remoteParticipants: updated };
    });
  },

  setLocalStream: (stream) => set({ localStream: stream }),

  toggleMute: () => {
    const { localStream, isMuted } = get();
    localStream?.getAudioTracks().forEach((track) => {
      track.enabled = isMuted;
    });
    set({ isMuted: !isMuted });
  },

  toggleVideo: () => {
    const { localStream, isVideoOn } = get();
    localStream?.getVideoTracks().forEach((track) => {
      track.enabled = !isVideoOn;
    });
    set({ isVideoOn: !isVideoOn });
  },

  setLayout: (layout) => set((state) => ({
    layout: { ...state.layout, ...layout },
  })),

  setActiveSpeaker: (participantId) => set({ activeSpeakerId: participantId }),
}));
```

---

## 5. WebRTC Connection Manager

```typescript
// lib/webrtc/PeerConnectionManager.ts
interface PeerConnectionConfig {
  iceServers: RTCIceServer[];
  onTrack: (participantId: string, stream: MediaStream) => void;
  onConnectionStateChange: (participantId: string, state: RTCPeerConnectionState) => void;
}

export class PeerConnectionManager {
  private connections = new Map<string, RTCPeerConnection>();
  private config: PeerConnectionConfig;
  private localStream: MediaStream | null = null;

  constructor(config: PeerConnectionConfig) {
    this.config = config;
  }

  setLocalStream(stream: MediaStream) {
    this.localStream = stream;
    // Add tracks to existing connections
    this.connections.forEach((pc) => {
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });
    });
  }

  async createConnection(participantId: string): Promise<RTCPeerConnection> {
    const pc = new RTCPeerConnection({
      iceServers: this.config.iceServers,
    });

    // Add local tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        pc.addTrack(track, this.localStream!);
      });
    }

    // Handle incoming tracks
    pc.ontrack = (event) => {
      this.config.onTrack(participantId, event.streams[0]);
    };

    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      this.config.onConnectionStateChange(participantId, pc.connectionState);
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendIceCandidate(participantId, event.candidate);
      }
    };

    this.connections.set(participantId, pc);
    return pc;
  }

  async createOffer(participantId: string): Promise<RTCSessionDescriptionInit> {
    const pc = this.connections.get(participantId);
    if (!pc) throw new Error('No connection found');

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    return offer;
  }

  async handleOffer(
    participantId: string,
    offer: RTCSessionDescriptionInit
  ): Promise<RTCSessionDescriptionInit> {
    let pc = this.connections.get(participantId);
    if (!pc) {
      pc = await this.createConnection(participantId);
    }

    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    return answer;
  }

  async handleAnswer(participantId: string, answer: RTCSessionDescriptionInit) {
    const pc = this.connections.get(participantId);
    if (!pc) throw new Error('No connection found');
    await pc.setRemoteDescription(new RTCSessionDescription(answer));
  }

  async addIceCandidate(participantId: string, candidate: RTCIceCandidateInit) {
    const pc = this.connections.get(participantId);
    if (pc) {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
  }

  closeConnection(participantId: string) {
    const pc = this.connections.get(participantId);
    if (pc) {
      pc.close();
      this.connections.delete(participantId);
    }
  }

  closeAll() {
    this.connections.forEach((pc) => pc.close());
    this.connections.clear();
  }

  private sendIceCandidate(participantId: string, candidate: RTCIceCandidate) {
    // Send via signaling server
    signalingService.send({
      type: 'ice-candidate',
      targetId: participantId,
      candidate: candidate.toJSON(),
    });
  }
}
```

---

## 6. Video Grid Component

```tsx
// components/VideoGrid.tsx
import { useMemo } from 'react';

interface VideoGridProps {
  participants: Participant[];
  localParticipant: Participant;
  layout: VideoLayout;
  activeSpeakerId: string | null;
}

export function VideoGrid({
  participants,
  localParticipant,
  layout,
  activeSpeakerId,
}: VideoGridProps) {
  const allParticipants = useMemo(
    () => [localParticipant, ...participants],
    [localParticipant, participants]
  );

  // Calculate grid dimensions
  const gridConfig = useMemo(() => {
    const count = allParticipants.length;
    if (count === 1) return { cols: 1, rows: 1 };
    if (count === 2) return { cols: 2, rows: 1 };
    if (count <= 4) return { cols: 2, rows: 2 };
    if (count <= 6) return { cols: 3, rows: 2 };
    if (count <= 9) return { cols: 3, rows: 3 };
    if (count <= 16) return { cols: 4, rows: 4 };
    return { cols: 5, rows: Math.ceil(count / 5) };
  }, [allParticipants.length]);

  if (layout.mode === 'speaker') {
    return (
      <SpeakerView
        participants={allParticipants}
        activeSpeakerId={activeSpeakerId || layout.pinnedParticipantId}
      />
    );
  }

  return (
    <div
      className="h-full w-full p-2 grid gap-2"
      style={{
        gridTemplateColumns: `repeat(${gridConfig.cols}, 1fr)`,
        gridTemplateRows: `repeat(${gridConfig.rows}, 1fr)`,
      }}
    >
      {allParticipants.slice(0, layout.gridSize).map((participant) => (
        <VideoTile
          key={participant.id}
          participant={participant}
          isLocal={participant.id === localParticipant.id}
          isActiveSpeaker={participant.id === activeSpeakerId}
          isPinned={participant.id === layout.pinnedParticipantId}
        />
      ))}
    </div>
  );
}

function SpeakerView({
  participants,
  activeSpeakerId,
}: {
  participants: Participant[];
  activeSpeakerId?: string;
}) {
  const speaker = participants.find((p) => p.id === activeSpeakerId) || participants[0];
  const others = participants.filter((p) => p.id !== speaker?.id);

  return (
    <div className="h-full flex flex-col gap-2 p-2">
      {/* Main speaker */}
      <div className="flex-1">
        {speaker && (
          <VideoTile
            participant={speaker}
            isLocal={false}
            isActiveSpeaker={true}
            className="h-full"
          />
        )}
      </div>

      {/* Filmstrip */}
      {others.length > 0 && (
        <div className="flex gap-2 h-32 overflow-x-auto">
          {others.map((participant) => (
            <VideoTile
              key={participant.id}
              participant={participant}
              isLocal={false}
              className="w-48 flex-shrink-0"
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 7. Video Tile Component

```tsx
// components/VideoTile.tsx
import { useRef, useEffect, useState } from 'react';
import { Mic, MicOff, Pin, MoreVertical, Hand, Wifi } from 'lucide-react';

interface VideoTileProps {
  participant: Participant;
  isLocal: boolean;
  isActiveSpeaker?: boolean;
  isPinned?: boolean;
  className?: string;
}

export function VideoTile({
  participant,
  isLocal,
  isActiveSpeaker,
  isPinned,
  className,
}: VideoTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showMenu, setShowMenu] = useState(false);

  // Attach stream to video element
  useEffect(() => {
    if (videoRef.current && participant.stream) {
      videoRef.current.srcObject = participant.stream;
    }
  }, [participant.stream]);

  const connectionColor = {
    excellent: 'bg-green-500',
    good: 'bg-yellow-500',
    poor: 'bg-red-500',
    disconnected: 'bg-gray-500',
  }[participant.connectionQuality];

  return (
    <div
      className={cn(
        'relative rounded-lg overflow-hidden bg-gray-900',
        isActiveSpeaker && 'ring-2 ring-green-500',
        className
      )}
    >
      {/* Video */}
      {participant.isVideoOn && participant.stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className={cn(
            'w-full h-full object-cover',
            isLocal && 'scale-x-[-1]' // Mirror local video
          )}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-800">
          <div className="w-20 h-20 rounded-full bg-gray-600 flex items-center justify-center text-2xl font-semibold text-white">
            {participant.name[0]?.toUpperCase()}
          </div>
        </div>
      )}

      {/* Speaking indicator */}
      {participant.isSpeaking && (
        <div className="absolute inset-0 ring-2 ring-green-400 rounded-lg pointer-events-none" />
      )}

      {/* Name bar */}
      <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-gradient-to-t from-black/60 to-transparent">
        <div className="flex items-center gap-2">
          {/* Mute indicator */}
          {participant.isMuted ? (
            <MicOff className="w-4 h-4 text-red-400" />
          ) : (
            <Mic className="w-4 h-4 text-white" />
          )}

          {/* Name */}
          <span className="text-white text-sm truncate">
            {participant.name} {isLocal && '(You)'}
          </span>

          {/* Host badge */}
          {participant.isHost && (
            <span className="text-xs bg-blue-500 px-1.5 py-0.5 rounded text-white">
              Host
            </span>
          )}

          {/* Pinned indicator */}
          {isPinned && <Pin className="w-3 h-3 text-yellow-400" />}
        </div>
      </div>

      {/* Top indicators */}
      <div className="absolute top-2 left-2 flex items-center gap-2">
        {/* Connection quality */}
        <div className={cn('w-2 h-2 rounded-full', connectionColor)} />

        {/* Hand raised */}
        {participant.isHandRaised && (
          <div className="bg-yellow-500 p-1 rounded">
            <Hand className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      {/* Context menu trigger */}
      {!isLocal && (
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="absolute top-2 right-2 p-1 bg-black/50 rounded opacity-0 group-hover:opacity-100 hover:bg-black/70"
        >
          <MoreVertical className="w-4 h-4 text-white" />
        </button>
      )}

      {/* Context menu */}
      {showMenu && (
        <ParticipantMenu
          participant={participant}
          onClose={() => setShowMenu(false)}
        />
      )}
    </div>
  );
}
```

---

## 8. Controls Bar

```tsx
// components/ControlsBar.tsx
import { useState } from 'react';
import {
  Mic, MicOff, Video, VideoOff, Monitor, MessageSquare,
  Users, Hand, Smile, Settings, PhoneOff, MoreHorizontal, Grid, Layout
} from 'lucide-react';

export function ControlsBar() {
  const { isMuted, isVideoOn, isScreenSharing, toggleMute, toggleVideo, layout, setLayout } =
    useMeetingStore();
  const [showReactions, setShowReactions] = useState(false);
  const [activePanel, setActivePanel] = useState<'chat' | 'participants' | null>(null);

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: 'always' },
        audio: true,
      });
      // Handle screen share stream
      meetingService.shareScreen(stream);
    } catch (err) {
      console.error('Screen share failed:', err);
    }
  };

  const leaveMeeting = () => {
    if (confirm('Are you sure you want to leave the meeting?')) {
      meetingService.leave();
      router.push('/');
    }
  };

  return (
    <div className="h-16 bg-gray-800 flex items-center justify-between px-4">
      {/* Left controls */}
      <div className="flex items-center gap-2">
        {/* Mute button */}
        <ControlButton
          icon={isMuted ? MicOff : Mic}
          label={isMuted ? 'Unmute' : 'Mute'}
          active={!isMuted}
          danger={isMuted}
          onClick={toggleMute}
          shortcut="Alt+A"
        />

        {/* Video button */}
        <ControlButton
          icon={isVideoOn ? Video : VideoOff}
          label={isVideoOn ? 'Stop Video' : 'Start Video'}
          active={isVideoOn}
          danger={!isVideoOn}
          onClick={toggleVideo}
          shortcut="Alt+V"
        />
      </div>

      {/* Center controls */}
      <div className="flex items-center gap-2">
        {/* Screen share */}
        <ControlButton
          icon={Monitor}
          label={isScreenSharing ? 'Stop Share' : 'Share Screen'}
          active={isScreenSharing}
          onClick={startScreenShare}
        />

        {/* Participants */}
        <ControlButton
          icon={Users}
          label="Participants"
          active={activePanel === 'participants'}
          onClick={() => setActivePanel(activePanel === 'participants' ? null : 'participants')}
          badge={12}
        />

        {/* Chat */}
        <ControlButton
          icon={MessageSquare}
          label="Chat"
          active={activePanel === 'chat'}
          onClick={() => setActivePanel(activePanel === 'chat' ? null : 'chat')}
          badge={3}
        />

        {/* Reactions */}
        <div className="relative">
          <ControlButton
            icon={Smile}
            label="Reactions"
            onClick={() => setShowReactions(!showReactions)}
          />
          {showReactions && (
            <ReactionPicker onSelect={(reaction) => {
              sendReaction(reaction);
              setShowReactions(false);
            }} />
          )}
        </div>

        {/* Raise hand */}
        <ControlButton
          icon={Hand}
          label="Raise Hand"
          onClick={() => meetingService.toggleHandRaise()}
        />

        {/* Layout toggle */}
        <ControlButton
          icon={layout.mode === 'gallery' ? Grid : Layout}
          label={layout.mode === 'gallery' ? 'Speaker View' : 'Gallery View'}
          onClick={() => setLayout({
            mode: layout.mode === 'gallery' ? 'speaker' : 'gallery',
          })}
        />
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        <ControlButton icon={Settings} label="Settings" onClick={() => {}} />

        {/* Leave button */}
        <button
          onClick={leaveMeeting}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
        >
          <PhoneOff className="w-5 h-5" />
          Leave
        </button>
      </div>
    </div>
  );
}
```

---

## 9. Control Button Component

```tsx
// components/ControlButton.tsx
import { forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';

interface ControlButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  active?: boolean;
  danger?: boolean;
  disabled?: boolean;
  badge?: number;
  shortcut?: string;
}

export const ControlButton = forwardRef<HTMLButtonElement, ControlButtonProps>(
  ({ icon: Icon, label, onClick, active, danger, disabled, badge, shortcut }, ref) => {
    return (
      <div className="relative group">
        <button
          ref={ref}
          onClick={onClick}
          disabled={disabled}
          className={cn(
            'flex flex-col items-center justify-center w-16 h-14 rounded-lg transition-colors',
            active && 'bg-gray-700',
            danger && 'bg-red-500/20',
            !active && !danger && 'hover:bg-gray-700',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          title={`${label}${shortcut ? ` (${shortcut})` : ''}`}
        >
          <div className="relative">
            <Icon
              className={cn(
                'w-6 h-6',
                danger ? 'text-red-400' : 'text-white'
              )}
            />
            {badge !== undefined && badge > 0 && (
              <span className="absolute -top-1 -right-2 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-xs rounded-full px-1">
                {badge > 99 ? '99+' : badge}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-300 mt-1">{label}</span>
        </button>

        {/* Tooltip with shortcut */}
        {shortcut && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
            {label} <kbd className="bg-gray-700 px-1 rounded">{shortcut}</kbd>
          </div>
        )}
      </div>
    );
  }
);
```

---

## 10. Chat Panel

```tsx
// components/ChatPanel.tsx
import { useState, useRef, useEffect } from 'react';
import { Send, X, Smile } from 'lucide-react';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSend: (content: string) => void;
  onClose: () => void;
}

export function ChatPanel({ messages, onSend, onClose }: ChatPanelProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-80 h-full bg-white flex flex-col border-l">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h3 className="font-semibold">In-meeting Chat</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <ChatMessageItem key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ChatMessageItem({ message }: { message: ChatMessage }) {
  const isSystem = message.type === 'system';

  if (isSystem) {
    return (
      <div className="text-center text-sm text-gray-500 py-1">
        {message.content}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <span className="font-medium text-sm">{message.senderName}</span>
        <span className="text-xs text-gray-400">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
      <p className="text-sm text-gray-700">{message.content}</p>
    </div>
  );
}
```

---

## 11. Participants Panel

```tsx
// components/ParticipantsPanel.tsx
import { useState } from 'react';
import { X, Mic, MicOff, Video, VideoOff, MoreVertical, Search, Hand, Crown } from 'lucide-react';

interface ParticipantsPanelProps {
  participants: Participant[];
  localParticipant: Participant;
  isHost: boolean;
  onClose: () => void;
}

export function ParticipantsPanel({
  participants,
  localParticipant,
  isHost,
  onClose,
}: ParticipantsPanelProps) {
  const [search, setSearch] = useState('');

  const allParticipants = [localParticipant, ...participants];
  const filteredParticipants = search
    ? allParticipants.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
    : allParticipants;

  // Sort: host first, then raised hands, then alphabetical
  const sortedParticipants = [...filteredParticipants].sort((a, b) => {
    if (a.isHost !== b.isHost) return a.isHost ? -1 : 1;
    if (a.isHandRaised !== b.isHandRaised) return a.isHandRaised ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="w-80 h-full bg-white flex flex-col border-l">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h3 className="font-semibold">Participants ({allParticipants.length})</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Search */}
      <div className="p-3 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search participants..."
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm"
          />
        </div>
      </div>

      {/* Host controls */}
      {isHost && (
        <div className="p-3 border-b flex gap-2">
          <button
            onClick={() => meetingService.muteAll()}
            className="flex-1 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded"
          >
            Mute All
          </button>
          <button
            onClick={() => meetingService.lowerAllHands()}
            className="flex-1 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded"
          >
            Lower All Hands
          </button>
        </div>
      )}

      {/* Participants list */}
      <div className="flex-1 overflow-y-auto">
        {sortedParticipants.map((participant) => (
          <ParticipantItem
            key={participant.id}
            participant={participant}
            isLocal={participant.id === localParticipant.id}
            isHost={isHost}
          />
        ))}
      </div>
    </div>
  );
}

function ParticipantItem({
  participant,
  isLocal,
  isHost,
}: {
  participant: Participant;
  isLocal: boolean;
  isHost: boolean;
}) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium">
        {participant.name[0].toUpperCase()}
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm truncate">
            {participant.name} {isLocal && '(You)'}
          </span>
          {participant.isHost && <Crown className="w-4 h-4 text-yellow-500" />}
          {participant.isHandRaised && <Hand className="w-4 h-4 text-yellow-500" />}
        </div>
      </div>

      {/* Status icons */}
      <div className="flex items-center gap-1">
        {participant.isMuted ? (
          <MicOff className="w-4 h-4 text-red-400" />
        ) : (
          <Mic className="w-4 h-4 text-gray-400" />
        )}
        {!participant.isVideoOn && <VideoOff className="w-4 h-4 text-red-400" />}
      </div>

      {/* Menu (for host) */}
      {isHost && !isLocal && (
        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)} className="p-1 hover:bg-gray-200 rounded">
            <MoreVertical className="w-4 h-4" />
          </button>
          {showMenu && (
            <ParticipantContextMenu
              participant={participant}
              onClose={() => setShowMenu(false)}
            />
          )}
        </div>
      )}
    </div>
  );
}
```

---

## 12. Screen Share View

```tsx
// components/ScreenShareView.tsx
import { useEffect, useRef } from 'react';
import { Monitor, X, Maximize, Minimize } from 'lucide-react';

interface ScreenShareViewProps {
  stream: MediaStream;
  sharerName: string;
  isLocal: boolean;
  onStopShare?: () => void;
}

export function ScreenShareView({
  stream,
  sharerName,
  isLocal,
  onStopShare,
}: ScreenShareViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div className="relative flex-1 bg-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-contain"
      />

      {/* Overlay header */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Monitor className="w-5 h-5" />
            <span className="font-medium">
              {isLocal ? 'You are sharing your screen' : `${sharerName} is sharing their screen`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="p-2 bg-black/50 hover:bg-black/70 rounded text-white"
            >
              {isFullscreen ? (
                <Minimize className="w-5 h-5" />
              ) : (
                <Maximize className="w-5 h-5" />
              )}
            </button>

            {isLocal && onStopShare && (
              <button
                onClick={onStopShare}
                className="flex items-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
              >
                <X className="w-4 h-4" />
                Stop Sharing
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook to handle screen sharing
function useScreenShare() {
  const { setScreenStream } = useMeetingStore();
  const [isSharing, setIsSharing] = useState(false);

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: 'always',
          displaySurface: 'monitor',
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      // Handle stream end (user clicks stop in browser UI)
      stream.getVideoTracks()[0].onended = () => {
        stopScreenShare();
      };

      setScreenStream(stream);
      setIsSharing(true);

      // Notify other participants
      signalingService.send({ type: 'screen-share-start' });

      return stream;
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Screen share failed:', err);
      }
      return null;
    }
  };

  const stopScreenShare = () => {
    const { screenStream } = useMeetingStore.getState();
    screenStream?.getTracks().forEach((track) => track.stop());
    setScreenStream(null);
    setIsSharing(false);
    signalingService.send({ type: 'screen-share-stop' });
  };

  return { isSharing, startScreenShare, stopScreenShare };
}
```

---

## 13. Reactions System

```tsx
// components/ReactionPicker.tsx
const REACTIONS = [
  { type: 'thumbsUp', emoji: '👍', label: 'Thumbs up' },
  { type: 'clap', emoji: '👏', label: 'Clap' },
  { type: 'heart', emoji: '❤️', label: 'Heart' },
  { type: 'laugh', emoji: '😂', label: 'Laugh' },
  { type: 'surprised', emoji: '😮', label: 'Surprised' },
] as const;

interface ReactionPickerProps {
  onSelect: (reaction: Reaction['type']) => void;
}

export function ReactionPicker({ onSelect }: ReactionPickerProps) {
  return (
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-white rounded-lg shadow-lg border flex gap-1">
      {REACTIONS.map((reaction) => (
        <button
          key={reaction.type}
          onClick={() => onSelect(reaction.type)}
          className="w-10 h-10 text-2xl hover:bg-gray-100 rounded-lg flex items-center justify-center"
          title={reaction.label}
        >
          {reaction.emoji}
        </button>
      ))}
    </div>
  );
}

// Floating reaction display
export function FloatingReactions({ reactions }: { reactions: Reaction[] }) {
  const [visibleReactions, setVisibleReactions] = useState<(Reaction & { key: string })[]>([]);

  useEffect(() => {
    // Add new reactions with unique keys
    reactions.forEach((reaction) => {
      const key = `${reaction.participantId}-${reaction.timestamp}`;
      setVisibleReactions((prev) => [...prev, { ...reaction, key }]);

      // Remove after animation
      setTimeout(() => {
        setVisibleReactions((prev) => prev.filter((r) => r.key !== key));
      }, 3000);
    });
  }, [reactions]);

  return (
    <div className="absolute bottom-20 right-4 pointer-events-none">
      {visibleReactions.map((reaction) => (
        <FloatingEmoji key={reaction.key} type={reaction.type} />
      ))}
    </div>
  );
}

function FloatingEmoji({ type }: { type: Reaction['type'] }) {
  const emoji = REACTIONS.find((r) => r.type === type)?.emoji;

  return (
    <div className="animate-float-up text-4xl">
      {emoji}
    </div>
  );
}

// CSS for float animation
// @keyframes float-up {
//   0% { opacity: 1; transform: translateY(0) scale(1); }
//   100% { opacity: 0; transform: translateY(-100px) scale(1.5); }
// }
// .animate-float-up { animation: float-up 3s ease-out forwards; }
```

---

## 14. Audio Level Detection

```typescript
// lib/audioAnalyzer.ts
export class AudioLevelAnalyzer {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array | null = null;
  private animationFrame: number | null = null;
  private onSpeakingChange: (isSpeaking: boolean) => void;
  private speakingThreshold = 30;
  private silenceDelay = 500;
  private isSpeaking = false;
  private silenceTimer: NodeJS.Timeout | null = null;

  constructor(onSpeakingChange: (isSpeaking: boolean) => void) {
    this.onSpeakingChange = onSpeakingChange;
  }

  async connect(stream: MediaStream) {
    this.audioContext = new AudioContext();
    const source = this.audioContext.createMediaStreamSource(stream);

    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = 0.8;

    source.connect(this.analyser);

    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.startMonitoring();
  }

  private startMonitoring() {
    const checkLevel = () => {
      if (!this.analyser || !this.dataArray) return;

      this.analyser.getByteFrequencyData(this.dataArray);

      // Calculate average volume
      const average = this.dataArray.reduce((a, b) => a + b, 0) / this.dataArray.length;

      if (average > this.speakingThreshold) {
        // Clear silence timer if speaking
        if (this.silenceTimer) {
          clearTimeout(this.silenceTimer);
          this.silenceTimer = null;
        }

        if (!this.isSpeaking) {
          this.isSpeaking = true;
          this.onSpeakingChange(true);
        }
      } else if (this.isSpeaking && !this.silenceTimer) {
        // Start silence timer
        this.silenceTimer = setTimeout(() => {
          this.isSpeaking = false;
          this.onSpeakingChange(false);
          this.silenceTimer = null;
        }, this.silenceDelay);
      }

      this.animationFrame = requestAnimationFrame(checkLevel);
    };

    checkLevel();
  }

  disconnect() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}

// Hook for detecting active speaker
export function useActiveSpeaker(participants: Map<string, Participant>) {
  const { setActiveSpeaker } = useMeetingStore();
  const speakerScores = useRef(new Map<string, number>());

  useEffect(() => {
    // Update scores based on speaking state
    participants.forEach((participant, id) => {
      const currentScore = speakerScores.current.get(id) || 0;
      if (participant.isSpeaking) {
        speakerScores.current.set(id, currentScore + 1);
      } else {
        speakerScores.current.set(id, Math.max(0, currentScore - 0.5));
      }
    });

    // Find participant with highest score
    let maxScore = 0;
    let activeSpeakerId: string | null = null;

    speakerScores.current.forEach((score, id) => {
      if (score > maxScore && score > 3) {
        maxScore = score;
        activeSpeakerId = id;
      }
    });

    setActiveSpeaker(activeSpeakerId);
  }, [participants, setActiveSpeaker]);
}
```

---

## 15. Signaling Service (WebSocket)

```typescript
// lib/signalingService.ts
type SignalingMessage =
  | { type: 'join'; meetingId: string; participant: Participant }
  | { type: 'leave'; participantId: string }
  | { type: 'offer'; targetId: string; sdp: RTCSessionDescriptionInit }
  | { type: 'answer'; targetId: string; sdp: RTCSessionDescriptionInit }
  | { type: 'ice-candidate'; targetId: string; candidate: RTCIceCandidateInit }
  | { type: 'mute'; participantId: string; isMuted: boolean }
  | { type: 'video'; participantId: string; isVideoOn: boolean }
  | { type: 'screen-share-start'; participantId: string }
  | { type: 'screen-share-stop'; participantId: string }
  | { type: 'hand-raise'; participantId: string; isRaised: boolean }
  | { type: 'reaction'; participantId: string; reaction: Reaction['type'] }
  | { type: 'chat'; message: ChatMessage };

class SignalingService {
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private messageQueue: SignalingMessage[] = [];
  private handlers = new Map<string, Set<(data: any) => void>>();

  connect(meetingId: string, token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const url = `wss://signaling.example.com/meeting/${meetingId}?token=${token}`;
      this.socket = new WebSocket(url);

      this.socket.onopen = () => {
        this.reconnectAttempts = 0;
        // Send queued messages
        this.messageQueue.forEach((msg) => this.send(msg));
        this.messageQueue = [];
        resolve();
      };

      this.socket.onmessage = (event) => {
        const message = JSON.parse(event.data) as SignalingMessage;
        this.emit(message.type, message);
      };

      this.socket.onclose = (event) => {
        if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
          setTimeout(() => this.connect(meetingId, token), delay);
        }
      };

      this.socket.onerror = (error) => {
        reject(error);
      };
    });
  }

  send(message: SignalingMessage) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      this.messageQueue.push(message);
    }
  }

  on(type: string, handler: (data: any) => void) {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    this.handlers.get(type)!.add(handler);

    return () => {
      this.handlers.get(type)?.delete(handler);
    };
  }

  private emit(type: string, data: any) {
    this.handlers.get(type)?.forEach((handler) => handler(data));
  }

  disconnect() {
    this.socket?.close();
    this.socket = null;
  }
}

export const signalingService = new SignalingService();
```

---

## 16. Device Settings Dialog

```tsx
// components/DeviceSettings.tsx
import { useState, useEffect } from 'react';
import { Camera, Mic, Speaker, RefreshCw } from 'lucide-react';

interface DeviceSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DeviceSettings({ isOpen, onClose }: DeviceSettingsProps) {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [selectedMic, setSelectedMic] = useState<string>('');
  const [selectedSpeaker, setSelectedSpeaker] = useState<string>('');
  const [previewStream, setPreviewStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadDevices();
      startPreview();
    } else {
      stopPreview();
    }
  }, [isOpen]);

  const loadDevices = async () => {
    const deviceList = await navigator.mediaDevices.enumerateDevices();
    setDevices(deviceList);

    // Set defaults from localStorage or first available
    const savedCamera = localStorage.getItem('preferredCamera');
    const savedMic = localStorage.getItem('preferredMic');
    const savedSpeaker = localStorage.getItem('preferredSpeaker');

    const cameras = deviceList.filter((d) => d.kind === 'videoinput');
    const mics = deviceList.filter((d) => d.kind === 'audioinput');
    const speakers = deviceList.filter((d) => d.kind === 'audiooutput');

    setSelectedCamera(savedCamera || cameras[0]?.deviceId || '');
    setSelectedMic(savedMic || mics[0]?.deviceId || '');
    setSelectedSpeaker(savedSpeaker || speakers[0]?.deviceId || '');
  };

  const startPreview = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: selectedCamera ? { deviceId: selectedCamera } : true,
        audio: selectedMic ? { deviceId: selectedMic } : true,
      });
      setPreviewStream(stream);
    } catch (err) {
      console.error('Failed to start preview:', err);
    }
  };

  const stopPreview = () => {
    previewStream?.getTracks().forEach((track) => track.stop());
    setPreviewStream(null);
  };

  const saveSettings = () => {
    localStorage.setItem('preferredCamera', selectedCamera);
    localStorage.setItem('preferredMic', selectedMic);
    localStorage.setItem('preferredSpeaker', selectedSpeaker);
    onClose();
  };

  const cameras = devices.filter((d) => d.kind === 'videoinput');
  const mics = devices.filter((d) => d.kind === 'audioinput');
  const speakers = devices.filter((d) => d.kind === 'audiooutput');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Settings</h2>

        {/* Camera preview */}
        <div className="mb-6">
          <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden mb-3">
            {previewStream && (
              <video
                autoPlay
                playsInline
                muted
                ref={(el) => el && (el.srcObject = previewStream)}
                className="w-full h-full object-cover scale-x-[-1]"
              />
            )}
          </div>

          {/* Camera select */}
          <DeviceSelect
            icon={Camera}
            label="Camera"
            value={selectedCamera}
            onChange={setSelectedCamera}
            options={cameras}
          />
        </div>

        {/* Microphone */}
        <div className="mb-4">
          <DeviceSelect
            icon={Mic}
            label="Microphone"
            value={selectedMic}
            onChange={setSelectedMic}
            options={mics}
          />
          <AudioLevelMeter stream={previewStream} />
        </div>

        {/* Speaker */}
        <div className="mb-6">
          <DeviceSelect
            icon={Speaker}
            label="Speaker"
            value={selectedSpeaker}
            onChange={setSelectedSpeaker}
            options={speakers}
          />
          <button className="text-sm text-blue-600 hover:underline mt-1">
            Test Speaker
          </button>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={saveSettings}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## 17. Pre-Join Screen

```tsx
// pages/meeting/[id]/lobby.tsx
import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Video, VideoOff, Settings } from 'lucide-react';

export default function PreJoinScreen({ meetingId }: { meetingId: string }) {
  const [name, setName] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    startPreview();
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const startPreview = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError('Unable to access camera or microphone');
    }
  };

  const toggleMute = () => {
    stream?.getAudioTracks().forEach((track) => {
      track.enabled = isMuted;
    });
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    stream?.getVideoTracks().forEach((track) => {
      track.enabled = !isVideoOn;
    });
    setIsVideoOn(!isVideoOn);
  };

  const joinMeeting = async () => {
    if (!name.trim()) return;
    setIsJoining(true);

    try {
      // Connect to meeting
      await signalingService.connect(meetingId, 'auth-token');

      // Navigate to meeting room
      router.push(`/meeting/${meetingId}`, {
        state: { name, stream, isMuted, isVideoOn },
      });
    } catch (err) {
      setError('Failed to join meeting');
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Ready to join?</h1>

        {/* Video preview */}
        <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden mb-6 relative">
          {isVideoOn && stream ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-4xl text-white font-bold">
                {name[0]?.toUpperCase() || '?'}
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
            <button
              onClick={toggleMute}
              className={cn(
                'p-3 rounded-full',
                isMuted ? 'bg-red-500' : 'bg-gray-700'
              )}
            >
              {isMuted ? (
                <MicOff className="w-5 h-5 text-white" />
              ) : (
                <Mic className="w-5 h-5 text-white" />
              )}
            </button>
            <button
              onClick={toggleVideo}
              className={cn(
                'p-3 rounded-full',
                !isVideoOn ? 'bg-red-500' : 'bg-gray-700'
              )}
            >
              {isVideoOn ? (
                <Video className="w-5 h-5 text-white" />
              ) : (
                <VideoOff className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Name input */}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="w-full px-4 py-3 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500"
        />

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        {/* Join button */}
        <button
          onClick={joinMeeting}
          disabled={!name.trim() || isJoining}
          className="w-full py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
        >
          {isJoining ? 'Joining...' : 'Join Meeting'}
        </button>
      </div>
    </div>
  );
}
```

---

## 18. Keyboard Shortcuts

```tsx
// hooks/useKeyboardShortcuts.ts
import { useEffect } from 'react';

interface ShortcutMap {
  [key: string]: () => void;
}

export function useKeyboardShortcuts(shortcuts: ShortcutMap) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Build key string
      const key = [
        e.altKey && 'Alt',
        e.ctrlKey && 'Ctrl',
        e.shiftKey && 'Shift',
        e.key.toUpperCase(),
      ]
        .filter(Boolean)
        .join('+');

      const handler = shortcuts[key];
      if (handler) {
        e.preventDefault();
        handler();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

// Usage in MeetingRoom
export function MeetingRoom() {
  const { toggleMute, toggleVideo, setLayout } = useMeetingStore();

  useKeyboardShortcuts({
    'Alt+A': toggleMute,         // Toggle mute
    'Alt+V': toggleVideo,        // Toggle video
    'Alt+S': startScreenShare,   // Start screen share
    'Alt+H': toggleHandRaise,    // Raise/lower hand
    'Alt+C': toggleChat,         // Toggle chat panel
    'Alt+P': toggleParticipants, // Toggle participants panel
    'Alt+F': toggleFullscreen,   // Toggle fullscreen
    'Escape': handleEscape,      // Close panels/dialogs
  });

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      <MeetingHeader />
      <VideoGrid {...props} />
      <ControlsBar />
      <KeyboardShortcutsHelp /> {/* Shows ? to see shortcuts */}
    </div>
  );
}

// Shortcuts help dialog
function KeyboardShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false);

  useKeyboardShortcuts({
    '?': () => setIsOpen((prev) => !prev),
  });

  if (!isOpen) return null;

  const shortcuts = [
    { keys: 'Alt + A', description: 'Mute/Unmute' },
    { keys: 'Alt + V', description: 'Start/Stop Video' },
    { keys: 'Alt + S', description: 'Start/Stop Screen Share' },
    { keys: 'Alt + H', description: 'Raise/Lower Hand' },
    { keys: 'Alt + C', description: 'Toggle Chat' },
    { keys: 'Alt + P', description: 'Toggle Participants' },
    { keys: 'Alt + F', description: 'Toggle Fullscreen' },
    { keys: 'Escape', description: 'Close dialogs' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Keyboard Shortcuts</h2>
        <div className="space-y-2">
          {shortcuts.map(({ keys, description }) => (
            <div key={keys} className="flex justify-between">
              <kbd className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">{keys}</kbd>
              <span className="text-gray-600">{description}</span>
            </div>
          ))}
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="mt-6 w-full py-2 bg-gray-100 rounded hover:bg-gray-200"
        >
          Close
        </button>
      </div>
    </div>
  );
}
```

---

## 19. Connection Quality Indicator

```tsx
// hooks/useConnectionQuality.ts
import { useEffect, useState } from 'react';

interface ConnectionStats {
  quality: 'excellent' | 'good' | 'poor' | 'disconnected';
  bitrate: number;
  packetLoss: number;
  latency: number;
}

export function useConnectionQuality(peerConnection: RTCPeerConnection | null) {
  const [stats, setStats] = useState<ConnectionStats>({
    quality: 'excellent',
    bitrate: 0,
    packetLoss: 0,
    latency: 0,
  });

  useEffect(() => {
    if (!peerConnection) return;

    let prevBytesReceived = 0;
    let prevTimestamp = 0;

    const interval = setInterval(async () => {
      const report = await peerConnection.getStats();

      let packetsLost = 0;
      let packetsReceived = 0;
      let bytesReceived = 0;
      let roundTripTime = 0;

      report.forEach((stat) => {
        if (stat.type === 'inbound-rtp' && stat.kind === 'video') {
          packetsLost = stat.packetsLost || 0;
          packetsReceived = stat.packetsReceived || 0;
          bytesReceived = stat.bytesReceived || 0;
        }
        if (stat.type === 'candidate-pair' && stat.state === 'succeeded') {
          roundTripTime = stat.currentRoundTripTime || 0;
        }
      });

      // Calculate bitrate
      const now = Date.now();
      const bitrate = prevTimestamp
        ? ((bytesReceived - prevBytesReceived) * 8) / ((now - prevTimestamp) / 1000) / 1000
        : 0;
      prevBytesReceived = bytesReceived;
      prevTimestamp = now;

      // Calculate packet loss percentage
      const totalPackets = packetsReceived + packetsLost;
      const packetLoss = totalPackets > 0 ? (packetsLost / totalPackets) * 100 : 0;

      // Determine quality
      let quality: ConnectionStats['quality'] = 'excellent';
      if (packetLoss > 5 || roundTripTime > 0.3) {
        quality = 'poor';
      } else if (packetLoss > 2 || roundTripTime > 0.15) {
        quality = 'good';
      }

      if (peerConnection.connectionState === 'disconnected') {
        quality = 'disconnected';
      }

      setStats({
        quality,
        bitrate: Math.round(bitrate),
        packetLoss: Math.round(packetLoss * 10) / 10,
        latency: Math.round(roundTripTime * 1000),
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [peerConnection]);

  return stats;
}

// Connection quality badge
function ConnectionQualityBadge({ quality }: { quality: ConnectionStats['quality'] }) {
  const config = {
    excellent: { color: 'bg-green-500', bars: 4, label: 'Excellent' },
    good: { color: 'bg-yellow-500', bars: 3, label: 'Good' },
    poor: { color: 'bg-red-500', bars: 2, label: 'Poor' },
    disconnected: { color: 'bg-gray-500', bars: 0, label: 'Disconnected' },
  }[quality];

  return (
    <div className="flex items-center gap-1" title={config.label}>
      {[1, 2, 3, 4].map((bar) => (
        <div
          key={bar}
          className={cn(
            'w-1 rounded-full',
            bar <= config.bars ? config.color : 'bg-gray-300',
            bar === 1 && 'h-1',
            bar === 2 && 'h-2',
            bar === 3 && 'h-3',
            bar === 4 && 'h-4'
          )}
        />
      ))}
    </div>
  );
}
```

