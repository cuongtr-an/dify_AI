import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaPaperPlane } from "react-icons/fa";

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        if (input.trim() === "") return;

        const userMessage = { sender: "user", text: input };
        setMessages((prev) => [...prev, userMessage]);

        try {
            const response = await axios.post(
                "https://api.dify.ai/v1/chat-messages",
                {
                    "inputs": {},
                    "query": input,
                    "response_mode": "streaming",
                    "conversation_id": "",
                    "user": "abc-123",
                    "files": [
                        {
                            "type": "image",
                            "transfer_method": "remote_url",
                            "url": "https://cloud.dify.ai/logo/logo-site.png"
                        }
                    ]
                },
                {
                    headers: {
                        'Authorization': "Bearer app-VpoH2NIiDdqni8nBtxAdN2vI",
                        'Content-Type': 'application/json',
                    },
                }
            );

            const botMessage = { sender: "bot", text: response.data.reply };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Error:", error);
            const errorMessage = { sender: "bot", text: "Xin lỗi, có lỗi xảy ra!" };
            setMessages((prev) => [...prev, errorMessage]);
        }

        setInput("");
    };

    return (
        <div className="chat-container">
            <div className="chat-box">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                        {msg.text}
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>
            <div className="input-container">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Nhập tin nhắn..."
                />
                <button onClick={sendMessage}>
                    <FaPaperPlane />
                </button>
            </div>
        </div>
    );
};

export default Chatbot;
