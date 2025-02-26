import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import Chatbot from "./components/Chatbot.jsx";
import AppConstants from "./utils/Constants.js";

function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(window.innerWidth * 0.2);
  const sidebarRef = useRef(null);
  const isResizing = useRef(false);
  const [currentTab, setCurrentTab] = useState(AppConstants.API_MODEL_BASE.name);

  const tabs = [
    { 
      name: AppConstants.API_MODEL_BASE.name,
      apikey: AppConstants.API_MODEL_BASE.apikey 
    },
    ...AppConstants.API_MODEL_OPTIONS.map((option) => ({
      name: option.name,
      apiKey: option.apikey,
    })),
  ];

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizing.current) {
        let newWidth = e.clientX;
        const maxWidth = window.innerWidth * 0.35;
        const minWidth = window.innerWidth * 0.2;

        if (newWidth < minWidth) newWidth = minWidth;
        if (newWidth > maxWidth) newWidth = maxWidth;

        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      isResizing.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="App">
      <div
        className={`sidebar ${isCollapsed ? "collapsed" : ""}`}
        style={{ width: isCollapsed ? "50px" : `${sidebarWidth}px` }}
        ref={sidebarRef}
      >
        <button className="toggle-button" onClick={toggleSidebar}>
          {isCollapsed ? (
            <div className="height-icon">
              <span className="material-icons">menu</span>
            </div>
          ) : (
            <div className="title">
              <span className="material-icons">menu</span>
              <h2 style={{ marginTop: 0, marginBottom: 0 }}>Chatbot</h2>
            </div>
          )}
        </button>
        {!isCollapsed && (
          <div className="menu-content">
            <ul>
              {tabs.map((tab) => (
                <li
                  key={tab.name}
                  onClick={() => setCurrentTab(tab.name)}
                  className={currentTab === tab.name ? "active" : ""}
                >
                  {tab.name}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div
          className="resizer"
          onMouseDown={() => (isResizing.current = true)}
        />
      </div>
      <div className="main-content">
        <Chatbot
          apiKey={tabs.find((tab) => tab.name === currentTab).apiKey}
          currentTab={currentTab} // Truyền currentTab xuống Chatbot
        />
      </div>
    </div>
  );
}

export default App;