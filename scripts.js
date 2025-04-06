let countdownInterval;
let defaultTime = 60;
let timeRemaining = defaultTime;
let isRunning = false;
let customTopics = [];
let numTopicsToGenerate = 10;
let includeIndianTopics = true;

const playBtn = document.getElementById('play-btn');
const pauseBtn = document.getElementById('pause-btn');
const stopwatchDisplay = document.getElementById('stopwatch');
const timetext = document.getElementById("time-text");
const btns = document.getElementsByClassName('btns')[0]
const letter = document.getElementById('letter');
const topdiv = document.querySelector('.top-div');
const leftDiv = document.querySelector('.left-div');

const container = document.getElementById('topic-container');
const optionsBtn = document.getElementById('options');
const settingsMenu = document.getElementById('settings-menu');
const closeSettings = document.getElementById('close-settings');

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const fullDataset = {
  general: [
    "Fruits", "Countries", "Movies", "Animals", "Cities", "Brands", "Sports", "TV Shows", "Foods", "Inventions",
    "Colors", "Music Genres", "Books", "Historical Figures", "Cartoons", "Planets", "Technology Brands",
    "Famous Landmarks", "Celebrities", "Activities", "Languages", "Cars", "Types of Trees", "Desserts",
    "Countries in Europe", "Ice Cream Flavors", "Famous Scientists", "Board Games", "Superheroes", "Shapes",
    "Toys", "Comedies", "Rivers", "Musical Instruments", "Occupations", "Countries in Asia", "Famous Artists",
    "Famous Authors", "Books by Genre", "Buildings", "Seasons", "Types of Weather",
    "Food Ingredients", "Circus Animals", "Tropical Fruits", "Fast Food Chains", "Historical Events",
    "Famous Wars", "Gems and Stones", "Paintings", "Dance Styles"
  ],
  indian: [
    "Bollywood Movies", "Indian States", "Indian Cities", "Indian Festivals", "Famous Indian Leaders", "Indian Rivers",
    "Indian Cuisines", "Indian Monuments", "Famous Indian Musicians", "Traditional Indian Clothing", "Indian Temples",
    "Indian Animals", "Indian Sports", "Indian Mythological Figures", "Indian Languages", "Indian Song", "Indian TV Shows",
    "Famous Indian Artists", "Bollywood Actors", "Bollywood Actresses", "Indian Historical Figures", "Famous Indian Scientists",
    "Indian Street Foods", "Indian Holidays", "Famous Indian Monuments", "Indian Beauty Brands", "Indian Heroes from History",
    "Popular Indian Music Instruments", "Indian Religions", "Indian Cuisine Spices", "Indian Cricketers", "Indian Dance Forms",
    "Indian Scientists and Innovators", "Indian Games", "Traditional Indian Jewelry", "Famous Indian Startups", "Indian Authors"
  ]
};

let dataset = { ...fullDataset }; // live dataset copy

document.addEventListener('DOMContentLoaded', resetBoard);


const localToggle = document.getElementById('local-toggle');
localToggle.addEventListener('change', () => {
  includeIndianTopics = localToggle.checked;
});

function get_dataset() {
  // Clone fullDataset to avoid modifying original
  const copy = { ...fullDataset };
  if (!includeIndianTopics) {
    delete copy.indian; // Remove "indian" key if not included
  }
  return copy;
}



