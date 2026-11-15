import {
  afterNextRender,
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
  viewChild
} from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ConfiguracionResponse, PedidoResponse } from '../../../core/models/models';
import { BoletaService } from '../../../core/services/boleta.service';
import { numeroBoleta } from '../../../core/utils/boleta';
import { metodoPagoTexto } from '../../../core/utils/pago';

@Component({
  selector: 'app-boleta-modal',
  imports: [DatePipe, DecimalPipe],
  template: `
    <div class="boleta-overlay" (click)="cerrarModal()">
      <div class="boleta-shell" [class.boleta-shell--capturando]="capturando()" (click)="$event.stopPropagation()">
        <button
          #botonCerrar
          type="button"
          class="boleta-cerrar"
          aria-label="Cerrar boleta"
          (click)="cerrarModal()">
          &#10005;
        </button>

        <article #recibo class="boleta" role="document" aria-label="Boleta de venta">
          <span class="boleta__filo boleta__filo--superior"></span>

          <header class="boleta__cabecera">
            <div class="boleta__marca">
              <span class="boleta__logo">Tech<span>Store</span></span>
              <p class="boleta__tienda-nombre">{{ nombreTienda() }}</p>
              @if (direccion()) {
                <p class="boleta__tienda-dato">{{ direccion() }}</p>
              }
              @if (telefono() || email()) {
                <p class="boleta__tienda-dato">
                  @if (telefono()) {
                    <span>Tel. {{ telefono() }}</span>
                  }
                  @if (telefono() && email()) {
                    <span class="boleta__punto">·</span>
                  }
                  @if (email()) {
                    <span>{{ email() }}</span>
                  }
                </p>
              }
            </div>

            <div class="boleta__identidad">
              <span class="boleta__tipo">BOLETA DE VENTA</span>
              <strong class="boleta__codigo">{{ numero() }}</strong>
              <span class="boleta__estado">PAGADO</span>
            </div>
          </header>

          <div class="boleta__linea"></div>

          <section class="boleta__datos">
            <div class="boleta__dato">
              <span>Cliente</span>
              <strong>{{ pedido().cliente }}</strong>
            </div>
            <div class="boleta__dato">
              <span>Fecha</span>
              <strong>{{ pedido().fecha | date: 'dd/MM/yyyy HH:mm' }}</strong>
            </div>
            <div class="boleta__dato">
              <span>Pedido</span>
              <strong>#{{ pedido().id }}</strong>
            </div>
            <div class="boleta__dato">
              <span>Método de pago</span>
              <strong>{{ metodoPagoTexto(pedido().metodoPago) }}</strong>
            </div>
          </section>

          <table class="boleta__tabla">
            <thead>
              <tr>
                <th>Producto</th>
                <th class="boleta__col-centro">Cant.</th>
                <th class="boleta__col-derecha">P. unit.</th>
                <th class="boleta__col-derecha">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              @for (detalle of pedido().detalles; track detalle.productoId) {
                <tr>
                  <td>{{ detalle.productoNombre }}</td>
                  <td class="boleta__col-centro">{{ detalle.cantidad }}</td>
                  <td class="boleta__col-derecha">S/ {{ detalle.precioUnitario | number: '1.2-2' }}</td>
                  <td class="boleta__col-derecha">S/ {{ detalle.subtotal | number: '1.2-2' }}</td>
                </tr>
              }
            </tbody>
          </table>

          <section class="boleta__totales">
            <div class="boleta__total">
              <span>Total pagado</span>
              <strong>S/ {{ pedido().total | number: '1.2-2' }}</strong>
            </div>
          </section>

          <footer class="boleta__pie">
            <p>Gracias por tu compra en {{ nombreTienda() }}.</p>
            <p class="boleta__nota">Comprobante simulado sin valor tributario.</p>
          </footer>

          <span class="boleta__filo boleta__filo--inferior"></span>
        </article>

        <div class="boleta-acciones">
          <button type="button" class="boton boton-primario" (click)="descargar()" [disabled]="descargando()">
            {{ descargando() ? 'Generando PDF…' : 'Descargar PDF' }}
          </button>
          <button type="button" class="boton boton-ghost" (click)="cerrarModal()" [disabled]="descargando()">
            Cerrar
          </button>
        </div>

        @if (error()) {
          <p class="boleta-error" role="alert">{{ error() }}</p>
        }
      </div>
    </div>
  `,
  styleUrl: './boleta-modal.component.scss'
})
export class BoletaModalComponent implements OnInit, OnDestroy {
  readonly pedido = input.required<PedidoResponse>();
  readonly configuracion = input<ConfiguracionResponse | null>(null);
  readonly cerrar = output<void>();

  private readonly boletaService = inject(BoletaService);
  private readonly recibo = viewChild.required<ElementRef<HTMLElement>>('recibo');
  private readonly botonCerrar = viewChild<ElementRef<HTMLButtonElement>>('botonCerrar');

  readonly numero = computed(() => numeroBoleta(this.pedido().id));
  readonly nombreTienda = computed(() => this.configuracion()?.nombreTienda?.trim() || 'TechStore');
  readonly direccion = computed(() => this.configuracion()?.direccion?.trim() || '');
  readonly telefono = computed(() => this.configuracion()?.telefono?.trim() || '');
  readonly email = computed(() => this.configuracion()?.emailContacto?.trim() || '');
  readonly metodoPagoTexto = metodoPagoTexto;

  readonly descargando = signal(false);
  readonly capturando = signal(false);
  readonly error = signal('');

  private overflowAnterior = '';

  constructor() {
    afterNextRender(() => this.botonCerrar()?.nativeElement.focus());
  }

  ngOnInit(): void {
    this.overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy(): void {
    document.body.style.overflow = this.overflowAnterior;
  }

  @HostListener('document:keydown.escape')
  cerrarModal(): void {
    if (!this.descargando()) {
      this.cerrar.emit();
    }
  }

  async descargar(): Promise<void> {
    if (this.descargando()) return;

    this.descargando.set(true);
    this.error.set('');
    this.capturando.set(true);

    try {
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
      );
      await this.boletaService.descargar(this.pedido(), this.recibo().nativeElement);
    } catch (e) {
      console.error('No se pudo generar la boleta', e);
      this.error.set('No se pudo generar el PDF. Intenta nuevamente.');
    } finally {
      this.capturando.set(false);
      this.descargando.set(false);
    }
  }
}
