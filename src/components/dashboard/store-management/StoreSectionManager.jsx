import React, {
  useState,
} from "react";

import {
  Plus,
  Trash2,
  LayoutGrid,
} from "lucide-react";

import useGet from "../../../api/hooks/useGet";
import usePost from "../../../api/hooks/usePost";
import useDelete from "../../../api/hooks/useDelete";

const SECTION_TYPES = [
  {
    value:
      "featured_products",
    label:
      "Featured Products",
  },
  {
    value:
      "new_arrivals",
    label:
      "New Arrivals",
  },
];

const StoreSectionManager =
  () => {
    const {
      data,
      loading,
      refetch,
    } = useGet(
      "/vendor/store-sections"
    );

    const {
      postData,
      loading:
        createLoading,
    } = usePost();

    const {
      deleteData,
    } = useDelete();

    const sections =
      data?.data || [];

    const [
      title,
      setTitle,
    ] = useState("");

    const [
      type,
      setType,
    ] = useState(
      "featured_products"
    );

    const [
      sortOrder,
      setSortOrder,
    ] = useState(0);

    const handleCreate =
      async (e) => {
        e.preventDefault();

        await postData({
          url:
            "/vendor/store-sections",

          data: {
            title,
            type,
            sort_order:
              sortOrder,
          },
        });

        setTitle("");

        setType(
          "featured_products"
        );

        setSortOrder(
          0
        );

        refetch({
          force: true,
        });
      };

    const handleDelete =
      async (id) => {
        if (
          !window.confirm(
            "Delete section?"
          )
        ) {
          return;
        }

        await deleteData({
          url: `/vendor/store-sections/${id}`,
        });

        refetch({
          force: true,
        });
      };

    return (
      <div
        className="
          bg-white
          rounded-3xl
          border
          border-slate-200
          shadow-sm
        "
      >
        {/* HEADER */}

        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">
            Homepage Sections
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Control sections
            shown on your
            store homepage.
          </p>
        </div>

        {/* CREATE */}

        <form
          onSubmit={
            handleCreate
          }
          className="p-6 space-y-5"
        >
          <div>
            <label className="block text-sm font-medium mb-2">
              Section Title
            </label>

            <input
              type="text"
              value={
                title
              }
              onChange={(
                e
              ) =>
                setTitle(
                  e.target
                    .value
                )
              }
              placeholder="Featured Products"
              className="
                w-full
                h-11
                border
                rounded-xl
                px-4
              "
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Section Type
            </label>

            <select
              value={type}
              onChange={(
                e
              ) =>
                setType(
                  e.target
                    .value
                )
              }
              className="
                w-full
                h-11
                border
                rounded-xl
                px-4
              "
            >
              {SECTION_TYPES.map(
                (
                  item
                ) => (
                  <option
                    key={
                      item.value
                    }
                    value={
                      item.value
                    }
                  >
                    {
                      item.label
                    }
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Sort Order
            </label>

            <input
              type="number"
              value={
                sortOrder
              }
              onChange={(
                e
              ) =>
                setSortOrder(
                  Number(
                    e.target
                      .value
                  )
                )
              }
              className="
                w-full
                h-11
                border
                rounded-xl
                px-4
              "
            />
          </div>

          <button
            disabled={
              createLoading
            }
            className="
              inline-flex
              items-center
              gap-2
              px-6
              py-3
              rounded-xl
              bg-[#7a1c3d]
              text-white
              font-medium
            "
          >
            <Plus
              size={18}
            />

            {createLoading
              ? "Creating..."
              : "Create Section"}
          </button>
        </form>

        {/* LIST */}

        <div className="border-t p-6">

          <h3 className="font-semibold mb-5">
            Existing Sections
          </h3>

          {loading ? (
            <div>
              Loading...
            </div>
          ) : sections.length ===
            0 ? (
            <div
              className="
                text-center
                py-10
                text-slate-500
              "
            >
              No sections
              created.
            </div>
          ) : (
            <div className="space-y-4">

              {sections.map(
                (
                  section
                ) => (
                  <div
                    key={
                      section.id
                    }
                    className="
                      border
                      rounded-2xl
                      p-4
                      flex
                      items-center
                      justify-between
                    "
                  >
                    <div className="flex items-center gap-4">

                      <div
                        className="
                          w-12
                          h-12
                          rounded-xl
                          bg-slate-100
                          flex
                          items-center
                          justify-center
                        "
                      >
                        <LayoutGrid
                          size={
                            20
                          }
                        />
                      </div>

                      <div>
                        <h4 className="font-semibold">
                          {
                            section.title
                          }
                        </h4>

                        <p
                          className="
                            text-sm
                            text-slate-500
                          "
                        >
                          {
                            section.type
                          }
                        </p>
                      </div>

                    </div>

                    <button
                      onClick={() =>
                        handleDelete(
                          section.id
                        )
                      }
                      className="
                        w-10
                        h-10
                        rounded-xl
                        border
                        flex
                        items-center
                        justify-center
                        text-red-600
                      "
                    >
                      <Trash2
                        size={18}
                      />
                    </button>

                  </div>
                )
              )}

            </div>
          )}

        </div>
      </div>
    );
  };

export default StoreSectionManager; 