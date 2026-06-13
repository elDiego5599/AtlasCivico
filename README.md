# AtlasCívico

Plataforma cívico-ambiental de monitoreo de obras públicas y alertas climáticas
en Colombia. Proyecto diseñado inicialmente para el municipio de Barranquilla y
el departamento del Atlántico, con proyección de escalabilidad nacional.

---

# Planteamiento del Problema

En Colombia, las entidades públicas están obligadas a publicar su contratación y
datos ambientales según la Ley 1712 de 2014. Sin embargo, el acceso efectivo y
la usabilidad de estos datos se ven limitados por barreras técnicas:

* **Complejidad y opacidad del SECOP II:** las descripciones de los contratos
  de obras públicas están cargadas de tecnicismos legales y administrativos. Un
  ciudadano común no identifica con claridad el propósito, costo ni contratista
  de las obras de su entorno.

* **Urgencia del fenómeno de El Niño:** los reportes de sequías, temperaturas
  extremas y calidad del aire se publican de manera fragmentada. No existe un
  canal unificado y simplificado de consulta para la ciudadanía del
  departamento del Atlántico.

* **Inestabilidad de los servidores públicos:** las APIs de las plataformas del
  Estado (datos.gov.co) presentan latencias elevadas y caídas frecuentes, lo
  que hace inviable depender de consultas en tiempo real directamente desde el
  navegador del usuario.

---

# Arquitectura de Datos y Flujo de Procesamiento

Para resolver estas limitaciones sin incurrir en costos de procesamiento de
Inteligencia Artificial en la nube, el proyecto implementa una base de datos
intermedia (PostgreSQL) y procesamiento de lenguaje natural local a costo cero
en la estación de trabajo de desarrollo (utilizando GPUs con aceleración por
hardware). El ciclo de vida del dato consta de las siguientes fases:

1. **Extracción:** un script en Python consulta diariamente la API SODA de
   Socrata, aplicando filtros geográficos por el código DIVIPOLA de
   Barranquilla (`08001`) para obtener nuevos contratos de obra y alertas
   climáticas.

2. **Transformación con LLM local:** las descripciones legales complejas se
   envían de forma asíncrona a un modelo Llama-3-8B ejecutado con Ollama. El
   modelo simplifica la sintaxis a un lenguaje comprensible para el ciudadano
   común.

3. **Carga:** los datos limpios, formateados y con la descripción resumida se
   almacenan en la base de datos de producción remota.

4. **Consumo:** el frontend web (React) realiza peticiones REST al servidor
   FastAPI, el cual consulta directamente la base de datos PostgreSQL,
   garantizando tiempos de respuesta mínimos e independencia de los servidores
   del Estado.

---

# Modelo Entidad-Relación de la Base de Datos

El modelo relacional asocia contratos y variables climáticas según la
clasificación oficial de municipios de Colombia (DIVIPOLA). Consta de tres
entidades principales:

* `municipios`: división política del territorio nacional (código DIVIPOLA como
  llave primaria, nombre y departamento).

* `contratos`: información contractual de SECOP II, relacionada a un municipio.

* `reportes_clima`: histórico de variables climáticas por municipio.

## Sentencias SQL de Creación de Tablas (DDL)

```sql
CREATE TABLE municipios (
    codigo_divipola VARCHAR(5) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    departamento VARCHAR(100) NOT NULL
);

CREATE TABLE contratos (
    id_contrato VARCHAR(50) PRIMARY KEY,
    codigo_divipola VARCHAR(5) REFERENCES municipios(codigo_divipola),
    entidad VARCHAR(255) NOT NULL,
    contratista VARCHAR(255) NOT NULL,
    objeto_original TEXT NOT NULL,
    objeto_simplificado TEXT,
    valor_total NUMERIC(15, 2) NOT NULL,
    fecha_firma DATE,
    estado VARCHAR(50) NOT NULL,
    url_secop VARCHAR(500),
    latitud DOUBLE PRECISION,
    longitud DOUBLE PRECISION
);

CREATE TABLE reportes_clima (
    id_reporte SERIAL PRIMARY KEY,
    codigo_divipola VARCHAR(5) REFERENCES municipios(codigo_divipola),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    temperatura NUMERIC(4, 2),
    humedad_relativa NUMERIC(5, 2),
    indice_calor NUMERIC(4, 2),
    alerta_incendio BOOLEAN DEFAULT FALSE,
    nivel_rio NUMERIC(5, 2),
    latitud DOUBLE PRECISION,
    longitud DOUBLE PRECISION
);
```

