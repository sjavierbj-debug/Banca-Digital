# Banca Digital – Parcial Final Análisis y Diseño de Sistemas

Plataforma de banca digital: consulta de saldo, depósito, actualización de datos, cambio de credenciales y retiro de efectivo simulando un cajero automático.

- `backend/`  Spring Boot 4 · Java 21 · PostgreSQL · arquitectura limpia
- `frontend/` React + Vite
- `docs/`     Ciclo de vida, requisitos, historias de usuario, arquitectura, Git y diagramas UML (`docs/uml`)
- `docs/postman/` Colección de Postman con las pruebas de los endpoints

Índice de la documentación: [docs/00_LEEME.md](docs/00_LEEME.md)

## Ejecución

**1. Base de datos:** PostgreSQL en `localhost:5432` con una base llamada `uniprest_db` (las tablas se crean solas).

**2. Backend** (puerto 8080), desde `backend/`:
```bash
export DB_PASSWORD="tu_contraseña"     # Windows PowerShell: $env:DB_PASSWORD="tu_contraseña"
./mvnw spring-boot:run                  # Windows: .\mvnw.cmd spring-boot:run
```
Comprobación: `GET http://localhost:8080/api/health`

**3. Frontend** (puerto 5173), desde `frontend/`:
```bash
npm install
npm run dev
```

## Endpoints (`http://localhost:8080/api`)

| Método | Ruta | Descripción |
|---|---|---|
| POST | /cuentas | Crear cuenta (nombre, documento, correo, telefono, direccion, clave, pin) |
| POST | /auth/login | Ingresar (documento, clave) |
| GET | /cuentas/{id} | Consultar saldo y datos |
| POST | /cuentas/{id}/depositos | Depositar `{ "monto": 100000 }` |
| POST | /cuentas/{id}/retiros | Retirar `{ "monto": 280000, "pin": "1234" }` |
| PUT | /cuentas/{id}/datos | Actualizar correo, teléfono y dirección |
| PUT | /cuentas/{id}/credenciales | Cambiar clave y/o PIN |
| GET | /cuentas/{id}/transacciones | Historial |

**Reglas del retiro:** PIN de 4 dígitos · mínimo $10.000 · tope diario $1.000.000 · menor cantidad de billetes ($100.000, $50.000, $20.000, $10.000) · si el monto no se puede armar, se rechaza con el motivo exacto. Los errores responden `{ "mensaje": "..." }`.

Ejemplo: retirar `280000` entrega 2 × $100.000, 1 × $50.000, 1 × $20.000 y 1 × $10.000.

## Pruebas
- Unitaria del algoritmo de billetes: `cd backend && ./mvnw test -Dtest=DispensadorEfectivoTest`
- Endpoints: importar `docs/postman/BancaDigital.postman_collection.json` en Postman.

## Ramas
`feature` (desarrollo) → `develop` (integración) → `main` (entrega). Ver [docs/05_flujo_git.md](docs/05_flujo_git.md).
