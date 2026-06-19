import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  Star,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import useGet from "../../../api/hooks/useGet";
import usePost from "../../../api/hooks/usePost";
import usePut from "../../../api/hooks/usePut";
import axiosInstance from "../../../api/axiosInstance";
import toast from "react-hot-toast";

export default function Addresses({ onAddressChange }) {
  const { data, loading, error, refetch } = useGet("/address");
  const { postData, loading: adding } = usePost();
  const { putData, loading: updating } = usePut();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [settingDefaultId, setSettingDefaultId] = useState(null);

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

  const addresses = Array.isArray(data) ? data : data?.data || [];

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
    // Validate required fields
    if (!form.name.trim()) {
      toast.error("Please enter name");
      return;
    }
    if (!form.phone.trim()) {
      toast.error("Please enter phone number");
      return;
    }
    if (!form.address_line1.trim()) {
      toast.error("Please enter address");
      return;
    }
    if (!form.city.trim()) {
      toast.error("Please enter city");
      return;
    }
    if (!form.state.trim()) {
      toast.error("Please enter state");
      return;
    }
    if (!form.postal_code.trim()) {
      toast.error("Please enter postal code");
      return;
    }

    try {
      if (editingId) {
        await putData({ url: `/address/${editingId}`, data: form });
        toast.success("Address updated successfully");
      } else {
        await postData({ url: "/address", data: form });
        toast.success("Address added successfully");
      }

      setShowForm(false);
      resetForm();
      await refetch({ force: true });

      if (onAddressChange) {
        onAddressChange();
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to save address");
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
    if (!window.confirm("Are you sure you want to delete this address?")) return;

    setDeletingId(id);
    try {
      await axiosInstance.delete(`/addresses/${id}`);
      await refetch({ force: true });
      toast.success("Address deleted successfully");
      if (onAddressChange) onAddressChange();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete address");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetDefault = async (id) => {
    setSettingDefaultId(id);
    try {
      await putData({ url: `/addresses/${id}/default`, data: {} });
      await refetch({ force: true });
      toast.success("Default address updated");
      if (onAddressChange) onAddressChange();
    } catch (err) {
      console.error(err);
      toast.error("Failed to set default address");
    } finally {
      setSettingDefaultId(null);
    }
  };

  if (loading) return <AddressSkeleton />;
  if (error)
    return (
      <div className="text-center py-8">
        <p className="text-red-500 text-sm">Failed to load addresses</p>
        <button
          onClick={() => refetch()}
          className="mt-2 text-sm text-[#7A1C3D] hover:underline"
        >
          Try Again
        </button>
      </div>
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
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border rounded-2xl p-4 sm:p-5 shadow-sm mb-6 space-y-3 overflow-hidden"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7A1C3D]/30"
              />
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7A1C3D]/30"
              />
              <input
                name="address_line1"
                value={form.address_line1}
                onChange={handleChange}
                placeholder="Address Line 1"
                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7A1C3D]/30"
              />
              <input
                name="address_line2"
                value={form.address_line2}
                onChange={handleChange}
                placeholder="Address Line 2 (Optional)"
                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7A1C3D]/30"
              />
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="City"
                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7A1C3D]/30"
              />
              <input
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="State"
                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7A1C3D]/30"
              />
              <input
                name="country"
                value={form.country}
                onChange={handleChange}
                placeholder="Country"
                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7A1C3D]/30"
              />
              <input
                name="postal_code"
                value={form.postal_code}
                onChange={handleChange}
                placeholder="Postal Code"
                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7A1C3D]/30"
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_default"
                  checked={form.is_default}
                  onChange={(e) => setForm({ ...form, is_default: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-[#7A1C3D] focus:ring-[#7A1C3D]"
                />
                <span className="text-sm text-gray-600">Set as default address</span>
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSubmit}
                disabled={adding || updating}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition text-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {(adding || updating) && <Loader2 size={16} className="animate-spin" />}
                {editingId ? (updating ? "Updating..." : "Update Address") : adding ? "Saving..." : "Save Address"}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition text-sm"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LIST - 2x2 Grid */}
      {addresses.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <p className="text-gray-500">No addresses saved yet</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-3 text-sm text-[#7A1C3D] hover:underline"
          >
            Add your first address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <motion.div
              key={addr.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`relative bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md transition ${
                addr.is_default ? "border-[#7A1C3D] ring-1 ring-[#7A1C3D]/20" : "border-gray-200"
              }`}
            >
              {/* DEFAULT BADGE */}
              {addr.is_default && (
                <div className="absolute top-3 right-3 flex items-center gap-1 text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full">
                  <CheckCircle2 size={12} />
                  Default
                </div>
              )}

              <h3 className="font-semibold text-gray-900 pr-16">{addr.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{addr.phone}</p>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                {addr.address_line1}
                {addr.address_line2 && `, ${addr.address_line2}`}
                <br />
                {addr.city}, {addr.state} - {addr.postal_code}
                <br />
                {addr.country}
              </p>

              {/* ACTIONS */}
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-2 border-t border-gray-100">
                <button
                  onClick={() => handleEdit(addr)}
                  className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition"
                  title="Edit"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(addr.id)}
                  disabled={deletingId === addr.id}
                  className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition disabled:opacity-50"
                  title="Delete"
                >
                  {deletingId === addr.id ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                </button>
                {!addr.is_default && (
                  <button
                    onClick={() => handleSetDefault(addr.id)}
                    disabled={settingDefaultId === addr.id}
                    className="flex items-center gap-1 text-xs px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50"
                  >
                    {settingDefaultId === addr.id ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Star size={14} />
                    )}
                    Set Default
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- SKELETON ---------------- */
function AddressSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white border rounded-2xl p-4 h-32">
          <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 w-24 bg-gray-200 rounded mb-3"></div>
          <div className="h-3 w-full bg-gray-200 rounded"></div>
          <div className="h-3 w-3/4 bg-gray-200 rounded mt-1"></div>
        </div>
      ))}
    </div>
  );
}