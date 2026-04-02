import { useState, useEffect } from "react";
import { getSessionsByUser } from "../services/sessionApi";
interface SessionItem {
  _id: string;
  content: string;
  startTime: string;
  endTime: string;
  keystrokeTimings: { interval: number; duration: number; timestamp: number }[];
  pasteEvents: { textLength: number; timestamp: number }[];
  createdAt: string;
}
interface SessionListProps {
  userId: string;
}
function SessionList({ userId }: SessionListProps) {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  // Which session is expanded to show full content
  const [expandedId, setExpandedId] = useState<string | null>(null);
  // Fetch sessions when component mounts
  useEffect(() => {
    fetchSessions();
  }, [userId]);
  const fetchSessions = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getSessionsByUser(userId);
      setSessions(data.sessions || []);
    } catch (err) {
      console.error("Failed to fetch sessions:", err);
      setError("Failed to load sessions. Is the backend running?");
    } finally {
      setIsLoading(false);
    }
  };
  const handleSessionPaste = (e: React.ClipboardEvent<HTMLDivElement>, sessionId: string) => {
    const pastedText = e.clipboardData.getData("text");
    const el = e.currentTarget;
    setTimeout(() => {
      setSessions((prev) =>
        prev.map((s) => {
          if (s._id === sessionId) {
            return {
              ...s,
              content: el.textContent || s.content + pastedText,
              pasteEvents: [
                ...s.pasteEvents,
                { textLength: pastedText.length, timestamp: Date.now() },
              ],
            };
          }
          return s;
        })
      );
    }, 0);
  };

  // ---- Helper: format a date string nicely ----
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };


  const getDuration = (start: string, end: string) => {
    const diffMs = new Date(end).getTime() - new Date(start).getTime();
    const diffMins = Math.round(diffMs / 60000);
    if (diffMins < 1) return "< 1 min";
    return `${diffMins} min`;
  };

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const getAuthenticityScore = (content: string, keystrokes: number, pastes: {textLength: number}[]) => {
    if (content.length === 0) return 100;
    const totalPasted = pastes.reduce((sum, p) => sum + p.textLength, 0);
    const pastePenalty = (totalPasted / content.length) * 100;
    const unpastedLength = Math.max(0, content.length - totalPasted);
    const keystrokeShortfall = Math.max(0, unpastedLength - keystrokes);
    const keystrokePenalty = (keystrokeShortfall / content.length) * 100;
    return Math.min(100, Math.max(0, Math.round(100 - pastePenalty - keystrokePenalty)));
  };
  const getPreview = (text: string, maxLen = 120) => {
    if (text.length <= maxLen) return text;
    return text.substring(0, maxLen) + "...";
  };
  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };
  if (isLoading) {
    return (
      <div className="sessions-container">
        <div className="sessions-loading">Loading your sessions...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="sessions-container">
        <div className="status-message error">{error}</div>
        <button className="retry-button" onClick={fetchSessions}>
          Try Again
        </button>
      </div>
    );
  }
  if (sessions.length === 0) {
    return (
      <div className="sessions-container">
        <div className="sessions-empty">
          <p>📝 No sessions saved yet.</p>
          <p>Switch to the Editor tab and start writing!</p>
        </div>
      </div>
    );
  }
  return (
    <div className="sessions-container">
      <div className="sessions-header">
        <h3>Your Writing Sessions</h3>
        <span className="sessions-count">
          {sessions.length} session{sessions.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="sessions-list">
        {sessions.map((session) => (
          <div
            key={session._id}
            className={`session-card ${expandedId === session._id ? "expanded" : ""}`}
            onClick={() => toggleExpand(session._id)}
          >
            {}
            <div className="session-meta">
              <span className="session-date">
                📅 {formatDate(session.createdAt)}
              </span>
              <span className="session-duration">
                ⏱️ {getDuration(session.startTime, session.endTime)}
              </span>
            </div>
            {}
            <div className="session-stats">
              <span>📝 {getWordCount(session.content)} words</span>
              <span>⌨️ {session.keystrokeTimings.length} keystrokes</span>
              <span>
                📋 {session.pasteEvents.length} paste{session.pasteEvents.length !== 1 ? "s" : ""}
              </span>
              <span>🛡️ {getAuthenticityScore(session.content, session.keystrokeTimings.length, session.pasteEvents)}% Authentic</span>
            </div>
            {/* Content preview or full content */}
            <div
              className="session-content"
              contentEditable={expandedId === session._id}
              suppressContentEditableWarning={true}
              onClick={(e) => {
                if (expandedId === session._id) {
                  e.stopPropagation();
                }
              }}
              onPaste={(e) => handleSessionPaste(e, session._id)}
            >
              {expandedId === session._id
                ? session.content
                : getPreview(session.content)}
            </div>
            {}
            <div className="session-expand-hint">
              {expandedId === session._id
                ? "Click to collapse ▲"
                : "Click to expand ▼"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default SessionList;
