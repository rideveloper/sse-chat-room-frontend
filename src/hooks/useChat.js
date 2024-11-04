import { useState, useEffect, useCallback, useRef } from 'react';

const INITIAL_STATE = {
    messages: [],
    users: [],
    username: '',
    room: 'general',
    isConnected: false,
    error: null
};

export function useChat() {
    const [state, setState] = useState(INITIAL_STATE);
    const eventSourceRef = useRef(null);

    const connect = useCallback(async (username, room = 'general') => {
        try {
            // Join the chat
            const response = await fetch('/api/chat/join', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, room })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to join chat');
            }

            const data = await response.json();

            // Setup SSE connection
            eventSourceRef.current = new EventSource(
                `/api/chat/stream?username=${data.username}&room=${data.room}`
            );

            eventSourceRef.current.onmessage = (event) => {
                const message = JSON.parse(event.data);
                setState(prev => ({
                    ...prev,
                    messages: [...prev.messages, message],
                    users: message.type === 'JOIN'
                        ? [...prev.users, message.sender]
                        : message.type === 'LEAVE'
                            ? prev.users.filter(u => u !== message.sender)
                            : prev.users
                }));
            };

            eventSourceRef.current.onerror = () => {
                setState(prev => ({
                    ...prev,
                    error: 'Connection lost. Please refresh.',
                    isConnected: false
                }));
                eventSourceRef.current?.close();
            };

            setState(prev => ({
                ...prev,
                username: data.username,
                room: data.room,
                isConnected: true,
                error: null
            }));

        } catch (error) {
            setState(prev => ({
                ...prev,
                error: error.message || 'Failed to connect',
                isConnected: false
            }));
        }
    }, []);

    const disconnect = useCallback(async () => {
        if (state.username && state.room) {
            try {
                await fetch('/api/chat/leave', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: state.username,
                        room: state.room
                    })
                });
            } catch (error) {
                console.error('Error leaving chat:', error);
            }
        }

        if (eventSourceRef.current) {
            eventSourceRef.current.close();
        }

        setState(INITIAL_STATE);
    }, [state.username, state.room]);

    const sendMessage = useCallback(async (content) => {
        if (!content.trim() || !state.isConnected) return;

        try {
            await fetch('/api/chat/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content,
                    sender: state.username,
                    room: state.room,
                    type: 'CHAT'
                })
            });
        } catch (error) {
            console.error('Error sending message:', error);
            setState(prev => ({
                ...prev,
                error: 'Failed to send message'
            }));
        }
    }, [state.username, state.room, state.isConnected]);

    useEffect(() => {
        return () => {
            disconnect();
        };
    }, [disconnect]);

    return {
        ...state,
        connect,
        disconnect,
        sendMessage
    };
}