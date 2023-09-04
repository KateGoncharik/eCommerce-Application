export type ProductData = {
  name: string;
  img: Record<string, string>[];
  description: string;
  price: string;
  discount?: string;
};
