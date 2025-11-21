# Guía Rápida: Gestión de Ramas

## 🎯 Política de Ramas

### Repositorio Público (`iku-cabalactiva`)
✅ **Solo estas ramas:**
- `main` - Producción
- `gh-pages` - GitHub Pages (automática)

### Repositorio Privado (`iku-cabalactiva-private`)
✅ **Todas las demás ramas:**
- `develop` - Desarrollo principal
- `feature/*` - Nuevas funcionalidades
- `bugfix/*` - Correcciones
- `hotfix/*` - Correcciones urgentes
- `release/*` - Preparación de releases

## 🚀 Comandos Rápidos

### 1. Listar ramas a migrar
```bash
cd iku-cabalactiva
./scripts/list-branches-to-migrate.sh
```

### 2. Migrar ramas (ejecutar desde repo privado)
```bash
cd iku-cabalactiva-private
./scripts/migrate-branches-to-private.sh git@github.com:mdasuaje/iku-cabalactiva.git
```

### 3. Verificar migración (ejecutar desde repo privado)
```bash
cd iku-cabalactiva-private
./scripts/verify-branches.sh
```

### 4. Limpiar repositorio público
```bash
cd iku-cabalactiva
./scripts/cleanup-public-branches.sh
```

## ⚠️ Notas Importantes

1. **Siempre** verificar la migración antes de limpiar
2. **Requiere** permisos de administrador para eliminar ramas
3. **Hacer backup** antes de ejecutar cleanup
4. Las ramas protegidas no se pueden eliminar sin modificar configuración

## 📚 Documentación Completa

Ver [BRANCH_MIGRATION_GUIDE.md](./BRANCH_MIGRATION_GUIDE.md) para detalles completos.

## 🔄 Flujo de Trabajo Típico

```
Desarrollo (Privado) → PR → main (Privado) → Push → main (Público)
                                              ↓
                                        GitHub Pages
```

## 🆘 Troubleshooting

### Error: "Permission denied"
- Verificar permisos de administrador en GitHub
- Revisar protección de ramas en Settings > Branches

### Error: "Branch not found"
- Ejecutar `git fetch` para actualizar referencias
- Verificar que la rama existe: `git ls-remote --heads origin`

### Ramas no migradas
- Ejecutar nuevamente `migrate-branches-to-private.sh`
- Verificar con `verify-branches.sh`
