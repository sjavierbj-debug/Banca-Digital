package com.uniprest.backend.domain.repository;

import com.uniprest.backend.domain.model.Cuenta;
import java.util.Optional;

public interface CuentaRepository {
    Cuenta guardar(Cuenta cuenta);
    Optional<Cuenta> buscarPorId(Long id);
    Optional<Cuenta> buscarPorDocumento(String documento);
}