> Se agregaron columnas `latitud` y `longitud` para permitir la renderización
> de mapas interactivos.

## Índices recomendados

```sql
CREATE INDEX idx_contratos_codigo_divipola
ON contratos(codigo_divipola);

CREATE INDEX idx_reportes_clima_codigo_fecha
ON reportes_clima(codigo_divipola, fecha_registro DESC);

CREATE INDEX idx_contratos_estado
ON contratos(estado);
```

---

# Requerimientos del Sistema

## Requerimientos Funcionales

* **RF-01:** Listar los contratos de obra pública del municipio seleccionado,
  detallando contratista, valor formateado en moneda local y estado del proyecto.

* **RF-02:** Almacenar y desplegar la versión simplificada del objeto del
  contrato generada mediante el pipeline local de procesamiento de lenguaje
  natural. Si la simplificación falla, se muestra el texto original con una
  advertencia.

* **RF-03:** Calcular y mostrar el índice de calor y la sensación térmica
  basados en los datos de las estaciones meteorológicas locales.

* **RF-04:** Renderizar mapas interactivos donde se ubiquen las obras y alertas
  vigentes que cuenten con coordenadas válidas.

## Requerimientos No Funcionales

* **RNF-01:** La interfaz de usuario debe cargar en un tiempo inferior a 1.5
  segundos mediante el uso de consultas optimizadas e indexación.

* **RNF-02:** El diseño debe ser adaptativo (Mobile-First) y compatible con
  dispositivos de bajos recursos, incluyendo teléfonos con más de 10 años de
  antigüedad.

* **RNF-03:** El pipeline de actualización de datos debe ejecutarse como un
  proceso en segundo plano, sin bloquear el servidor API.

* **RNF-04:** La aplicación debe ser configurable mediante variables de entorno
  para facilitar la transición de bases de datos locales de desarrollo (SQLite)
  a producción (PostgreSQL).

* **RNF-05:** Toda comunicación debe realizarse sobre HTTPS. Los secretos y
  credenciales nunca deben estar hardcodeados.

* **RNF-06:** La API debe incluir rate limiting para prevenir abusos.

---

# Stack Tecnológico

* **Frontend:** React + Vite (HTML5, CSS3, JavaScript/JSX). Compatibilidad con
  navegadores antiguos mediante `@vitejs/plugin-legacy`.

* **Estilos:** Tailwind CSS y componentes de Shadcn/ui. La interfaz utiliza
  colores (verde, rojo, amarillo, gris) para comunicar estados, sin dependencia
  de emojis.

* **Mapas:** Leaflet (ligero, no requiere WebGL).

* **Backend:** FastAPI (Python 3.10+).

* **Base de datos:** PostgreSQL en producción, SQLite en desarrollo local.

* **ORM:** SQLModel.

* **Inferencia local:** Ollama administrando Llama-3-8B-Instruct mediante
  aceleración por hardware (CUDA).

---

# Seguridad

El proyecto maneja exclusivamente datos públicos, pero se aplican medidas de
seguridad para proteger la infraestructura, la integridad de la información y
la privacidad de los usuarios (si en el futuro se implementan funcionalidades de
personalización).

## Protección en tránsito

* Todo el tráfico se sirve sobre **HTTPS**. En producción se debe usar
  LetsEncrypt o similar, con cabecera HSTS (Strict-Transport-Security).

* Configuración de **CORS restrictivo**: solo el origen del frontend autorizado.

* Cabeceras de seguridad (`X-Content-Type-Options: nosniff`,
  `X-Frame-Options: DENY`, etc.) aplicadas en el servidor.

## Gestión de secretos

* **Variables de entorno** para todas las configuraciones sensibles: cadena de
  conexión a la base de datos, claves de API, secretos de firma.

* El archivo `.env` **no se sube al repositorio**. Se incluye un
  `.env.example` con valores dummy.

* En producción se recomienda un gestor de secretos
  (ej. HashiCorp Vault, AWS Secrets Manager).

## API (FastAPI)

* **Rate limiting** con `slowapi` para prevenir scraping y ataques de
  denegación de servicio.

* **Validación estricta de entradas** mediante esquemas de Pydantic
  (límites de longitud, tipos exactos).

* Middleware `TrustedHostMiddleware` para prevenir ataques de encabezado `Host`.

* Los mensajes de error no exponen detalles de implementación.

