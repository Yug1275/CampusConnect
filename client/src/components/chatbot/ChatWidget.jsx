import { useState, useRef, useEffect } from "react";
import { FiMessageCircle, FiX, FiSend } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";
import { askChatbot } from "../../services/chatbotService";

const GREETING = {
  sender: "bot",
  text: "Hi! I'm the CampusConnect assistant. Ask me about the library, clubs, events, campus map, or contacting admin.",
};

function ChatWidget() {
  const { theme } = useTheme();
  const colors = themeColors[theme];

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || sending) return;

    setMessages((prev) => [...prev, { sender: "user", text: trimmed }]);
    setInput("");
    setSending(true);

    try {
      const response = await askChatbot(trimmed);
      setMessages((prev) => [...prev, { sender: "bot", text: response.data.answer }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="btn d-flex align-items-center justify-content-center border-0"
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          backgroundColor: "#2563eb",
          color: "#fff",
          boxShadow: "0 8px 20px rgba(37,99,235,0.35)",
          zIndex: 1200,
        }}
        title="Chat with CampusConnect Assistant"
      >
        {isOpen ? <FiX size={22} /> : <FiMessageCircle size={22} />}
      </button>

      {isOpen && (
        <div
          className="d-flex flex-column"
          style={{
            position: "fixed",
            bottom: "92px",
            right: "16px",
            width: "min(340px, calc(100vw - 32px))",
            height: "min(460px, calc(100vh - 128px))",
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.border}`,
            borderRadius: "16px",
            boxShadow: "0 16px 40px rgba(0,0,0,0.25)",
            zIndex: 1200,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            className="px-3 py-3 d-flex align-items-center"
            style={{ backgroundColor: "#1e293b" }}
          >
            <span
              className="d-flex align-items-center justify-content-center me-2"
              style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#2563eb" }}
            >
              <FiMessageCircle size={16} color="#fff" />
            </span>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: "0.92rem" }}>
              CampusConnect Assistant
            </span>
          </div>

          {/* Messages */}
          <div className="flex-grow-1 px-3 py-3" style={{ overflowY: "auto" }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className="d-flex mb-2"
                style={{ justifyContent: msg.sender === "user" ? "flex-end" : "flex-start" }}
              >
                <div
                  className="px-3 py-2"
                  style={{
                    maxWidth: "80%",
                    borderRadius: "12px",
                    fontSize: "0.85rem",
                    backgroundColor:
                      msg.sender === "user" ? "#2563eb" : colors.pageBg,
                    color: msg.sender === "user" ? "#fff" : colors.textPrimary,
                    border: msg.sender === "bot" ? `1px solid ${colors.border}` : "none",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {sending && (
              <div className="d-flex mb-2" style={{ justifyContent: "flex-start" }}>
                <div
                  className="px-3 py-2"
                  style={{
                    borderRadius: "12px",
                    fontSize: "0.85rem",
                    backgroundColor: colors.pageBg,
                    color: colors.textMuted,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  Typing...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="d-flex px-2 py-2" style={{ borderTop: `1px solid ${colors.border}` }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="form-control border-0"
              style={{
                backgroundColor: "transparent",
                color: colors.textPrimary,
                fontSize: "0.85rem",
                outline: "none",
                boxShadow: "none",
              }}
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="btn d-flex align-items-center justify-content-center border-0"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "#2563eb",
                color: "#fff",
                opacity: sending || !input.trim() ? 0.5 : 1,
                flexShrink: 0,
              }}
            >
              <FiSend size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default ChatWidget;