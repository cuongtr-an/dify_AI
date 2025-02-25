
import React, { useState, useEffect, useRef } from "react";
// import axios from "axios"; // Không sử dụng axios, thay vào đó dùng fetch để gửi request
import { marked } from 'marked'; // Dùng thư viện 'marked' để chuyển Markdown thành HTML
import AppConstants from "../utils/Constants.js";
import { FaPaperPlane } from "react-icons/fa";
import Prism from "prismjs";

const Chatbot = () => {
    const [messages, setMessages] = useState([]); // Lưu trữ các tin nhắn (user và bot)
    const [input, setInput] = useState(""); // Lưu trữ nội dung người dùng nhập vào
    const chatEndRef = useRef(null); // Dùng để tự động cuộn đến tin nhắn cuối
    const [isLoading, setIsLoading] = useState(false); // Trạng thái để kiểm soát khi bot đang trả lời
    const [option, setOption] = useState({
        'apikey': AppConstants.API_MODEL_BASE,
    },);
    const [display, setDisplay] = useState('true')

    const parseMarkdown = (text) => {
        const html = marked(text, {
            highlight: function (code, lang) {
                if (Prism.languages[lang]) {
                    return Prism.highlight(code, Prism.languages[lang], lang);
                } else {
                    return code;
                }
            }
        });
        return html;
    };

    // Dùng useEffect để tự động cuộn xuống tin nhắn cuối cùng mỗi khi messages thay đổi
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // const sendMessage = async () => {
    //     if (input.trim() === "") return; // Nếu không có input, không gửi gì

    //     setIsLoading(true); // Đánh dấu bắt đầu trạng thái loading

    //     const userMessage = { sender: "user", text: input }; // Tạo đối tượng tin nhắn của người dùng

    //     // Thêm tin nhắn người dùng vào trước khi gửi request

    //     setMessages((prev) => [...prev, userMessage]);

    //     try {
    //         // Gửi request đến API của chatbot
    //         const response = await fetch(`${AppConstants.BASE_URL}/chat-messages`, {
    //             method: "POST",
    //             headers: {

    //                 'Authorization': option.apikey, // Thay bằng API Key của bạn
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 "inputs": {},
    //                 "query": input, // Truyền câu hỏi người dùng gửi vào
    //                 "response_mode": "streaming", // Cấu hình chế độ phản hồi streaming
    //                 "conversation_id": "", // Nếu có conversation_id, có thể thêm vào đây
    //                 "user": "test-react-app", // ID người dùng
    //             })
    //         });

    //         setInput(""); // Sau khi gửi xong, làm rỗng input của người dùng


    //         const reader = response.body.getReader(); // Đọc phản hồi streaming từ API
    //         const decoder = new TextDecoder(); // Dùng để giải mã chuỗi bytes thành string
    //         let accumulatedText = ""; // Biến này lưu trữ văn bản trả lời từ chatbot

    //         let botMessageIndex;
    //         setMessages((prev) => {
    //             const newBotMessage = { sender: "bot", text: "" };
    //             botMessageIndex = prev.length; // Lưu chỉ mục của tin nhắn bot
    //             return [...prev, newBotMessage];
    //         });

    //         while (true) {
    //             const { done, value } = await reader.read(); // Đọc từng chunk
    //             if (done) break; // Nếu hết dữ liệu, thoát khỏi vòng lặp

    //             const chunk = decoder.decode(value);
    //             const lines = chunk.split("\n").filter((line) => line.trim() !== "");

    //             lines.forEach((line) => {
    //                 if (line.startsWith("data: ")) {
    //                     const jsonString = line.replace("data: ", "");

    //                     try {
    //                         const jsonData = JSON.parse(jsonString); // Chuyển chuỗi JSON thành đối tượng
    //                         if (jsonData.answer) {
    //                             accumulatedText += jsonData.answer;


    //                             setMessages((prev) => {
    //                                 const updatedMessages = [...prev];
    //                                 updatedMessages[botMessageIndex] = {
    //                                     ...updatedMessages[botMessageIndex],
    //                                     text: accumulatedText // Cập nhật text của bot
    //                                 };
    //                                 return updatedMessages;
    //                             });
    //                         }
    //                     } catch (error) {
    //                         console.error("Lỗi khi parse JSON: ", error); // Nếu có lỗi khi parse JSON
    //                     }
    //                 }
    //             });
    //         }
    //     } catch (error) {
    //         console.error("Error:", error); // Xử lý lỗi nếu có
    //         const errorMessage = { sender: "bot", text: "Xin lỗi, có lỗi xảy ra!" }; // Tin nhắn lỗi từ bot
    //         setMessages((prev) => [...prev, errorMessage]); // Thêm tin nhắn lỗi vào
    //     }

    //     setIsLoading(false); // Kết thúc trạng thái loading

    // };

    const sendMessage = async (text_, apikey_) => {
        const key = apikey_ == null ? option.apikey : apikey_;

        if (input.trim() === "" && text_ == null) return; // Nếu không có input, không gửi gì

        const text = input.trim() === "" ? text_ : input.trim()

        setIsLoading(true); // Đánh dấu bắt đầu trạng thái loading

        const userMessage = { sender: "user", text: text }; // Tạo đối tượng tin nhắn của người dùng

        // Thêm tin nhắn người dùng vào trước khi gửi request
        setMessages((prev) => [...prev, userMessage]);

        try {
            // Gửi request đến API của chatbot
            const response = await fetch(`${AppConstants.BASE_URL}/chat-messages`, {
                method: "POST",
                headers: {
                    'Authorization': key, // Thay bằng API Key của bạn
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "inputs": {},
                    "query": text, // Truyền câu hỏi người dùng gửi vào
                    "response_mode": "streaming", // Cấu hình chế độ phản hồi streaming
                    "conversation_id": "", // Nếu có conversation_id, có thể thêm vào đây
                    "user": "test-react-app", // ID người dùng
                })
            });

            setInput(""); // Sau khi gửi xong, làm rỗng input của người dùng

            const reader = response.body.getReader(); // Đọc phản hồi streaming từ API
            const decoder = new TextDecoder(); // Dùng để giải mã chuỗi bytes thành string
            let accumulatedText = ""; // Biến này lưu trữ văn bản trả lời từ chatbot

            let botMessageIndex;
            setMessages((prev) => {
                const newBotMessage = { sender: "bot", text: "" };
                botMessageIndex = prev.length; // Lưu chỉ mục của tin nhắn bot
                return [...prev, newBotMessage];
            });

            while (text !== "" || text != null) {
                const { done, value } = await reader.read(); // Đọc từng chunk
                if (done) break; // Nếu hết dữ liệu, thoát khỏi vòng lặp

                const chunk = decoder.decode(value);
                const lines = chunk.split("\n").filter((line) => line.trim() !== "");

                lines.forEach((line) => {
                    if (line.startsWith("data: ")) {
                        const jsonString = line.replace("data: ", "");

                        try {
                            const jsonData = JSON.parse(jsonString); // Chuyển chuỗi JSON thành đối tượng
                            if (jsonData.answer) {
                                accumulatedText += jsonData.answer;

                                setMessages((prev) => {
                                    const updatedMessages = [...prev];
                                    updatedMessages[botMessageIndex] = {
                                        ...updatedMessages[botMessageIndex],
                                        text: accumulatedText // Cập nhật text của bot
                                    };
                                    return updatedMessages;
                                });
                            }
                        } catch (error) {
                            console.error("Lỗi khi parse JSON: ", error); // Nếu có lỗi khi parse JSON
                        }
                    }
                });
            }
        } catch (error) {
            console.error("Error:", error); // Xử lý lỗi nếu có
            const errorMessage = { sender: "bot", text: "Xin lỗi, có lỗi xảy ra!" }; // Tin nhắn lỗi từ bot
            setMessages((prev) => [...prev, errorMessage]); // Thêm tin nhắn lỗi vào
        }

        setIsLoading(false); // Kết thúc trạng thái loading
    };

    const handleOptionSelect = (option) => {
        setOption(option);
        setDisplay("none")
    };

    const options = AppConstants.API_MODEL_OPTIONS;

    return (
        <div className="chat-container">
            <div className="chat-box">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                        <div
                            className="markdown-container"
                            dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.text) }}
                        />
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>
            <div className="options" id="option-list" style={{ display: display }}>
                {options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            handleOptionSelect(option)
                            sendMessage(`Hãy cho tôi biết về ${option.name}`, option.apikey)
                        }}>
                        {option.name}
                    </button>
                ))}
            </div>
            <div className="input-container">
                {isLoading ? (
                    <div className="loading-indicator">
                        <span>
                            Loading ...
                        </span>
                    </div>
                ) : (
                    <>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => {
                                e.key === "Enter" && !e.shiftKey && sendMessage()
                                if (e.key === "Enter" && !e.shiftKey) {
                                    document.getElementById('option-list').style.display = "none";
                                }
                            }}
                            placeholder="Nhập tin nhắn..."
                            style={{
                                resize: "none",
                                overflowY: "hidden",
                                height: "43px",
                                maxHeight: "120px",
                            }}
                            onInput={(e) => {
                                e.target.style.height = "43px";
                                const newHeight = e.target.scrollHeight;
                                const maxHeight = 120;
                                e.target.style.height = `${Math.min(newHeight, maxHeight)}px`;

                                if (newHeight >= 43 && newHeight < 120) {
                                    e.target.style.overflowY = "hidden";
                                } else {
                                    e.target.style.overflowY = "auto";
                                }
                            }}
                        ></textarea>
                        <button onClick={sendMessage}>
                            <FaPaperPlane />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Chatbot;