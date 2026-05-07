export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  scoville: number | null;
  stock: number;
  createdAt: string;
}

export interface GetProductsResponse {
  products: Product[];
}

