import { useState } from "react";

const initialCards = [
  {
    id: 1,
    type: "Visa",
    number: "**** **** **** 1234",
    name: "Sarah Anderson",
    expiry: "08/2026",
    isDefault: true,
  },
  {
    id: 2,
    type: "Mastercard",
    number: "**** **** **** 5678",
    name: "Sarah Anderson",
    expiry: "11/2025",
    isDefault: false,
  },
];

export default function PaymentMethods() {
  const [cards, setCards] = useState(initialCards);

  const handleDelete = (id) => {
    setCards(cards.filter((c) => c.id !== id));
  };

  const handleSetDefault = (id) => {
    setCards(
      cards.map((c) => ({
        ...c,
        isDefault: c.id === id,
      })),
    );
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Payment Methods</h2>

        <button className="bg-[#7a1c3d] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#5a142c]">
          + Add new card
        </button>
      </div>

      {/* CARDS GRID */}
      <div className="grid grid-cols-2 gap-6">
        {cards.map((card) => (
          <div
            key={card.id}
            className="relative rounded-2xl p-5 text-white shadow-md overflow-hidden"
            style={{
              background:
                card.type === "Visa"
                  ? "linear-gradient(135deg,#1e3a8a,#3b82f6)"
                  : "linear-gradient(135deg,#111827,#374151)",
            }}
          >
            {/* DEFAULT BADGE */}
            {card.isDefault && (
              <span className="absolute top-3 right-3 text-xs bg-white/20 px-2 py-1 rounded">
                Default
              </span>
            )}

            {/* CARD TYPE */}
            <p className="text-sm opacity-80">{card.type}</p>

            {/* CARD NUMBER */}
            <h3 className="text-lg font-semibold mt-2 tracking-widest">
              {card.number}
            </h3>

            {/* NAME + EXPIRY */}
            <div className="flex justify-between mt-6 text-sm">
              <div>
                <p className="opacity-70">Card Holder</p>
                <p className="font-medium">{card.name}</p>
              </div>

              <div>
                <p className="opacity-70">Expires</p>
                <p className="font-medium">{card.expiry}</p>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-4 mt-5 text-xs">
              <button className="hover:underline">Edit</button>

              <button
                onClick={() => handleDelete(card.id)}
                className="text-red-300 hover:underline"
              >
                Delete
              </button>

              {!card.isDefault && (
                <button
                  onClick={() => handleSetDefault(card.id)}
                  className="hover:underline"
                >
                  Set default
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
