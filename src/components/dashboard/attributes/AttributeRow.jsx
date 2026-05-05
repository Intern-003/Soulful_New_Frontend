// FILE: src/components/dashboard/attributes/AttributeRow.jsx

import React, {
  memo,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Pencil,
  Trash2,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Layers3,
} from "lucide-react";

import AttributeValues from "./AttributeValues";

/* ==========================================================
   ATTRIBUTE ROW
   Elite Production Grade

   Props:
   attribute
   valueInput

   onValueInputChange(attrId, value)
   onCreateValue(attrId)

   onUpdateAttribute(attrId, name)
   onDeleteAttribute(attrId)

   onUpdateValue(valueId, value)
   onDeleteValue(valueId, attrId)
========================================================== */

const AttributeRow = ({
  attribute,
  valueInput = "",

  onValueInputChange,
  onCreateValue,

  onUpdateAttribute,
  onDeleteAttribute,

  onUpdateValue,
  onDeleteValue,

  loading = false,
}) => {
  const [
    expanded,
    setExpanded,
  ] = useState(
    true
  );

  const [
    editing,
    setEditing,
  ] = useState(
    false
  );

  const [
    text,
    setText,
  ] = useState(
    attribute?.name ||
      ""
  );

  const inputRef =
    useRef(null);

  const totalValues =
    attribute?.values
      ?.length || 0;

  useEffect(() => {
    setText(
      attribute?.name ||
        ""
    );
  }, [
    attribute,
  ]);

  useEffect(() => {
    if (
      editing &&
      inputRef.current
    ) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [
    editing,
  ]);

  const handleSave =
    () => {
      const next =
        text.trim();

      if (!next) {
        setText(
          attribute?.name ||
            ""
        );
        setEditing(
          false
        );
        return;
      }

      if (
        next !==
        attribute?.name
      ) {
        onUpdateAttribute?.(
          attribute.id,
          next
        );
      }

      setEditing(
        false
      );
    };

  const handleCancel =
    () => {
      setText(
        attribute?.name ||
          ""
      );

      setEditing(
        false
      );
    };

  const handleDelete =
    () => {
      onDeleteAttribute?.(
        attribute.id
      );
    };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* HEADER */}
      <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
        {/* LEFT */}
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() =>
              setExpanded(
                !expanded
              )
            }
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 transition hover:bg-slate-100"
          >
            {expanded ? (
              <ChevronUp
                size={
                  18
                }
              />
            ) : (
              <ChevronDown
                size={
                  18
                }
              />
            )}
          </button>

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-100">
            <Layers3
              size={
                20
              }
              className="text-slate-800"
            />
          </div>

          <div className="min-w-0">
            {editing ? (
              <input
                ref={
                  inputRef
                }
                value={
                  text
                }
                onChange={(
                  e
                ) =>
                  setText(
                    e.target
                      .value
                  )
                }
                onKeyDown={(
                  e
                ) => {
                  if (
                    e.key ===
                    "Enter"
                  ) {
                    handleSave();
                  }

                  if (
                    e.key ===
                    "Escape"
                  ) {
                    handleCancel();
                  }
                }}
                className="h-10 w-56 rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-[#7a1c3d] focus:ring-4 focus:ring-[#7a1c3d]/10"
              />
            ) : (
              <h3 className="truncate text-lg font-semibold text-slate-900">
                {
                  attribute?.name
                }
              </h3>
            )}

            <p className="text-xs text-slate-500">
              {totalValues} value
              {totalValues !==
              1
                ? "s"
                : ""}
            </p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-wrap items-center gap-2">
          {editing ? (
            <>
              <button
                type="button"
                onClick={
                  handleSave
                }
                disabled={
                  loading
                }
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
              >
                <Check
                  size={
                    16
                  }
                />
                Save
              </button>

              <button
                type="button"
                onClick={
                  handleCancel
                }
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <X
                  size={
                    16
                  }
                />
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() =>
                  setEditing(
                    true
                  )
                }
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <Pencil
                  size={
                    16
                  }
                />
                Edit
              </button>

              <button
                type="button"
                onClick={
                  handleDelete
                }
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-rose-600 px-4 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                <Trash2
                  size={
                    16
                  }
                />
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* BODY */}
      {expanded && (
        <div className="border-t border-slate-100 p-4">
          <AttributeValues
            attribute={
              attribute
            }
            valueInput={
              valueInput
            }
            loading={
              loading
            }
            onValueInputChange={(
              value
            ) =>
              onValueInputChange?.(
                attribute.id,
                value
              )
            }
            onCreateValue={() =>
              onCreateValue?.(
                attribute.id
              )
            }
            onUpdateValue={
              onUpdateValue
            }
            onDeleteValue={(
              valueId
            ) =>
              onDeleteValue?.(
                valueId,
                attribute.id
              )
            }
          />
        </div>
      )}
    </div>
  );
};

export default memo(
  AttributeRow
);