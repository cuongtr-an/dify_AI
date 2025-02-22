import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import Chatbot from './components/Chatbot.jsx';

function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(window.innerWidth * 0.2); // Mặc định 20% màn hình
  const sidebarRef = useRef(null);
  const isResizing = useRef(false);

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

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="App">
      <div
        className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}
        style={{ width: isCollapsed ? '50px' : `${sidebarWidth}px` }}
        ref={sidebarRef}
      >
        <button className="toggle-button" onClick={toggleSidebar}>
          {
            isCollapsed ? 
            (
              <div className='height-icon'>
                <span className="material-icons">menu</span>
              </div>
            ) 
            :
            (
              <div className='title'>
                <span className="material-icons">menu</span>
                <h2 style={{marginTop: 0, marginBottom: 0}}>Chatbot</h2>
              </div>
            )
          }
        </button>
        {!isCollapsed && (
          <div className="menu-content">
            <ul>
              <li>Home</li>
              <li>About</li>
              <li>Contact</li>
            </ul>
          </div>
        )}
        <div
          className="resizer"
          onMouseDown={() => (isResizing.current = true)}
        />
      </div>
      <div className="main-content">
          <Chatbot />
      </div>
    </div>
  );
}

export default App;
