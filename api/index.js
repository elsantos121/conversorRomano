const express = require('express');
const cors = require('cors');

const app = express();

// Habilitar CORS con configuración explícita
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

// Función para convertir arábigos a romanos
function arabicToRoman(num) {
  if (!Number.isInteger(num) || num <= 0 || num >= 4000) {
    return null;
  }

  const romanNumerals = [
    { value: 1000, numeral: 'M' },
    { value: 900, numeral: 'CM' },
    { value: 500, numeral: 'D' },
    { value: 400, numeral: 'CD' },
    { value: 100, numeral: 'C' },
    { value: 90, numeral: 'XC' },
    { value: 50, numeral: 'L' },
    { value: 40, numeral: 'XL' },
    { value: 10, numeral: 'X' },
    { value: 9, numeral: 'IX' },
    { value: 5, numeral: 'V' },
    { value: 4, numeral: 'IV' },
    { value: 1, numeral: 'I' }
  ];

  let roman = '';
  for (let i = 0; i < romanNumerals.length; i++) {
    while (num >= romanNumerals[i].value) {
      roman += romanNumerals[i].numeral;
      num -= romanNumerals[i].value;
    }
  }
  return roman;
}

// Función para convertir romanos a arábigos
function romanToArabic(roman) {
  if (!roman || typeof roman !== 'string') {
    return null;
  }

  const romanValues = {
    'I': 1,
    'V': 5,
    'X': 10,
    'L': 50,
    'C': 100,
    'D': 500,
    'M': 1000
  };

  // Validar que solo contenga caracteres romanos válidos
  if (!/^[IVXLCDM]+$/.test(roman)) {
    return null;
  }

  let total = 0;
  for (let i = 0; i < roman.length; i++) {
    const current = romanValues[roman[i]];
    const next = romanValues[roman[i + 1]];

    if (next && current < next) {
      total -= current;
    } else {
      total += current;
    }
  }

  // Validar que el número esté en rango válido (1-3999)
  if (total <= 0 || total >= 4000) {
    return null;
  }

  // Validar que sea un número romano válido reconvirtiendo
  if (arabicToRoman(total) !== roman) {
    return null;
  }

  return total;
}

// Ruta GET /a2r?arabic=123
app.get('/a2r', (req, res) => {
  const arabicParam = req.query.arabic;

  // Validar que el parámetro exista
  if (arabicParam === undefined || arabicParam === '') {
    return res.status(400).json({ error: 'Parámetro "arabic" ausente' });
  }

  // Convertir a número entero
  const arabic = parseInt(arabicParam, 10);

  // Validar que sea un número válido
  if (isNaN(arabic) || String(arabic) !== arabicParam) {
    return res.status(400).json({ error: 'Parámetro "arabic" inválido' });
  }

  const roman = arabicToRoman(arabic);

  if (roman === null) {
    return res.status(400).json({ error: 'El número debe estar entre 1 y 3999' });
  }

  res.status(200).json({ roman });
});

// Ruta GET /r2a?roman=CXXIII
app.get('/r2a', (req, res) => {
  const romanParam = req.query.roman;

  // Validar que el parámetro exista
  if (romanParam === undefined || romanParam === '') {
    return res.status(400).json({ error: 'Parámetro "roman" ausente' });
  }

  const arabic = romanToArabic(romanParam);

  if (arabic === null) {
    return res.status(400).json({ error: 'Parámetro "roman" inválido' });
  }

  res.status(200).json({ arabic });
});

// Ruta raíz para verificar que el servidor está funcionando
app.get('/', (req, res) => {
  res.json({ message: 'API de conversión de números romanos y arábigos' });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

module.exports = app;
