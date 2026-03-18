const masteryScore = document.getElementById('mastery-score');
const unlockButtons = document.querySelectorAll('.unlock-btn');
const storageKey = 'qubit-quest-unlocked-concepts';

function getUnlockedConcepts() {
  try {
    return new Set(JSON.parse(window.localStorage.getItem(storageKey) || '[]'));
  } catch {
    return new Set();
  }
}

function saveUnlockedConcepts(concepts) {
  window.localStorage.setItem(storageKey, JSON.stringify([...concepts]));
}

function updateMastery() {
  if (!masteryScore) return;
  const concepts = getUnlockedConcepts();
  masteryScore.textContent = `${concepts.size} / 5 concepts unlocked`;
}

function updateUnlockButtons() {
  const concepts = getUnlockedConcepts();

  unlockButtons.forEach((button) => {
    const concept = button.dataset.concept;
    const isUnlocked = concepts.has(concept);

    if (isUnlocked) {
      button.textContent = `Unlocked: ${concept}`;
      button.classList.add('unlocked');
      button.disabled = true;
      button.setAttribute('aria-pressed', 'true');
    }

    button.addEventListener('click', () => {
      concepts.add(concept);
      saveUnlockedConcepts(concepts);
      button.textContent = `Unlocked: ${concept}`;
      button.classList.add('unlocked');
      button.disabled = true;
      button.setAttribute('aria-pressed', 'true');
      updateMastery();
    });
  });
}

updateMastery();
updateUnlockButtons();
