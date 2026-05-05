// FILE: src/components/dashboard/attributes/AttributeValues.jsx

import React, {
  memo,
  useMemo,
  useState,
} from "react";
import {
  Plus,
  Tags,
  Search,
} from "lucide-react";

import AttributeValueChip from "./AttributeValueChip";

/* ==========================================================
   ATTRIBUTE VALUES
   Elite Production Grade

   Props:
   attribute = { id, name, values: [] }
   valueInput = ""
   onValueInputChange(text)
   onCreateValue()
   onUpdateValue(valueId, value)
   onDeleteValue(valueId)
   creating = false
   loading = false
========================================================== */

const AttributeValues = ({
  attribute,
  valueInput = "",
  onValueInputChange,
  onCreateValue,
  onUpdateValue,
  onDeleteValue,
  creating = false,
  loading = false,
}) => {
  const [
    search,
    setSearch,
  ] = useState("");

  const values =
    attribute?.values ||
    [];

  const filtered =
    useMemo(() => {
      if (
        !search.trim()
      )
        return values;

      return values.filter(
        (
          item
        ) =>
          item.value
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );
    }, [
      values,
      search,
    ]);

  const canCreate =
    valueInput.trim()
      .length > 0 &&
    !creating;

  const handleSubmit =
    (e) => {
      e.preventDefault();
      if (
        canCreate
      ) {
        onCreateValue?.();
      }
    };

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
      {/* TOP BAR */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Left */}
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-slate-200">
              <Tags
                size={
                  18
                }
                className="text-slate-600"
              />
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900">
                {
                  attribute?.name
                }{" "}
                Values
              </h4>

              <p className="text-xs text-slate-500">
                {
                  values.length
                }{" "}
                total options
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full lg:w-72">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={
              search
            }
            onChange={(
              e
            ) =>
              setSearch(
                e.target
                  .value
              )
            }
            placeholder="Search values..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-[#7a1c3d] focus:ring-4 focus:ring-[#7a1c3d]/10"
          />
        </div>
      </div>

      {/* CREATE */}
      <form
        onSubmit={
          handleSubmit
        }
        className="mt-4 flex flex-col gap-3 sm:flex-row"
      >
        <input
          value={
            valueInput
          }
          onChange={(
            e
          ) =>
            onValueInputChange?.(
              e.target
                .value
            )
          }
          placeholder={`Add new value for ${
            attribute?.name ||
            "attribute"
          }`}
          className="h-11 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-[#7a1c3d] focus:ring-4 focus:ring-[#7a1c3d]/10"
        />

        <button
          type="submit"
          disabled={
            !canCreate
          }
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#7a1c3d] px-5 text-sm font-semibold text-white transition hover:bg-[#651732] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus
            size={
              17
            }
          />

          {creating
            ? "Adding..."
            : "Add Value"}
        </button>
      </form>

      {/* VALUES */}
      <div className="mt-4">
        {filtered.length ===
        0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-8 text-center">
            <p className="text-sm font-medium text-slate-700">
              No values found
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Add a new value or change search.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {filtered.map(
              (
                item
              ) => (
                <AttributeValueChip
                  key={
                    item.id
                  }
                  valueItem={
                    item
                  }
                  attributeName={
                    attribute?.name
                  }
                  loading={
                    loading
                  }
                  onUpdate={
                    onUpdateValue
                  }
                  onDelete={
                    onDeleteValue
                  }
                />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(
  AttributeValues
);