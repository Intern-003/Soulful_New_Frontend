// ===============================
// ✅ BrandsPage.jsx (FINAL)
// ===============================
import { useState } from "react";
import BrandList from "../../components/dashboard/brands/BrandList";
import BrandFormModal from "../../components/dashboard/brands/BrandFormModal";
import DeleteConfirmModal from "../../components/dashboard/brands/DeleteConfirmModal";

import useGet from "../../api/hooks/useGet";
import useDelete from "../../api/hooks/useDelete";

const Brands = () => {
  const { data, loading, refetch } = useGet("/brands");
  const { deleteData, loading: deleteLoading } = useDelete();

  const brands = data?.data || [];

  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);

  // ================= CREATE =================
  const handleCreate = () => {
    setEditData(null);
    setOpenModal(true);
  };

  // ================= EDIT =================
  const handleEdit = (brand) => {
    setEditData(brand);
    setOpenModal(true);
  };

  // ================= DELETE CLICK =================
  const handleDeleteClick = (brand) => {
    setSelectedBrand(brand);
    setDeleteModal(true);
  };

  // ================= CONFIRM DELETE =================
  const confirmDelete = async () => {
    if (!selectedBrand) return;

    try {
      await deleteData({
        url: `/admin/brands/${selectedBrand.id}`,
      });

      setDeleteModal(false);
      setSelectedBrand(null);
      refetch({ force: true });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Brands</h2>
        <button onClick={handleCreate}>+ Add Brand</button>
      </div>

      <BrandList
        brands={brands}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      <BrandFormModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        editData={editData}
        refresh={() => refetch({ force: true })}
      />

      <DeleteConfirmModal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={confirmDelete}
        loading={deleteLoading}
        title="Delete Brand"
        message={`Delete "${selectedBrand?.name}"?`}
      />
    </div>
  );
};

export default Brands;

