import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';

export function MessageList({ messages, currentUser }) {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
                <div
                    key={idx}
                    className={`p-3 rounded-lg max-w-[80%] ${
                        msg.type === 'JOIN' || msg.type === 'LEAVE'
                            ? "bg-gray-100 text-gray-600 text-sm mx-auto"
                            : msg.sender === currentUser
                                ? "bg-blue-500 text-white ml-auto"
                                : "bg-gray-200 text-gray-900"
                    }`}
                >
                    {msg.type === 'CHAT' && (
                        <div className="font-medium text-sm mb-1">
                            {msg.sender}
                        </div>
                    )}
                    <div>{msg.content}</div>
                    <div className="text-xs opacity-70 mt-1">
                        {format(new Date(msg.timestamp), 'HH:mm')}
                    </div>
                </div>
            ))}
            <div ref={bottomRef} />
        </div>
    );
}

MessageList.propTypes = {
    messages: PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.oneOf(['CHAT', 'JOIN', 'LEAVE']).isRequired,
            content: PropTypes.string.isRequired,
            sender: PropTypes.string.isRequired,
            timestamp: PropTypes.string.isRequired
        })
    ).isRequired,
    currentUser: PropTypes.string.isRequired
};

// You can also add default props if needed
MessageList.defaultProps = {
    messages: []
};