import { Injectable } from '@angular/core';
import { PedidoResponse } from '../models/models';
import { nombreArchivoBoleta } from '../utils/boleta';

@Injectable({ providedIn: 'root' })
export class BoletaService {
  async descargar(pedido: PedidoResponse, recibo: HTMLElement): Promise<void> {
    const [{ jsPDF }, html2canvas] = await Promise.all([
      import('jspdf'),
      import('html2canvas').then((modulo) => modulo.default)
    ]);

    if (document.fonts?.ready) {
      await document.fonts.ready;
    }

    const canvas = await html2canvas(recibo, {
      backgroundColor: '#ffffff',
      scale: 3,
      useCORS: true,
      logging: false
    });

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const anchoPagina = pdf.internal.pageSize.getWidth();
    const altoPagina = pdf.internal.pageSize.getHeight();
    const margen = 8;
    const anchoMaximo = anchoPagina - margen * 2;
    const altoMaximo = altoPagina - margen * 2;

    let ancho = anchoMaximo;
    let alto = (canvas.height * ancho) / canvas.width;
    if (alto > altoMaximo) {
      alto = altoMaximo;
      ancho = (canvas.width * alto) / canvas.height;
    }

    pdf.addImage(
      canvas.toDataURL('image/jpeg', 0.95),
      'JPEG',
      (anchoPagina - ancho) / 2,
      margen,
      ancho,
      alto,
      undefined,
      'FAST'
    );

    pdf.save(nombreArchivoBoleta(pedido.id));
  }
}
