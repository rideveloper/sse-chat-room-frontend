import { useState } from 'react';
import { useChat } from '../hooks/useChat';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { UserList } from './UserList';

export function ChatRoom() {
    const [inputUsername, setInputUsername] = useState('');
    const {
        messages,
        users,
        username,
        room,
        isConnected,
        error,
        connect,
        sendMessage
    } = useChat();

    const handleJoin = () => {
        if (inputUsername.trim()) {
            connect(inputUsername.trim());
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden h-[600px]">
            <div className="bg-gray-100 px-4 py-3 border-b">
                <h1 className="text-lg font-medium">Chat Room: {room}</h1>
            </div>

            <div className="flex h-[calc(100%-4rem)]">
                {!isConnected ? (
                    <div className="p-4 w-full">
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        )}
                        <div className="space-y-4">
                            <input
                                placeholder="Choose your username"
                                value={inputUsername}
                                onChange={(e) => setInputUsername(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={handleJoin}
                                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                                disabled={!inputUsername.trim()}
                            >
                                Join Chat
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 flex flex-col min-w-0">
                            <MessageList
                                messages={messages}
                                currentUser={username}
                            />
                            <MessageInput
                                onSend={sendMessage}
                                disabled={!isConnected}
                            />
                        </div>
                        <UserList
                            users={users}
                            currentUser={username}
                        />
                    </>
                )}
            </div>
        </div>
    );
}