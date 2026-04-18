import { useMemo } from "react";

const TicketList = ({ tickets = [], selected, onSelect }) => {
  // ================= SORT BY LATEST ACTIVITY =================
  const sortedTickets = useMemo(() => {
    return [...tickets].sort((a, b) => {
      const aTime =
        a.replies?.length > 0
          ? new Date(a.replies[a.replies.length - 1].created_at)
          : new Date(a.created_at);

      const bTime =
        b.replies?.length > 0
          ? new Date(b.replies[b.replies.length - 1].created_at)
          : new Date(b.created_at);

      return bTime - aTime;
    });
  }, [tickets]);

  if (!sortedTickets.length) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 text-sm">
        No tickets found
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">

      {sortedTickets.map((ticket) => {
        const isActive = selected?.id === ticket.id;

        // ================= LAST MESSAGE =================
        const lastReply =
          ticket.replies?.length > 0
            ? ticket.replies[ticket.replies.length - 1]
            : null;

        const lastMessage = lastReply?.message || ticket.description || "No message";

        // ================= TIME =================
        const timeSource = lastReply?.created_at || ticket.created_at;

        const time = new Date(timeSource).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        // ================= USER =================
        const userName = ticket.user?.name || "User";
        const avatar = userName.charAt(0).toUpperCase();

        return (
          <div
            key={ticket.id}
            onClick={() => onSelect(ticket)}
            className={`flex gap-3 p-4 border-b cursor-pointer transition ${
              isActive
                ? "bg-blue-50 border-l-4 border-blue-500"
                : "hover:bg-gray-50"
            }`}
          >
            {/* AVATAR */}
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600">
              {avatar}
            </div>

            {/* CONTENT */}
            <div className="flex-1 min-w-0">

              {/* TOP */}
              <div className="flex justify-between items-center gap-2">
                <h3 className="text-sm font-medium truncate">
                  {ticket.subject}
                </h3>

                <span className="text-[10px] text-gray-400 whitespace-nowrap">
                  {time}
                </span>
              </div>

              {/* USER */}
              <p className="text-[11px] text-gray-500 truncate">
                {userName}
              </p>

              {/* LAST MESSAGE */}
              <p className="text-xs text-gray-500 truncate mt-1">
                {lastMessage}
              </p>

              {/* BOTTOM */}
              <div className="flex justify-between items-center mt-2">

                {/* STATUS */}
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full capitalize ${
                    ticket.status === "open"
                      ? "bg-green-100 text-green-600"
                      : ticket.status === "pending"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {ticket.status}
                </span>

                {/* UNREAD */}
                {Number(ticket.unread_count) > 0 && (
                  <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                    {ticket.unread_count}
                  </span>
                )}
              </div>

            </div>
          </div>
        );
      })}

    </div>
  );
};

export default TicketList;