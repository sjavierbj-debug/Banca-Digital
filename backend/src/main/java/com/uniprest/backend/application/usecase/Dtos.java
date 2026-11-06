package com.uniprest.backend.application.usecase;

import com.uniprest.backend.domain.model.Cuenta;
import java.util.Map;

public final class Dtos {
    private Dtos() {}

    public record RegistroReq(String nombre, String documento, String correo, String telefono,
                              String direccion, String clave, String pin) {}
    public record LoginReq(String documento, String clave) {}
    public record DatosReq(String correo, String telefono, String direccion) {}
    public record CredencialesReq(String claveActual, String claveNueva, String pinNuevo) {}
    public record MontoReq(long monto) {}
    public record RetiroReq(long monto, String pin) {}

    public record CuentaDto(Long id, String nombre, String documento, String correo,
                            String telefono, String direccion, long saldo) {
        public static CuentaDto de(Cuenta c) {
            return new CuentaDto(c.getId(), c.getNombre(), c.getDocumento(), c.getCorreo(),
                    c.getTelefono(), c.getDireccion(), c.getSaldo());
        }
    }
    public record RetiroRes(long montoRetirado, long saldo, long retiradoHoy, Map<Long, Integer> billetes) {}
}
