import { useState } from "react";

const ordersData = [
  {
    id: "7845431049",
    date: "02/15/2025",
    status: "in progress",
    total: 2105.9,
    items: [
      {
        name: "T-shirt",
        price: 25,
        qty: 2,
        image: "/p1.png",
      },
      {
        name: "Shoes",
        price: 80,
        qty: 1,
        image: "/p2.png",
      },
    ],
  },
  {
    id: "47H76G0F53",
    date: "12/10/2024",
    status: "delivered",
    total: 360.75,
    items: [
      {
        name: "Jacket",
        price: 120,
        qty: 1,
        image: "/p1.png",
      },
    ],
  },
];

const statusColor = {
  delivered: "text-green-600",
  cancelled: "text-red-500",
  "in progress": "text-yellow-500",
};

export default function Orders() {
  const [openOrder, setOpenOrder] = useState(null);

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Orders</h2>

        <div className="flex gap-3">
          <select className="border px-3 py-2 rounded-lg text-sm">
            <option>Status</option>
          </select>
          <select className="border px-3 py-2 rounded-lg text-sm">
            <option>All time</option>
          </select>
        </div>
      </div>

      {/* TABLE HEADER */}
      <div className="grid grid-cols-5 text-sm text-gray-500 pb-2 border-b">
        <span>Order #</span>
        <span>Date</span>
        <span>Status</span>
        <span>Total</span>
        <span></span>
      </div>

      {/* ORDERS LIST */}
      <div className="divide-y">
        {ordersData.map((order, index) => (
          <div key={order.id} className="py-4">
            {/* ROW */}
            <div className="grid grid-cols-5 items-center text-sm">
              {/* ORDER ID + IMAGES */}
              <div>
                <p className="font-medium">{order.id}</p>

                <div className="flex gap-2 mt-2">
                  {order.items.map((item, i) => (
                    <img
                      key={i}
                      src={item.image}
                      className="w-8 h-8 rounded object-cover"
                    />
                  ))}
                </div>
              </div>

              {/* DATE */}
              <span>{order.date}</span>

              {/* STATUS */}
              <span
                className={`capitalize font-medium ${
                  statusColor[order.status]
                }`}
              >
                ● {order.status}
              </span>

              {/* TOTAL */}
              <span className="font-medium">₹{order.total}</span>

              {/* ACTION */}
              <div className="text-right">
                <button
                  onClick={() =>
                    setOpenOrder(openOrder === index ? null : index)
                  }
                  className="w-8 h-8 rounded-full border flex items-center justify-center"
                >
                  {openOrder === index ? "▲" : "▼"}
                </button>
              </div>
            </div>

            {/* EXPAND DETAILS */}
            {openOrder === index && (
              <div className="mt-4 bg-gray-50 p-4 rounded-xl">
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between mb-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                      </div>
                    </div>

                    <p className="text-sm font-semibold">₹{item.price}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center gap-3 mt-6">
        {[1, 2, 3].map((p) => (
          <button
            key={p}
            className={`w-8 h-8 rounded-full ${
              p === 1 ? "bg-[#7a1c3d] text-white" : "border text-gray-600"
            }`}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
