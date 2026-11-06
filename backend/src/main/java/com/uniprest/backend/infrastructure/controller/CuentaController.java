package com.uniprest.backend.infrastructure.controller;

import com.uniprest.backend.application.usecase.CuentaService;
import com.uniprest.backend.application.usecase.Dtos.*;
import com.uniprest.backend.domain.model.Transaccion;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class CuentaController {
    private final CuentaService service;
    public CuentaController(CuentaService service) { this.service = service; }

    @PostMapping("/cuentas")
    public ResponseEntity<CuentaDto> registrar(@RequestBody RegistroReq r) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.registrar(r));
    }
    @PostMapping("/auth/login")
    public CuentaDto login(@RequestBody LoginReq r) { return service.login(r); }

    @GetMapping("/cuentas/{id}")
    public CuentaDto consultar(@PathVariable Long id) { return service.obtener(id); }

    @PutMapping("/cuentas/{id}/datos")
    public CuentaDto datos(@PathVariable Long id, @RequestBody DatosReq r) { return service.actualizarDatos(id, r); }

    @PutMapping("/cuentas/{id}/credenciales")
    public CuentaDto credenciales(@PathVariable Long id, @RequestBody CredencialesReq r) {
        return service.cambiarCredenciales(id, r);
    }
    @PostMapping("/cuentas/{id}/depositos")
    public CuentaDto depositar(@PathVariable Long id, @RequestBody MontoReq r) { return service.depositar(id, r.monto()); }

    @PostMapping("/cuentas/{id}/retiros")
    public RetiroRes retirar(@PathVariable Long id, @RequestBody RetiroReq r) { return service.retirar(id, r.monto(), r.pin()); }

    @GetMapping("/cuentas/{id}/transacciones")
    public List<Transaccion> movimientos(@PathVariable Long id) { return service.movimientos(id); }
}
