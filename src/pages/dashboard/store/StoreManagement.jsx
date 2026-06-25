import React from "react";
import toast from "react-hot-toast";

import useGet from "../../../api/hooks/useGet";
import usePut from "../../../api/hooks/usePut";

import StoreProfileForm from "../../../components/dashboard/store-management/StoreProfileForm";
import StoreBrandingForm from "../../../components/dashboard/store-management/StoreBrandingForm";
import StoreSocialLinksForm from "../../../components/dashboard/store-management/StoreSocialLinksForm";
import StoreBannerManager from "../../../components/dashboard/store-management/StoreBannerManager";
import StoreSectionManager from "../../../components/dashboard/store-management/StoreSectionManager";

import {
  Store,
  Package,
  Users,
  Star,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

const StoreManagementPage = () => {
  const {
    data,
    loading,
    refetch,
  } = useGet(
    "/vendor/store-management"
  );

  const {
    putData,
    loading: saving,
  } = usePut();

  const profile =
    data?.profile || {};

  const analytics =
    data?.analytics || {};

  const storeStatus =
    data?.store_status ||
    "pending";

  const handleSave =
    async (
      formData
    ) => {
      try {
        await putData({
          url:
            "/vendor/store-settings",
          data: formData,
        });

        toast.success(
          "Store updated successfully"
        );

        refetch({
          force: true,
        });
      } catch (error) {
        toast.error(
          "Failed to update store"
        );
      }
    };

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div
        className="
          flex
          flex-col
          lg:flex-row
          lg:items-center
          lg:justify-between
          gap-4
        "
      >
        <div>
          <h1
            className="
              text-3xl
              font-bold
              text-slate-900
            "
          >
            Store Management
          </h1>

          <p
            className="
              text-slate-500
              mt-1
            "
          >
            Manage your store
            profile, branding,
            homepage and customer
            experience.
          </p>
        </div>

        <button
          onClick={() =>
            refetch({
              force: true,
            })
          }
          className="
            inline-flex
            items-center
            gap-2
            px-5
            py-3
            rounded-xl
            border
            bg-white
            hover:bg-slate-50
          "
        >
          <RefreshCw
            size={18}
          />

          Refresh
        </button>
      </div>

      {/* STORE STATUS */}

      <div
        className="
          bg-white
          border
          border-slate-200
          rounded-3xl
          shadow-sm
          p-6
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
          "
        >
          <ShieldCheck
            size={22}
            className="text-green-600"
          />

          <div>
            <h3 className="font-semibold">
              Store Status
            </h3>

            <p
              className="
                text-sm
                text-slate-500
              "
            >
              Current Status:
              {" "}
              <span
                className="
                  font-medium
                  capitalize
                  text-green-600
                "
              >
                {storeStatus}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* ANALYTICS */}

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-4
          gap-5
        "
      >
        <div
          className="
            bg-white
            rounded-3xl
            border
            p-6
          "
        >
          <Store
            size={24}
          />

          <p
            className="
              text-sm
              text-slate-500
              mt-3
            "
          >
            Store
          </p>

          <h3
            className="
              font-bold
              text-xl
              mt-1
            "
          >
            Active
          </h3>
        </div>

        <div
          className="
            bg-white
            rounded-3xl
            border
            p-6
          "
        >
          <Package
            size={24}
          />

          <p
            className="
              text-sm
              text-slate-500
              mt-3
            "
          >
            Products
          </p>

          <h3
            className="
              font-bold
              text-xl
              mt-1
            "
          >
            {
              analytics.products
            }
          </h3>
        </div>

        <div
          className="
            bg-white
            rounded-3xl
            border
            p-6
          "
        >
          <Users
            size={24}
          />

          <p
            className="
              text-sm
              text-slate-500
              mt-3
            "
          >
            Followers
          </p>

          <h3
            className="
              font-bold
              text-xl
              mt-1
            "
          >
            {
              analytics.followers
            }
          </h3>
        </div>

        <div
          className="
            bg-white
            rounded-3xl
            border
            p-6
          "
        >
          <Star
            size={24}
          />

          <p
            className="
              text-sm
              text-slate-500
              mt-3
            "
          >
            Rating
          </p>

          <h3
            className="
              font-bold
              text-xl
              mt-1
            "
          >
            {
              analytics.rating
            }
          </h3>
        </div>
      </div>

      {/* PROFILE */}

      <StoreProfileForm
        profile={
          profile
        }
        loading={
          saving
        }
        onSubmit={
          handleSave
        }
      />

      {/* BRANDING */}

      <StoreBrandingForm
        profile={
          profile
        }
        loading={
          saving
        }
        onSubmit={
          handleSave
        }
      />

      {/* SOCIAL LINKS */}

      <StoreSocialLinksForm
        profile={
          profile
        }
        loading={
          saving
        }
        onSubmit={
          handleSave
        }
      />

      {/* HOMEPAGE BANNERS */}

      <StoreBannerManager />

      {/* HOMEPAGE SECTIONS */}

      <StoreSectionManager />

    </div>
  );
};

export default StoreManagementPage;