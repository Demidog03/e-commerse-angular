import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../../modules/products/services/products.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, filter, map, of, startWith } from 'rxjs';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { Product } from '../../../modules/products/types/products.types';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

type ProductsVm =
  | { state: 'loading' }
  | { state: 'error' }
  | { state: 'ready'; products: Product[] };

@Component({
  selector: 'app-products-page',
  imports: [CommonModule, CardModule, ProgressSpinnerModule, TagModule],
  templateUrl: './products-page.html',
  styleUrl: './products-page.scss',
})
export class ProductsPage {
  private readonly productsService = inject(ProductsService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly showProductGrid = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(() => this.route.firstChild === null),
    ),
    { initialValue: this.route.snapshot.firstChild === null },
  );

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

  readonly navigateToProduct = (id: string) => {
    this.router.navigate(['/products', id]);
  };
}