## Base de datos

* La base de datos **no se expone a internet**; solo acepta conexiones desde el
  backend a través de una red privada (o localhost).

* Credenciales robustas y almacenadas en variables de entorno.

* Backups periódicos automatizables (se incluye script de `pg_dump` como
  ejemplo). En producción se cifrarían los backups.

## Dependencias

* Versiones fijadas en `requirements.txt` y `package.json`.

* Auditorías periódicas con `pip-audit` y `npm audit`.

* Contenedores Docker (si se usan) con imágenes oficiales y sin ejecución como
  root.

## Frontend

* **Política de Seguridad de Contenido (CSP)** estricta.

* Sanitización de cualquier contenido dinámico con `DOMPurify`.

* Los tokens de sesión (si se implementan) deben almacenarse en cookies
  `HttpOnly; Secure; SameSite=Strict`.

## Criptografía (lineamientos)

* Para cifrado de datos en reposo (si se requiriera) se usaría
  **AES-256-GCM** con claves derivadas mediante Argon2.

* Comunicaciones internas con **TLS mutuo** si la arquitectura se distribuye.

* Firma digital de los datos obtenidos de fuentes externas (opcional, pero
  recomendado para garantizar integridad).

---

# Instalación y Configuración del Entorno

## Prerrequisitos

* Python 3.10+
* Node.js 18+
* PostgreSQL (para producción) o SQLite (para desarrollo)
* Ollama instalado y con el modelo `llama3` descargado
* (Opcional) GPU NVIDIA con CUDA para acelerar la inferencia

## Backend (FastAPI) e Inferencia Local

```bash
# Asegurarse de que Ollama está corriendo con el modelo
ollama pull llama3

cd backend

python -m venv venv

# Linux / macOS
source venv/bin/activate

# Windows
venv\Scripts\activate

pip install -r requirements.txt

# Ejecutar migraciones (crea las tablas)
python database_setup.py

# Cargar datos semilla para demostración (opcional pero recomendado)
python seed_data.py

# Iniciar el servidor de la API
uvicorn main:app --reload
```

## Frontend (React + Vite)

```bash
cd frontend

npm install

npm run dev
```

La aplicación estará disponible en:

```txt
http://localhost:5173
```

Para producción, generar el build con:

```bash
npm run build
```

y servirlo mediante FastAPI o un servidor web dedicado.

---

# Robustez del Pipeline de Datos

* El script de extracción utiliza **reintentos con backoff exponencial**
  para manejar fallos de la API pública.

* Las tareas de simplificación se procesan de manera asíncrona usando un
  worker interno. Si el modelo falla, se almacena el texto original y se
  activa un flag `simplificacion_fallo` para que el frontend lo muestre con
  una advertencia.

* Las inserciones son idempotentes (`UPSERT`) para evitar duplicados cuando
  un contrato cambia de estado.

* El código DIVIPOLA se parametriza mediante variable de entorno para
  facilitar la expansión a otros municipios.

---

# Escalabilidad y Roadmap Futuro

El proyecto está preparado para escalar a nivel nacional sin cambios
estructurales. Algunas mejoras planificadas para cuando se requiera mayor
capacidad:

* Migrar la inferencia a un servidor con GPU dedicada y colas distribuidas
  (Celery + Redis o RabbitMQ).

* Implementar cache con Redis para consultas frecuentes y endpoints de mapas.

* Fine-tuning del modelo con un corpus de contratos reales simplificados por
  expertos.

* Índices espaciales (PostGIS) y clustering de marcadores en el frontend.

* Autenticación opcional para personalizar la experiencia por municipio.

* Monitoreo y alertas sobre la frescura de los datos.

---

# Experiencia de Usuario y Accesibilidad

* **Diseño adaptativo (Mobile-First)** probado en emuladores de dispositivos
  antiguos (Android 5, 1 GB de RAM).

* **Colores funcionales:** verde para activo/en ejecución, rojo para alertas o
  problemas, amarillo para precaución, gris para finalizado. No se utilizan
  emojis como único medio para transmitir información.

* **Tipografía clara y botones grandes (mínimo 48x48 px).**

* Navegación simplificada con búsqueda por municipio y tarjetas de información
  jerarquizada.

* Compatibilidad con lectores de pantalla gracias a los componentes accesibles
  de Shadcn/ui (basados en Radix).

---

# Licencia

MIT License. Ver archivo `LICENSE` para más detalles.
