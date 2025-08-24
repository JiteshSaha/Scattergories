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

const alphabet = 'ABCDEFGHIJKLMNOPRSTUW'.split('');

const fullDataset = {
  general: [
    "Fruits", "Countries", "Movies", "Animals", "Cities", "Brands", "Sports", "TV Shows", "Foods", "Inventions",
    "Colors", "Song", "Books", "Historical Figures", "Cartoons", "Companies",
    "Famous Landmarks", "Celebrities", "Activities", "Languages", "Cars", "Tree", "Desserts",
    "Countries in Europe", "Ice Cream Flavors", "Scientists", "Board Games", "Superheroes", "Shapes",
    "Toys", "Comedies", "Rivers", "Musical Instruments", "Occupations", "Countries in Asia", "Famous Artists",
    "Famous Authors", "Food Ingredients", "Fast Food Chains", "Historical Events",
    "Gems and Stones", "Paintings", "Dance Styles", "Colleague", "Athlete", "Vegetables", "Place", "Reasons to leave job",
    "Excuses to skip a trip", "Subject in school", "Childhood dream", "Reason to leave country",
    "Reason to throw party",
    "Worst gift ever", 
    "Things to collect", 
    "Excuses for being late", 
    "Things you shouldn't text your boss", 
    "Pets", 
    "Things to put on pizza", 
    "Worst places to get stuck", 
    "Things you'd say in office", 
    "Useless superpowers", 
    "Things that could ruin a date", 
    "Weird things to say at a wedding", 
    "Things you shouldn't say to your in-laws",
    "Things That Are Cold",
    "Nicknames",
    "Items You Save Up to Buy",
    "Things You Replace",
    "Ways to Kill Time",
    "Reasons to Take Out a Loan",
    "Bad Habits",
    "Math Terms",
    "Things to Do on a Date",
    "Things You Shouldn't Touch",
    "Items in a Refrigerator",
    "Methods of Transportation",
    "Software","4-Letter Words", "3-Letter Words",
    




  ],
  indian: [
    "Bollywood Movies", "Indian States/cities", "Indian Festivals", "Famous Indian Leaders", "Indian Cuisines", "Indian Monuments", "Famous Indian Musicians", "Indian Religious spot",
    "Indian Mythological Figures", "Indian Languages", "Indian Song",
    "Indian Actors", "Indian Actresses", "Indian Historical Figures",
    "Indian Street Foods", "Indian Holidays", "Indian Heroes from History",
    "Popular Indian Music Instruments", "Indian Spices", "Indian Athlete", "Indian Dance Forms",
    "Indian Scientists and Innovators", "Indian Games", "Famous Indian Startups"
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
    // timetext.style.transform = "scale(1.3)"
    timetext.style.transform = null;
    letter.style.transform = "scale(1)";
    
  } else {
    // button shows play
    playBtn.style.display = 'flex';
    pauseBtn.style.display = 'none';
    letter.style.transform = "scale(0.9)"
    timetext.style.transform = "scale(0.8)"
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

    topicDiv.addEventListener('mouseover', function () {
      if (!isRunning) return;
      this.style.backgroundColor = "rgb(165, 239, 198)";
    });
    
    topicDiv.addEventListener('mouseout', function () {
      if (!isRunning) return;
      this.style.backgroundColor = ""; // or original color
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
