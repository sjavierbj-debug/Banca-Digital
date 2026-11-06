package com.uniprest.backend.infrastructure.persistence;

import com.uniprest.backend.domain.model.Transaccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface TransaccionJpaRepository extends JpaRepository<Transaccion, Long> {
    List<Transaccion> findByCuentaIdOrderByFechaDesc(Long cuentaId);

    @Query("select coalesce(sum(t.monto), 0) from Transaccion t "
         + "where t.cuentaId = :cuentaId and t.tipo = 'RETIRO' and t.fecha >= :desde")
    long totalRetiradoDesde(@Param("cuentaId") Long cuentaId, @Param("desde") LocalDateTime desde);
}
