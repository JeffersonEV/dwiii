import { MetodoPago } from '../models/models';

export interface OpcionMetodoPago {
  valor: MetodoPago;
  etiqueta: string;
}

export const METODOS_PAGO: OpcionMetodoPago[] = [
  { valor: 'YAPE', etiqueta: 'Yape' },
  { valor: 'PLIN', etiqueta: 'Plin' },
  { valor: 'TARJETA', etiqueta: 'Tarjeta de crédito/débito' },
  { valor: 'TRANSFERENCIA', etiqueta: 'Transferencia bancaria' },
  { valor: 'CONTRA_ENTREGA', etiqueta: 'Pago contra entrega' }
];

export function metodoPagoTexto(metodo: MetodoPago | null | undefined): string {
  return METODOS_PAGO.find((m) => m.valor === metodo)?.etiqueta ?? 'No especificado';
}
