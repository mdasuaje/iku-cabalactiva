# Instrucciones para Completar la Migración de Ramas

## 📋 Resumen

Este documento proporciona instrucciones paso a paso para completar la migración de ramas del repositorio público `iku-cabalactiva` al repositorio privado `iku-cabalactiva-private`.

## 🎯 Objetivo

Mantener únicamente las ramas `main` y `gh-pages` en el repositorio público, moviendo todas las demás ramas al repositorio privado.

## ✅ Trabajo Completado

Se han creado los siguientes recursos:

### Documentación
- ✅ `/docs/BRANCH_MIGRATION_GUIDE.md` - Guía completa de migración
- ✅ `/docs/BRANCH_QUICK_GUIDE.md` - Guía rápida de referencia
- ✅ `README.md` actualizado con la nueva política de ramas

### Scripts de Automatización
- ✅ `/scripts/list-branches-to-migrate.sh` - Lista las ramas a migrar
- ✅ `/scripts/migrate-branches-to-private.sh` - Migra ramas al repositorio privado
- ✅ `/scripts/verify-branches.sh` - Verifica que la migración fue exitosa
- ✅ `/scripts/cleanup-public-branches.sh` - Limpia el repositorio público

### Actualizaciones
- ✅ Workflows de GitHub Actions actualizados para referenciar solo `main`
- ✅ Todos los scripts son ejecutables

## 🚀 Próximos Pasos (Requiere Acción Manual)

### Paso 1: Verificar Ramas Actuales

Ejecutar el script de listado para ver qué ramas necesitan ser migradas:

```bash
cd /path/to/iku-cabalactiva
./scripts/list-branches-to-migrate.sh
```

**Estado actual:**
- 9 ramas necesitan ser migradas
- Ramas a mantener: `main`, `gh-pages`
- Ramas a migrar: `develop`, `feature/*`, `copilot/*`, etc.

### Paso 2: Crear/Configurar Repositorio Privado

Si el repositorio privado no existe:

1. Ir a: https://github.com/new
2. Nombre: `iku-cabalactiva-private`
3. Visibilidad: **Private**
4. NO inicializar con README, .gitignore o licencia
5. Clonar localmente:

```bash
git clone git@github.com:mdasuaje/iku-cabalactiva-private.git
cd iku-cabalactiva-private
```

Si ya existe, solo clonarlo:

```bash
git clone git@github.com:mdasuaje/iku-cabalactiva-private.git
cd iku-cabalactiva-private
```

### Paso 3: Ejecutar Migración de Ramas

**⚠️ IMPORTANTE:** Este paso debe ejecutarse desde el directorio del repositorio PRIVADO.

```bash
cd /path/to/iku-cabalactiva-private

# Ejecutar script de migración
./scripts/migrate-branches-to-private.sh git@github.com:mdasuaje/iku-cabalactiva.git
```

Este script:
- Agregará el repositorio público como remote 'public'
- Obtendrá todas las ramas del repositorio público
- Creará cada rama localmente
- Hará push de cada rama al repositorio privado
- Mostrará un resumen de la migración

### Paso 4: Verificar la Migración

Antes de eliminar ramas del repositorio público, **SIEMPRE** verificar que están respaldadas:

```bash
cd /path/to/iku-cabalactiva-private
./scripts/verify-branches.sh
```

**No continuar al siguiente paso hasta que este script confirme que todas las ramas están respaldadas.**

### Paso 5: Limpiar Repositorio Público

**⚠️ ADVERTENCIA CRÍTICA:**
- Este paso eliminará ramas permanentemente del repositorio público
- Solo ejecutar después de verificar que todas las ramas están en el repositorio privado
- Requiere permisos de administrador en el repositorio

```bash
cd /path/to/iku-cabalactiva

# Ejecutar script de limpieza
./scripts/cleanup-public-branches.sh
```

El script solicitará confirmación dos veces antes de proceder.

### Paso 6: Configurar Protección de Ramas

Configurar protección para las ramas que permanecen en el repositorio público:

#### Proteger rama `main`

1. Ir a: https://github.com/mdasuaje/iku-cabalactiva/settings/branches
2. Click en "Add rule"
3. Branch name pattern: `main`
4. Configurar:
   - ✅ Require a pull request before merging
   - ✅ Require approvals (1)
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Do not allow bypassing the above settings
   - ❌ Allow force pushes (disabled)
   - ❌ Allow deletions (disabled)
5. Click "Create" o "Save changes"

#### Proteger rama `gh-pages`

1. Repetir el proceso anterior
2. Branch name pattern: `gh-pages`
3. Configuración similar, enfatizar:
   - ❌ Allow deletions (disabled)

### Paso 7: Actualizar Documentación del Equipo

1. Notificar al equipo sobre los cambios
2. Compartir la documentación:
   - `/docs/BRANCH_MIGRATION_GUIDE.md`
   - `/docs/BRANCH_QUICK_GUIDE.md`
