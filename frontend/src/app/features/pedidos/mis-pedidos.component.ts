import { Component, DestroyRef, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, interval } from 'rxjs';
import { PedidoService } from '../../core/services/pedido.service';
import { ConfiguracionService } from '../../core/services/configuracion.service';
import { AuthService } from '../../core/services/auth.service';
import { ConfiguracionResponse, PedidoResponse } from '../../core/models/models';
import { BoletaModalComponent } from '../../shared/components/boleta-modal/boleta-modal.component';
import { metodoPagoTexto } from '../../core/utils/pago';

@Component({
  selector: 'app-mis-pedidos',
  imports: [RouterLink, DecimalPipe, DatePipe, BoletaModalComponent],
  template: `
    <h1 class="titulo-pagina">Mis pedidos</h1>
    <p class="subtitulo-pagina">Historial de tus compras en TechStore.</p>

    @if (error()) {
      <div class="mensaje-error">{{ error() }}</div>
    }

    @if (cargando()) {
      <div class="cargando"><div class="spinner"></div>Cargando pedidos…</div>
    } @else if (pedidos().length === 0) {
      <div class="vacio">
        <p>Aún no has realizado pedidos.</p>
        <a routerLink="/catalogo" class="boton boton-primario" style="margin-top: 14px">Ver catálogo</a>
      </div>
    } @else {
      <div class="lista">
        @for (pedido of pedidos(); track pedido.id; let idx = $index) {
          <article class="tarjeta pedido">
            <div class="pedido__cabecera">
              <div>
                <strong>Pedido #{{ pedido.id }}</strong>
                <span class="pedido__fecha">· {{ pedido.fecha | date: 'dd/MM/yyyy HH:mm' }}</span>
                <span class="pedido__pago">Pago: {{ metodoPagoTexto(pedido.metodoPago) }}</span>
              </div>
              <span [class]="'badge badge-' + (pedido.estado === 'PENDIENTE' ? 'pendiente' : pedido.estado === 'PAGADO' ? 'pagado' : 'cancelado')">
                {{ pedido.estado }}
              </span>
            </div>

            <table class="pedido__detalles">
              <tbody>
                @for (d of pedido.detalles; track d.productoId) {
                  <tr>
                    <td>{{ d.productoNombre }}</td>
                    <td class="pedido__cantidad">x{{ d.cantidad }}</td>
                    <td class="pedido__derecha">S/ {{ d.subtotal | number: '1.2-2' }}</td>
                  </tr>
                }
              </tbody>
            </table>

            @if (pedido.estado === 'PENDIENTE') {
              <p class="pedido__aviso">
                Pago pendiente de confirmación. Puedes cancelar el pedido mientras siga en este estado.
              </p>
            }

            <div class="pedido__pie">
              <strong>Total: S/ {{ pedido.total | number: '1.2-2' }}</strong>
              @if (pedido.estado === 'PENDIENTE') {
                <button class="boton boton-peligro boton-sm" [disabled]="cancelando() === pedido.id" (click)="cancelar(pedido)">
                  {{ cancelando() === pedido.id ? 'Cancelando…' : 'Cancelar pedido' }}
                </button>
              }
              @if (pedido.estado === 'PAGADO') {
                <button class="boton boton-exito boton-sm" (click)="verBoleta(pedido)">Ver boleta</button>
              }
            </div>
          </article>
        }
      </div>
    }

    @if (boleta(); as pedidoBoleta) {
      <app-boleta-modal
        [pedido]="pedidoBoleta"
        [configuracion]="configuracion()"
        (cerrar)="cerrarBoleta()" />
    }
  `,
  styleUrl: './mis-pedidos.component.scss'
})
export class MisPedidosComponent implements OnInit {
  private pedidoService = inject(PedidoService);
  private configuracionService = inject(ConfiguracionService);
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);

  readonly metodoPagoTexto = metodoPagoTexto;
  readonly pedidos: WritableSignal<PedidoResponse[]> = signal([]);
  readonly cargando = signal(true);
  readonly error = signal('');
  readonly cancelando = signal<number | null>(null);
  readonly configuracion = signal<ConfiguracionResponse | null>(null);
  readonly boleta = signal<PedidoResponse | null>(null);

  ngOnInit(): void {
    this.cargarConfiguracion();
    this.cargar();
    interval(15000)
      .pipe(
        filter(() => document.visibilityState === 'visible'),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.refrescar());
  }

  cargar(): void {
    this.cargando.set(true);
    this.pedidoService.misPedidos().subscribe({
      next: (p) => {
        this.pedidos.set(p);
        this.cargando.set(false);
        this.revisarBoletas(p);
      },
      error: () => this.cargando.set(false)
    });
  }

  verBoleta(pedido: PedidoResponse): void {
    if (pedido.estado !== 'PAGADO') return;
    this.marcarVista(pedido.id);
    this.boleta.set(pedido);
  }

  cerrarBoleta(): void {
    this.boleta.set(null);
  }

  cancelar(pedido: PedidoResponse): void {
    if (!confirm(`¿Cancelar el pedido #${pedido.id}? Se restaurará el stock.`)) return;
    this.cancelando.set(pedido.id);
    this.error.set('');
    this.pedidoService.cancelar(pedido.id).subscribe({
      next: (actualizado) => {
        this.cancelando.set(null);
        this.pedidos.set(this.pedidos().map((p) => (p.id === actualizado.id ? actualizado : p)));
      },
      error: (err) => {
        this.cancelando.set(null);
        this.error.set(err.error?.mensaje ?? 'No se pudo cancelar el pedido.');
      }
    });
  }

  private cargarConfiguracion(): void {
    this.configuracionService.obtener().subscribe({
      next: (configuracion) => this.configuracion.set(configuracion),
      error: () => this.configuracion.set(null)
    });
  }

  private refrescar(): void {
    if (this.cargando()) return;
    this.pedidoService.misPedidos().subscribe({
      next: (p) => {
        this.pedidos.set(p);
        this.revisarBoletas(p);
      },
      error: () => undefined
    });
  }

  private revisarBoletas(pedidos: PedidoResponse[]): void {
    if (this.boleta()) return;

    const pagados = pedidos.filter((p) => p.estado === 'PAGADO');
    if (pagados.length === 0) return;

    const vistas = this.leerVistas();
    const nueva = pagados
      .filter((p) => !vistas.includes(p.id))
      .sort((a, b) => b.id - a.id)[0];

    this.guardarVistas([...new Set([...vistas, ...pagados.map((p) => p.id)])]);

    if (nueva) {
      this.boleta.set(nueva);
    }
  }

  private claveVistas(): string {
    return `techstore_boletas_vistas_${this.authService.user()?.id ?? 'anon'}`;
  }

  private leerVistas(): number[] {
    try {
      const raw = localStorage.getItem(this.claveVistas());
      const valores = raw ? JSON.parse(raw) : [];
      return Array.isArray(valores) ? valores.filter((n): n is number => typeof n === 'number') : [];
    } catch {
      return [];
    }
  }

  private guardarVistas(ids: number[]): void {
    try {
      localStorage.setItem(this.claveVistas(), JSON.stringify(ids));
    } catch {
      return;
    }
  }

  private marcarVista(id: number): void {
    const vistas = this.leerVistas();
    if (!vistas.includes(id)) {
      this.guardarVistas([...vistas, id]);
    }
  }
}