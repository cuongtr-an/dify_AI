
import React, { useState, useEffect, useRef } from "react";
// import axios from "axios"; // Không sử dụng axios, thay vào đó dùng fetch để gửi request
import { marked } from 'marked'; // Dùng thư viện 'marked' để chuyển Markdown thành HTML
import { FaPaperPlane } from "react-icons/fa";
import Prism from "prismjs";

const Chatbot = () => {
    const [messages, setMessages] = useState([]); // Lưu trữ các tin nhắn (user và bot)
    const [input, setInput] = useState(""); // Lưu trữ nội dung người dùng nhập vào
    const chatEndRef = useRef(null); // Dùng để tự động cuộn đến tin nhắn cuối
    const [isLoading, setIsLoading] = useState(false); // Trạng thái để kiểm soát khi bot đang trả lời
    const [option, setOption] = useState({
        'apikey': 'Bearer app-rvWHhd2tCD4LObid7TyQGK90',
    },);
    const [display, setDisplay] = useState('true')

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

    // Dùng useEffect để tự động cuộn xuống tin nhắn cuối cùng mỗi khi messages thay đổi
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Hàm gửi tin nhắn đến server (chatbot)
    const sendMessage = async () => {
        if (input.trim() === "") return; // Nếu không có input, không gửi gì

        setIsLoading(true); // Đánh dấu bắt đầu trạng thái loading

        const userMessage = { sender: "user", text: input }; // Tạo đối tượng tin nhắn của người dùng

        // Thêm tin nhắn người dùng vào trước khi gửi request

        setMessages((prev) => [...prev, userMessage]);

        try {
            // Gửi request đến API của chatbot
            const response = await fetch("https://api.dify.ai/v1/chat-messages", {
                method: "POST",
                headers: {

                    'Authorization': option.apikey, // Thay bằng API Key của bạn
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "inputs": {},
                    "query": input, // Truyền câu hỏi người dùng gửi vào
                    "response_mode": "streaming", // Cấu hình chế độ phản hồi streaming
                    "conversation_id": "", // Nếu có conversation_id, có thể thêm vào đây
                    "user": "test-react-app", // ID người dùng
                    "files": [
                        {
                            "type": "image",
                            "transfer_method": "remote_url",
                            "url": "https://cloud.dify.ai/logo/logo-site.png" // Thêm hình ảnh vào tin nhắn
                        }
                    ]
                })

            });

            setInput(""); // Sau khi gửi xong, làm rỗng input của người dùng


            const reader = response.body.getReader(); // Đọc phản hồi streaming từ API
            const decoder = new TextDecoder(); // Dùng để giải mã chuỗi bytes thành string
            let accumulatedText = ""; // Biến này lưu trữ văn bản trả lời từ chatbot

            // Thêm botMessage rỗng vào danh sách tin nhắn, sau đó cập nhật nó sau khi nhận được câu trả lời từ API
            let botMessageIndex;
            setMessages((prev) => {
                const newBotMessage = { sender: "bot", text: "" };
                botMessageIndex = prev.length; // Lưu chỉ mục của tin nhắn bot
                return [...prev, newBotMessage];
            });

            // Đọc từng chunk dữ liệu từ phản hồi streaming

            while (true) {
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

    // Hàm để xử lý khi người dùng chọn một tùy chọn
    const handleOptionSelect = (option) => {
        // setShowOptions(false); // Ẩn các tùy chọn khi người dùng chọn
        setOption(option); // Đặt lựa chọn người dùng vào input
        console.log(option)
        setDisplay("none")
    };

    const options = [
        {
            'name': 'Luật đất đai',
            'apikey': 'Bearer app-VpoH2NIiDdqni8nBtxAdN2vI',
        }
        , {
            'name': 'Luật giao thông',
            'apikey': 'Bearer app-L9BFBUekUi4iNqSMMINlYvv8',
        }
    ]

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
                        onClick={() => handleOptionSelect(option)}>
                        {option.name}
                    </button>
                ))}
                <button
                    onClick={() =>
                        setDisplay("none")
                    }>
                    <span className="material-icons icon-close-option">close</span>
                </button>
            </div>

            <div className="input-container">
                {isLoading ? (
                    <div className="loading-indicator">Loading ...</div> // Hiển thị trạng thái loading khi bot đang trả lời
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
                                // let option = doccument.get
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
