package com.uniprest.backend.infrastructure.persistence;

import com.uniprest.backend.domain.model.Transaccion;
import com.uniprest.backend.domain.repository.TransaccionRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public class TransaccionRepositoryImpl implements TransaccionRepository {
    private final TransaccionJpaRepository jpa;
    public TransaccionRepositoryImpl(TransaccionJpaRepository jpa) { this.jpa = jpa; }

    @Override public Transaccion guardar(Transaccion t) { return jpa.save(t); }
    @Override public List<Transaccion> listarPorCuenta(Long id) { return jpa.findByCuentaIdOrderByFechaDesc(id); }
    @Override public long totalRetiradoDesde(Long id, LocalDateTime desde) { return jpa.totalRetiradoDesde(id, desde); }
}
