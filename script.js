// Basic math functions
function add(a, b) {
    return a + b
}

function subtract(a, b) {
    return a - b
}

function multiply(a, b) {
    return a * b
}

function divide(a, b) {
    return a / b
}


// Performs the selected operation
function operate(operator, firstNumber, secondNumber) {
    if (operator === "+") {
        return add(firstNumber, secondNumber)
    } else if (operator === "-") {
        return subtract(firstNumber, secondNumber)
    } else if (operator === "*") {
        return multiply(firstNumber, secondNumber)
    } else if (operator === "/") {
        return divide(firstNumber, secondNumber)
    }
}


// Calculator values
let firstNumber = null
let currentOperator = null
let secondNumber = null

let currentInput = "0"
let waitingForSecondNumber = false
let resultDisplayed = false


// Get calculator elements
const display = document.querySelector("#display")
const numberButtons = document.querySelectorAll(".number")
const operatorButtons = document.querySelectorAll(".operator")
const equalsButton = document.querySelector("#equals")
const clearButton = document.querySelector("#clear")
const decimalButton = document.querySelector("#decimal")
const backspaceButton = document.querySelector("#backspace")


// Shows the current number
function showCurrentInput() {
    display.textContent = currentInput
}


// Shows the current expression
function showExpression() {
    if (firstNumber !== null && currentOperator !== null) {
        if (waitingForSecondNumber) {
            display.textContent =
                firstNumber + " " + currentOperator
        } else {
            display.textContent =
                firstNumber + " " +
                currentOperator + " " +
                currentInput
        }
    } else {
        display.textContent = currentInput
    }
}


// Handles number input
function inputNumber(number) {

    // Start a new calculation after showing a result
    if (resultDisplayed) {
        clearCalculator()
    }

    // Start entering the second number
    if (waitingForSecondNumber) {
        currentInput = number
        waitingForSecondNumber = false
    } else {
        // Prevent unnecessary zeros
        if (currentInput === "0") {
            currentInput = number
        } else {
            currentInput += number
        }
    }

    showExpression()
}


// Handles decimal input
function inputDecimal() {

    // Start a new calculation after a result
    if (resultDisplayed) {
        clearCalculator()
    }

    // Start the second number with 0.
    if (waitingForSecondNumber) {
        currentInput = "0."
        waitingForSecondNumber = false
        showExpression()
        return
    }

    // Prevent more than one decimal point
    if (!currentInput.includes(".")) {
        currentInput += "."
    }

    showExpression()
}


// Handles operator input
function chooseOperator(operator) {
    const inputValue = Number(currentInput)

    // If operators are pressed consecutively,
    // use the most recent operator
    if (currentOperator !== null && waitingForSecondNumber) {
        currentOperator = operator
        showExpression()
        return
    }

    // Store the first number
    if (firstNumber === null) {
        firstNumber = inputValue
    } else if (currentOperator !== null) {

        // Store the second number
        secondNumber = inputValue

        // Calculate the previous operation
        const result = calculateResult()

        if (result === null) {
            return
        }

        firstNumber = result
        currentInput = String(result)
    }

    currentOperator = operator
    waitingForSecondNumber = true
    resultDisplayed = false

    showExpression()
}


// Calculates the current operation
function calculateResult() {

    // Only calculate when all values exist
    if (
        firstNumber === null ||
        currentOperator === null ||
        secondNumber === null
    ) {
        return null
    }

    // Prevent division by zero
    if (currentOperator === "/" && secondNumber === 0) {
        display.textContent = "Cannot divide by zero"

        firstNumber = null
        currentOperator = null
        secondNumber = null
        currentInput = "0"
        waitingForSecondNumber = false
        resultDisplayed = true

        return null
    }

    let result = operate(
        currentOperator,
        firstNumber,
        secondNumber
    )

    // Round long decimal answers
    result = Math.round(result * 100000000) / 100000000

    return result
}


// Handles the equals button
function calculate() {

    // Do nothing if the operation is incomplete
    if (
        firstNumber === null ||
        currentOperator === null ||
        waitingForSecondNumber
    ) {
        return
    }

    secondNumber = Number(currentInput)

    const result = calculateResult()

    if (result === null) {
        return
    }

    currentInput = String(result)

    // Show only the answer
    display.textContent = currentInput

    // Keep the result available for another operation
    firstNumber = result
    currentOperator = null
    secondNumber = null
    waitingForSecondNumber = false
    resultDisplayed = true
}


// Clears everything
function clearCalculator() {
    firstNumber = null
    currentOperator = null
    secondNumber = null

    currentInput = "0"
    waitingForSecondNumber = false
    resultDisplayed = false

    showCurrentInput()
}


// Removes the last digit
function backspace() {

    if (resultDisplayed || waitingForSecondNumber) {
        return
    }

    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1)
    } else {
        currentInput = "0"
    }

    showExpression()
}


// Number buttons
numberButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        inputNumber(button.textContent)
    })
})


// Operator buttons
operatorButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        chooseOperator(button.dataset.operator)
    })
})


// Equals button
equalsButton.addEventListener("click", function () {
    calculate()
})


// Clear button
clearButton.addEventListener("click", function () {
    clearCalculator()
})


// Decimal button
decimalButton.addEventListener("click", function () {
    inputDecimal()
})


// Backspace button
backspaceButton.addEventListener("click", function () {
    backspace()
})


// Keyboard support
document.addEventListener("keydown", function (event) {
    const key = event.key

    // Number keys
    if (key >= "0" && key <= "9") {
        inputNumber(key)
    }

    // Operator keys
    if (
        key === "+" ||
        key === "-" ||
        key === "*" ||
        key === "/"
    ) {
        chooseOperator(key)
    }

    // Decimal
    if (key === ".") {
        inputDecimal()
    }

    // Equals
    if (key === "Enter" || key === "=") {
        calculate()
    }

    // Backspace
    if (key === "Backspace") {
        backspace()
    }

    // Clear
    if (key === "Escape") {
        clearCalculator()
    }
})


// Show 0 when the calculator loads
showCurrentInput()