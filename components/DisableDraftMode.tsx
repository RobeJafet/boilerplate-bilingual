"use client";

import {
  useIsPresentationTool,
} from "next-sanity/hooks";

import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { toast } from "sonner";

export default function DisableDraftMode() {
  const isPresentationTool = useIsPresentationTool();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (isPresentationTool) {
      return;
    }

    const toastId = toast("Draft Mode Enabled", {
      description: "Content is live, refreshing automatically",
      duration: Infinity,
      action: {
        label: "Disable",
        onClick: async () => {
          await fetch("/api/draftMode/disable");
          startTransition(() => {
            router.refresh();
          });
        },
      },
    });

    return () => {
      toast.dismiss(toastId);
    };
  }, [router, isPresentationTool]);

  useEffect(() => {
    if (pending) {
      const toastId = toast.loading("Disabling draft mode...");
      return () => {
        toast.dismiss(toastId);
      };
    }
  }, [pending]);

  return null;
}
