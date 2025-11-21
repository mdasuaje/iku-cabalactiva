# Guía de Migración de Ramas: Repositorio Público a Privado

## 📋 Resumen

Este documento describe el proceso para mantener únicamente las ramas `main` y `gh-pages` en el repositorio público `iku-cabalactiva`, mientras se migran las demás ramas de desarrollo al repositorio privado `iku-cabalactiva-private`.

## 🎯 Objetivos

1. **Repositorio Público (`iku-cabalactiva`)**: Solo debe contener:
   - ✅ `main` - Rama principal de producción
   - ✅ `gh-pages` - Rama para GitHub Pages deployment

2. **Repositorio Privado (`iku-cabalactiva-private`)**: Debe contener:
   - Todas las ramas de desarrollo
   - Todas las ramas de features
   - Todas las ramas experimentales
   - Historial completo de desarrollo

## 📊 Estado Actual

### Ramas en el Repositorio Público

Ejecutar el siguiente comando para listar todas las ramas:

```bash
git ls-remote --heads origin
```

Ramas actuales que deben ser migradas:
- `codespace-bookish-space-spoon-7vj4r49q7gj2rr7g`
- `copilot/refactor-ci-cd-pipeline`
- `copilot/remove-other-branches`
- `crm-refactor-20251105`
- `develop`
- `feature/analytics-instrumentation`
- `feature/architecture-v3-genesis`
- `feature/aws-reengineering-implementation`
- `feature/frontend-refactor`

## 🔄 Proceso de Migración

### Fase 1: Preparación del Repositorio Privado

1. **Crear o verificar el repositorio privado**:
   ```bash
   # Si el repositorio privado no existe, crearlo en GitHub
   # Navegar a: https://github.com/new
   # Nombre: iku-cabalactiva-private
   # Visibilidad: Private
   ```

2. **Clonar el repositorio privado localmente**:
   ```bash
   cd /path/to/workspace
   git clone git@github.com:mdasuaje/iku-cabalactiva-private.git
   cd iku-cabalactiva-private
   ```

3. **Agregar el repositorio público como remote**:
   ```bash
   git remote add public git@github.com:mdasuaje/iku-cabalactiva.git
   git fetch public
   ```

### Fase 2: Migración de Ramas

**Importante**: Usar el script `scripts/migrate-branches-to-private.sh` para automatizar este proceso.

Para cada rama que necesita ser migrada:

1. **Crear la rama en el repositorio privado**:
   ```bash
   # Ejemplo para la rama develop
   git checkout -b develop public/develop
   git push origin develop
   ```

2. **Verificar que la rama fue creada correctamente**:
   ```bash
   git ls-remote --heads origin | grep develop
   ```

### Fase 3: Limpieza del Repositorio Público

**⚠️ ADVERTENCIA**: Este proceso eliminará ramas del repositorio público. Asegurarse de que todas las ramas estén respaldadas en el repositorio privado antes de continuar.

1. **Verificar que todas las ramas están en el repositorio privado**:
   ```bash
   cd iku-cabalactiva-private
   ./scripts/verify-branches.sh
   ```

2. **Eliminar ramas del repositorio público** (requiere permisos de administrador):
   ```bash
   cd iku-cabalactiva
   ./scripts/cleanup-public-branches.sh
   ```

   O manualmente:
   ```bash
   # Para cada rama a eliminar
   git push origin --delete <branch-name>
   ```

### Fase 4: Configuración de Protección de Ramas

1. **Proteger la rama `main` en el repositorio público**:
   - Ir a: `https://github.com/mdasuaje/iku-cabalactiva/settings/branches`
   - Agregar regla de protección para `main`:
     - ✅ Require pull request reviews
     - ✅ Require status checks to pass
     - ✅ Require branches to be up to date
     - ✅ Do not allow bypassing
     - ❌ Allow force pushes (disabled)
     - ❌ Allow deletions (disabled)

2. **Proteger la rama `gh-pages`**:
   - Agregar regla de protección similar para `gh-pages`
   - ❌ Allow deletions (disabled)

### Fase 5: Actualización de Workflows y Documentación

1. **Actualizar workflows de CI/CD**:
   - Verificar que los workflows solo referencien las ramas `main` y `gh-pages`
   - Actualizar cualquier referencia a otras ramas

2. **Actualizar documentación**:
   - Actualizar README.md con la nueva política de ramas
   - Documentar el flujo de trabajo entre repositorio privado y público

## 📝 Scripts Automatizados

### 1. Listar Ramas a Migrar

```bash
./scripts/list-branches-to-migrate.sh
```

### 2. Migrar Ramas al Repositorio Privado

```bash
./scripts/migrate-branches-to-private.sh [public-repo-url]
```

### 3. Verificar Migración

```bash
./scripts/verify-branches.sh
```

### 4. Limpiar Repositorio Público

```bash
./scripts/cleanup-public-branches.sh
```

## 🔒 Política de Ramas (Nueva)

### Repositorio Público (`iku-cabalactiva`)

- **`main`**: Rama de producción
  - Protegida contra eliminación y force push
  - Requiere PR y revisión para cambios
  - Deploy automático a GitHub Pages

- **`gh-pages`**: Rama de deployment
  - Generada automáticamente por GitHub Actions
  - No debe ser modificada manualmente
  - Protegida contra eliminación

### Repositorio Privado (`iku-cabalactiva-private`)

- **`develop`**: Rama principal de desarrollo
- **`feature/*`**: Ramas de nuevas funcionalidades
- **`bugfix/*`**: Ramas de corrección de bugs
- **`hotfix/*`**: Ramas de correcciones urgentes
- **`release/*`**: Ramas de preparación de releases

## 🚀 Flujo de Trabajo Recomendado

1. **Desarrollo** (en repositorio privado):
   ```bash
   git checkout develop
   git checkout -b feature/nueva-funcionalidad
   # ... desarrollar ...
   git push origin feature/nueva-funcionalidad
   # Crear PR hacia develop en repositorio privado
   ```

2. **Release** (desde privado a público):
   ```bash
   # En repositorio privado
   git checkout develop
   git pull
   
   # Crear rama de release
   git checkout -b release/v1.2.0
   
   # Hacer merge a main en repositorio privado
   git checkout main
   git merge release/v1.2.0
   
   # Push al repositorio público
   git push public main
   ```

3. **Hotfix** (en repositorio público, luego sincronizar):
   ```bash
   # Crear PR en repositorio público para main
   # Una vez merged, sincronizar a repositorio privado
   cd iku-cabalactiva-private
   git fetch public
   git checkout main
   git merge public/main
   git push origin main
   ```

## ⚠️ Consideraciones Importantes

1. **Backup**: Antes de eliminar cualquier rama, asegurarse de que existe en el repositorio privado
2. **Sincronización**: Establecer un proceso regular de sincronización entre repositorios
3. **Permisos**: Solo administradores deben ejecutar scripts de limpieza
4. **Comunicación**: Notificar al equipo antes de realizar cambios en la estructura de ramas
5. **Documentación**: Mantener este documento actualizado con cualquier cambio en el proceso

## 📞 Contacto y Soporte

Para preguntas sobre este proceso:
- Revisar la documentación en `/docs/BRANCH_PROTECTION_SETUP.md`
- Contactar al administrador del repositorio
- Abrir un issue en el repositorio privado

## 📅 Historial de Cambios

- **2025-11-21**: Creación inicial del documento
- Incluye proceso de migración completo
- Scripts automatizados para facilitar el proceso
