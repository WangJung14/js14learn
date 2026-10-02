'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { GroupMessage } from '@/types';
import { chatApi, getStoredTokens } from '@/lib/api';

export type ConnectionStatus =
  | 'CONNECTED'
  | 'CONNECTING'
  | 'RECONNECTING'
  | 'DISCONNECTED';

interface UseGroupChatOptions {
  groupId: string;
  autoMarkAsRead?: boolean;
}

export function useGroupChat({
  groupId,
  autoMarkAsRead = true,
}: UseGroupChatOptions) {
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>('CONNECTING');
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // 1. Initial message load via REST API
  const loadInitialMessages = useCallback(async () => {
    if (!groupId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await chatApi.getMessages(groupId, 50);
      setMessages(data.messages);
      setHasMore(data.hasMore);
      setNextCursor(data.nextCursor || null);

      if (autoMarkAsRead) {
        await chatApi.markAsRead(groupId).catch(() => {});
        setUnreadCount(0);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [groupId, autoMarkAsRead]);

  // 2. Load older messages (pagination upward)
  const loadOlderMessages = useCallback(async () => {
    if (!groupId || !nextCursor || loadingOlder || !hasMore) return;
    setLoadingOlder(true);
    try {
      const data = await chatApi.getMessages(groupId, 50, nextCursor);
      setMessages((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        const newUnique = data.messages.filter((m) => !existingIds.has(m.id));
        return [...newUnique, ...prev];
      });
      setHasMore(data.hasMore);
      setNextCursor(data.nextCursor || null);
    } catch (err: any) {
      setError(err.message || 'Failed to load older messages');
    } finally {
      setLoadingOlder(false);
    }
  }, [groupId, nextCursor, loadingOlder, hasMore]);

  // 3. Socket.IO Connection & Event Handlers
  useEffect(() => {
    if (!groupId) return;

    loadInitialMessages();

    const { accessToken } = getStoredTokens();
    if (!accessToken) {
      setConnectionStatus('DISCONNECTED');
      return;
    }

    const backendUrl =
      process.env.NEXT_PUBLIC_WS_URL ||
      process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ||
      'http://localhost:3001';

    const socket = io(backendUrl, {
      auth: { token: accessToken },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1500,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setConnectionStatus('CONNECTED');
      socket.emit('group:join', { groupId });
    });

    socket.on('reconnect', () => {
      setConnectionStatus('CONNECTED');
      socket.emit('group:join', { groupId });
    });

    socket.on('reconnecting', () => {
      setConnectionStatus('RECONNECTING');
    });

    socket.on('disconnect', () => {
      setConnectionStatus('DISCONNECTED');
    });

    socket.on('connect_error', () => {
      setConnectionStatus('DISCONNECTED');
    });

    socket.on('message:new', (newMsg: GroupMessage) => {
      if (newMsg.groupId !== groupId) return;

      setMessages((prev) => {
        // Deduplicate by ID or clientMessageId
        const exists = prev.some(
          (m) =>
            m.id === newMsg.id ||
            (newMsg.clientMessageId &&
              m.clientMessageId === newMsg.clientMessageId),
        );
        if (exists) {
          return prev.map((m) =>
            m.id === newMsg.id ||
            (newMsg.clientMessageId &&
              m.clientMessageId === newMsg.clientMessageId)
              ? newMsg
              : m,
          );
        }
        return [...prev, newMsg];
      });

      if (autoMarkAsRead) {
        socket.emit('message:read', { groupId });
        setUnreadCount(0);
      } else {
        setUnreadCount((c) => c + 1);
      }
    });

    socket.on('chat:error', (err: { message: string; code?: string }) => {
      setError(err.message);
    });

    return () => {
      socket.emit('group:leave', { groupId });
      socket.disconnect();
      socketRef.current = null;
    };
  }, [groupId, loadInitialMessages, autoMarkAsRead]);

  // 4. Send message handler (socket first, REST fallback)
  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || !groupId) return;

      const clientMessageId = 'client_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

      const socket = socketRef.current;
      if (socket && socket.connected) {
        socket.emit('message:send', {
          groupId,
          content: trimmed,
          clientMessageId,
        });
      } else {
        // Fallback to REST API
        try {
          const sent = await chatApi.sendMessage(
            groupId,
            trimmed,
            clientMessageId,
          );
          setMessages((prev) => {
            if (prev.some((m) => m.id === sent.id)) return prev;
            return [...prev, sent];
          });
        } catch (err: any) {
          setError(err.message || 'Failed to send message');
          throw err;
        }
      }
    },
    [groupId],
  );

  const markAsRead = useCallback(async () => {
    if (!groupId) return;
    try {
      await chatApi.markAsRead(groupId);
      if (socketRef.current?.connected) {
        socketRef.current.emit('message:read', { groupId });
      }
      setUnreadCount(0);
    } catch {
      // silent catch
    }
  }, [groupId]);

  return {
    messages,
    loading,
    loadingOlder,
    hasMore,
    connectionStatus,
    error,
    unreadCount,
    sendMessage,
    loadOlderMessages,
    markAsRead,
    messagesEndRef,
  };
}
