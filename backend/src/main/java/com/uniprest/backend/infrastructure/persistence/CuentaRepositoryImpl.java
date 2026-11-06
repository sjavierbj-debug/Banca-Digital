package com.uniprest.backend.infrastructure.persistence;

import com.uniprest.backend.domain.model.Cuenta;
import com.uniprest.backend.domain.repository.CuentaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public class CuentaRepositoryImpl implements CuentaRepository {
    private final CuentaJpaRepository jpa;
    public CuentaRepositoryImpl(CuentaJpaRepository jpa) { this.jpa = jpa; }

    @Override public Cuenta guardar(Cuenta c) { return jpa.save(c); }
    @Override public Optional<Cuenta> buscarPorId(Long id) { return jpa.findById(id); }
    @Override public Optional<Cuenta> buscarPorDocumento(String d) { return jpa.findByDocumento(d); }
}