function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `00:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function showGameOver() {
  document.getElementById("game-over-window").classList.remove("display-false");
  document.getElementById("final-scorecard").textContent = getScoreNum();
  document.getElementById("game-over-window").style.display = "flex";
}

function togglePlayPauseButtons() {
  if (isRunning) {
    // button shows 'pause'
    playBtn.style.display = 'none';
    pauseBtn.style.display = 'flex';
    timetext.style.transform = "scale(1.3)"
    
  } else {
    playBtn.style.display = 'flex';
    pauseBtn.style.display = 'none';
    timetext.style.transform = null;

  }
}

function startCountdown() {
  if (!isRunning) {
    isRunning = true;
    countdownInterval = setInterval(() => {
      timeRemaining--;
      timetext.innerHTML = formatTime(timeRemaining);
      if (timeRemaining <= 0) {
        clearInterval(countdownInterval);
        isRunning = false;
        showGameOver();
        togglePlayPauseButtons();
      }
    }, 1000);
    togglePlayPauseButtons();
  }
}

function pauseCountdown() {
  clearInterval(countdownInterval);
  isRunning = false;
  togglePlayPauseButtons();
}

function resetCountdown() {
  clearInterval(countdownInterval);
  isRunning = false;
  timeRemaining = defaultTime;
  timetext.innerHTML = formatTime(timeRemaining);
  togglePlayPauseButtons();
}

function getRandomLetter() {
  return alphabet[Math.floor(Math.random() * alphabet.length)];
}

function getRandomCategory(count) {
  const dataset = get_dataset();

  // Merge all topic arrays from the dataset into one big array
  const allCategories = [
    ...Object.values(dataset).flat(),
    ...(customTopics || [])
  ].map(cat => cat.trim()).filter(cat => cat.length > 0);

  const uniqueCategories = [...new Set(allCategories)];
  for (let i = uniqueCategories.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [uniqueCategories[i], uniqueCategories[j]] = [uniqueCategories[j], uniqueCategories[i]];
  }
  return uniqueCategories.slice(0, count);
}

function generateTopics() {
  container.innerHTML = '';
  const topics = getRandomCategory(numTopicsToGenerate);
  for (let i = 0; i < numTopicsToGenerate; i++) {
    const topicDiv = document.createElement('div');
    topicDiv.classList.add('topic');
    const opaqueDiv = document.createElement('div');
    opaqueDiv.classList.add('opaque', "enlarge-on-hover");
    opaqueDiv.textContent = `${i + 1}. ${topics[i] || 'Topic'}`;
    topicDiv.appendChild(opaqueDiv);
    container.appendChild(topicDiv);
    topicDiv.addEventListener('click', function () {
      if (!isRunning) return;
      this.classList.toggle("activated");
      document.getElementById("scorecard").textContent = getScoreNum();
    });
  }
}

function getScoreNum() {
  return document.querySelectorAll(".topic.activated").length;
}

function resetBoard() {
  document.getElementById("game-over-window").classList.add("display-false");
  generateTopics();
  letter.innerHTML = getRandomLetter();
  document.getElementById("scorecard").textContent = getScoreNum();
  resetCountdown();
}

function toggleCountdown() {
  if (isRunning) {
    pauseCountdown();
    document.querySelectorAll('.opaque').forEach(el => el.style.backgroundColor = 'black');
  } else {
    startCountdown();
    document.querySelectorAll('.opaque').forEach(el => el.style.backgroundColor = 'transparent');
  }
}

topdiv.addEventListener('click', resetBoard);
leftDiv.addEventListener('click', toggleCountdown);
document.getElementById('generate-btn').addEventListener('click', generateTopics);
document.getElementById("restart-final-btn").addEventListener("click", () => {
  document.getElementById("game-over-window").style.display = "none";
  resetBoard();
});

optionsBtn.addEventListener('click', () => {
  settingsMenu.classList.add('open');
});

closeSettings.addEventListener('click', () => {
  settingsMenu.classList.remove('open');
  defaultTime = parseInt(document.getElementById('time-input').value);
  timeRemaining = defaultTime;
  timetext.innerHTML = formatTime(timeRemaining);
  numTopicsToGenerate = parseInt(document.getElementById('topics-input').value);
  const rawTopics = document.getElementById('custom-topics').value;
  customTopics = rawTopics.split(/[\n,]+/).map(t => t.trim()).filter(t => t.length > 0);
  resetBoard();
});

// Toggle for Indian topics
document.getElementById("local-toggle").addEventListener("change", (e) => {
  if (e.target.checked) {
    dataset.indian = [...fullDataset.indian];
  } else {
    delete dataset.indian;
  }
  resetBoard();
});
