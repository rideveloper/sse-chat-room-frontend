import { useState } from 'react';
import PropTypes from 'prop-types';

export function MessageInput({ onSend, disabled }) {
    const [message, setMessage] = useState('');

    const handleSend = () => {
        if (message.trim()) {
            onSend(message);
            setMessage('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="p-4 border-t flex gap-2">
            <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type a message..."
                disabled={disabled}
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                onClick={handleSend}
                disabled={disabled || !message.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
                Send
            </button>
        </div>
    );
}

MessageInput.propTypes = {
    onSend: PropTypes.func.isRequired,
    disabled: PropTypes.bool
};

MessageInput.defaultProps = {
    disabled: false
};