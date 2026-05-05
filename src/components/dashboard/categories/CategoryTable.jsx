import {
  FolderTree,
  Layers3,
  Package,
  Pencil,
  Trash2,
  ChevronRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { getImageUrl } from "../../../utils/getImageUrl";

/* ==========================================================
   FILE NAME: CategoryTable.jsx

   CATEGORY TABLE
   Excellent Quality / Production Grade

   Props:
   categories = []
   loading = false
   onClick(item)
   onEdit(item)
   onDelete(item)
========================================================== */

const CategoryTable = ({
  categories = [],
  loading = false,
  onClick = () => {},
  onEdit = () => {},
  onDelete = () => {},
}) => {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* TOP HEADER */}
      <div className="border-b border-slate-100 px-6 py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Categories List
            </h3>

            <p className="text-sm text-slate-500">
              Manage category hierarchy and products.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
            <FolderTree
              size={16}
            />
            {categories.length} Categories
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-[1200px] w-full">
          <TableHeader />

          <tbody className="divide-y divide-slate-100">
            {/* LOADING */}
            {loading &&
              Array.from({
                length: 6,
              }).map((_, index) => (
                <tr
                  key={index}
                  className="animate-pulse"
                >
                  {Array.from({
                    length: 6,
                  }).map((__, i) => (
                    <td
                      key={i}
                      className="px-6 py-4"
                    >
                      <div className="h-11 rounded-2xl bg-slate-200" />
                    </td>
                  ))}
                </tr>
              ))}

            {/* DATA */}
            {!loading &&
              categories.length >
                0 &&
              categories.map(
                (
                  item
                ) => {
                  const active =
                    item?.status ===
                      true ||
                    item?.status ===
                      1 ||
                    item?.status ===
                      "1";

                  const image =
                    item?.image
                      ? getImageUrl(
                          item.image
                        )
                      : "/no-image.png";

                  return (
                    <tr
                      key={
                        item.id
                      }
                      className="transition hover:bg-slate-50"
                    >
                      {/* CATEGORY */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            onClick(
                              item
                            )
                          }
                          className="flex items-center gap-3 text-left"
                        >
                          <img
                            src={
                              image
                            }
                            alt=""
                            className="h-12 w-12 rounded-2xl border object-cover"
                            onError={(
                              e
                            ) =>
                              (e.currentTarget.src =
                                "/no-image.png")
                            }
                          />

                          <div>
                            <h4 className="font-semibold text-slate-900">
                              {
                                item.name
                              }
                            </h4>

                            <p className="text-xs text-slate-500">
                              Open subcategories
                            </p>
                          </div>
                        </button>
                      </td>

                      {/* SUB */}
                      <td className="px-6 py-4">
                        <Badge
                          icon={
                            <Layers3
                              size={
                                14
                              }
                            />
                          }
                          text={`${
                            item
                              ?.children
                              ?.length ||
                            0
                          }`}
                          color="blue"
                        />
                      </td>

                      {/* PRODUCTS */}
                      <td className="px-6 py-4">
                        <Badge
                          icon={
                            <Package
                              size={
                                14
                              }
                            />
                          }
                          text={`${
                            item.products_count ||
                            0
                          }`}
                          color="emerald"
                        />
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-4">
                        <Badge
                          icon={
                            active ? (
                              <CheckCircle2
                                size={
                                  14
                                }
                              />
                            ) : (
                              <XCircle
                                size={
                                  14
                                }
                              />
                            )
                          }
                          text={
                            active
                              ? "Active"
                              : "Inactive"
                          }
                          color={
                            active
                              ? "emerald"
                              : "rose"
                          }
                        />
                      </td>

                      {/* POSITION */}
                      <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                        #
                        {item.position ??
                          "-"}
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() =>
                              onEdit(
                                item
                              )
                            }
                            className="rounded-xl bg-blue-500 p-2 text-white transition hover:bg-blue-600"
                          >
                            <Pencil
                              size={
                                15
                              }
                            />
                          </button>

                          <button
                            onClick={() =>
                              onDelete(
                                item
                              )
                            }
                            className="rounded-xl bg-rose-500 p-2 text-white transition hover:bg-rose-600"
                          >
                            <Trash2
                              size={
                                15
                              }
                            />
                          </button>

                          <button
                            onClick={() =>
                              onClick(
                                item
                              )
                            }
                            className="rounded-xl border border-slate-200 p-2 transition hover:bg-slate-100"
                          >
                            <ChevronRight
                              size={
                                15
                              }
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }
              )}

            {/* EMPTY */}
            {!loading &&
              categories.length ===
                0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-16 text-center"
                  >
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#7b183f]/10 text-[#7b183f]">
                      <FolderTree
                        size={
                          30
                        }
                      />
                    </div>

                    <h3 className="mt-5 text-xl font-semibold text-slate-900">
                      No Categories Found
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      Create categories to organize products.
                    </p>
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryTable;

/* ==========================================================
   HEADER
========================================================== */

const TableHeader = () => (
  <thead className="sticky top-0 z-10 bg-slate-50">
    <tr className="border-b border-slate-200">
      <Th>Category</Th>
      <Th>Subcategories</Th>
      <Th>Products</Th>
      <Th>Status</Th>
      <Th>Position</Th>
      <Th align="right">
        Actions
      </Th>
    </tr>
  </thead>
);

const Th = ({
  children,
  align = "left",
}) => (
  <th
    className={`whitespace-nowrap px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 ${
      align ===
      "right"
        ? "text-right"
        : "text-left"
    }`}
  >
    {children}
  </th>
);

/* ==========================================================
   BADGE
========================================================== */

const Badge = ({
  icon,
  text,
  color =
    "slate",
}) => {
  const styles = {
    blue: "bg-blue-50 text-blue-700",
    emerald:
      "bg-emerald-50 text-emerald-700",
    rose: "bg-rose-50 text-rose-700",
    slate:
      "bg-slate-100 text-slate-700",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${styles[color]}`}
    >
      {icon}
      {text}
    </span>
  );
};