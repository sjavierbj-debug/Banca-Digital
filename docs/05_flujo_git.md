# 5. Flujo de Git

| Rama | Uso |
|---|---|
| `feature` | Aquí se desarrolla todo el trabajo. |
| `develop` | Se integra `feature` y se comprueba que todo funcione. |
| `main` | Se integra `develop`; es la rama que se revisa en el parcial. |

```bash
git checkout feature          # trabajar y hacer commits
git add . && git commit -m "feat: descripción"

git checkout develop          # integrar y probar
git merge --no-ff feature

git checkout main             # entregar
git merge --no-ff develop
git push origin main develop feature
```

El repositorio debe compartirse con el usuario **jjbrival93**.

Convención de mensajes: `feat:` (funcionalidad), `docs:` (documentación), `test:` (pruebas), `chore:` (configuración).
