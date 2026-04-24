import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FolderTree,
  Plus,
} from "lucide-react";

import useGet from "../../../api/hooks/useGet";
import useDelete from "../../../api/hooks/useDelete";

import CategoryStats from "../../../components/dashboard/categories/CategoryStats";
import CategoryFilters from "../../../components/dashboard/categories/CategoryFilters";
import CategoryTable from "../../../components/dashboard/categories/CategoryTable";
import CategoryMobileCard from "../../../components/dashboard/categories/CategoryMobileCard";
import CategoryFormModal from "../../../components/dashboard/categories/CategoryFormModal";

/* ==========================================================
   FILE NAME: Categories.jsx

   FINAL ELITE PRODUCTION GRADE

   APIs:
   GET    /categories
   POST   /admin/categories
   PUT    /admin/categories/:id
   DELETE /admin/categories/:id
========================================================== */

const Categories = () => {
  const navigate =
    useNavigate();

  const {
    data,
    loading,
    refetch,
  } = useGet(
    "/categories"
  );

  const {
    deleteData,
  } = useDelete();

  /* ==========================================
     STATE
  ========================================== */
  const [
    openModal,
    setOpenModal,
  ] = useState(
    false
  );

  const [
    selected,
    setSelected,
  ] = useState(
    null
  );

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    selectedStatus,
    setSelectedStatus,
  ] = useState("");

  const [
    sortBy,
    setSortBy,
  ] = useState(
    "latest"
  );

  /* ==========================================
     SAFE DATA
  ========================================== */
  const categories =
    data?.data ||
    data ||
    [];

  /* ==========================================
     FILTER + SORT
  ========================================== */
  const filtered =
    useMemo(() => {
      let result = [
        ...categories,
      ];

      /* SEARCH */
      if (
        search.trim()
      ) {
        result =
          result.filter(
            (
              item
            ) =>
              item.name
                ?.toLowerCase()
                .includes(
                  search.toLowerCase()
                )
          );
      }

      /* STATUS */
      if (
        selectedStatus ===
        "active"
      ) {
        result =
          result.filter(
            (
              item
            ) =>
              item.status ===
                true ||
              item.status ===
                1 ||
              item.status ===
                "1"
          );
      }

      if (
        selectedStatus ===
        "inactive"
      ) {
        result =
          result.filter(
            (
              item
            ) =>
              !(
                item.status ===
                  true ||
                item.status ===
                  1 ||
                item.status ===
                  "1"
              )
          );
      }

      /* SORT */
      switch (
        sortBy
      ) {
        case "az":
          result.sort(
            (
              a,
              b
            ) =>
              a.name.localeCompare(
                b.name
              )
          );
          break;

        case "za":
          result.sort(
            (
              a,
              b
            ) =>
              b.name.localeCompare(
                a.name
              )
          );
          break;

        case "oldest":
          result.sort(
            (
              a,
              b
            ) =>
              new Date(
                a.created_at
              ) -
              new Date(
                b.created_at
              )
          );
          break;

        default:
          result.sort(
            (
              a,
              b
            ) =>
              new Date(
                b.created_at
              ) -
              new Date(
                a.created_at
              )
          );
      }

      return result;
    }, [
      categories,
      search,
      selectedStatus,
      sortBy,
    ]);

  /* ==========================================
     ACTIONS
  ========================================== */

  const handleCreate =
    () => {
      setSelected(
        null
      );
      setOpenModal(
        true
      );
    };

  const handleEdit =
    (item) => {
      setSelected(
        item
      );
      setOpenModal(
        true
      );
    };

  const handleOpen =
    (item) => {
      navigate(
        `/dashboard/categories/${item.id}`
      );
    };

  const handleDelete =
    async (
      item
    ) => {
      const ok =
        window.confirm(
          `Delete "${item.name}" category?`
        );

      if (!ok)
        return;

      try {
        await deleteData(
          {
            url: `/admin/categories/${item.id}`,
          }
        );

        refetch();
      } catch (
        error
      ) {
        console.error(
          error
        );
      }
    };

  const handleReset =
    () => {
      setSearch(
        ""
      );
      setSelectedStatus(
        ""
      );
      setSortBy(
        "latest"
      );
    };

  const handleExport =
    () => {
      if (
        filtered.length ===
        0
      )
        return;

      const rows =
        filtered.map(
          (
            item
          ) => ({
            Name: item.name,
            Status:
              item.status
                ? "Active"
                : "Inactive",
            Subcategories:
              item
                ?.children
                ?.length ||
              0,
            Products:
              item.products_count ||
              0,
          })
        );

      const csv =
        [
          Object.keys(
            rows[0]
          ).join(
            ","
          ),
          ...rows.map(
            (
              row
            ) =>
              Object.values(
                row
              ).join(
                ","
              )
          ),
        ].join(
          "\n"
        );

      const blob =
        new Blob(
          [csv],
          {
            type: "text/csv",
          }
        );

      const url =
        URL.createObjectURL(
          blob
        );

      const link =
        document.createElement(
          "a"
        );

      link.href =
        url;
      link.download =
        "categories.csv";
      link.click();

      URL.revokeObjectURL(
        url
      );
    };

  /* ==========================================
     UI
  ========================================== */
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
              <FolderTree
                size={24}
                className="text-[#7b183f]"
              />
              Categories
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage categories and organize product hierarchy.
            </p>
          </div>

          <button
            onClick={
              handleCreate
            }
            className="inline-flex items-center gap-2 rounded-2xl bg-[#7b183f] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
          >
            <Plus
              size={18}
            />
            Add Category
          </button>
        </div>
      </div>

      {/* STATS */}
      <CategoryStats
        categories={
          categories
        }
      />

      {/* FILTERS */}
      <CategoryFilters
        search={
          search
        }
        setSearch={
          setSearch
        }
        sortBy={
          sortBy
        }
        setSortBy={
          setSortBy
        }
        selectedStatus={
          selectedStatus
        }
        setSelectedStatus={
          setSelectedStatus
        }
        categories={
          categories
        }
        onReset={
          handleReset
        }
        onExport={
          handleExport
        }
      />

      {/* DESKTOP */}
      <div className="hidden lg:block">
        <CategoryTable
          categories={
            filtered
          }
          loading={
            loading
          }
          onClick={
            handleOpen
          }
          onEdit={
            handleEdit
          }
          onDelete={
            handleDelete
          }
        />
      </div>

      {/* MOBILE */}
      <div className="grid gap-4 lg:hidden">
        {loading
          ? Array.from({
              length: 6,
            }).map(
              (
                _,
                i
              ) => (
                <div
                  key={
                    i
                  }
                  className="h-64 animate-pulse rounded-3xl bg-slate-200"
                />
              )
            )
          : filtered.map(
              (
                item
              ) => (
                <CategoryMobileCard
                  key={
                    item.id
                  }
                  item={
                    item
                  }
                  onClick={
                    handleOpen
                  }
                  onEdit={
                    handleEdit
                  }
                  onDelete={
                    handleDelete
                  }
                />
              )
            )}
      </div>

      {/* MODAL */}
      <CategoryFormModal
        open={
          openModal
        }
        data={
          selected
        }
        onClose={() =>
          setOpenModal(
            false
          )
        }
        onSuccess={
          refetch
        }
      />
    </div>
  );
};

export default Categories;