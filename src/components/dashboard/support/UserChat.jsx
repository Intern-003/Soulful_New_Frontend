import { useEffect, useState, useRef } from "react";
import useGet from "../../../api/hooks/useGet";
import usePost from "../../../api/hooks/usePost";

const UserChat = ({ ticket }) => {
  const { data, refetch } = useGet(
    ticket ? `/support/tickets/${ticket.id}` : null,
    { autoFetch: !!ticket }
  );

  const { postData } = usePost();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const bottomRef = useRef();

  // ================= LOAD MESSAGES =================
  useEffect(() => {
    if (data?.data?.replies) {
      setMessages(data.data.replies);
    }
  }, [data]);

  // ================= AUTO REFRESH =================
  useEffect(() => {
    if (!ticket) return;

    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        refetch({ force: true });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [ticket]);

  // ================= AUTO SCROLL =================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ================= SEND MESSAGE =================
  const send = async () => {
    if (!text.trim() || ticket.status === "closed") return;

    const tempMsg = {
      id: Date.now(),
      message: text,
      type: "user",
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMsg]);

    const msg = text;
    setText("");
    setSending(true);

    try {
      await postData({
        url: `/support/tickets/${ticket.id}/reply`,
        data: { message: msg },
      });

      refetch({ force: true });
    } catch (err) {
      console.error("Send error:", err);
    } finally {
      setSending(false);
    }
  };

  if (!ticket) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        Select a ticket
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">

      {/* ================= HEADER ================= */}
      <div className="p-3 border-b flex justify-between items-center bg-white">
        <span className="font-medium">{ticket.subject}</span>

        <span
          className={`text-xs px-2 py-1 rounded-full capitalize ${
            ticket.status === "open"
              ? "bg-green-100 text-green-600"
              : ticket.status === "pending"
              ? "bg-yellow-100 text-yellow-600"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {ticket.status}
        </span>
      </div>

      {/* ================= MESSAGES ================= */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50">
        {messages.map((m) => {
          const isUser = m.type === "user";

          const time = m.created_at
            ? new Date(m.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "";

          return (
            <div
              key={m.id}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div className="max-w-xs">

                <div
                  className={`px-3 py-2 rounded text-sm shadow ${
                    isUser
                      ? "bg-black text-white"
                      : "bg-white border"
                  }`}
                >
                  {m.message}
                </div>

                <div
                  className={`text-[10px] mt-1 ${
                    isUser
                      ? "text-right text-gray-300"
                      : "text-gray-400"
                  }`}
                >
                  {time}
                </div>

              </div>
            </div>
          );
        })}

        <div ref={bottomRef}></div>
      </div>

      {/* ================= INPUT ================= */}
      <div className="p-3 border-t flex gap-2 bg-white">

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            ticket.status === "closed"
              ? "Ticket is closed"
              : "Type message..."
          }
          disabled={ticket.status === "closed"}
          className="flex-1 border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:bg-gray-100"
          onKeyDown={(e) => e.key === "Enter" && send()}
        />

        <button
          onClick={send}
          disabled={sending || ticket.status === "closed"}
          className="bg-black text-white px-4 rounded disabled:opacity-50"
        >
          {sending ? "..." : "Send"}
        </button>

      </div>
    </div>
  );
};

export default UserChat;