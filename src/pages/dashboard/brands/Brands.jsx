// src/pages/dashboard/brands/Brands.jsx

import React, {
  useMemo,
  useState,
} from "react";

import useGet from "../../../api/hooks/useGet";
import useDelete from "../../../api/hooks/useDelete";

import BrandPageHeader from "../../../components/dashboard/brands/BrandPageHeader";
import BrandFilters from "../../../components/dashboard/brands/BrandFilters";
import BrandList from "../../../components/dashboard/brands/BrandList";
import BrandSkeleton from "../../../components/dashboard/brands/BrandSkeleton";
import BrandEmptyState from "../../../components/dashboard/brands/BrandEmptyState";

import BrandFormModal from "../../../components/dashboard/brands/BrandFormModal";

import DeleteConfirmModal from "../../../components/dashboard/brands/DeleteConfirmModal";

/* ==========================================================
   FILE: Brands.jsx
   Elite Production Grade
========================================================== */

const Brands = () => {
  /* ========================================================
     API
  ======================================================== */

  const {
    data,
    loading,
    refetch,
  } = useGet(
    "/brands"
  );

  const {
    deleteData,
    loading:
      deleteLoading,
  } = useDelete();

  /* ========================================================
     DATA
  ======================================================== */

  const brands =
    Array.isArray(
      data?.data
    )
      ? data.data
      : data?.data
          ?.data || [];

  /* ========================================================
     STATES
  ======================================================== */

  const [
    search,
    setSearch,
  ] =
    useState("");

  const [
    status,
    setStatus,
  ] =
    useState("");

  const [
    openModal,
    setOpenModal,
  ] =
    useState(false);

  const [
    editData,
    setEditData,
  ] =
    useState(null);

  const [
    deleteModal,
    setDeleteModal,
  ] =
    useState(false);

  const [
    selectedBrand,
    setSelectedBrand,
  ] =
    useState(null);

  /* ========================================================
     FILTERED DATA
  ======================================================== */

  const filteredBrands =
    useMemo(() => {
      return brands.filter(
        (
          brand
        ) => {
          const matchesSearch =
            brand?.name
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||
            brand?.slug
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const matchesStatus =
            !status
              ? true
              : status ===
                "active"
              ? brand?.status
              : !brand?.status;

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      brands,
      search,
      status,
    ]);

  /* ========================================================
     CREATE
  ======================================================== */

  const handleCreate =
    () => {
      setEditData(
        null
      );

      setOpenModal(
        true
      );
    };

  /* ========================================================
     EDIT
  ======================================================== */

  const handleEdit =
    (
      brand
    ) => {
      setEditData(
        brand
      );

      setOpenModal(
        true
      );
    };

  /* ========================================================
     DELETE
  ======================================================== */

  const handleDeleteClick =
    (
      brand
    ) => {
      setSelectedBrand(
        brand
      );

      setDeleteModal(
        true
      );
    };

  /* ========================================================
     CONFIRM DELETE
  ======================================================== */

  const confirmDelete =
    async () => {
      if (
        !selectedBrand
      )
        return;

      try {
        await deleteData(
          {
            url: `/admin/brands/${selectedBrand.id}`,
          }
        );

        setDeleteModal(
          false
        );

        setSelectedBrand(
          null
        );

        refetch?.({
          force: true,
        });
      } catch (
        error
      ) {
        console.error(
          error
        );
      }
    };

  /* ========================================================
     UI
  ======================================================== */

  return (
    <div className="space-y-6 p-6">
      {/* ===================================================
          HEADER
      =================================================== */}

      <BrandPageHeader
        onCreate={
          handleCreate
        }
      />

      {/* ===================================================
          FILTERS
      =================================================== */}

      <BrandFilters
        search={
          search
        }
        status={
          status
        }
        onSearchChange={
          setSearch
        }
        onStatusChange={
          setStatus
        }
        onReset={() => {
          setSearch(
            ""
          );

          setStatus(
            ""
          );
        }}
      />

      {/* ===================================================
          LOADING
      =================================================== */}

      {loading && (
        <BrandSkeleton />
      )}

      {/* ===================================================
          EMPTY
      =================================================== */}

      {!loading &&
        filteredBrands.length ===
          0 && (
          <BrandEmptyState
            onAction={
              handleCreate
            }
          />
        )}

      {/* ===================================================
          LIST
      =================================================== */}

      {!loading &&
        filteredBrands.length >
          0 && (
          <BrandList
            brands={
              filteredBrands
            }
            onEdit={
              handleEdit
            }
            onDelete={
              handleDeleteClick
            }
          />
        )}

      {/* ===================================================
          CREATE / EDIT MODAL
      =================================================== */}

      <BrandFormModal
        open={
          openModal
        }
        onClose={() =>
          setOpenModal(
            false
          )
        }
        editData={
          editData
        }
        refresh={() =>
          refetch?.({
            force: true,
          })
        }
      />

      {/* ===================================================
          DELETE MODAL
      =================================================== */}

      <DeleteConfirmModal
        open={
          deleteModal
        }
        onClose={() =>
          setDeleteModal(
            false
          )
        }
        onConfirm={
          confirmDelete
        }
        loading={
          deleteLoading
        }
        title="Delete Brand"
        message={`Delete "${selectedBrand?.name}" brand?`}
      />
    </div>
  );
};

export default Brands;