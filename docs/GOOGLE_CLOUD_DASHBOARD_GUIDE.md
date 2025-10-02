# 📊 Guía para Crear Dashboard de Salud en Google Cloud Monitoring

## 🎯 Objetivo
Crear un dashboard centralizado en Google Cloud Monitoring para monitorear la salud del Organismo Digital IKU v3.5 desplegado en Cloud Run.

## 📋 Prerrequisitos
- Servicios desplegados en Google Cloud Run:
  - `iku-frontend` (Next.js con endpoint `/api/health`)
  - `iku-persistence-agent` (Python Flask con endpoint `/health`)
- Acceso a Google Cloud Console
- Logging estructurado implementado (✅ completado en PROMPT #18)

## 🚀 Instrucciones Paso a Paso

### 1. Acceder a Google Cloud Monitoring
1. Ve a la consola de Google Cloud: `https://console.cloud.google.com`
2. Navega a **Monitoring** → **Dashboards**
3. Haz clic en **"Create Dashboard"**
4. Nombra el dashboard: **"Salud del Organismo IKU"**

### 2. Widget: Recuento de Solicitudes (Frontend)
```yaml
Tipo de Widget: "Gráfico de líneas"
Título: "Solicitudes Frontend - iku-frontend"
Métrica:
  - Resource Type: Cloud Run Revision
  - Service: iku-frontend
  - Metric: run.googleapis.com/request_count
Filtros:
  - service_name = "iku-frontend"
Agrupación: 1 minuto
```

### 3. Widget: Recuento de Solicitudes (Backend)
```yaml
Tipo de Widget: "Gráfico de líneas"
Título: "Solicitudes Backend - iku-persistence-agent"
Métrica:
  - Resource Type: Cloud Run Revision
  - Service: iku-persistence-agent
  - Metric: run.googleapis.com/request_count
Filtros:
  - service_name = "iku-persistence-agent"
Agrupación: 1 minuto
```

### 4. Widget: Latencia de Respuesta (Percentil 50)
```yaml
Tipo de Widget: "Gráfico de líneas"
Título: "Latencia P50 - Servicios IKU"
Métricas:
  Frontend:
    - Resource Type: Cloud Run Revision
    - Service: iku-frontend
    - Metric: run.googleapis.com/request_latencies
    - Aggregation: 50th percentile
  Backend:
    - Resource Type: Cloud Run Revision
    - Service: iku-persistence-agent
    - Metric: run.googleapis.com/request_latencies
    - Aggregation: 50th percentile
```

### 5. Widget: Errores del Servidor (5xx)
```yaml
Tipo de Widget: "Gráfico de líneas"
Título: "Errores 5xx - Servicios IKU"
Métrica:
  - Resource Type: Cloud Run Revision
  - Metric: run.googleapis.com/request_count
Filtros:
  - response_code_class = "5xx"
  - service_name: ["iku-frontend", "iku-persistence-agent"]
Agrupación: 1 minuto
```

### 6. Widget: Utilización de CPU
```yaml
Tipo de Widget: "Gráfico de líneas"
Título: "Utilización CPU - Contenedores"
Métrica:
  - Resource Type: Cloud Run Revision
  - Metric: run.googleapis.com/container/cpu/utilizations
Filtros:
  - service_name: ["iku-frontend", "iku-persistence-agent"]
```

### 7. Widget: Utilización de Memoria
```yaml
Tipo de Widget: "Gráfico de líneas"
Título: "Utilización Memoria - Contenedores"
Métrica:
  - Resource Type: Cloud Run Revision
  - Metric: run.googleapis.com/container/memory/utilizations
Filtros:
  - service_name: ["iku-frontend", "iku-persistence-agent"]
```

### 8. Widget: Logs de Errores (JSON Estructurados)
```yaml
Tipo de Widget: "Logs"
Título: "Errores Críticos - JSON Logs"
Query de Logs:
  resource.type="cloud_run_revision"
  resource.labels.service_name=("iku-frontend" OR "iku-persistence-agent")
  jsonPayload.severity=("ERROR" OR "CRITICAL")
  timestamp >= "2025-10-02T00:00:00Z"
```

### 9. Widget: Métricas Personalizadas de Negocio
```yaml
Tipo de Widget: "Scorecard"
Título: "Registros de Usuario - Últimas 24h"
Métrica Personalizada:
  - Basada en logs con jsonPayload.operation="register_user"
  - Conteo de eventos con jsonPayload.success=true
  - Período: 24 horas
```

## 🎛️ Configuración de Alertas

### Alerta 1: Servicio Caído
```yaml
Nombre: "IKU - Servicio No Disponible"
Condición: 
  - Métrica: run.googleapis.com/request_count
  - Condición: Ausencia de datos por > 5 minutos
Notificación: Email + Slack
```

### Alerta 2: Alta Latencia
```yaml
Nombre: "IKU - Alta Latencia"
Condición:
  - Métrica: run.googleapis.com/request_latencies (P95)
  - Threshold: > 2000ms por 2 minutos consecutivos
Notificación: Email
```

### Alerta 3: Errores 5xx
```yaml
Nombre: "IKU - Errores Críticos"
Condición:
  - Métrica: run.googleapis.com/request_count (5xx)
  - Threshold: > 5 errores en 1 minuto
Notificación: Email + SMS
```

## 📈 Métricas de Éxito

### KPIs del Dashboard
- **Disponibilidad:** > 99.9% uptime
- **Latencia P50:** < 200ms
- **Latencia P95:** < 1000ms
- **Tasa de Error:** < 0.1%
- **Registros Exitosos:** Tendencia creciente

### Logs Estructurados Clave
```json
{
  "timestamp": "2025-10-02T19:46:35.280533Z",
  "severity": "INFO",
  "component": "persistence-agent",
  "service": "iku-persistence-agent",
  "operation": "save_user",
  "email": "***@domain.com",
  "db_size": 1
}
```

## 🔍 Interpretación del Dashboard

### Estados del Sistema
- 🟢 **Verde**: Todos los servicios operativos, métricas dentro de rangos normales
- 🟡 **Amarillo**: Degradación detectada, latencia elevada o errores ocasionales
- 🔴 **Rojo**: Servicio caído, errores críticos o latencia inaceptable

### Acciones Recomendadas
- **Revisión Diaria**: Verificar tendencias de los últimos 7 días
- **Alertas Inmediatas**: Responder a notificaciones en < 15 minutos
- **Optimización Semanal**: Analizar patrones para mejoras de rendimiento

## 🎯 Validación Final

Para confirmar que el dashboard está funcionando:

1. **Generar Tráfico de Prueba:**
   ```bash
   # Hacer varias solicitudes al sistema
   curl http://your-cloud-run-url/api/health
   curl -X POST http://your-cloud-run-url/api/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@iku.com","password":"Test123"}'
   ```

2. **Verificar Métricas en Dashboard:**
   - Las solicitudes deben aparecer en los gráficos de recuento
   - La latencia debe registrarse correctamente
   - Los logs estructurados deben ser visibles

3. **Probar Alertas:**
   - Simular un error 5xx
   - Verificar que las notificaciones se envían

## 📚 Recursos Adicionales

- [Google Cloud Monitoring Dashboards](https://cloud.google.com/monitoring/dashboards)
- [Cloud Run Metrics](https://cloud.google.com/run/docs/monitoring)
- [Structured Logging Best Practices](https://cloud.google.com/logging/docs/structured-logging)

---

**🏯 El Dashboard es el Espejo del Alma del Sistema - Reflejará la verdadera salud del Organismo Digital IKU v3.5**