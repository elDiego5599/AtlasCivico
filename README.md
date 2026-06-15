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

CREATE INDEX idx_contratos_divipola
ON contratos(codigo_divipola);

CREATE INDEX idx_reportes_clima_divipola
ON reportes_clima(codigo_divipola);

CREATE INDEX idx_reportes_clima_fecha
ON reportes_clima(fecha_registro DESC);
```

---

# Estrategia de Ingesta de Datos (UPSERT)

Debido a que los contratos públicos pueden cambiar de estado con el tiempo
(por ejemplo, pasar de "En ejecución" a "Liquidado"), el pipeline ETL debe
manejar actualizaciones sin producir errores por llaves primarias duplicadas.

Para ello, PostgreSQL utilizará operaciones de tipo `UPSERT`
(`INSERT ... ON CONFLICT DO UPDATE`).

## Ejemplo de carga tolerante a actualizaciones

```sql
INSERT INTO contratos (
    id_contrato,
    codigo_divipola,
    entidad,
    contratista,
    objeto_original,
    objeto_simplificado,
    valor_total,
    fecha_firma,
    estado,
    url_secop
)
VALUES (... )
ON CONFLICT (id_contrato)
DO UPDATE SET
    estado = EXCLUDED.estado,
    valor_total = EXCLUDED.valor_total;
```

Este enfoque garantiza:

* Actualización automática de contratos existentes.
* Prevención de errores `Unique Violation`.
* Idempotencia en los procesos ETL diarios.
* Sincronización consistente con SECOP II.

---

# Estructura del Proyecto (Monorepo)

La separación de responsabilidades entre frontend, backend y ETL permite
trabajo colaborativo simultáneo sin conflictos frecuentes de Git.

```txt
AtlasCivico/
├── backend/             # Código de FastAPI, esquemas SQLModel y routers API
├── frontend/            # Código React, Vite, Tailwind y componentes UI
├── etl/                 # Extracción SODA API y procesamiento con Ollama
│   ├── config.py
│   ├── extract.py
│   └── summarize.py     # Interacción con Llama-3-8B
├── .gitignore
└── README.md
```

Esta estructura evita mezclar:

* `venv/`
* `node_modules/`
* archivos temporales de ETL,
* configuraciones locales de desarrollo.

También facilita la división del trabajo durante el semestre y las vacaciones,
permitiendo que un integrante trabaje sobre el frontend mientras el otro
desarrolla backend y procesamiento de datos.

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

* **Estilos:** Tailwind CSS y componentes de Shadcn/ui.

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
la privacidad de los usuarios.

## Protección en tránsito

* Todo el tráfico se sirve sobre HTTPS.
* Configuración de CORS restrictivo.
* Cabeceras de seguridad (`X-Frame-Options`, `nosniff`, etc.).

## Gestión de secretos

* Variables de entorno para configuraciones sensibles.
* `.env` excluido del repositorio.
* `.env.example` con valores dummy.

## API (FastAPI)

* Rate limiting con `slowapi`.
* Validación estricta mediante Pydantic.
* Uso de `TrustedHostMiddleware`.

## Base de datos

* Acceso restringido únicamente desde el backend.
* Backups automatizables.
* Credenciales robustas.

## Dependencias

* Versiones fijadas en `requirements.txt` y `package.json`.
* Auditorías con `pip-audit` y `npm audit`.

## Frontend

* Política CSP estricta.
* Sanitización con `DOMPurify`.

## Criptografía

* AES-256-GCM para cifrado en reposo.
* TLS mutuo para comunicaciones internas distribuidas.

---

# Instalación y Configuración del Entorno

## Prerrequisitos

* Python 3.10+
* Node.js 18+
* PostgreSQL o SQLite
* Ollama instalado
* Modelo `llama3` descargado

## Backend (FastAPI) e Inferencia Local

```bash
ollama pull llama3

cd backend

python -m venv venv

# Linux / macOS
source venv/bin/activate

# Windows
venv\Scripts\activate

pip install -r requirements.txt

python database_setup.py

python seed_data.py

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

---

# Robustez del Pipeline de Datos

* Reintentos con backoff exponencial.
* Procesamiento asíncrono de simplificación.
* Inserciones idempotentes (`UPSERT`).
* Parametrización por código DIVIPOLA.

---

# Escalabilidad y Roadmap Futuro

* Migración a colas distribuidas (Celery + Redis).
* Cache con Redis.
* Fine-tuning del modelo.
* Integración con PostGIS.
* Autenticación opcional.
* Monitoreo de frescura de datos.

---

# Experiencia de Usuario y Accesibilidad

* Diseño Mobile-First.
* Compatibilidad con dispositivos antiguos.
* Botones grandes y navegación simplificada.
* Compatibilidad con lectores de pantalla.

---

# Licencia

MIT License. Ver archivo `LICENSE` para más detalles.

