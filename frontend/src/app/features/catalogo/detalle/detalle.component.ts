import { Component, DestroyRef, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductoService } from '../../../core/services/producto.service';
import { CarritoService } from '../../../core/services/carrito.service';
import { ProductoResponse } from '../../../core/models/models';

@Component({
  selector: 'app-detalle',
  imports: [RouterLink, DecimalPipe],
  template: `
    <div class="back">
      <a routerLink="/catalogo" class="boton boton-ghost boton-sm">← Volver al catálogo</a>
    </div>

    @if (cargando()) {
      <div class="cargando"><div class="spinner"></div>Cargando…</div>
    } @else if (producto()) {
      <div class="tarjeta detalle">
        <div class="detalle__media">
          <span class="detalle__fallback">🛍️</span>
          @if (producto()?.imagenUrl) {
            <img [src]="producto()?.imagenUrl" [alt]="producto()?.nombre" (error)="ocultarImagen($event)" />
          }
        </div>
        <div class="detalle__info">
          <h1>{{ producto()?.nombre }}</h1>
          <div class="detalle__meta">
            <span class="badge badge-cliente">{{ producto()?.categoriaNombre }}</span>
            @if (producto()?.marca) {
              <span class="detalle__marca">{{ producto()?.marca }}</span>
            }
            <span [class]="'badge ' + (producto()?.activo ? 'badge-activo' : 'badge-inactivo')">
              {{ producto()?.activo ? 'Activo' : 'Inactivo' }}
            </span>
          </div>
          <p class="detalle__descripcion">{{ producto()?.descripcion }}</p>
          <div class="detalle__precio">S/ {{ producto()?.precio | number: '1.2-2' }}</div>
          <div>
            <span class="detalle__stock" [class.sin-stock]="producto()?.stock === 0">
              {{
                producto()?.stock === 0
                  ? 'Sin stock'
                  : (producto()?.stock ?? 0) <= 5
                    ? '¡Últimas ' + producto()?.stock + ' unidades!'
                    : producto()?.stock + ' unidades disponibles'
              }}
            </span>
          </div>
          <div class="detalle__acciones">
            <button class="boton boton-primario boton-lg" [disabled]="producto()?.stock === 0" (click)="agregar()">
              Agregar al carrito
            </button>
            <a routerLink="/carrito" class="boton boton-ghost boton-lg">Ver carrito</a>
          </div>
        </div>
      </div>

      @if (sugeridos().length > 0) {
        <section class="sugeridos" aria-labelledby="sugeridos-titulo">
          <div class="sugeridos__cabecera">
            <div>
              <h2 id="sugeridos-titulo">También te puede interesar</h2>
              <p>Productos relacionados con {{ producto()?.categoriaNombre }}.</p>
            </div>
            <a routerLink="/catalogo" class="boton boton-ghost boton-sm">Ver catálogo</a>
          </div>

          <div class="sugeridos__grid">
            @for (s of sugeridos(); track s.id) {
              <article class="tarjeta sugerido">
                <a class="sugerido__media" [routerLink]="['/catalogo', s.id]" [attr.aria-label]="'Ver ' + s.nombre">
                  <span class="sugerido__fallback">Sin imagen</span>
                  @if (s.imagenUrl) {
                    <img [src]="s.imagenUrl" [alt]="s.nombre" loading="lazy" (error)="ocultarImagen($event)" />
                  }
                  @if (s.stock === 0) {
                    <span class="sugerido__badge">Agotado</span>
                  }
                </a>
                <div class="sugerido__cuerpo">
                  <span class="sugerido__categoria">{{ s.categoriaNombre }}</span>
                  <a class="sugerido__nombre" [routerLink]="['/catalogo', s.id]">{{ s.nombre }}</a>
                  <div class="sugerido__precio">S/ {{ s.precio | number: '1.2-2' }}</div>
                  <button class="boton boton-primario boton-sm sugerido__accion"
                    [disabled]="s.stock === 0" (click)="agregarSugerido(s)">
                    {{ s.stock === 0 ? 'Sin stock' : 'Agregar' }}
                  </button>
                </div>
              </article>
            }
          </div>
        </section>
      }
    } @else {
      <div class="vacio">Producto no encontrado.</div>
    }
  `,
  styleUrl: './detalle.component.scss'
})
export class DetalleComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productoService = inject(ProductoService);
  private carritoService = inject(CarritoService);
  private destroyRef = inject(DestroyRef);

  readonly producto: WritableSignal<ProductoResponse | null> = signal(null);
  readonly sugeridos = signal<ProductoResponse[]>([]);
  readonly cargando = signal(true);

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const id = Number(params.get('id'));
      if (!Number.isInteger(id) || id <= 0) {
        this.router.navigate(['/catalogo']);
        return;
      }
      this.cargarProducto(id);
    });
  }

  private cargarProducto(id: number): void {
    this.cargando.set(true);
    this.producto.set(null);
    this.sugeridos.set([]);

    this.productoService.obtener(id).subscribe({
      next: (p) => {
        this.producto.set(p);
        this.cargando.set(false);
        this.cargarSugeridos(p.id);
      },
      error: () => {
        this.cargando.set(false);
        this.router.navigate(['/catalogo']);
      }
    });
  }

  private cargarSugeridos(id: number): void {
    this.productoService.relacionados(id, 4).subscribe({
      next: (productos) => this.sugeridos.set(productos),
      error: () => this.sugeridos.set([])
    });
  }

  agregar(): void {
    const p = this.producto();
    if (p) this.carritoService.agregar(p);
  }

  agregarSugerido(producto: ProductoResponse): void {
    if (producto.stock > 0) this.carritoService.agregar(producto);
  }

  ocultarImagen(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }
}