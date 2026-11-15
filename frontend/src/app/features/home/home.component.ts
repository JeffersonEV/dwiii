import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BannerService } from '../../core/services/banner.service';
import { CategoriaService } from '../../core/services/categoria.service';
import { ProductoService } from '../../core/services/producto.service';
import { CarritoService } from '../../core/services/carrito.service';
import { BannerResponse, CategoriaResponse, ProductoResponse } from '../../core/models/models';

@Component({
  selector: 'app-home',
  imports: [RouterLink, DecimalPipe],
  template: `
    <div class="marquesina" aria-label="Promociones y beneficios">
      <div class="marquesina__pista">
        <div class="marquesina__grupo">
          @for (p of promos; track p) {
            <span class="marquesina__item">{{ p }}</span>
            <span class="marquesina__sep">&#10022;</span>
          }
        </div>
        <div class="marquesina__grupo" aria-hidden="true">
          @for (p of promos; track p) {
            <span class="marquesina__item">{{ p }}</span>
            <span class="marquesina__sep">&#10022;</span>
          }
        </div>
      </div>
    </div>

    <section
      class="carrusel"
      (mouseenter)="pausar()"
      (mouseleave)="reanudar()"
      (focusin)="pausar()"
      (focusout)="reanudar()"
      aria-roledescription="carrusel"
      aria-label="Promociones destacadas"
    >
      @for (b of slides(); track b.id; let i = $index) {
        <article class="slide" [class.slide--activo]="i === slideActual()">
          @if (b.imagenUrl) {
            <img
              class="slide__img"
              [src]="b.imagenUrl"
              [alt]="b.titulo"
              [attr.loading]="i === 0 ? 'eager' : 'lazy'"
              (error)="ocultarImagen($event)"
            />
          }
          <div class="slide__velo"></div>
          <div class="slide__contenido">
            <span class="slide__etiqueta">TECHSTORE</span>
            <h1 class="slide__titulo">{{ b.titulo }}</h1>
            <p class="slide__subtitulo">{{ b.subtitulo }}</p>
            @if (b.textoBoton) {
              <a class="boton boton-primario boton-lg" [routerLink]="b.enlaceUrl || '/catalogo'">
                {{ b.textoBoton }}
              </a>
            }
          </div>
        </article>
      }

      <button type="button" class="carrusel__flecha carrusel__flecha--izq" (click)="anterior()" aria-label="Anterior">
        &#8249;
      </button>
      <button type="button" class="carrusel__flecha carrusel__flecha--der" (click)="siguiente()" aria-label="Siguiente">
        &#8250;
      </button>

      <div class="carrusel__puntos">
        @for (b of slides(); track b.id; let i = $index) {
          <button
            type="button"
            class="punto"
            [class.punto--activo]="i === slideActual()"
            (click)="irA(i)"
            [attr.aria-label]="'Ir a ' + b.titulo"
          ></button>
        }
      </div>
    </section>

    <section class="beneficios" aria-label="Beneficios de comprar en TechStore">
      @for (b of beneficios; track b.titulo) {
        <div class="beneficio">
          <span class="beneficio__icono">{{ b.icono }}</span>
          <div>
            <h3>{{ b.titulo }}</h3>
            <p>{{ b.texto }}</p>
          </div>
        </div>
      }
    </section>

    @if (categorias().length) {
      <section class="seccion" id="categorias">
        <div class="seccion__cabecera">
          <div>
            <h2>Compra por categoría</h2>
            <p>Encuentra rápido lo que necesitas para tu equipo.</p>
          </div>
          <a routerLink="/catalogo" class="seccion__enlace">Ver todo &#8594;</a>
        </div>
        <div class="categorias">
          @for (c of categorias(); track c.id) {
            <a class="categoria" routerLink="/catalogo" [queryParams]="{ categoriaId: c.id }">
              <span class="categoria__icono">{{ iconoCategoria(c.nombre) }}</span>
              <span class="categoria__nombre">{{ c.nombre }}</span>
              <span class="categoria__desc">{{ c.descripcion }}</span>
            </a>
          }
        </div>
      </section>
    }

    <section class="seccion">
      <div class="seccion__cabecera">
        <div>
          <h2>Destacados de la semana</h2>
          <p>Productos con stock disponible y garantía oficial.</p>
        </div>
        <a routerLink="/catalogo" class="seccion__enlace">Ver catálogo completo &#8594;</a>
      </div>

      @if (cargandoProductos()) {
        <div class="prod-grid">
          @for (n of [1, 2, 3, 4, 5, 6, 7, 8]; track n) {
            <div class="prod-esqueleto"></div>
          }
        </div>
      } @else if (destacados().length === 0) {
        <div class="vacio">No hay productos disponibles por el momento.</div>
      } @else {
        <div class="prod-grid">
          @for (p of destacados(); track p.id) {
            <article class="prod">
              <a class="prod__media" [routerLink]="['/catalogo', p.id]">
                <span class="prod__fallback">{{ iconoCategoria(p.categoriaNombre) }}</span>
                @if (p.imagenUrl) {
                  <img
                    class="prod__img"
                    [src]="p.imagenUrl"
                    [alt]="p.nombre"
                    loading="lazy"
                    (error)="ocultarImagen($event)"
                  />
                }
                @if (p.stock === 0) {
                  <span class="prod__badge prod__badge--agotado">Agotado</span>
                } @else if (p.stock <= 5) {
                  <span class="prod__badge prod__badge--pocas">¡Últimas {{ p.stock }}!</span>
                }
              </a>
              <div class="prod__cuerpo">
                <div class="prod__meta">
                  <span class="prod__cat">{{ p.categoriaNombre }}</span>
                  @if (p.marca) {
                    <span class="prod__marca">{{ p.marca }}</span>
                  }
                </div>
                <a class="prod__nombre" [routerLink]="['/catalogo', p.id]">{{ p.nombre }}</a>
                <p class="prod__desc">{{ p.descripcion }}</p>
                <div class="prod__pie">
                  <div>
                    <div class="prod__precio">S/ {{ p.precio | number: '1.2-2' }}</div>
                    <div class="prod__stock" [class.prod__stock--agotado]="p.stock === 0">
                      {{ p.stock === 0 ? 'Sin stock' : 'Disponible' }}
                    </div>
                  </div>
                  <button
                    type="button"
                    class="boton boton-primario boton-sm"
                    [disabled]="p.stock === 0"
                    (click)="agregar(p)"
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </article>
          }
        </div>
      }
    </section>

    <section class="promos">
      <a class="promo promo--gaming" routerLink="/catalogo">
        <div class="promo__texto">
          <span class="promo__etiqueta">GAMING</span>
          <h2>Potencia tu setup</h2>
          <p>Teclados, mouse y monitores de alto rendimiento.</p>
          <span class="promo__cta">Ver productos &#8594;</span>
        </div>
      </a>
      <a class="promo promo--audio" routerLink="/catalogo">
        <div class="promo__texto">
          <span class="promo__etiqueta">AUDIO</span>
          <h2>Sonido que se siente</h2>
          <p>Audífonos y parlantes de las mejores marcas.</p>
          <span class="promo__cta">Explorar audio &#8594;</span>
        </div>
      </a>
    </section>

    <section class="franja-cta">
      <div>
        <h2>¿Listo para renovar tu tecnología?</h2>
        <p>Crea tu cuenta, compra en línea y sigue tus pedidos en tiempo real.</p>
      </div>
      <div class="franja-cta__acciones">
        <a routerLink="/catalogo" class="boton boton-primario boton-lg">Ver catálogo</a>
        <a routerLink="/registro" class="boton boton-ghost boton-lg">Crear cuenta</a>
      </div>
    </section>

    @if (agregado(); as nombre) {
      <div class="aviso-carrito">
        <span>&#10003; {{ nombre }} se agregó al carrito.</span>
        <a routerLink="/carrito">Ver carrito</a>
      </div>
    }
  `,
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  private bannerService = inject(BannerService);
  private categoriaService = inject(CategoriaService);
  private productoService = inject(ProductoService);
  private carritoService = inject(CarritoService);

  readonly banners = signal<BannerResponse[]>([]);
  readonly categorias = signal<CategoriaResponse[]>([]);
  readonly destacados = signal<ProductoResponse[]>([]);
  readonly cargandoProductos = signal(true);
  readonly slideActual = signal(0);
  readonly agregado = signal<string | null>(null);

  readonly promos = [
    '🚚 Envío gratis en compras desde S/ 199',
    '💳 Hasta 3 cuotas sin interés',
    '🔁 30 días para cambios y devoluciones',
    '🛡️ Garantía oficial en todos los productos',
    '⚡ Ofertas tech renovadas cada semana'
  ];

  readonly beneficios = [
    { icono: '🚚', titulo: 'Envío rápido', texto: 'Despacho en 24 a 48 horas a todo el país.' },
    { icono: '🔒', titulo: 'Compra segura', texto: 'Pagos protegidos y datos cifrados.' },
    { icono: '↩️', titulo: 'Devoluciones', texto: 'Tienes 30 días para cambiar tu producto.' },
    { icono: '💬', titulo: 'Soporte real', texto: 'Te ayudamos a elegir antes y después de comprar.' }
  ];

  readonly fallbackBanners: BannerResponse[] = [
    {
      id: -1,
      titulo: 'Tecnología que impulsa tu mundo',
      subtitulo: 'Laptops, celulares y accesorios de las mejores marcas en un solo lugar.',
      imagenUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&h=700&q=70',
      enlaceUrl: '/catalogo',
      textoBoton: 'Ver catálogo',
      orden: 1,
      activo: true
    },
    {
      id: -2,
      titulo: 'Hasta 30% de descuento',
      subtitulo: 'Ofertas exclusivas en audio y periféricos por tiempo limitado.',
      imagenUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1600&h=700&q=70',
      enlaceUrl: '/catalogo',
      textoBoton: 'Aprovechar ofertas',
      orden: 2,
      activo: true
    },
    {
      id: -3,
      titulo: 'Potencia tu setup gamer',
      subtitulo: 'Monitores, teclados y mouse de alto rendimiento te esperan.',
      imagenUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1600&h=700&q=70',
      enlaceUrl: '/catalogo',
      textoBoton: 'Ver productos',
      orden: 3,
      activo: true
    },
    {
      id: -4,
      titulo: 'Los smartphones más buscados',
      subtitulo: 'Renueva tu equipo con cámaras, batería y rendimiento de última generación.',
      imagenUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1600&h=700&q=70',
      enlaceUrl: '/catalogo',
      textoBoton: 'Ver celulares',
      orden: 4,
      activo: true
    },
    {
      id: -5,
      titulo: 'Renueva tu laptop',
      subtitulo: 'Modelos para estudio, trabajo y gaming con garantía oficial.',
      imagenUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1600&h=700&q=70',
      enlaceUrl: '/catalogo',
      textoBoton: 'Ver laptops',
      orden: 5,
      activo: true
    }
  ];

  private timer: ReturnType<typeof setInterval> | null = null;
  private avisoTimer: ReturnType<typeof setTimeout> | null = null;
  private pausado = false;

  ngOnInit(): void {
    this.bannerService.listar().subscribe({
      next: (banners) => {
        if (banners.length) {
          this.banners.set(banners);
          if (this.slideActual() >= banners.length) this.slideActual.set(0);
          this.reiniciarAuto();
        }
      }
    });

    this.categoriaService.listar().subscribe({
      next: (categorias) => this.categorias.set(categorias)
    });

    this.productoService.listar({ pagina: 0, tamanio: 8, soloActivos: true }).subscribe({
      next: (res) => {
        this.destacados.set(res.contenido);
        this.cargandoProductos.set(false);
      },
      error: () => this.cargandoProductos.set(false)
    });

    this.iniciarAuto();
  }

  ngOnDestroy(): void {
    this.detenerAuto();
    if (this.avisoTimer) clearTimeout(this.avisoTimer);
  }

  slides(): BannerResponse[] {
    return this.banners().length ? this.banners() : this.fallbackBanners;
  }

  irA(indice: number): void {
    this.slideActual.set(indice);
    this.reiniciarAuto();
  }

  anterior(): void {
    const total = this.slides().length;
    this.slideActual.update((actual) => (actual - 1 + total) % total);
    this.reiniciarAuto();
  }

  siguiente(auto = false): void {
    if (auto && this.pausado) return;
    const total = this.slides().length;
    this.slideActual.update((actual) => (actual + 1) % total);
  }

  pausar(): void {
    this.pausado = true;
  }

  reanudar(): void {
    this.pausado = false;
    this.reiniciarAuto();
  }

  agregar(producto: ProductoResponse): void {
    this.carritoService.agregar(producto);
    this.agregado.set(producto.nombre);
    if (this.avisoTimer) clearTimeout(this.avisoTimer);
    this.avisoTimer = setTimeout(() => this.agregado.set(null), 2800);
  }

  ocultarImagen(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }

  iconoCategoria(nombre: string | null | undefined): string {
    const n = (nombre ?? '').toLowerCase();
    if (n.includes('laptop') || n.includes('comput')) return '💻';
    if (n.includes('celular') || n.includes('smart')) return '📱';
    if (n.includes('audio') || n.includes('audí') || n.includes('audif') || n.includes('parlante')) return '🎧';
    if (n.includes('perif') || n.includes('teclado') || n.includes('mouse') || n.includes('monitor')) return '🖱️';
    if (n.includes('component') || n.includes('tarjeta') || n.includes('ssd') || n.includes('memoria')) return '⚙️';
    return '🛍️';
  }

  private iniciarAuto(): void {
    if (this.prefiereMenosMovimiento()) return;
    this.detenerAuto();
    this.timer = setInterval(() => this.siguiente(true), 6000);
  }

  private reiniciarAuto(): void {
    if (this.prefiereMenosMovimiento()) return;
    this.detenerAuto();
    this.iniciarAuto();
  }

  private detenerAuto(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private prefiereMenosMovimiento(): boolean {
    return (
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }
}
