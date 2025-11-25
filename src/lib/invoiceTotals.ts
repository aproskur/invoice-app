type ItemInput = {
  name?: string | null;
  quantity?: number | null;
  price?: number | null;
};

export type NormalizedItem = {
  name: string;
  quantity: number;
  price: number;
};

export const normalizeItems = (items?: ItemInput[] | null): NormalizedItem[] => {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => ({
      name: item?.name?.trim() ?? '',
      quantity: Number(item?.quantity ?? 0),
      price: Number(item?.price ?? 0),
    }))
    .filter((item) => item.name && item.quantity > 0 && item.price >= 0);
};

export const calculateTotalAmount = (items: NormalizedItem[]) =>
  items.reduce((sum, item) => sum + item.quantity * item.price, 0);
