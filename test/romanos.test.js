const request = require('supertest');
const express = require('express');
const cors = require('cors');

// Importar las funciones de conversión desde el servidor principal
const app = express();
app.use(cors());

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

// Rutas de la API
app.get('/a2r', (req, res) => {
  const arabicParam = req.query.arabic;

  if (arabicParam === undefined || arabicParam === '') {
    return res.status(400).json({ error: 'Parámetro "arabic" ausente' });
  }

  const arabic = parseInt(arabicParam, 10);

  if (isNaN(arabic) || String(arabic) !== arabicParam) {
    return res.status(400).json({ error: 'Parámetro "arabic" inválido' });
  }

  const roman = arabicToRoman(arabic);

  if (roman === null) {
    return res.status(400).json({ error: 'El número debe estar entre 1 y 3999' });
  }

  res.status(200).json({ roman });
});

app.get('/r2a', (req, res) => {
  const romanParam = req.query.roman;

  if (romanParam === undefined || romanParam === '') {
    return res.status(400).json({ error: 'Parámetro "roman" ausente' });
  }

  const arabic = romanToArabic(romanParam);

  if (arabic === null) {
    return res.status(400).json({ error: 'Parámetro "roman" inválido' });
  }

  res.status(200).json({ arabic });
});

// Tests
describe('API de conversión de números romanos', () => {

  // Test 1: Conversión de arábigos a romanos - Caso simple
  test('Test 1: Convertir 123 a romano "CXXIII"', async () => {
    const response = await request(app)
      .get('/a2r')
      .query({ arabic: 123 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ roman: 'CXXIII' });
  });

  // Test 2: Conversión de romanos a arábigos - Caso simple
  test('Test 2: Convertir "CXXIII" a arábigo 123', async () => {
    const response = await request(app)
      .get('/r2a')
      .query({ roman: 'CXXIII' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ arabic: 123 });
  });

  // Test 3: Parámetro ausente en /a2r
  test('Test 3: Parámetro "arabic" ausente debe retornar 400', async () => {
    const response = await request(app)
      .get('/a2r');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  // Test 4: Parámetro ausente en /r2a
  test('Test 4: Parámetro "roman" ausente debe retornar 400', async () => {
    const response = await request(app)
      .get('/r2a');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  // Test 5: Parámetro inválido en /a2r (no es número)
  test('Test 5: Parámetro "arabic" inválido (texto) debe retornar 400', async () => {
    const response = await request(app)
      .get('/a2r')
      .query({ arabic: 'abc' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  // Test 6: Parámetro inválido en /r2a (caracteres no romanos)
  test('Test 6: Parámetro "roman" inválido (caracteres inválidos) debe retornar 400', async () => {
    const response = await request(app)
      .get('/r2a')
      .query({ roman: 'ABC' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  // Test 7: Número arábigo fuera de rango (mayor a 3999)
  test('Test 7: Número arábigo fuera de rango (4000) debe retornar 400', async () => {
    const response = await request(app)
      .get('/a2r')
      .query({ arabic: 4000 });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  // Test 8: Número arábigo fuera de rango (cero o negativo)
  test('Test 8: Número arábigo inválido (0) debe retornar 400', async () => {
    const response = await request(app)
      .get('/a2r')
      .query({ arabic: 0 });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  // Test 9: Convertir número arábigo pequeño (1 a I)
  test('Test 9: Convertir 1 a romano "I"', async () => {
    const response = await request(app)
      .get('/a2r')
      .query({ arabic: 1 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ roman: 'I' });
  });

  // Test 10: Convertir número arábigo grande (3999 a MMMCMXCIX)
  test('Test 10: Convertir 3999 a romano "MMMCMXCIX"', async () => {
    const response = await request(app)
      .get('/a2r')
      .query({ arabic: 3999 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ roman: 'MMMCMXCIX' });
  });

  // Test 11: Conversión bidireccional - Número del medio
  test('Test 11: Conversión bidireccional 444', async () => {
    const response1 = await request(app)
      .get('/a2r')
      .query({ arabic: 444 });

    expect(response1.status).toBe(200);
    const roman = response1.body.roman;

    const response2 = await request(app)
      .get('/r2a')
      .query({ roman: roman });

    expect(response2.status).toBe(200);
    expect(response2.body.arabic).toBe(444);
  });

  // Test 12: Número arábigo con decimal (debe ser inválido)
  test('Test 12: Parámetro "arabic" con decimal debe retornar 400', async () => {
    const response = await request(app)
      .get('/a2r')
      .query({ arabic: '123.5' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  // Test 13: Conversión de romano "I"
  test('Test 13: Convertir "I" a arábigo 1', async () => {
    const response = await request(app)
      .get('/r2a')
      .query({ roman: 'I' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ arabic: 1 });
  });

  // Test 14: Conversión de romano "MMMCMXCIX" (3999)
  test('Test 14: Convertir "MMMCMXCIX" a arábigo 3999', async () => {
    const response = await request(app)
      .get('/r2a')
      .query({ roman: 'MMMCMXCIX' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ arabic: 3999 });
  });

  // Test 15: Número arábigo negativo
  test('Test 15: Número arábigo negativo debe retornar 400', async () => {
    const response = await request(app)
      .get('/a2r')
      .query({ arabic: -5 });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});
