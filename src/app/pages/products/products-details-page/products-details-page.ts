import { Component, computed, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ProductsService } from '../../../modules/products/services/products.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, startWith } from 'rxjs';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { Product } from '../../../modules/products/types/products.types';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';

type ProductVm =
  | { state: 'loading' }
  | { state: 'error' }
  | { state: 'ready'; product: Product };

@Component({
  selector: 'app-products-details-page',
  imports: [TagModule, CommonModule, CurrencyPipe, ButtonModule, ProgressSpinnerModule],
  templateUrl: './products-details-page.html',
  styleUrl: './products-details-page.scss',
})
export class ProductsDetailsPage {
  private readonly productsService = inject(ProductsService);
  private readonly route = inject(ActivatedRoute);
  private readonly id = this.route.snapshot.paramMap.get('id')!;

  private readonly vm = toSignal(
    this.productsService.getProductById(this.id).pipe(
      startWith(null),
      catchError(() => of('error' as const)),
    ),
    { initialValue: null },
  );

  readonly view = computed<ProductVm>(() => {
    const v = this.vm();
    if (v === null) return { state: 'loading' };
    if (v === 'error') return { state: 'error' };
    return { state: 'ready', product: v };
  });

  readonly product = computed(() => {
    const v = this.view();
    return v.state === 'ready' ? v.product : null;
  });

  readonly isInStock = computed(() => {
    const v = this.product();
    return v !== null && v.stock > 0;
  });
}
