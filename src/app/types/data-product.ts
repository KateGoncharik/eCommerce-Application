export type ProductData = {
  id: string;
  name: string;
  img: Record<string, string>[];
  description: string;
  price: string;
  discount?: string;
};
