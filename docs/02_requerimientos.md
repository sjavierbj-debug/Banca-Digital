# 2. Elicitación y especificación de requisitos

## 2.1 Elicitación

**Fuente principal:** situación problema del parcial (institución financiera que requiere una plataforma de banca digital con interfaz web y API REST).

| Técnica | Aplicación |
|---|---|
| Análisis documental | Lectura del enunciado y extracción de operaciones y reglas numéricas. |
| Identificación de interesados | Cliente del banco, administrador de la entidad, equipo de desarrollo, evaluador. |
| Lluvia de ideas | Definición de datos del titular y de los mensajes de rechazo. |
| Prototipado | Pantallas en React para validar el flujo de retiro. |

**Interesados**

| Interesado | Necesidad |
|---|---|
| Cliente | Operar su cuenta de forma autónoma y segura. |
| Entidad financiera | Cumplir políticas de seguridad y límites del cajero. |
| Equipo de desarrollo | Reglas claras, API documentada y código mantenible. |

**Supuestos tomados**

1. Cada cliente tiene una cuenta, identificada por su documento.
2. El tope diario se calcula sobre la suma de **retiros** del día calendario del servidor.
3. La "clave de acceso" (ingreso) y el "PIN" (retiros, 4 dígitos) son credenciales distintas.
4. Los montos son enteros en COP (sin centavos).

## 2.2 Requisitos funcionales

| ID | Requisito | Prioridad | Historia |
|---|---|---|---|
| RF-01 | Registrar una cuenta con nombre, documento, correo, teléfono, dirección, clave y PIN. | Alta | HU-01 |
| RF-02 | Autenticar al usuario con documento y clave. | Alta | HU-02 |
| RF-03 | Consultar el saldo disponible de la cuenta. | Alta | HU-03 |
| RF-04 | Depositar fondos e incrementar el saldo (monto mayor a 0). | Alta | HU-04 |
| RF-05 | Actualizar correo, teléfono y dirección del titular. | Media | HU-05 |
| RF-06 | Cambiar la clave de acceso, validando la clave actual. | Media | HU-06 |
| RF-07 | Cambiar el PIN de retiros, validando la clave actual. | Media | HU-06 |
| RF-08 | Retirar efectivo simulando un cajero automático. | Alta | HU-07 |
| RF-09 | Rechazar todo retiro si el PIN no es correcto o no tiene exactamente 4 dígitos. | Alta | HU-07 |
| RF-10 | Rechazar retiros menores a $10.000 COP o mayores al saldo. | Alta | HU-08 |
| RF-11 | Rechazar el retiro si la suma retirada en el día supera $1.000.000 COP. | Alta | HU-09 |
| RF-12 | Calcular la entrega con la menor cantidad de billetes de $100.000, $50.000, $20.000 y $10.000. | Alta | HU-10 |
| RF-13 | Denegar de forma controlada los montos que no se pueden fraccionar y explicar el motivo exacto. | Alta | HU-10 |
| RF-14 | Consultar el historial de depósitos y retiros. | Media | HU-11 |

## 2.3 Reglas de negocio

| ID | Regla |
|---|---|
| RN-01 | El documento de cada cuenta es único. |
| RN-02 | El PIN tiene exactamente 4 dígitos numéricos. |
| RN-03 | Retiro mínimo: $10.000 COP. |
| RN-04 | Tope diario de retiros por usuario: $1.000.000 COP (acumulado). |
| RN-05 | Denominaciones disponibles: $100.000, $50.000, $20.000 y $10.000. |
| RN-06 | Un monto es entregable solo si es múltiplo de $10.000. |
| RN-07 | No se puede retirar más del saldo disponible. |
| RN-08 | Orden de validación del retiro: PIN → mínimo → fraccionamiento → tope diario → saldo. |

## 2.4 Requisitos no funcionales

| ID | Categoría | Requisito | Cómo se cumple / verifica |
|---|---|---|---|
| RNF-01 | Arquitectura | Backend con arquitectura limpia (dominio, aplicación, infraestructura). | Estructura de paquetes y [documento de arquitectura](04_arquitectura_limpia.md). |
| RNF-02 | Interoperabilidad | API REST con JSON y CORS habilitado para el frontend. | `@CrossOrigin`, respuestas JSON. |
| RNF-03 | Seguridad | Clave y PIN no se almacenan en texto plano ni se devuelven en las respuestas. | Hash SHA-256; los DTO no exponen credenciales. |
| RNF-04 | Integridad | Depósito y retiro son atómicos. | `@Transactional` en el servicio. |
| RNF-05 | Usabilidad | Mensajes de rechazo claros y específicos. | Respuestas `{ "mensaje": "..." }` mostradas en pantalla. |
| RNF-06 | Mantenibilidad | Reglas del cajero aisladas y probadas. | `DispensadorEfectivo` + prueba unitaria. |
| RNF-07 | Portabilidad | Ejecución en Windows, macOS y Linux. | Java 21, Maven Wrapper, Node.js. |
| RNF-08 | Trazabilidad | Registro de cada transacción con fecha y saldo posterior. | Tabla `transacciones`. |
| RNF-09 | Calidad del repositorio | Ramas `main`, `develop` y `feature`. | [Flujo de Git](05_flujo_git.md). |

## 2.5 Trazabilidad

| Requisito | Endpoint | Clase principal |
|---|---|---|
| RF-01 | `POST /api/cuentas` | `CuentaService.registrar` |
| RF-02 | `POST /api/auth/login` | `CuentaService.login` |
| RF-03 | `GET /api/cuentas/{id}` | `CuentaService.obtener` |
| RF-04 | `POST /api/cuentas/{id}/depositos` | `CuentaService.depositar` |
| RF-05 | `PUT /api/cuentas/{id}/datos` | `CuentaService.actualizarDatos` |
| RF-06, RF-07 | `PUT /api/cuentas/{id}/credenciales` | `CuentaService.cambiarCredenciales` |
| RF-08 a RF-13 | `POST /api/cuentas/{id}/retiros` | `CuentaService.retirar`, `DispensadorEfectivo` |
| RF-14 | `GET /api/cuentas/{id}/transacciones` | `CuentaService.movimientos` |
