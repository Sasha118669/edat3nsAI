import { useState, useRef, useEffect } from "react";
import "./App.css";
 
const initialMessages = [
  {
    id: 1,
    role: "user",
    text: "Привет! Как мне использовать async/await для запроса к API?",
  },
  {
    id: 2,
    role: "ai",
    text: (
      <>
        Для запроса к API с <code>async/await</code> нужно обернуть вызов{" "}
        <code>fetch</code> в асинхронную функцию и дождаться ответа через{" "}
        <code>await</code>. Это делает код линейным и читаемым — без цепочек{" "}
        <code>.then()</code>.
      </>
    ),
  }
];
 
const recentChats = [
  { id: 1, title: "AI Chat UI project", active: true }
];
 
const suggestions = ["Объясни подробнее", "Покажи пример"];
 
function TypingDots() {
  return (
    <div className="typing-dots">
      <span /><span /><span />
    </div>
  );
}
 
export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
 
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
 
  const handleSend = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
 
    const userMsg = { id: Date.now(), role: "user", text: msg };
    const typingMsg = { id: Date.now() + 1, role: "ai", text: null };
 
    setMessages((prev) => [...prev.filter((m) => m.text !== null || m.id !== 4), userMsg, typingMsg]);
    setInput("");
    setIsTyping(true);
 
    try {
  const res = await fetch("https://edat3nsai.onrender.com/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: msg }),
  });

  const data = await res.json();

  setMessages((prev) =>
    prev.map((m) =>
      m.id === typingMsg.id
        ? { ...m, text: data.content || "Пустой ответ" }
        : m
    )
  );
} catch (error) {
  console.error("Fetch error:", error.message);
  setMessages((prev) =>
    prev.map((m) =>
      m.id === typingMsg.id
        ? { ...m, text: `Ошибка: ${error.message}` }
        : m
    )
  );
} finally {
  setIsTyping(false);
}
  };
 
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
 
  const handleTextareaInput = (e) => {
    setInput(e.target.value);
    const ta = textareaRef.current;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 140) + "px";
  };
 
  return (
    <div className="app">
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}
 
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "sidebar--open" : ""}`}>
        <div className="sidebar-header">
          <div className="brand">
            <span className="brand-icon">✦</span>
            <span className="brand-name">eDat3n<span className="brand-accent">X</span>Chat</span>
          </div>
        </div>
 
        <button className="new-chat-btn">
          <span className="new-chat-icon">+</span>
          <span>New chat</span>
        </button>
 
        <div className="recent-label">RECENT</div>
        <nav className="chat-list">
          {recentChats.map((chat) => (
            <button
              key={chat.id}
              className={`chat-item ${chat.active ? "chat-item--active" : ""}`}
            >
              {chat.title}
            </button>
          ))}
        </nav>
      </aside>
 
      {/* Main */}
      <main className="main">
        {/* Topbar */}
        <header className="topbar">
          <button className="menu-btn" onClick={() => setSidebarOpen((o) => !o)}>
            <span /><span /><span />
          </button>
          <h1 className="chat-title">AI Chat UI project</h1>
          <div className="model-badge">share<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v8.5M15 7l-3-3l-3 3m-4 5v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"/></svg></div>
        </header>
 
        {/* Messages */}
        <div className="messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`message message--${msg.role}`}>
              {msg.role === "ai" && (
                <div className="avatar avatar--ai">AI</div>
              )}
              <div className={`bubble bubble--${msg.role}`}>
                {msg.text === null ? <TypingDots /> : <span>{msg.text}</span>}
              </div>
              {msg.role === "user" && (
                <div className="avatar avatar--user">ВЫ</div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
 
        {/* Bottom */}
        <div className="bottom">
          <div className="suggestions">
            {suggestions.map((s) => (
              <button key={s} className="suggestion-chip" onClick={() => handleSend(s)}>
                {s}
              </button>
            ))}
          </div>
 
          <div className="input-row">
            <textarea
              ref={textareaRef}
              className="input-field"
              placeholder="Напишите сообщение..."
              value={input}
              onChange={handleTextareaInput}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <button className="send-btn" onClick={() => handleSend()}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </div>
 
          <div className="input-hint">
            Enter — отправить · Shift+Enter — новая строка
          </div>
        </div>
      </main>
    </div>
  );
}