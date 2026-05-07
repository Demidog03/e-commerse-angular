import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { GetProductsResponse, Product } from '../types/products.types';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly http = inject(HttpClient);

  getProducts() {
    return this.http.get<GetProductsResponse>(`${environment.apiUrl}/products`).pipe(map((r) => r.products));
  }

  getProductById(id: string) {
    return this.http.get<{ product: Product }>(`${environment.apiUrl}/products/${id}`).pipe(map((r) => r.product));
  }
}

