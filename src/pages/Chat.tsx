import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

const Chat: React.FC = () => {
  const { id } = useParams();
  const [newMessage, setNewMessage] = useState('');

  // TODO: Replace with actual chat data
  const messages: Message[] = [
    {
      id: '1',
      senderId: 'user1',
      text: "Hello! I'm interested in your service.",
      timestamp: '2024-02-26T10:00:00',
    },
    {
      id: '2',
      senderId: 'user2',
      text: 'Hi! Thank you for your interest. How can I help you?',
      timestamp: '2024-02-26T10:05:00',
    },
  ];

  const currentUserId = 'user1'; // TODO: Replace with actual user ID

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      // TODO: Implement message sending logic
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md h-[600px] flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">Chat</h2>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.senderId === currentUserId ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.senderId === currentUserId
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.senderId === currentUserId
                        ? 'text-blue-100'
                        : 'text-gray-500'
                    }`}
                  >
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t">
            <div className="flex space-x-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
