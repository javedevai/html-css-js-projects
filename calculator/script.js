// Theme switcher
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark');
});

// Sidebar navigation
const sidebar = document.querySelector('.sidebar');
const navBtns = document.querySelectorAll('.nav-btn');
const mainSections = document.querySelectorAll('.main-section');

navBtns.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    navBtns.forEach((b) => b.classList.remove('active'));
    mainSections.forEach((s) => s.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.section).classList.add('active');
    sidebar.classList.remove('expanded');
  });
});

sidebar.addEventListener('click', (e) => {
  if (e.target.closest('.nav-btn')) return;
  if (window.innerWidth <= 768) {
    sidebar.classList.toggle('expanded');
  }
});

// Calculator
class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.clear();
  }
  clear() {
    this.currentOperand = '0';
    this.previousOperand = '';
    this.operation = undefined;
    this.updateDisplay();
  }
  delete() {
    if (this.currentOperand === '0') return;
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
    if (this.currentOperand === '' || this.currentOperand === '-') {
      this.currentOperand = '0';
    }
    this.updateDisplay();
  }
  appendNumber(number) {
    if (number === '.' && this.currentOperand.includes('.')) return;
    if (this.currentOperand === '0' && number !== '.') {
      this.currentOperand = number.toString();
    } else {
      this.currentOperand = this.currentOperand.toString() + number.toString();
    }
    this.updateDisplay();
  }
  chooseOperation(operation) {
    if (
      (this.currentOperand === '0' && this.previousOperand === '') ||
      this.currentOperand === 'Error'
    )
      return;
    if (this.previousOperand !== '') {
      this.compute();
    }
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = '0';
    this.updateDisplay();
  }
  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    if (isNaN(prev) || isNaN(current)) return;
    switch (this.operation) {
      case '+':
        computation = prev + current;
        break;
      case '-':
        computation = prev - current;
        break;
      case '×':
        computation = prev * current;
        break;
      case '÷':
        if (current === 0) {
          this.currentOperand = 'Error';
          this.updateDisplay();
          return;
        }
        computation = prev / current;
        break;
      default:
        return;
    }
    this.currentOperand = computation;
    this.operation = undefined;
    this.previousOperand = '';
    this.updateDisplay();
  }
  getDisplayNumber(number) {
    if (number === 'Error') return number;
    const stringNumber = number.toString();
    const [integerPart, decimalPart] = stringNumber.split('.');
    const integerDisplay = isNaN(parseFloat(integerPart))
      ? ''
      : parseFloat(integerPart).toLocaleString('en', {
          maximumFractionDigits: 0,
        });
    return decimalPart != null
      ? `${integerDisplay}.${decimalPart}`
      : integerDisplay;
  }
  updateDisplay() {
    this.currentOperandTextElement.innerText = this.getDisplayNumber(
      this.currentOperand,
    );
    if (this.operation != null && this.previousOperand !== '') {
      this.previousOperandTextElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
    } else {
      this.previousOperandTextElement.innerText = '';
    }
  }
}
const numberButtons = document.querySelectorAll('[data-number]');
const operatorButtons = document.querySelectorAll('[data-operator]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const previousOperandTextElement = document.querySelector(
  '[data-previous-operand]',
);
const currentOperandTextElement = document.querySelector(
  '[data-current-operand]',
);
const calculator = new Calculator(
  previousOperandTextElement,
  currentOperandTextElement,
);
numberButtons.forEach((button) => {
  button.addEventListener('click', () => {
    calculator.appendNumber(button.innerText);
    animateButton(button);
  });
});
operatorButtons.forEach((button) => {
  button.addEventListener('click', () => {
    calculator.chooseOperation(button.innerText);
    animateButton(button);
  });
});
equalsButton.addEventListener('click', () => {
  calculator.compute();
  animateButton(equalsButton);
});
allClearButton.addEventListener('click', () => {
  calculator.clear();
  animateButton(allClearButton);
});
deleteButton.addEventListener('click', () => {
  calculator.delete();
  animateButton(deleteButton);
});
function animateButton(btn) {
  btn.classList.add('animate-btn');
  setTimeout(() => btn.classList.remove('animate-btn'), 140);
}
window.addEventListener('keydown', function (event) {
  let key = event.key;
  if ((key >= 0 && key <= 9) || key === '.') {
    calculator.appendNumber(key);
  } else if (key === 'Enter' || key === '=') {
    calculator.compute();
  } else if (key === 'Backspace') {
    calculator.delete();
  } else if (key === 'Escape') {
    calculator.clear();
  } else if (['+', '-', '*', '/'].includes(key)) {
    let op = key === '*' ? '×' : key === '/' ? '÷' : key;
    calculator.chooseOperation(op);
  }
});

