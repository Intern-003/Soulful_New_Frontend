import { useState } from "react";
import useGet from "../../api/hooks/useGet";
import usePut from "../../api/hooks/usePut";

import VendorTable from "../../components/dashboard/vendors/VendorTable";
import VendorKYCModal from "../../components/dashboard/vendors/VendorKYCModal";

const Vendors = () => {
  // 🔹 FETCH VENDORS
  const { data, loading, refetch } = useGet("/admin/vendors");

  // 🔹 PUT HOOK
  const { putData } = usePut();

  // 🔹 STATE
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const vendors = data?.data || [];

  // ✅ APPROVE VENDOR
  const handleApprove = async (id) => {
    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      await putData({
        url: `/admin/vendors/${id}/approve`,
      });

      setSuccess("Vendor approved successfully");
      refetch({ force: true });
    } catch (err) {
      console.error(err);
      setError("Failed to approve vendor");
    } finally {
      setActionLoading(false);
    }
  };

  // ❌ REJECT VENDOR
  const handleReject = async (id) => {
    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      await putData({
        url: `/admin/vendors/${id}/reject`,
      });

      setSuccess("Vendor rejected successfully");
      refetch({ force: true });
    } catch (err) {
      console.error(err);
      setError("Failed to reject vendor");
    } finally {
      setActionLoading(false);
    }
  };

  // 🔹 CLOSE MODAL + REFRESH (important for KYC updates)
  const handleCloseModal = () => {
    setSelectedVendor(null);
    refetch({ force: true });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Vendor Management</h2>

      {/* ❌ ERROR */}
      {error && <p style={styles.error}>{error}</p>}

      {/* ✅ SUCCESS */}
      {success && <p style={styles.success}>{success}</p>}

      {/* 🔹 TABLE */}
      <VendorTable
        vendors={vendors}
        loading={loading}
        actionLoading={actionLoading}
        onApprove={handleApprove}
        onReject={handleReject}
        onViewKYC={setSelectedVendor}
      />

      {/* 🔹 KYC MODAL */}
      {selectedVendor && (
        <VendorKYCModal
          vendor={selectedVendor}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

// 🎨 STYLES
const styles = {
  container: {
    padding: "20px",
  },
  title: {
    marginBottom: "15px",
  },
  error: {
    color: "red",
    marginBottom: "10px",
  },
  success: {
    color: "green",
    marginBottom: "10px",
  },
};

export default Vendors;