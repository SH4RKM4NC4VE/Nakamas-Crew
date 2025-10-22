# Nakamas Crew

**El Viaje del Grand Line - Una experiencia Web3 retro-pixel**

Nakamas Crew es una aplicación web interactiva que combina la nostalgia del pixel art retro con la tecnología blockchain moderna. Los usuarios pueden unirse a la tripulación Mugiwara, escuchar podcasts, disfrutar de música y sellar su pacto en la blockchain mediante NFT.storage.

---

## 🎨 Características

- **TIDETV**: Presentación interactiva de 10 diapositivas sobre el proyecto TIDElabs
- **Café y Podcast**: Reproductor de podcast con animación de café que se va bebiendo
- **Walkman NAKAMAS**: Reproductor de música retro con casete animado
- **V3R M4P4**: Botón con efectos de explosión pixelada
- **Mapa del Grand Line**: Roadmap completo del proyecto
- **Pacto de Unión**: Formulario NDA que genera 3 copias en IPFS (Postulante, TIDElabs, Capitán)
- **Diseño retro-pixel**: Estilo nostálgico con tipografía Press Start 2P y efectos neon

---

## 🛠️ Tecnologías

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Node.js + Express
- **Storage**: NFT.storage (IPFS)
- **Tipografía**: Press Start 2P (Google Fonts)

---

## 📦 Instalación

### Requisitos Previos

- Node.js 22.x o superior
- pnpm 10.x o superior

### Pasos

1. **Clonar el repositorio**

```bash
git clone https://github.com/TU_USUARIO/Nakamas-Crew.git
cd Nakamas-Crew
```

2. **Instalar dependencias**

```bash
pnpm install
```

3. **Configurar variables de entorno** (opcional)

El proyecto ya incluye la API key de NFT.storage configurada. Si deseas usar tu propia key:

- Edita `client/src/utils/nftStorage.ts`
- Reemplaza la variable `NFT_STORAGE_API_KEY` con tu propia key

4. **Iniciar en modo desarrollo**

```bash
pnpm run dev
```

La aplicación estará disponible en `http://localhost:3000`

---

## 🚀 Deploy en Producción

### Opción 1: Deploy Manual en VPS

#### 1. Compilar el proyecto

```bash
pnpm run build
```

Esto generará los archivos optimizados en la carpeta `dist/`

#### 2. Subir archivos al servidor

Sube el contenido de la carpeta `dist/` a tu servidor VPS.

#### 3. Configurar Nginx

Crea un archivo de configuración en `/etc/nginx/sites-available/nakamas-crew`:

```nginx
server {
    listen 80;
    server_name nakamas-crew.xyz www.nakamas-crew.xyz;

    root /var/www/nakamas-crew/public;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Caché para assets estáticos
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Compresión gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;
}
```

Activa el sitio:

```bash
sudo ln -s /etc/nginx/sites-available/nakamas-crew /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 4. Configurar SSL con Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d nakamas-crew.xyz -d www.nakamas-crew.xyz
```

#### 5. Iniciar el servidor Node.js

```bash
cd /var/www/nakamas-crew
NODE_ENV=production node dist/index.js
```

Para mantenerlo corriendo, usa PM2:

```bash
npm install -g pm2
pm2 start dist/index.js --name nakamas-crew
pm2 save
pm2 startup
```

---

### Opción 2: Deploy con Docker

#### 1. Construir la imagen

```bash
docker build -t nakamas-crew .
```

#### 2. Ejecutar el contenedor

```bash
docker run -d -p 3000:3000 --name nakamas-crew nakamas-crew
```

#### 3. Con Docker Compose

```bash
docker-compose up -d
```

---

### Opción 3: Deploy en Vercel

1. Instala Vercel CLI:

```bash
npm install -g vercel
```

2. Deploy:

```bash
vercel
```

3. Sigue las instrucciones en pantalla

---

### Opción 4: Deploy en Netlify

1. Instala Netlify CLI:

```bash
npm install -g netlify-cli
```

2. Deploy:

```bash
netlify deploy --prod
```

3. Selecciona la carpeta `dist/public` como directorio de publicación

---

## 📁 Estructura del Proyecto

```
nakamas-crew/
├── client/              # Frontend React
│   ├── src/
│   │   ├── components/  # Componentes React
│   │   ├── pages/       # Páginas
│   │   ├── utils/       # Utilidades (NFT.storage)
│   │   └── index.css    # Estilos globales
│   ├── public/          # Assets estáticos
│   │   └── audio/       # Archivos de audio
│   └── index.html       # HTML principal
├── server/              # Backend Node.js
│   └── index.ts         # Servidor Express
├── dist/                # Build de producción
├── vite.config.ts       # Configuración de Vite
├── tailwind.config.js   # Configuración de Tailwind
├── package.json         # Dependencias
└── README.md            # Este archivo
```

---

## 🎮 Uso

### Navegación

1. **TIDETV**: Usa los botones "SIGUIENTE" y "ATRÁS" o las flechas del teclado para navegar por las diapositivas
2. **Café y Podcast**: Haz clic en [PLAY] para escuchar el podcast. El café se irá bebiendo mientras escuchas
3. **Walkman**: Reproduce "REY DE LOS EMPRENDEDORES" de Vahoman
4. **V3R M4P4**: Haz clic en el botón para ver la explosión pixelada
5. **Botella**: Haz clic en la botella flotante para abrir el formulario de reclutamiento

### Formulario de Reclutamiento

El formulario genera 3 copias del pacto en IPFS:
- **Copia 1**: Para el postulante
- **Copia 2**: Para TIDElabs
- **Copia 3**: Para el Capitán

Los datos se almacenan permanentemente en IPFS mediante NFT.storage.

---

## 🔧 Configuración Avanzada

### Cambiar la API Key de NFT.storage

Edita `client/src/utils/nftStorage.ts`:

```typescript
const NFT_STORAGE_API_KEY = 'TU_API_KEY_AQUI';
```

### Cambiar los archivos de audio

Reemplaza los archivos en `client/public/audio/`:
- `podcast.m4a` - Podcast de TIDElabs
- `rey-de-los-emprendedores.mp3` - Canción de Vahoman

### Personalizar colores

Edita `client/src/index.css` para cambiar los colores principales:
- Verde neon: `#39ff14`
- Cian: `#00bfff`

---

## 📝 Scripts Disponibles

```bash
pnpm run dev        # Modo desarrollo
pnpm run build      # Compilar para producción
pnpm run start      # Iniciar servidor de producción
pnpm run preview    # Vista previa del build
```

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es privado y pertenece a TIDElabs.

---

## 👥 Contacto

**Capitán**: [@Web3Sh4rK](https://t.me/Web3Sh4rK)

**Proyecto**: [nakamas-crew.xyz](https://nakamas-crew.xyz)

---

## 🙏 Agradecimientos

- Tipografía Press Start 2P de Google Fonts
- NFT.storage por el almacenamiento descentralizado
- La comunidad de One Piece por la inspiración

---

**¡Únete a la tripulación y ayuda al Capitán a ser el Rey de los Emprendedores!** 🏴‍☠️

