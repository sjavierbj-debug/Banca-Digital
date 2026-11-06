# 3. Historias de usuario, criterios de aceptación y puntos

**Escala de puntos (Fibonacci):** 1 = trivial · 2 = simple · 3 = moderada · 5 = compleja con varias reglas.
**Total del proyecto: 28 puntos.**

| ID | Historia | Puntos | Prioridad | Iteración |
|---|---|---|---|---|
| HU-01 | Crear cuenta | 3 | Alta | 1 |
| HU-02 | Iniciar sesión | 2 | Alta | 1 |
| HU-03 | Consultar saldo | 1 | Alta | 1 |
| HU-04 | Depositar fondos | 2 | Alta | 1 |
| HU-11 | Consultar historial | 2 | Media | 1 |
| HU-05 | Actualizar datos personales | 2 | Media | 2 |
| HU-06 | Cambiar clave y PIN | 3 | Media | 2 |
| HU-07 | Retirar con PIN | 3 | Alta | 2 |
| HU-08 | Validar monto mínimo y saldo | 2 | Alta | 3 |
| HU-09 | Respetar el tope diario | 3 | Alta | 3 |
| HU-10 | Dispensar la menor cantidad de billetes | 5 | Alta | 3 |

---

### HU-01 · Crear cuenta (3 puntos)
**Como** cliente nuevo, **quiero** registrarme con mis datos, clave y PIN, **para** operar mi cuenta digital.

- **Dado** que ingreso nombre, documento, correo, clave de 6 o más caracteres y PIN de 4 dígitos, **cuando** envío el registro, **entonces** la cuenta se crea con saldo $0 y no se muestran la clave ni el PIN.
- **Dado** que el documento ya existe, **cuando** intento registrarme, **entonces** el sistema responde 409 con el mensaje "Ya existe una cuenta con ese documento."
- **Dado** que el PIN no tiene 4 dígitos numéricos, **cuando** envío el registro, **entonces** se rechaza con el motivo.

### HU-02 · Iniciar sesión (2 puntos)
**Como** cliente, **quiero** ingresar con mi documento y clave, **para** acceder a mi panel.

- **Dado** que los datos son correctos, **cuando** ingreso, **entonces** veo mi panel con mis datos.
- **Dado** que la clave es incorrecta, **cuando** ingreso, **entonces** recibo 401 "Documento o clave incorrectos."

### HU-03 · Consultar saldo (1 punto)
**Como** cliente, **quiero** ver mi saldo actual, **para** saber cuánto dinero tengo disponible.

- **Dado** que inicié sesión, **cuando** abro el resumen, **entonces** veo el saldo actualizado en COP.
- **Dado** que hice un depósito o retiro, **cuando** vuelvo al resumen, **entonces** el saldo refleja la operación.

### HU-04 · Depositar fondos (2 puntos)
**Como** cliente, **quiero** depositar dinero, **para** aumentar mi saldo.

- **Dado** un saldo de $100.000, **cuando** deposito $50.000, **entonces** el saldo es $150.000 y se registra una transacción.
- **Dado** que el monto es 0 o negativo, **cuando** intento depositar, **entonces** se rechaza con "El monto a depositar debe ser mayor a $0."

### HU-05 · Actualizar datos personales (2 puntos)
**Como** titular, **quiero** modificar mi correo, teléfono y dirección, **para** mantener mi información al día.

- **Dado** un correo válido, **cuando** guardo los cambios, **entonces** los datos quedan actualizados.
- **Dado** un correo sin "@", **cuando** guardo, **entonces** se rechaza con un mensaje de correo inválido.

### HU-06 · Cambiar clave y PIN (3 puntos)
**Como** titular, **quiero** cambiar mi clave de acceso y mi PIN, **para** proteger mi cuenta.

- **Dado** que ingreso mi clave actual correcta y una clave nueva de 6 o más caracteres, **cuando** confirmo, **entonces** la clave se actualiza.
- **Dado** que la clave actual es incorrecta, **cuando** confirmo, **entonces** se rechaza con 401.
- **Dado** que indico un PIN nuevo de 4 dígitos, **cuando** confirmo, **entonces** el PIN se actualiza.
- **Dado** que no indico clave nueva ni PIN nuevo, **cuando** confirmo, **entonces** se rechaza con el motivo.

### HU-07 · Retirar con PIN (3 puntos)
**Como** cliente, **quiero** retirar efectivo con mi PIN, **para** obtener dinero como en un cajero.

- **Dado** un PIN correcto y un monto válido, **cuando** retiro, **entonces** se descuenta el monto y se registra la transacción.
- **Dado** un PIN con menos o más de 4 dígitos, **cuando** retiro, **entonces** se rechaza con "El PIN debe tener exactamente 4 dígitos numéricos."
- **Dado** un PIN incorrecto, **cuando** retiro, **entonces** se rechaza con 401 y el saldo no cambia.

### HU-08 · Validar monto mínimo y saldo (2 puntos)
**Como** entidad financiera, **quiero** impedir retiros menores a $10.000 o mayores al saldo, **para** cumplir la política del cajero.

- **Dado** un monto de $5.000, **cuando** retiro, **entonces** se rechaza con "El monto mínimo de retiro es $10.000 COP."
- **Dado** un saldo de $50.000, **cuando** intento retirar $100.000, **entonces** se rechaza con "Saldo insuficiente." y se informa el saldo.

### HU-09 · Respetar el tope diario (3 puntos)
**Como** entidad financiera, **quiero** limitar los retiros a $1.000.000 por usuario al día, **para** reducir riesgos.

- **Dado** que hoy retiré $600.000, **cuando** intento retirar $500.000, **entonces** se rechaza indicando que solo puedo retirar $400.000 más.
- **Dado** que hoy retiré $600.000, **cuando** retiro $400.000, **entonces** se autoriza (la suma es exactamente $1.000.000).
- **Dado** un nuevo día, **cuando** retiro, **entonces** el acumulado vuelve a empezar.

### HU-10 · Dispensar la menor cantidad de billetes (5 puntos)
**Como** cliente, **quiero** recibir el dinero con la menor cantidad de billetes, **para** que la entrega sea práctica.

- **Dado** un retiro de $280.000, **cuando** se autoriza, **entonces** se entregan 2 de $100.000, 1 de $50.000, 1 de $20.000 y 1 de $10.000.
- **Dado** un retiro de $90.000, **cuando** se autoriza, **entonces** se entregan 1 de $50.000 y 2 de $20.000.
- **Dado** un retiro de $15.000, **cuando** intento retirar, **entonces** se deniega indicando que el monto debe armarse con billetes de $100.000, $50.000, $20.000 y $10.000.

### HU-11 · Consultar historial (2 puntos)
**Como** cliente, **quiero** ver mis depósitos y retiros, **para** revisar mi actividad.

- **Dado** que tengo transacciones, **cuando** abro el resumen, **entonces** las veo de la más reciente a la más antigua con fecha, tipo, monto y saldo posterior.
- **Dado** que no tengo transacciones, **cuando** abro el resumen, **entonces** veo un mensaje que me invita a hacer un depósito.
