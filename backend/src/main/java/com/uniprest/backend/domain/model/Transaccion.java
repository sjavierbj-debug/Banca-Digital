package com.uniprest.backend.domain.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "transacciones")
@Getter @Setter @NoArgsConstructor
public class Transaccion {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false) private Long cuentaId;
    @Column(nullable = false, length = 20) private String tipo; // DEPOSITO | RETIRO
    @Column(nullable = false) private long monto;
    @Column(nullable = false) private long saldoPosterior;
    @Column(nullable = false) private LocalDateTime fecha;

    public Transaccion(Long cuentaId, String tipo, long monto, long saldoPosterior) {
        this.cuentaId = cuentaId; this.tipo = tipo; this.monto = monto;
        this.saldoPosterior = saldoPosterior; this.fecha = LocalDateTime.now();
    }
}
