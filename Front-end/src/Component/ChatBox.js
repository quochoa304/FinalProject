import React, { useState } from 'react';
import axios from 'axios';
import '../assets/css/chatBot.css';
const token = localStorage.getItem('Authorization');

function ChatBox() {
    const [inputText, setInputText] = useState('');
    const [responseText, setResponseText] = useState('');
    const [showChatBox, setShowChatBox] = useState(false);
    const [messages, setMessages] = useState([]);

    const handleInputChange = (e) => {
        setInputText(e.target.value);
    };

    const handleChatSubmit = async () => {
        try {
            const response = await axios.get('/bot/chat', {
                headers: {
                    'Authorization': token
                },
                params: {
                    prompt: inputText
                }
            });
            const newMessages = [...messages, { text: inputText, sender: 'user' }, { text: response.data, sender: 'bot' }];
            setMessages(newMessages);
            setInputText('');
        } catch (error) {
            console.error('Error fetching response: ', error);
        }
    };

    const toggleChatBox = () => {
        setShowChatBox(!showChatBox);
    };

    return (
        <div className="chat-container">
            {showChatBox && (
                <div className="chat-box">
                    <div className="chat-header">
                        <span className="chat-title" style={{fontWeight:"bold"}}>GW Fitness - GPT</span>
                        <span className="close-btn" onClick={toggleChatBox}>X</span>
                    </div>
                    <div className="chat-body">
                        {messages.map((message, index) => (
                            <div key={index} className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}>
                                {message.text}
                            </div>
                        ))}
                    </div>
                    <div className="chat-footer">
                        <input type="text" value={inputText} onChange={handleInputChange} placeholder="Type a message" />
                        <button onClick={handleChatSubmit}>Send</button>
                    </div>
                </div>
            )}
            {!showChatBox && (
                <div className="chat-btn" onClick={toggleChatBox}>Chat</div>
            )}
        </div>
    );
}

export default ChatBox;
