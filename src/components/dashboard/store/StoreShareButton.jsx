import React from "react";
import toast from "react-hot-toast";
import { Share2 } from "lucide-react";

const StoreShareButton = ({
  storeName,
}) => {
  const handleShare =
    async () => {
      const shareData = {
        title: storeName,
        text: `Check out ${storeName}`,
        url:
          window.location.href,
      };

      try {
        if (
          navigator.share
        ) {
          await navigator.share(
            shareData
          );
        } else {
          await navigator.clipboard.writeText(
            window.location.href
          );

          toast.success(
            "Store link copied to clipboard"
          );
        }
      } catch (error) {
        console.error(
          error
        );
      }
    };

  return (
    <button
      onClick={
        handleShare
      }
      className="
        inline-flex
        items-center
        justify-center
        gap-2

        h-11
        px-5

        rounded-xl

        bg-white

        border
        border-slate-300

        text-slate-700

        font-semibold
        text-sm

        hover:bg-slate-50

        transition-all
      "
    >
      <Share2
        size={16}
      />

      Share
    </button>
  );
};

export default StoreShareButton;