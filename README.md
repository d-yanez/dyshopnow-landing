🗺️ Arquitectura general


CLIENTE (navegador)
        │
        ▼
Cloud Run (Node.js + Express)
        │
        ▼
EJS Templates (Home + Categorías + Productos)
        │
        ▼
JSON dinámico (bucket GCS)
        │
        ├── Imágenes optimizadas (GCS Bucket)
        ├── SKU stock checker API (consulta stock en Dyshopnow/Bsale)
        ├── SEO meta tags dinámicos (title, description, og:image, etc.)
        ▼
Google Search Console + Sitemap (SEO)

📂 Estructura inicial del proyecto (General)

dyshopnow-landing/
├── src/
│   ├── app.js             # Servidor Express
│   ├── routes/
│   │   ├── home.js        # Ruta Home
│   │   ├── category.js    # Ruta Categorías (/blox-fruits, /sonic)
│   │   └── product.js     # Ruta Productos dinámicos
│   ├── views/
│   │   ├── home.ejs       # Vista Home (categorías)
│   │   ├── category.ejs   # Vista Categoría (productos)
│   │   └── partials/      # Header, Footer, SEO meta tags
│   ├── utils/
│   │   ├── stockChecker.js # Consulta stock por SKU
│   │   └── seoHelper.js    # Genera metatags dinámicos
│   └── dataLoader.js      # Carga JSON dinámico desde bucket
├── public/
│   ├── css/               # Tailwind CSS compilado
│   ├── js/                # Efectos JS
│   └── images/            # Placeholder imágenes locales
├── bucket-data/           # JSON plano con datos
│   └── catalog.json
├── package.json
├── sitemap.xml
├── robots.txt
└── README.md


📦 JSON dinámico inicial (bucket)

{
  "categories": [
    {
      "slug": "blox-fruits",
      "title": "Blox Fruits",
      "description": "Descubre productos exclusivos de Blox Fruits para fans y coleccionistas.",
      "banner": "https://storage.googleapis.com/dyshopnow-landing-assets/blox-fruits/banner.jpg",
      "priority": 1,
      "products": [
        {
          "sku": "BF001",
          "title": "Figura Blox Fruits Luffy",
          "price": 14990,
          "image": "https://storage.googleapis.com/dyshopnow-landing-assets/blox-fruits/luffy.jpg",
          "status": "active",  // inactive = no mostrar
          "tags": ["Nuevo", "En oferta"],
          "url": "https://dyshopnow.cl/producto/figura-blox-fruits-luffy"
        }
      ]
    }
  ]
}


🧱 Fases de desarrollo paso a paso
Paso	Descripción	Objetivo
1️⃣	Crear home dinámico (landing.dyshopnow.cl)	Mostrar categorías con banners y links SEO
2️⃣	Diseñar plantilla de categoría (/blox-fruits)	Mostrar productos con imagen, precio y botón
3️⃣	Parametrizar JSON desde bucket GCP	Cargar categorías/productos sin tocar código
4️⃣	Consultar stock por SKU (API Dyshopnow/Bsale)	Mostrar "No disponible" cuando no haya stock
5️⃣	Agregar metadatos SEO y sitemap dinámico	Optimizar indexación y tráfico orgánico
6️⃣	Configurar pipeline de actualización (Cloud Build)	Automatizar publicación de nuevos datos/imágenes
7️⃣	Pruebas SEO (Google Search Console + Lighthouse)	Validar rendimiento y posicionamiento


🧠 Plan de diseño (look moderno)
✅ Paleta Dyshopnow: Negro (#000), Azul eléctrico (#1E90FF), Blanco (#FFFFFF), Matices suaves para hover y sombras.
✅ Efectos: Transiciones CSS, animaciones de entrada, botones con microinteracciones.
✅ Responsive: Mobile-first (90% de tu tráfico llega por móviles).

☁️ Despliegue inicial
Cloud Run para el servidor (escalable on-demand).
Bucket GCP para imágenes y JSON dinámico.
CDN habilitado para carga rápida.

🔥 Plan futuro
✔️ Migrar JSON → MongoDB con panel admin (cuando escale).
✔️ Añadir vector search para el buscador (SEO avanzado).
✔️ Conectar a API Bsale para stock + precios en tiempo real.
✔️ Integrar Analytics + Heatmaps para ver clics en landings.

Detalles:

🗺️ 📊 Diagrama del Proyecto: Arquitectura + Flujo
[Cliente navegador] 
      │
      ▼
[Cloud Run - Node.js + Express]
      │
      ├─ Ruta: /                 → Home dinámico (categorías)
      ├─ Ruta: /:category        → Página categoría (productos)
      ├─ Ruta: /robots.txt       → SEO robots
      ├─ Ruta: /sitemap.xml      → SEO sitemap
      │
      ▼
[Bucket GCS - JSON dinámico]
      │
      ├─ catalog.json            → Datos categorías/productos
      ├─ Imágenes optimizadas    → Banners, productos
      ▼
[Stock API Bsale]                → Verifica stock SKU

📁 Estructura Base del Proyecto

dyshopnow-landing/
├── src/
│   ├── app.js               # Servidor Express
│   ├── routes/
│   │   ├── home.js          # Ruta Home
│   │   ├── category.js      # Ruta Categorías
│   │   └── static.js        # robots.txt, sitemap.xml
│   ├── controllers/
│   │   ├── homeController.js
│   │   ├── categoryController.js
│   ├── views/
│   │   ├── home.ejs         # Vista Home
│   │   ├── category.ejs     # Vista Categoría
│   │   ├── partials/        # Header, Footer, Meta SEO
│   ├── services/
│   │   ├── dataService.js   # Lee JSON dinámico
│   │   └── stockService.js  # Consulta stock SKU
│   ├── utils/
│   │   ├── seoHelper.js     # Genera metadatos SEO
│   │   └── imageOptimizer.js
├── public/
│   ├── css/                 # Tailwind CSS
│   ├── js/                  # Efectos JS
│   └── images/              # Placeholder
├── bucket-data/
│   └── catalog.json         # Datos demo
├── package.json
├── sitemap.xml
├── robots.txt
└── README.md


steps by step:
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
# local test
npm run dev:local

#improve images converte to webP:
1) look dyshopnow/gcp/scripts-sh/convert-to-webp
2) downloas imagens to 'image' and scripts out put in 'image-webP'
3) run ./convert-to-webp.sh