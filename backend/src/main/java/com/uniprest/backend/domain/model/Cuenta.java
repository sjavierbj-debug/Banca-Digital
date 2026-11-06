package com.uniprest.backend.domain.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "cuentas")
@Getter @Setter @NoArgsConstructor
public class Cuenta {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 100) private String nombre;
    @Column(nullable = false, unique = true, length = 30) private String documento;
    @Column(nullable = false, length = 120) private String correo;
    @Column(length = 30) private String telefono;
    @Column(length = 200) private String direccion;
    @Column(nullable = false, length = 64) private String claveHash;
    @Column(nullable = false, length = 64) private String pinHash;
    @Column(nullable = false) private long saldo;
}
