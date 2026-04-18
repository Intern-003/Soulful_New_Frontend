import { useEffect, useRef, useState } from "react";
import useGet from "../../../api/hooks/useGet";
import usePost from "../../../api/hooks/usePost";
import usePut from "../../../api/hooks/usePut";

const ChatBox = ({ ticket }) => {
  const { data, refetch } = useGet(
    ticket ? `/admin/support/${ticket.id}` : null,
    { autoFetch: !!ticket }
  );

  const { postData } = usePost();
  const { putData } = usePut();

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
  const sendMessage = async () => {
    if (!text.trim() || ticket.status === "closed") return;

    const tempMsg = {
      id: Date.now(),
      message: text,
      type: "admin",
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMsg]);

    const msg = text;
    setText("");
    setSending(true);

    try {
      await postData({
        url: `/admin/support/${ticket.id}/reply`,
        data: { message: msg },
      });

      refetch({ force: true });
    } catch (err) {
      console.error("Send error:", err);
    } finally {
      setSending(false);
    }
  };

  // ================= CHANGE STATUS =================
  const changeStatus = async (status) => {
    if (status === ticket.status) return;

    try {
      await putData({
        url: `/admin/support/${ticket.id}/status`,
        method: "PATCH", // ✅ IMPORTANT FIX
        data: { status },
      });

      refetch({ force: true });
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  // ================= EMPTY =================
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
      <div className="p-4 border-b flex justify-between items-center bg-white">
        
        <div>
          <h2 className="font-semibold text-sm">{ticket.subject}</h2>
          <p className="text-xs text-gray-500">
            {ticket.user?.name || "User"}
          </p>
        </div>

        {/* STATUS SECTION */}
        <div className="flex items-center gap-2">

          {/* BADGE */}
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

          {/* DROPDOWN */}
          <select
            value={ticket.status}
            onChange={(e) => changeStatus(e.target.value)}
            className={`text-xs px-2 py-1 rounded border focus:outline-none ${
              ticket.status === "open"
                ? "bg-green-50 text-green-600 border-green-200"
                : ticket.status === "pending"
                ? "bg-yellow-50 text-yellow-600 border-yellow-200"
                : "bg-gray-100 text-gray-600 border-gray-300"
            }`}
          >
            <option value="open">Open</option>
            <option value="pending">Pending</option>
            <option value="closed">Closed</option>
          </select>

        </div>
      </div>

      {/* ================= CHAT ================= */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => {
          const isAdmin = msg.type === "admin";

          const time = msg.created_at
            ? new Date(msg.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "";

          return (
            <div
              key={msg.id}
              className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}
            >
              <div className="max-w-xs">
                <div
                  className={`px-3 py-2 rounded-xl text-sm shadow-sm ${
                    isAdmin
                      ? "bg-blue-500 text-white"
                      : "bg-white border"
                  }`}
                >
                  {msg.message}
                </div>

                <div
                  className={`text-[10px] mt-1 ${
                    isAdmin
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
      <div className="p-3 border-t bg-white flex gap-2 items-center">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            ticket.status === "closed"
              ? "Ticket is closed"
              : "Type message..."
          }
          disabled={ticket.status === "closed"}
          className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          onClick={sendMessage}
          disabled={sending || ticket.status === "closed"}
          className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-600 disabled:opacity-50"
        >
          {sending ? "..." : "Send"}
        </button>
      </div>

    </div>
  );
};

export default ChatBox;