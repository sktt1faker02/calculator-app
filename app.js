// Theme Selector
const toggleSections = document.querySelectorAll(".toggle__section");
const toggleSwitch = document.querySelector("#toggle-switch");
const root = document.documentElement;
let themeNumber;

const toggleSwitchPick = function (pickedTheme) {
  if (pickedTheme === "1") toggleSwitch.classList.add("left");
  if (pickedTheme === "2") toggleSwitch.classList.add("center");
  if (pickedTheme === "3") toggleSwitch.classList.add("right");
};

toggleSections.forEach((theme) => {
  theme.addEventListener("click", (e) => {
    themeNumber = e.target.getAttribute("data-section");
    toggleSwitch.classList.remove("left", "center", "right");

    toggleSwitchPick(themeNumber);

    root.setAttribute("data-theme", themeNumber);

    localStorage.setItem("selectedTheme", themeNumber);
  });
});

const prefferedTheme = function () {
  root.setAttribute("data-theme", localStorage.selectedTheme);
  toggleSwitchPick(localStorage.selectedTheme);
};

prefferedTheme();
// End of Theme Function

const numberButtons = document.querySelectorAll("[data-number]");
const operationButtons = document.querySelectorAll("[data-operation]");
const equalsButton = document.querySelector("[data-equals]");
const deleteButton = document.querySelector("[data-delete]");
const resetButton = document.querySelector("[data-reset]");
const operatorEl = document.getElementById("operator");
const previousOperandEl = document.querySelector("[data-previous-operand]");
const currentOperandEl = document.querySelector("[data-current-operand]");

class Calculator {
  constructor(previousOperandEl, operatorEl, currentOperandEl) {
    this.previousOperandEl = previousOperandEl;
    this.operatorEl = operatorEl;
    this.currentOperandEl = currentOperandEl;
    this.reset();
  }

  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
  }

  reset() {
    this.currentOperand = "";
    this.previousOperand = "";
    this.operation = undefined;
  }

  appendNumber(number) {
    if (number === "." && this.currentOperand.includes(".")) return;

    this.currentOperand = this.currentOperand.toString() + number.toString();
  }

  chooseOperation(operation) {
    if (this.currentOperand === "") return;
    if (this.previousOperand !== "") {
      this.compute();
    }
    this.operation = operation;

    this.previousOperand = this.currentOperand;
    this.currentOperand = "";
  }

  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    if (isNaN(prev) || isNaN(current)) return;
    switch (this.operation) {
      case "+":
        computation = prev + current;
        break;

      case "-":
        computation = prev - current;
        break;

      case "x":
        computation = prev * current;
        break;

      case "/":
        computation = prev / current;
        break;

      default:
        return;
    }

    this.currentOperand =
      computation % 1 !== 0 ? computation.toFixed(2) : computation;

    // console.log(typeof this.currentOperand);
    this.operation = undefined;
    this.previousOperand = "";
  }

  getDisplayNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split(".")[0]);
    const decimalDigits = stringNumber.split(".")[1];
    let integerDisplay;
    if (isNaN(integerDigits)) {
      integerDisplay = "";
    } else {
      integerDisplay = integerDigits.toLocaleString("en", {
        maximumFractionDigits: 0,
      });
    }
    if (decimalDigits !== undefined) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }

  updateDisplay() {
    this.currentOperandEl.textContent = this.getDisplayNumber(
      this.currentOperand
    );

    if (this.operation !== undefined) {
      this.previousOperandEl.textContent = `${this.getDisplayNumber(
        this.previousOperand
      )} ${this.operation}`;
    } else {
      this.previousOperandEl.textContent = "";
      this.operatorEl.textContent = "";
    }
  }
}

const calculator = new Calculator(
  previousOperandEl,
  operatorEl,
  currentOperandEl
);

numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.appendNumber(button.textContent);
    calculator.updateDisplay();
  });
});

operationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.chooseOperation(button.textContent);
    calculator.updateDisplay();
  });
});

equalsButton.addEventListener("click", () => {
  calculator.compute();
  calculator.updateDisplay();
});

resetButton.addEventListener("click", () => {
  calculator.reset();
  calculator.updateDisplay();
});

deleteButton.addEventListener("click", () => {
  calculator.delete();
  calculator.updateDisplay();
});
