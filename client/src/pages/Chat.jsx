import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Send, Image, Mic } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Chat = ({ user }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { id: 1, sender: 'vendor', text: 'Hello! How can I help you with your booking?' },
    { id: 2, sender: 'customer', text: 'Hi, I wanted to know if catering is included?' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Connect to Socket.io server
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    // Join a dummy room for now
    newSocket.emit('join_room', 'room123');

    newSocket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => newSocket.close();
  }, [user, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      id: Date.now(),
      roomId: 'room123',
      sender: user.role, // 'customer' or 'vendor'
      text: newMessage
    };

    if (socket) {
      socket.emit('send_message', messageData);
    } else {
      // Fallback if socket fails
      setMessages(prev => [...prev, messageData]);
    }
    
    setNewMessage('');
  };

  if (!user) return null;

  return (
    <div style={{ padding: '1rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1rem', paddingLeft: '1rem' }}>Messages</h2>
      <div className="glass-panel chat-container">
        <div className="chat-messages">
          {messages.map((msg) => {
            // Determine if message is sent by current user or received
            // In a real app, we'd compare msg.senderId === user.id
            const isSentByMe = msg.sender === user.role;
            
            return (
              <div 
                key={msg.id} 
                className={`message-bubble ${isSentByMe ? 'sent' : 'received'}`}
              >
                {msg.text}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <form className="chat-input-area" onSubmit={sendMessage}>
          <button type="button" className="nav-item" style={{ color: 'var(--text-muted)' }}>
            <Image size={24} />
          </button>
          <button type="button" className="nav-item" style={{ color: 'var(--text-muted)' }}>
            <Mic size={24} />
          </button>
          <input
            type="text"
            className="glass-input"
            style={{ border: 'none', background: 'transparent' }}
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button type="submit" className="glass-button primary" style={{ borderRadius: '50%', padding: '0.75rem' }}>
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
