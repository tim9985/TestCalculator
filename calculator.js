// Calculator State
let currentInput = '0';
let expression = '';
let memory = 0;
let isRadianMode = false;
let lastResult = null;

// DOM Elements
const displayElement = document.getElementById('display');
const expressionElement = document.getElementById('expression');
const degBtn = document.getElementById('degBtn');
const radBtn = document.getElementById('radBtn');

// Update Display
function updateDisplay() {
    displayElement.textContent = currentInput;
    expressionElement.textContent = expression;
}

// Clear All
function clearAll() {
    currentInput = '0';
    expression = '';
    lastResult = null;
    updateDisplay();
}

// Delete Last Character
function deleteLast() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

// Input Number
function inputNumber(num) {
    if (currentInput === '0' || currentInput === 'Error' || lastResult !== null) {
        currentInput = num;
        lastResult = null;
    } else {
        currentInput += num;
    }
    updateDisplay();
}

// Input Decimal
function inputDecimal() {
    if (lastResult !== null) {
        currentInput = '0.';
        lastResult = null;
    } else if (!currentInput.includes('.')) {
        currentInput += '.';
    }
    updateDisplay();
}

// Input Operator
function inputOperator(op) {
    if (currentInput !== 'Error') {
        expression += currentInput + ' ' + getOperatorSymbol(op) + ' ';
        currentInput = '0';
        lastResult = null;
    }
    updateDisplay();
}

// Get Operator Symbol for Display
function getOperatorSymbol(op) {
    const symbols = {
        '+': '+',
        '-': '−',
        '*': '×',
        '/': '÷'
    };
    return symbols[op] || op;
}

// Input Parenthesis
function inputParenthesis(paren) {
    if (paren === '(') {
        if (currentInput === '0') {
            expression += '( ';
        } else {
            expression += currentInput + ' × ( ';
            currentInput = '0';
        }
    } else {
        expression += currentInput + ' ) ';
        currentInput = '0';
    }
    updateDisplay();
}

// Input Scientific Function
function inputFunction(func) {
    try {
        let value = parseFloat(currentInput);
        let result;

        switch (func) {
            case 'sin':
                result = isRadianMode ? Math.sin(value) : Math.sin(value * Math.PI / 180);
                break;
            case 'cos':
                result = isRadianMode ? Math.cos(value) : Math.cos(value * Math.PI / 180);
                break;
            case 'tan':
                result = isRadianMode ? Math.tan(value) : Math.tan(value * Math.PI / 180);
                break;
            case 'asin':
                result = Math.asin(value);
                if (!isRadianMode) result = result * 180 / Math.PI;
                break;
            case 'acos':
                result = Math.acos(value);
                if (!isRadianMode) result = result * 180 / Math.PI;
                break;
            case 'atan':
                result = Math.atan(value);
                if (!isRadianMode) result = result * 180 / Math.PI;
                break;
            case 'log':
                result = Math.log10(value);
                break;
            case 'ln':
                result = Math.log(value);
                break;
            case 'sqrt':
                result = Math.sqrt(value);
                break;
            default:
                result = value;
        }

        if (isNaN(result) || !isFinite(result)) {
            currentInput = 'Error';
        } else {
            currentInput = formatResult(result);
        }
        lastResult = currentInput;
        updateDisplay();
    } catch (e) {
        currentInput = 'Error';
        updateDisplay();
    }
}

// Input Power (x^y)
function inputPower() {
    expression += currentInput + ' ^ ';
    currentInput = '0';
    updateDisplay();
}

// Input Constants
function inputConstant(constant) {
    if (constant === 'pi') {
        currentInput = formatResult(Math.PI);
    } else if (constant === 'e') {
        currentInput = formatResult(Math.E);
    }
    lastResult = currentInput;
    updateDisplay();
}

// Input Factorial
function inputFactorial() {
    try {
        let value = parseInt(currentInput);
        if (value < 0 || value > 170) {
            currentInput = 'Error';
        } else {
            let result = factorial(value);
            currentInput = formatResult(result);
        }
        lastResult = currentInput;
        updateDisplay();
    } catch (e) {
        currentInput = 'Error';
        updateDisplay();
    }
}

// Factorial Helper
function factorial(n) {
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

// Input Percent
function inputPercent() {
    try {
        let value = parseFloat(currentInput);
        currentInput = formatResult(value / 100);
        lastResult = currentInput;
        updateDisplay();
    } catch (e) {
        currentInput = 'Error';
        updateDisplay();
    }
}

// Toggle Sign
function toggleSign() {
    if (currentInput !== '0' && currentInput !== 'Error') {
        if (currentInput.startsWith('-')) {
            currentInput = currentInput.substring(1);
        } else {
            currentInput = '-' + currentInput;
        }
        updateDisplay();
    }
}

// Calculate Result
function calculate() {
    try {
        let fullExpression = expression + currentInput;
        
        // Replace display symbols with actual operators
        fullExpression = fullExpression
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/−/g, '-')
            .replace(/\^/g, '**');
        
        // Remove extra spaces
        fullExpression = fullExpression.replace(/\s+/g, '');
        
        if (fullExpression === '') {
            return;
        }

        // Evaluate the expression
        // Using Function constructor for safer evaluation
        const result = Function('"use strict"; return (' + fullExpression + ')')();
        
        if (isNaN(result) || !isFinite(result)) {
            currentInput = 'Error';
        } else {
            expression = '';
            currentInput = formatResult(result);
            lastResult = currentInput;
        }
        updateDisplay();
    } catch (e) {
        currentInput = 'Error';
        expression = '';
        updateDisplay();
    }
}

// Format Result
function formatResult(num) {
    if (Number.isInteger(num) && Math.abs(num) < 1e15) {
        return num.toString();
    }
    
    // Handle very large or very small numbers
    if (Math.abs(num) >= 1e15 || (Math.abs(num) < 1e-10 && num !== 0)) {
        return num.toExponential(8);
    }
    
    // Round to avoid floating point errors
    let result = parseFloat(num.toPrecision(12));
    return result.toString();
}

// Set Degree Mode
function setDegreeMode() {
    isRadianMode = false;
    degBtn.classList.add('active');
    radBtn.classList.remove('active');
}

// Set Radian Mode
function setRadianMode() {
    isRadianMode = true;
    radBtn.classList.add('active');
    degBtn.classList.remove('active');
}

// Memory Functions
function memoryClear() {
    memory = 0;
}

function memoryRecall() {
    currentInput = formatResult(memory);
    lastResult = currentInput;
    updateDisplay();
}

function memoryAdd() {
    memory += parseFloat(currentInput) || 0;
}

function memorySubtract() {
    memory -= parseFloat(currentInput) || 0;
}

function memoryStore() {
    memory = parseFloat(currentInput) || 0;
}

// Keyboard Support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if (key >= '0' && key <= '9') {
        inputNumber(key);
    } else if (key === '.') {
        inputDecimal();
    } else if (key === '+') {
        inputOperator('+');
    } else if (key === '-') {
        inputOperator('-');
    } else if (key === '*') {
        inputOperator('*');
    } else if (key === '/') {
        event.preventDefault();
        inputOperator('/');
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    } else if (key === 'Escape') {
        clearAll();
    } else if (key === 'Backspace') {
        deleteLast();
    } else if (key === '(') {
        inputParenthesis('(');
    } else if (key === ')') {
        inputParenthesis(')');
    }
});

// Initialize
updateDisplay();
