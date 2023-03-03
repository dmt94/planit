
let successMessage = document.getElementById('success-message-all-data');
let submitAllClearBtn = document.getElementById('submit-all-clear');
let colorChoiceEl = document.getElementById('color-choice');
let colorChoiceBtn = document.getElementById('color-choice-btn');
let bodyEl = document.getElementById('main-body');
// const DEFAULT_COLOR = `#2e3dA7'
let bgColorChoice;

if (bgColorChoice === undefined) {
  bgColorChoice = localStorage.getItem('color');
  changeBgColor(bgColorChoice);
}
if (submitAllClearBtn) {  
  submitAllClearBtn.addEventListener("click", (e) => {
    successMessage.style.visibility = "visible";
  })
}
function changeBgColor(colorChoice) {
  bodyEl.style.background = `radial-gradient(circle, ${colorChoice} 0%, rgb(23, 9, 36) 100%)`;
}

if (colorChoiceEl) {
  let color;
  colorChoiceEl.addEventListener("change", (e) => {
    color = e.target.value;
    bodyEl.style.background = `radial-gradient(circle, ${color} 0%, rgb(23, 9, 36) 100%)`;
  })
  colorChoiceBtn.addEventListener("click", (e) => {
    e.preventDefault();
    bgColorChoice = color;
    localStorage.setItem('color', bgColorChoice);
    changeBgColor(bgColorChoice);
  })
}
