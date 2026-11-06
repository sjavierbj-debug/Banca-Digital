# 1. Ciclo de vida del software

## 1.1 Modelo elegido: iterativo e incremental con prácticas ágiles

El proyecto se desarrolló en **tres iteraciones cortas**, cada una con un incremento funcional que se puede ejecutar y probar. Se usó un tablero de historias de usuario con puntos (Fibonacci) y un flujo de ramas Git (`feature` → `develop` → `main`).

| Modelo | Ventaja | Por qué se descartó / eligió |
|---|---|---|
| Cascada | Documentación completa al inicio | Descartado: no permite validar el backend temprano, y el parcial exige un microservicio que responda desde la primera entrega mínima. |
| Espiral | Gestión explícita de riesgos | Descartado: es excesivo para un proyecto pequeño de duración corta. |
| **Iterativo e incremental** | Entrega funcional en cada iteración; los cambios se incorporan con poco costo | **Elegido**: el módulo crítico (retiro) se pudo construir y validar por partes. |

## 1.2 Fases y artefactos

| Fase | Actividades | Artefactos |
|---|---|---|
| Planeación y análisis | Lectura de la situación problema, elicitación, priorización | [Requisitos](02_requerimientos.md), [historias de usuario](03_historias_usuario.md) |
| Diseño | Arquitectura en capas, modelo de datos, contrato REST | [Arquitectura limpia](04_arquitectura_limpia.md), diagramas UML |
| Implementación | Backend Spring Boot y frontend React | `backend/`, `frontend/` |
| Pruebas | Prueba unitaria del algoritmo de billetes y pruebas de los endpoints con Postman | `DispensadorEfectivoTest`, colección de pruebas |
| Despliegue | Ejecución local: PostgreSQL + backend (8080) + frontend (5173) | [README](../README.md) |
| Mantenimiento | Corrección de errores y mejoras (ver 1.4) | Historial de Git |

## 1.3 Iteraciones

| Iteración | Objetivo | Historias | Puntos |
|---|---|---|---|
| 1 | Base del sistema: cuentas, acceso, saldo, depósito e historial | HU-01, HU-02, HU-03, HU-04, HU-11 | 10 |
| 2 | Gestión del titular y primer retiro con PIN | HU-05, HU-06, HU-07 | 8 |
| 3 | Reglas críticas del cajero | HU-08, HU-09, HU-10 | 10 |

Al cierre de cada iteración se integra `feature` en `develop`, se comprueba que todo funcione y se aplica el mismo proceso hacia `main` (ver [flujo de Git](05_flujo_git.md)).

## 1.4 Mantenimiento y mejoras previstas

- Cifrado con BCrypt y autenticación con tokens (JWT) en lugar de SHA-256 sin sal.
- Límite de intentos fallidos de PIN con bloqueo temporal.
- Pruebas automatizadas de integración con base de datos de prueba.
