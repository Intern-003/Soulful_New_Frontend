import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Plus, MessageCircle, Clock, CheckCircle } from "lucide-react";
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
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (data) {
      const ticketData = data.data || [];
      setTickets(ticketData);

      if (!selected && ticketData.length > 0) {
        setSelected(ticketData[0]);
      }
    }
  }, [data]);

  const activeTicket = useMemo(() => {
    return tickets.find((t) => t.status === "open" || t.status === "pending");
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) =>
      t.subject.toLowerCase().includes(search.toLowerCase()),
    );
  }, [tickets, search]);

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
    <div className="relative min-h-screen bg-gradient-to-br from-[#fff9fb] via-white to-[#fff3f6] px-6 md:px-16 py-12 overflow-hidden">
      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#8B0D3A]/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#7A1C3D]/10 blur-[120px] rounded-full" />

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-semibold text-[#7A1C3D] mb-2">
          Help Center
        </h1>
        <p className="text-gray-500">
          Need help? Search or create a ticket — we’ve got you.
        </p>

        {/* SEARCH */}
        <div className="mt-6 relative max-w-md">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your tickets..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#ecd2d9] bg-white/70 backdrop-blur-md focus:outline-none focus:border-[#8B0D3A]"
          />
        </div>
      </div>

      {/* MAIN */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* LEFT PANEL */}
        <div className="bg-white/70 backdrop-blur-xl border border-[#f1d6dd] rounded-3xl p-5 shadow-lg flex flex-col h-[600px]">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-[#7A1C3D]">Your Tickets</h2>

            {!activeTicket && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-1 text-xs bg-[#8B0D3A] text-white px-3 py-1.5 rounded-lg hover:opacity-90"
              >
                <Plus size={14} /> New
              </button>
            )}
          </div>

          {/* ACTIVE WARNING */}
          {activeTicket && (
            <p className="text-xs text-red-500 mb-3">
              Active ticket already exists
            </p>
          )}

          {/* FORM */}
          {showForm && !activeTicket && (
            <div className="space-y-2 mb-4">
              <input
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
              {error && <p className="text-xs text-red-500">{error}</p>}
              <div className="flex gap-2">
                <button
                  onClick={createTicket}
                  className="flex-1 bg-[#8B0D3A] text-white py-2 rounded-lg text-sm"
                >
                  Submit
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 border py-2 rounded-lg text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* LIST */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {loading && <p className="text-xs text-gray-400">Loading...</p>}

            {!loading && filteredTickets.length === 0 && (
              <p className="text-xs text-gray-400">No tickets found</p>
            )}

            {filteredTickets.map((t) => (
              <motion.div
                key={t.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelected(t)}
                className={`p-3 rounded-xl cursor-pointer border transition ${
                  selected?.id === t.id
                    ? "bg-[#8B0D3A]/10 border-[#8B0D3A]"
                    : "bg-white hover:bg-[#faf5f7]"
                }`}
              >
                <p className="text-sm font-medium truncate">{t.subject}</p>

                <div className="flex items-center gap-2 mt-1 text-[10px]">
                  {t.status === "open" && (
                    <span className="flex items-center gap-1 text-green-600">
                      <MessageCircle size={12} /> Open
                    </span>
                  )}
                  {t.status === "pending" && (
                    <span className="flex items-center gap-1 text-yellow-600">
                      <Clock size={12} /> Pending
                    </span>
                  )}
                  {t.status === "closed" && (
                    <span className="flex items-center gap-1 text-gray-500">
                      <CheckCircle size={12} /> Closed
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* RIGHT CHAT */}
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-xl border border-[#f1d6dd] rounded-3xl shadow-lg overflow-hidden h-[600px]">
          {selected ? (
            <UserChat ticket={selected} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              Select a ticket to view conversation
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div className="text-center mt-10 text-xs text-gray-400">
        Soulfull Support — Always here for you
      </div>
    </div>
  );
}
