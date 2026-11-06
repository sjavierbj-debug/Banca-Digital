package com.uniprest.backend.application.usecase;

import com.uniprest.backend.application.usecase.Dtos.*;
import com.uniprest.backend.domain.exception.ReglaNegocioException;
import com.uniprest.backend.domain.model.Cuenta;
import com.uniprest.backend.domain.model.Transaccion;
import com.uniprest.backend.domain.repository.CuentaRepository;
import com.uniprest.backend.domain.repository.TransaccionRepository;
import com.uniprest.backend.domain.service.DispensadorEfectivo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDate;
import java.util.HexFormat;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class CuentaService {
    static final long TOPE_DIARIO = 1_000_000;
    static final long RETIRO_MINIMO = 10_000;

    private final CuentaRepository cuentas;
    private final TransaccionRepository transacciones;

    public CuentaService(CuentaRepository cuentas, TransaccionRepository transacciones) {
        this.cuentas = cuentas;
        this.transacciones = transacciones;
    }

    public CuentaDto registrar(RegistroReq r) {
        vacio(r.nombre(), "El nombre es obligatorio.");
        vacio(r.documento(), "El documento es obligatorio.");
        validarCorreo(r.correo());
        validarClave(r.clave());
        validarPin(r.pin());
        if (cuentas.buscarPorDocumento(r.documento().trim()).isPresent())
            throw new ReglaNegocioException("Ya existe una cuenta con ese documento.", 409);
        Cuenta c = new Cuenta();
        c.setNombre(r.nombre().trim());
        c.setDocumento(r.documento().trim());
        c.setCorreo(r.correo().trim());
        c.setTelefono(r.telefono());
        c.setDireccion(r.direccion());
        c.setClaveHash(hash(r.clave()));
        c.setPinHash(hash(r.pin()));
        c.setSaldo(0);
        return CuentaDto.de(cuentas.guardar(c));
    }

    public CuentaDto login(LoginReq r) {
        Cuenta c = r.documento() == null ? null : cuentas.buscarPorDocumento(r.documento().trim()).orElse(null);
        if (c == null || r.clave() == null || !hash(r.clave()).equals(c.getClaveHash()))
            throw new ReglaNegocioException("Documento o clave incorrectos.", 401);
        return CuentaDto.de(c);
    }

    public CuentaDto obtener(Long id) { return CuentaDto.de(buscar(id)); }

    public CuentaDto actualizarDatos(Long id, DatosReq r) {
        validarCorreo(r.correo());
        Cuenta c = buscar(id);
        c.setCorreo(r.correo().trim());
        c.setTelefono(r.telefono());
        c.setDireccion(r.direccion());
        return CuentaDto.de(cuentas.guardar(c));
    }

    public CuentaDto cambiarCredenciales(Long id, CredencialesReq r) {
        Cuenta c = buscar(id);
        if (r.claveActual() == null || !hash(r.claveActual()).equals(c.getClaveHash()))
            throw new ReglaNegocioException("La clave actual es incorrecta.", 401);
        boolean hayClave = r.claveNueva() != null && !r.claveNueva().isBlank();
        boolean hayPin = r.pinNuevo() != null && !r.pinNuevo().isBlank();
        if (!hayClave && !hayPin) throw new ReglaNegocioException("Indica una clave nueva o un PIN nuevo.");
        if (hayClave) { validarClave(r.claveNueva()); c.setClaveHash(hash(r.claveNueva())); }
        if (hayPin) { validarPin(r.pinNuevo()); c.setPinHash(hash(r.pinNuevo())); }
        return CuentaDto.de(cuentas.guardar(c));
    }

    @Transactional
    public CuentaDto depositar(Long id, long monto) {
        if (monto <= 0) throw new ReglaNegocioException("El monto a depositar debe ser mayor a $0.");
        Cuenta c = buscar(id);
        c.setSaldo(c.getSaldo() + monto);
        cuentas.guardar(c);
        transacciones.guardar(new Transaccion(id, "DEPOSITO", monto, c.getSaldo()));
        return CuentaDto.de(c);
    }

    @Transactional
    public RetiroRes retirar(Long id, long monto, String pin) {
        Cuenta c = buscar(id);
        validarPin(pin);
        if (!hash(pin).equals(c.getPinHash()))
            throw new ReglaNegocioException("PIN incorrecto. El retiro no fue procesado.", 401);
        if (monto < RETIRO_MINIMO)
            throw new ReglaNegocioException("El monto mínimo de retiro es $" + cop(RETIRO_MINIMO) + " COP.");
        Map<Long, Integer> billetes = DispensadorEfectivo.calcular(monto);
        long hoy = transacciones.totalRetiradoDesde(id, LocalDate.now().atStartOfDay());
        if (hoy + monto > TOPE_DIARIO)
            throw new ReglaNegocioException("Superas el tope diario de $" + cop(TOPE_DIARIO) + " COP. Hoy has retirado $"
                    + cop(hoy) + " y solo puedes retirar $" + cop(TOPE_DIARIO - hoy) + " más.");
        if (monto > c.getSaldo())
            throw new ReglaNegocioException("Saldo insuficiente. Tu saldo es $" + cop(c.getSaldo()) + " COP.");
        c.setSaldo(c.getSaldo() - monto);
        cuentas.guardar(c);
        transacciones.guardar(new Transaccion(id, "RETIRO", monto, c.getSaldo()));
        return new RetiroRes(monto, c.getSaldo(), hoy + monto, billetes);
    }

    public List<Transaccion> movimientos(Long id) {
        buscar(id);
        return transacciones.listarPorCuenta(id);
    }

    // ---- utilidades ----
    private Cuenta buscar(Long id) {
        return cuentas.buscarPorId(id).orElseThrow(() -> new ReglaNegocioException("Cuenta no encontrada.", 404));
    }
    private static void vacio(String v, String msg) { if (v == null || v.isBlank()) throw new ReglaNegocioException(msg); }
    private static void validarCorreo(String v) {
        if (v == null || !v.contains("@")) throw new ReglaNegocioException("Ingresa un correo electrónico válido.");
    }
    private static void validarClave(String v) {
        if (v == null || v.length() < 6) throw new ReglaNegocioException("La clave debe tener al menos 6 caracteres.");
    }
    private static void validarPin(String v) {
        if (v == null || !v.matches("\\d{4}")) throw new ReglaNegocioException("El PIN debe tener exactamente 4 dígitos numéricos.");
    }
    private static String cop(long v) { return String.format(Locale.GERMANY, "%,d", v); }
    private static String hash(String s) {
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(s.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception e) { throw new IllegalStateException(e); }
    }
}
