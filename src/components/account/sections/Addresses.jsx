import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  Star,
  CheckCircle2,
} from "lucide-react";

import useGet from "../../../api/hooks/useGet";
import usePost from "../../../api/hooks/usePost";
import usePut from "../../../api/hooks/usePut";
import axiosInstance from "../../../api/axiosInstance";

export default function Addresses() {
  const { data, loading, error, refetch } = useGet("/address");

  const { postData, loading: adding } = usePost();
  const { putData, loading: updating } = usePut();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    country: "",
    postal_code: "",
    is_default: false,
  });

  const addresses = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
    ? data
    : [];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      name: "",
      phone: "",
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      country: "",
      postal_code: "",
      is_default: false,
    });
    setEditingId(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await putData({
          url: `/address/${editingId}`,
          data: form,
        });
      } else {
        await postData({
          url: "/address",
          data: form,
        });
      }

      setShowForm(false);
      resetForm();
      refetch({ force: true });
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (addr) => {
    setForm({
      name: addr.name || "",
      phone: addr.phone || "",
      address_line1: addr.address_line1 || "",
      address_line2: addr.address_line2 || "",
      city: addr.city || "",
      state: addr.state || "",
      country: addr.country || "",
      postal_code: addr.postal_code || "",
      is_default: addr.is_default || false,
    });

    setEditingId(addr.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/addresses/${id}`);
      refetch({ force: true });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await putData({
        url: `/addresses/${id}/default`,
        data: {},
      });

      refetch({ force: true });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Skeleton />;
  if (error)
    return (
      <p className="text-red-500 text-sm">
        Failed to load addresses
      </p>
    );

  return (
    <div className="relative">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Addresses
          </h2>
          <p className="text-sm text-gray-500">
            Manage your delivery locations
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center justify-center gap-2 bg-[#7A1C3D] text-white px-4 py-2 rounded-xl hover:bg-[#5a142c] transition w-full sm:w-auto"
        >
          <Plus size={16} />
          Add Address
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="bg-white border rounded-2xl p-4 sm:p-5 shadow-sm mb-6 space-y-3">
          {[
            "name",
            "phone",
            "address_line1",
            "address_line2",
            "city",
            "state",
            "country",
            "postal_code",
          ].map((field) => (
            <input
              key={field}
              name={field}
              value={form[field]}
              onChange={handleChange}
              placeholder={field.replace("_", " ")}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7A1C3D]/30"
            />
          ))}

          <button
            onClick={handleSubmit}
            disabled={adding || updating}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition text-sm"
          >
            {editingId
              ? updating
                ? "Updating..."
                : "Update Address"
              : adding
              ? "Saving..."
              : "Save Address"}
          </button>
        </div>
      )}

      {/* LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {addresses.map((addr) => (
          <motion.div
            key={addr.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-white border rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition"
          >
            {/* DEFAULT BADGE */}
            {addr.is_default && (
              <div className="absolute top-3 right-3 flex items-center gap-1 text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full">
                <CheckCircle2 size={12} />
                Default
              </div>
            )}

            <h3 className="font-semibold text-[#7A1C3D]">
              {addr.name}
            </h3>

            <p className="text-xs text-gray-500">{addr.phone}</p>

            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              {addr.address_line1}, {addr.city}, {addr.state}
            </p>

            {/* ACTIONS */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-4">
              <button
                onClick={() => handleEdit(addr)}
                className="p-2 rounded-lg hover:bg-blue-50 text-blue-600"
              >
                <Pencil size={16} />
              </button>

              <button
                onClick={() => handleDelete(addr.id)}
                className="p-2 rounded-lg hover:bg-red-50 text-red-600"
              >
                <Trash2 size={16} />
              </button>

              {!addr.is_default && (
                <button
                  onClick={() => handleSetDefault(addr.id)}
                  className="flex items-center gap-1 text-xs px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200"
                >
                  <Star size={14} />
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

/* ---------------- SKELETON ---------------- */
function Skeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="h-32 bg-gray-200 rounded-2xl"
        ></div>
      ))}
    </div>
  );
}