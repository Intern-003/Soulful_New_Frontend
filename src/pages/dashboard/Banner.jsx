// FILE: src/pages/dashboard/Banners.jsx

import React, { useMemo, useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { Image as ImageIcon, Plus } from "lucide-react";

import useGet from "../../api/hooks/useGet";
import useDelete from "../../api/hooks/useDelete";

import BannerStats from "../../components/dashboard/banners/BannerStats";
import BannerFilters from "../../components/dashboard/banners/BannerFilters";
import BannerTable from "../../components/dashboard/banners/BannerTable";
import BannerMobileCard from "../../components/dashboard/banners/BannerMobileCard";
import BannerEmptyState from "../../components/dashboard/banners/BannerEmptyState";
import BannerSkeleton from "../../components/dashboard/banners/BannerSkeleton";
import BannerPagination from "../../components/dashboard/banners/BannerPagination";
import BannerDeleteModal from "../../components/dashboard/banners/BannerDeleteModal";
import BannerFormModal from "../../components/dashboard/banners/BannerFormModal";

const PER_PAGE = 10;

const Banners = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [layout, setLayout] = useState("all");
  const [sortBy, setSortBy] = useState("position_asc");
  const [selected, setSelected] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [optimisticBanners, setOptimisticBanners] = useState(null);

  // Build URL with all filter params (server-side filtering)
  const apiUrl = useMemo(() => {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("per_page", PER_PAGE);
    if (search) params.append("search", search);
    if (status !== "all") params.append("status", status);
    if (layout !== "all") params.append("layout", layout);
    if (sortBy) params.append("sort_by", sortBy);
    return `/admin/banners?${params.toString()}`;
  }, [page, search, status, layout, sortBy]);

  const { data, loading, refetch } = useGet(apiUrl);
  const { deleteData, loading: deleting } = useDelete();

  // Use optimistic banners if available, otherwise use fetched data
  const banners = optimisticBanners !== null ? optimisticBanners : (data?.data || []);
  const totalItems = data?.total || banners.length;
  const totalPages = data?.last_page || 1;

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [search, status, layout, sortBy]);

  const openCreate = useCallback(() => {
    setSelected(null);
    setOpenForm(true);
  }, []);

  const openEdit = useCallback((banner) => {
    setSelected(banner);
    setOpenForm(true);
  }, []);

  const closeForm = useCallback(() => {
    setSelected(null);
    setOpenForm(false);
  }, []);

  const handleSaved = useCallback(async () => {
    closeForm();
    setOptimisticBanners(null);
    await refetch({ force: true });
  }, [closeForm, refetch]);

  const handleDelete = useCallback((banner) => {
    setDeleteTarget(banner);
  }, []);

  // Optimistic delete update with force refetch
  const confirmDelete = useCallback(
    async (id) => {
      // Optimistic update - remove banner immediately
      setOptimisticBanners((prev) => {
        const currentBanners = prev !== null ? prev : banners;
        return currentBanners.filter((b) => b.id !== id);
      });
      
      setDeleteTarget(null);
      
      try {
        await deleteData({ url: `/admin/banners/${id}` });
        toast.success("Banner deleted");
        await refetch({ force: true });
        setOptimisticBanners(null);
      } catch (error) {
        // Rollback on error
        toast.error(error?.response?.data?.message || "Failed to delete banner");
        await refetch({ force: true });
        setOptimisticBanners(null);
      }
    },
    [deleteData, refetch, banners]
  );

  const resetFilters = useCallback(() => {
    setSearch("");
    setStatus("all");
    setLayout("all");
    setSortBy("position_asc");
    setPage(1);
  }, []);

  // Loading states for filters
  const isFiltering = loading && !banners.length;

  if (isFiltering) {
    return <BannerSkeleton count={4} />;
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <section className="rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
              <ImageIcon size={24} className="text-[#7a1c3d]" />
              Banners
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage promotions and homepage banners.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#7a1c3d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#651732]"
          >
            <Plus size={18} />
            Create Banner
          </button>
        </div>
      </section>

      {/* STATS */}
      <BannerStats banners={banners} filteredCount={banners.length} />

      {/* FILTERS with loading state */}
      <BannerFilters
        banners={banners}
        search={search}
        status={status}
        layout={layout}
        sortBy={sortBy}
        loading={loading}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onLayoutChange={setLayout}
        onSortChange={setSortBy}
        onReset={resetFilters}
      />

      {/* DATA DISPLAY */}
      {loading && !optimisticBanners ? (
        <BannerSkeleton count={4} />
      ) : !banners.length ? (
        <BannerEmptyState onCreate={openCreate} />
      ) : (
        <>
          <div className="hidden xl:block">
            <BannerTable
              banners={banners}
              loading={loading}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 xl:hidden md:grid-cols-2">
            {banners.map((banner) => (
              <BannerMobileCard
                key={banner.id}
                banner={banner}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          <BannerPagination
            page={page}
            totalPages={totalPages}
            totalItems={totalItems}
            perPage={PER_PAGE}
            onPageChange={setPage}
          />
        </>
      )}

      {/* MODALS */}
      <BannerFormModal
        open={openForm}
        editData={selected}
        onClose={closeForm}
        onSuccess={handleSaved}
      />

      <BannerDeleteModal
        open={!!deleteTarget}
        banner={deleteTarget}
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default Banners;