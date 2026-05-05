// FILE: src/pages/dashboard/Banners.jsx

import React, {
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";
import {
  Image as ImageIcon,
  Plus,
} from "lucide-react";

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

/* ==========================================================
   FILE: src/pages/dashboard/Banners.jsx
   Strict Elite Mode
   Production Grade

   APIs:
   GET    /admin/banners?page=1
   DELETE /admin/banners/:id
========================================================== */

const PER_PAGE = 10;

const Banners = () => {
  const [
    page,
    setPage,
  ] = useState(1);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    status,
    setStatus,
  ] = useState("all");

  const [
    layout,
    setLayout,
  ] = useState("all");

  const [
    sortBy,
    setSortBy,
  ] = useState(
    "position_asc"
  );

  const [
    selected,
    setSelected,
  ] = useState(null);

  const [
    openForm,
    setOpenForm,
  ] = useState(false);

  const [
    deleteTarget,
    setDeleteTarget,
  ] = useState(null);

  const {
    data,
    loading,
    refetch,
  } = useGet(
    `/admin/banners?page=${page}`
  );

  const {
    deleteData,
    loading: deleting,
  } = useDelete();

  const banners =
    data?.data?.data ||
    data?.data ||
    data ||
    [];

  const totalItems =
    data?.data?.total ||
    banners.length;

  const totalPages =
    data?.data?.last_page ||
    Math.max(
      1,
      Math.ceil(
        totalItems /
          PER_PAGE
      )
    );

  /* ========================================================
     FILTER + SORT
  ======================================================== */

  const filtered =
    useMemo(() => {
      let list = [
        ...banners,
      ];

      if (
        search.trim()
      ) {
        const q =
          search.toLowerCase();

        list =
          list.filter(
            (
              item
            ) =>
              item.title
                ?.toLowerCase()
                .includes(
                  q
                ) ||
              item.subtitle
                ?.toLowerCase()
                .includes(
                  q
                )
          );
      }

      if (
        status ===
        "active"
      ) {
        list =
          list.filter(
            (
              item
            ) =>
              item.status
          );
      }

      if (
        status ===
        "inactive"
      ) {
        list =
          list.filter(
            (
              item
            ) =>
              !item.status
          );
      }

      if (
        layout !==
        "all"
      ) {
        list =
          list.filter(
            (
              item
            ) =>
              item.layout ===
              layout
          );
      }

      list.sort(
        (
          a,
          b
        ) => {
          if (
            sortBy ===
            "position_asc"
          ) {
            return (
              Number(
                a.position ||
                  0
              ) -
              Number(
                b.position ||
                  0
              )
            );
          }

          if (
            sortBy ===
            "position_desc"
          ) {
            return (
              Number(
                b.position ||
                  0
              ) -
              Number(
                a.position ||
                  0
              )
            );
          }

          if (
            sortBy ===
            "title_asc"
          ) {
            return (
              a.title ||
              ""
            ).localeCompare(
              b.title ||
                ""
            );
          }

          return (
            b.title ||
            ""
          ).localeCompare(
            a.title ||
              ""
          );
        }
      );

      return list;
    }, [
      banners,
      search,
      status,
      layout,
      sortBy,
    ]);

  /* ========================================================
     ACTIONS
  ======================================================== */

  const openCreate =
    () => {
      setSelected(
        null
      );
      setOpenForm(
        true
      );
    };

  const openEdit =
    (
      banner
    ) => {
      setSelected(
        banner
      );
      setOpenForm(
        true
      );
    };

  const closeForm =
    () => {
      setSelected(
        null
      );
      setOpenForm(
        false
      );
    };

  const handleSaved =
    async () => {
      closeForm();
      await refetch();
    };

  const handleDelete =
    (
      banner
    ) => {
      setDeleteTarget(
        banner
      );
    };

  const confirmDelete =
    async (
      id
    ) => {
      try {
        await deleteData(
          {
            url: `/admin/banners/${id}`,
          }
        );

        toast.success(
          "Banner deleted"
        );

        setDeleteTarget(
          null
        );

        await refetch();
      } catch {
        toast.error(
          "Failed to delete banner"
        );
      }
    };

  const resetFilters =
    () => {
      setSearch("");
      setStatus(
        "all"
      );
      setLayout(
        "all"
      );
      setSortBy(
        "position_asc"
      );
    };

  /* ========================================================
     UI
  ======================================================== */

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <section className="rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
              <ImageIcon
                size={24}
                className="text-[#7a1c3d]"
              />
              Banners
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage promotions and homepage banners.
            </p>
          </div>

          <button
            type="button"
            onClick={
              openCreate
            }
            className="inline-flex items-center gap-2 rounded-2xl bg-[#7a1c3d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#651732]"
          >
            <Plus
              size={18}
            />
            Create Banner
          </button>
        </div>
      </section>

      {/* STATS */}
      <BannerStats
        banners={
          banners
        }
        filteredCount={
          filtered.length
        }
      />

      {/* FILTERS */}
      <BannerFilters
        banners={
          banners
        }
        search={
          search
        }
        status={
          status
        }
        layout={
          layout
        }
        sortBy={
          sortBy
        }
        onSearchChange={
          setSearch
        }
        onStatusChange={
          setStatus
        }
        onLayoutChange={
          setLayout
        }
        onSortChange={
          setSortBy
        }
        onReset={
          resetFilters
        }
      />

      {/* DATA */}
      {loading ? (
        <BannerSkeleton
          count={4}
        />
      ) : !filtered.length ? (
        <BannerEmptyState
          onCreate={
            openCreate
          }
        />
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden xl:block">
            <BannerTable
              banners={
                filtered
              }
              onEdit={
                openEdit
              }
              onDelete={(
                id
              ) =>
                handleDelete(
                  filtered.find(
                    (
                      item
                    ) =>
                      item.id ===
                      id
                  )
                )
              }
            />
          </div>

          {/* Mobile / Tablet */}
          <div className="grid grid-cols-1 gap-5 xl:hidden md:grid-cols-2">
            {filtered.map(
              (
                banner
              ) => (
                <BannerMobileCard
                  key={
                    banner.id
                  }
                  banner={
                    banner
                  }
                  onEdit={
                    openEdit
                  }
                  onDelete={() =>
                    handleDelete(
                      banner
                    )
                  }
                />
              )
            )}
          </div>

          {/* PAGINATION */}
          <BannerPagination
            page={
              page
            }
            totalPages={
              totalPages
            }
            totalItems={
              totalItems
            }
            perPage={
              PER_PAGE
            }
            onPageChange={
              setPage
            }
          />
        </>
      )}

      {/* FORM MODAL */}
      <BannerFormModal
        open={
          openForm
        }
        editData={
          selected
        }
        onClose={
          closeForm
        }
        onSuccess={
          handleSaved
        }
      />

      {/* DELETE MODAL */}
      <BannerDeleteModal
        open={
          !!deleteTarget
        }
        banner={
          deleteTarget
        }
        loading={
          deleting
        }
        onClose={() =>
          setDeleteTarget(
            null
          )
        }
        onConfirm={
          confirmDelete
        }
      />
    </div>
  );
};

export default Banners;