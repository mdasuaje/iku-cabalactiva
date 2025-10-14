# Guía de Gestión de Archivos Temporales y Resultados de Pruebas

Esta guía proporciona directrices sobre cómo manejar archivos temporales, resultados de pruebas y otros archivos que no deben incluirse en el control de versiones.

## Archivos que NO deben incluirse en el repositorio

El archivo `.gitignore` ha sido actualizado para excluir los siguientes tipos de archivos:

1. **Resultados de pruebas y reportes**:
   - `test-results/`
   - `playwright-report/`
   - `**/test-report*/`
   - `*.test-result.json`
   - `*.spec.result.json`
   - `**/__snapshots__/*.snap.tmp`

2. **Archivos de cobertura**:
   - `coverage/`
   - `coverage-temp/`
   - `coverage-report*/`
   - `.nyc_output/`

3. **Archivos temporales y de diagnóstico**:
   - `**/diagnostics/*.tmp`
   - `**/diagnostics/*.json`
   - `**/diagnose-*.log`
   - `**/temp/`
   - `__temp__/`
   - `temp-*.js`
   - `*.test.log`

4. **Archivos de caché y compilación**:
   - `.eslintcache`
   - `.vite/`
   - `stats.html`
   - `bundle-stats.json`
   - `.rollup.cache/`

5. **Archivos de respaldo**:
   - `backup-iku-cabala*`
   - `*-backup.*`
   - `*.bak`

6. **Archivos de debug**:
   - `.debug`
   - `debug.config`
   - `debug-*.js`
   - `.debug-env`
   - `**/debug-logs/`
   - `config.local.js`

7. **Archivos de traza y perfilado**:
   - `trace-*.json`
   - `profile-*.json`
   - `**/chrome-user-data/`
   - `**/lighthouse/`

## Scripts de utilidad

Se han creado los siguientes scripts para ayudar a mantener el repositorio limpio:

1. **`scripts/clean-temp-files.sh`**
   - Elimina archivos temporales y de registro
   - Busca y elimina archivos según patrones configurados
   - Solicita confirmación antes de eliminar archivos

## Buenas prácticas

1. **Pruebas locales**:
   - Los resultados de pruebas deben considerarse datos efímeros
   - Ejecute pruebas localmente pero no envíe resultados al repositorio
   - Utilice el directorio `test-results/` para almacenar resultados locales

2. **Diagnósticos**:
   - Los scripts de diagnóstico deben guardarse en el repositorio
   - Los resultados de diagnóstico deben ignorarse a menos que sean necesarios
   - Utilice el directorio `docs/diagnostics/` para almacenar resultados importantes

3. **Respaldos y versiones**:
   - Utilice git para el control de versiones en lugar de archivos con sufijos como `-backup`
   - Si necesita guardar backups, utilice un directorio específico fuera del control de versiones

4. **Limpieza periódica**:
   - Ejecute `scripts/clean-temp-files.sh` regularmente para mantener el repositorio limpio
   - Antes de hacer commit, verifique que no hay archivos temporales incluidos

## Comprobación de archivos ignorados

Para verificar si hay archivos que deberían ser ignorados pero están en el control de versiones:

```bash
git ls-files -ci --exclude-standard
```

Para eliminar estos archivos del control de versiones (sin eliminarlos del sistema):

```bash
git rm --cached ARCHIVO
```

## Mantenimiento continuo

Es responsabilidad de todos los desarrolladores mantener el repositorio limpio de archivos innecesarios. Revise regularmente el archivo `.gitignore` para asegurarse de que está actualizado con los patrones necesarios.

Cuando se añadan nuevas herramientas o flujos de trabajo, actualice el archivo `.gitignore` y esta documentación según sea necesario.