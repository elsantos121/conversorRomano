# Conversor de Números Romanos y Arábigos

API REST para convertir números romanos a arábigos y viceversa mediante endpoints HTTP.

## Descripción

Este proyecto proporciona una API REST construida con Express.js que permite realizar conversiones bidireccionales entre números romanos y números arábigos. La API está diseñada para ser utilizada por aplicaciones web y móviles, con soporte CORS habilitado para solicitudes cruzadas.

## Requisitos Previos

- Node.js (versión 12.0 o superior)
- npm (generalmente incluido con Node.js)

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/elsantos121/conversorRomano.git
cd conversorRomano
```

Instalar las dependencias del proyecto:

```bash
npm install
```

## Uso

Iniciar el servidor:

```bash
npm start
```

El servidor se ejecutará en `http://localhost:3000` por defecto.

Para desarrollo con reinicio automático (requiere nodemon):

```bash
npm run dev
```

## Endpoints de la API

### Convertir Arábigos a Romanos

```
GET /a2r?arabic=<número>
```

Convierte un número arábigo a su representación en números romanos.

Parámetros:
- `arabic` (requerido): Número entero entre 1 y 3999

Respuesta exitosa (200):
```json
{
  "roman": "CXXIII"
}
```

Ejemplo:
```bash
curl "http://localhost:3000/a2r?arabic=123"
```

### Convertir Romanos a Arábigos

```
GET /r2a?roman=<número_romano>
```

Convierte un número romano a su representación en arábigos.

Parámetros:
- `roman` (requerido): Número romano válido en mayúsculas

Respuesta exitosa (200):
```json
{
  "arabic": 123
}
```

Ejemplo:
```bash
curl "http://localhost:3000/r2a?roman=CXXIII"
```

## Códigos de Estado

- `200 OK`: La conversión fue exitosa
- `400 Bad Request`: Parámetros ausentes, inválidos o fuera de rango

Respuesta de error (400):
```json
{
  "error": "Descripción del error"
}
```

## Validación de Entrada

### Números Arábigos

- Deben ser números enteros
- Rango válido: 1 - 3999
- No se aceptan decimales, números negativos ni cero

### Números Romanos

- Deben contener solo caracteres válidos: I, V, X, L, C, D, M
- Deben estar en mayúsculas
- Deben representar un número entre 1 y 3999
- Se valida que sean números romanos válidos (se reconvierte para verificar)

## Ejemplos de Uso

Conversión de arábigos a romanos:

```bash
curl "http://localhost:3000/a2r?arabic=1"
# Respuesta: {"roman":"I"}

curl "http://localhost:3000/a2r?arabic=444"
# Respuesta: {"roman":"CDXLIV"}

curl "http://localhost:3000/a2r?arabic=3999"
# Respuesta: {"roman":"MMMCMXCIX"}
```

Conversión de romanos a arábigos:

```bash
curl "http://localhost:3000/r2a?roman=I"
# Respuesta: {"arabic":1}

curl "http://localhost:3000/r2a?roman=CDXLIV"
# Respuesta: {"arabic":444}

curl "http://localhost:3000/r2a?roman=MMMCMXCIX"
# Respuesta: {"arabic":3999}
```

Solicitudes con parámetros inválidos:

```bash
curl "http://localhost:3000/a2r?arabic=4000"
# Respuesta: {"error":"El número debe estar entre 1 y 3999"} [400]

curl "http://localhost:3000/a2r"
# Respuesta: {"error":"Parámetro \"arabic\" ausente"} [400]

curl "http://localhost:3000/r2a?roman=ABC"
# Respuesta: {"error":"Parámetro \"roman\" inválido"} [400]
```

## Testing

Ejecutar la suite de pruebas:

```bash
npm test
```

La suite incluye 15 tests automatizados que validan:

- Conversiones correctas en ambas direcciones
- Manejo de parámetros ausentes
- Manejo de parámetros inválidos
- Validación de rangos
- Números en los límites del rango (1 y 3999)
- Conversión bidireccional
- Números decimales y negativos

Los tests utilizan Jest y supertest para realizar pruebas de integración contra los endpoints HTTP.

## Características de CORS

La API tiene CORS habilitado por defecto, permitiendo solicitudes desde cualquier origen. Esto es necesario para que aplicaciones web externas puedan consumir la API.

Para modificar la configuración de CORS, edite la línea en `romanos.js`:

```javascript
app.use(cors());
```

## Estructura del Proyecto

```
conversorRomano/
├── romanos.js          Archivo principal de la API
├── package.json        Dependencias del proyecto
├── README.md          Este archivo
└── test/
    └── romanos.test.js Suite de pruebas automatizadas
```

## Funciones Principales

### arabicToRoman(num)

Convierte un número arábigo a romano.

Parámetros:
- `num`: Número entero entre 1 y 3999

Retorna:
- String con el número romano o null si es inválido

### romanToArabic(roman)

Convierte un número romano a arábigo.

Parámetros:
- `roman`: String con el número romano en mayúsculas

Retorna:
- Número entero entre 1 y 3999 o null si es inválido

## Limitaciones

- Solo soporta números entre 1 y 3999
- Los números romanos deben estar en mayúsculas
- No se soportan números decimales
- No se soportan números romanos con vinculum (línea sobre el símbolo para números mayores a 3999)

## Dependencias

- express (^4.18.2): Framework web para Node.js
- cors (^2.8.5): Middleware para habilitar CORS
- jest (^29.7.0): Framework de testing
- supertest (^6.3.3): Librería para testear APIs HTTP

## Licencia

ISC

## Autor

elsantos121

## Contribuciones

Las contribuciones son bienvenidas. Para cambios significativos, por favor abra un issue primero para discutir los cambios propuestos.

## Troubleshooting

### El servidor no inicia

Asegúrese de que el puerto 3000 no esté en uso. Si necesita usar un puerto diferente:

```bash
PORT=3001 npm start
```
