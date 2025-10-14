# Configuración de Protección de Rama Principal

Este documento proporciona instrucciones para configurar la protección de la rama `main` en GitHub para evitar eliminaciones accidentales o push forzados.

## Pasos para Configurar la Protección de Rama

1. Ve al repositorio en GitHub: https://github.com/mdasuaje/iku-cabalactiva
2. Haz clic en "Settings" (pestaña con el ícono de engranaje)
3. En el menú lateral izquierdo, selecciona "Branches"
4. En la sección "Branch protection rules", haz clic en "Add rule"
5. En "Branch name pattern", escribe `main`
6. Selecciona las siguientes opciones:
   - ✅ Require a pull request before merging
     - ✅ Require approvals (elige un número, recomendado: 1)
   - ✅ Require status checks to pass before merging
     - Busca y selecciona los checks relevantes de CI/CD (por ejemplo, "build", "test", etc.)
   - ✅ Require branches to be up to date before merging
   - ✅ Do not allow bypassing the above settings
   - ✅ Restrict who can push to matching branches
     - Añade usuarios/equipos con permiso para hacer push
   - ✅ Allow force pushes (desactivado)
   - ✅ Allow deletions (desactivado)

7. Haz clic en "Create" o "Save changes"

## Verificación

Para verificar que la protección está correctamente configurada:

1. Intenta hacer un push directo a la rama `main`:
   ```bash
   git checkout main
   # Hacer algún cambio
   git add .
   git commit -m "Test branch protection"
   git push origin main
   ```

2. Deberías recibir un error indicando que el push directo está rechazado.

3. Crea una pull request para cualquier cambio que desees hacer en `main`:
   ```bash
   git checkout -b feature/my-changes
   # Hacer cambios
   git add .
   git commit -m "My changes"
   git push origin feature/my-changes
   # Luego crea un PR en GitHub desde la interfaz web
   ```

## Importancia de la Protección de Rama

La protección de la rama principal es crucial para:

1. Evitar eliminaciones accidentales
2. Prevenir push forzados que puedan sobrescribir el historial
3. Garantizar que todos los cambios pasen por un proceso de revisión (PR)
4. Asegurar que las pruebas automatizadas pasen antes de integrar cambios
5. Mantener un historial limpio y ordenado del código

## Recomendaciones Adicionales

- Configura el repositorio para usar "Squash and merge" o "Rebase and merge" para mantener un historial más limpio
- Considera configurar la rama `develop` como rama principal de desarrollo y `main` solo para producción
- Implementa un flujo de trabajo GitFlow o similar para gestionar features, hotfixes, releases, etc.