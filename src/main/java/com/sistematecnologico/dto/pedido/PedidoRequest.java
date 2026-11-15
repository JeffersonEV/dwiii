package com.sistematecnologico.dto.pedido;

import com.sistematecnologico.entity.MetodoPago;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record PedidoRequest(
        @NotEmpty(message = "El pedido debe contener al menos un producto")
        List<@Valid PedidoItemRequest> items,

        @NotNull(message = "Selecciona un metodo de pago")
        MetodoPago metodoPago
) {
    public PedidoRequest(List<PedidoItemRequest> items) {
        this(items, MetodoPago.CONTRA_ENTREGA);
    }
}
