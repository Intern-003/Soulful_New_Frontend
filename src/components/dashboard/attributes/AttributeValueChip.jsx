// FILE: src/components/dashboard/attributes/AttributeValueChip.jsx

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
  Palette,
  Tag,
} from "lucide-react";

/* ==========================================================
   ATTRIBUTE VALUE CHIP
   Elite Production Grade

   Props:
   valueItem = { id, value }
   attributeName = ""
   onUpdate(id, value)
   onDelete(id)
   loading = false
========================================================== */

const AttributeValueChip = ({
  valueItem,
  attributeName = "",
  onUpdate,
  onDelete,
  loading = false,
}) => {
  const isColor =
    attributeName
      ?.toLowerCase()
      ?.trim() ===
    "color";

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
    valueItem?.value ||
      ""
  );

  const inputRef =
    useRef(null);

  useEffect(() => {
    setText(
      valueItem?.value ||
        ""
    );
  }, [
    valueItem,
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
          valueItem?.value ||
            ""
        );
        setEditing(
          false
        );
        return;
      }

      if (
        next !==
        valueItem?.value
      ) {
        onUpdate?.(
          valueItem.id,
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
        valueItem?.value ||
          ""
      );

      setEditing(
        false
      );
    };

  const handleKeyDown =
    (e) => {
      if (
        e.key ===
        "Enter"
      ) {
        e.preventDefault();
        handleSave();
      }

      if (
        e.key ===
        "Escape"
      ) {
        handleCancel();
      }
    };

  return (
    <div className="group inline-flex max-w-full items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition-all hover:border-slate-300 hover:shadow-md">
      {/* LEFT PREVIEW */}
      {isColor ? (
        <div className="relative">
          <span
            className="block h-5 w-5 rounded-full border border-slate-300 shadow-inner"
            style={{
              background:
                valueItem?.value ||
                "#ffffff",
            }}
          />

          <Palette
            size={
              10
            }
            className="absolute -bottom-1 -right-1 rounded-full bg-white text-slate-500"
          />
        </div>
      ) : (
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-slate-500">
          <Tag
            size={
              11
            }
          />
        </div>
      )}

      {/* CONTENT */}
      {editing ? (
        <input
          ref={
            inputRef
          }
          value={text}
          onChange={(
            e
          ) =>
            setText(
              e.target
                .value
            )
          }
          onKeyDown={
            handleKeyDown
          }
          className="h-8 w-28 rounded-lg border border-slate-300 px-2 text-sm outline-none focus:border-[#7a1c3d] focus:ring-2 focus:ring-[#7a1c3d]/10"
        />
      ) : (
        <span className="max-w-[140px] truncate text-sm font-medium text-slate-700">
          {
            valueItem?.value
          }
        </span>
      )}

      {/* ACTIONS */}
      <div className="flex items-center gap-1">
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
              className="rounded-lg p-1.5 text-emerald-600 transition hover:bg-emerald-50 disabled:opacity-50"
            >
              <Check
                size={
                  15
                }
              />
            </button>

            <button
              type="button"
              onClick={
                handleCancel
              }
              className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100"
            >
              <X
                size={
                  15
                }
              />
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
              className="rounded-lg p-1.5 text-slate-500 opacity-0 transition group-hover:opacity-100 hover:bg-slate-100 hover:text-slate-700"
            >
              <Pencil
                size={
                  14
                }
              />
            </button>

            <button
              type="button"
              onClick={() =>
                onDelete?.(
                  valueItem.id
                )
              }
              className="rounded-lg p-1.5 text-rose-500 opacity-0 transition group-hover:opacity-100 hover:bg-rose-50"
            >
              <Trash2
                size={
                  14
                }
              />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default memo(
  AttributeValueChip
);