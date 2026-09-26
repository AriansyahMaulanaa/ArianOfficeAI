const operations = {
  '+': (left, right) => left + right,
  '−': (left, right) => left - right,
  '×': (left, right) => left * right,
  '÷': (left, right) => left / right,
};

export function calculate(left, operation, right) {
  if (!Number.isFinite(left) || !Number.isFinite(right)) {
    throw new TypeError('Masukkan angka yang valid.');
  }
  if (!Object.hasOwn(operations, operation)) {
    throw new TypeError('Operasi tidak dikenal.');
  }
  if (operation === '÷' && right === 0) {
    throw new RangeError('Tidak dapat membagi dengan nol.');
  }
  const result = operations[operation](left, right);
  if (!Number.isFinite(result)) throw new RangeError('Hasil perhitungan di luar batas.');
  return Number.parseFloat(result.toPrecision(12));
}
