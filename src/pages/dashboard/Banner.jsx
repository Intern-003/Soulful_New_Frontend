import { useState, useCallback, useMemo } from "react";
import useGet from "../../api/hooks/useGet";
import useDelete from "../../api/hooks/useDelete";
import { BANNER } from "../../api/endpoints";
import BannerList from "../../components/dashboard/banners/BannerList";
import BannerForm from "../../components/dashboard/banners/BannerForm";

const Banner = () => {
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const { data, loading, refetch } = useGet(BANNER.LIST);
  const { deleteData } = useDelete();

  const banners = useMemo(() => data?.data || [], [data]);

  const handleDelete = useCallback(async (id) => {
    try {
      await deleteData({ url: BANNER.DELETE(id) });
      await refetch({ force: true });
    } catch (err) {
      console.error(err);
      alert("Failed to delete banner");
    }
  }, [deleteData, refetch]);

  const handleEdit = useCallback((banner) => {
    setSelectedBanner(banner);
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setSelectedBanner(null);
  }, []);

  const handleSuccess = useCallback(async () => {
    await refetch({ force: true });
    handleClose();
  }, [refetch, handleClose]);

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-3 mb-4 md:mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              Banners
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
              Manage your promotional banners
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedBanner(null);
              setIsOpen(true);
            }}
            className="w-full xs:w-auto bg-black text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg hover:bg-gray-800 transition-colors text-sm sm:text-base font-medium shadow-sm"
          >
            + Create Banner
          </button>
        </div>

        {/* Banner List */}
        <BannerList
          banners={banners}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Modal */}
        {isOpen && (
          <BannerForm
            editData={selectedBanner}
            onClose={handleClose}
            onSuccess={handleSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default Banner;