// --- Converter Categories Config ---
const converters = [
  {
    key: 'length',
    input: 'length-input',
    select: 'length-unit',
    results: 'length-results',
    factors: {
      mm: 0.001,
      cm: 0.01,
      m: 1,
      km: 1000,
      in: 0.0254,
      ft: 0.3048,
      yd: 0.9144,
      mi: 1609.344,
      nmi: 1852,
      um: 1e-6,
      nm: 1e-9,
    },
    labels: {
      mm: 'Millimeter (mm)',
      cm: 'Centimeter (cm)',
      m: 'Meter (m)',
      km: 'Kilometer (km)',
      in: 'Inch (in)',
      ft: 'Foot (ft)',
      yd: 'Yard (yd)',
      mi: 'Mile (mi)',
      nmi: 'Nautical mile',
      um: 'Micrometer (µm)',
      nm: 'Nanometer (nm)',
    },
    toBase: (v) => v, // value is always multiplied by factor to get meters
    fromBase: (val, factor) => val / factor,
  },
  {
    key: 'weight',
    input: 'weight-input',
    select: 'weight-unit',
    results: 'weight-results',
    factors: {
      mg: 1e-6,
      g: 1e-3,
      kg: 1,
      t: 1000,
      oz: 0.0283495231,
      lb: 0.45359237,
      st: 6.35029318,
      ston_us: 907.18474,
      ston_uk: 1016.0469088,
      ct: 0.0002,
      grain: 0.0000647989,
    },
    labels: {
      mg: 'Milligram (mg)',
      g: 'Gram (g)',
      kg: 'Kilogram (kg)',
      t: 'Metric ton (t)',
      oz: 'Ounce (oz)',
      lb: 'Pound (lb)',
      st: 'Stone (UK)',
      ston_us: 'Short ton (US)',
      ston_uk: 'Long ton (UK)',
      ct: 'Carat (ct)',
      grain: 'Grain',
    },
    toBase: (v) => v, // value is always multiplied by factor to get kg
    fromBase: (val, factor) => val / factor,
  },
  {
    key: 'volume',
    input: 'volume-input',
    select: 'volume-unit',
    results: 'volume-results',
    factors: {
      ml: 0.001,
      l: 1,
      tsp: 0.00492892159,
      tbsp: 0.0147867648,
      cup: 0.24,
      pt: 0.473176473,
      qt: 0.946352946,
      gal_us: 3.785411784,
      gal_uk: 4.54609,
      cm3: 0.001,
      m3: 1000,
      in3: 0.016387064,
      ft3: 28.3168466,
    },
    labels: {
      ml: 'Milliliter (ml)',
      l: 'Liter (L)',
      tsp: 'Teaspoon',
      tbsp: 'Tablespoon',
      cup: 'Cup',
      pt: 'Pint',
      qt: 'Quart',
      gal_us: 'Gallon (US)',
      gal_uk: 'Gallon (UK)',
      cm3: 'Cubic centimeter (cm³)',
      m3: 'Cubic meter (m³)',
      in3: 'Cubic inch',
      ft3: 'Cubic foot',
    },
    toBase: (v) => v, // value * factor = L
    fromBase: (val, factor) => val / factor,
  },
  {
    key: 'area',
    input: 'area-input',
    select: 'area-unit',
    results: 'area-results',
    factors: {
      mm2: 1e-6,
      cm2: 1e-4,
      m2: 1,
      km2: 1e6,
      in2: 0.00064516,
      ft2: 0.09290304,
      yd2: 0.83612736,
      acre: 4046.8564224,
      ha: 10000,
    },
    labels: {
      mm2: 'Square millimeter (mm²)',
      cm2: 'Square centimeter (cm²)',
      m2: 'Square meter (m²)',
      km2: 'Square kilometer (km²)',
      in2: 'Square inch',
      ft2: 'Square foot',
      yd2: 'Square yard',
      acre: 'Acre',
      ha: 'Hectare',
    },
    toBase: (v) => v,
    fromBase: (val, factor) => val / factor,
  },
  {
    key: 'temperature',
    input: 'temperature-input',
    select: 'temperature-unit',
    results: 'temperature-results',
    // Factors and labels not used for temperature
    factors: { C: 1, F: 1, K: 1, R: 1 },
    labels: {
      C: 'Celsius (°C)',
      F: 'Fahrenheit (°F)',
      K: 'Kelvin (K)',
      R: 'Rankine (°R)',
    },
    // Special conversion functions
    toBase: (value, unit) => {
      // always convert to celsius first
      if (unit === 'C') return value;
      if (unit === 'F') return ((value - 32) * 5) / 9;
      if (unit === 'K') return value - 273.15;
      if (unit === 'R') return ((value - 491.67) * 5) / 9;
      return value;
    },
    fromBase: (celsius, unit) => {
      if (unit === 'C') return celsius;
      if (unit === 'F') return (celsius * 9) / 5 + 32;
      if (unit === 'K') return celsius + 273.15;
      if (unit === 'R') return ((celsius + 273.15) * 9) / 5;
      return celsius;
    },
  },
  {
    key: 'time',
    input: 'time-input',
    select: 'time-unit',
    results: 'time-results',
    factors: {
      ms: 1 / 1000,
      s: 1,
      min: 60,
      h: 3600,
      d: 86400,
      week: 604800,
      mo: 2629800,
      y: 31557600,
      decade: 315576000,
      century: 3155760000,
    },
    labels: {
      ms: 'Millisecond',
      s: 'Second',
      min: 'Minute',
      h: 'Hour',
      d: 'Day',
      week: 'Week',
      mo: 'Month',
      y: 'Year',
      decade: 'Decade',
      century: 'Century',
    },
    toBase: (v) => v, // value * factor = seconds
    fromBase: (val, factor) => val / factor,
  },
  {
    key: 'speed',
    input: 'speed-input',
    select: 'speed-unit',
    results: 'speed-results',
    factors: {
      'm/s': 1,
      'km/h': 1 / 3.6,
      mph: 0.44704,
      knot: 0.514444,
      'ft/s': 0.3048,
      mach: 340.29,
    },
    labels: {
      'm/s': 'Meters per second (m/s)',
      'km/h': 'Kilometers per hour (km/h)',
      mph: 'Miles per hour (mph)',
      knot: 'Knot (nautical mile/hr)',
      'ft/s': 'Feet per second (ft/s)',
      mach: 'Mach (speed of sound)',
    },
    toBase: (v) => v, // value * factor = m/s
    fromBase: (val, factor) => val / factor,
  },
  {
    key: 'pressure',
    input: 'pressure-input',
    select: 'pressure-unit',
    results: 'pressure-results',
    factors: {
      Pa: 1,
      kPa: 1000,
      bar: 100000,
      atm: 101325,
      psi: 6894.757,
      torr: 133.322,
      mmH2O: 9.80665,
      inHg: 3386.39,
    },
    labels: {
      Pa: 'Pascal (Pa)',
      kPa: 'Kilopascal (kPa)',
      bar: 'Bar',
      atm: 'Atmosphere (atm)',
      psi: 'Pound per square inch (psi)',
      torr: 'Torr (mmHg)',
      mmH2O: 'mmH₂O',
      inHg: 'inHg',
    },
    toBase: (v) => v, // value * factor = Pa
    fromBase: (val, factor) => val / factor,
  },
  {
    key: 'energy',
    input: 'energy-input',
    select: 'energy-unit',
    results: 'energy-results',
    factors: {
      J: 1,
      kJ: 1000,
      cal: 4.184,
      kcal: 4184,
      Wh: 3600,
      kWh: 3600000,
      BTU: 1055.06,
      eV: 1.60218e-19,
    },
    labels: {
      J: 'Joule (J)',
      kJ: 'Kilojoule (kJ)',
      cal: 'Calorie (cal)',
      kcal: 'Kilocalorie (kcal)',
      Wh: 'Watt-hour (Wh)',
      kWh: 'Kilowatt-hour (kWh)',
      BTU: 'British thermal unit (BTU)',
      eV: 'Electronvolt (eV)',
    },
    toBase: (v) => v, // value * factor = J
    fromBase: (val, factor) => val / factor,
  },
  {
    key: 'power',
    input: 'power-input',
    select: 'power-unit',
    results: 'power-results',
    factors: {
      W: 1,
      kW: 1000,
      MW: 1e6,
      GW: 1e9,
      hp: 745.7,
      BTU_hr: 0.29307107,
    },
    labels: {
      W: 'Watt (W)',
      kW: 'Kilowatt (kW)',
      MW: 'Megawatt (MW)',
      GW: 'Gigawatt (GW)',
      hp: 'Horsepower (hp)',
      BTU_hr: 'BTU/hour',
    },
    toBase: (v) => v, // value * factor = W
    fromBase: (val, factor) => val / factor,
  },
  {
    key: 'angle',
    input: 'angle-input',
    select: 'angle-unit',
    results: 'angle-results',
    factors: {
      deg: 1,
      rad: 180 / Math.PI,
      gon: 0.9,
      arcmin: 1 / 60,
      arcsec: 1 / 3600,
    },
    labels: {
      deg: 'Degree (°)',
      rad: 'Radian (rad)',
      gon: 'Gradian (gon)',
      arcmin: 'Minute of arc',
      arcsec: 'Second of arc',
    },
    toBase: (v) => v, // value is always in degrees, multiply by factor to get degrees
    fromBase: (val, factor) => val / factor,
  },
  {
    key: 'data',
    input: 'data-input',
    select: 'data-unit',
    results: 'data-results',
    factors: {
      bit: 1,
      B: 8,
      KB: 8192,
      MB: 8388608,
      GB: 8589934592,
      TB: 8796093022208,
      PB: 9007199254740992,
      KiB: 8192,
      MiB: 8388608,
      GiB: 8589934592,
    },
    labels: {
      bit: 'Bit',
      B: 'Byte (B)',
      KB: 'Kilobyte (KB)',
      MB: 'Megabyte (MB)',
      GB: 'Gigabyte (GB)',
      TB: 'Terabyte (TB)',
      PB: 'Petabyte (PB)',
      KiB: 'Kibibyte (KiB)',
      MiB: 'Mebibyte (MiB)',
      GiB: 'Gibibyte (GiB)',
    },
    toBase: (v) => v, // value * factor = bits
    fromBase: (val, factor) => val / factor,
  },
  {
    key: 'currency',
    input: 'currency-input',
    select: 'currency-unit',
    results: 'currency-results',
    // For demo purposes, use static rates; in production, fetch live rates via API
    factors: {
      USD: 1,
      EUR: 0.94,
      GBP: 0.82,
      PKR: 278,
      INR: 83,
      JPY: 145,
      CNY: 7.3,
    },
    labels: {
      USD: 'USD',
      EUR: 'Euro (EUR)',
      GBP: 'Pound (GBP)',
      PKR: 'Pakistani Rupee (PKR)',
      INR: 'Indian Rupee (INR)',
      JPY: 'Japanese Yen (JPY)',
      CNY: 'Chinese Yuan (CNY)',
    },
    toBase: (v) => v, // value * factor = USD
    fromBase: (val, factor) => val * factor, // different from others (multiply, not divide)
  },
  {
    key: 'fuel',
    input: 'fuel-input',
    select: 'fuel-unit',
    results: 'fuel-results',
    factors: {
      L_100km: 1,
      mpg_us: 235.215,
      mpg_uk: 282.481,
      km_L: 100,
    },
    labels: {
      L_100km: 'Liters/100km',
      mpg_us: 'Miles/gallon (US)',
      mpg_uk: 'Miles/gallon (UK)',
      km_L: 'Kilometers/liter',
    },
    toBase: (v) => v,
    fromBase: (val, factor) => factor / val, // special: reciprocal relationship
  },
  {
    key: 'frequency',
    input: 'frequency-input',
    select: 'frequency-unit',
    results: 'frequency-results',
    factors: {
      Hz: 1,
      kHz: 1e3,
      MHz: 1e6,
      GHz: 1e9,
      THz: 1e12,
    },
    labels: {
      Hz: 'Hertz (Hz)',
      kHz: 'Kilohertz (kHz)',
      MHz: 'Megahertz (MHz)',
      GHz: 'Gigahertz (GHz)',
      THz: 'Terahertz (THz)',
    },
    toBase: (v) => v, // value * factor = Hz
    fromBase: (val, factor) => val / factor,
  },
];

