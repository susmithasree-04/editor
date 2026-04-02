import { useState, useEffect } from "react";
import Editor from "./components/Editor";
import Login from "./components/Login";
import SessionList from "./components/SessionList";
import "./App.css";
interface UserData {
  id: string;
  name: string;
  email: string;
}
type ActiveTab = "editor" | "sessions";
function App() {
  const [user, setUser] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>("editor");
  useEffect(() => {
    const savedUser = localStorage.getItem("vinotes-user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("vinotes-user");
        localStorage.removeItem("vinotes-token");
      }
    }
  }, []);
  const handleAuthSuccess = (userData: UserData) => {
    setUser(userData);
  };
  const handleLogout = () => {
    localStorage.removeItem("vinotes-user");
    localStorage.removeItem("vinotes-token");
    setUser(null);
    setActiveTab("editor");
  };
  return (
    <div className="app">
      {}
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1 className="app-title">
              <span className="title-icon">✍️</span> Vi-Notes
            </h1>
            <p className="app-subtitle">Writing Authenticity Platform</p>
          </div>
          {}
          {user && (
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </header>
      {}
      <main className="app-main">
        {user ? (
          <>
            {}
            <div className="tab-bar">
              <button
                className={`tab-button ${activeTab === "editor" ? "active" : ""}`}
                onClick={() => setActiveTab("editor")}
              >
                ✏️ Editor
              </button>
              <button
                className={`tab-button ${activeTab === "sessions" ? "active" : ""}`}
                onClick={() => setActiveTab("sessions")}
              >
                📂 My Sessions
              </button>
            </div>
            {}
            {activeTab === "editor" ? (
              <>
                <div className="description-box">
                  <p>
                    Start typing below. Vi-Notes captures your writing patterns —
                    keystroke timing, pauses, and paste events — to verify writing
                    authenticity. <strong>Your actual keystrokes are NOT recorded</strong>,
                    only timing data.
                  </p>
                </div>
                <Editor userId={user.id} userName={user.name} />
              </>
            ) : (
              <SessionList userId={user.id} />
            )}
          </>
        ) : (
          <Login onAuthSuccess={handleAuthSuccess} />
        )}
      </main>
      {}
      <footer className="app-footer">
        <p>Vi-Notes © 2026 — Writing Authenticity Platform</p>
      </footer>
    </div>
  );
}
export default App;
