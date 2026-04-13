import { useState } from "react";
import useGet from "../../api/hooks/useGet";
import usePost from "../../api/hooks/usePost";
import usePut from "../../api/hooks/usePut";
import useDelete from "../../api/hooks/useDelete";
import { BANNER } from "../../api/endpoints";

import BannerList from "../../components/dashboard/banners/BannerList";
import BannerForm from "../../components/dashboard/banners/BannerForm";

const Banner = () => {
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const { data, loading, refetch } = useGet(BANNER.LIST);

  const { postData } = usePost();
  const { putData } = usePut();
  const { deleteData } = useDelete();

  const banners = data?.data || [];

  // ------------------------
  // CREATE / UPDATE
  // ------------------------
  const handleSubmit = async (formData) => {
    try {
      if (selectedBanner) {
        await putData({
          url: BANNER.UPDATE(selectedBanner.id),
          data: formData,
        });
      } else {
        await postData({
          url: BANNER.CREATE,
          data: formData,
        });
      }

      setIsOpen(false);
      setSelectedBanner(null);
      refetch({ force: true });
    } catch (err) {
      console.error(err);
    }
  };

  // ------------------------
  // DELETE
  // ------------------------
  const handleDelete = async (id) => {
    try {
      await deleteData({ url: BANNER.DELETE(id) });
      refetch({ force: true });
    } catch (err) {
      console.error(err);
    }
  };

  // ------------------------
  // EDIT
  // ------------------------
  const handleEdit = (banner) => {
    setSelectedBanner(banner);
    setIsOpen(true);
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Banners</h1>
        <button
          onClick={() => {
            setSelectedBanner(null);
            setIsOpen(true);
          }}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Create Banner
        </button>
      </div>

      {/* LIST */}
      <BannerList
        banners={banners}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* FORM MODAL */}
      {isOpen && (
        <BannerForm
          initialData={selectedBanner}
          onSubmit={handleSubmit}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default Banner; 