import { useEffect, useState, useMemo } from "react";
import TicketList from "../../components/dashboard/support/TicketList";
import ChatBox from "../../components/dashboard/support/ChatBox";
import useGet from "../../api/hooks/useGet";

const Supportadmin = () => {
  const { data, loading, error, refetch } = useGet("/admin/support");

  const [tickets, setTickets] = useState([]);
  const [selected, setSelected] = useState(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  // ================= SET DATA =================
  useEffect(() => {
    if (!data) return;

    const ticketData = data.data || data || [];

    setTickets(ticketData);

    // ✅ keep selected updated safely
    if (selected) {
      const updated = ticketData.find((t) => t.id === selected.id);
      if (updated) {
        setSelected(updated);
      } else {
        setSelected(null); // removed ticket case
      }
    }
  }, [data]);

  // ================= FILTER (OPTIMIZED) =================
  const filtered = useMemo(() => {
    let temp = [...tickets];

    if (status !== "all") {
      temp = temp.filter((t) => t.status === status);
    }

    if (search.trim()) {
      temp = temp.filter((t) =>
        t.subject?.toLowerCase().includes(search.toLowerCase())
      );
    }

    return temp;
  }, [tickets, search, status]);

  // ================= AUTO REFRESH =================
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        refetch({ force: true });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-[88vh] flex flex-col gap-3">

      {/* ================= HEADER ================= */}
      <div className="bg-white rounded-2xl shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        
        <h2 className="text-lg font-semibold">
          Support Dashboard
        </h2>

        {/* SEARCH + FILTER */}
        <div className="flex gap-2 flex-wrap">

          <input
            type="text"
            placeholder="Search tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded text-sm w-48"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border px-3 py-2 rounded text-sm"
          >
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="pending">Pending</option>
            <option value="closed">Closed</option>
          </select>

        </div>
      </div>

      {/* ================= MAIN ================= */}
      <div className="flex flex-1 bg-white rounded-2xl shadow overflow-hidden">

        {/* LEFT PANEL */}
        <div className="w-full md:w-1/3 border-r flex flex-col">

          <div className="p-4 border-b flex justify-between items-center">
            <span className="font-semibold text-sm">
              Tickets ({filtered.length})
            </span>

            {loading && (
              <span className="text-xs text-gray-400">
                Updating...
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            <TicketList
              tickets={filtered}
              selected={selected}
              onSelect={setSelected}
            />
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="hidden md:flex w-2/3 flex-col">
          {selected ? (
            <ChatBox ticket={selected} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm">
              <span className="text-lg mb-2">💬</span>
              Select a ticket to start conversation
            </div>
          )}
        </div>

      </div>

      {/* ================= STATES ================= */}
      
      {/* ERROR */}
      {error && (
        <div className="text-red-500 text-sm px-2">
          Failed to load tickets
        </div>
      )}

      {/* EMPTY */}
      {!loading && tickets.length === 0 && (
        <div className="text-center text-gray-400 text-sm">
          No tickets available
        </div>
      )}

    </div>
  );
};

export default Supportadmin;