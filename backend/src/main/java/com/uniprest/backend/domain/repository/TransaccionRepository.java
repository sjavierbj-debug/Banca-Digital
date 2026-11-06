package com.uniprest.backend.domain.repository;

import com.uniprest.backend.domain.model.Transaccion;
import java.time.LocalDateTime;
import java.util.List;

public interface TransaccionRepository {
    Transaccion guardar(Transaccion transaccion);
    List<Transaccion> listarPorCuenta(Long cuentaId);
    long totalRetiradoDesde(Long cuentaId, LocalDateTime desde);
}
