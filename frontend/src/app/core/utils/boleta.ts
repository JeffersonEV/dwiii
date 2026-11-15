export function numeroBoleta(pedidoId: number): string {
  return `B001-${String(pedidoId).padStart(8, '0')}`;
}

export function nombreArchivoBoleta(pedidoId: number): string {
  return `boleta-${numeroBoleta(pedidoId)}.pdf`;
}
