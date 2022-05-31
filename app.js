"use strict";

// default values
let finalValue = "";
let valueBuffer = "";
let operator = "";
let readyForOperator = false;
let produceResult = false;
let equationArray = [];
let readyForFraction = true;

// DOM elements
const buttonsContainer = document.querySelector(".input-buttons");
const numberBtns = buttonsContainer.querySelectorAll(".number");
const operatorBtns = buttonsContainer.querySelectorAll(".operator");
const dotBtn = buttonsContainer.querySelector(".dot");
const percentBtn = buttonsContainer.querySelector(".percent");
const clearBtn = buttonsContainer.querySelector(".clear");
const deleteBtn = buttonsContainer.querySelector(".delete");
const equalBtn = buttonsContainer.querySelector(".equal");
const negativeBtn = buttonsContainer.querySelector(".negative");
const equationDisplay = document.querySelector(".equation-display");
const answerDisplay = document.querySelector(".answer-display");

// calculate user's equation
function operate(operator, first, second) {
	if (operator === "+") {
		return +first + +second;
	} else if (operator === "-") {
		return +first - +second;
	} else if (operator === "x") {
		return +first * +second;
	} else if (operator === "/") {
		return +first / +second;
	}
}

// update equation and answer display with values in real time
function updateDisplay() {
	if (produceResult) {
		const equationString = equationArray.join("");
		answerDisplay.value = `${equationString}`;
		clearReset();
		produceResult = false;
	} else {
		const equationString = equationArray.join("");
		equationDisplay.value = `${equationString + valueBuffer}`;
	}
}

// clear all values to default
function clearValues() {
	finalValue = "";
	valueBuffer = "";
	operator = "";
	readyForOperator = false;
	produceResult = false;
	equationArray = [];
	readyForFraction = true;
}

// clear all displayed and/or stored values
function clearReset() {
	if (produceResult) {
		clearValues();
	} else {
		clearValues();
		updateDisplay();
		answerDisplay.value = ``;
	}
}

// delete an item from the equation
function deleteItem() {
	if (valueBuffer) {
		valueBuffer == "." ? (readyForFraction = true) : (readyForFraction = false);
		valueBuffer = valueBuffer.slice(0, -1);
		updateDisplay();
	} else if (equationArray.length % 2 == 0 && equationArray.length > 0) {
		console.log("yes");
		equationArray = equationArray.slice(0, -1);
		readyForOperator = true;
		console.log(equationArray);
		updateDisplay();
	} else {
		valueBuffer = equationArray[equationArray.length - 1];
		equationArray = equationArray.slice(0, -1);
		valueBuffer = valueBuffer.slice(0, -1);
		console.log(equationArray);
		updateDisplay();
	}
}

// get user numbers
function getNumbers(numberBtn) {
	{
		numberBtn.addEventListener("click", () => {
			answerDisplay.value = ``;
			valueBuffer += numberBtn.textContent;
			readyForOperator = true;
			updateDisplay();
		});
	}
}

// get operator from user and push into array
function getOperator(operatorBtn) {
	operatorBtn.addEventListener("click", () => {
		if (readyForOperator) {
			readyForFraction = true;
			if (valueBuffer) {
				if (valueBuffer.slice(-1) == ".") {
					valueBuffer = valueBuffer.slice(0, -1);
				}
				operator = operatorBtn.textContent;
				equationArray.push(valueBuffer, operator);
				valueBuffer = "";
				readyForOperator = false;
				updateDisplay();
			} else {
				operator = operatorBtn.textContent;
				equationArray.push(operator);
				readyForOperator = false;
				updateDisplay();
			}
		} else {
			return;
		}
	});
}

// start calculating user's equation and display it then reset all stored values
function calculateEquation() {
	equationArray.push(valueBuffer);
	valueBuffer = "";
	readyForOperator = false;
	updateDisplay();
	for (let i = 0; i < equationArray.length; i++) {
		if (equationArray.length == 1) {
			produceResult = true;
			updateDisplay();
		} else {
			i -= 1;
			finalValue = operate(
				equationArray[1],
				equationArray[0],
				equationArray[2]
			).toString();
			equationArray.splice(0, 3, finalValue);
		}
	}
}

// negative switch for user's number
function makeNegative() {
	if (readyForOperator) {
		valueBuffer = +valueBuffer - (+valueBuffer * 2).toString();
		updateDisplay();
	} else {
		if (valueBuffer === "-") {
			valueBuffer = "";
			updateDisplay();
		} else {
			valueBuffer = "-";
			updateDisplay();
		}
	}
}

// clear
clearBtn.addEventListener("click", clearReset);

// delete
deleteBtn.addEventListener("click", deleteItem);

// numbers
numberBtns.forEach((numberBtn) => getNumbers(numberBtn));

// operators
operatorBtns.forEach((operatorBtn) => {
	getOperator(operatorBtn);
});

// calculate / equal
equalBtn.addEventListener("click", calculateEquation);

// negative
negativeBtn.addEventListener("click", makeNegative);

// add a decimal dot to the input
dotBtn.addEventListener("click", () => {
	if (readyForFraction) {
		valueBuffer += dotBtn.textContent;
		updateDisplay();
		readyForFraction = false;
	}
});

// calculate percentage
percentBtn.addEventListener("click", () => {
	valueBuffer /= 100;
	updateDisplay();
});
