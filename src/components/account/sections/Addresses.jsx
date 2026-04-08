import { useState } from "react";

const initialAddresses = [
  {
    id: 1,
    type: "Home",
    name: "Sarah Anderson",
    phone: "(702) 555-0122",
    address: "2715 Ash Dr. San Jose, South Dakota 83475",
    isDefault: true,
  },
  {
    id: 2,
    type: "Office",
    name: "Sarah Anderson",
    phone: "(219) 555-0114",
    address: "8502 Preston Rd. Inglewood, Maine 98380",
    isDefault: false,
  },
];

export default function Addresses() {
  const [addresses, setAddresses] = useState(initialAddresses);

  const handleDelete = (id) => {
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  const handleSetDefault = (id) => {
    setAddresses(
      addresses.map((a) => ({
        ...a,
        isDefault: a.id === id,
      })),
    );
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Addresses</h2>

        <button className="bg-[#7a1c3d] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#5a142c]">
          + Add new address
        </button>
      </div>

      {/* ADDRESS LIST */}
      <div className="grid grid-cols-2 gap-6">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className="border rounded-xl p-5 relative hover:shadow-md transition"
          >
            {/* DEFAULT BADGE */}
            {addr.isDefault && (
              <span className="absolute top-3 right-3 text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                Default
              </span>
            )}

            {/* TYPE */}
            <h3 className="font-semibold mb-1">{addr.type}</h3>

            {/* DETAILS */}
            <p className="text-sm font-medium">{addr.name}</p>
            <p className="text-sm text-gray-500">{addr.phone}</p>
            <p className="text-sm text-gray-500 mt-1">{addr.address}</p>

            {/* ACTIONS */}
            <div className="flex gap-4 mt-4 text-sm">
              <button className="text-[#7a1c3d] hover:underline">Edit</button>

              <button
                onClick={() => handleDelete(addr.id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>

              {!addr.isDefault && (
                <button
                  onClick={() => handleSetDefault(addr.id)}
                  className="text-gray-600 hover:underline"
                >
                  Set as default
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
