import { useState, useEffect, useMemo } from "react";
import useGet from "../../api/hooks/useGet";
import usePost from "../../api/hooks/usePost";
import UserChat from "../../components/dashboard/support/UserChat";

export default function Support() {
  const { data, loading, refetch } = useGet("/support/tickets");
  const { postData } = usePost();

  const [tickets, setTickets] = useState([]);
  const [selected, setSelected] = useState(null);

  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [error, setError] = useState("");

  // ================= LOAD =================
  useEffect(() => {
    if (data) {
      const ticketData = data.data || [];

      setTickets(ticketData);

      // ✅ auto select first ticket
      if (!selected && ticketData.length > 0) {
        setSelected(ticketData[0]);
      }
    }
  }, [data]);

  // ================= ACTIVE TICKET =================
  const activeTicket = useMemo(() => {
    return tickets.find(
      (t) => t.status === "open" || t.status === "pending"
    );
  }, [tickets]);

  // ================= CREATE =================
  const createTicket = async () => {
    if (!subject.trim() || !description.trim()) return;

    setError("");

    try {
      await postData({
        url: "/support/tickets",
        data: { subject, description },
      });

      setSubject("");
      setDescription("");
      setShowForm(false);

      refetch({ force: true });
    } catch (err) {
      setError(err?.message || "Failed to create ticket");
    }
  };

  return (
    <div className="min-h-screen px-6 py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">

        {/* ================= LEFT PANEL ================= */}
        <div className="bg-white p-4 rounded-xl shadow flex flex-col">

          <h2 className="font-semibold mb-3">Support</h2>

          {/* 🔥 CREATE BUTTON */}
          {!activeTicket && !showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-black text-white py-2 rounded mb-3"
            >
              + Create Ticket
            </button>
          )}

          {/* 🚫 ACTIVE TICKET WARNING */}
          {activeTicket && (
            <div className="text-xs text-red-500 mb-3">
              You already have an active ticket. Please wait until it's closed.
            </div>
          )}

          {/* 📝 FORM */}
          {showForm && !activeTicket && (
            <div className="space-y-2 mb-4">
              <input
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />

              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />

              {error && (
                <p className="text-xs text-red-500">{error}</p>
              )}

              <div className="flex gap-2">
                <button
                  onClick={createTicket}
                  className="flex-1 bg-black text-white py-2 rounded"
                >
                  Submit
                </button>

                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 border py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* ================= TICKET LIST ================= */}
          <div className="flex-1 overflow-y-auto">
            <h3 className="text-sm font-medium mb-2">My Tickets</h3>

            {loading && (
              <p className="text-xs text-gray-400">Loading...</p>
            )}

            {!loading && tickets.length === 0 && (
              <p className="text-xs text-gray-400">No tickets</p>
            )}

            <div className="space-y-2">
              {tickets.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelected(t)}
                  className={`p-2 border rounded cursor-pointer transition ${
                    selected?.id === t.id
                      ? "bg-gray-100"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <p className="text-sm font-medium truncate">
                    {t.subject}
                  </p>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      t.status === "open"
                        ? "bg-green-100 text-green-600"
                        : t.status === "pending"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= RIGHT CHAT ================= */}
        <div className="bg-white rounded-xl shadow overflow-hidden h-[600px]">
          <UserChat ticket={selected} />
        </div>

      </div>
    </div>
  );
}