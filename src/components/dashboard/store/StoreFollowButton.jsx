import React, {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  Heart,
  Loader2,
  Check,
} from "lucide-react";

import usePost from "../../../api/hooks/usePost";
import useDelete from "../../../api/hooks/useDelete";

const DEFAULT_THEME =
  "#7a1c3d";

const StoreFollowButton = ({
  slug,
  initiallyFollowing = false,
  primaryColor = DEFAULT_THEME,
  onSuccess,
}) => {
  const [following, setFollowing] =
    useState(initiallyFollowing);

  const {
    postData,
    loading: followLoading,
  } = usePost();

  const {
    deleteData,
    loading: unfollowLoading,
  } = useDelete();

  const loading =
    followLoading ||
    unfollowLoading;

  useEffect(() => {
    setFollowing(
      initiallyFollowing
    );
  }, [initiallyFollowing]);

  const handleToggleFollow =
    async () => {
      const token =
        localStorage.getItem(
          "token"
        );

      if (!token) {
        toast.error(
          "Please login to follow this store."
        );
        return;
      }

      try {
        if (following) {
          await deleteData({
            url: `/vendors/${slug}/follow`,
          });

          setFollowing(
            false
          );

          toast.success(
            "Store unfollowed successfully."
          );
        } else {
          await postData({
            url: `/vendors/${slug}/follow`,
            data: {},
          });

          setFollowing(
            true
          );

          toast.success(
            "Store followed successfully."
          );
        }

        onSuccess?.();
      } catch (error) {
        console.error(
          error
        );

        toast.error(
          error?.response?.data
            ?.message ||
            error?.message ||
            "Unable to process request."
        );
      }
    };

  return (
    <button
      type="button"
      disabled={loading}
      onClick={
        handleToggleFollow
      }
      className="
        inline-flex
        items-center
        justify-center
        gap-2

        min-w-[140px]

        h-11
        px-5

        rounded-xl

        font-semibold
        text-sm

        transition-all
        duration-200

        disabled:opacity-60
        disabled:cursor-not-allowed

        hover:-translate-y-[1px]
      "
      style={
        following
          ? {
              background:
                "#fff",
              color:
                primaryColor,
              border: `1px solid ${primaryColor}`,
            }
          : {
              background:
                primaryColor,
              color:
                "#fff",
              border: `1px solid ${primaryColor}`,
            }
      }
    >
      {loading ? (
        <>
          <Loader2
            size={16}
            className="animate-spin"
          />

          Please wait...
        </>
      ) : following ? (
        <>
          <Check
            size={16}
          />

          Following
        </>
      ) : (
        <>
          <Heart
            size={16}
          />

          Follow Store
        </>
      )}
    </button>
  );
};

export default StoreFollowButton;