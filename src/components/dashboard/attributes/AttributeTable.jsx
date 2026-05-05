// FILE: src/components/dashboard/attributes/AttributeTable.jsx

import React, { memo } from "react";
import {
  Layers3,
  Sparkles,
} from "lucide-react";

import AttributeRow from "./AttributeRow";

/* ==========================================================
   ATTRIBUTE TABLE
   Elite Production Grade

   Props:
   attributes = []
   valueInputs = {}

   loading = false

   onValueInputChange(attrId, value)
   onCreateValue(attrId)

   onUpdateAttribute(attrId, name)
   onDeleteAttribute(attrId)

   onUpdateValue(valueId, value)
   onDeleteValue(valueId, attrId)
========================================================== */

const SkeletonCard = () => (
  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-2xl bg-slate-200" />
        <div className="flex-1">
          <div className="h-4 w-40 rounded bg-slate-200" />
          <div className="mt-2 h-3 w-24 rounded bg-slate-100" />
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <div className="h-10 rounded-xl bg-slate-100" />
        <div className="h-10 rounded-xl bg-slate-100" />
        <div className="h-10 rounded-xl bg-slate-100" />
      </div>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-violet-100">
      <Layers3
        size={28}
        className="text-slate-800"
      />
    </div>

    <h3 className="mt-5 text-xl font-semibold text-slate-900">
      No Attributes Found
    </h3>

    <p className="mt-2 text-sm text-slate-500">
      Create your first attribute like Size, Color, Material or Storage.
    </p>
  </div>
);

const AttributeTable = ({
  attributes = [],
  valueInputs = {},
  loading = false,

  onValueInputChange,
  onCreateValue,

  onUpdateAttribute,
  onDeleteAttribute,

  onUpdateValue,
  onDeleteValue,
}) => {
  if (loading) {
    return (
      <section className="space-y-4">
        {Array.from({
          length: 4,
        }).map((_, i) => (
          <SkeletonCard
            key={i}
          />
        ))}
      </section>
    );
  }

  if (
    !attributes ||
    attributes.length ===
      0
  ) {
    return <EmptyState />;
  }

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              <Sparkles
                size={18}
                className="text-violet-600"
              />
              Attribute Library
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage product attributes and all selectable values.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
            <Layers3
              size={15}
            />
            {
              attributes.length
            }{" "}
            Total
          </div>
        </div>
      </div>

      {/* Rows */}
      {attributes.map(
        (
          attribute
        ) => (
          <AttributeRow
            key={
              attribute.id
            }
            attribute={
              attribute
            }
            valueInput={
              valueInputs[
                attribute.id
              ] || ""
            }
            loading={
              loading
            }
            onValueInputChange={
              onValueInputChange
            }
            onCreateValue={
              onCreateValue
            }
            onUpdateAttribute={
              onUpdateAttribute
            }
            onDeleteAttribute={
              onDeleteAttribute
            }
            onUpdateValue={
              onUpdateValue
            }
            onDeleteValue={
              onDeleteValue
            }
          />
        )
      )}
    </section>
  );
};

export default memo(
  AttributeTable
);