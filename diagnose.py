import os

FILES = {
    "infraestructura_devops": ["Dockerfile", "k8s", "deploy.sh", "setup.sh", "api", "nginx.conf", "package.json"],
    "seguridad_y_calidad": ["security-update.sh", "trufflehog_report.json", "tests", "coverage"],
    "hosting_y_seo": ["CNAME", "public/robots.txt", "public/sitemap.xml"],
    "aplicacion": ["index.html", "src", "postcss.config.js", "tailwind.config.js", "vite.config.js", "vitest.config.js"]
}

def diagnose_codespace_project():
    print("# Diagnóstico IKU-Cábala Activa\n")
    
    missing = []
    for category, files in FILES.items():
        print(f"--- {category} ---")
        for file in files:
            status = "✅" if os.path.exists(file) else "❌"
            print(f"{status} {file}")
            if status == "❌":
                missing.append(file)
        print()
    
    status = "✅ Proyecto completo" if not missing else f"❌ Faltan {len(missing)} archivos"
    print(f"**Estado:** {status}")

if __name__ == "__main__":
    diagnose_codespace_project()