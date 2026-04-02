import { useState, useRef, useCallback } from "react";
import { saveSession } from "../services/sessionApi";
import type { KeystrokeEvent, PasteEvent } from "../services/sessionApi";

interface EditorProps {
    userId: string;
    userName: string;
}

function Editor({ userId, userName }: EditorProps) {
    const [content, setContent] = useState("");

    const [statusMessage, setStatusMessage] = useState("");
    const [isError, setIsError] = useState(false);

    const [isSaving, setIsSaving] = useState(false);

    const keystrokesRef = useRef<KeystrokeEvent[]>([]);
    const pasteEventsRef = useRef<PasteEvent[]>([]);

    const lastKeyTimeRef = useRef<number>(0);

    const keyDownTimeRef = useRef<number>(0);

    const startTimeRef = useRef<Date | null>(null);

    const [keystrokeCount, setKeystrokeCount] = useState(0);
    const [pasteCount, setPasteCount] = useState(0);

    const handleKeyDown = useCallback((_e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        const now = Date.now();

        if (!startTimeRef.current) {
            startTimeRef.current = new Date();
        }

        const interval = lastKeyTimeRef.current > 0
            ? now - lastKeyTimeRef.current
            : 0;

        keyDownTimeRef.current = now;
        lastKeyTimeRef.current = now;

        keystrokesRef.current.push({
            interval,
            duration: 0,
            timestamp: now,
        });

        setKeystrokeCount(keystrokesRef.current.length);
    }, []);

    const handleKeyUp = useCallback((_e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        const now = Date.now();

        const lastEntry = keystrokesRef.current[keystrokesRef.current.length - 1];
        if (lastEntry && keyDownTimeRef.current > 0) {
            lastEntry.duration = now - keyDownTimeRef.current;
        }
    }, []);

    const handlePaste = useCallback((e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        const pastedText = e.clipboardData.getData("text");

        pasteEventsRef.current.push({
            textLength: pastedText.length,
            timestamp: Date.now(),
        });

        setPasteCount(pasteEventsRef.current.length);
    }, []);

    const handleSave = async () => {
        if (!content.trim()) {
            setStatusMessage("Please write something before saving.");
            setIsError(true);
            return;
        }

        setIsSaving(true);
        setStatusMessage("");

        try {
            const sessionData = {
                userId,
                content,
                startTime: startTimeRef.current?.toISOString() || new Date().toISOString(),
                endTime: new Date().toISOString(),
                keystrokeTimings: keystrokesRef.current,
                pasteEvents: pasteEventsRef.current,
            };

            const result = await saveSession(sessionData);
            console.log("Session saved:", result);

            setStatusMessage("Session saved successfully! ✓");
            setIsError(false);
            resetEditor();
        } catch (err) {
            console.error("Save failed:", err);
            setStatusMessage("Failed to save session. Is the backend running?");
            setIsError(true);
        } finally {
            setIsSaving(false);
        }
    };

    const resetEditor = () => {
        setContent("");
        keystrokesRef.current = [];
        pasteEventsRef.current = [];
        startTimeRef.current = null;
        lastKeyTimeRef.current = 0;
        keyDownTimeRef.current = 0;
        setKeystrokeCount(0);
        setPasteCount(0);
    };

    const calculateAuthenticity = () => {
        if (content.length === 0) return 100;
        const totalPasted = pasteEventsRef.current.reduce((sum, p) => sum + p.textLength, 0);
        const pastePenalty = (totalPasted / content.length) * 100;
        const unpastedLength = Math.max(0, content.length - totalPasted);
        const keystrokeShortfall = Math.max(0, unpastedLength - keystrokeCount);
        const keystrokePenalty = (keystrokeShortfall / content.length) * 100;
        return Math.min(100, Math.max(0, Math.round(100 - pastePenalty - keystrokePenalty)));
    };

    return (
        <div className="editor-container">
            <div className="editor-greeting">
                Hi, {userName}! Start writing below.
            </div>

            <div className="editor-stats">
                <span>⌨️ Keystrokes: {keystrokeCount}</span>
                <span>📋 Pastes: {pasteCount}</span>
                <span>📝 Characters: {content.length}</span>
                <span>🛡️ Authenticity: {calculateAuthenticity()}%</span>
            </div>

            <textarea
                className="editor-textarea"
                placeholder="Start writing here... Your typing rhythm and paste events will be tracked for authenticity analysis. Key characters are NOT recorded."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                onKeyUp={handleKeyUp}
                onPaste={handlePaste}
                rows={14}
            />

            <button
                className="save-button"
                onClick={handleSave}
                disabled={isSaving}
            >
                {isSaving ? "Saving..." : "💾 Save Session"}
            </button>

            {statusMessage && (
                <div className={`status-message ${isError ? "error" : "success"}`}>
                    {statusMessage}
                </div>
            )}
        </div>
    );
}

export default Editor;