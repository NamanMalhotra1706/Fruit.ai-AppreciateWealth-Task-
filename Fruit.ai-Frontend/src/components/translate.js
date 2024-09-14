import React, { useState, useEffect, useRef } from 'react';
import '../componentCss/translate.css'; // Custom CSS for styling

const Translate = () => {
  const [messages, setMessages] = useState([]);  // Store all messages
  const [inputMessage, setInputMessage] = useState('');  // Store the input message
  const messagesEndRef = useRef(null);  // To auto-scroll to the bottom

  // Function to handle sending a new message
  const handleSend = () => {
    if (inputMessage.trim() !== '') {
      setMessages([...messages, inputMessage]);  // Add the new message to the array
      setInputMessage('');  // Clear the input box after sending
    }
  };

  // Scroll to the bottom of the messages whenever a new message is added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="chat-container">
      {/* Message List */}
      <div className="messages-container">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div key={index} className="message">
              {msg}
            </div>
          ))
        ) : (
          <p>No messages yet.</p>
        )}
        {/* Empty div to ensure scrolling to the bottom */}
        <div ref={messagesEndRef}></div>
      </div>
      {/* Google Translate Widget */}
      <div id="google_translate_element"></div>
      
      {/* Input Field and Send Button */}
      <div className="input-container">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message"
          className="input-box"
        />
        <button onClick={handleSend} className="send-btn">Send</button>
      </div>

    </div>
  );
};

export default Translate;
