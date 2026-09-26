import { calculate } from './calculator.mjs';

const display = document.querySelector('#display');
const expression = document.querySelector('#expression');
const message = document.querySelector('#message');
const keys = document.querySelector('.keys');
let current = '0';
let stored = null;
let operation = null;
let replaceCurrent = false;
let completed = false;

function render() {
  display.textContent = current;
  expression.textContent = stored !== null && operation ? `${stored} ${operation}${replaceCurrent ? '' : ` ${current}`}` : '\u00a0';
  keys.querySelectorAll('[data-operation]').forEach((button) => {
    button.classList.toggle('is-selected', button.dataset.operation === operation && replaceCurrent);
  });
}

function setMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle('is-error', isError);
}

function inputDigit(digit) {
  if (replaceCurrent || completed) {
    current = digit;
    replaceCurrent = false;
    completed = false;
  } else if (current === '0') current = digit;
  else if (current.replace('-', '').length < 15) current += digit;
  setMessage('Siap menghitung');
  render();
}

function inputDecimal() {
  if (replaceCurrent || completed) { current = '0'; replaceCurrent = false; completed = false; }
  if (!current.includes('.')) current += '.';
  render();
}

function chooseOperation(nextOperation) {
  if (operation && !replaceCurrent) performCalculation();
  stored = Number(current);
  operation = nextOperation;
  replaceCurrent = true;
  completed = false;
  setMessage('Pilih angka berikutnya');
  render();
}

function performCalculation() {
  if (!operation || stored === null || replaceCurrent) return;
  const left = stored;
  const right = Number(current);
  const selectedOperation = operation;
  try {
    current = String(calculate(left, selectedOperation, right));
    expression.textContent = `${left} ${selectedOperation} ${right} =`;
    stored = null;
    operation = null;
    replaceCurrent = true;
    completed = true;
    setMessage('Perhitungan selesai');
  } catch (error) {
    current = '0';
    stored = null;
    operation = null;
    replaceCurrent = true;
    completed = false;
    expression.textContent = `${left} ${selectedOperation} ${right}`;
    setMessage(error.message, true);
  }
  renderValueOnly();
}

function renderValueOnly() {
  display.textContent = current;
  keys.querySelectorAll('[data-operation]').forEach((button) => button.classList.remove('is-selected'));
}

function clear() {
  current = '0'; stored = null; operation = null; replaceCurrent = false; completed = false;
  setMessage('Siap menghitung'); render();
}

function handleAction(action) {
  if (action === 'clear') clear();
  if (action === 'equals') performCalculation();
  if (action === 'decimal') inputDecimal();
  if (action === 'backspace') {
    if (!replaceCurrent && !completed) current = current.length > 1 ? current.slice(0, -1) : '0';
    render();
  }
  if (action === 'sign' && current !== '0') { current = current.startsWith('-') ? current.slice(1) : `-${current}`; render(); }
  if (action === 'percent') {
    current = String(Number(current) / 100);
    setMessage('Nilai diubah menjadi persen');
    render();
  }
}

keys.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.digit !== undefined) inputDigit(button.dataset.digit);
  else if (button.dataset.operation) chooseOperation(button.dataset.operation);
  else if (button.dataset.action) handleAction(button.dataset.action);
});

document.addEventListener('keydown', (event) => {
  if (/^[0-9]$/.test(event.key)) inputDigit(event.key);
  else if (event.key === '.' || event.key === ',') inputDecimal();
  else if (event.key === '+') chooseOperation('+');
  else if (event.key === '-') chooseOperation('−');
  else if (event.key === '*') chooseOperation('×');
  else if (event.key === '/') { event.preventDefault(); chooseOperation('÷'); }
  else if (event.key === 'Enter' || event.key === '=') { event.preventDefault(); performCalculation(); }
  else if (event.key === 'Backspace') handleAction('backspace');
  else if (event.key === 'Escape') clear();
});

render();
