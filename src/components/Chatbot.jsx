// import React, { useState, useEffect, useRef } from "react";
// import { marked } from "marked";
// import AppConstants from "../utils/Constants.js";
// import { FaPaperPlane } from "react-icons/fa";
// import Prism from "prismjs";

// const Chatbot = ({ apiKey }) => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const chatEndRef = useRef(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const parseMarkdown = (text) => {
//     const html = marked(text, {
//       highlight: (code, lang) => {
//         if (Prism.languages[lang]) {
//           return Prism.highlight(code, Prism.languages[lang], lang);
//         }
//         return code;
//       },
//     });
//     return html;
//   };

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const sendMessage = async (text_ = null) => {
//     const text = text_ || input.trim();
//     if (!text) return;

//     setIsLoading(true);
//     const userMessage = { sender: "user", text };
//     setMessages((prev) => [...prev, userMessage]);

//     try {
//       const response = await fetch(`${AppConstants.BASE_URL}/chat-messages`, {
//         method: "POST",
//         headers: {
//           Authorization: apiKey, // Sử dụng apiKey từ props
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           inputs: {},
//           query: text,
//           response_mode: "streaming",
//           conversation_id: "",
//           user: "test-react-app",
//         }),
//       });

//       if (!text_) setInput("");

//       const reader = response.body.getReader();
//       const decoder = new TextDecoder();
//       let accumulatedText = "";

//       let botMessageIndex;
//       setMessages((prev) => {
//         const newBotMessage = { sender: "bot", text: "" };
//         botMessageIndex = prev.length;
//         return [...prev, newBotMessage];
//       });

//       while (true) {
//         const { done, value } = await reader.read();
//         if (done) break;

//         const chunk = decoder.decode(value);
//         const lines = chunk.split("\n").filter((line) => line.trim() !== "");

//         lines.forEach((line) => {
//           if (line.startsWith("data: ")) {
//             const jsonString = line.replace("data: ", "");
//             try {
//               const jsonData = JSON.parse(jsonString);
//               if (jsonData.answer) {
//                 accumulatedText += jsonData.answer;
//                 setMessages((prev) => {
//                   const updatedMessages = [...prev];
//                   updatedMessages[botMessageIndex] = {
//                     ...updatedMessages[botMessageIndex],
//                     text: accumulatedText,
//                   };
//                   return updatedMessages;
//                 });
//               }
//             } catch (error) {
//               console.error("Lỗi khi parse JSON:", error);
//             }
//           }
//         });
//       }
//     } catch (error) {
//       console.error("Lỗi khi gửi tin nhắn:", error);
//       const errorMessage = { sender: "bot", text: "Xin lỗi, có lỗi xảy ra!" };
//       setMessages((prev) => [...prev, errorMessage]);
//     }

//     setIsLoading(false);
//   };

//   return (
//     <div className="chat-container">
//       <div className="chat-box">
//         {messages.map((msg, index) => (
//           <div key={index} className={`message ${msg.sender}`}>
//             <div
//               className="markdown-container"
//               dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.text) }}
//             />
//           </div>
//         ))}
//         <div ref={chatEndRef} />
//       </div>
//       <div className="input-container">
//         {isLoading ? (
//           <div className="loading-indicator">
//             <span>Loading ...</span>
//           </div>
//         ) : (
//           <>
//             <textarea
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyPress={(e) => {
//                 if (e.key === "Enter" && !e.shiftKey) {
//                   e.preventDefault();
//                   sendMessage();
//                 }
//               }}
//               placeholder="Nhập tin nhắn..."
//               style={{
//                 resize: "none",
//                 overflowY: "hidden",
//                 height: "43px",
//                 maxHeight: "120px",
//               }}
//               onInput={(e) => {
//                 e.target.style.height = "43px";
//                 const newHeight = e.target.scrollHeight;
//                 const maxHeight = 120;
//                 e.target.style.height = `${Math.min(newHeight, maxHeight)}px`;
//                 e.target.style.overflowY =
//                   newHeight >= 43 && newHeight < 120 ? "hidden" : "auto";
//               }}
//             />
//             <button onClick={() => sendMessage()}>
//               <FaPaperPlane />
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Chatbot;
import React, { useState, useEffect, useRef } from "react";
import { marked } from "marked";
import AppConstants from "../utils/Constants.js";
import { FaPaperPlane } from "react-icons/fa";
import Prism from "prismjs";

const Chatbot = ({ apiKey, currentTab }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const prevTabRef = useRef(null); // Theo dõi tab trước đó

  const parseMarkdown = (text) => {
    const html = marked(text, {
      highlight: (code, lang) => {
        if (Prism.languages[lang]) {
          return Prism.highlight(code, Prism.languages[lang], lang);
        }
        return code;
      },
    });
    return html;
  };

  // Thêm thông báo phân cách khi tab thay đổi
  useEffect(() => {
    if (prevTabRef.current !== null && prevTabRef.current !== currentTab) {
      setMessages((prev) => [
        ...prev,
        { sender: "system", text: `${currentTab}` == "Home" ? "Trở về màn hình chính" : `Bắt đầu chủ đề: ${currentTab}` },
      ]);
    }
    prevTabRef.current = currentTab; // Cập nhật tab trước đó
  }, [currentTab]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text_ = null) => {
    const text = text_ || input.trim();
    if (!text) return;

    setIsLoading(true);
    const userMessage = { sender: "user", text };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch(`${AppConstants.BASE_URL}/chat-messages`, {
        method: "POST",
        headers: {
          Authorization: apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: {},
          query: text,
          response_mode: "streaming",
          conversation_id: "",
          user: "test-react-app",
        }),
      });

      if (!text_) setInput("");

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
              console.error("Lỗi khi parse JSON:", error);
            }
          }
        });
      }
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
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
          <div className="loading-indicator">
            <span>Loading ...</span>
          </div>
        ) : (
          <>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
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
                e.target.style.overflowY =
                  newHeight >= 43 && newHeight < 120 ? "hidden" : "auto";
              }}
            />
            <button onClick={() => sendMessage()}>
              <FaPaperPlane />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Chatbot;