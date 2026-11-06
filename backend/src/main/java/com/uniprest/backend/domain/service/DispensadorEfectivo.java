package com.uniprest.backend.domain.service;

import com.uniprest.backend.domain.exception.ReglaNegocioException;
import java.util.LinkedHashMap;
import java.util.Map;

/** Calcula la menor cantidad de billetes posible (algoritmo voraz, óptimo para estas denominaciones). */
public final class DispensadorEfectivo {
    public static final long[] DENOMINACIONES = {100_000, 50_000, 20_000, 10_000};

    private DispensadorEfectivo() {}

    public static Map<Long, Integer> calcular(long monto) {
        Map<Long, Integer> billetes = new LinkedHashMap<>();
        long resto = monto;
        for (long d : DENOMINACIONES) {
            int n = (int) (resto / d);
            if (n > 0) { billetes.put(d, n); resto -= n * d; }
        }
        if (resto != 0) {
            throw new ReglaNegocioException("No se puede entregar ese monto: debe poder armarse exactamente "
                    + "con billetes de $100.000, $50.000, $20.000 y $10.000 (quedarían $" + resto + " sin entregar).");
        }
        return billetes;
    }
}
