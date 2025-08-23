# 🚀 Checklist: Despliegue GitHub Pages (Vite + React)

## ✅ **Pre-requisitos**

- [ ] `index.html` en **raíz** del proyecto
- [ ] `@vitejs/plugin-react` instalado
- [ ] `vite.config.js` configurado:
```js
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/REPO-NAME/' : './'
})
```

## ✅ **Setup automático**

```bash
bash setup.sh  # Instala deps, corrige vulnerabilidades, valida build
```

## ✅ **Workflow GitHub Actions**

Crea `.github/workflows/deploy.yml`:

```yaml
name: Deploy
on:
  push:
    branches: [main]
  workflow_dispatch:
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - uses: actions/deploy-pages@v4
```

## ✅ **Configuración GitHub**

1. **Settings > Pages**
2. Source: **GitHub Actions**
3. ✅ Enforce HTTPS

## ✅ **Dominio personalizado (opcional)**

1. Archivo `public/CNAME`:
```
tu-dominio.com
```
2. DNS: `CNAME` → `usuario.github.io`
3. **Settings > Pages** → Custom domain

## ✅ **Verificación**

- [ ] Actions ejecuta sin errores
- [ ] Sitio accesible en `https://usuario.github.io/repo/`
- [ ] Assets cargan correctamente
- [ ] Dominio personalizado funciona (si aplica)

## 🔧 **Troubleshooting**

| Error | Solución |
|-------|----------|
| 404 en assets | Revisar `base` en `vite.config.js` |
| Build falla | Ejecutar `npm audit fix --force` |
| Permisos | Verificar `permissions` en workflow |
| CNAME | Archivo en `public/`, no en raíz |

---

**✨ Listo para producción en 3 comandos:**
```bash
bash setup.sh
git add . && git commit -m "Deploy setup" && git push
# ¡Espera 2-3 minutos y tu sitio estará online! 🎉
```  