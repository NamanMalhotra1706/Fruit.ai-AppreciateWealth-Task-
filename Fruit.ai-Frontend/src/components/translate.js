import React, { useState, useEffect, useRef } from 'react';
import '../componentCss/translate.css'; // Custom CSS for styling

const Translate = () => {
  const [messages, setMessages] = useState([]); // Store all messages
  const [inputMessage, setInputMessage] = useState(''); // Store the input message
  const messagesEndRef = useRef(null); // To auto-scroll to the bottom

  // Function to handle sending a new message
  const handleSend = () => {
    if (inputMessage.trim() !== '') {
      setMessages([inputMessage, ...messages]); // Add the new message to the top
      setInputMessage(''); // Clear the input box after sending
    }
  };

  // Scroll to the bottom of the messages whenever a new message is added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Ensure the Google Translate script is only added once
  useEffect(() => {
    const addGoogleTranslateScript = () => {
      // Check if script is already added
      if (!document.getElementById('google-translate-script')) {
        const script = document.createElement('script');
        script.id = 'google-translate-script';
        script.type = 'text/javascript';
        script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.body.appendChild(script);
        
        // Initialize translate when script loads
        window.googleTranslateElementInit = () => {
          new window.google.translate.TranslateElement(
            { pageLanguage: 'en' }, 
            'google_translate_element'
          );
        };
      }
    };

    addGoogleTranslateScript();
  }, []);

  return (
    <div className="chat-container">
      {/* Google Translate Widget */}
      <div id="google_translate_element"></div>

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