package com.uniprest.backend.infrastructure.persistence;

import com.uniprest.backend.domain.model.Cuenta;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CuentaJpaRepository extends JpaRepository<Cuenta, Long> {
    Optional<Cuenta> findByDocumento(String documento);
}
