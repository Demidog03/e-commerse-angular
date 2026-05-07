import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../modules/products/services/products.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, startWith } from 'rxjs';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';

type ProductsVm =
  | { state: 'loading' }
  | { state: 'error' }
  | { state: 'ready'; products: Array<{
      id: string;
      name: string;
      description: string | null;
      price: number;
      imageUrl: string | null;
      scoville: number | null;
      stock: number;
      createdAt: string;
    }> };

@Component({
  selector: 'app-products-page',
  imports: [CommonModule, CardModule, ProgressSpinnerModule, TagModule],
  templateUrl: './products-page.html',
  styleUrl: './products-page.scss',
})
export class ProductsPage {
  private readonly productsService = inject(ProductsService);

  private readonly vm = toSignal(
    this.productsService.getProducts().pipe(
      startWith(null),
      catchError(() => of('error' as const)),
    ),
    { initialValue: null },
  );

  readonly view = computed<ProductsVm>(() => {
    const v = this.vm();
    if (v === null) return { state: 'loading' };
    if (v === 'error') return { state: 'error' };
    return { state: 'ready', products: v };
  });

  readonly products = computed(() => {
    const v = this.view();
    return v.state === 'ready' ? v.products : [];
  });
}

