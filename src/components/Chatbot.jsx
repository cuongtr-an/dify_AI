// import React, { useState, useEffect, useRef } from "react";
// //import axios from "axios";
// import { marked } from 'marked';
// import { FaPaperPlane } from "react-icons/fa";

// const Chatbot = () => {
//     const [messages, setMessages] = useState([]);
//     const [input, setInput] = useState("");
//     const chatEndRef = useRef(null);
//     const [isLoading, setIsLoading] = useState(false); // Trạng thái loading
//     const parseMarkdown = (text) => {
//         // Chuyển đổi Markdown thành HTML
//         return marked(text);
//     };

//     useEffect(() => {
//         chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, [messages]);

//     const sendMessage = async () => {
//         if (input.trim() === "") return;

//         setIsLoading(true); // Bắt đầu loading

//         const userMessage = { sender: "user", text: input };

//         // Thêm tin nhắn người dùng trước khi gửi request
//         setMessages((prev) => [...prev, userMessage]);

//         try {
//             const response = await fetch("https://api.dify.ai/v1/chat-messages", {
//                 method: "POST",
//                 headers: {
//                     'Authorization': "Bearer app-L9BFBUekUi4iNqSMMINlYvv8", // Thay bằng API Key của bạn
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     "inputs": {},
//                     "query": input,
//                     "response_mode": "streaming",
//                     "conversation_id": "",
//                     "user": "test-react-app",
//                     "files": [
//                         {
//                             "type": "image",
//                             "transfer_method": "remote_url",
//                             "url": "https://cloud.dify.ai/logo/logo-site.png"
//                         }
//                     ]
//                 })
//             });

//             setInput("");

//             const reader = response.body.getReader();
//             const decoder = new TextDecoder();
//             let accumulatedText = ""; // Lưu trữ câu trả lời đã ghép

//             // Thêm botMessage rỗng để cập nhật theo thời gian thực
//             let botMessageIndex;
//             setMessages((prev) => {
//                 const newBotMessage = { sender: "bot", text: "" };
//                 botMessageIndex = prev.length; // Lưu vị trí của botMessage
//                 return [...prev, newBotMessage];
//             });

//             // Đọc từng chunk của response stream
//             while (true) {
//                 const { done, value } = await reader.read();
//                 if (done) break;

//                 // Giải mã chunk thành chuỗi văn bản
//                 const chunk = decoder.decode(value);

//                 // Tách từng dòng dữ liệu
//                 const lines = chunk.split("\n").filter(line => line.trim() !== "");

//                 // Xử lý từng dòng dữ liệu
//                 lines.forEach(line => {
//                     if (line.startsWith("data: ")) {
//                         const jsonString = line.replace("data: ", "");
//                         try {
//                             const jsonData = JSON.parse(jsonString);
//                             if (jsonData.answer) {
//                                 accumulatedText += jsonData.answer; // Ghép nối đoạn `answer`

//                                 // const cleanedText = accumulatedText.replace(/\n\s*\n/g, '\n');
//                                 // Cập nhật câu trả lời trên giao diện
//                                 setMessages((prev) => {
//                                     const updatedMessages = [...prev];
//                                     updatedMessages[botMessageIndex] = {
//                                         ...updatedMessages[botMessageIndex],
//                                         text: accumulatedText
//                                     };
//                                     return updatedMessages;
//                                 });
//                             }
//                         } catch (error) {
//                             console.error("Lỗi khi parse JSON: ", error);
//                         }
//                     }
//                 });
//             }
//         } catch (error) {
//             console.error("Error:", error);
//             const errorMessage = { sender: "bot", text: "Xin lỗi, có lỗi xảy ra!" };
//             setMessages((prev) => [...prev, errorMessage]);
//         }
//         setIsLoading(false); // Kết thúc loading
//     };