// --- Converter Engine ---
converters.forEach((conv) => {
  const input = document.getElementById(conv.input);
  const select = document.getElementById(conv.select);
  const resultsDiv = document.getElementById(conv.results);

  if (!input || !select || !resultsDiv) return; // skip missing

  function updateResults() {
    const val = parseFloat(input.value) || 0;
    const unit = select.value;

    let base;
    if (conv.key === 'temperature') {
      base = conv.toBase(val, unit);
    } else if (conv.key === 'fuel') {
      // Fuel is reciprocal: always convert to L/100km as base
      if (unit === 'L_100km') base = val;
      else base = conv.factors[unit] / val;
    } else if (conv.key === 'currency') {
      // Always convert to USD as base
      base = val / conv.factors[unit];
    } else {
      base = val * conv.factors[unit];
    }

    let html = '<table>';
    for (const [key, factor] of Object.entries(conv.factors)) {
      let converted;
      if (conv.key === 'temperature') {
        converted = conv.fromBase(base, key);
      } else if (conv.key === 'fuel') {
        if (key === 'L_100km') converted = base;
        else converted = conv.fromBase(base, factor);
      } else if (conv.key === 'currency') {
        converted = conv.fromBase(base, factor);
      } else {
        converted = conv.fromBase(base, factor);
      }
      html += `<tr><td>${conv.labels[key]}</td><td><strong>${converted.toLocaleString(undefined, { maximumFractionDigits: 10 })}</strong></td></tr>`;
    }
    html += '</table>';
    resultsDiv.innerHTML = html;
  }
  input.addEventListener('input', updateResults);
  select.addEventListener('change', updateResults);
  updateResults();
});
