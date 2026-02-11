<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Training Modules</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>Training Modules</h1>
    </header>
    <section class="features">
        <!-- cards will be inserted here -->
    </section>
</body>
</html>
/* =============================
   ADMIN TOGGLE (if present)
   ============================= */
const adminBtn = document.getElementById('adminBtn');
const adminArea = document.getElementById('adminArea');

if(adminBtn && adminArea){
  adminBtn.addEventListener('click', () => {
    adminArea.style.display = adminArea.style.display === 'none' ? 'block' : 'none';
  });
}

/* =============================
   CARD MANAGEMENT (LOCAL STORAGE)
   ============================= */
const container = document.querySelector('.features');
const STORAGE_KEY = 'training_cards';

function saveCards(){
  if(!container) return;
  const cards = [];
  container.querySelectorAll('.card').forEach(card => {
    const title = card.querySelector('h3')?.innerText || '';
    const text = card.querySelector('p')?.innerText || '';
    cards.push({title, text});
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}

function loadCards(){
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  data.forEach(c => createCard(c.title, c.text, false));
}

function createCard(title, text, save=true){
  if(!container) return;

  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <span>📌</span>
    <h3>${title}</h3>
    <p>${text}</p>
  `;
  container.appendChild(card);

  if(save) saveCards();
}

/* =============================
   ADD CARD FROM INPUTS
   ============================= */
window.addCard = function(){
  const titleInput = document.getElementById('titleInput');
  const textInput = document.getElementById('textInput');

  if(!titleInput || !textInput) return;

  const title = titleInput.value.trim();
  const text = textInput.value.trim();

  if(!title || !text) return;

  createCard(title, text);

  titleInput.value = '';
  textInput.value = '';
};

/* =============================
   MODULE MANAGEMENT (ADMIN SYNC)
   ============================= */
const MODULE_KEY = 'training_modules';

function renderModules(){
  const container = document.getElementById('moduleList');
  if(!container) return;

  const data = JSON.parse(localStorage.getItem(MODULE_KEY) || '[]');
  container.innerHTML = '';

  data.forEach(m => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <span>📘</span>
      <h3>${m.title}</h3>
      <p>${m.desc}</p>
    `;
    container.appendChild(card);
  });
}

/* =============================
   INIT
   ============================= */
window.addEventListener('DOMContentLoaded', () => {
  loadCards();
  renderModules();
});