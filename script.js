const unlockButtons = document.querySelectorAll('.unlock-btn');
const masteryScore = document.getElementById('mastery-score');
const barsContainer = document.getElementById('bars');
const spreadInput = document.getElementById('spread');
const spreadDescription = document.getElementById('spread-description');
const quizForm = document.getElementById('quiz-form');
const quizResult = document.getElementById('quiz-result');
const lessonPages = document.querySelectorAll('[data-lesson]');
const lessonTabs = document.querySelectorAll('.lesson-tabs a');
const lessonLinks = document.querySelectorAll('a[href^="#lesson-"]');

const unlockedConcepts = new Set();
const defaultLessonId = 'lesson-wave-particle';

function updateMastery() {
  masteryScore.textContent = `${unlockedConcepts.size} / 5 concepts unlocked`;
}

unlockButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const concept = button.dataset.concept;
    unlockedConcepts.add(concept);
    button.textContent = `Unlocked: ${concept}`;
    button.classList.add('unlocked');
    button.setAttribute('aria-pressed', 'true');
    button.disabled = true;
    updateMastery();
  });
});

function renderDistribution(spreadValue) {
  barsContainer.innerHTML = '';
  const center = 5.5;
  const normalizedSpread = Math.max(1.2, spreadValue / 12);

  for (let index = 0; index < 12; index += 1) {
    const distance = Math.abs(index - center);
    const height = Math.max(12, 100 - distance * normalizedSpread * 10);
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.height = `${height}%`;
    bar.setAttribute('role', 'img');
    bar.setAttribute('aria-label', `Probability bar ${index + 1}, relative height ${Math.round(height)} percent`);
    barsContainer.appendChild(bar);
  }

  if (spreadValue < 30) {
    spreadDescription.textContent = 'Narrow spread: the state is concentrated, so measurements cluster tightly.';
  } else if (spreadValue < 60) {
    spreadDescription.textContent = 'Medium spread: outcomes cluster around the center but still vary.';
  } else {
    spreadDescription.textContent = 'Wide spread: the state is more spread out, so many outcomes become plausible.';
  }
}

function showLessonFromHash() {
  const hash = window.location.hash.replace('#', '');
  const activeLessonId = hash.startsWith('lesson-') ? hash : defaultLessonId;

  lessonPages.forEach((page) => {
    page.classList.toggle('active', page.id === activeLessonId);
  });

  lessonTabs.forEach((tab) => {
    const isActive = tab.getAttribute('href') === `#${activeLessonId}`;
    tab.classList.toggle('active-tab', isActive);
    tab.setAttribute('aria-current', isActive ? 'page' : 'false');
  });
}

spreadInput.addEventListener('input', (event) => {
  renderDistribution(Number(event.target.value));
});

quizForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = new FormData(quizForm);
  const answers = { q1: 'b', q2: 'b', q3: 'a' };

  let score = 0;
  Object.entries(answers).forEach(([question, answer]) => {
    if (form.get(question) === answer) score += 1;
  });

  if (score === 3) {
    quizResult.textContent = 'Perfect score. You are ready for the next layer of math and experiments.';
  } else if (score === 2) {
    quizResult.textContent = 'Nice work. Review the lesson pages once more and you will be in great shape.';
  } else {
    quizResult.textContent = 'Good start. Quantum ideas take repetition—reopen the lesson chain and try again.';
  }
});

lessonLinks.forEach((link) => {
  link.addEventListener('click', () => {
    requestAnimationFrame(showLessonFromHash);
  });
});

window.addEventListener('hashchange', showLessonFromHash);

renderDistribution(Number(spreadInput.value));
updateMastery();
showLessonFromHash();
