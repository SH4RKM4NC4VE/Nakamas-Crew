# Guía de Despliegue - Nakamas Crew

## Requisitos Previos

- Node.js 22+
- pnpm 10+
- Docker y Docker Compose (opcional)
- Nginx (para producción)
- Certificado SSL (Let's Encrypt)

## Despliegue Local

### 1. Instalación de Dependencias

```bash
pnpm install
```

### 2. Construcción

```bash
pnpm run build
```

### 3. Ejecución en Desarrollo

```bash
pnpm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### 4. Ejecución en Producción

```bash
pnpm run start
```

## Despliegue con Docker

### 1. Construir Imagen

```bash
docker build -t nakamas-crew:latest .
```

### 2. Ejecutar Contenedor

```bash
docker run -p 3000:3000 -e NODE_ENV=production nakamas-crew:latest
```

### 3. Despliegue con Docker Compose

```bash
docker-compose up -d
```

## Despliegue en Producción

### 1. Configurar Nginx

Copiar `nginx.conf` a `/etc/nginx/sites-available/nakamas-crew`

```bash
sudo ln -s /etc/nginx/sites-available/nakamas-crew /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 2. Configurar SSL con Let's Encrypt

```bash
sudo certbot certonly --nginx -d nakamas-crew.xyz -d www.nakamas-crew.xyz
```

### 3. Configurar Variables de Entorno

Crear archivo `.env.production`:

```
VITE_APP_TITLE=Nakamas Crew
VITE_APP_LOGO=/logo.png
NODE_ENV=production
```

### 4. Iniciar Aplicación

Con PM2 (recomendado):

```bash
npm install -g pm2
pm2 start dist/index.js --name "nakamas-crew"
pm2 save
pm2 startup
```

## Optimizaciones Aplicadas

- ✅ Code splitting (vendor, ui chunks)
- ✅ Minificación con Terser
- ✅ Compresión gzip
- ✅ Preload de recursos críticos
- ✅ Headers de seguridad
- ✅ Cache de assets estáticos
- ✅ SSL/TLS
- ✅ HTTP/2

## Monitoreo

### Health Check

```bash
curl http://localhost:3000
```

### Logs

Con PM2:
```bash
pm2 logs nakamas-crew
```

Con Docker:
```bash
docker logs <container-id>
```

## Rendimiento

**Tamaños de Bundle (gzip)**:
- CSS: 18.50 kB
- Vendor JS: 45.00 kB
- App JS: 30.72 kB
- UI JS: 13.48 kB

**Total**: ~107 kB (gzip)

## Soporte

Para reportar problemas o sugerencias, contactar al equipo de desarrollo.