3. Actualizar cualquier documento interno de flujo de trabajo
4. Actualizar configuraciones de IDE/herramientas que referencien ramas antiguas

### Paso 8: Verificación Final

Después de completar todos los pasos:

```bash
# Verificar que solo existen main y gh-pages en el público
cd /path/to/iku-cabalactiva
git ls-remote --heads origin

# Verificar que todas las ramas están en el privado
cd /path/to/iku-cabalactiva-private
git ls-remote --heads origin
```

**Resultado esperado:**
- Repositorio público: Solo `main` y `gh-pages`
- Repositorio privado: Todas las ramas de desarrollo

## 🔄 Flujo de Trabajo Futuro

### Desarrollo en Repositorio Privado

```bash
cd /path/to/iku-cabalactiva-private

# Crear nueva feature
git checkout develop
git pull
git checkout -b feature/nueva-funcionalidad

# Desarrollar y commitear
git add .
git commit -m "Nueva funcionalidad"
git push origin feature/nueva-funcionalidad

# Crear PR hacia develop en GitHub (repositorio privado)
```

### Release a Repositorio Público

```bash
# Cuando develop está listo para producción
cd /path/to/iku-cabalactiva-private

# Merge a main en el repositorio privado
git checkout main
git pull
git merge develop
git push origin main

# Agregar remote del repositorio público si no existe
git remote add public git@github.com:mdasuaje/iku-cabalactiva.git

# Push a main en el repositorio público
git push public main
```

### Hotfix en Producción

```bash
# Crear PR en el repositorio público para main
# Una vez aprobado y merged, sincronizar al privado

cd /path/to/iku-cabalactiva-private
git fetch public
git checkout main
git merge public/main
git push origin main

# Merge back a develop
git checkout develop
git merge main
git push origin develop
```

## 📊 Estado Actual del Repositorio

### Ramas en Repositorio Público (Antes de Limpieza)
```
- codespace-bookish-space-spoon-7vj4r49q7gj2rr7g
- copilot/refactor-ci-cd-pipeline
- copilot/remove-other-branches (rama actual)
- crm-refactor-20251105
- develop
- feature/analytics-instrumentation
- feature/architecture-v3-genesis
- feature/aws-reengineering-implementation
- feature/frontend-refactor
- gh-pages
- main
```

### Ramas Deseadas (Después de Limpieza)
```
✅ main
✅ gh-pages
```

## 🆘 Troubleshooting

### Error: "Permission denied" al eliminar ramas

**Causa:** Falta de permisos de administrador o protección de ramas activada.

**Solución:**
1. Verificar permisos de administrador en GitHub
2. Verificar que no hay protección de ramas configurada
3. Eliminar manualmente desde GitHub:
   - Ir a: https://github.com/mdasuaje/iku-cabalactiva/branches
   - Click en el ícono de basura junto a cada rama

### Error: "Branch not found" durante migración

**Causa:** Referencias desactualizadas o problemas de conectividad.

**Solución:**
```bash
git fetch --all
git remote update
```

### Algunas ramas no se migraron

**Causa:** Errores durante el proceso de migración.

**Solución:**
```bash
# Volver a ejecutar el script de migración
cd /path/to/iku-cabalactiva-private
./scripts/migrate-branches-to-private.sh git@github.com:mdasuaje/iku-cabalactiva.git

# Verificar nuevamente
./scripts/verify-branches.sh
```

### No puedo hacer push al repositorio privado

**Causa:** Permisos o autenticación.

**Solución:**
1. Verificar que tienes acceso al repositorio privado
2. Verificar configuración de SSH:
```bash
ssh -T git@github.com
```
3. Si usas HTTPS, verificar token de acceso personal

## 📞 Soporte

Para preguntas o problemas:
1. Consultar la documentación completa en `/docs/BRANCH_MIGRATION_GUIDE.md`
2. Revisar `/docs/BRANCH_QUICK_GUIDE.md` para comandos rápidos
3. Contactar al administrador del repositorio
4. Abrir un issue en el repositorio privado (no en el público)

## ✅ Checklist Final

Antes de considerar la migración completa, verificar:

- [ ] Repositorio privado creado y clonado
- [ ] Script de migración ejecutado sin errores
- [ ] Script de verificación confirma que todas las ramas están respaldadas
- [ ] Script de limpieza ejecutado exitosamente
- [ ] Solo `main` y `gh-pages` existen en el repositorio público
- [ ] Todas las ramas de desarrollo existen en el repositorio privado
- [ ] Protección de ramas configurada para `main` y `gh-pages`
- [ ] Equipo notificado sobre los cambios
- [ ] Documentación del equipo actualizada
- [ ] GitHub Actions sigue funcionando correctamente
- [ ] GitHub Pages sigue desplegando correctamente

## 🎉 Completado

Una vez todos los items del checklist estén marcados, la migración está completa y el repositorio público estará limpio con solo las ramas necesarias.

---

**Última actualización:** 2025-11-21
**Versión:** 1.0
**Autor:** GitHub Copilot Workspace
