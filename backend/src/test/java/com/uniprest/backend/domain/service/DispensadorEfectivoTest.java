package com.uniprest.backend.domain.service;

import com.uniprest.backend.domain.exception.ReglaNegocioException;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class DispensadorEfectivoTest {

    @Test
    void entregaMenorCantidadDeBilletes() {
        assertEquals(Map.of(100_000L, 2, 50_000L, 1, 20_000L, 1, 10_000L, 1), DispensadorEfectivo.calcular(280_000));
        assertEquals(Map.of(50_000L, 1, 20_000L, 2), DispensadorEfectivo.calcular(90_000));
        assertEquals(Map.of(20_000L, 2), DispensadorEfectivo.calcular(40_000));
        assertEquals(Map.of(100_000L, 10), DispensadorEfectivo.calcular(1_000_000));
    }

    @Test
    void rechazaMontosQueNoSePuedenArmar() {
        assertThrows(ReglaNegocioException.class, () -> DispensadorEfectivo.calcular(15_000));
        assertThrows(ReglaNegocioException.class, () -> DispensadorEfectivo.calcular(10_500));
    }
}
