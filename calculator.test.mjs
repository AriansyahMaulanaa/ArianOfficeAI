import test from 'node:test';
import assert from 'node:assert/strict';
import { calculate } from './calculator.mjs';

test('menghitung empat operasi dasar', () => {
  assert.equal(calculate(12, '+', 8), 20);
  assert.equal(calculate(12, '−', 8), 4);
  assert.equal(calculate(12, '×', 8), 96);
  assert.equal(calculate(12, '÷', 8), 1.5);
});

test('mendukung angka negatif dan pecahan', () => {
  assert.equal(calculate(-2.5, '×', 4), -10);
  assert.equal(calculate(1, '÷', 3), 0.333333333333);
});

test('menolak pembagian dengan nol', () => {
  assert.throws(() => calculate(10, '÷', 0), { name: 'RangeError', message: 'Tidak dapat membagi dengan nol.' });
});

test('memvalidasi angka, operasi, dan hasil', () => {
  assert.throws(() => calculate(Number.NaN, '+', 1), TypeError);
  assert.throws(() => calculate(1, '^', 2), TypeError);
  assert.throws(() => calculate(Number.MAX_VALUE, '×', 2), RangeError);
});
