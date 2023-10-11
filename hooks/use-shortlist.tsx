import { Product } from "@/types";
import toast from "react-hot-toast";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ShortlistStore {
  items: Product[];
  addItem: (data: Product) => void;
  removeItem: (id: string) => void;
}

const useShortlist = create(
  persist<ShortlistStore>(
    (set, get) => ({
      items: [],
      addItem: (data: Product) => {
        const currentItems = get().items;
        const existingItems = currentItems.find((item) => item.id === data.id);

        if (existingItems) {
          return toast("Item already shortlisted.");
        }

        set({ items: [...get().items, data] });
        toast.success("Item added to shortlist.");
      },
      removeItem: (id: string) => {
        set({ items: [...get().items.filter((item) => item.id !== id)] });
        toast.success("Item removed from shortlist.");
      },
    }),
    {
      name: "shortlist-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useShortlist;
