import { useState } from "react";
import { motion } from "framer-motion";
import useGet from "../../../api/hooks/useGet";

export default function Addresses() {
  // 🔥 API
  const { data, loading, error } = useGet("/address");

  const addresses = Array.isArray(data) ? data : [];

  const handleDelete = (id) => {
    console.log("Delete:", id);
  };

  const handleSetDefault = (id) => {
    console.log("Set default:", id);
  };

  if (loading) return <AddressesSkeleton />;

  if (error) {
    return <p className="text-red-500">Failed to load addresses</p>;
  }

  return (
    <div className="relative">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#7A1C3D]/10 blur-3xl rounded-full -z-10"></div>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-[#2d0f1f]">Addresses</h2>
          <p className="text-sm text-gray-500">Manage your saved addresses</p>
        </div>

        <button className="bg-[#7A1C3D] text-white px-5 py-2 rounded-lg text-sm shadow-md hover:shadow-lg transition">
          + Add Address
        </button>
      </div>

      {/* EMPTY */}
      {addresses.length === 0 && (
        <p className="text-gray-500 text-sm">No addresses found</p>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((addr, index) => (
          <motion.div
            key={addr.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="relative bg-white/80 backdrop-blur-xl border border-[#ead9e0] rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
          >
            {/* DEFAULT */}
            {addr.is_default && (
              <span className="absolute top-4 right-4 text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full font-medium">
                Default
              </span>
            )}

            {/* NAME */}
            <h3 className="font-semibold text-[#7A1C3D] text-lg mb-2">
              {addr.name}
            </h3>

            {/* PHONE */}
            <p className="text-sm text-gray-500">{addr.phone}</p>

            {/* ADDRESS */}
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              {addr.address_line1}
              {addr.address_line2 && `, ${addr.address_line2}`}
              <br />
              {addr.city}, {addr.state}, {addr.country} - {addr.postal_code}
            </p>

            {/* ACTIONS */}
            <div className="flex flex-wrap gap-3 mt-6">
              <button className="px-4 py-1.5 text-sm rounded-lg border border-[#ead9e0] hover:bg-[#f9f3f6] transition">
                Edit
              </button>

              <button
                onClick={() => handleDelete(addr.id)}
                className="px-4 py-1.5 text-sm rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition"
              >
                Delete
              </button>

              {!addr.is_default && (
                <button
                  onClick={() => handleSetDefault(addr.id)}
                  className="px-4 py-1.5 text-sm rounded-lg bg-[#7A1C3D]/10 text-[#7A1C3D] hover:bg-[#7A1C3D]/20 transition"
                >
                  Set Default
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function AddressesSkeleton() {
  return (
    <div className="relative animate-pulse">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="space-y-2">
          <div className="h-6 w-36 bg-gray-200 rounded"></div>
          <div className="h-3 w-52 bg-gray-200 rounded"></div>
        </div>

        <div className="h-9 w-32 bg-gray-200 rounded-lg"></div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="relative bg-white/80 border border-gray-200 rounded-2xl p-6 space-y-4"
          >
            {/* DEFAULT BADGE */}
            <div className="absolute top-4 right-4 h-5 w-16 bg-gray-200 rounded-full"></div>

            {/* NAME */}
            <div className="h-5 w-40 bg-gray-200 rounded"></div>

            {/* PHONE */}
            <div className="h-3 w-32 bg-gray-200 rounded"></div>

            {/* ADDRESS LINES */}
            <div className="space-y-2">
              <div className="h-3 w-full bg-gray-200 rounded"></div>
              <div className="h-3 w-5/6 bg-gray-200 rounded"></div>
              <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3 mt-4">
              <div className="h-8 w-16 bg-gray-200 rounded-lg"></div>
              <div className="h-8 w-16 bg-gray-200 rounded-lg"></div>
              <div className="h-8 w-24 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
