import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Layers3, Plus } from "lucide-react";

import useGet from "../../api/hooks/useGet";
import usePost from "../../api/hooks/usePost";
import usePut from "../../api/hooks/usePut";
import useDelete from "../../api/hooks/useDelete";

import AttributeStats from "../../components/dashboard/attributes/AttributeStats";
import AttributeFilters from "../../components/dashboard/attributes/AttributeFilters";
import AttributeTable from "../../components/dashboard/attributes/AttributeTable";
import AttributeFormModal from "../../components/dashboard/attributes/AttributeFormModal";
/* ==========================================================
   FILE NAME: Attributes.jsx

   FINAL ELITE PRODUCTION GRADE

   APIs:
   GET    /admin/attributes-with-values
   POST   /admin/attributes
   PUT    /admin/attributes/:id
   DELETE /admin/attributes/:id

   POST   /admin/attributes/:id/values
   PUT    /admin/attribute-values/:id
   DELETE /admin/attribute-values/:id
========================================================== */

const Attributes = () => {
  const {
    data,
    loading,
    refetch,
  } = useGet(
    "/admin/attributes-with-values"
  );

  const {
    postData,
    loading: postLoading,
  } = usePost();

  const {
    putData,
    loading: putLoading,
  } = usePut();

  const {
    deleteData,
    loading: deleteLoading,
  } = useDelete();

  /* ==========================================
     STATE
  ========================================== */
  const [
    search,
    setSearch,
  ] = useState("");

  const [
    quickCreate,
    setQuickCreate,
  ] = useState("");

  const [
    modalOpen,
    setModalOpen,
  ] = useState(
    false
  );

  const [
    modalMode,
    setModalMode,
  ] = useState(
    "create"
  );

  const [
    selected,
    setSelected,
  ] = useState(
    null
  );

  const [
    valueInputs,
    setValueInputs,
  ] = useState(
    {}
  );

  const attributes =
    data?.data ||
    data ||
    [];

  /* ==========================================
     FILTERED
  ========================================== */
  const filtered =
    useMemo(() => {
      if (
        !search.trim()
      )
        return attributes;

      return attributes.filter(
        (
          item
        ) =>
          item.name
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );
    }, [
      attributes,
      search,
    ]);

  /* ==========================================
     QUICK CREATE
  ========================================== */
  const createQuick =
    async () => {
      try {
        await postData(
          {
            url: "/admin/attributes",
            data: {
              name: quickCreate.trim(),
            },
          }
        );

        toast.success(
          "Attribute created"
        );

        setQuickCreate(
          ""
        );

        refetch();
      } catch (
        error
      ) {
        toast.error(
          "Failed to create attribute"
        );
      }
    };

  /* ==========================================
     MODAL CREATE / EDIT
  ========================================== */
  const openCreate =
    () => {
      setModalMode(
        "create"
      );
      setSelected(
        null
      );
      setModalOpen(
        true
      );
    };

  const openEdit =
    (
      id,
      name
    ) => {
      setModalMode(
        "edit"
      );
      setSelected(
        {
          id,
          name,
        }
      );
      setModalOpen(
        true
      );
    };

  const submitModal =
    async (
      payload
    ) => {
      try {
        if (
          modalMode ===
          "create"
        ) {
          await postData(
            {
              url: "/admin/attributes",
              data: {
                name: payload.name,
              },
            }
          );

          toast.success(
            "Attribute created"
          );
        } else {
          await putData(
            {
              url: `/admin/attributes/${payload.id}`,
              data: {
                name: payload.name,
              },
            }
          );

          toast.success(
            "Attribute updated"
          );
        }

        setModalOpen(
          false
        );
        refetch();
      } catch (
        error
      ) {
        toast.error(
          "Operation failed"
        );
      }
    };

  /* ==========================================
     DELETE ATTRIBUTE
  ========================================== */
  const deleteAttribute =
    async (
      id
    ) => {
      const ok =
        window.confirm(
          "Delete this attribute?"
        );

      if (!ok)
        return;

      try {
        await deleteData(
          {
            url: `/admin/attributes/${id}`,
          }
        );

        toast.success(
          "Attribute deleted"
        );

        refetch();
      } catch (
        error
      ) {
        toast.error(
          "Delete failed"
        );
      }
    };

  /* ==========================================
     VALUE INPUT
  ========================================== */
  const handleValueInput =
    (
      attrId,
      value
    ) => {
      setValueInputs(
        (
          prev
        ) => ({
          ...prev,
          [attrId]:
            value,
        })
      );
    };

  /* ==========================================
     CREATE VALUE
  ========================================== */
  const createValue =
    async (
      attrId
    ) => {
      const value =
        valueInputs[
          attrId
        ]?.trim();

      if (!value)
        return;

      try {
        await postData(
          {
            url: `/admin/attributes/${attrId}/values`,
            data: {
              value,
            },
          }
        );

        toast.success(
          "Value added"
        );

        setValueInputs(
          (
            prev
          ) => ({
            ...prev,
            [attrId]:
              "",
          })
        );

        refetch();
      } catch (
        error
      ) {
        toast.error(
          "Failed to add value"
        );
      }
    };

  /* ==========================================
     UPDATE VALUE
  ========================================== */
  const updateValue =
    async (
      valueId,
      value
    ) => {
      try {
        await putData(
          {
            url: `/admin/attribute-values/${valueId}`,
            data: {
              value,
            },
          }
        );

        toast.success(
          "Value updated"
        );

        refetch();
      } catch (
        error
      ) {
        toast.error(
          "Update failed"
        );
      }
    };

  /* ==========================================
     DELETE VALUE
  ========================================== */
  const deleteValue =
    async (
      valueId
    ) => {
      try {
        await deleteData(
          {
            url: `/admin/attribute-values/${valueId}`,
          }
        );

        toast.success(
          "Value deleted"
        );

        refetch();
      } catch (
        error
      ) {
        toast.error(
          "Delete failed"
        );
      }
    };

  /* ==========================================
     UI
  ========================================== */
  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
              <Layers3
                size={24}
                className="text-[#7a1c3d]"
              />
              Attributes
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage product attributes and selectable values.
            </p>
          </div>

          <button
            onClick={
              openCreate
            }
            className="inline-flex items-center gap-2 rounded-2xl bg-[#7a1c3d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#651732]"
          >
            <Plus
              size={18}
            />
            New Attribute
          </button>
        </div>
      </div>

      {/* STATS */}
      <AttributeStats
        attributes={
          attributes
        }
        filteredCount={
          filtered.length
        }
        search={
          search
        }
      />

      {/* FILTERS */}
      <AttributeFilters
        search={
          search
        }
        onSearchChange={
          setSearch
        }
        newAttribute={
          quickCreate
        }
        onNewAttributeChange={
          setQuickCreate
        }
        onCreate={
          createQuick
        }
        creating={
          postLoading
        }
        total={
          attributes.length
        }
      />

      {/* TABLE */}
      <AttributeTable
        attributes={
          filtered
        }
        valueInputs={
          valueInputs
        }
        loading={
          loading
        }
        onValueInputChange={
          handleValueInput
        }
        onCreateValue={
          createValue
        }
        onUpdateAttribute={
          openEdit
        }
        onDeleteAttribute={
          deleteAttribute
        }
        onUpdateValue={
          updateValue
        }
        onDeleteValue={
          deleteValue
        }
      />

      {/* MODAL */}
      <AttributeFormModal
        open={
          modalOpen
        }
        mode={
          modalMode
        }
        data={
          selected
        }
        loading={
          postLoading ||
          putLoading ||
          deleteLoading
        }
        onClose={() =>
          setModalOpen(
            false
          )
        }
        onSubmit={
          submitModal
        }
      />
    </div>
  );
};

export default Attributes;