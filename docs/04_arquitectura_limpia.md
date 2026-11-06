# 4. Arquitectura limpia del backend

## 4.1 Capas

Las dependencias apuntan siempre **hacia el dominio**: el dominio no conoce a Spring MVC ni a la forma de persistir.

| Capa | Paquete | Contenido |
|---|---|---|
| Dominio | `domain.model` | `Cuenta`, `Transaccion` (entidades) |
| | `domain.repository` | Puertos: `CuentaRepository`, `TransaccionRepository` (interfaces) |
| | `domain.service` | `DispensadorEfectivo`: algoritmo de billetes, sin dependencias externas |
| | `domain.exception` | `ReglaNegocioException` |
| Aplicación | `application.usecase` | `CuentaService` (casos de uso y reglas del retiro), `Dtos` |
| Infraestructura | `infrastructure.controller` | `CuentaController` (REST), `ManejadorErrores` |
| | `infrastructure.persistence` | Adaptadores: `CuentaRepositoryImpl`, `TransaccionRepositoryImpl` y los repositorios Spring Data JPA |

```
Controller ──▶ CuentaService ──▶ CuentaRepository (interfaz, dominio)
                    │                    ▲
                    ▼                    │ implementa
          DispensadorEfectivo     CuentaRepositoryImpl ──▶ JPA ──▶ PostgreSQL
```

## 4.2 Decisiones

- **Puertos y adaptadores:** el servicio depende de las interfaces del dominio; las implementaciones JPA se inyectan desde infraestructura. Cambiar la base de datos no afecta las reglas.
- **Regla del cajero en el dominio:** `DispensadorEfectivo` no usa Spring ni la base de datos, por eso se prueba con una prueba unitaria simple. El algoritmo voraz es óptimo para las denominaciones $100.000, $50.000, $20.000 y $10.000.
- **Errores controlados:** `ReglaNegocioException` lleva un código HTTP y un mensaje; `ManejadorErrores` lo convierte en `{ "mensaje": "..." }`.
- **Transacciones:** depósito y retiro se ejecutan con `@Transactional`.
- **Compromiso asumido:** las entidades llevan anotaciones JPA dentro de `domain.model` para no duplicar clases. Una versión más estricta separaría el modelo de dominio de las entidades de persistencia.

## 4.3 Flujo del retiro

1. `CuentaController` recibe `POST /api/cuentas/{id}/retiros` con monto y PIN.
2. `CuentaService.retirar` valida en este orden: formato del PIN, PIN correcto, monto mínimo, fraccionamiento (`DispensadorEfectivo`), tope diario (suma de retiros del día) y saldo.
3. Si todo es válido, descuenta el saldo, guarda la transacción y responde con los billetes a entregar.
4. Si alguna regla falla, lanza `ReglaNegocioException` y el usuario recibe el motivo exacto.

Ver el [diagrama de secuencia](uml/secuencia_retiro.png) y el [diagrama de clases](uml/clases.png).
