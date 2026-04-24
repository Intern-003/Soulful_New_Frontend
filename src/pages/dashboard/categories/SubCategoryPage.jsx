import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Layers3,
  Plus,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import useGet from "../../../api/hooks/useGet";
import useDelete from "../../../api/hooks/useDelete";

import CategoryStats from "../../../components/dashboard/categories/CategoryStats";
import CategoryFilters from "../../../components/dashboard/categories/CategoryFilters";
import CategoryFormModal from "../../../components/dashboard/categories/CategoryFormModal";

import SubCategoryCard from "../../../components/dashboard/categories/SubCategoryCard";
import SubCategoryTable from "../../../components/dashboard/categories/SubCategoryTable";

/* ==========================================================
   FILE NAME: SubCategoryPage.jsx

   SUBCATEGORY PAGE
   Elite Production Grade

   APIs:
   GET    /categories/:id
   POST   /admin/subcategories
   PUT    /admin/subcategories/:id
   DELETE /admin/subcategories/:id
========================================================== */

const SubCategoryPage = () => {
  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const {
    data,
    loading,
    refetch,
  } = useGet(
    `/categories/${id}`
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

  const category =
    data?.data ||
    {};

  const items =
    category?.children ||
    [];

  /* ==========================================
     FILTERED
  ========================================== */
  const filtered =
    useMemo(() => {
      let result = [
        ...items,
      ];

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

      if (
        sortBy ===
        "az"
      ) {
        result.sort(
          (
            a,
            b
          ) =>
            a.name.localeCompare(
              b.name
            )
        );
      }

      if (
        sortBy ===
        "za"
      ) {
        result.sort(
          (
            a,
            b
          ) =>
            b.name.localeCompare(
              a.name
            )
        );
      }

      if (
        sortBy ===
        "oldest"
      ) {
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
      }

      if (
        sortBy ===
        "latest"
      ) {
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
      items,
      search,
      selectedStatus,
      sortBy,
    ]);

  /* ==========================================
     ACTIONS
  ========================================== */
  const openCreate =
    () => {
      setSelected(
        {
          parent_id:
            id,
        }
      );

      setOpenModal(
        true
      );
    };

  const openEdit =
    (item) => {
      setSelected(
        item
      );

      setOpenModal(
        true
      );
    };

  const handleDelete =
    async (
      item
    ) => {
      const ok =
        window.confirm(
          `Delete "${item.name}" subcategory?`
        );

      if (!ok)
        return;

      try {
        await deleteData(
          {
            url: `/admin/subcategories/${item.id}`,
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

  const openProducts =
    (item) => {
      navigate(
        `/dashboard/subcategories/${item.id}/products`
      );
    };

  const resetFilters =
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

  const exportCSV =
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
        "subcategories.csv";
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
            <button
              onClick={() =>
                navigate(
                  -1
                )
              }
              className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-[#7b183f]"
            >
              <ArrowLeft
                size={
                  16
                }
              />
              Back
            </button>

            <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
              <Layers3
                size={
                  24
                }
                className="text-[#7b183f]"
              />
              {category?.name ||
                "Subcategories"}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage subcategories and products under this category.
            </p>
          </div>

          <button
            onClick={
              openCreate
            }
            className="inline-flex items-center gap-2 rounded-2xl bg-[#7b183f] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
          >
            <Plus
              size={
                18
              }
            />
            Add Subcategory
          </button>
        </div>
      </div>

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
          items
        }
        onReset={
          resetFilters
        }
        onExport={
          exportCSV
        }
      />

      {/* DESKTOP */}
      <div className="hidden lg:block">
        <SubCategoryTable
          items={
            filtered
          }
          loading={
            loading
          }
          onClick={
            openProducts
          }
          onEdit={
            openEdit
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
              length: 4,
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
                <SubCategoryCard
                  key={
                    item.id
                  }
                  item={
                    item
                  }
                  onClick={
                    openProducts
                  }
                  onEdit={
                    openEdit
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

export default SubCategoryPage;