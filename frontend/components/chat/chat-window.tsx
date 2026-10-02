'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Wifi,
  WifiOff,
  RefreshCw,
  Clock,
  ChevronUp,
} from 'lucide-react';
import { GroupMessage, User } from '@/types';
import { ConnectionStatus } from '@/hooks/useGroupChat';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ChatWindowProps {
  groupId: string;
  currentUser: User | null;
  messages: GroupMessage[];
  loading: boolean;
  loadingOlder: boolean;
  hasMore: boolean;
  connectionStatus: ConnectionStatus;
  error: string | null;
  onSendMessage: (content: string) => Promise<void>;
  onLoadOlder: () => Promise<void>;
}

export function ChatWindow({
  currentUser,
  messages,
  loading,
  loadingOlder,
  hasMore,
  connectionStatus,
  error,
  onSendMessage,
  onLoadOlder,
}: ChatWindowProps) {
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const isNearBottomRef = useRef(true);

  // Check if user is near bottom
  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const threshold = 120;
    const isNearBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;
    isNearBottomRef.current = isNearBottom;
  };

  // Auto-scroll on new messages if near bottom
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    if (isNearBottomRef.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = inputText.trim();
    if (!text || sending) return;

    setSending(true);
    try {
      setInputText('');
      await onSendMessage(text);
      // Auto-scroll to bottom after sending
      const el = scrollContainerRef.current;
      if (el) {
        el.scrollTop = el.scrollHeight;
        isNearBottomRef.current = true;
      }
    } catch {
      // restore text on error
      setInputText(text);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTimestamp = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const getStatusBadge = () => {
    switch (connectionStatus) {
      case 'CONNECTED':
        return (
          <span className="flex items-center space-x-1.5 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-full font-mono">
            <Wifi className="w-3 h-3" />
            <span>Connected</span>
          </span>
        );
      case 'CONNECTING':
      case 'RECONNECTING':
        return (
          <span className="flex items-center space-x-1.5 text-xs text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2.5 py-1 rounded-full font-mono">
            <RefreshCw className="w-3 h-3 animate-spin" />
            <span>{connectionStatus === 'RECONNECTING' ? 'Reconnecting...' : 'Connecting...'}</span>
          </span>
        );
      case 'DISCONNECTED':
      default:
        return (
          <span className="flex items-center space-x-1.5 text-xs text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full font-mono">
            <WifiOff className="w-3 h-3" />
            <span>Offline</span>
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col h-[650px] max-h-[calc(100vh-14rem)] bg-slate-950/70 backdrop-blur-xl border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl">
      {/* Top Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800/80 bg-slate-900/60">
        <div className="flex items-center space-x-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
          <h2 className="text-sm font-bold text-slate-200 tracking-wide uppercase font-mono">
            Real-Time Group Chat
          </h2>
        </div>
        <div>{getStatusBadge()}</div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="px-4 py-2 bg-rose-500/10 border-b border-rose-500/30 text-rose-400 text-xs flex items-center justify-between">
          <span>{error}</span>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4"
      >
        {/* Load Older Messages Trigger */}
        {hasMore && (
          <div className="text-center pb-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onLoadOlder}
              isLoading={loadingOlder}
              className="text-xs text-indigo-400 border-slate-800 hover:bg-slate-900"
            >
              <ChevronUp className="w-3.5 h-3.5 mr-1" /> Load older messages
            </Button>
          </div>
        )}

        {loading && messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full space-y-3 text-slate-500 py-12">
            <RefreshCw className="w-6 h-6 animate-spin text-indigo-400" />
            <p className="text-xs">Loading chat history...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full space-y-3 text-slate-500 py-12 text-center">
            <Clock className="w-10 h-10 text-slate-700 stroke-[1.5]" />
            <p className="text-sm font-medium text-slate-400">No messages yet</p>
            <p className="text-xs text-slate-500 max-w-xs">
              Be the first to say hello and collaborate with your study group!
            </p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.userId === currentUser?.id;
            const senderName = msg.user?.name || (isMe ? 'You' : 'Member');
            const avatarUrl =
              msg.user?.avatarUrl ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(senderName)}`;

            return (
              <div
                key={msg.id || `temp-${index}`}
                className={cn(
                  'flex items-end gap-2.5 group transition-all',
                  isMe ? 'justify-end' : 'justify-start',
                )}
              >
                {!isMe && (
                  <img
                    src={avatarUrl}
                    alt={senderName}
                    className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 object-cover flex-shrink-0 mb-1"
                  />
                )}

                <div
                  className={cn(
                    'flex flex-col max-w-[85%] sm:max-w-[75%] space-y-1',
                    isMe ? 'items-end' : 'items-start',
                  )}
                >
                  {/* Sender Name for others */}
                  {!isMe && (
                    <span className="text-[11px] font-semibold text-slate-400 px-1 truncate max-w-xs">
                      {senderName}
                    </span>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={cn(
                      'px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words shadow-md',
                      isMe
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-br-none border border-indigo-400/30'
                        : 'bg-slate-900/90 text-slate-100 rounded-bl-none border border-slate-800/80',
                    )}
                  >
                    {msg.content}
                  </div>

                  {/* Timestamp */}
                  <span className="text-[10px] text-slate-500 px-1 font-mono">
                    {formatTimestamp(msg.createdAt)}
                  </span>
                </div>

                {isMe && (
                  <img
                    src={avatarUrl}
                    alt="You"
                    className="w-8 h-8 rounded-full bg-slate-800 border border-indigo-500/40 object-cover flex-shrink-0 mb-1"
                  />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Message Input Area */}
      <div className="p-3 sm:p-4 border-t border-slate-800/80 bg-slate-900/70">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <textarea
            id="chat-message-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
            rows={1}
            maxLength={5000}
            className="flex-1 resize-none bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all scrollbar-none"
          />

          <Button
            id="chat-send-btn"
            type="submit"
            disabled={!inputText.trim() || sending}
            isLoading={sending}
            variant="primary"
            className="h-10 px-4 rounded-xl flex-shrink-0 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