//     return (
//         <div className="chat-container">
//             <div className="chat-box">
//                 {messages.map((msg, index) => (
//                     <div key={index} className={`message ${msg.sender}`}
//                         dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.text) }} />
//                 ))}
//                 <div ref={chatEndRef} />
//             </div>
//             <div className="input-container">
//                 {isLoading ? (
//                     <div className="loading-indicator">Loading ...</div>
//                 ) : (
//                     <>
//                         <textarea
//                             value={input}
//                             onChange={(e) => setInput(e.target.value)}
//                             onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
//                             placeholder="Nhập tin nhắn..."
//                             style={{ resize: "none", overflowY: "hidden", height: "40px", maxHeight: "120px" }}
//                             onInput={(e) => {
//                                 e.target.style.height = "40px"; // Chiều cao mặc định ban đầu
//                                 const newHeight = e.target.scrollHeight;
//                                 const maxHeight = 120; // Tương đương với chiều cao của 5 dòng
//                                 e.target.style.height = `${Math.min(newHeight, maxHeight)}px`;
                                
//                                 if (newHeight <= 40) {
//                                     e.target.style.overflowY = "hidden"; // Ẩn scroll khi chỉ có 1 dòng
//                                 } else {
//                                     e.target.style.overflowY = "auto";   // Cho phép scroll khi cao hơn 40px
//                                 }
//                             }}
//                         ></textarea>
//                         <button onClick={sendMessage}>
//                             <FaPaperPlane />
//                         </button>
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Chatbot;
import React, { useState, useEffect, useRef } from "react";
import { marked } from "marked";
import { FaPaperPlane } from "react-icons/fa";
import Prism from "prismjs";

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const chatEndRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);

    // Hàm chuyển đổi Markdown thành HTML và highlight code
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

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        if (input.trim() === "") return;

        setIsLoading(true); // Bắt đầu loading

        const userMessage = { sender: "user", text: input };
        setMessages((prev) => [...prev, userMessage]);

        try {
            const response = await fetch("https://api.dify.ai/v1/chat-messages", {
                method: "POST",
                headers: {
                    Authorization: "Bearer app-L9BFBUekUi4iNqSMMINlYvv8",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    inputs: {},
                    query: input,
                    response_mode: "streaming",
                    conversation_id: "",
                    user: "test-react-app",
                }),
            });

            setInput("");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedText = ""; 

            let botMessageIndex;
            setMessages((prev) => {
                const newBotMessage = { sender: "bot", text: "" };
                botMessageIndex = prev.length;
                return [...prev, newBotMessage];
            });

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split("\n").filter((line) => line.trim() !== "");

                lines.forEach((line) => {
                    if (line.startsWith("data: ")) {
                        const jsonString = line.replace("data: ", "");
                        try {
                            const jsonData = JSON.parse(jsonString);
                            if (jsonData.answer) {
                                accumulatedText += jsonData.answer;

                                setMessages((prev) => {
                                    const updatedMessages = [...prev];
                                    updatedMessages[botMessageIndex] = {
                                        ...updatedMessages[botMessageIndex],
                                        text: accumulatedText,
                                    };
                                    return updatedMessages;
                                });
                            }
                        } catch (error) {
                            console.error("Lỗi khi parse JSON: ", error);
                        }
                    }
                });
            }
        } catch (error) {
            console.error("Error:", error);
            const errorMessage = { sender: "bot", text: "Xin lỗi, có lỗi xảy ra!" };
            setMessages((prev) => [...prev, errorMessage]);
        }
        setIsLoading(false);
    };

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
            <div className="input-container">
                {isLoading ? (
                    <div className="loading-indicator">Loading ...</div>
                ) : (
                    <>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                            placeholder="Nhập tin nhắn..."
                            style={{
                                resize: "none",
                                overflowY: "hidden",
                                height: "40px",
                                maxHeight: "120px",
                            }}
                            onInput={(e) => {
                                e.target.style.height = "40px";
                                const newHeight = e.target.scrollHeight;
                                const maxHeight = 120;
                                e.target.style.height = `${Math.min(newHeight, maxHeight)}px`;

                                if (newHeight <= 40) {
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
